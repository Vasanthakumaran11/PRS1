"""
models/customer.py - Pydantic schemas for customer/user data.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class CustomerRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    location: Optional[str] = "Unknown"


class CustomerLogin(BaseModel):
    email: EmailStr
    password: str


class CustomerOut(BaseModel):
    customerId: str
    name: str
    email: str
    location: str
    createdAt: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customerId: str
    name: str
    email: str
