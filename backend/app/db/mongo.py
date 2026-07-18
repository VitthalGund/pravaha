from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

def get_client() -> AsyncIOMotorClient:
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
    return db.client

def get_collection(name: str):
    return get_client()[settings.MONGODB_DB_NAME][name]

def close_client():
    if db.client is not None:
        db.client.close()
        db.client = None

