"""
main.py - FastAPI application entry point for the Product Review System (PRS).

Features:
  - CORS configured for React frontend (Vite dev server at http://localhost:5173)
  - All route modules mounted
  - Startup seeder: inserts 6 demo products matching frontend mock data if DB is empty
  - Interactive Swagger docs at http://localhost:8000/docs
"""
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all route modules
from routes import auth, product, review, cart, decision
from database import products_col, customers_col, reviews_col, cart_col, purchase_preferences_col

# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Product Review System API",
    description="Decision-based product review system with JWT auth, MongoDB, and a smart purchase decision engine.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS - Allow React frontend on localhost:5173 (Vite default)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Include routers
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(product.router)
app.include_router(review.router)
app.include_router(cart.router)
app.include_router(decision.router)


# ---------------------------------------------------------------------------
# Startup: Create indexes and seed products if empty
# ---------------------------------------------------------------------------
@app.on_event("startup")
def startup_event():
    # Create unique indexes
    customers_col().create_index("email", unique=True)
    customers_col().create_index("customerId", unique=True)
    products_col().create_index("productId", unique=True)
    reviews_col().create_index([("productId", 1), ("customerId", 1)], unique=True)

    # Seed products if collection is empty
    if products_col().count_documents({}) == 0:
        _seed_products()
        print("[PRS] Seeded 6 demo products into MongoDB.")
    else:
        print(f"[PRS] Products collection already has {products_col().count_documents({})} documents.")


def _seed_products():
    """Insert the 6 products matching the frontend mockData.js exactly."""
    now = datetime.utcnow()
    seed_data = [
        {
            "productId": "p1",
            "name": "ProPhone 15 Ultra",
            "category": "electronics",
            "avgRating": 4.8,
            "reviewCount": 1245,
            "price_amazon": 949.00,
            "price_flipkart": 979.00,
            "description": "The ultimate smartphone experience with a pro-grade camera system and all-day battery life.",
            "image": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800",
            "thumbnails": [
                "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800",
            ],
            "lastUpdated": now,
        },
        {
            "productId": "p2",
            "name": "Noise-Cancelling Headphones 700",
            "category": "electronics",
            "avgRating": 4.5,
            "reviewCount": 890,
            "price_amazon": 329.99,
            "price_flipkart": 349.99,
            "description": "Premium wireless headphones with industry-leading noise cancellation.",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
            "thumbnails": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
            ],
            "lastUpdated": now,
        },
        {
            "productId": "p3",
            "name": "Minimalist Modern Sofa",
            "category": "home",
            "avgRating": 4.2,
            "reviewCount": 120,
            "price_amazon": 579.00,
            "price_flipkart": 599.00,
            "description": "A comfortable and stylish sofa that fits perfectly in any modern living room.",
            "image": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
            "thumbnails": [
                "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"
            ],
            "lastUpdated": now,
        },
        {
            "productId": "p4",
            "name": "Ergonomic Office Chair",
            "category": "home",
            "avgRating": 4.7,
            "reviewCount": 450,
            "price_amazon": 189.50,
            "price_flipkart": 199.50,
            "description": "Designed for comfort during long working hours with lumbar support.",
            "image": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800",
            "thumbnails": [
                "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800"
            ],
            "lastUpdated": now,
        },
        {
            "productId": "p5",
            "name": "Classic Men's Chronograph",
            "category": "fashion",
            "avgRating": 3.9,
            "reviewCount": 95,
            "price_amazon": 140.00,
            "price_flipkart": 150.00,
            "description": "A timeless elegant watch suitable for both formal and casual occasions.",
            "image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
            "thumbnails": [
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"
            ],
            "lastUpdated": now,
        },
        {
            "productId": "p6",
            "name": "Ultralight Running Shoes",
            "category": "fashion",
            "avgRating": 4.6,
            "reviewCount": 880,
            "price_amazon": 110.00,
            "price_flipkart": 120.00,
            "description": "Breathable, lightweight shoes designed for maximum speed and comfort.",
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
            "thumbnails": [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
            ],
            "lastUpdated": now,
        },
    ]
    products_col().insert_many(seed_data)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "message": "PRS Backend is running!",
        "docs": "http://localhost:8000/docs",
        "status": "healthy"
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}
