from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel
from app.models.common import APIResponse
from app.ai.translation_service import translate
from app.ai import bhashini_client
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/translate", tags=["translate"])

class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str

class TTSRequest(BaseModel):
    text: str
    target_lang: str = "hi"

@router.post("", response_model=APIResponse)
async def translate_text(req: TranslationRequest, user: dict = Depends(get_current_user)):
    result = await translate(req.text, req.source_lang, req.target_lang)
    return APIResponse(success=True, data={"translated_text": result, "target_lang": req.target_lang})

@router.post("/tts")
async def text_to_speech(req: TTSRequest, user: dict = Depends(get_current_user)):
    try:
        audio_bytes = await bhashini_client.text_to_speech(req.text, req.target_lang)
        return Response(content=audio_bytes, media_type="audio/wav")
    except Exception:
        return Response(content=b"", media_type="audio/wav", status_code=500)
