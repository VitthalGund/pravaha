import pytest
from app.ai.ai_router import get_explanation

@pytest.mark.asyncio
async def test_ai_router_never_raises():
    res = await get_explanation({"some": "data"})
    assert isinstance(res, str)
