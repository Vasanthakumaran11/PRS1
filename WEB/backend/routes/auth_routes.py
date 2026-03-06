from fastapi import APIRouter
from datetime import datetime
router = APIRouter()

@router.post("/register")
async def register():
    exists = customers_collection.find_one({"email": email})
    if exists:
        return {"error": "email already existed"}
    else:
        hashed_pw = pwd_context.hash(customer.password)
        new_customer = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "createdAt": datetime.now()
        }
        customers_collection.insert_one(new_customer)
        return {"message": "Registration successful"}

@router.post("/login")
async def login():
    customer = customers_collection.find_one({"email": email})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    is_valid = pwd_context.verify(password, customer["password"])
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {
        "message": "Login successful",
        "customerId": customer["customerId"],
        "name": customer["name"]
    }
