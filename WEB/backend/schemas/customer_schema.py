from pydantic import BaseModel, EmailStr

class CustomerBase(BaseModel):
    name: str
    email: EmailStr

class CustomerCreate(CustomerBase):
    password: str

class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True
