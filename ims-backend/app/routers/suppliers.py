from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.config.database import get_db
from app.models.supplier import Supplier
from app.models.user import User
from app.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierResponse
from app.core.security import get_current_user, authorize

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])


@router.post("", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
async def create_supplier(
    supplier_data: SupplierCreate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    db_supplier = Supplier(**supplier_data.model_dump())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier


@router.get("")
async def get_suppliers(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Supplier)
    if search:
        query = query.filter(Supplier.name.ilike(f"%{search}%"))
    
    total = query.count()
    offset = (page - 1) * limit
    suppliers = query.order_by(Supplier.createdAt.desc()).offset(offset).limit(limit).all()
    
    return {
        "suppliers": suppliers,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit
        }
    }


@router.get("/{supplier_id}", response_model=SupplierResponse)
async def get_supplier(
    supplier_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@router.put("/{supplier_id}", response_model=SupplierResponse)
async def update_supplier(
    supplier_id: int,
    supplier_data: SupplierUpdate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    for key, value in supplier_data.model_dump(exclude_unset=True).items():
        setattr(supplier, key, value)
    
    db.commit()
    db.refresh(supplier)
    return supplier


@router.delete("/{supplier_id}")
async def delete_supplier(
    supplier_id: int,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted"}
