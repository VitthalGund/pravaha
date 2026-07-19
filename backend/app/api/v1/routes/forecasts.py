from fastapi import APIRouter, Depends, status
from app.models.common import APIResponse
from app.models.forecast import ForecastOut
from app.services import forecast_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/forecasts", tags=["forecasts"])

@router.get("/enterprise/{enterprise_id}/latest", response_model=APIResponse)
async def get_latest_forecast(
    enterprise_id: str,
    user: dict = Depends(get_current_user)
):
    result = await forecast_service.get_latest_forecast(enterprise_id, user)
    return APIResponse(success=True, data=ForecastOut(**result).model_dump(mode="json"))

@router.post("/enterprise/{enterprise_id}/generate", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def generate_forecast(
    enterprise_id: str,
    horizon_months: int = 3,
    user: dict = Depends(get_current_user)
):
    result = await forecast_service.generate_and_save_forecast(enterprise_id, horizon_months, user)
    return APIResponse(success=True, data=ForecastOut(**result).model_dump(mode="json"))
