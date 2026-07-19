from fastapi import APIRouter, Depends, status
from app.models.common import APIResponse
from app.models.obligation import ObligationCreate, ObligationOut
from app.services import obligation_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/obligations", tags=["obligations"])

@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def add_obligation(
    obl_in: ObligationCreate,
    user: dict = Depends(get_current_user)
):
    result = await obligation_service.create_obligation(obl_in, requesting_user=user)
    return APIResponse(success=True, data=ObligationOut(**result).model_dump(mode="json"))

@router.get("/enterprise/{enterprise_id}", response_model=APIResponse)
async def get_obligations(
    enterprise_id: str,
    user: dict = Depends(get_current_user)
):
    results = await obligation_service.get_enterprise_obligations(enterprise_id, user)
    return APIResponse(success=True, data=[ObligationOut(**o).model_dump(mode="json") for o in results])
