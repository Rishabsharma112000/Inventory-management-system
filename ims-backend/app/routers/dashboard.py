from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.config.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.user import User
from app.core.security import get_current_user
from decimal import Decimal

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_products = db.query(func.count(Product.id)).scalar()
    low_stock_items = db.query(func.count(Product.id)).filter(Product.quantity <= Product.minimumStock).scalar()
    total_categories = db.query(func.count(Category.id)).scalar()
    total_suppliers = db.query(func.count(Supplier.id)).scalar()
    
    # Calculate inventory value
    inventory_value = db.query(func.sum(Product.price * Product.quantity)).scalar() or Decimal('0.00')
    
    return {
        "totalProducts": total_products,
        "lowStockItems": low_stock_items,
        "totalCategories": total_categories,
        "totalSuppliers": total_suppliers,
        "inventoryValue": float(inventory_value)
    }
