from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.config.database import get_db
from app.models.order import Order, OrderStatusEnum
from app.models.order_item import OrderItem
from app.models.customer import Customer
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdateStatus
from app.core.security import get_current_user, authorize
from decimal import Decimal
import time

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if customer exists
    customer = db.query(Customer).filter(Customer.id == order_data.customerId).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    total_amount = Decimal('0.00')
    order_items_data = []
    
    # Validate items
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.productId).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.productId} not found")
        
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product '{product.name}'. Available: {product.quantity}, Required: {item.quantity}"
            )
        
        subtotal = product.price * item.quantity
        total_amount += subtotal
        
        order_items_data.append({
            "productId": item.productId,
            "quantity": item.quantity,
            "price": product.price,
            "subtotal": subtotal
        })
        
        # Update product stock
        product.quantity -= item.quantity
    
    # Create order
    order_number = f"ORD-{int(time.time())}"
    db_order = Order(
        orderNumber=order_number,
        customerId=order_data.customerId,
        totalAmount=total_amount,
        status=OrderStatusEnum.PENDING
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item_data in order_items_data:
        db_item = OrderItem(
            orderId=db_order.id,
            **item_data
        )
        db.add(db_item)
    
    db.commit()
    
    # Get order with relationships
    order = db.query(Order).options(
        joinedload(Order.customer),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == db_order.id).first()
    
    return order


@router.get("")
async def get_orders(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Order).options(
        joinedload(Order.customer),
        joinedload(Order.items).joinedload(OrderItem.product)
    )
    
    total = query.count()
    offset = (page - 1) * limit
    orders = query.order_by(Order.createdAt.desc()).offset(offset).limit(limit).all()
    
    return {
        "orders": orders,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit
        }
    }


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).options(
        joinedload(Order.customer),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order


@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_data: OrderUpdateStatus,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_data.status
    db.commit()
    
    order = db.query(Order).options(
        joinedload(Order.customer),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()
    
    return order


@router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Restock items if not cancelled
    if order.status != OrderStatusEnum.CANCELLED:
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.productId).first()
            if product:
                product.quantity += item.quantity
    
    order.status = OrderStatusEnum.CANCELLED
    db.commit()
    
    return {"message": "Order cancelled"}
