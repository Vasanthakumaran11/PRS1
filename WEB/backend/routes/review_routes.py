from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def create_review():
    return {"message": "Review created"}
