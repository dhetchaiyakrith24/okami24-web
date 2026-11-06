#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// weekly-bill-check.js — the Saturday 13:00 → Saturday 13:00 Excel: every web order of the round with its warehouse order
// number, code, quantity, rate and the ฿35 shipping, set against the warehouse bill, and every place the two differ
// (round รอบหลังบ้านยอดขาย-07-11 batch 1 · method = LESSONS พ71: read the bill column by column, cost by Max code only).
//
// Cost, rates and profit NEVER enter git (round file 【ห้ามแตะ】): this file holds none, its inputs and its output stay
// outside git (`_incoming/` · `ต้นทุนสินค้า/`), and the output holds no customer name, phone or address.
//
//   node scripts/weekly-bill-check.js --bill <xlsx> --rates <xlsx> --cost <xlsx> --orders <csv> \
//        --from 2026-10-31T13:00 --to 2026-11-07T13:00 --out <xlsx>
//   node scripts/weekly-bill-check.js --args <file.json>   the same flags as {"bill": "...", …} (Thai paths, HANDOFF §17)
//   node scripts/weekly-bill-check.js --self-test          made-up figures, no file needed
//
//   --bill    the warehouse's order sheet: columns are found by their header, so a moved column is fine and a renamed one
//             stops the run with the headers it saw. "(ว่าง)" = web · "Okami" = LINE keyed by admin · H = rate + shipping.
//   --rates   the warehouse's rate sheet (รหัสสินค้า · ราคาเทียบ) of the same round.
//   --cost    the owner's cost file, matched by column รหัสคลัง Shipnity (SKU) ONLY. Never รหัสใน Shipnity Pro: Pro codes were
//             reused for other products (พ71: Pod-180).
//   --orders  the staff Excel export of web orders (/staff/api/export). Only the columns named below are read.
//   --from --to  Bangkok time. Default = the last Saturday 13:00 → now's round end.
//
// A web order and a bill row have no shared number: they are paired by quantity, rate total + shipping = the billed amount
// and a date within a day; orders of the same size pair oldest first with the nearest day, marked in the sheet's last column.
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { readXlsx, writeXlsx, crc32, zipEntries } = require("./lib/xlsx-lite");

/** BSOT §10: the warehouse's flat shipping per order. */
const WAREHOUSE_SHIP = 35;
const PAID_STATUSES = new Set(["อนุมัติแล้ว", "กำลังเตรียมจัดส่ง", "จัดส่งแล้ว", "สำเร็จ"]);
const WEB_MARK = "(ว่าง)";
const LINE_MARK = "Okami";
const DAY = 86_400_000;

const BILL_HEADERS = {
  date: "วันที่สร้าง",
  by: "สร้างโดย",
  no: "เลขที่ออเดอร์",
  ship: "ค่าส่งที่เก็บลูกค้า",
  qty: "จำนวน",
  agent: "ยอดขายตัวแทน",
  shop: "ยอดขายร้านค้า",
};

function findColumns(header, wanted, what) {
  const out = {};
  for (const [key, label] of Object.entries(wanted)) {
    const hit = Object.entries(header).filter(([, v]) => String(v).startsWith(label));
    const col = hit.length > 1 ? hit.find(([, v]) => String(v).split(" (")[0] === label) ?? hit[0] : hit[0];
    if (!col) throw new Error(`${what}: no column "${label}". Headers seen: ${Object.values(header).join(" | ")}`);
    out[key] = col[0];
  }
  return out;
}

/** Rounded to the satang: the bill's own formulas leave 1390.0000000000002. */
const parseNumber = (v) => Math.round(Number(String(v ?? "").replace(/[,฿\s]/g, "")) * 100) / 100;

/** "31/10/26" or an Excel date serial → ms at Bangkok midnight, as UTC. */
function billDate(v) {
  const s = String(v ?? "").trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    const y = +m[3] < 100 ? 2000 + +m[3] : +m[3] > 2400 ? +m[3] - 543 : +m[3];
    return Date.UTC(y, +m[2] - 1, +m[1]);
  }
  if (/^\d{5}(\.\d+)?$/.test(s)) return Math.floor(+s) * DAY - 25569 * DAY;
  return null;
}
const showDate = (ms) => new Date(ms).toISOString().slice(0, 10);

function readBill(file) {
  const sheet = readXlsx(file)[0];
  const cols = findColumns(sheet.rows[0], BILL_HEADERS, "bill");
  const rows = [];
  let date = null;
  let by = "";
  let printedTotal = null;
  for (const r of sheet.rows.slice(1)) {
    const first = String(r[cols.date] ?? "");
    const d = billDate(first);
    if (d !== null) date = d;
    if (r[cols.by]) by = r[cols.by];
    if (first.startsWith("ผลรวม")) continue;
    if (first === "รวม") {
      printedTotal = parseNumber(r[cols.shop]);
      continue;
    }
    if (!r[cols.no]) continue;
    rows.push({ date, by, no: r[cols.no], ship: parseNumber(r[cols.ship]), qty: parseNumber(r[cols.qty]), agent: parseNumber(r[cols.agent]), shop: parseNumber(r[cols.shop]) });
  }
  return { rows, printedTotal };
}

function readRates(file) {
  const sheet = readXlsx(file)[0];
  const cols = findColumns(sheet.rows[0], { code: "รหัสสินค้า", name: "ชื่อสินค้า", rate: "ราคาเทียบ" }, "rates");
  const rates = {};
  for (const r of sheet.rows.slice(1)) if (r[cols.code]) rates[r[cols.code]] = { rate: parseNumber(r[cols.rate]), name: r[cols.name] };
  return rates;
}

/** Owner's cost file: Max product code ("Pod-171") → cost in baht, or a note when the cell holds no number. */
function readCost(file) {
  for (const sheet of readXlsx(file)) {
    const header = sheet.rows[0] || {};
    if (!Object.values(header).some((v) => String(v).startsWith("รหัสคลัง Shipnity"))) continue;
    const cols = findColumns(header, { code: "รหัสคลัง Shipnity", cost: "ราคาทุนที่ใช้" }, "cost");
    const cost = {};
    for (const r of sheet.rows.slice(1)) {
      for (const code of String(r[cols.code] ?? "").split(/[·,/ ]+/).filter((c) => c && c !== "—")) {
        if (code in cost) continue;
        const n = parseNumber(r[cols.cost]);
        cost[code] = Number.isFinite(n) && n > 0 ? n : null;
      }
    }
    return cost;
  }
  throw new Error("cost: no sheet with a รหัสคลัง Shipnity column");
}

function csvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const body = text.replace(/^﻿/, "");
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quoted) {
      if (c === '"' && body[i + 1] === '"') {
        cell += '"';
        i++;
      }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === "," || c === "\n") {
      row.push(cell.replace(/\r$/, ""));
      cell = "";
      if (c === "\n") {
        rows.push(row);
        row = [];
      }
    } else cell += c;
  }
  if (cell || row.length) rows.push([...row, cell]);
  return rows;
}

/** One entry per order, lines inside. keepZeros cells arrive as ="0042" (src/lib/staff/csv.ts). */
function readOrders(file) {
  const [head, ...rows] = csvRows(fs.readFileSync(file, "utf8"));
  const at = Object.fromEntries(head.map((h, i) => [h, i]));
  for (const h of ["เลขออเดอร์", "เลขรัน", "วันเวลาสั่ง", "สถานะ", "สินค้า", "ตัวเลือก", "จำนวน", "ราคาต่อชิ้น (บาท)", "ค่าส่ง (บาท)", "ยอดออเดอร์ (บาท)", "รหัสคลัง"])
    if (!(h in at)) throw new Error(`orders: no column "${h}"`);
  const clean = (v) => String(v ?? "").replace(/^="?|"$/g, "");
  const orders = new Map();
  for (const r of rows) {
    const id = clean(r[at["เลขออเดอร์"]]);
    if (!id) continue;
    if (!orders.has(id))
      orders.set(id, {
        id,
        run: clean(r[at["เลขรัน"]]),
        at: r[at["วันเวลาสั่ง"]],
        status: r[at["สถานะ"]],
        ship: parseNumber(r[at["ค่าส่ง (บาท)"]]),
        total: parseNumber(r[at["ยอดออเดอร์ (บาท)"]]),
        lines: [],
      });
    orders.get(id).lines.push({
      name: r[at["สินค้า"]],
      option: r[at["ตัวเลือก"]],
      qty: parseNumber(r[at["จำนวน"]]),
      unit: parseNumber(r[at["ราคาต่อชิ้น (บาท)"]]),
      code: clean(r[at["รหัสคลัง"]]),
    });
  }
  return [...orders.values()];
}

/** "2026-10-31 13:00" (Bangkok) → ms as if UTC, so it compares with itself only. */
const orderMs = (s) => Date.parse(String(s).trim().replace(" ", "T") + ":00Z");
const productCode = (code) => code.replace(/-\d+$/, "");

function priceOrder(order, rates, cost) {
  let rateTotal = 0;
  let costTotal = 0;
  let qty = 0;
  const problems = [];
  const lines = order.lines.map((l) => {
    const warehouse = rates[l.code]?.rate ?? null;
    const ours = cost[productCode(l.code)] ?? null;
    qty += l.qty;
    if (!l.code) problems.push(`${l.name} ${l.option}: ไม่มีรหัสคลัง`);
    else if (warehouse === null) problems.push(`${l.code} ${l.name} ${l.option}: ไม่มีเรตในไฟล์คลัง`);
    if (l.code && ours === null) problems.push(`${l.code} ${l.name}: ไม่มีทุนในไฟล์ทุน`);
    if (warehouse !== null && ours !== null && warehouse !== ours) problems.push(`${l.code} ${l.name}: เรตคลัง ≠ ไฟล์ทุน`);
    rateTotal += (warehouse ?? 0) * l.qty;
    costTotal += (ours ?? 0) * l.qty;
    return { ...l, warehouse, ours };
  });
  return { ...order, lines, qty, rateTotal, costTotal, priced: lines.every((l) => l.warehouse !== null), problems };
}

/**
 * Pair web orders with the bill's web rows, each row used once. Two passes: the exact pair (quantity + rate total + the
 * billed shipping = billed amount, date within a day), then for an order whose rate was off, quantity + customer total
 * = the bill's agent column.
 */
function pairOrders(orders, webRows) {
  const free = new Set(webRows);
  const dayGap = (o, r) => Math.abs(Math.floor(orderMs(o.at) / DAY) * DAY - r.date) / DAY;
  const near = (o, r) => r.date !== null && dayGap(o, r) <= 1;
  const oldest = [...orders].sort((a, b) => orderMs(a.at) - orderMs(b.at));
  const take = (o, tests, how) => {
    if (o.bill) return;
    const hits = [...free].filter((r) => r.qty === o.qty && near(o, r) && tests(r));
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

const label = (o) => o.run || o.id;

function checkRound({ bill, rates, cost, orders, from, to }) {
  const fromMs = orderMs(from.replace("T", " "));
  const toMs = orderMs(to.replace("T", " "));
  const paid = orders.filter((o) => PAID_STATUSES.has(o.status)).map((o) => priceOrder(o, rates, cost));
  const web = bill.rows.filter((r) => r.by === WEB_MARK);
  const line = bill.rows.filter((r) => r.by === LINE_MARK);
  const other = bill.rows.filter((r) => r.by !== WEB_MARK && r.by !== LINE_MARK);
  const unbilledRows = pairOrders(paid, web);
  const inRound = paid.filter((o) => orderMs(o.at) >= fromMs && orderMs(o.at) < toMs).sort((a, b) => orderMs(a.at) - orderMs(b.at));
  const late = paid.filter((o) => o.bill && !inRound.includes(o));

  const diffs = [];
  const add = (kind, where, detail) => diffs.push({ kind, where, detail });
  for (const o of inRound) {
    const name = label(o);
    if (!o.bill) {
      add("ไม่อยู่ในบิล", name, `สั่ง ${o.at} · ลูกค้าจ่าย ${o.total}`);
      continue;
    }
    if (o.bill.qty !== o.qty) add("จำนวนไม่ตรง", name, `เรา ${o.qty} · บิล ${o.bill.qty}`);
    if (o.bill.ship !== WAREHOUSE_SHIP) add("ค่าส่งไม่ใช่ 35", `${name} ${o.bill.no}`, `บิล ${o.bill.ship} · เกิน ${o.bill.ship - WAREHOUSE_SHIP}`);
    if (o.priced && o.rateTotal + o.bill.ship !== o.bill.shop) add("ยอดบิลไม่ตรงเรต", `${name} ${o.bill.no}`, `เรต ${o.rateTotal} + ค่าส่ง ${o.bill.ship} ≠ บิล ${o.bill.shop}`);
    for (const p of o.problems) add("ข้อมูลไม่ครบ", name, p);
  }
  for (const o of late) add("อยู่ในบิล แต่สั่งนอกรอบ", `${label(o)} ${o.bill.no}`, `สั่ง ${o.at}`);
  for (const r of unbilledRows) add("อยู่ในบิล แต่ไม่พบออเดอร์เว็บ", r.no, `${showDate(r.date)} · ${r.qty} ชิ้น · บิล ${r.shop}`);
  for (const r of other) add("แถวที่ไม่รู้จัก", r.no, `สร้างโดย "${r.by}" · บิล ${r.shop}`);
  const lineOdd = line.filter((r) => r.ship !== WAREHOUSE_SHIP);
  for (const r of lineOdd) add("LINE ค่าส่งไม่ใช่ 35", r.no, `${showDate(r.date)} · ค่าส่ง ${r.ship} · บิล ${r.shop}`);
  const sumShop = bill.rows.reduce((a, r) => a + r.shop, 0);
  if (bill.printedTotal !== null && bill.printedTotal !== sumShop) add("ผลรวมบิลไม่ตรง", "แถวรวม", `บิลพิมพ์ ${bill.printedTotal} · รวมทีละแถว ${sumShop}`);

  const billed = inRound.filter((o) => o.bill);
  const sum = (a, f) => a.reduce((n, x) => n + f(x), 0);
  const totals = {
    webOrders: inRound.length,
    webBilled: billed.length,
    webPieces: sum(inRound, (o) => o.qty),
    webPaid: sum(inRound, (o) => o.total),
    webPaidBilled: sum(billed, (o) => o.total),
    webBill: sum(billed, (o) => o.bill.shop),
    webShipOver: sum(billed, (o) => o.bill.ship - WAREHOUSE_SHIP),
    webProfit: sum(billed, (o) => o.total - o.bill.shop),
    lineOrders: line.length,
    linePieces: sum(line, (r) => r.qty),
    lineBill: sum(line, (r) => r.shop),
    lineShipOdd: lineOdd.length,
    billRows: bill.rows.length,
    billTotal: sumShop,
    billPrinted: bill.printedTotal,
  };
  return { inRound, line, diffs, totals };
}

function buildSheets(result, meta) {
  const { inRound, line, diffs, totals: t } = result;
  const summary = [
    ["เรื่อง", "ค่า"],
    ["รอบ (เวลาไทย)", `${meta.from} ถึง ${meta.to}`],
    ["ออเดอร์เว็บที่จ่ายแล้วในรอบ", t.webOrders],
    ["อยู่ในบิล", t.webBilled],
    ["จำนวนชิ้นเว็บ", t.webPieces],
    ["ลูกค้าเว็บจ่ายรวม (บาท)", t.webPaid],
    ["ลูกค้าเว็บจ่าย เฉพาะออเดอร์ที่อยู่ในบิล (บาท)", t.webPaidBilled],
    ["คลังเรียกเก็บเว็บ (บาท)", t.webBill],
    ["ค่าส่งเกิน 35 ของเว็บ (บาท)", t.webShipOver],
    ["กำไรเว็บตามบิล (บาท)", t.webProfit],
    ["ออเดอร์ LINE (Okami) ในบิล", t.lineOrders],
    ["จำนวนชิ้น LINE", t.linePieces],
    ["คลังเรียกเก็บ LINE (บาท)", t.lineBill],
    ["LINE ที่ค่าส่งไม่ใช่ 35 (ใบ)", t.lineShipOdd],
    ["ทั้งบิล (บาท)", t.billTotal],
    ["ผลรวมที่บิลพิมพ์ (บาท)", t.billPrinted],
    ["จุดไม่ตรงทั้งหมด", diffs.length],
  ];
  const orderHead = ["เลขรัน", "เลขคลัง", "วันเวลาสั่ง", "รหัส", "สินค้า", "ตัวเลือก", "จำนวน", "เรตคลัง", "ทุนไฟล์ทุน", "ค่าส่ง 35", "เรตรวม+35", "คลังเก็บจริง", "ค่าส่งในบิล", "ส่วนต่าง", "ลูกค้าจ่าย", "กำไรตามบิล", "การจับคู่"];
  const orderRows = [orderHead];
  for (const o of inRound) {
    o.lines.forEach((l, i) => {
      const first = i === 0;
      orderRows.push([
        first ? label(o) : "",
        first ? (o.bill ? o.bill.no : "ไม่อยู่ในบิล") : "",
        first ? o.at : "",
        l.code,
        l.name,
        l.option,
        l.qty,
        l.warehouse,
        l.ours,
        first ? WAREHOUSE_SHIP : "",
        first ? o.rateTotal + WAREHOUSE_SHIP : "",
        first && o.bill ? o.bill.shop : "",
        first && o.bill ? o.bill.ship : "",
        first && o.bill ? o.bill.shop - (o.rateTotal + WAREHOUSE_SHIP) : "",
        first ? o.total : "",
        first && o.bill ? o.total - o.bill.shop : "",
        first ? o.pairing || "" : "",
      ]);
    });
  }
  const lineRows = [["วันที่บิล", "เลขคลัง", "จำนวน", "ค่าส่ง", "คลังเก็บ", "หมายเหตุ"]];
  for (const r of line) lineRows.push([showDate(r.date), r.no, r.qty, r.ship, r.shop, r.ship === WAREHOUSE_SHIP ? "" : "ค่าส่งไม่ใช่ 35"]);
  const diffRows = [["เรื่อง", "ที่ไหน", "รายละเอียด"], ...diffs.map((d) => [d.kind, d.where, d.detail])];
  return [
    { name: "สรุป", rows: summary, widths: [44, 34] },
    { name: "จุดไม่ตรง", rows: diffRows, widths: [28, 20, 60] },
    { name: "ออเดอร์เว็บ", rows: orderRows, widths: [9, 11, 17, 16, 28, 22, 7, 9, 10, 9, 10, 11, 10, 9, 10, 10, 26] },
    { name: "LINE ในบิล", rows: lineRows, widths: [12, 11, 8, 8, 10, 18] },
  ];
}

function defaultRound() {
  const now = new Date(Date.now() + 7 * 3_600_000);
  const back = (now.getUTCDay() + 1) % 7;
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - back, 13));
  if (end > now) end.setUTCDate(end.getUTCDate() - 7);
  const start = new Date(end.getTime() - 7 * DAY);
  const show = (d) => d.toISOString().slice(0, 16);
  return { from: show(start), to: show(end) };
}

function selfTest() {
  let bad = 0;
  const check = (name, ok) => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
    if (!ok) bad++;
  };
  const rates = { "Pod-1-1": { rate: 100 }, "Pod-1-2": { rate: 100 }, "Pod-2-1": { rate: 70 } };
  const cost = { "Pod-1": 100, "Pod-2": 60 };
  const order = (id, run, at, code, qty, total, status = "จัดส่งแล้ว") => ({ id, run: `#${run}`, at, status, ship: 0, total, lines: [{ name: code, option: "", qty, unit: 0, code }] });
  const orders = [
    order("A", "0001", "2026-11-01 10:00", "Pod-1-1", 2, 400),
    order("B", "0002", "2026-11-02 10:00", "Pod-1-2", 2, 420),
    order("C", "0003", "2026-11-03 10:00", "Pod-2-1", 1, 200),
    order("D", "0004", "2026-11-04 10:00", "Pod-1-1", 3, 600),
    order("E", "0005", "2026-11-04 11:00", "Pod-1-1", 1, 200, "ยกเลิกแล้ว"),
    order("F", "0006", "2026-10-30 10:00", "Pod-1-1", 1, 200),
    order("G", "0007", "2026-11-05 10:00", "Pod-1-1", 1, 200),
    order("H", "0008", "2026-11-06 10:00", "Pod-1-1", 1, 200),
  ];
  const d = (day) => Date.UTC(2026, 10, day);
  const rows = [
    { date: d(1), by: "(ว่าง)", no: "C1", ship: 35, qty: 2, agent: 400, shop: 235 },
    { date: d(2), by: "(ว่าง)", no: "C2", ship: 50, qty: 2, agent: 420, shop: 250 },
    { date: d(3), by: "(ว่าง)", no: "C3", ship: 35, qty: 1, agent: 200, shop: 115 },
    { date: d(5), by: "(ว่าง)", no: "C9", ship: 35, qty: 9, agent: 999, shop: 935 },
    { date: d(6), by: "(ว่าง)", no: "C7", ship: 50, qty: 1, agent: 200, shop: 150 },
    { date: d(5), by: "(ว่าง)", no: "C6", ship: 50, qty: 1, agent: 185, shop: 150 },
    { date: d(2), by: "Okami", no: "B1", ship: 35, qty: 1, agent: 0, shop: 135 },
    { date: d(2), by: "Okami", no: "B2", ship: 50, qty: 1, agent: 0, shop: 150 },
  ];
  const r = checkRound({ bill: { rows, printedTotal: rows.reduce((a, x) => a + x.shop, 0) + 1 }, rates, cost, orders, from: "2026-10-31T13:00", to: "2026-11-07T13:00" });
  const has = (kind, where) => r.diffs.some((x) => x.kind === kind && (!where || x.where.includes(where)));
  check("exact pair found", r.inRound.find((o) => o.id === "A").bill?.no === "C1");
  check("shipping 50 still pairs and is flagged", r.inRound.find((o) => o.id === "B").bill?.no === "C2" && has("ค่าส่งไม่ใช่ 35", "#0002"));
  check("rate differs from the bill → paired by customer total and flagged", r.inRound.find((o) => o.id === "C").bill?.no === "C3" && has("ยอดบิลไม่ตรงเรต", "#0003"));
  check("warehouse rate ≠ cost file flagged", has("ข้อมูลไม่ครบ", "#0003"));
  check("paid order missing from the bill flagged", has("ไม่อยู่ในบิล", "#0004"));
  check("same-size orders pair by the nearest day, not by the agent column", r.inRound.find((o) => o.id === "G").bill?.no === "C6" && r.inRound.find((o) => o.id === "H").bill?.no === "C7");
  check("cancelled order ignored", !r.inRound.some((o) => o.id === "E"));
  check("order before the round left out", !r.inRound.some((o) => o.id === "F"));
  check("bill row with no web order flagged", has("อยู่ในบิล แต่ไม่พบออเดอร์เว็บ", "C9"));
  check("LINE shipping not 35 flagged", has("LINE ค่าส่งไม่ใช่ 35", "B2"));
  check("bill total printed wrong flagged", has("ผลรวมบิลไม่ตรง"));
  check("web bill total", r.totals.webBill === 235 + 250 + 115 + 150 + 150 && r.totals.webShipOver === 45);
  check("bill date forms", billDate("31/10/26") === Date.UTC(2026, 9, 31) && billDate("31/10/2569") === Date.UTC(2026, 9, 31) && billDate("46326") === Date.UTC(2026, 9, 31));
  check("keepZeros order cells read", (() => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bill-check-"));
    const f = path.join(dir, "o.csv");
    const head = ["เลขออเดอร์", "เลขรัน", "วันเวลาสั่ง", "สถานะ", "สินค้า", "ตัวเลือก", "จำนวน", "ราคาต่อชิ้น (บาท)", "ค่าส่ง (บาท)", "ยอดออเดอร์ (บาท)", "รหัสคลัง"];
    const row = ['"=""OK-1"""', '"#0007"', '"2026-11-01 10:00"', '"จัดส่งแล้ว"', '"a, b"', '""', "1", "2", "3", "4", '"Pod-1-1"'];
    fs.writeFileSync(f, "﻿" + head.map((h) => `"${h}"`).join(",") + "\r\n" + row.join(",") + "\r\n");
    const [o] = readOrders(f);
    fs.rmSync(dir, { recursive: true });
    return o.id === "OK-1" && o.run === "#0007" && o.lines[0].name === "a, b" && o.total === 4;
  })());
  check("xlsx round trip keeps text and numbers", (() => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bill-check-"));
    const f = path.join(dir, "t.xlsx");
    writeXlsx(f, [{ name: "ทดสอบ", rows: [["หัว", "b&c"], [12, "<ไทย>"]] }]);
    const [s] = readXlsx(f);
    const zipOk = Object.keys(zipEntries(fs.readFileSync(f))).includes("xl/workbook.xml");
    fs.rmSync(dir, { recursive: true });
    return zipOk && s.name === "ทดสอบ" && s.rows[0].B === "b&c" && s.rows[1].A === "12" && s.rows[1].B === "<ไทย>";
  })());
  check("crc32 known value", crc32(Buffer.from("123456789")) === 0xcbf43926);
  const dr = defaultRound();
  check("default round is Saturday 13:00 to Saturday 13:00", new Date(dr.to + "Z").getUTCDay() === 6 && new Date(dr.from + "Z").getUTCDay() === 6 && dr.to.endsWith("13:00"));
  console.log(bad === 0 ? "self-test: PASS" : `self-test: FAIL (${bad})`);
  process.exit(bad === 0 ? 0 : 1);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--self-test")) return selfTest();
  const opts = {};
  for (let i = 0; i < argv.length; i += 2) opts[argv[i].replace(/^--/, "")] = argv[i + 1];
  if (opts.args) Object.assign(opts, JSON.parse(fs.readFileSync(opts.args, "utf8").replace(/^﻿/, "")));
  const round = defaultRound();
  const from = opts.from || round.from;
  const to = opts.to || round.to;
  for (const need of ["bill", "rates", "cost", "orders", "out"]) if (!opts[need]) throw new Error(`--${need} is required (see the head of this file)`);
  const out = path.resolve(opts.out);
  const inGit = require("child_process").spawnSync("git", ["-C", path.dirname(out), "check-ignore", "-q", out]);
  if (inGit.status === 1) throw new Error(`--out ${out} is not ignored by git: cost and profit must stay out of git`);

  const result = checkRound({ bill: readBill(opts.bill), rates: readRates(opts.rates), cost: readCost(opts.cost), orders: readOrders(opts.orders), from, to });
  writeXlsx(out, buildSheets(result, { from, to }));
  console.log(JSON.stringify({ round: `${from} → ${to}`, ...result.totals, diffs: result.diffs.length }, null, 1));
  const kinds = {};
  for (const d of result.diffs) kinds[d.kind] = (kinds[d.kind] || 0) + 1;
  console.log(kinds);
  console.log(`wrote ${out}`);
}

if (require.main === module) main();
module.exports = { checkRound, readBill, readRates, readCost, readOrders };
