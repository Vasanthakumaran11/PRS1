"""
models/product.py - Pydantic schemas for product data.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProductOut(BaseModel):
    productId: str
    name: str
    category: str
    avgRating: float
    reviewCount: int
    price_amazon: float
    price_flipkart: float
    description: Optional[str] = ""
    image: Optional[str] = ""
    thumbnails: Optional[List[str]] = []
    lastUpdated: Optional[datetime] = None
