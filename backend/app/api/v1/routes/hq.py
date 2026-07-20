from fastapi import APIRouter, Depends
from app.models.common import APIResponse
from app.services import hq_service
from app.core.dependencies import require_role

router = APIRouter(prefix="/hq", tags=["hq"])

@router.get("/dashboard/systemic-alerts", response_model=APIResponse)
async def get_systemic_alerts(user: dict = Depends(require_role("hq_risk_officer", "admin"))):
    alerts = await hq_service.get_systemic_alerts()
    return APIResponse(success=True, data=alerts)
