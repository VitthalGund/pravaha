import pytest
from app.ai.translation_service import translate

@pytest.mark.asyncio
async def test_same_lang():
    res = await translate("hello", "en", "en")
    assert res == "hello"

@pytest.mark.asyncio
async def test_translation_never_raises():
    res = await translate("hello", "en", "hi")
    assert isinstance(res, str)
