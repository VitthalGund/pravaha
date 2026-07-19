from app.ai import bhashini_client, ollama_client
import logging

async def translate(text: str, source_lang: str, target_lang: str) -> str:
    if source_lang == target_lang:
        return text
    try:
        try:
            return await bhashini_client.translate_text(text, source_lang, target_lang)
        except Exception as e:
            logging.error(f"Bhashini error: {e}")
        
        try:
            return await ollama_client.translate_offline(text, source_lang, target_lang)
        except Exception as e:
            logging.error(f"Ollama translation error: {e}")
            
    except Exception as e:
        logging.error(f"Translation router error: {e}")
        
    return text
