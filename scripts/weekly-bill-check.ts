// weekly-bill-check.ts — the Saturday 13:00 → Saturday 13:00 Excel: every web order of the round with its warehouse order
// number, code, quantity, rate and the ฿35 shipping, set against the warehouse bill, and every place the two differ
// (round รอบหลังบ้านยอดขาย-07-11 batch 1 · method = LESSONS พ71). The check itself = src/lib/owner/bill-rules.ts, the same one
// the owner's page runs; this script is its Excel, for a round that has to be read on a computer.
//
// Cost, rates and profit NEVER enter git (round file 【ห้ามแตะ】): this file holds none, its inputs and its output stay outside
// git (`_incoming/` · `ต้นทุนสินค้า/`), and the output holds no customer name, phone or address.
//
//   npx tsx scripts/weekly-bill-check.ts --bill <xlsx> --rates <xlsx> --cost <xlsx> --orders <csv> \
//        --from 2026-10-31T13:00 --to 2026-11-07T13:00 --out <xlsx>
//   npx tsx scripts/weekly-bill-check.ts --args <file.json>   the same flags as {"bill": "...", …} (Thai paths, HANDOFF §17)
//
//   --bill    the warehouse's order sheet · --rates its rate sheet of the same round · --cost the owner's cost file
//   --orders  the staff Excel export of web orders (/staff/api/export). Only the columns named below are read.
//   --from --to  Bangkok time. Default = the last finished round.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { checkRound, lastRound, PAID_STATUSES_TH, readBill, readRates, showDate, type BillOrder, type RoundResult } from "../src/lib/owner/bill-rules";
import { readCostFile } from "../src/lib/owner/cost-rules";
import { parseAmount, readXlsx } from "../src/lib/owner/xlsx-read";
// eslint-disable-next-line @typescript-eslint/no-require-imports -- plain Node helper, CommonJS
const { writeXlsx } = require("./lib/xlsx-lite") as { writeXlsx: (file: string, sheets: { name: string; rows: (string | number | null)[][]; widths?: number[] }[]) => void };

/** BSOT §10: the warehouse's flat shipping per order. */
const WAREHOUSE_SHIP = 35;

function csvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const body = text.replace(/^﻿/, "");
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quoted) {
      if (c === '"' && body[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
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

/** Paid web orders, lines inside. keepZeros cells arrive as ="0042" (src/lib/staff/csv.ts). */
function readOrders(file: string): BillOrder[] {
  const [head, ...rows] = csvRows(fs.readFileSync(file, "utf8"));
  const at = Object.fromEntries(head.map((h, i) => [h, i]));
  for (const h of ["เลขออเดอร์", "เลขรัน", "วันเวลาสั่ง", "สถานะ", "สินค้า", "ตัวเลือก", "จำนวน", "ยอดออเดอร์ (บาท)", "รหัสคลัง"]) if (!(h in at)) throw new Error(`orders: no column "${h}"`);
  const clean = (v: string | undefined) => String(v ?? "").replace(/^="?|"$/g, "");
  const orders = new Map<string, BillOrder>();
  for (const r of rows) {
    const id = clean(r[at["เลขออเดอร์"]]);
    if (!id || !PAID_STATUSES_TH.includes(r[at["สถานะ"]])) continue;
    const order = orders.get(id) ?? { id, run: clean(r[at["เลขรัน"]]), at: r[at["วันเวลาสั่ง"]], total: parseAmount(r[at["ยอดออเดอร์ (บาท)"]]), lines: [] };
    order.lines.push({ name: r[at["สินค้า"]], option: r[at["ตัวเลือก"]], qty: parseAmount(r[at["จำนวน"]]), code: clean(r[at["รหัสคลัง"]]) });
    orders.set(id, order);
  }
  return [...orders.values()];
}

function buildSheets(result: RoundResult, from: string, to: string) {
  const { inRound, line, diffs, totals: t } = result;
  const summary: (string | number | null)[][] = [
    ["เรื่อง", "ค่า"],
    ["รอบ (เวลาไทย)", `${from} ถึง ${to}`],
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
  const orderRows: (string | number | null)[][] = [["เลขรัน", "เลขคลัง", "วันเวลาสั่ง", "รหัส", "สินค้า", "ตัวเลือก", "จำนวน", "เรตคลัง", "ทุนไฟล์ทุน", "ค่าส่ง 35", "เรตรวม+35", "คลังเก็บจริง", "ค่าส่งในบิล", "ส่วนต่าง", "ลูกค้าจ่าย", "กำไรตามบิล", "การจับคู่"]];
  for (const o of inRound) {
    o.lines.forEach((l, i) => {
      const first = i === 0;
      orderRows.push([
        first ? o.run || o.id : "",
        first ? (o.bill ? o.bill.no : "ไม่อยู่ในบิล") : "",
        first ? o.at : "",
        l.code,
        l.name,
        l.option,
        l.qty,
        l.warehouse ?? null,
        l.ours ?? null,
        first ? WAREHOUSE_SHIP : "",
        first ? o.rateTotal + WAREHOUSE_SHIP : "",
        first && o.bill ? o.bill.shop : "",
        first && o.bill ? o.bill.ship : "",
        first && o.bill ? o.bill.shop - (o.rateTotal + WAREHOUSE_SHIP) : "",
        first ? o.total : "",
        first && o.bill ? o.total - o.bill.shop : "",
        first ? (o.pairing ?? "") : "",
      ]);
    });
  }
  const lineRows: (string | number | null)[][] = [["วันที่บิล", "เลขคลัง", "จำนวน", "ค่าส่ง", "คลังเก็บ", "หมายเหตุ"]];
  for (const r of line) lineRows.push([showDate(r.date), r.no, r.qty, r.ship, r.shop, r.ship === WAREHOUSE_SHIP ? "" : "ค่าส่งไม่ใช่ 35"]);
  return [
    { name: "สรุป", rows: summary, widths: [44, 34] },
    { name: "จุดไม่ตรง", rows: [["เรื่อง", "ที่ไหน", "รายละเอียด"], ...diffs.map((d) => [d.kind, d.where, d.detail])], widths: [28, 20, 60] },
    { name: "ออเดอร์เว็บ", rows: orderRows, widths: [9, 11, 17, 16, 28, 22, 7, 9, 10, 9, 10, 11, 10, 9, 10, 10, 26] },
    { name: "LINE ในบิล", rows: lineRows, widths: [12, 11, 8, 8, 10, 18] },
  ];
}

function main(): void {
  const argv = process.argv.slice(2);
  const opts: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) opts[argv[i].replace(/^--/, "")] = argv[i + 1];
  if (opts.args) Object.assign(opts, JSON.parse(fs.readFileSync(opts.args, "utf8").replace(/^﻿/, "")));
  const round = lastRound();
  const from = opts.from || round.from;
  const to = opts.to || round.to;
  for (const need of ["bill", "rates", "cost", "orders", "out"]) if (!opts[need]) throw new Error(`--${need} is required (see the head of this file)`);
  const out = path.resolve(opts.out);
  if (spawnSync("git", ["-C", path.dirname(out), "check-ignore", "-q", out]).status === 1) throw new Error(`--out ${out} is not ignored by git: cost and profit must stay out of git`);

  const sheets = (file: string) => readXlsx(fs.readFileSync(file));
  const cost = new Map(readCostFile(sheets(opts.cost)).rows.map((r) => [r.code, r.satang / 100]));
  const result = checkRound({ bill: readBill(sheets(opts.bill)), rates: readRates(sheets(opts.rates)), cost, orders: readOrders(opts.orders), from, to, shippingBaht: WAREHOUSE_SHIP });
  writeXlsx(out, buildSheets(result, from, to));
  console.log(JSON.stringify({ round: `${from} → ${to}`, ...result.totals, diffs: result.diffs.length }));
  const kinds: Record<string, number> = {};
  for (const d of result.diffs) kinds[d.kind] = (kinds[d.kind] || 0) + 1;
  console.log(kinds);
  console.log(`wrote ${out}`);
}

main();
