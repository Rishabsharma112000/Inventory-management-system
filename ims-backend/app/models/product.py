from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import enum


class ProductStatusEnum(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    sku = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(12, 2), nullable=False, default=0)
    quantity = Column(Integer, nullable=False, default=0)
    minimumStock = Column(Integer, nullable=False, default=0)
    imageUrl = Column(String(255), nullable=True)
    status = Column(Enum(ProductStatusEnum), nullable=False, default=ProductStatusEnum.ACTIVE)

    categoryId = Column(Integer, ForeignKey("categories.id"), nullable=True)
    supplierId = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    
    category = relationship("Category", backref="products")
    supplier = relationship("Supplier", backref="products")
    
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
