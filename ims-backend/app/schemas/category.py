from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
