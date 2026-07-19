class OllamaError(Exception): pass

async def explain(structured_reason: dict) -> str:
    return "Ollama explanation"

async def translate_offline(text: str, source_lang: str, target_lang: str) -> str:
    return text
