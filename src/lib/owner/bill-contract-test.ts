/**
 * Run: npx tsx src/lib/owner/bill-contract-test.ts
 * Cost, profit and the weekly bill check (cost-rules.ts · bill-rules.ts · xlsx-read.ts). Made-up figures only.
 */
import zlib from "node:zlib";
import { billDate, checkRound, lastRound, readBill, readRates, weekProfit, type BillOrder, type BillRow, type Rates } from "./bill-rules";
import { costChanges, costOn, dailyProfit, orderProfit, readCostFile, type DatedCost } from "./cost-rules";
import { readXlsx, type Sheet } from "./xlsx-read";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

// ---------------------------------------------------------------- reading files
function zipOf(files: Record<string, string>): Buffer {
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const body = Buffer.from(text, "utf8");
    const packed = zlib.deflateRawSync(body);
    const nameBuf = Buffer.from(name, "utf8");
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(body.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt32LE(packed.length, 20);
    dir.writeUInt32LE(body.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    parts.push(local, nameBuf, packed);
    central.push(dir, nameBuf);
    offset += local.length + nameBuf.length + packed.length;
  }
  const dirBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(dirBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, dirBuf, end]);
}
const book = zipOf({
  "xl/workbook.xml": `<workbook><sheets><sheet name="ทดสอบ &amp; ชีต" sheetId="1" r:id="rId1"/></sheets></workbook>`,
  "xl/_rels/workbook.xml.rels": `<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>`,
  "xl/sharedStrings.xml": `<sst><si><t>หัว</t></si><si><r><t>แบ่ง</t></r><r><t>ท่อน</t></r></si></sst>`,
  "xl/worksheets/sheet1.xml": `<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="inlineStr"><is><t>a&amp;b</t></is></c></row><row r="2"><c r="A2" t="s"><v>1</v></c><c r="C2"><v>12.5</v></c></row></sheetData></worksheet>`,
});
const read = readXlsx(book);
check("xlsx: names, shared, inline, split and number cells", read[0].name === "ทดสอบ & ชีต" && read[0].rows[0].A === "หัว" && read[0].rows[0].B === "a&b" && read[0].rows[1].A === "แบ่งท่อน" && read[0].rows[1].C === "12.5");
let refused = false;
try {
  readXlsx(Buffer.from("not a zip file at all, just some text to fill the bytes"));
} catch {
  refused = true;
}
check("xlsx: a file that is not one is refused", refused);

// ---------------------------------------------------------------- cost
const costSheet: Sheet = {
  name: "ทุน",
  rows: [
    { A: "ชื่อ", B: "รหัสคลัง Shipnity (SKU)", C: "รหัสใน Shipnity Pro", D: "ราคาทุนที่ใช้ (บาท)" },
    { A: "ก", B: "Pod-1 · Pod-2", C: "Pod-9", D: "100" },
    { A: "ข", B: "—", C: "Pod-3", D: "77" },
    { A: "ค", B: "Pod-4", C: "", D: "รอพี่แจ้ง" },
    { A: "ง", B: "Pod-1", C: "", D: "999" },
  ],
};
const file = readCostFile([{ name: "อื่น", rows: [{ A: "x" }] }, costSheet]);
check("cost file: finds its sheet, splits codes", file.rows.length === 2 && file.rows[0].code === "Pod-1" && file.rows[1].code === "Pod-2" && file.rows[0].satang === 10_000);
check("cost file: never reads the Pro column (LESSONS 71)", !file.rows.some((r) => r.code === "Pod-3" || r.code === "Pod-9"));
check("cost file: a cell with no number is listed, not guessed", file.noNumber.join() === "Pod-4");
check("cost file: the first row of a code wins", file.rows.find((r) => r.code === "Pod-1")?.satang === 10_000);

const changes = costChanges(new Map([["Pod-1", 10_000], ["Pod-2", 5_000], ["Pod-8", 1]]), file.rows);
check("cost changes: same = none, new price listed, absent code kept", changes.length === 1 && changes[0].code === "Pod-2" && changes[0].fromSatang === 5_000);

const dated = (code: string, satang: number, from: string): DatedCost => ({ code, satang, from });
const history = new Map([["Pod-1", [dated("Pod-1", 12_000, "2026-11-05"), dated("Pod-1", 10_000, "2026-11-01")]]]);
check("cost on a date: the one in force", costOn(history.get("Pod-1")!, "2026-11-03") === 10_000 && costOn(history.get("Pod-1")!, "2026-11-05") === 12_000);
check("cost on a date: older than the table = the first ever", costOn(history.get("Pod-1")!, "2026-10-01") === 10_000);
check("cost on a date: none = null", costOn([], "2026-11-01") === null);

const order = { orderNumber: "A", runNumber: 1, total: 500, date: "2026-11-03", lines: [{ code: "Pod-1-4", quantity: 2 }] };
check("order profit = paid − cost × qty − shipping", orderProfit(order, history, 35).profitSatang === 50_000 - 20_000 - 3_500);
const noCost = { ...order, orderNumber: "B", lines: [{ code: "Pod-1-4", quantity: 1 }, { code: "Pod-7-1", quantity: 1 }] };
check("a line with no cost = no profit figure, code named", orderProfit(noCost, history, 35).profitSatang === null && orderProfit(noCost, history, 35).missing.join() === "Pod-7-1");
const noCode = { ...order, orderNumber: "C", lines: [{ code: null, quantity: 1 }] };
check("a line with no warehouse code = no profit figure", orderProfit(noCode, history, 35).profitSatang === null);
const [day] = dailyProfit(["2026-11-03"], [order, noCost, { ...order, orderNumber: "D", date: "2026-11-02" }], history, 35);
check("day profit counts priced orders, flags the rest, skips other days", day.profitSatang === 26_500 && day.unpriced === 1 && day.orders.length === 2 && day.salesSatang === 50_000);

// ---------------------------------------------------------------- bill
const billSheet: Sheet = {
  name: "บิล",
  rows: [
    { A: "วันที่สร้าง (ออเดอร์)", B: "สร้างโดย (ออเดอร์)", C: "เลขที่ออเดอร์ (ออเดอร์)", D: "ค่าส่งที่เก็บลูกค้า (ออเดอร์)", E: "จำนวน", F: "นับจำนวนรายการ", G: "ยอดขายตัวแทน", H: "ยอดขายร้านค้า (ใหม่) (สูตร)" },
    { A: "02/11/26", B: "Okami", C: "B1", D: "35.00", E: "1", F: "1", G: "0", H: "135" },
    { A: "ผลรวม Okami", E: "1", H: "135" },
    { A: "รวม", E: "1", H: "135" },
  ],
};
const parsedBill = readBill([billSheet]);
check("bill: rows read by header, sum lines skipped, printed total kept", parsedBill.rows.length === 1 && parsedBill.rows[0].by === "Okami" && parsedBill.rows[0].shop === 135 && parsedBill.printedTotal === 135);
let renamed = "";
try {
  readBill([{ name: "x", rows: [{ A: "อื่น" }] }]);
} catch (e) {
  renamed = String(e);
}
check("bill: a renamed column stops the check and names what it saw", renamed.includes("อื่น"));
check("rates: read by header", readRates([{ name: "r", rows: [{ A: "รหัสสินค้า", B: "ชื่อสินค้า", C: "ราคาปลีก", D: "ราคาเทียบ" }, { A: "Pod-1-1", B: "ก", C: "300", D: "100" }] }])["Pod-1-1"].rate === 100);
check("bill dates: short · Buddhist year · Excel serial", billDate("31/10/26") === Date.UTC(2026, 9, 31) && billDate("31/10/2569") === Date.UTC(2026, 9, 31) && billDate("46326") === Date.UTC(2026, 9, 31));

const rates: Rates = { "Pod-1-1": { rate: 100, name: "" }, "Pod-1-2": { rate: 100, name: "" }, "Pod-2-1": { rate: 70, name: "" } };
const cost = new Map([["Pod-1", 100], ["Pod-2", 60]]);
const web = (id: string, at: string, code: string, qty: number, total: number): BillOrder => ({ id, run: `#${id}`, at, total, lines: [{ name: code, option: "", qty, code }] });
const orders = [
  web("1", "2026-11-01 10:00", "Pod-1-1", 2, 400),
  web("2", "2026-11-02 10:00", "Pod-1-2", 2, 420),
  web("3", "2026-11-03 10:00", "Pod-2-1", 1, 200),
  web("4", "2026-11-04 10:00", "Pod-1-1", 3, 600),
  web("6", "2026-10-30 10:00", "Pod-1-1", 1, 200),
  web("7", "2026-11-05 10:00", "Pod-1-1", 1, 200),
  web("8", "2026-11-06 10:00", "Pod-1-1", 1, 200),
];
const d = (n: number) => Date.UTC(2026, 10, n);
const rows: BillRow[] = [
  { date: d(1), by: "(ว่าง)", no: "C1", ship: 35, qty: 2, agent: 400, shop: 235 },
  { date: d(2), by: "(ว่าง)", no: "C2", ship: 50, qty: 2, agent: 420, shop: 250 },
  { date: d(3), by: "(ว่าง)", no: "C3", ship: 35, qty: 1, agent: 200, shop: 115 },
  { date: d(5), by: "(ว่าง)", no: "C9", ship: 35, qty: 9, agent: 999, shop: 935 },
  { date: d(6), by: "(ว่าง)", no: "C7", ship: 50, qty: 1, agent: 200, shop: 150 },
  { date: d(5), by: "(ว่าง)", no: "C6", ship: 50, qty: 1, agent: 185, shop: 150 },
  { date: d(2), by: "Okami", no: "B1", ship: 35, qty: 1, agent: 0, shop: 135 },
  { date: d(2), by: "Okami", no: "B2", ship: 50, qty: 1, agent: 0, shop: 150 },
  { date: d(2), by: "ใครสักคน", no: "X1", ship: 35, qty: 1, agent: 0, shop: 10 },
];
const sumRows = rows.reduce((a, x) => a + x.shop, 0);
const r = checkRound({ bill: { rows, printedTotal: sumRows + 1 }, rates, cost, orders, from: "2026-10-31T13:00", to: "2026-11-07T13:00", shippingBaht: 35 });
const has = (kind: string, where = "") => r.diffs.some((x) => x.kind === kind && x.where.includes(where));
const paired = (id: string) => r.inRound.find((o) => o.id === id)?.bill?.no;
check("pair: exact", paired("1") === "C1");
check("pair: shipping 50 still pairs and is listed", paired("2") === "C2" && has("ค่าส่งไม่ใช่ 35", "#2"));
check("pair: rate off the bill pairs by customer total and is listed", paired("3") === "C3" && has("ยอดบิลไม่ตรงเรต", "#3"));
check("rate ≠ our cost is listed", has("ข้อมูลไม่ครบ", "#3"));
check("pair: same size goes to the nearest day, not the agent column", paired("7") === "C6" && paired("8") === "C7");
check("a paid order missing from the bill is listed", has("ไม่อยู่ในบิล", "#4"));
check("an order before the round is left out", !r.inRound.some((o) => o.id === "6"));
check("a bill row with no web order is listed", has("อยู่ในบิล แต่ไม่พบออเดอร์เว็บ", "C9"));
check("a row by nobody we know is listed", has("แถวที่ไม่รู้จัก", "X1"));
check("LINE shipping not 35 is listed", has("LINE ค่าส่งไม่ใช่ 35", "B2"));
check("a wrong printed total is listed", has("ผลรวมบิลไม่ตรง"));
check("totals", r.totals.webBill === 235 + 250 + 115 + 150 + 150 && r.totals.webShipOver === 45 && r.totals.lineBill === 285);
check("web profit counts billed orders only", r.totals.webProfit === 400 + 420 + 200 + 200 + 200 - 900);
const week = weekProfit(r.totals, 100_000);
check("week: LINE = slips − bill, total = web + LINE", week.lineProfit === 715 && week.totalProfit === 715 + r.totals.webProfit);

const sat = lastRound(Date.parse("2026-11-07T06:30:00Z"));
check("last round on a Saturday after 13:00 ends today", sat.to === "2026-11-07T13:00" && sat.from === "2026-10-31T13:00");
const before = lastRound(Date.parse("2026-11-07T05:30:00Z"));
check("last round on a Saturday before 13:00 ended a week ago", before.to === "2026-10-31T13:00");
check("last round midweek", lastRound(Date.parse("2026-11-04T05:30:00Z")).to === "2026-10-31T13:00");

console.log(failed === 0 ? "bill contract: PASS" : `bill contract: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
