/**
 * The daily sales numbers of /staff/sales (back-office round 07/11, batch 2) — pure, so the contract test runs it under
 * plain tsx. Owner 04/11 + 07/11: daily sales = web orders + LINE from the slip check, which every LINE slip goes through.
 * No cost and no profit here: this page is for the whole team (owner: cost and profit are the owner's alone).
 *
 * WEB = orders whose payment staff confirmed, on the day the order was placed. Cancelled ones (refunded too) are out, and
 *   so are orders still waiting: their slip is not yet a sale.
 * LINE = slips that went to the shop's account and belong to no web order, on the day of the transfer. A slip from the
 *   slip check says nothing about what was bought, so this is money received; a LINE refund is not visible here.
 * A SLIP OF A WEB ORDER must not count twice. It is left out when:
 *   1. its bank reference is on a payment the customer attached to an order, whatever became of that order; or
 *   2. it fits a confirmed web order that has no slip on record (the check was down and staff checked it by hand, or the
 *      customer sent it in LINE): same amount, transferred from a day before the order to two days after, one slip per order.
 * Rule 2 can in theory hide a LINE sale of the same amount, so those slips are counted and shown (`heldAsWeb`).
 * "unclear" receivers are not counted either: nobody knows the money reached the shop. They are shown as a warning.
 *
 * LINE ORDERS KEYED ON THE WEB (owner list ก11, 09/11 — migration 0026 `channel`): staff key a LINE-chat order on
 * /staff/line-order and pick its slip there, so rules 1 and 2 treat it like any order (its slip leaves the loose slips).
 * Its money then counts ONCE, under LINE, on the day it was keyed — never under web. Two money paths stay apart for the
 * owner's weekly profit (`lineBillSales`): a LINE order the admin also keyed into Shipnity sits on the bill as an "Okami"
 * row, so it belongs with the loose LINE slips (slips − Okami rows); one our site sent to the warehouse itself
 * (`sentByUs`) is on the bill like a web order and is costed per order instead (src/lib/owner/bills.ts, costs.ts).
 */

export type SalesChannel = "web" | "line";

export interface SalesOrder {
  orderNumber: string;
  runNumber: number | null;
  /** Whole baht, as stored on the order. */
  total: number;
  createdAt: string;
  /** True when a payment on this order carries a bank reference. */
  hasSlipRef: boolean;
  /** Where the order came from (migration 0026); every order before it is "web". */
  channel: SalesChannel;
  /** Our site sent it to the warehouse (woo_order_sends status sent) — the bill then shows it like a web order. */
  sentByUs: boolean;
}

export interface SalesSlip {
  transRef: string;
  amountSatang: number;
  transferredAt: string;
  receiverStatus: string;
}

export interface DaySales {
  /** Bangkok date, YYYY-MM-DD. */
  date: string;
  webSatang: number;
  lineSatang: number;
  totalSatang: number;
  /** Web orders only. */
  orders: SalesOrder[];
  /** LINE orders staff keyed on the web; their money is inside `lineSatang`. */
  lineOrders: SalesOrder[];
  slips: SalesSlip[];
  unclear: SalesSlip[];
  heldAsWeb: SalesSlip[];
}

/** BSOT §9: payment confirmed by staff, and on from there. Not "cancelled", and not the two statuses still waiting on a slip. */
export const CONFIRMED_ORDER_STATUSES = ["approved", "processing", "shipped", "completed"] as const;

const DAY_MS = 86_400_000;
const BANGKOK_MS = 7 * 3_600_000;

/** The Bangkok calendar day of an instant, or null for a date that cannot be read. */
export function bangkokDate(iso: string): string | null {
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : new Date(ms + BANGKOK_MS).toISOString().slice(0, 10);
}

/** `count` Bangkok dates ending on `lastDate`, newest first. */
export function lastDates(lastDate: string, count: number): string[] {
  const end = Date.parse(`${lastDate}T00:00:00Z`);
  return Array.from({ length: count }, (_, i) => new Date(end - i * DAY_MS).toISOString().slice(0, 10));
}

/** Rule 2 of the head: which unlinked slips are really a web order's, oldest order first, each slip used once. */
function slipsHeldAsWeb(orders: SalesOrder[], slips: SalesSlip[]): Set<string> {
  const held = new Set<string>();
  const waiting = orders.filter((o) => !o.hasSlipRef).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  for (const order of waiting) {
    const placed = Date.parse(order.createdAt);
    const fit = slips
      .filter((s) => !held.has(s.transRef) && s.amountSatang === order.total * 100)
      .map((s) => ({ s, gap: Date.parse(s.transferredAt) - placed }))
      .filter(({ gap }) => gap >= -DAY_MS && gap <= 2 * DAY_MS)
      .sort((a, b) => Math.abs(a.gap) - Math.abs(b.gap))[0];
    if (fit) held.add(fit.s.transRef);
  }
  return held;
}

export interface SortedSlips {
  line: SalesSlip[];
  unclear: SalesSlip[];
  heldAsWeb: SalesSlip[];
}

/** The rules of the head, as one sorting of the slips. */
export function sortSlips(orders: SalesOrder[], slips: SalesSlip[], linkedRefs: ReadonlySet<string>): SortedSlips {
  const free = slips.filter((s) => !linkedRefs.has(s.transRef));
  const shop = free.filter((s) => s.receiverStatus === "match");
  const held = slipsHeldAsWeb(orders, shop);
  return {
    line: shop.filter((s) => !held.has(s.transRef)),
    unclear: free.filter((s) => s.receiverStatus === "unclear"),
    heldAsWeb: shop.filter((s) => held.has(s.transRef)),
  };
}

/**
 * One row per date in `dates`, in that order. `linkedRefs` = every bank reference on a payment attached to an order.
 * `orders` = confirmed orders only (the query's job), from a few days before the first date, so an order just before the
 * window still claims its slip.
 */
export function dailySales(dates: string[], orders: SalesOrder[], slips: SalesSlip[], linkedRefs: ReadonlySet<string>): DaySales[] {
  const days = new Map<string, DaySales>(
    dates.map((date) => [date, { date, webSatang: 0, lineSatang: 0, totalSatang: 0, orders: [], lineOrders: [], slips: [], unclear: [], heldAsWeb: [] }])
  );
  for (const order of orders) {
    const day = days.get(bangkokDate(order.createdAt) ?? "");
    if (!day) continue;
    if (order.channel === "line") {
      day.lineSatang += order.total * 100;
      day.lineOrders.push(order);
    } else {
      day.webSatang += order.total * 100;
      day.orders.push(order);
    }
  }
  const sorted = sortSlips(orders, slips, linkedRefs);
  const dayOf = (slip: SalesSlip) => days.get(bangkokDate(slip.transferredAt) ?? "");
  for (const slip of sorted.unclear) dayOf(slip)?.unclear.push(slip);
  for (const slip of sorted.heldAsWeb) dayOf(slip)?.heldAsWeb.push(slip);
  for (const slip of sorted.line) {
    const day = dayOf(slip);
    if (!day) continue;
    day.lineSatang += slip.amountSatang;
    day.slips.push(slip);
  }
  for (const day of days.values()) {
    day.totalSatang = day.webSatang + day.lineSatang;
    day.orders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    day.lineOrders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    day.slips.sort((a, b) => Date.parse(b.transferredAt) - Date.parse(a.transferredAt));
  }
  return dates.map((date) => days.get(date)!);
}

/**
 * Satang of LINE money that the warehouse bill's "Okami" rows stand against, for the owner's weekly profit (slips − Okami
 * rows): loose LINE slips transferred in [fromMs, toMs), plus LINE orders keyed on the web in that stretch that our site
 * did NOT send to the warehouse (the admin keyed those into Shipnity too). A keyed order's own slip is not loose (rule 1),
 * so it is counted here once, as the order. A LINE order our site sent is costed per order like a web order instead.
 */
export function lineBillSales(orders: SalesOrder[], slips: SalesSlip[], linkedRefs: ReadonlySet<string>, fromMs: number, toMs: number): number {
  const inside = (iso: string) => {
    const at = Date.parse(iso);
    return at >= fromMs && at < toMs;
  };
  const loose = sortSlips(orders, slips, linkedRefs).line.filter((s) => inside(s.transferredAt));
  const keyed = orders.filter((o) => o.channel === "line" && !o.sentByUs && inside(o.createdAt));
  return loose.reduce((n, s) => n + s.amountSatang, 0) + keyed.reduce((n, o) => n + o.total * 100, 0);
}

/** Orders the per-order cost and the bill's "(ว่าง)" rows cover: web orders, and LINE orders our site sent to the warehouse. */
export function costedPerOrder(order: { channel: SalesChannel; sentByUs: boolean }): boolean {
  return order.channel === "web" || order.sentByUs;
}

/** `costedPerOrder` as a SQL condition on `orders o`, for the readers that query orders directly. */
export const COSTED_PER_ORDER_SQL = "(o.channel = 'web' OR EXISTS (SELECT 1 FROM woo_order_sends w WHERE w.order_id = o.id AND w.status = 'sent'))";
