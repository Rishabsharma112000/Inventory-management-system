from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class SupplierBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    gstNumber: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(SupplierBase):
    name: Optional[str] = None


class SupplierResponse(SupplierBase):
    id: int
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
