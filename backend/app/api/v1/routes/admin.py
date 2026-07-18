from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from app.models.common import APIResponse
from app.models.user import UserCreate, UserOut
from app.services import admin_service
from app.core.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["admin"])

class PortfolioAssignRequest(BaseModel):
    enterprise_ids: list[str]

@router.post("/users", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_staff(
    user_in: UserCreate,
    admin_user: dict = Depends(require_role("admin"))
):
    result = await admin_service.create_staff_user(user_in)
    return APIResponse(success=True, data=UserOut(**result).model_dump(mode="json"))

@router.patch("/users/{user_id}/assign-portfolio", response_model=APIResponse)
async def assign_portfolio(
    user_id: str,
    req: PortfolioAssignRequest,
    admin_user: dict = Depends(require_role("admin"))
):
    result = await admin_service.assign_portfolio(user_id, req.enterprise_ids)
    return APIResponse(success=True, data=result)
