from pydantic import BaseModel, EmailStr, Field

class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Name of the customer")
    email: EmailStr = Field(..., description="Unique email address")
    password: str = Field(..., min_length=6, description="Password for the account")

class CustomerLogin(BaseModel):
    email: EmailStr
    password: str
