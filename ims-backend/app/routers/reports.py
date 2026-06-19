from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.models.user import User
from app.core.security import get_current_user
from io import StringIO
import csv

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/products")
async def download_products_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "SKU", "Description", "Category ID", "Supplier ID", "Price", "Quantity", "Minimum Stock", "Status", "Created At"])
    
    for product in products:
        writer.writerow([
            product.id,
            product.name,
            product.sku,
            product.description,
            product.categoryId,
            product.supplierId,
            product.price,
            product.quantity,
            product.minimumStock,
            product.status,
            product.createdAt
        ])
    
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=products-report.csv"}
    )


@router.get("/inventory")
async def download_inventory_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "SKU", "Current Quantity", "Minimum Stock", "Price", "Status"])
    
    for product in products:
        writer.writerow([
            product.id,
            product.name,
            product.sku,
            product.quantity,
            product.minimumStock,
            product.price,
            product.status
        ])
    
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=inventory-report.csv"}
    )


@router.get("/categories")
async def download_categories_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    categories = db.query(Category).all()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Description", "Created At"])
    
    for category in categories:
        writer.writerow([
            category.id,
            category.name,
            category.description,
            category.createdAt
        ])
    
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=categories-report.csv"}
    )
