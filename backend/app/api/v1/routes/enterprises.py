from fastapi import APIRouter, Depends, Query, status
from app.models.common import APIResponse
from app.models.enterprise import EnterpriseCreate, EnterpriseOut
from app.services import enterprise_service
from app.core.dependencies import get_current_user, require_role

router = APIRouter(tags=["enterprises"])

@router.post("/enterprises", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_enterprise(
    enterprise_in: EnterpriseCreate,
    user: dict = Depends(require_role("enterprise_owner", "admin"))
):
    owner_id = user["sub"]
    result = await enterprise_service.create_enterprise(enterprise_in, owner_user_id=owner_id)
    return APIResponse(success=True, data=EnterpriseOut(**result).model_dump(mode="json"))

@router.get("/enterprises/{enterprise_id}", response_model=APIResponse)
async def get_enterprise(
    enterprise_id: str,
    user: dict = Depends(get_current_user)
):
    result = await enterprise_service.get_enterprise_by_id(enterprise_id, requesting_user=user)
    return APIResponse(success=True, data=EnterpriseOut(**result).model_dump(mode="json"))

@router.get("/shgs/search", response_model=APIResponse)
async def search_shgs(
    q: str = Query(..., min_length=1),
    user: dict = Depends(get_current_user)
):
    results = await enterprise_service.search_shgs(q)
    return APIResponse(success=True, data=results)

@router.get("/fpos/search", response_model=APIResponse)
async def search_fpos(
    q: str = Query(..., min_length=1),
    user: dict = Depends(get_current_user)
):
    results = await enterprise_service.search_fpos(q)
    return APIResponse(success=True, data=results)
