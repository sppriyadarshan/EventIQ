from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.historical_event import HistoricalEvent
from app.models.institution import Institution
from app.schemas.historical_event import HistoricalEventCreate, HistoricalEventOut

router = APIRouter(prefix="/historical-events", tags=["Historical Events"])


@router.get("", response_model=List[HistoricalEventOut])
def get_historical_events(
    institution_id: Optional[int] = None,
    event_type: Optional[str] = None,
    department_code: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(HistoricalEvent).order_by(HistoricalEvent.event_date.desc())
    if institution_id:
        query = query.filter(HistoricalEvent.institution_id == institution_id)
    if event_type:
        query = query.filter(HistoricalEvent.event_type == event_type)
    if department_code:
        query = query.filter(HistoricalEvent.department_code == department_code)
    return query.all()


@router.post("", response_model=HistoricalEventOut, status_code=status.HTTP_201_CREATED)
def create_historical_event(he_in: HistoricalEventCreate, db: Session = Depends(get_db)):
    inst = db.query(Institution).filter(Institution.id == he_in.institution_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    data = he_in.model_dump()
    # Calculate turnout rate if registered_count > 0
    reg = data.get("registered_count", 0)
    act = data.get("actual_attendance", 0)
    if reg > 0:
        data["turnout_rate"] = round(act / reg, 4)
    else:
        data["turnout_rate"] = 0.0

    he = HistoricalEvent(**data)
    db.add(he)
    db.commit()
    db.refresh(he)
    return he


@router.get("/{historical_event_id}", response_model=HistoricalEventOut)
def get_historical_event(historical_event_id: int, db: Session = Depends(get_db)):
    he = db.query(HistoricalEvent).filter(HistoricalEvent.id == historical_event_id).first()
    if not he:
        raise HTTPException(status_code=404, detail="Historical event record not found")
    return he
