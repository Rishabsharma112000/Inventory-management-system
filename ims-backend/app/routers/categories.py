from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.config.database import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.core.security import get_current_user, authorize

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    db_category = Category(**category_data.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("")
async def get_categories(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Category)
    if search:
        query = query.filter(Category.name.ilike(f"%{search}%"))
    
    total = query.count()
    offset = (page - 1) * limit
    categories = query.order_by(Category.createdAt.desc()).offset(offset).limit(limit).all()
    
    return {
        "categories": categories,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit
        }
    }


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category_data.model_dump(exclude_unset=True).items():
        setattr(category, key, value)
    
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    current_user: User = Depends(authorize(["ADMIN"])),
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    return {"message": "Category deleted"}
