from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import require_admin, require_roles
from app.core.database import get_db
from app.models.event import Event, Venue
from app.models.resource import Resource
from app.models.notification import Notification
from app.models.user import UserRole, User
from optimization.optimizer import (
    run_event_optimization,
    run_event_reallocation,
    run_equipment_failure_recovery,
)

router = APIRouter(prefix="/optimization", tags=["optimization"])



class OptimizationRequest(BaseModel):
    event_id: int = Field(..., description="ID of the event to optimize in PostgreSQL database", example=1)


class ReallocationRequest(BaseModel):
    event_id: int = Field(..., description="ID of the event to reallocate", example=1)
    new_predicted_attendance: int = Field(..., description="Revised predicted attendance demand", example=350)


class ApplyReallocationRequest(BaseModel):
    event_id: int = Field(..., description="ID of the event", example=1)
    new_predicted_attendance: int = Field(..., description="Revised predicted attendance demand", example=350)
    selected_venue_name: Optional[str] = Field(None, description="Name of venue if reassigned")


class EquipmentFailureRequest(BaseModel):
    event_id: int = Field(..., description="ID of the event", example=1)
    resource_id: int = Field(..., description="ID of the failed equipment/resource", example=3)
    failure_type: Optional[str] = Field("PROJECTOR_FAILURE", description="Type of equipment failure", example="PROJECTOR_FAILURE")


class EquipmentRecoveryPreviewRequest(BaseModel):
    event_id: int = Field(..., description="ID of the event", example=1)
    resource_id: int = Field(..., description="ID of the failed equipment/resource", example=3)


class ApplyEquipmentRecoveryRequest(BaseModel):
    event_id: int = Field(..., description="ID of the event", example=1)
    failed_resource_id: int = Field(..., description="ID of the failed resource", example=3)
    replacement_resource_id: Optional[int] = Field(None, description="ID of replacement resource if available", example=5)


@router.post("/plan", status_code=status.HTTP_200_OK)
def get_optimization_plan(
    payload: OptimizationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.LOGISTICS]))
) -> Dict[str, Any]:
    """
    Triggers the EventIQ Intelligent Logistics Optimization pipeline:
    1. Loads event, venue, and resource data from PostgreSQL.
    2. Executes LightGBM model to predict turnout attendance.
    3. Runs Google OR-Tools Transport, Equipment, and Venue solvers.
    4. Returns optimized logistics recommendations.
    """
    try:
        result = run_event_optimization(db, payload.event_id)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Optimization failed: {str(e)}"
        )


@router.post("/reallocate", status_code=status.HTTP_200_OK)
def get_reallocation_plan(
    payload: ReallocationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Dict[str, Any]:
    """
    Executes real Dynamic Resource Reallocation:
    1. Loads event from PostgreSQL.
    2. Recalculates logistics demands for new_predicted_attendance.
    3. Re-runs Google OR-Tools solvers.
    4. Computes structured change detection (BEFORE vs AFTER).
    5. Returns revised allocation and alerts.
    """
    try:
        from app.services.alert_service import evaluate_event_alerts, create_alert_if_not_exists
        event = db.query(Event).filter(Event.id == payload.event_id).first()
        if event:
            create_alert_if_not_exists(
                db=db,
                title=f"Reallocation Recommended: {event.title}",
                message=f"Event demand changed (Updated demand: {payload.new_predicted_attendance}). Updated allocation recommended.",
                alert_type="WARNING",
                event_id=event.id
            )
        result = run_event_reallocation(db, payload.event_id, payload.new_predicted_attendance)
        evaluate_event_alerts(db, payload.event_id)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Reallocation failed: {str(e)}"
        )


@router.post("/apply-reallocation", status_code=status.HTTP_200_OK)
def apply_reallocation(
    payload: ApplyReallocationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Dict[str, Any]:

    """
    Applies the revised logistics allocation to PostgreSQL database:
    1. Updates Event's expected_participants.
    2. Updates Venue if reassigned.
    3. Creates a Notification record in PostgreSQL.
    """
    try:
        event = db.query(Event).filter(Event.id == payload.event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail=f"Event with ID {payload.event_id} not found.")

        prev_participants = event.expected_participants or 0
        event.expected_participants = payload.new_predicted_attendance

        if payload.selected_venue_name:
            v = db.query(Venue).filter(Venue.name == payload.selected_venue_name, Venue.institution_id == event.institution_id).first()
            if v:
                event.venue_id = v.id

        notif_msg = f"⚠️ Event demand updated from {prev_participants} to {payload.new_predicted_attendance}. Revised logistics allocation applied."
        notif = Notification(
            title=f"Reallocation Applied: {event.title}",
            message=notif_msg,
            type="WARNING" if payload.new_predicted_attendance > prev_participants else "INFO",
            is_read=False,
            related_event_id=event.id
        )

        db.add(notif)
        db.commit()
        db.refresh(event)

        return {
            "success": True,
            "message": "Reallocation applied successfully to database.",
            "event_id": event.id,
            "new_predicted_attendance": event.expected_participants,
            "venue_id": event.venue_id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Applying reallocation failed: {str(e)}"
        )


@router.post("/equipment-failure", status_code=status.HTTP_200_OK)
def simulate_equipment_failure(
    payload: EquipmentFailureRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.LOGISTICS]))
) -> Dict[str, Any]:
    """
    Simulates equipment failure for an event:
    1. Validates event & resource exist in PostgreSQL.
    2. Calculates equipment shortage using LightGBM predicted_attendance.
    3. Searches available inventory for replacement resource.
    4. Re-runs Google OR-Tools Equipment solver.
    5. Returns BEFORE vs AFTER impact assessment.
    """
    try:
        from app.services.alert_service import create_alert_if_not_exists, evaluate_event_alerts
        res = db.query(Resource).filter(Resource.id == payload.resource_id).first()
        event = db.query(Event).filter(Event.id == payload.event_id).first()
        if res and event:
            res.status = "CRITICAL"
            db.commit()
            create_alert_if_not_exists(
                db=db,
                title=f"Critical Equipment Failure: {event.title}",
                message=f"Critical equipment failure detected for '{res.name}'. Recovery plan available.",
                alert_type="CRITICAL",
                event_id=event.id,
                resource_id=res.id
            )

        result = run_equipment_failure_recovery(
            db=db,
            event_id=payload.event_id,
            resource_id=payload.resource_id,
            failure_type=payload.failure_type or "PROJECTOR_FAILURE"
        )
        evaluate_event_alerts(db, payload.event_id)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Equipment failure simulation failed: {str(e)}"
        )


@router.post("/equipment-failure/recovery", status_code=status.HTTP_200_OK)
def get_equipment_failure_recovery(
    payload: EquipmentRecoveryPreviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.LOGISTICS]))
) -> Dict[str, Any]:
    """
    Retrieves the equipment failure recovery preview plan using Google OR-Tools.
    """
    try:
        return run_equipment_failure_recovery(
            db=db,
            event_id=payload.event_id,
            resource_id=payload.resource_id
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Equipment failure recovery preview failed: {str(e)}"
        )


@router.post("/equipment-failure/apply", status_code=status.HTTP_200_OK)
def apply_equipment_failure_recovery(
    payload: ApplyEquipmentRecoveryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN, UserRole.LOGISTICS]))
) -> Dict[str, Any]:

    """
    Applies confirmed equipment failure recovery plan to PostgreSQL:
    1. Updates failed resource status to CRITICAL / FAILED.
    2. Assigns replacement resource if available.
    3. Prevents failed resource from being re-allocated.
    4. Creates an EventIQ Notification record.
    5. Returns final recovery state.
    """
    try:
        event = db.query(Event).filter(Event.id == payload.event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail=f"Event {payload.event_id} not found.")

        failed_res = db.query(Resource).filter(Resource.id == payload.failed_resource_id).first()
        if not failed_res:
            raise HTTPException(status_code=404, detail=f"Resource {payload.failed_resource_id} not found.")

        # Update failed resource status
        failed_res.status = "CRITICAL"
        if failed_res.available_quantity > 0:
            failed_res.available_quantity -= 1

        replacement_res = None
        if payload.replacement_resource_id:
            replacement_res = db.query(Resource).filter(Resource.id == payload.replacement_resource_id).first()
            if replacement_res and replacement_res.available_quantity > 0:
                replacement_res.allocated_quantity += 1
                replacement_res.available_quantity -= 1

        # Create Notification record
        msg = (
            f"Projector / Equipment failure recovered for event '{event.title}'. "
            + (f"Replacement {replacement_res.name} recommended and applied successfully." if replacement_res else "No replacement equipment available. Notification sent to coordinator.")
        )

        notif = Notification(
            title=f"Equipment Failure Recovered: {event.title}",
            message=msg,
            type="WARNING" if replacement_res else "ERROR",
            is_read=False,
            related_event_id=event.id,
            related_resource_id=failed_res.id
        )

        db.add(notif)
        db.commit()

        return {
            "status": "RECOVERED" if replacement_res else "FAILED",
            "success": True,
            "message": "Equipment failure recovery applied successfully.",
            "event_id": event.id,
            "failed_resource": {
                "id": failed_res.id,
                "name": failed_res.name,
                "status": failed_res.status
            },
            "replacement_resource": {
                "id": replacement_res.id,
                "name": replacement_res.name
            } if replacement_res else None,
            "notification_created": True
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Applying equipment recovery failed: {str(e)}"
        )


