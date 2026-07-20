from fastapi import APIRouter, Depends
from app.models.common import APIResponse
from app.core.dependencies import require_role

router = APIRouter(prefix="/fpo", tags=["fpo"])

@router.get("/dashboard", response_model=APIResponse)
async def get_fpo_dashboard(user: dict = Depends(require_role("fpo_officebearer", "admin"))):
    return APIResponse(
        success=True,
        data={
            "fpo_name": "Sahyadri Farmer Producer Co.",
            "member_count": 28,
            "aggregate_monthly_cash_flow": 420000.0,
            "drag_members": ["Kamdhenu Dairy Enterprise"],
        }
    )
