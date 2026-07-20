from fastapi import APIRouter, Depends
from app.models.common import APIResponse
from app.services import officer_service
from app.core.dependencies import require_role

router = APIRouter(prefix="/officer", tags=["officer"])

MOCK_PORTFOLIO = [
    {"id": "ent-1", "name": "Kamdhenu Dairy", "sector": "dairy", "severity": "high", "reason": "Feed price spike +25%", "days_since_visit": 14, "trend": "deteriorating"},
    {"id": "ent-2", "name": "Sahyadri Handicrafts", "sector": "handicrafts", "severity": "watch", "reason": "Pre-festival inventory gap", "days_since_visit": 5, "trend": "stable"},
    {"id": "ent-3", "name": "Godavari Food Processing", "sector": "food_processing", "severity": "low", "reason": "Stable seasonal flow", "days_since_visit": 21, "trend": "improving"},
]

@router.get("/portfolio", response_model=APIResponse)
async def get_portfolio(user: dict = Depends(require_role("field_officer", "admin"))):
    ranked = officer_service.rank_portfolio(MOCK_PORTFOLIO.copy())
    return APIResponse(success=True, data=ranked)
