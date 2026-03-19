from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.auth_routes import router as auth_router
from routes.product_routes import router as product_router
from routes.review_routes import router as review_router

app = FastAPI(title="Product Review System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler to maintain the expected response format
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": {}
        }
    )

app.include_router(auth_router, tags=["Auth"])
app.include_router(product_router, tags=["Products"])
app.include_router(review_router, tags=["Reviews"])

@app.on_event("startup")
async def startup_event():
    print("Welcome to PRS API. Server is starting...")

@app.get("/")
def read_root():
    return {
        "success": True,
        "message": "Product Review System API is running",
        "data": {}
    }
