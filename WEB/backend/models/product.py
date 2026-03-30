"""
models/product.py - Pydantic schemas for product data.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PlatformPricing(BaseModel):
    """Platform pricing and rating information."""
    price: float
    delivery: int  # delivery days
    rating: float


class Platforms(BaseModel):
    """Platform comparison data (Amazon vs Flipkart)."""
    amazon: PlatformPricing
    flipkart: PlatformPricing


class ProductOut(BaseModel):
    """Product schema with platform comparison data."""
    productId: str
    name: str
    description: Optional[str] = ""
    category: str
    image: Optional[str] = ""
    base_price: float
    rating: float
    platforms: Platforms
    avgRating: Optional[float] = None  # for backward compatibility
    reviewCount: Optional[int] = 0
    price_amazon: Optional[float] = None  # for backward compatibility
    price_flipkart: Optional[float] = None  # for backward compatibility
    thumbnails: Optional[List[str]] = []
    lastUpdated: Optional[datetime] = None
