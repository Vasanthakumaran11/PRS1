from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CustomerModel(BaseModel):
    _id: Optional[str] = None
    customerId: Optional[str] = None
    name: Optional[str] = None
    email: str
    password: str
    createdAt: Optional[datetime] = None
