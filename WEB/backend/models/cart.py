"""
models/cart.py - Pydantic schemas for shopping cart.
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CartItem(BaseModel):
    productId: str
    addedAt: Optional[datetime] = None


class CartAddItem(BaseModel):
    productId: str


class CartRemoveItem(BaseModel):
    productId: str


class CartItemWithDetails(BaseModel):
    productId: str
    name: str
    price_amazon: float
    price_flipkart: float
    avgRating: float
    image: Optional[str] = ""
    category: Optional[str] = ""
    addedAt: Optional[datetime] = None


class CartOut(BaseModel):
    customerId: str
    items: List[CartItemWithDetails]
