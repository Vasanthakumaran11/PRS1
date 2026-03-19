from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    productId: str = Field(..., description="Id of the product being reviewed")
    productName: str = Field(..., description="Name of the product being reviewed")
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating from 1.0 to 5.0")
    review: str = Field(..., description="Review text")
