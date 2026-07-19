import logging
from app.ai import gemini_client, ollama_client

async def is_online() -> bool:
    return True

async def gemini_quota_available() -> bool:
    return True

async def log_agent_error(source: str, error: Exception, **context) -> None:
    logging.error(f"{source} error: {error}")

def rule_based_fallback_explanation(structured_reason: dict) -> str:
    return "Rule-based fallback explanation"

async def get_explanation(structured_reason: dict) -> str:
    try:
        if await is_online() and await gemini_quota_available():
            try:
                return await gemini_client.explain(structured_reason)
            except Exception as e:
                await log_agent_error("Gemini", e)
        
        try:
            return await ollama_client.explain(structured_reason)
        except Exception as e:
            await log_agent_error("Ollama", e)
            
    except Exception as e:
        await log_agent_error("Router", e)
        
    return rule_based_fallback_explanation(structured_reason)
