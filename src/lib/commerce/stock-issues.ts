import "server-only";
import { getDb } from "@/lib/db/client";
import { allCatalogItems } from "@/lib/catalog-index";
import { getProduct } from "@/data/products";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";
import { resolveProductRef } from "./catalog-resolver";
import { getOrderDetailForViewer } from "./orders";
import type { OrderStatus } from "./order-status";
import {
  canOpenStockIssue,
  cleanPromptPayPhone,
  cleanRefundRef,
  decodeSwapValue,
  encodeSwapValue,
  parseItemIds,
  parseSwapJson,
  maskPhone,
  refundAmount,
  stockIssueStage,
  type StockIssueChoice,
  type StockIssueView,
  type SwapGroup,
  type StockIssueResolution,
  type SwapPick,
} from "./stock-issue-rules";

/**
 * Out of stock after payment (cart UX batch E, owner 24/10; BSOT §9 owner exception 22/10) — the DB side. Rules = stock-issue-rules.ts;
 * table = migration 0013. Staff functions are called only from /staff actions (which check the staff session first);
 * customer functions re-check the viewer exactly like the order page (owning customer or the order's view token).
 * Nothing here moves money: a refund is made by a person in the bank app, then recorded here.
 */

export interface StockIssueLine {
  itemId: number;
  productSlug: string;
  variantId: string | null;
  productName: string;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface StockIssue {
  orderId: number;
  outLines: StockIssueLine[];
  staffNote: string | null;
  openedAt: string;
  choice: StockIssueChoice | null;
  /** 'swap': what the customer picked for each out line (names resolved for display). */
  swap: (SwapPick & { name: string; variantLabel: string | null })[] | null;
  refundPromptPay: string | null;
  /** What a refund returns (refundAmount in stock-issue-rules.ts): the out lines, or the whole paid total when all are out. */
  refund: { amount: number; wholeOrder: boolean };
  chosenAt: string | null;
  resolution: StockIssueResolution | null;
  refundRef: string | null;
  resolvedAt: string | null;
}

interface IssueRow {
  order_id: number;
  out_item_ids: string;
  staff_note: string | null;
  opened_at: string;
  choice: StockIssueChoice | null;
  swap_json: string | null;
  refund_promptpay: string | null;
  chosen_at: string | null;
  resolution: StockIssueResolution | null;
  refund_ref: string | null;
  resolved_at: string | null;
}

interface ItemRow {
  id: number;
  product_slug: string;
  variant_id: string | null;
  variant_label: string | null;
  product_name_snapshot: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

function itemsOf(orderId: number): ItemRow[] {
  return getDb()
    .prepare("SELECT id, product_slug, variant_id, variant_label, product_name_snapshot, unit_price, quantity, line_total FROM order_items WHERE order_id = ? ORDER BY id")
    .all(orderId) as ItemRow[];
}

const toLine = (i: ItemRow): StockIssueLine => ({
  itemId: i.id,
  productSlug: i.product_slug,
  variantId: i.variant_id,
  productName: i.product_name_snapshot,
  variantLabel: i.variant_label,
  unitPrice: i.unit_price,
  quantity: i.quantity,
  lineTotal: i.line_total,
});

/** Every line of the order with its id — the staff page's "which lines are out" checkboxes. */
export function orderLines(orderId: number): StockIssueLine[] {
  return itemsOf(orderId).map(toLine);
}

export function getStockIssue(orderId: number): StockIssue | null {
  const row = getDb().prepare("SELECT * FROM order_stock_issues WHERE order_id = ?").get(orderId) as IssueRow | undefined;
  if (!row) return null;
  const ids = new Set(parseItemIds(row.out_item_ids));
  const picks = parseSwapJson(row.swap_json);
  const all = itemsOf(orderId);
  const outLines = all.filter((i) => ids.has(i.id)).map(toLine);
  const total = (getDb().prepare("SELECT total FROM orders WHERE id = ?").get(orderId) as { total: number }).total;
  return {
    orderId,
    outLines,
    staffNote: row.staff_note,
    openedAt: row.opened_at,
    choice: row.choice,
    swap: picks
      ? picks.map((p) => {
          const r = resolveProductRef({ origin: "product-master", slug: p.productSlug, variantId: p.variantId });
          return { ...p, name: r.ok ? r.line.displayName : p.productSlug, variantLabel: r.ok ? r.line.variantLabel : p.variantId };
        })
      : null,
    refundPromptPay: row.refund_promptpay,
    refund: refundAmount(outLines, { total, lineCount: all.length }),
    chosenAt: row.chosen_at,
    resolution: row.resolution,
    refundRef: row.refund_ref,
    resolvedAt: row.resolved_at,
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Swap candidates — every option that would pass checkout right now (resolveProductRef: approved price + stock) at the
// SAME unit price as the line that is out (BSOT §9 owner exception: "another item at the same price"), in the SAME
// category (a disposable is never offered a refill pod for a device the customer may not own — Friday 24/10). Parts that
// must fit the customer's own device (pods/cartridges, coils, heated-tobacco sticks) — and anything whose category is
// unknown — stay within the same product: another flavour or resistance of the same part, never another brand's part.
// The line's own product comes first.
const SAME_PRODUCT_ONLY = new Set(["pods-cartridges", "coils-accessories", "heated-tobacco-consumables"]);

function optionIdsOf(slug: string, origin: "legacy" | "product-master", published: Map<string, string[]>): (string | null)[] {
  if (origin === "product-master") {
    const ids = published.get(slug);
    return ids && ids.length > 0 ? ids : [null];
  }
  const p = getProduct(slug);
  const ids = [...(p?.colorVariants ?? []), ...(p?.flavorVariants ?? [])].map((v) => v.id);
  return ids.length > 0 ? ids : [null];
}

export function swapCandidates(line: Pick<StockIssueLine, "productSlug" | "variantId" | "unitPrice">): SwapGroup[] {
  const published = new Map(buildPublishedCatalog().map((p) => [p.slug, p.variants.map((v) => v.id)]));
  const groups: SwapGroup[] = [];
  const all = allCatalogItems();
  const category = all.find((i) => i.slug === line.productSlug)?.categoryId ?? null;
  const items = all
    .filter(
      (i) =>
        i.sellingPrice === line.unitPrice &&
        (category === null || SAME_PRODUCT_ONLY.has(category) ? i.slug === line.productSlug : i.categoryId === category)
    )
    .sort((a, b) => (a.slug === line.productSlug ? -1 : b.slug === line.productSlug ? 1 : a.name.localeCompare(b.name)));
  for (const item of items) {
    const options: SwapGroup["options"] = [];
    let productName = item.name;
    for (const variantId of optionIdsOf(item.slug, item.origin, published)) {
      if (item.slug === line.productSlug && variantId === line.variantId) continue;
      const r = resolveProductRef({ origin: item.origin, slug: item.slug, variantId });
      if (!r.ok || r.line.unitPrice !== line.unitPrice) continue;
      productName = r.line.displayName;
      options.push({ value: encodeSwapValue(item.slug, variantId), label: r.line.variantLabel ?? r.line.displayName });
    }
    if (options.length > 0) groups.push({ productSlug: item.slug, productName, options });
  }
  return groups;
}

/** A picked swap is still valid: buyable now, same unit price as the line it replaces. */
/** A picked swap is still valid: it is one of the options the picker would offer for this line right now (buyable, same
 *  price, same category, same product for device parts, not the line's own option — checker #802: the server enforces the
 *  same list the page shows, never just price). */
function validSwap(line: ItemRow, productSlug: string, variantId: string | null) {
  const value = encodeSwapValue(productSlug, variantId);
  const offered = swapCandidates({ productSlug: line.product_slug, variantId: line.variant_id, unitPrice: line.unit_price }).some((g) =>
    g.options.some((o) => o.value === value)
  );
  if (!offered) return null;
  const item = allCatalogItems().find((i) => i.slug === productSlug);
  if (!item) return null;
  const r = resolveProductRef({ origin: item.origin, slug: productSlug, variantId });
  return r.ok && r.line.unitPrice === line.unit_price ? r.line : null;
}

// ---------------------------------------------------------------------------------------------------------------------
// Staff side (called from /staff actions only).

export type StaffStockResult = { ok: true } | { ok: false; error: "not-found" | "not-allowed" | "no-lines" | "swap-invalid" | "refund-ref" };

function orderRow(orderNumber: string) {
  return getDb().prepare("SELECT id, status FROM orders WHERE order_number = ?").get(orderNumber) as { id: number; status: OrderStatus } | undefined;
}

const now = "strftime('%Y-%m-%dT%H:%M:%fZ','now')";

/** Staff mark which lines are out (again = "ask the customer again": the old choice is cleared). */
export function openStockIssue(orderNumber: string, itemIds: number[], staffNote: string): StaffStockResult {
  const db = getDb();
  return db.transaction((): StaffStockResult => {
    const order = orderRow(orderNumber);
    if (!order) return { ok: false, error: "not-found" };
    if (!canOpenStockIssue(order.status)) return { ok: false, error: "not-allowed" };
    const own = new Set(itemsOf(order.id).map((i) => i.id));
    const ids = [...new Set(itemIds)].filter((id) => own.has(id));
    if (ids.length === 0) return { ok: false, error: "no-lines" };
    const existing = db.prepare("SELECT resolution FROM order_stock_issues WHERE order_id = ?").get(order.id) as { resolution: string | null } | undefined;
    if (existing?.resolution === "refunded") return { ok: false, error: "not-allowed" };
    const note = staffNote.trim().slice(0, 300) || null;
    db.prepare(
      `INSERT INTO order_stock_issues (order_id, out_item_ids, staff_note) VALUES (?, ?, ?)
       ON CONFLICT(order_id) DO UPDATE SET out_item_ids = excluded.out_item_ids, staff_note = excluded.staff_note, opened_at = ${now},
         choice = NULL, swap_json = NULL, refund_promptpay = NULL, chosen_at = NULL, resolution = NULL, refund_ref = NULL, resolved_at = NULL`
    ).run(order.id, ids.join(","), note);
    db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(
      order.id,
      order.status,
      `Stock: out after payment — lines ${ids.join(",")}${note ? ` — ${note}` : ""}`
    );
    return { ok: true };
  })();
}

/** Staff apply the customer's swap: each pick is re-checked (still buyable, same price) and written over the order line —
 *  the total does not change. A pick that is no longer valid stops the whole swap (staff then ask again). */
export function applySwap(orderNumber: string): StaffStockResult {
  const db = getDb();
  return db.transaction((): StaffStockResult => {
    const order = orderRow(orderNumber);
    if (!order) return { ok: false, error: "not-found" };
    const issue = getStockIssue(order.id);
    if (!issue || issue.resolution || issue.choice !== "swap" || !issue.swap || !canOpenStockIssue(order.status)) return { ok: false, error: "not-allowed" };
    const items = new Map(itemsOf(order.id).map((i) => [i.id, i]));
    const update = db.prepare("UPDATE order_items SET product_slug = ?, variant_id = ?, variant_label = ?, product_name_snapshot = ? WHERE id = ? AND order_id = ?");
    const done: string[] = [];
    for (const pick of issue.swap) {
      const line = items.get(pick.itemId);
      const target = line ? validSwap(line, pick.productSlug, pick.variantId) : null;
      if (!line || !target) return { ok: false, error: "swap-invalid" };
      update.run(target.productSlug, target.variantId, target.variantLabel, target.displayName, line.id, order.id);
      done.push(`${line.product_name_snapshot}${line.variant_label ? ` ${line.variant_label}` : ""} → ${target.displayName}${target.variantLabel ? ` ${target.variantLabel}` : ""}`);
    }
    db.prepare(`UPDATE order_stock_issues SET resolution = 'swapped', resolved_at = ${now} WHERE order_id = ?`).run(order.id);
    db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(order.id, order.status, `Stock: swapped — ${done.join(" · ")}`);
    return { ok: true };
  })();
}

/** Staff record the refund they made in the bank app (with its reference). Every line out = the order is cancelled; some
 *  lines out = the rest still ships (the out lines leave the warehouse text). Allowed whether the customer chose on the page
 *  or told staff by phone/LINE. */
export function markRefunded(orderNumber: string, rawRef: string): StaffStockResult {
  const ref = cleanRefundRef(rawRef);
  if (!ref) return { ok: false, error: "refund-ref" };
  const db = getDb();
  return db.transaction((): StaffStockResult => {
    const order = orderRow(orderNumber);
    if (!order) return { ok: false, error: "not-found" };
    const issue = getStockIssue(order.id);
    if (!issue || issue.resolution || !canOpenStockIssue(order.status)) return { ok: false, error: "not-allowed" };
    db.prepare(`UPDATE order_stock_issues SET resolution = 'refunded', refund_ref = ?, resolved_at = ${now} WHERE order_id = ?`).run(ref, order.id);
    const note = `Stock: refunded — ref ${ref}`;
    if (issue.refund.wholeOrder) {
      // Every STOCK_ISSUE_STATUSES status may move to "cancelled" (order-status.ts ALLOWED_TRANSITIONS).
      db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, 'cancelled', ?)").run(order.id, note);
      db.prepare(`UPDATE orders SET status = 'cancelled', updated_at = ${now} WHERE id = ?`).run(order.id);
    } else {
      db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(order.id, order.status, note);
    }
    return { ok: true };
  })();
}

// ---------------------------------------------------------------------------------------------------------------------
// Customer side (order page). Same access check as the page; a choice is final until staff ask again.

export type CustomerStockResult =
  | { ok: true; choice: StockIssueChoice }
  | { ok: false; error: "not-found" | "closed" | "swap-invalid" | "promptpay-invalid" };

async function customerIssue(orderNumber: string, viewToken: string | null) {
  const order = await getOrderDetailForViewer(orderNumber, viewToken);
  if (!order) return null;
  return { order, issue: getStockIssue(order.id) };
}

export async function chooseSwap(orderNumber: string, viewToken: string | null, values: Map<number, unknown>): Promise<CustomerStockResult> {
  const found = await customerIssue(orderNumber, viewToken);
  if (!found) return { ok: false, error: "not-found" };
  const { order, issue } = found;
  if (!issue || issue.choice || issue.resolution || !canOpenStockIssue(order.status)) return { ok: false, error: "closed" };
  const items = new Map(itemsOf(order.id).map((i) => [i.id, i]));
  const picks: SwapPick[] = [];
  for (const line of issue.outLines) {
    const decoded = decodeSwapValue(values.get(line.itemId));
    const row = items.get(line.itemId);
    if (!decoded || !row || !validSwap(row, decoded.productSlug, decoded.variantId)) return { ok: false, error: "swap-invalid" };
    picks.push({ itemId: line.itemId, ...decoded, fromLabel: `${line.productName}${line.variantLabel ? ` · ${line.variantLabel}` : ""}` });
  }
  return recordChoice(order.id, "swap", JSON.stringify(picks), null);
}

/** `promptPay` = null → the phone the order was placed with. */
export async function chooseRefund(orderNumber: string, viewToken: string | null, promptPay: unknown | null): Promise<CustomerStockResult> {
  const found = await customerIssue(orderNumber, viewToken);
  if (!found) return { ok: false, error: "not-found" };
  const { order, issue } = found;
  if (!issue || issue.choice || issue.resolution || !canOpenStockIssue(order.status)) return { ok: false, error: "closed" };
  const number =
    promptPay === null
      ? cleanPromptPayPhone((getDb().prepare("SELECT c.phone FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.id = ?").get(order.id) as { phone: string }).phone)
      : cleanPromptPayPhone(promptPay);
  if (!number) return { ok: false, error: "promptpay-invalid" };
  return recordChoice(order.id, "refund", null, number);
}

function recordChoice(orderId: number, choice: StockIssueChoice, swapJson: string | null, promptPay: string | null): CustomerStockResult {
  const db = getDb();
  // `choice IS NULL` in the WHERE: two taps (or two tabs) cannot both record a choice.
  const changed = db
    .prepare(`UPDATE order_stock_issues SET choice = ?, swap_json = ?, refund_promptpay = ?, chosen_at = ${now} WHERE order_id = ? AND choice IS NULL AND resolution IS NULL`)
    .run(choice, swapJson, promptPay, orderId).changes;
  if (changed === 0) return { ok: false, error: "closed" };
  const status = (db.prepare("SELECT status FROM orders WHERE id = ?").get(orderId) as { status: string }).status;
  db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(orderId, status, `Customer: chose ${choice}`);
  return { ok: true, choice };
}

/** The order page's view of the issue (null = no issue). Swap options are computed only while the customer still has to
 *  choose — they re-read the live catalog, so they are never cached. */
export function stockIssueViewFor(orderId: number): StockIssueView | null {
  const issue = getStockIssue(orderId);
  if (!issue) return null;
  const stage = stockIssueStage(issue);
  const own = getDb().prepare("SELECT c.phone FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.id = ?").get(orderId) as { phone: string } | undefined;
  const ownPhone = own ? cleanPromptPayPhone(own.phone) : null;
  const swapGroups: StockIssueView["swapGroups"] = {};
  if (stage === "waiting-choice") for (const l of issue.outLines) swapGroups[l.itemId] = swapCandidates(l);
  return {
    stage,
    choice: issue.choice,
    resolution: issue.resolution,
    outLines: issue.outLines.map((l) => ({ itemId: l.itemId, name: l.productName, variantLabel: l.variantLabel, quantity: l.quantity })),
    refundAmount: issue.refund.amount,
    wholeOrder: issue.refund.wholeOrder,
    ownPhoneMasked: ownPhone ? maskPhone(ownPhone) : null,
    refundPhoneMasked: issue.refundPromptPay ? maskPhone(issue.refundPromptPay) : null,
    swapGroups,
  };
}
