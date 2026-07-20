import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_staff_creation_by_admin(admin_token):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": "officer.nashik@pravaha.org",
                "password": "SecurePassword123",
                "role": "field_officer",
                "full_name": "Ramesh Patil",
            },
        )
    assert resp.status_code == 201
    data = resp.json()["data"]
    assert data["role"] == "field_officer"

@pytest.mark.asyncio
async def test_non_admin_cannot_create_staff(enterprise_user_token):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
            json={
                "email": "hacker@pravaha.org",
                "password": "Password123",
                "role": "field_officer",
                "full_name": "Hacker User",
            },
        )
    assert resp.status_code == 403
