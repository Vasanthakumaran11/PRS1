from pydantic import BaseModel, Field
from typing import Optional

class products(BaseModel):
    _id: str = Field(default_factory=str(ObjectId))
    productId: str = Field(default_factory=str(ObjectId))
    name: str
    avgRating : float
    reviewCount : int