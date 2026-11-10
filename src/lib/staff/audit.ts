import "server-only";
import { getDb } from "@/lib/db/client";
import type { ActorKind, StaffActor } from "@/lib/staff/account-rules";
import { dayRange, type AuditAction, type AuditWho } from "@/lib/staff/audit-rules";

/**
 * "ใครทำอะไร" (owner 10/11: "พี่เห็นว่าใครคีย์ออเดอร์ไหน ใครให้ส่วนลดอะไร ใครกดรับออเดอร์เว็บ"): one row per thing a person did in the
 * back office, in `staff_audit` (migration 0029). Append-only: this file only inserts and reads. A failed write is logged and
 * never stops the action itself — the order step already happened and must not be undone by the record of it.
 * Action names, their Thai words and the filters = src/lib/staff/audit-rules.ts.
 */
export function recordStaffAction(actor: StaffActor, action: AuditAction, extra: { orderNumber?: string | null; detail?: string | null } = {}): void {
  try {
    getDb()
      .prepare("INSERT INTO staff_audit (actor_kind, staff_id, actor_name, action, order_number, detail) VALUES (?, ?, ?, ?, ?, ?)")
      .run(actor.kind, actor.accountId, actor.name, action, extra.orderNumber ?? null, extra.detail ? extra.detail.slice(0, 300) : null);
  } catch (err) {
    console.error(`[staff-audit] not recorded (${action}): ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** A LINE order keyed by a named person: the order points at the account (keyed_by keeps the name as it read that day). */
export function markKeyedBy(orderNumber: string, actor: StaffActor): void {
  if (actor.accountId === null) return;
  getDb().prepare("UPDATE orders SET keyed_by_staff_id = ? WHERE order_number = ?").run(actor.accountId, orderNumber);
}

export interface AuditRow {
  id: number;
  at: string;
  actorKind: ActorKind;
  accountId: number | null;
  actorName: string;
  action: string;
  orderNumber: string | null;
  detail: string | null;
}

interface Row {
  id: number;
  at: string;
  actor_kind: ActorKind;
  staff_id: number | null;
  actor_name: string;
  action: string;
  order_number: string | null;
  detail: string | null;
}

const toRow = (r: Row): AuditRow => ({
  id: r.id,
  at: r.at,
  actorKind: r.actor_kind,
  accountId: r.staff_id,
  actorName: r.actor_name,
  action: r.action,
  orderNumber: r.order_number,
  detail: r.detail,
});

function whoSql(who: AuditWho): { sql: string; args: (string | number)[] } {
  if (who.kind === "account") return { sql: " AND actor_kind = 'account' AND staff_id = ?", args: [who.id] };
  if (who.kind === "owner" || who.kind === "shared") return { sql: " AND actor_kind = ?", args: [who.kind] };
  return { sql: "", args: [] };
}

/** One Bangkok day, newest first, at most `limit` rows (sign-ins and sign-outs included: the owner sees when someone came in). */
export function auditForDay(day: string, who: AuditWho, limit = 500): AuditRow[] {
  const { from, to } = dayRange(day);
  const w = whoSql(who);
  return (
    getDb()
      .prepare(`SELECT * FROM staff_audit WHERE at >= ? AND at < ?${w.sql} ORDER BY at DESC, id DESC LIMIT ?`)
      .all(from, to, ...w.args, limit) as Row[]
  ).map(toRow);
}

/** How many things each person did that day — the chips on "ใครทำอะไร". Sign-in/out are not work and are not counted. */
export function auditCounts(day: string): { kind: ActorKind; accountId: number | null; name: string; n: number }[] {
  const { from, to } = dayRange(day);
  return (
    getDb()
      .prepare(
        `SELECT actor_kind AS kind, staff_id AS accountId, MAX(actor_name) AS name, COUNT(*) AS n FROM staff_audit
         WHERE at >= ? AND at < ? AND action NOT IN ('sign-in', 'sign-out') GROUP BY actor_kind, staff_id ORDER BY n DESC`
      )
      .all(from, to) as { kind: ActorKind; accountId: number | null; name: string; n: number }[]
  );
}

/** Everything the team did on one order, oldest first — shown on the staff order page. */
export function auditForOrder(orderNumber: string): AuditRow[] {
  return (getDb().prepare("SELECT * FROM staff_audit WHERE order_number = ? ORDER BY at, id LIMIT 100").all(orderNumber) as Row[]).map(toRow);
}

/** What one person did today, by action — "วันนี้ <ชื่อ> ทำไปแล้ว" on the admin home (owner 10/11). */
export function myCountsToday(actor: StaffActor, day: string): Record<string, number> {
  const { from, to } = dayRange(day);
  const w = actor.kind === "account" ? whoSql({ kind: "account", id: actor.accountId ?? -1 }) : whoSql({ kind: actor.kind });
  const rows = getDb()
    .prepare(`SELECT action, COUNT(*) AS n FROM staff_audit WHERE at >= ? AND at < ?${w.sql} GROUP BY action`)
    .all(from, to, ...w.args) as { action: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.action, r.n]));
}
