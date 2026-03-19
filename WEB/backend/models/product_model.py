from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    productId: str = Field(..., min_length=2, description="Unique product identifier")
    name: str = Field(..., min_length=2, description="Name of the product")
