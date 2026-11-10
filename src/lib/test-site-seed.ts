import "server-only";
import crypto from "node:crypto";
import type Database from "better-sqlite3";
import { allCatalogItems } from "@/lib/catalog-index";
import { resolveProductRef, type ResolvedLine } from "@/lib/commerce/catalog-resolver";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { computeOrderTotals, priceLine } from "@/lib/commerce/pricing";
import { ASSIGN_RUN_NUMBER_SQL } from "@/lib/commerce/run-number";
import type { OrderStatus } from "@/lib/commerce/order-status";
import { TEST_SITE } from "@/lib/test-site";

/**
 * Fake data for the TEST copy of the site (src/lib/test-site.ts — owner 10/11, outside tester). Runs at server start,
 * only while `OKAMI24_TEST_SITE=on`, and only into a database with no orders yet: the test service has no disk, so every
 * deploy or restart starts empty and is filled again; an order the tester placed is never overwritten.
 *
 * Everything is obviously fake — customers "ลูกค้าทดสอบ 01…", phones 000000000x (no Thai number starts 00), a made-up
 * house line ("บ้านทดสอบ … ถนนสมมติ") on a real district so the address form and the carrier pick behave, tracking
 * numbers TEST…, slip references TEST-SLIP-… . Products, names and prices come from the catalog at run time (never typed),
 * the same way the cart prices them.
 *
 * What it writes: one order in every status of BSOT §9, plus the cases the staff pages have their own views for — an
 * order the system cancelled for no payment, a staff-cancelled one with a message to the customer, a LINE order keyed by
 * staff, a slip that passed, one that needs a look and one EasySlip could not check, and the staff slip-check history.
 * No slip pictures (the order pages show "no picture" for these) and no staff accounts: the tester's own Google
 * addresses are set on the test service (docs/เว็บทดสอบ-Render.md).
 */

type Plan = {
  status: OrderStatus;
  /** statuses walked before `status`, in order, each one a history row */
  path: OrderStatus[];
  hoursAgo: number;
  lines: number;
  slip?: "pass" | "check" | "unchecked";
  tracking?: boolean;
  note?: string;
  channel?: "web" | "line";
  autoCancel?: boolean;
  message?: string;
};

const PLANS: Plan[] = [
  { status: "pending_payment", path: [], hoursAgo: 1, lines: 1 },
  { status: "pending_payment", path: [], hoursAgo: 5, lines: 2 },
  { status: "payment_submitted", path: ["pending_payment"], hoursAgo: 3, lines: 1, slip: "pass" },
  { status: "payment_submitted", path: ["pending_payment"], hoursAgo: 4, lines: 2, slip: "check" },
  { status: "payment_submitted", path: ["pending_payment"], hoursAgo: 6, lines: 1, slip: "unchecked" },
  { status: "awaiting_verification", path: ["pending_payment", "payment_submitted"], hoursAgo: 8, lines: 1, slip: "check" },
  { status: "approved", path: ["pending_payment", "payment_submitted", "awaiting_verification"], hoursAgo: 20, lines: 2, slip: "pass" },
  { status: "processing", path: ["pending_payment", "payment_submitted", "awaiting_verification", "approved"], hoursAgo: 30, lines: 1, slip: "pass" },
  { status: "shipped", path: ["pending_payment", "payment_submitted", "awaiting_verification", "approved", "processing"], hoursAgo: 50, lines: 3, slip: "pass", tracking: true },
  { status: "completed", path: ["pending_payment", "payment_submitted", "awaiting_verification", "approved", "processing", "shipped"], hoursAgo: 120, lines: 1, slip: "pass", tracking: true },
  { status: "cancelled", path: ["pending_payment"], hoursAgo: 40, lines: 1, autoCancel: true },
  { status: "cancelled", path: ["pending_payment"], hoursAgo: 70, lines: 1, message: "ออเดอร์ทดสอบ: ยกเลิกตามที่ลูกค้าขอ (ข้อความนี้เป็นของปลอม)" },
  { status: "approved", path: ["pending_payment", "payment_submitted", "awaiting_verification"], hoursAgo: 10, lines: 2, slip: "pass", channel: "line" },
];

const CUSTOMERS = 8;

function iso(hoursAgo: number, plusMinutes = 0): string {
  return new Date(Date.now() - hoursAgo * 3_600_000 + plusMinutes * 60_000).toISOString();
}

/** Purchasable lines from the catalog as the cart sees it (price + stock at build time), first option of each product. */
function sellableLines(): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const item of allCatalogItems()) {
    if (item.sellingPrice === null) continue;
    const variants = getPublishedProductBySlug(item.slug)?.variants ?? [];
    const ids: (string | null)[] = variants.length > 0 ? variants.map((v) => v.id) : [null];
    for (const variantId of ids) {
      const r = resolveProductRef({ origin: item.origin, slug: item.slug, variantId }, undefined, item);
      if (r.ok) {
        out.push(r.line);
        break;
      }
    }
    if (out.length >= 24) break;
  }
  return out;
}

export function seedTestSite(db: Database.Database): { seeded: boolean; orders: number; reason?: string } {
  if (!TEST_SITE) return { seeded: false, orders: 0, reason: "not the test site" };
  const existing = (db.prepare("SELECT COUNT(*) AS n FROM orders").get() as { n: number }).n;
  if (existing > 0) return { seeded: false, orders: existing, reason: "orders already exist" };
  const lines = sellableLines();
  if (lines.length === 0) return { seeded: false, orders: 0, reason: "no purchasable product in this build" };

  let made = 0;
  db.transaction(() => {
    const customerIds: number[] = [];
    const insertCustomer = db.prepare("INSERT INTO customers (phone, display_name, created_at) VALUES (?, ?, ?)");
    for (let i = 1; i <= CUSTOMERS; i++) {
      const n = String(i).padStart(2, "0");
      customerIds.push(Number(insertCustomer.run(`00000000${n}`, `ลูกค้าทดสอบ ${n}`, iso(24 * 14)).lastInsertRowid));
    }

    const insertOrder = db.prepare(
      `INSERT INTO orders (order_number, view_token, customer_id, status, subtotal, shipping_fee, shipping_rule, total, payment_method,
         created_at, updated_at, tracking_number, carrier, customer_note, channel, keyed_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bank_transfer', ?, ?, ?, ?, ?, ?, ?)`
    );
    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_slug, variant_id, variant_label, product_name_snapshot, unit_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const insertAddress = db.prepare(
      `INSERT INTO order_shipping_addresses (order_id, recipient_name, phone, line1, subdistrict, district, province, postal_code)
       VALUES (?, ?, ?, ?, 'ลุมพินี', 'ปทุมวัน', 'กรุงเทพมหานคร', '10330')`
    );
    const insertHistory = db.prepare("INSERT INTO order_status_history (order_id, status, note, created_at) VALUES (?, ?, ?, ?)");
    const insertSubmission = db.prepare(
      `INSERT INTO order_payment_submissions (order_id, method, submitted_at, slip_trans_ref, slip_amount_satang, slip_verdict, slip_reasons)
       VALUES (?, 'bank_transfer', ?, ?, ?, ?, ?)`
    );
    const insertSlipCheck = db.prepare(
      `INSERT INTO slip_checks (trans_ref, amount_satang, transferred_at, receiver_status, first_checked_at, last_checked_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const insertMessage = db.prepare("INSERT INTO order_customer_messages (order_id, body, created_at) VALUES (?, ?, ?)");

    PLANS.forEach((plan, index) => {
      const n = index + 1;
      const chosen = Array.from({ length: plan.lines }, (_, k) => lines[(index * 3 + k) % lines.length]);
      const priced = chosen.map((l, k) => priceLine(l, k === 0 && plan.lines > 1 ? 2 : 1));
      const totals = computeOrderTotals(priced);
      const created = iso(plan.hoursAgo);
      const date = created.slice(0, 10).replace(/-/g, "");
      const orderNumber = `OK-${date}-t${String(n).padStart(5, "0")}`;
      const customerId = customerIds[index % customerIds.length];
      const label = `ลูกค้าทดสอบ ${String((index % CUSTOMERS) + 1).padStart(2, "0")}`;
      const orderId = Number(
        insertOrder.run(
          orderNumber,
          crypto.randomBytes(16).toString("hex"),
          customerId,
          plan.status,
          totals.subtotal,
          totals.shippingFee,
          totals.shippingRule,
          totals.total,
          created,
          iso(plan.hoursAgo, 30 * (plan.path.length + 1)),
          plan.tracking ? `TEST${String(n).padStart(9, "0")}TH` : null,
          plan.tracking ? "thailand-post" : null,
          n % 4 === 0 ? "ข้อความทดสอบจากลูกค้า (ของปลอม)" : null,
          plan.channel ?? "web",
          plan.channel === "line" ? "แอดมินทดสอบ" : null
        ).lastInsertRowid
      );
      for (const l of totals.lines) {
        insertItem.run(orderId, l.productSlug, l.variantId, l.variantLabel, l.displayName, l.unitPrice, l.quantity, l.lineTotal);
      }
      insertAddress.run(orderId, label, customerIdPhone(index), `${n}/1 บ้านทดสอบ ถนนสมมติ`);

      const walked = [...plan.path, plan.status];
      walked.forEach((status, step) => {
        const at = iso(plan.hoursAgo, 30 * step);
        const note =
          step === 0
            ? plan.channel === "line"
              ? "Staff: LINE order (test data)"
              : "Order created (test data)"
            : status === "payment_submitted"
              ? `Slip attached — ${plan.slip === "unchecked" ? "not checked (EasySlip unavailable)" : `EasySlip: ${plan.slip}`} (test data)`
              : status === "cancelled" && plan.autoCancel
                ? "System: unpaid 24 h — auto-cancel"
                : `Staff: ${status} (test data)`;
        insertHistory.run(orderId, status, note, at);
      });

      if (plan.slip) {
        const ref = plan.slip === "unchecked" ? null : `TEST-SLIP-${String(n).padStart(4, "0")}`;
        const amount = plan.slip === "check" ? (totals.total - 1) * 100 : totals.total * 100;
        insertSubmission.run(
          orderId,
          iso(plan.hoursAgo, 30),
          ref,
          plan.slip === "unchecked" ? null : amount,
          plan.slip,
          plan.slip === "check" ? "amount-mismatch" : null
        );
        if (ref) insertSlipCheck.run(ref, amount, iso(plan.hoursAgo, 25).replace("Z", "+00:00"), "match", iso(plan.hoursAgo, 30), iso(plan.hoursAgo, 30));
      }
      if (walked.includes("approved")) db.prepare(ASSIGN_RUN_NUMBER_SQL).run(orderId);
      if (plan.message) insertMessage.run(orderId, plan.message, iso(plan.hoursAgo, 30));
      made++;
    });
  })();
  return { seeded: true, orders: made };
}

function customerIdPhone(index: number): string {
  return `00000000${String((index % CUSTOMERS) + 1).padStart(2, "0")}`;
}
