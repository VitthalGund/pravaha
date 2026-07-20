import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_generate_and_get_forecast(enterprise_user_token, seed_enterprise):
    ent_id = str(seed_enterprise["_id"])

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Generate forecast
        gen_resp = await ac.post(
            f"/api/v1/forecasts/enterprise/{ent_id}/generate",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
        )
        assert gen_resp.status_code == 201
        data = gen_resp.json()["data"]
        assert data["enterprise_id"] == ent_id
        assert len(data["predicted_series"]) == 3

        # Get latest forecast
        get_resp = await ac.get(
            f"/api/v1/forecasts/enterprise/{ent_id}/latest",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
        )
        assert get_resp.status_code == 200
        assert get_resp.json()["data"]["id"] == data["id"]
