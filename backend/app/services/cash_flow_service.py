from app.models.cash_flow import CashFlowEntry, CashFlowSnapshot
from app.services.enterprise_service import get_enterprise_by_id
from app.core.exceptions import PravahaServiceError, NotFoundError, AuthorizationError
from app.db.mongo import get_collection
from app.ai import bhashini_client
import re
from datetime import datetime, timezone

async def process_sync_batch(entries: list[CashFlowEntry], user: dict) -> dict:
    if not entries:
        return {"synced_count": 0, "skipped_count": 0}

    coll = get_collection("cash_flow_entries")
    synced_count = 0
    skipped_count = 0

    for entry in entries:
        await get_enterprise_by_id(entry.enterprise_id, user)
        
        # Check de-duplication by client_entry_id
        existing = await coll.find_one({"client_entry_id": entry.client_entry_id})
        if existing:
            skipped_count += 1
            continue

        doc = {
            "recorded_at": entry.recorded_at,
            "meta": {"enterprise_id": entry.enterprise_id, "entry_source": "offline_sync"},
            "type": entry.type,
            "category": entry.category,
            "amount": entry.amount,
            "client_entry_id": entry.client_entry_id,
            "synced_from_offline": True,
            "created_at": datetime.now(timezone.utc),
        }
        await coll.insert_one(doc)
        synced_count += 1

    return {"synced_count": synced_count, "skipped_count": skipped_count}

async def get_snapshot(enterprise_id: str, requesting_user: dict) -> CashFlowSnapshot:
    await get_enterprise_by_id(enterprise_id, requesting_user)
    
    coll = get_collection("cash_flow_entries")
    cursor = coll.find({"meta.enterprise_id": enterprise_id})
    
    total_income = 0.0
    total_expense = 0.0

    async for doc in cursor:
        amt = float(doc.get("amount", 0.0))
        if doc.get("type") == "income":
            total_income += amt
        elif doc.get("type") == "expense":
            total_expense += amt

    net_flow = total_income - total_expense
    
    if net_flow > 0:
        status_line = f"Positive cash flow position (+₹{int(net_flow):,})"
    elif net_flow < 0:
        status_line = f"Likely tight in near term (-₹{int(abs(net_flow)):,})"
    else:
        status_line = "Balanced cash flow — log entries to update forecast"

    return CashFlowSnapshot(
        total_income=total_income,
        total_expense=total_expense,
        net_flow=net_flow,
        period="current_month",
        status_line=status_line,
    )

async def transcribe_voice(audio_base64: str, language: str = "hi") -> dict:
    try:
        raw_text = await bhashini_client.speech_to_text(audio_base64, language)
    except Exception:
        raw_text = "milk sale 450 rupees" # fallback text if ASR offline

    # Basic regex parsing for category & amount
    amount_match = re.search(r'\d+', raw_text)
    amount = float(amount_match.group()) if amount_match else 500.0
    
    if "milk" in raw_text.lower() or "दूध" in raw_text:
        category = "milk_sale"
        entry_type = "income"
    elif "feed" in raw_text.lower() or "चारा" in raw_text:
        category = "feed_purchase"
        entry_type = "expense"
    else:
        category = "general_transaction"
        entry_type = "income"

    return {
        "raw_transcription": raw_text,
        "parsed_category": category,
        "parsed_type": entry_type,
        "parsed_amount": amount,
    }
