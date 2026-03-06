from pydantic import BaseModel, Field
from typing import Optional

class customers(BaseModel):
    _id: str = Field(default_factory=str(ObjectId))
    customerId: str = Field(default_factory=str(ObjectId))
    name: str
    email: str
    password: str
    createdAt: str = Field(default_factory=str(datetime.now()))
