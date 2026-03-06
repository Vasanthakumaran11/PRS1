from pydantic import BaseModel

class ReviewBase(BaseModel):
    product_id: int
    customer_id: int
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int

    class Config:
        from_attributes = True
