import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_get_risk_flags_flow(enterprise_user_token, seed_enterprise):
    ent_id = str(seed_enterprise["_id"])
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get(
            f"/api/v1/risk/enterprise/{ent_id}",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
        )
    assert resp.status_code == 200
    flags = resp.json()["data"]
    assert len(flags) >= 1
    assert "suggested_action" in flags[0]
