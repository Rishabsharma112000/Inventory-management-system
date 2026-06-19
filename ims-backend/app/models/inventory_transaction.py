from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import enum


class TransactionTypeEnum(str, enum.Enum):
    STOCK_IN = "STOCK_IN"
    STOCK_OUT = "STOCK_OUT"
    ADJUSTMENT = "ADJUSTMENT"


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(Enum(TransactionTypeEnum), nullable=False)
    quantity = Column(Integer, nullable=False)
    previousStock = Column(Integer, nullable=False)
    currentStock = Column(Integer, nullable=False)
    remarks = Column(Text, nullable=True)
    
    productId = Column(Integer, ForeignKey("products.id"), nullable=True)
    createdBy = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    product = relationship("Product", backref="transactions")
    creator = relationship("User", backref="transactions")
    
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
