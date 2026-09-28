from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.event import Event, Venue
from app.models.institution import Institution
from app.schemas.event import EventCreate, EventUpdate, EventOut

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=List[EventOut])
def get_events(
    status: Optional[str] = Query(None, description="Filter by status (DRAFT, UPCOMING, ONGOING, COMPLETED, CANCELLED)"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    department_id: Optional[int] = Query(None, description="Filter by department ID"),
    event_date: Optional[date] = Query(None, alias="date", description="Filter by start date"),
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    if status:
        query = query.filter(Event.status == status)
    if event_type:
        query = query.filter(Event.event_type == event_type)
    if department_id:
        query = query.filter(Event.department_id == department_id)
    if event_date:
        query = query.filter(Event.start_date == event_date)
    return query.all()


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(event_in: EventCreate, db: Session = Depends(get_db)):
    inst = db.query(Institution).filter(Institution.id == event_in.institution_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    if event_in.venue_id:
        venue = db.query(Venue).filter(Venue.id == event_in.venue_id).first()
        if not venue:
            raise HTTPException(status_code=404, detail="Venue not found")
        
    event = Event(**event_in.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.patch("/{event_id}", response_model=EventOut)
def update_event(event_id: int, event_in: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return None
