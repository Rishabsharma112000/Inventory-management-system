from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar('T')


class MetaResponse(BaseModel):
    total: int
    page: int
    limit: int


class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    meta: MetaResponse


class MessageResponse(BaseModel):
    message: str
