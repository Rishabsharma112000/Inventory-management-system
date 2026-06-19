from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.product import Product
from app.models.inventory_transaction import InventoryTransaction, TransactionTypeEnum
from app.models.user import User
from app.core.security import get_current_user
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])


class StockChangeRequest(BaseModel):
    quantity: int
    notes: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    type: str
    quantity: int
    previousStock: int
    currentStock: int
    remarks: Optional[str] = None
    productId: Optional[int] = None
    createdAt: str
    updatedAt: Optional[str] = None


@router.post("/{product_id}/in")
async def stock_in(
    product_id: int,
    request: StockChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    previous_stock = product.quantity
    product.quantity += request.quantity
    
    transaction = InventoryTransaction(
        type=TransactionTypeEnum.STOCK_IN,
        quantity=request.quantity,
        previousStock=previous_stock,
        currentStock=product.quantity,
        remarks=request.notes,
        productId=product_id,
        createdBy=current_user.id
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(product)
    
    return {"message": "Stock in successful", "product": product}


@router.post("/{product_id}/out")
async def stock_out(
    product_id: int,
    request: StockChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.quantity < request.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    previous_stock = product.quantity
    product.quantity -= request.quantity
    
    transaction = InventoryTransaction(
        type=TransactionTypeEnum.STOCK_OUT,
        quantity=request.quantity,
        previousStock=previous_stock,
        currentStock=product.quantity,
        remarks=request.notes,
        productId=product_id,
        createdBy=current_user.id
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(product)
    
    return {"message": "Stock out successful", "product": product}


@router.get("/{product_id}/transactions")
async def get_product_transactions(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    transactions = db.query(InventoryTransaction).filter(
        InventoryTransaction.productId == product_id
    ).order_by(InventoryTransaction.createdAt.desc()).all()
    
    return {"transactions": transactions}
