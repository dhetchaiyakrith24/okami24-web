/**
 * Is Shipnity still sending stock? (owner 28/10: "ถ้าเกิดวันไหนหยุดอัพเดตไปดื้อๆ เราจะรู้และแก้ได้อย่างไร" → a status that is
 * always on in Okami dev, red when the link is down, and a LINE alert.) Pure — watch.ts reads the database and passes the
 * facts in; the contract test holds the rules.
 *
 *   - down: no live key (Shipnity cannot sign in) · Shipnity never sent a number · an order went to the warehouse more
 *     than DOWN_AFTER_ORDER_MIN ago and no stock number arrived since — the warehouse's stock moves when it takes an
 *     order, so silence after one means the push stopped;
 *   - quiet: nothing for QUIET_HOURS without such an order — a day nothing moved is quiet too, so it is not an alarm;
 *   - ok: anything else.
 * Only orders sent in the last LOOKBACK_HOURS count, so one old order never keeps the light red for ever.
 */

export type FeedState = "ok" | "quiet" | "down";

export interface FeedFacts {
  now: number;
  activeKeys: number;
  /** The newest reported_at in woo_stock_reports (ISO), null = Shipnity never sent a number. */
  lastPushAt: string | null;
  /** Codes Shipnity has reported at least once. */
  reportedCodes: number;
  /** Orders sent to Shipnity (first_sent_at, ISO), newest first. */
  sends: { orderNumber: string; sentAt: string }[];
}

export interface FeedHealth {
  state: FeedState;
  lastPushAt: string | null;
  reportedCodes: number;
  /** What staff read under the light (Thai), null when all is well. */
  reason: string | null;
}

export const DOWN_AFTER_ORDER_MIN = 180;
export const QUIET_HOURS = 24;
export const LOOKBACK_HOURS = 48;

const BANGKOK = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "28/10 22:53" in Bangkok time. */
export function bangkokShort(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : BANGKOK.format(d).replace(",", "");
}

export function judgeFeed(f: FeedFacts): FeedHealth {
  const base = { lastPushAt: f.lastPushAt, reportedCodes: f.reportedCodes };
  if (f.activeKeys === 0) return { ...base, state: "down", reason: "ไม่มีคีย์ที่ใช้อยู่ — Shipnity เข้าเว็บไม่ได้ ส่งสต็อกไม่ได้" };
  if (f.lastPushAt === null) return { ...base, state: "down", reason: "Shipnity ยังไม่เคยส่งตัวเลขสต็อกเข้าเว็บ" };
  const last = Date.parse(f.lastPushAt);
  const stuck = f.sends.find((s) => {
    const at = Date.parse(s.sentAt);
    return f.now - at <= LOOKBACK_HOURS * 3_600_000 && f.now - at > DOWN_AFTER_ORDER_MIN * 60_000 && last < at;
  });
  if (stuck) {
    return {
      ...base,
      state: "down",
      reason: `ส่งออเดอร์ ${stuck.orderNumber} เข้าคลังเมื่อ ${bangkokShort(stuck.sentAt)} แล้ว แต่ Shipnity ไม่ส่งตัวเลขสต็อกมาอีกเลย`,
    };
  }
  const quietHours = Math.floor((f.now - last) / 3_600_000);
  if (quietHours >= QUIET_HOURS) {
    return { ...base, state: "quiet", reason: `Shipnity ไม่ส่งตัวเลขมา ${quietHours} ชม. (วันที่ของไม่ขยับก็เงียบได้ ยังไม่ใช่เหตุเสีย)` };
  }
  return { ...base, state: "ok", reason: null };
}

/** The LINE text for the "OKM Order" group when the light turns red, and when it comes back. */
export function formatFeedAlert(h: FeedHealth, siteUrl: string): string {
  return [
    "⚠️ สต็อกจาก Shipnity อาจหยุดส่งเข้าเว็บ",
    h.reason,
    h.lastPushAt ? `ตัวเลขบนเว็บค้างอยู่ที่ส่งมาล่าสุด ${bangkokShort(h.lastPushAt)}` : null,
    "ฝั่งคลัง: ตรวจว่าการเชื่อม WooCommerce ใน Shipnity ยังเปิดอยู่ · ไม่หายให้แจ้งทีมเว็บ",
    `เปิดดู: ${siteUrl}/staff/dev`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatFeedRecovered(h: FeedHealth): string {
  return `✅ Shipnity ส่งสต็อกเข้าเว็บแล้ว${h.lastPushAt ? ` (ล่าสุด ${bangkokShort(h.lastPushAt)})` : ""}`;
}

/** Whether a change of light needs a LINE message: into red, or out of red. */
export function alertFor(prev: FeedState | null, next: FeedState): "down" | "recovered" | null {
  if (next === "down" && prev !== "down") return "down";
  if (prev === "down" && next !== "down") return "recovered";
  return null;
}
