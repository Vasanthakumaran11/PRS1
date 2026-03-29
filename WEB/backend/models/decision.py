"""
models/decision.py - Pydantic schemas for the purchase decision engine.
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class PriorityEnum(str, Enum):
    low_price = "low_price"
    fast_delivery = "fast_delivery"
    best_rating = "best_rating"


class DecisionRequest(BaseModel):
    productId: str
    budget: float = Field(..., gt=0)
    location: Optional[str] = "India"
    priority: PriorityEnum = PriorityEnum.low_price


class DecisionResponse(BaseModel):
    recommendedPlatform: str       # "Amazon" or "Flipkart"
    price: float
    reason: str
    budgetSufficient: bool
    alternativePlatform: Optional[str] = None
    alternativePrice: Optional[float] = None
