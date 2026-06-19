from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.config.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.user import User
from app.models.order_item import OrderItem
from app.models.inventory_transaction import InventoryTransaction
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.core.security import get_current_user, authorize

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    # Check if SKU is unique
    existing = db.query(Product).filter(Product.sku == product_data.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    db_product = Product(**product_data.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Load relationships
    product = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.supplier)
    ).filter(Product.id == db_product.id).first()
    
    return product


@router.get("")
async def get_products(
    search: Optional[str] = None,
    category: Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.supplier)
    )
    if search:
        from sqlalchemy import or_
        query = query.filter(or_(Product.name.ilike(f"%{search}%"), Product.sku.ilike(f"%{search}%")))
    if category:
        query = query.filter(Product.categoryId == category)
    
    total = query.count()
    offset = (page - 1) * limit
    products = query.order_by(Product.createdAt.desc()).offset(offset).limit(limit).all()
    
    return {
        "products": products,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit
        }
    }


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.supplier)
    ).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    
    db.commit()
    
    # Load relationships
    updated_product = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.supplier)
    ).filter(Product.id == product_id).first()
    
    return updated_product


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Delete linked records first
    db.query(OrderItem).filter(OrderItem.productId == product_id).delete()
    db.query(InventoryTransaction).filter(InventoryTransaction.productId == product_id).delete()
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}
