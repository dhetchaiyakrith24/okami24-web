/**
 * Run: npx tsx src/lib/staff/customer-card-contract-test.ts
 * The customer card (customer-card-rules.ts) and the parcel check page (tracking-check-rules.ts). Made-up figures.
 */
import { customerCard, matchesSearch, type CardOrder } from "./customer-card-rules";
import { LATE_DAYS, parcelRows, type ParcelOrder } from "./tracking-check-rules";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

const order = (orderNumber: string, status: CardOrder["status"], total: number, createdAt: string, recipientName = "ก"): CardOrder => ({
  orderNumber,
  runNumber: null,
  status,
  total,
  createdAt,
  itemCount: 1,
  recipientName,
  recipientPhone: "0800000001",
  address: `ที่อยู่ของ ${recipientName}`,
  province: "กรุงเทพมหานคร",
  trackingNumber: null,
});

const card = customerCard(
  "0812345678",
  [
    order("A", "completed", 500, "2026-10-25T05:00:00Z", "แรก"),
    order("B", "cancelled", 900, "2026-10-28T05:00:00Z", "ยกเลิก"),
    order("C", "shipped", 350, "2026-11-02T05:00:00Z", "ล่าสุดที่จ่าย"),
    order("D", "pending_payment", 700, "2026-11-08T05:00:00Z", "ยังไม่จ่าย"),
  ],
  [
    { provider: "line", name: "Ton" },
    { provider: "line", name: "Ton" },
  ]
);
check("orders newest first", card.orders.map((o) => o.orderNumber).join("") === "DCBA");
check("paid = confirmed only (completed + shipped)", card.paidCount === 2 && card.paidTotal === 850);
check("waiting and cancelled counted apart, never in the total", card.waitingCount === 1 && card.cancelledCount === 1);
check("first order = the oldest", card.firstOrderAt === "2026-10-25T05:00:00Z");
check("last order = the newest, whatever its status", card.lastOrder?.orderNumber === "D");
check("contact = recipient of the newest PAID order", card.contact?.name === "ล่าสุดที่จ่าย");
check("same sign-in shown once", card.members.length === 1);
const gift = { ...order("G", "shipped", 1, "2026-11-05T00:00:00Z", "เพื่อนที่ได้ของขวัญ"), recipientPhone: "0899999999" };
const self = order("H", "completed", 1, "2026-11-01T00:00:00Z", "ตัวเอง");
check("name = newest recipient with the checkout phone, not someone they sent a gift to", customerCard("080-000-0001", [gift, self], []).name === "ตัวเอง");
check("name falls back to the last contact when no recipient has the checkout phone", customerCard("0999999999", [order("F", "shipped", 1, "2026-11-01T00:00:00Z", "เพื่อน")], []).name === "เพื่อน");

const unpaidOnly = customerCard("0800000000", [order("E", "pending_payment", 200, "2026-11-08T05:00:00Z", "รอ")], []);
check("no paid order: contact falls back to the newest order", unpaidOnly.contact?.name === "รอ" && unpaidOnly.paidTotal === 0);
check("no orders: empty card", customerCard("0", [], []).lastOrder === null);

check("search: digits match the phone with dashes typed", matchesSearch("081-234", "0812345678", []));
check("search: digits not in the phone", !matchesSearch("099", "0812345678", ["099"]));
check("search: a name, spaces and case ignored", matchesSearch("som chai", "0812345678", ["Somchai Dee"]));
check("search: empty = everyone", matchesSearch("  ", "0812345678", []));

const now = Date.parse("2026-11-09T05:00:00Z");
const parcel = (orderNumber: string, status: ParcelOrder["status"], daysAgo: number | null): ParcelOrder => ({
  orderNumber,
  runNumber: null,
  status,
  recipientName: "ก",
  province: "ภูเก็ต",
  trackingNumber: `EX${orderNumber}TH`,
  carrier: "thailand-post",
  shippedAt: daysAgo === null ? null : new Date(now - daysAgo * 86_400_000).toISOString(),
});
const rows = parcelRows(
  [parcel("new", "shipped", 1), parcel("late", "shipped", LATE_DAYS), parcel("later", "shipped", LATE_DAYS + 3), parcel("done", "completed", 2), parcel("old", "completed", 30), parcel("x", "shipped", null)],
  now
);
check("late = still shipped at LATE_DAYS", rows.find((r) => r.orderNumber === "late")?.late === true);
check("one day out is not late", rows.find((r) => r.orderNumber === "new")?.late === false);
check("a received parcel is never late", rows.find((r) => r.orderNumber === "done")?.late === false);
check("received long ago leaves the page", !rows.some((r) => r.orderNumber === "old"));
check("order: late (longest first), then newest, unknown last", rows.map((r) => r.orderNumber).join(",") === "later,late,new,done,x");
check("unknown ship day: kept, never late", rows.find((r) => r.orderNumber === "x")?.days === null);

if (failed > 0) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log("All checks passed");
