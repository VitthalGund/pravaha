import pytest
from app.core.encryption import encrypt_pii, decrypt_pii, mask_pii

def test_encryption_decryption_roundtrip():
    phone = "+919876543210"
    encrypted = encrypt_pii(phone)
    assert encrypted != phone
    assert encrypted.startswith("enc_")
    
    decrypted = decrypt_pii(encrypted)
    assert decrypted == phone

def test_mask_pii():
    phone = "+919876543210"
    masked = mask_pii(phone, 4)
    assert masked.endswith("3210")
    assert "*" in masked
