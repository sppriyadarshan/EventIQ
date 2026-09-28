from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, model_validator, ConfigDict


class ResourceBase(BaseModel):
    name: str
    category: str = "OTHER"
    total_quantity: int = Field(default=0, ge=0)
    available_quantity: int = Field(default=0, ge=0)
    allocated_quantity: int = Field(default=0, ge=0)
    unit: Optional[str] = "units"
    status: str = "HEALTHY"

    @model_validator(mode="after")
    def validate_quantities(self):
        if self.available_quantity > self.total_quantity:
            raise ValueError("available_quantity cannot exceed total_quantity")
        if self.allocated_quantity > self.total_quantity:
            raise ValueError("allocated_quantity cannot exceed total_quantity")
        return self


class ResourceCreate(ResourceBase):
    institution_id: int


class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    total_quantity: Optional[int] = Field(default=None, ge=0)
    available_quantity: Optional[int] = Field(default=None, ge=0)
    allocated_quantity: Optional[int] = Field(default=None, ge=0)
    unit: Optional[str] = None
    status: Optional[str] = None


class ResourceOut(ResourceBase):
    id: int
    institution_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
