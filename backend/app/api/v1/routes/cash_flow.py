from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from app.models.common import APIResponse
from app.models.cash_flow import CashFlowSyncRequest, CashFlowSnapshot
from app.services import cash_flow_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/cash-flow", tags=["cash-flow"])

class TranscribeRequest(BaseModel):
    audio_base64: str
    language: str = "hi"

@router.post("/sync", response_model=APIResponse)
async def sync_cash_flow(
    req: CashFlowSyncRequest,
    user: dict = Depends(get_current_user)
):
    result = await cash_flow_service.process_sync_batch(req.entries, user)
    return APIResponse(success=True, data=result)

@router.get("/enterprise/{enterprise_id}/snapshot", response_model=APIResponse)
async def get_enterprise_snapshot(
    enterprise_id: str,
    user: dict = Depends(get_current_user)
):
    snapshot = await cash_flow_service.get_snapshot(enterprise_id, user)
    return APIResponse(success=True, data=snapshot.model_dump())

@router.post("/transcribe", response_model=APIResponse)
async def transcribe_audio(
    req: TranscribeRequest,
    user: dict = Depends(get_current_user)
):
    result = await cash_flow_service.transcribe_voice(req.audio_base64, req.language)
    return APIResponse(success=True, data=result)
