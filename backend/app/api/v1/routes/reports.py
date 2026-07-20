from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from app.models.common import APIResponse
from app.core.dependencies import require_role
import uuid

router = APIRouter(prefix="/reports", tags=["reports"])

class ReportRequest(BaseModel):
    enterprise_id: str

@router.post("/generate", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(req: ReportRequest, user: dict = Depends(require_role("hq_risk_officer", "admin"))):
    report_id = str(uuid.uuid4())
    presigned_url = f"https://pravaha-minio.local/reports/report-{report_id}.pdf"
    return APIResponse(
        success=True,
        data={
            "report_id": report_id,
            "enterprise_id": req.enterprise_id,
            "download_url": presigned_url,
            "expires_in_seconds": 3600,
        }
    )
