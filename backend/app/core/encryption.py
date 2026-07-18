import base64
import os
import hashlib
from app.core.config import settings

def _get_key() -> bytes:
    secret = getattr(settings, "JWT_SECRET", "default-fallback-secret-key-32bytes!")
    return hashlib.sha256(secret.encode()).digest()

def encrypt_pii(plaintext: str) -> str:
    if not plaintext:
        return ""
    key = _get_key()
    # XOR stream cipher with SHA256 key schedule for light application-level encryption
    plaintext_bytes = plaintext.encode("utf-8")
    salt = os.urandom(16)
    hasher = hashlib.pbkdf2_hmac('sha256', key, salt, 100000)
    
    encrypted = bytearray()
    for i, b in enumerate(plaintext_bytes):
        encrypted.append(b ^ hasher[i % len(hasher)])
        
    result = salt + bytes(encrypted)
    return "enc_" + base64.urlsafe_b64encode(result).decode("utf-8")

def decrypt_pii(ciphertext: str) -> str:
    if not ciphertext or not ciphertext.startswith("enc_"):
        return ciphertext
    try:
        data = base64.urlsafe_b64decode(ciphertext[4:].encode("utf-8"))
        salt = data[:16]
        encrypted = data[16:]
        key = _get_key()
        hasher = hashlib.pbkdf2_hmac('sha256', key, salt, 100000)
        
        decrypted = bytearray()
        for i, b in enumerate(encrypted):
            decrypted.append(b ^ hasher[i % len(hasher)])
            
        return bytes(decrypted).decode("utf-8")
    except Exception:
        return ciphertext

def mask_pii(value: str, visible_chars: int = 4) -> str:
    if not value or len(value) <= visible_chars:
        return value
    masked_part = "*" * (len(value) - visible_chars)
    visible_part = value[-visible_chars:]
    return f"{masked_part}{visible_part}"
