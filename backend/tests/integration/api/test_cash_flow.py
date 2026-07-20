import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_cash_flow_sync_and_snapshot(enterprise_user_token):
    entries = [
        {
            "client_entry_id": "test-uuid-income-1",
            "enterprise_id": "ent-123",
            "type": "income",
            "category": "milk_sale",
            "amount": 1200.0,
            "recorded_at": "2026-07-20T10:00:00Z",
        },
        {
            "client_entry_id": "test-uuid-expense-1",
            "enterprise_id": "ent-123",
            "type": "expense",
            "category": "feed_purchase",
            "amount": 400.0,
            "recorded_at": "2026-07-20T11:00:00Z",
        },
    ]

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Sync entries
        sync_resp = await ac.post(
            "/api/v1/cash-flow/sync",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
            json={"entries": entries},
        )
        assert sync_resp.status_code == 200
        assert sync_resp.json()["data"]["synced_count"] == 2

        # Verify snapshot
        snap_resp = await ac.get(
            "/api/v1/cash-flow/enterprise/ent-123/snapshot",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
        )
        assert snap_resp.status_code == 200
        snap_data = snap_resp.json()["data"]
        assert snap_data["total_income"] == 1200.0
        assert snap_data["total_expense"] == 400.0
        assert snap_data["net_flow"] == 800.0

@pytest.mark.asyncio
async def test_cash_flow_sync_deduplication(enterprise_user_token):
    entry = {
        "client_entry_id": "duplicate-uuid-1",
        "enterprise_id": "ent-dedup",
        "type": "income",
        "category": "milk_sale",
        "amount": 500.0,
        "recorded_at": "2026-07-20T10:00:00Z",
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # First sync
        res1 = await ac.post(
            "/api/v1/cash-flow/sync",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
            json={"entries": [entry]},
        )
        assert res1.json()["data"]["synced_count"] == 1

        # Second sync with identical UUID
        res2 = await ac.post(
            "/api/v1/cash-flow/sync",
            headers={"Authorization": f"Bearer {enterprise_user_token}"},
            json={"entries": [entry]},
        )
        assert res2.json()["data"]["synced_count"] == 0
        assert res2.json()["data"]["skipped_count"] == 1
