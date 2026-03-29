"""
routes/auth.py - Authentication routes with JWT.

POST /register  - Create a new customer account
POST /login     - Authenticate and return JWT token
GET  /me        - Get current authenticated user info
"""
import uuid
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from database import customers_col
from models.customer import CustomerRegister, CustomerLogin, TokenResponse, CustomerOut
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_customer(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency: validates JWT and returns the customer document."""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        customer_id: str = payload.get("sub")
        if customer_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    customer = customers_col().find_one({"customerId": customer_id})
    if customer is None:
        raise credentials_exception
    return customer


# ---------------------------------------------------------------------------
# POST /register
# ---------------------------------------------------------------------------
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=TokenResponse)
def register(data: CustomerRegister):
    col = customers_col()

    # Check email uniqueness
    if col.find_one({"email": data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    customer_id = str(uuid.uuid4())
    hashed = hash_password(data.password)

    doc = {
        "customerId": customer_id,
        "name": data.name,
        "email": data.email,
        "password": hashed,
        "location": data.location or "Unknown",
        "createdAt": datetime.utcnow(),
    }
    col.insert_one(doc)

    token = create_access_token({"sub": customer_id})
    return TokenResponse(
        access_token=token,
        customerId=customer_id,
        name=data.name,
        email=data.email,
    )


# ---------------------------------------------------------------------------
# POST /login
# ---------------------------------------------------------------------------
@router.post("/login", response_model=TokenResponse)
def login(data: CustomerLogin):
    col = customers_col()
    customer = col.find_one({"email": data.email})

    if not customer or not verify_password(data.password, customer["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token({"sub": customer["customerId"]})
    return TokenResponse(
        access_token=token,
        customerId=customer["customerId"],
        name=customer["name"],
        email=customer["email"],
    )


# ---------------------------------------------------------------------------
# GET /me  - Protected route
# ---------------------------------------------------------------------------
@router.get("/me", response_model=CustomerOut)
def get_me(current_customer: dict = Depends(get_current_customer)):
    return CustomerOut(
        customerId=current_customer["customerId"],
        name=current_customer["name"],
        email=current_customer["email"],
        location=current_customer.get("location", "Unknown"),
        createdAt=current_customer["createdAt"],
    )
