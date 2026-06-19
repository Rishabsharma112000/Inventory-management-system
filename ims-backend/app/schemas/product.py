from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.product import ProductStatusEnum
from app.schemas.category import CategoryResponse
from app.schemas.supplier import SupplierResponse


class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: Decimal
    quantity: int
    minimumStock: int = 0
    imageUrl: Optional[str] = None
    status: ProductStatusEnum = ProductStatusEnum.ACTIVE
    categoryId: Optional[int] = None
    supplierId: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[Decimal] = None
    quantity: Optional[int] = None
    minimumStock: Optional[int] = None
    status: Optional[ProductStatusEnum] = None


class ProductResponse(ProductBase):
    id: int
    category: Optional[CategoryResponse] = None
    supplier: Optional[SupplierResponse] = None
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
