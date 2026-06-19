from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.config.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    gstNumber = Column(String(255), nullable=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
