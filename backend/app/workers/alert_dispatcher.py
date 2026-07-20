from app.services.notification_service import dispatch_notification

async def process_new_flag_event(flag_doc: dict):
    # Worker background handler for risk_flag_raised events
    return await dispatch_notification(flag_doc)
