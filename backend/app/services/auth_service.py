from app.models.user import UserCreate, UserOut, TokenResponse
from app.core.security import hash_password, hash_pin, create_access_token, create_refresh_token
from app.core.exceptions import ConflictError, AuthenticationError
from app.db.mongo import get_collection
import uuid
from datetime import datetime, timezone

async def register_user(user_in: UserCreate) -> dict:
    users_coll = get_collection("users")
    
    if user_in.phone:
        existing = await users_coll.find_one({"phone": user_in.phone})
        if existing: raise ConflictError("Phone already registered")
        
    if user_in.email:
        existing = await users_coll.find_one({"email": user_in.email})
        if existing: raise ConflictError("Email already registered")
        
    user_doc = user_in.model_dump()
    user_doc["_id"] = str(uuid.uuid4())
    user_doc["created_at"] = datetime.now(timezone.utc)
    
    if user_in.pin: user_doc["pin_hash"] = hash_pin(user_in.pin)
    if user_in.password: user_doc["password_hash"] = hash_password(user_in.password)
        
    await users_coll.insert_one(user_doc)
    user_doc["id"] = user_doc["_id"]
    return user_doc

async def request_otp(phone: str) -> None:
    pass

async def verify_otp(phone: str, otp: str) -> TokenResponse:
    users_coll = get_collection("users")
    user = await users_coll.find_one({"phone": phone})
    if not user: raise AuthenticationError("User not found")
    
    access = create_access_token({"sub": user["_id"], "role": user.get("role")})
    refresh = create_refresh_token({"sub": user["_id"]})
    return TokenResponse(access_token=access, refresh_token=refresh)

async def login(login_data) -> TokenResponse:
    users_coll = get_collection("users")
    query = {}
    if login_data.email: query["email"] = login_data.email
    elif login_data.phone: query["phone"] = login_data.phone
    else: raise AuthenticationError("Missing credentials")
    
    user = await users_coll.find_one(query)
    if not user: raise AuthenticationError("Invalid credentials")
    
    access = create_access_token({"sub": user["_id"], "role": user.get("role")})
    refresh = create_refresh_token({"sub": user["_id"]})
    return TokenResponse(access_token=access, refresh_token=refresh)
