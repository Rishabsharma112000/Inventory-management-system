from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import enum


class OrderStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    orderNumber = Column(String(255), unique=True, index=True, nullable=False)
    totalAmount = Column(Numeric(12, 2), nullable=False, default=0)
    status = Column(Enum(OrderStatusEnum), nullable=False, default=OrderStatusEnum.PENDING)
    
    customerId = Column(Integer, ForeignKey("customers.id"), nullable=False)
    customer = relationship("Customer", backref="orders")
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
