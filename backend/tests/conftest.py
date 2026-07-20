import pytest
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.db import mongo
from app.core.security import create_access_token

settings.MONGODB_DB_NAME = "pravaha_test"

@pytest.fixture(autouse=True)
async def setup_test_db():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    mongo.db.client = client
    yield
    mongo.db.client = None


@pytest.fixture
def enterprise_user_token():
    return create_access_token({"sub": "test_user_id", "role": "enterprise_owner"})

@pytest.fixture
def officer_token():
    return create_access_token({"sub": "officer_id", "role": "field_officer"})

@pytest.fixture
def hq_token():
    return create_access_token({"sub": "hq_id", "role": "hq_risk_officer"})

@pytest.fixture
def admin_token():
    return create_access_token({"sub": "admin_id", "role": "admin"})

@pytest.fixture
async def seed_enterprise_user():
    db = mongo.get_client()[settings.MONGODB_DB_NAME]
    user = {"_id": "test_user_id", "phone": "1234567890", "role": "enterprise_owner"}
    await db["users"].insert_one(user)
    yield user
    await db["users"].delete_one({"_id": "test_user_id"})
