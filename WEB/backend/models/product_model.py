from pydantic import BaseModel, Field
from typing import Optional

class ProductModel(BaseModel):
    _id: Optional[str] = None
    productId: str 
    name: str
    avgRating : float
    reviewCount : int