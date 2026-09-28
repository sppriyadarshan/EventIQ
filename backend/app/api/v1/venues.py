from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.event import Venue
from app.models.institution import Institution
from app.schemas.event import VenueCreate, VenueUpdate, VenueOut

router = APIRouter(prefix="/venues", tags=["Venues"])


@router.get("", response_model=List[VenueOut])
def get_venues(institution_id: Optional[int] = None, available_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Venue)
    if institution_id:
        query = query.filter(Venue.institution_id == institution_id)
    if available_only:
        query = query.filter(Venue.available == True)
    return query.all()


@router.post("", response_model=VenueOut, status_code=status.HTTP_201_CREATED)
def create_venue(venue_in: VenueCreate, db: Session = Depends(get_db)):
    inst = db.query(Institution).filter(Institution.id == venue_in.institution_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    venue = Venue(**venue_in.model_dump())
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue


@router.get("/{venue_id}", response_model=VenueOut)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue


@router.patch("/{venue_id}", response_model=VenueOut)
def update_venue(venue_id: int, venue_in: VenueUpdate, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    update_data = venue_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(venue, field, value)
    
    db.commit()
    db.refresh(venue)
    return venue


@router.delete("/{venue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    db.delete(venue)
    db.commit()
    return None
