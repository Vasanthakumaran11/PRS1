"""
models/review.py - Pydantic schemas for product reviews.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    productId: str
    rating: float = Field(..., ge=1.0, le=5.0)
    review: str = Field(..., min_length=1, max_length=2000)
    keyword: Optional[str] = None  # Quick keyword: Super / Good / Average / Poor


class ReviewOut(BaseModel):
    reviewId: str
    productId: str
    customerId: str
    customerName: str
    rating: float
    review: str
    keyword: Optional[str] = None
    timestamp: datetime
