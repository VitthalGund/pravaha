import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_create_enterprise_flow(enterprise_user_token):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post(
            "/api/v1/enterprises",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
            json={
                "name": "Kamdhenu Dairy Enterprise",
                "sector": "dairy",
                "district": "Nashik",
                "state": "Maharashtra",
            },
        )
    assert resp.status_code == 201
    data = resp.json()["data"]
    assert data["sector"] == "dairy"
    assert data["credit_readiness_stage"] == "grant_dependent"

@pytest.mark.asyncio
async def test_invalid_sector_returns_422(enterprise_user_token):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post(
            "/api/v1/enterprises",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
            json={
                "name": "Invalid Sector Enterprise",
                "sector": "crypto",
                "district": "Nashik",
                "state": "Maharashtra",
            },
        )
    assert resp.status_code == 422

@pytest.mark.asyncio
async def test_shg_search_flow(enterprise_user_token):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get(
            "/api/v1/shgs/search?q=mahila",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
        )
    assert resp.status_code == 200
    assert isinstance(resp.json()["data"], list)
