from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class CustomerBase(BaseModel):
    fullName: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(CustomerBase):
    fullName: Optional[str] = None
    email: Optional[EmailStr] = None


class CustomerResponse(CustomerBase):
    id: int
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
