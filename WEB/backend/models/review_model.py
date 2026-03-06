from pydantic import BaseModel, Field
from typing import Optional

class reviews(BaseModel):
    _id: str = Field(default_factory=str(ObjectId))
    productId: str = Field(default_factory=str(ObjectId))
    customerId: str = Field(default_factory=str(ObjectId))
    rating: float
    review : str
    timestamp : str = Field(default_factory=str(datetime.now()))