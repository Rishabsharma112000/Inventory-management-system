from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Numeric(12, 2), nullable=False, default=0)
    subtotal = Column(Numeric(12, 2), nullable=False, default=0)
    
    orderId = Column(Integer, ForeignKey("orders.id"), nullable=False)
    productId = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product", backref="orderItems")
    
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
