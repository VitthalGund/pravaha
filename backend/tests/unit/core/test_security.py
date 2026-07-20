import pytest
from app.core.security import create_access_token, decode_jwt, hash_pin, verify_pin

def test_jwt_roundtrip():
    token = create_access_token({"sub": "test", "role": "admin"})
    payload = decode_jwt(token)
    assert payload["sub"] == "test"
    assert payload["role"] == "admin"

def test_tampered_jwt():
    token = create_access_token({"sub": "test"})
    tampered = token[:-2] + "xx"
    assert decode_jwt(tampered) is None

def test_pin_validation():
    hashed = hash_pin("1234")
    assert verify_pin("1234", hashed) is True
    assert verify_pin("4321", hashed) is False

    with pytest.raises(ValueError):
        hash_pin("123")
    with pytest.raises(ValueError):
        hash_pin("12345")
    with pytest.raises(ValueError):
        hash_pin("abcd")
