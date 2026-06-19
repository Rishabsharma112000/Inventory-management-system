from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import RoleEnum


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.STAFF


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserChangePassword(BaseModel):
    oldPassword: str
    newPassword: str


class UserResponse(UserBase):
    id: int
    role: RoleEnum
    isActive: bool
    createdAt: datetime
    updatedAt: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    user: UserResponse
    token: str
