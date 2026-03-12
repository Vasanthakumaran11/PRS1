from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewModel(BaseModel):
    _id: Optional[str] = None
    productId: str 
    productName: Optional[str] = None
    customerId: str 
    rating: float
    review : str
    timestamp : Optional[datetime] = Field(default_factory=datetime.now)
