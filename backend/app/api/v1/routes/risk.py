from fastapi import APIRouter, Depends, status
from app.models.common import APIResponse
from app.models.risk_flag import RiskFlagOut
from app.services import risk_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/risk", tags=["risk"])

from pydantic import BaseModel

class FlagStatusUpdate(BaseModel):
    status: str

@router.get("/enterprise/{enterprise_id}", response_model=APIResponse)
async def get_risk_flags(
    enterprise_id: str,
    user: dict = Depends(get_current_user)
):
    flags = await risk_service.get_active_flags(enterprise_id, user)
    return APIResponse(success=True, data=[RiskFlagOut(**f).model_dump(mode="json") for f in flags])

@router.post("/enterprise/{enterprise_id}/evaluate", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def evaluate_risk_flags(
    enterprise_id: str,
    user: dict = Depends(get_current_user)
):
    flags = await risk_service.evaluate_risk_flags(enterprise_id, user)
    return APIResponse(success=True, data=[RiskFlagOut(**f).model_dump(mode="json") for f in flags])

@router.patch("/enterprise/{enterprise_id}/flags/{flag_id}", response_model=APIResponse)
async def update_flag_status(
    enterprise_id: str,
    flag_id: str,
    req: FlagStatusUpdate,
    user: dict = Depends(get_current_user)
):
    result = await risk_service.update_flag_status(enterprise_id, flag_id, req.status, user)
    return APIResponse(success=True, data=RiskFlagOut(**result).model_dump(mode="json"))
