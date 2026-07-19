class BhashiniError(Exception): pass

async def _get_pipeline_config(task, source_lang, target_lang) -> dict:
    return {}

async def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    return text

async def speech_to_text(audio_base64: str, source_lang: str) -> str:
    return "speech text"

async def text_to_speech(text: str, target_lang: str) -> bytes:
    return b"audio"
