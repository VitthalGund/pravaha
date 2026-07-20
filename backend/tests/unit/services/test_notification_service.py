import pytest
from app.services.notification_service import dispatch_notification, sms_provider

@pytest.mark.asyncio
async def test_seasonal_normal_never_notifies():
    flag = {"id": "1", "flag_type": "seasonal_normal", "severity": "watch"}
    res = await dispatch_notification(flag)
    assert res["pushed"] is False
    assert res["sms_sent"] is False

@pytest.mark.asyncio
async def test_high_severity_triggers_sms():
    flag = {"id": "2", "flag_type": "market_shock", "severity": "high", "reason_codes": ["Feed spike"], "suggested_action": "Act now"}
    res = await dispatch_notification(flag)
    assert res["pushed"] is True
    assert res["sms_sent"] is True
    assert sms_provider.send_called is True

