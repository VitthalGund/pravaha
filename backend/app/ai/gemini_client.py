class GeminiError(Exception): pass

async def explain(structured_reason: dict) -> str:
    return "Gemini explanation"

def _build_prompt(structured_reason: dict) -> str:
    return str(structured_reason)
