from fastapi import FastAPI
from routes import auth_routes, product_routes, review_routes

app = FastAPI(title="PRS API")

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(product_routes.router, prefix="/products", tags=["Products"])
app.include_router(review_routes.router, prefix="/reviews", tags=["Reviews"])

@app.get("/")
async def root():
    return {"message": "Welcome to PRS API"}
