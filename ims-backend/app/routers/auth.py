from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, AuthResponse, UserChangePassword
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create token
    access_token = create_access_token(data={"id": new_user.id, "email": new_user.email, "role": new_user.role.value})
    
    return AuthResponse(
        user=UserResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            role=new_user.role,
            isActive=new_user.isActive,
            createdAt=new_user.createdAt,
            updatedAt=new_user.updatedAt
        ),
        token=access_token
    )


@router.post("/login", response_model=AuthResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"id": user.id, "email": user.email, "role": user.role.value})
    return AuthResponse(
        user=UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            isActive=user.isActive,
            createdAt=user.createdAt,
            updatedAt=user.updatedAt
        ),
        token=access_token
    )


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        isActive=current_user.isActive,
        createdAt=current_user.createdAt,
        updatedAt=current_user.updatedAt
    )


@router.post("/change-password", response_model=dict)
async def change_password(
    password_data: UserChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(password_data.oldPassword, current_user.password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    
    current_user.password = get_password_hash(password_data.newPassword)
    db.commit()
    return {"message": "Password changed successfully"}
