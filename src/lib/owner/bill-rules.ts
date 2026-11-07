import { findColumns, parseAmount, type Sheet } from "./xlsx-read";

/**
 * The weekly check against the warehouse bill (back-office round 07/11, batches 1 + 5): every web order of a round paired with
 * its bill row, every place the two differ, and the round's profit. Pure, shared by the owner's page and
 * scripts/weekly-bill-check.ts. No figure is written here. Method = LESSONS พ71: read the bill column by column.
 *
 * The bill: columns are found by header. "(ว่าง)" = web · "Okami" = LINE keyed by admin · ยอดขายร้านค้า = rate + shipping.
 * A web order and a bill row share no number: they pair by quantity, rate total + shipping = the billed amount and a date
 * within a day, nearest day first, then the agent column closest to what the customer paid. Each row is used once. An order
 * whose rate is off pairs by quantity and customer total, and the difference is listed.
 */

const WEB_MARK = "(ว่าง)";
const LINE_MARK = "Okami";
const DAY = 86_400_000;
export const PAID_STATUSES_TH = ["อนุมัติแล้ว", "กำลังเตรียมจัดส่ง", "จัดส่งแล้ว", "สำเร็จ"];

export interface BillRow {
  date: number | null;
  by: string;
  no: string;
  ship: number;
  qty: number;
  agent: number;
  shop: number;
}

export interface Bill {
  rows: BillRow[];
  printedTotal: number | null;
}

export type Rates = Record<string, { rate: number; name: string }>;

export interface BillOrderLine {
  name: string;
  option: string;
  qty: number;
  code: string;
  warehouse?: number | null;
  ours?: number | null;
}

/** A confirmed web order. `at` = "YYYY-MM-DD HH:mm" Bangkok time. */
export interface BillOrder {
  id: string;
  run: string;
  at: string;
  total: number;
  lines: BillOrderLine[];
}

export interface PricedOrder extends BillOrder {
  qty: number;
  rateTotal: number;
  costTotal: number;
  priced: boolean;
  problems: string[];
  bill?: BillRow;
  pairing?: string;
}

export interface Diff {
  kind: string;
  where: string;
  detail: string;
}

export interface RoundTotals {
  webOrders: number;
  webBilled: number;
  webPieces: number;
  webPaid: number;
  webPaidBilled: number;
  webBill: number;
  webShipOver: number;
  webProfit: number;
  lineOrders: number;
  linePieces: number;
  lineBill: number;
  lineShipOdd: number;
  billRows: number;
  billTotal: number;
  billPrinted: number | null;
}

export interface RoundResult {
  inRound: PricedOrder[];
  line: BillRow[];
  diffs: Diff[];
  totals: RoundTotals;
}

/** "31/10/26" · "31/10/2569" · an Excel date serial → ms at that midnight, as UTC. */
export function billDate(v: unknown): number | null {
  const s = String(v ?? "").trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    const year = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]) > 2400 ? Number(m[3]) - 543 : Number(m[3]);
    return Date.UTC(year, Number(m[2]) - 1, Number(m[1]));
  }
  if (/^\d{5}(\.\d+)?$/.test(s)) return Math.floor(Number(s)) * DAY - 25569 * DAY;
  return null;
}
export const showDate = (ms: number | null) => (ms === null ? "?" : new Date(ms).toISOString().slice(0, 10));

export function readBill(sheets: Sheet[]): Bill {
  const sheet = sheets[0];
  const cols = findColumns(
    sheet?.rows[0] ?? {},
    { date: "วันที่สร้าง", by: "สร้างโดย", no: "เลขที่ออเดอร์", ship: "ค่าส่งที่เก็บลูกค้า", qty: "จำนวน", agent: "ยอดขายตัวแทน", shop: "ยอดขายร้านค้า" },
    "บิลคลัง"
  );
  const rows: BillRow[] = [];
  let date: number | null = null;
  let by = "";
  let printedTotal: number | null = null;
  for (const r of sheet.rows.slice(1)) {
    const first = String(r[cols.date] ?? "");
    const d = billDate(first);
    if (d !== null) date = d;
    if (r[cols.by]) by = r[cols.by];
    if (first.startsWith("ผลรวม")) continue;
    if (first === "รวม") {
      printedTotal = parseAmount(r[cols.shop]);
      continue;
    }
    if (!r[cols.no]) continue;
    rows.push({ date, by, no: r[cols.no], ship: parseAmount(r[cols.ship]), qty: parseAmount(r[cols.qty]), agent: parseAmount(r[cols.agent]), shop: parseAmount(r[cols.shop]) });
  }
  return { rows, printedTotal };
}

export function readRates(sheets: Sheet[]): Rates {
  const sheet = sheets[0];
  const cols = findColumns(sheet?.rows[0] ?? {}, { code: "รหัสสินค้า", name: "ชื่อสินค้า", rate: "ราคาเทียบ" }, "ไฟล์เรต");
  const rates: Rates = {};
  for (const r of sheet.rows.slice(1)) if (r[cols.code]) rates[r[cols.code]] = { rate: parseAmount(r[cols.rate]), name: r[cols.name] };
  return rates;
}

/** "2026-10-31 13:00" (Bangkok) → ms as if UTC, so it compares only with itself and with bill dates. */
const localMs = (s: string) => Date.parse(`${s.trim().replace(" ", "T").slice(0, 16)}:00Z`);
const productCode = (code: string) => code.replace(/-\d+$/, "");
const label = (o: BillOrder) => o.run || o.id;

function priceOrder(order: BillOrder, rates: Rates, cost: ReadonlyMap<string, number>): PricedOrder {
  let rateTotal = 0;
  let costTotal = 0;
  let qty = 0;
  const problems: string[] = [];
  const lines = order.lines.map((l) => {
    const warehouse = rates[l.code]?.rate ?? null;
    const ours = cost.get(productCode(l.code)) ?? null;
    qty += l.qty;
    if (!l.code) problems.push(`${l.name} ${l.option}: ไม่มีรหัสคลัง`);
    else if (warehouse === null) problems.push(`${l.code} ${l.name} ${l.option}: ไม่มีเรตในไฟล์คลัง`);
    if (l.code && ours === null) problems.push(`${l.code} ${l.name}: ไม่มีทุนในระบบ`);
    if (warehouse !== null && ours !== null && warehouse !== ours) problems.push(`${l.code} ${l.name}: เรตคลัง ≠ ทุนในระบบ`);
    rateTotal += (warehouse ?? 0) * l.qty;
    costTotal += (ours ?? 0) * l.qty;
    return { ...l, warehouse, ours };
  });
  return { ...order, lines, qty, rateTotal, costTotal, priced: lines.every((l) => l.warehouse !== null), problems };
}

function pairOrders(orders: PricedOrder[], webRows: BillRow[]): BillRow[] {
  const free = new Set(webRows);
  const dayGap = (o: PricedOrder, r: BillRow) => Math.abs(Math.floor(localMs(o.at) / DAY) * DAY - (r.date ?? 0)) / DAY;
  const near = (o: PricedOrder, r: BillRow) => r.date !== null && dayGap(o, r) <= 1;
  const oldest = [...orders].sort((a, b) => localMs(a.at) - localMs(b.at));
  const take = (o: PricedOrder, test: (r: BillRow) => boolean, how: string) => {
    if (o.bill) return;
    const hits = [...free].filter((r) => r.qty === o.qty && near(o, r) && test(r));
    if (hits.length === 0) return;
    hits.sort((a, b) => dayGap(o, a) - dayGap(o, b) || Math.abs(a.agent - o.total) - Math.abs(b.agent - o.total));
    o.bill = hits[0];
    o.pairing = how + (hits.length > 1 ? ` (เลือกจาก ${hits.length} แถวที่ยอดเท่ากัน)` : "");
    free.delete(hits[0]);
  };
  for (const o of oldest) if (o.priced) take(o, (r) => o.rateTotal + r.ship === r.shop, "ยอดตรง");
  for (const o of oldest) take(o, (r) => r.agent === o.total, "จับคู่จากยอดลูกค้า");
  return [...free];
}

export function checkRound(input: { bill: Bill; rates: Rates; cost: ReadonlyMap<string, number>; orders: BillOrder[]; from: string; to: string; shippingBaht: number }): RoundResult {
  const { bill, rates, cost, orders, shippingBaht } = input;
  const fromMs = localMs(input.from);
  const toMs = localMs(input.to);
  const paid = orders.map((o) => priceOrder(o, rates, cost));
  const web = bill.rows.filter((r) => r.by === WEB_MARK);
  const line = bill.rows.filter((r) => r.by === LINE_MARK);
  const other = bill.rows.filter((r) => r.by !== WEB_MARK && r.by !== LINE_MARK);
  const unbilledRows = pairOrders(paid, web);
  const inRound = paid.filter((o) => localMs(o.at) >= fromMs && localMs(o.at) < toMs).sort((a, b) => localMs(a.at) - localMs(b.at));
  const late = paid.filter((o) => o.bill && !inRound.includes(o));

  const diffs: Diff[] = [];
  const add = (kind: string, where: string, detail: string) => diffs.push({ kind, where, detail });
  for (const o of inRound) {
    const name = label(o);
    if (!o.bill) {
      add("ไม่อยู่ในบิล", name, `สั่ง ${o.at} · ลูกค้าจ่าย ${o.total}`);
      continue;
    }
    if (o.bill.qty !== o.qty) add("จำนวนไม่ตรง", name, `เรา ${o.qty} · บิล ${o.bill.qty}`);
    if (o.bill.ship !== shippingBaht) add(`ค่าส่งไม่ใช่ ${shippingBaht}`, `${name} ${o.bill.no}`, `บิล ${o.bill.ship} · เกิน ${o.bill.ship - shippingBaht}`);
    if (o.priced && o.rateTotal + o.bill.ship !== o.bill.shop) add("ยอดบิลไม่ตรงเรต", `${name} ${o.bill.no}`, `เรต ${o.rateTotal} + ค่าส่ง ${o.bill.ship} ≠ บิล ${o.bill.shop}`);
    for (const p of o.problems) add("ข้อมูลไม่ครบ", name, p);
  }
  for (const o of late) add("อยู่ในบิล แต่สั่งนอกรอบ", `${label(o)} ${o.bill!.no}`, `สั่ง ${o.at}`);
  for (const r of unbilledRows) add("อยู่ในบิล แต่ไม่พบออเดอร์เว็บ", r.no, `${showDate(r.date)} · ${r.qty} ชิ้น · บิล ${r.shop}`);
  for (const r of other) add("แถวที่ไม่รู้จัก", r.no, `สร้างโดย "${r.by}" · บิล ${r.shop}`);
  const lineOdd = line.filter((r) => r.ship !== shippingBaht);
  for (const r of lineOdd) add(`LINE ค่าส่งไม่ใช่ ${shippingBaht}`, r.no, `${showDate(r.date)} · ค่าส่ง ${r.ship} · บิล ${r.shop}`);
  const sumShop = Math.round(bill.rows.reduce((a, r) => a + r.shop, 0) * 100) / 100;
  if (bill.printedTotal !== null && bill.printedTotal !== sumShop) add("ผลรวมบิลไม่ตรง", "แถวรวม", `บิลพิมพ์ ${bill.printedTotal} · รวมทีละแถว ${sumShop}`);

  const billed = inRound.filter((o) => o.bill);
  const sum = <T,>(a: T[], f: (x: T) => number) => Math.round(a.reduce((n, x) => n + f(x), 0) * 100) / 100;
  return {
    inRound,
    line,
    diffs,
    totals: {
      webOrders: inRound.length,
      webBilled: billed.length,
      webPieces: sum(inRound, (o) => o.qty),
      webPaid: sum(inRound, (o) => o.total),
      webPaidBilled: sum(billed, (o) => o.total),
      webBill: sum(billed, (o) => o.bill!.shop),
      webShipOver: sum(billed, (o) => o.bill!.ship - shippingBaht),
      webProfit: sum(billed, (o) => o.total - o.bill!.shop),
      lineOrders: line.length,
      linePieces: sum(line, (r) => r.qty),
      lineBill: sum(line, (r) => r.shop),
      lineShipOdd: lineOdd.length,
      billRows: bill.rows.length,
      billTotal: sumShop,
      billPrinted: bill.printedTotal,
    },
  };
}

/** Bangkok "YYYY-MM-DDTHH:mm" of the last finished round: Saturday 13:00 to Saturday 13:00. */
export function lastRound(now = Date.now()): { from: string; to: string } {
  const local = new Date(now + 7 * 3_600_000);
  const end = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - ((local.getUTCDay() + 1) % 7), 13));
  if (end.getTime() > local.getTime()) end.setUTCDate(end.getUTCDate() - 7);
  const show = (d: Date) => d.toISOString().slice(0, 16);
  return { from: show(new Date(end.getTime() - 7 * DAY)), to: show(end) };
}

/** Bangkok "YYYY-MM-DDTHH:mm" → the instant, as ISO. */
export const bangkokInstant = (local: string) => new Date(`${local.slice(0, 16)}:00+07:00`).toISOString();

export interface WeekProfit {
  lineSales: number;
  lineProfit: number;
  webProfit: number;
  totalProfit: number;
}

/** Baht. LINE = slips of the round − the bill's LINE rows: the two can sit either side of a round's edge. */
export function weekProfit(totals: RoundTotals, lineSalesSatang: number): WeekProfit {
  const lineSales = lineSalesSatang / 100;
  const lineProfit = Math.round((lineSales - totals.lineBill) * 100) / 100;
  return { lineSales, lineProfit, webProfit: totals.webProfit, totalProfit: Math.round((lineProfit + totals.webProfit) * 100) / 100 };
}
