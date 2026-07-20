import pytest
from app.db.indexes import ensure_time_series_collections, ensure_indexes
from app.db.mongo import get_client
from app.core.config import settings

@pytest.mark.asyncio
async def test_ensure_time_series_collections():
    await ensure_time_series_collections()
    db = get_client()[settings.MONGODB_DB_NAME]
    colls = await db.list_collection_names()
    assert "cash_flow_entries" in colls

@pytest.mark.asyncio
async def test_ensure_indexes():
    await ensure_indexes()
    db = get_client()[settings.MONGODB_DB_NAME]
    users_indexes = await db["users"].index_information()
    assert any("phone" in idx for idx in users_indexes)
