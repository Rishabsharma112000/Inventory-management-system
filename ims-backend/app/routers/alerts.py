from fastapi import APIRouter
router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("")
async def get_alerts():
    return {"message": "Alerts placeholder"}
