from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resource import Resource
from app.models.institution import Institution
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceOut

router = APIRouter(prefix="/resources", tags=["Resources"])


@router.get("", response_model=List[ResourceOut])
def get_resources(institution_id: Optional[int] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Resource)
    if institution_id:
        query = query.filter(Resource.institution_id == institution_id)
    if category:
        query = query.filter(Resource.category == category)
    return query.all()


@router.post("", response_model=ResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(resource_in: ResourceCreate, db: Session = Depends(get_db)):
    inst = db.query(Institution).filter(Institution.id == resource_in.institution_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    resource = Resource(**resource_in.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


@router.get("/{resource_id}", response_model=ResourceOut)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.patch("/{resource_id}", response_model=ResourceOut)
def update_resource(resource_id: int, resource_in: ResourceUpdate, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    update_data = resource_in.model_dump(exclude_unset=True)
    
    # Calculate prospective values to validate quantities
    tot = update_data.get("total_quantity", resource.total_quantity)
    avail = update_data.get("available_quantity", resource.available_quantity)
    alloc = update_data.get("allocated_quantity", resource.allocated_quantity)
    
    if avail > tot:
        raise HTTPException(status_code=400, detail="available_quantity cannot exceed total_quantity")
    if alloc > tot:
        raise HTTPException(status_code=400, detail="allocated_quantity cannot exceed total_quantity")
    
    for field, value in update_data.items():
        setattr(resource, field, value)
    
    db.commit()
    db.refresh(resource)
    return resource


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(resource)
    db.commit()
    return None
