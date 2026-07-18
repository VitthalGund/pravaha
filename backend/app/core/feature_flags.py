import logging

_FEATURE_FLAGS = {
    "enable_new_sector_templates": True,
    "enable_real_sms": False,
    "enable_aa_integration": False,
    "enable_bhashini_tts": True,
}

def is_enabled(flag_name: str, default: bool = False) -> bool:
    return _FEATURE_FLAGS.get(flag_name, default)

def set_flag(flag_name: str, enabled: bool) -> None:
    _FEATURE_FLAGS[flag_name] = enabled
    logging.info(f"[feature_flags] Flag {flag_name} set to {enabled}")

def get_all_flags() -> dict:
    return _FEATURE_FLAGS.copy()
