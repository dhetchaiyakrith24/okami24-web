import { jobOf, TODO_JOBS, type StaffJob } from "./jobs";
import type { OrderStatus } from "../commerce/order-status";

/**
 * The admin home's rules (owner 10/11 dashboard, design v2 passed 11/11). Pure, so admin-home-contract-test.ts runs it under
 * plain tsx. The page = src/app/staff/page.tsx · the look = src/app/staff/_components/AdminHome.tsx.
 */

/** A row the queue can sort: its status and when it entered that status (`since`, from order_status_history — the order's
 *  own time when the history has no row for it). */
export interface QueueItem {
  status: OrderStatus;
  createdAt: string;
  since: string | null;
}

const stepStart = (o: QueueItem) => o.since ?? o.createdAt;

/** Money first (a customer is waiting for "paid"), then the warehouse (nothing ships before it), then parcels — and inside a
 *  step, the one waiting longest first. Orders outside the three to-do steps are left out. */
export function priorityQueue<T extends QueueItem>(rows: readonly T[]): T[] {
  const rank = (s: OrderStatus) => (TODO_JOBS as readonly string[]).indexOf(jobOf(s));
  return rows
    .filter((o) => rank(o.status) >= 0)
    .slice()
    .sort((a, b) => rank(a.status) - rank(b.status) || stepStart(a).localeCompare(stepStart(b)));
}

/** A day or more in one step = late (red card + red dot on the home). */
export const LATE_MS = 24 * 3_600_000;

/** "20 นาที" · "3 ชม." · "2 วัน" — how long since `iso`. `late` = a day or more. */
export function waitAge(iso: string, nowMs: number): { text: string; late: boolean } {
  const ms = Math.max(0, nowMs - Date.parse(iso));
  const minutes = Math.floor(ms / 60_000);
  const late = ms >= LATE_MS;
  if (minutes < 60) return { text: `${Math.max(1, minutes)} นาที`, late };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { text: `${hours} ชม.`, late };
  return { text: `${Math.floor(hours / 24)} วัน`, late };
}

/** The age of one queued order, counted from the step it waits in. */
export const stepAge = (o: QueueItem, nowMs: number) => waitAge(stepStart(o), nowMs);

/** What just happened before the order reached its step — "แนบสลิปแล้ว 20 นาที" · "ส่งคลังแล้ว 3 วัน". */
export const STEP_SINCE: Record<StaffJob, string> = {
  slip: "แนบสลิปแล้ว",
  warehouse: "ยืนยันเงินแล้ว",
  tracking: "ส่งคลังแล้ว",
  done: "ส่งแล้ว",
  cancelled: "ยกเลิกแล้ว",
  unpaid: "สั่งแล้ว",
};

/** The oldest waiting order of each to-do step (the step tiles' "เก่าสุด …"), null for an empty step. */
export function oldestPerStep<T extends QueueItem>(rows: readonly T[]): Record<StaffJob, T | null> {
  const out = { slip: null, warehouse: null, tracking: null, done: null, cancelled: null, unpaid: null } as Record<StaffJob, T | null>;
  for (const o of priorityQueue(rows)) {
    const job = jobOf(o.status);
    if (!out[job]) out[job] = o;
  }
  return out;
}

const HOME_DATE = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", weekday: "long", day: "numeric", month: "short" });

/** "วันอังคารที่ 10 พ.ย." — the line over the greeting, for a Bangkok date (YYYY-MM-DD). */
export const homeDate = (date: string) => HOME_DATE.format(new Date(`${date}T12:00:00+07:00`));

/** The home's greeting: a person by name; the shared password and the owner (who sees the banner) without one. */
export const greeting = (actor: { kind: "shared" | "account" | "owner"; name: string }) => (actor.kind === "account" ? `สวัสดีค่ะ ${actor.name}` : "สวัสดีค่ะ");

/** The done/error notice after a button on the home — only for an order the address names, and only codes we know. */
export function homeNotice(
  q: { order?: string; done?: string; error?: string },
  doneText: Record<string, string>,
  errorText: Record<string, string>
): { tone: "ok" | "error"; text: string; orderNumber: string } | null {
  if (!q.order) return null;
  if (q.error && errorText[q.error]) return { tone: "error", text: errorText[q.error], orderNumber: q.order };
  if (q.done && doneText[q.done]) return { tone: "ok", text: doneText[q.done], orderNumber: q.order };
  return null;
}

/** Where an order button lands (src/app/staff/actions.ts). `from=home` = back on the admin home with the order named, so the
 *  notice can say what happened; otherwise the order page, still carrying the list it was opened from (owner 26/10 B3). */
export function landing(orderNumber: string, from: string, isListName: (v: string) => boolean): string {
  if (from === "home") return `/staff?order=${encodeURIComponent(orderNumber)}&`;
  return `/staff/orders/${encodeURIComponent(orderNumber)}?${isListName(from) ? `from=${from}&` : ""}`;
}
