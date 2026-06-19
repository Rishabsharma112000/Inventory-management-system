from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.order import OrderStatusEnum
from app.schemas.customer import CustomerResponse
from app.schemas.product import ProductResponse


class OrderItemBase(BaseModel):
    productId: int
    quantity: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: int
    price: Decimal
    subtotal: Decimal
    product: Optional[ProductResponse] = None
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customerId: int


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdateStatus(BaseModel):
    status: OrderStatusEnum


class OrderResponse(OrderBase):
    id: int
    orderNumber: str
    totalAmount: Decimal
    status: OrderStatusEnum
    customer: Optional[CustomerResponse] = None
    items: List[OrderItemResponse] = []
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    totalProducts: int
    lowStockItems: int
    totalCategories: int
    totalSuppliers: int
    inventoryValue: Decimal
