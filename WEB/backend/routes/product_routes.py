from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_products():
    return [{"id": 1, "name": "Sample Product", "price": 10.0}]

@router.get("/{product_id}")
async def get_product(product_id: int):
    return {"id": product_id, "name": "Sample Product", "price": 10.0}
