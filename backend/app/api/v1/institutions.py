from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.institution import Institution
from app.schemas.institution import InstitutionCreate, InstitutionUpdate, InstitutionOut

router = APIRouter(prefix="/institutions", tags=["Institutions"])


@router.get("", response_model=List[InstitutionOut])
def get_institutions(db: Session = Depends(get_db)):
    return db.query(Institution).all()


@router.post("", response_model=InstitutionOut, status_code=status.HTTP_201_CREATED)
def create_institution(institution_in: InstitutionCreate, db: Session = Depends(get_db)):
    existing = db.query(Institution).filter(Institution.code == institution_in.code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Institution with code '{institution_in.code}' already exists."
        )
    institution = Institution(**institution_in.model_dump())
    db.add(institution)
    db.commit()
    db.refresh(institution)
    return institution


@router.get("/{institution_id}", response_model=InstitutionOut)
def get_institution(institution_id: int, db: Session = Depends(get_db)):
    institution = db.query(Institution).filter(Institution.id == institution_id).first()
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution


@router.patch("/{institution_id}", response_model=InstitutionOut)
def update_institution(institution_id: int, institution_in: InstitutionUpdate, db: Session = Depends(get_db)):
    institution = db.query(Institution).filter(Institution.id == institution_id).first()
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    update_data = institution_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(institution, field, value)
    
    db.commit()
    db.refresh(institution)
    return institution


@router.delete("/{institution_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_institution(institution_id: int, db: Session = Depends(get_db)):
    institution = db.query(Institution).filter(Institution.id == institution_id).first()
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    db.delete(institution)
    db.commit()
    return None
