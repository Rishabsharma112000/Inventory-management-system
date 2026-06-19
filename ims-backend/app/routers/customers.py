from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.config.database import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.models.user import User
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.core.security import get_current_user, authorize
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/api/customers", tags=["Customers"])


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_data: CustomerCreate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    try:
        db_customer = Customer(**customer_data.model_dump())
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        return db_customer
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")


@router.get("")
async def get_customers(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Customer)
    if search:
        from sqlalchemy import or_
        query = query.filter(or_(Customer.fullName.ilike(f"%{search}%"), Customer.email.ilike(f"%{search}%")))
    
    total = query.count()
    offset = (page - 1) * limit
    customers = query.order_by(Customer.createdAt.desc()).offset(offset).limit(limit).all()
    
    return {
        "customers": customers,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit
        }
    }


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    try:
        for key, value in customer_data.model_dump(exclude_unset=True).items():
            setattr(customer, key, value)
        db.commit()
        db.refresh(customer)
        return customer
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")


@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: int,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Delete all orders linked to this customer first
    db.query(Order).filter(Order.customerId == customer_id).delete()
    
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted"}
