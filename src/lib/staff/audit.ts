import "server-only";
import { getDb } from "@/lib/db/client";
import type { StaffActor } from "@/lib/staff/account-rules";
import type { AuditAction } from "@/lib/staff/audit-rules";

/**
 * "ใครทำอะไร" (owner 10/11: "พี่เห็นว่าใครคีย์ออเดอร์ไหน ใครให้ส่วนลดอะไร ใครกดรับออเดอร์เว็บ"): one row per thing a person did in the
 * back office, in `staff_audit` (migration 0029). Append-only: this file only inserts and reads. A failed write is logged and
 * never stops the action itself — the order step already happened and must not be undone by the record of it.
 * Action names and their Thai words = src/lib/staff/audit-rules.ts.
 */
export function recordStaffAction(actor: StaffActor, action: AuditAction, extra: { orderNumber?: string | null; detail?: string | null } = {}): void {
  try {
    getDb()
      .prepare("INSERT INTO staff_audit (actor_kind, account_id, actor_name, action, order_number, detail) VALUES (?, ?, ?, ?, ?, ?)")
      .run(actor.kind, actor.accountId, actor.name, action, extra.orderNumber ?? null, extra.detail ? extra.detail.slice(0, 300) : null);
  } catch (err) {
    console.error(`[staff-audit] not recorded (${action}): ${err instanceof Error ? err.message : String(err)}`);
  }
}
