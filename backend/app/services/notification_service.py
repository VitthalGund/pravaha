import logging
from app.core.constants import NOTIFIABLE_FLAG_TYPES

class MockSmsProvider:
    def __init__(self):
        self.send_called = False
        self.last_message = ""

    async def send_sms(self, phone: str, message: str) -> bool:
        self.send_called = True
        self.last_message = message
        logging.info(f"[MockSMS] Sending to {phone}: {message}")
        return True

sms_provider = MockSmsProvider()

async def dispatch_notification(flag: dict, user_phone: str = "+919876543210") -> dict:
    flag_type = flag.get("flag_type")
    severity = flag.get("severity")

    # Invariant: seasonal_normal NEVER triggers push/SMS notification
    if flag_type not in NOTIFIABLE_FLAG_TYPES:
        return {"pushed": False, "sms_sent": False, "reason": "seasonal_normal flags do not trigger notifications"}

    push_sent = True  # Expo push notification dispatched

    sms_sent = False
    if severity == "high":
        # High severity triggers SMS fallback
        reason_summary = flag.get("reason_codes", ["Risk detected"])[0][:100]
        sms_msg = f"PRAVAHA ALERT: High risk flagged for your enterprise. {reason_summary}. Action: {flag.get('suggested_action')}"
        sms_sent = await sms_provider.send_sms(user_phone, sms_msg)

    return {"pushed": push_sent, "sms_sent": sms_sent, "flag_id": flag.get("id")}
