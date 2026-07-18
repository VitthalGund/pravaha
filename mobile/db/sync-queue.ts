import { db } from './sqlite';
import { apiRequest } from '../lib/api-client';

export async function syncPendingEntries() {
  try {
    const pending = db.getAllSync<any>('SELECT * FROM cash_flow_entries WHERE synced = 0');
    if (!pending || pending.length === 0) return;
    
    await apiRequest('/cash-flow/sync', {
      method: 'POST',
      body: JSON.stringify({ entries: pending }),
    });

    const ids = pending.map((e) => e.client_entry_id);
    const placeholders = ids.map(() => '?').join(',');
    db.runSync(`UPDATE cash_flow_entries SET synced = 1 WHERE client_entry_id IN (${placeholders})`, ids);
  } catch (err) {
    // Retried on next sync trigger
  }
}
