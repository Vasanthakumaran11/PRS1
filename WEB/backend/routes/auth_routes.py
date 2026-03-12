from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from database import customers_collection,products_collection,reviews_collection
from datetime import datetime
import uuid
from models.customer_model import CustomerModel

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(customer : CustomerModel):
    name = customer.name
    email = customer.email
    password = customer.password
    datetime1 = datetime.now()

    exists = customers_collection.find_one({"email": email})
    if exists:
        return {"message": "User already registered, please login"}
    else:
        hashed_pw = pwd_context.hash(customer.password)
        new_customer = {
            "customerId": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password": hashed_pw,
            "createdAt": datetime1
        }
        customers_collection.insert_one(new_customer)
        return {"message": "Registration successful"}

@router.post("/login")
async def login(user: LoginRequest):
    email = user.email
    password = user.password
    customer = customers_collection.find_one({"email": email})
    if not customer:
        return {"message": "Registration required"}

    is_valid = pwd_context.verify(password, customer.get("password", ""))
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    return {
        "message": "Login successful",
        "customerId": customer.get("customerId", "unknown"),
        "name": customer.get("name", "User")
    }
