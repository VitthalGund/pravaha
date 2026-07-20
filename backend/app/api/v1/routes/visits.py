from fastapi import APIRouter, Depends, status
from app.models.common import APIResponse
from app.models.visit import VisitCreate, VisitOut
from app.services import visit_service
from app.core.dependencies import require_role

router = APIRouter(prefix="/visits", tags=["visits"])

@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def log_visit(
    visit_in: VisitCreate,
    user: dict = Depends(require_role("field_officer", "admin"))
):
    result = await visit_service.log_visit(visit_in, officer_user_id=user["sub"])
    return APIResponse(success=True, data=VisitOut(**result).model_dump(mode="json"))
