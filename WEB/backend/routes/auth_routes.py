import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from models.customer_model import CustomerCreate, CustomerLogin
from database import customers_collection
from auth import get_password_hash, verify_password, create_jwt_token

router = APIRouter()

@router.post("/register")
def register_user(user: CustomerCreate):
    # Check email uniqueness
    existing_user = customers_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Generate customerId
    customer_id = "C-" + str(uuid.uuid4())[:6].upper()
    
    # Insert into db
    new_user = {
        "customerId": customer_id,
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "createdAt": datetime.utcnow()
    }
    customers_collection.insert_one(new_user)
    
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {
            "customerId": customer_id
        }
    }

@router.post("/login")
def login_user(user: CustomerLogin):
    # Find customer by email
    db_user = customers_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Generate JWT
    payload = {
        "customerId": db_user["customerId"],
        "name": db_user["name"],
        "email": db_user["email"]
    }
    token = create_jwt_token(payload)
    
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "token": token,
            "customer": {
                "customerId": db_user["customerId"],
                "name": db_user["name"],
                "email": db_user["email"]
            }
        }
    }
