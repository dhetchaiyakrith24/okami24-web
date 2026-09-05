/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Builds docs/IMAGE_AUDIT.md (v2 rules) from image-audit.json. Usage: node image-audit-md.js <in.json> <out.md>
const fs = require("node:fs");
const [, , inFile, outFile] = process.argv;
const data = JSON.parse(fs.readFileSync(inFile, "utf8"));
const { rows, info } = data;

const LAYER = { card: "1 การ์ด", variant: "2 สีเครื่อง", home: "3 หน้าหลัก" };
const LAYER_ORDER = ["card", "variant", "home"];
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");
const bucket = (r) => (!r.exists ? "missing" : r.pass ? "pass" : "low");
const alphaText = (r) => !r.exists ? "—" : r.alpha === "transparent" ? `โปร่งใส (${r.transparentPct}%)` : r.alpha === "opaque-alpha" ? "ทึบ (มี alpha แต่ทึบทั้งภาพ)" : "ทึบ (ไม่มี alpha)";
const sizeText = (r) => (r.exists ? `${r.width}×${r.height}` : "—");
const ruleText = (r) => (r.layer === "home" ? `กว้าง ≥${data.minWidthHome}` : `ด้านยาว ≥${data.minLongProduct}`);
const passText = (r) => (!r.exists ? "—" : r.pass ? "✅ ผ่าน" : `❌ ${r.layer === "home" ? `กว้าง ${r.width}` : `ด้านยาว ${Math.max(r.width, r.height)}`}px`);
const haveText = (r) => (r.exists ? "✅ มี" : r.src ? "❌ ไฟล์หาย" : "❌ ไม่มี");

function summarize(list) {
  const s = { total: list.length, pass: 0, low: 0, missing: 0, opaque: 0 };
  for (const r of list) { s[bucket(r)]++; if (r.exists && r.alpha !== "transparent") s.opaque++; }
  return s;
}
function sumTable(groups) {
  let md = `| ชั้น | เกณฑ์ | ทั้งหมด | มีและผ่านเกณฑ์ | มีแต่ต่ำกว่าเกณฑ์ | ไม่มีเลย | พื้นหลังไม่โปร่งใส |\n|---|---|---|---|---|---|---|\n`;
  for (const [name, rule, list] of groups) { const s = summarize(list); md += `| ${name} | ${rule} | ${s.total} | ${s.pass} | ${s.low} | ${s.missing} | ${s.opaque} |\n`; }
  return md;
}

// ---- brand knowledge (official site = referenceUrl recorded in src/data/brands.ts; photo notes tagged by confidence) ----
const BRAND_SITE = {
  uwell: { url: "https://www.myuwell.com/", photos: "มี — รูปเครื่องแยกสีทางการ (แคตตาล็อกใช้อยู่แล้ว) [ผมเข้าใจว่า: memory]" },
  voopoo: { url: "https://www.voopoo.com/ · shop.voopoo.com", photos: "มี แต่หลายรูปเป็นภาพ AI (แท็ก AIGC) ต้อง grep ก่อนใช้ทุกครั้ง; รูปเครื่องบางรุ่นเล็กแค่ ~150–230px [ผมเข้าใจว่า: memory]" },
  salthub: { url: "https://www.salthub.com/", photos: "มี — การ์ดรส + รูปเครื่อง (curl ได้ Browser pane ใช้ไม่ได้) [ผมเข้าใจว่า: memory]" },
  relx: { url: "https://www.relxnow.com/", photos: "ไม่ทราบว่ามีรูปแยกสี/รุ่นที่ต้องการไหม — relx-creator ยังไม่ยืนยันรุ่นที่สต๊อกจริง" },
  joiway: { url: "https://myjoiway.com/", photos: "ไม่ทราบ — โดเมนไม่ตอบในเซสชันก่อน [ผมเข้าใจว่า: memory]" },
  tfit: { url: "https://www.tfitvape.com/", photos: "ไม่ทราบ" },
  infy: { url: "https://www.infy.my/", photos: "ไม่ทราบ" },
  iqos: { url: "https://www.iqos.com/", photos: "มี — รูปทางการต่อสี (ใช้แล้วสำหรับ ILUMA i / i PRIME) [ผมเข้าใจว่า: memory]" },
  lambda: { url: "https://www.lambdasmoke.com/", photos: "มี — แต่เป็นรูปรวมหลายเครื่อง 1000×1000 (ตัดแยกสีแล้วเล็กเกิน) [ผมเข้าใจว่า: memory]" },
  wotofo: { url: "https://www.wotofo.com/", photos: "มี [ผมเข้าใจว่า: memory]" },
  "esko-bar": { url: "https://eskobarvape.com/", photos: "มี — รูปเครื่อง 2 สีในรูปเดียว [ผมเข้าใจว่า: memory]" },
  rincoe: { url: "https://rincoe-store.com/", photos: "ไม่ทราบ" },
  dotmod: { url: "https://dotmod.com/", photos: "มีรูปคอยล์บางค่าโอห์ม [ผมเข้าใจว่า: memory]" },
  Unbranded: { url: "ไม่มีเว็บทางการ (ยืนยันจากหัวไฟล์ src/data/products/unbranded.ts — ค้นแล้วไม่พบผู้ผลิต)", photos: "ต้องใช้รูปจากร้านค้าปลีก (sourceUrls ในไฟล์) หรือถ่ายเอง" },
};

let md = `# OKami24 — IMAGE AUDIT\n`;
md += `สร้างเมื่อ: 2026-09-04 · แก้เกณฑ์ตามคำสั่งเจ้าของ (2026-09-04) — ข้อมูลวัดใหม่ ${data.generatedAt.slice(0, 16).replace("T", " ")}Z · วิธีตรวจ: อ่านข้อมูลสินค้าจากโค้ดจริง (\`src/data/products/*.ts\` = legacy ${data.legacyCount} รายการ, \`getPublishedProducts()\` = ProductMaster ที่เผยแพร่จริง ${data.publishedCount} รายการ) แล้ววัดทุกไฟล์ด้วย \`sharp\`: ขนาดพิกเซลจริง + นับพิกเซลใน alpha channel จริง (ไม่ได้เดาจากนามสกุล)\n\n`;
md += `**เกณฑ์ (ฉบับแก้ไข v3 — เจ้าของลดเกณฑ์รูปสินค้าจาก 900 เป็น 800 เมื่อ 2026-09-04 หลังดูรูป 800×800 ขยาย 5% แล้วไม่เห็นความต่าง):**\n`;
md += `- รูปสินค้าตัดพื้นหลัง (การ์ด / สีเครื่อง): ผ่านถ้า **ด้านยาว ≥ ${data.minLongProduct}px**\n`;
md += `- รูปหน้าหลัก/hero: ผ่านถ้า **กว้าง ≥ ${data.minWidthHome}px**\n`;
md += `- ชั้น 2 นับเฉพาะ **สีของเครื่อง** (pod/mod/kit) ที่มีตั้งแต่ 2 สีขึ้นไป — ตัวเลือก "รส" ไม่นับว่าขาด (เจ้าของตัดสินใจ 4 ก.ย.: รสใช้รูปหลักรูปเดียว) · ตัวเลือกอื่นของ ProductMaster (ค่าโอห์ม ฯลฯ) ไม่นับเช่นกัน\n`;
md += `- ชั้น 4 แกลเลอรี: **ไม่อยู่ในยอดรวม** (ระบบยังไม่มี ไม่ใช่รูปขาด) — เหลือไว้เป็นข้อมูลท้ายเอกสาร\n\n`;
md += `> ขอบเขต: เฉพาะรูปที่เว็บ**จริง**เรียกใช้ (สินค้า legacy ทั้งหมด + ProductMaster ที่เผยแพร่แล้ว + รูปที่หน้าหลัก/โลโก้อ้างถึงตรง ๆ) — ProductMaster ที่ยังไม่เผยแพร่ไม่นับ · "โปร่งใส" = มี alpha channel และมีพิกเซลไม่ทึบจริง (ตัวเลข % = สัดส่วนพิกเซลไม่ทึบ) · รูป "ทึบ" ของกล่อง/แพ็กสินค้า เป็นไปตามข้อตกลงเดิม ไม่ใช่ข้อบกพร่องเสมอไป · คอลัมน์ "รายการ" เพิ่มเพื่อระบุว่าแถวไหนคือสีไหน\n\n`;

// ---- Summary ----
md += `## สรุปรวม\n\n`;
const groups = LAYER_ORDER.map((l) => [LAYER[l], l === "home" ? `กว้าง ≥${data.minWidthHome}` : `ด้านยาว ≥${data.minLongProduct}`, rows.filter((r) => r.layer === l)]);
groups.push(["**รวม (ชั้น 1–3)**", "", rows]);
md += sumTable(groups);
const S = summarize(rows);
const missingReal = rows.filter((r) => !r.exists && r.layer !== "home");
md += `\n**รูปที่ต้องไปขอจริง ๆ (การ์ด + สีเครื่อง ที่ไม่มีเลย): ${missingReal.length} รูป** — รายละเอียดจัดตามแบรนด์ท้ายเอกสาร\n\n`;
md += `หมายเหตุ: หน้าหลักไม่มีรูป hero/แบนเนอร์เป็นของตัวเอง — ใช้รูปการ์ดสินค้า (รูปตัดพื้นหลังทรงสูงแคบ) มาจัดฉาก cinematic จึงไม่มีรูปไหนกว้างถึง ${data.minWidthHome}px ทั้งที่ไฟล์มีครบ ไม่มี placeholder · ถ้าต้องการ hero กว้าง ${data.minWidthHome} ต้องเป็นรูปชนิดใหม่ที่ยังไม่มีในระบบ\n\n`;

// ---- Layer 1 ----
md += `## ชั้น 1 — รูปการ์ดสินค้า: ตัวไหนไม่มี\n\n`;
const cardMissing = rows.filter((r) => r.layer === "card" && !r.exists);
md += cardMissing.map((r) => `- \`${r.slug}\` (${r.brandName}) — ${r.note ?? ""}`).join("\n") + "\n\n";
const cardsExist = rows.filter((r) => r.layer === "card" && r.exists);
md += `การ์ดที่มีแต่ด้านยาว < ${data.minLongProduct}px: ${cardsExist.filter((r) => !r.pass).length} จาก ${cardsExist.length} รูป\n\n`;

// ---- Layer 2 ----
md += `## ชั้น 2 — สีเครื่อง: สินค้าที่มีหลายสี แล้วขาดรูปสีไหน\n\n`;
const bySlug = new Map();
for (const r of rows.filter((r) => r.layer === "variant")) {
  if (!bySlug.has(r.slug)) bySlug.set(r.slug, { brand: r.brandName, total: 0, missing: [], low: 0 });
  const e = bySlug.get(r.slug); e.total++; if (!r.exists) e.missing.push(r.item.replace(/^สี: /, "")); else if (!r.pass) e.low++;
}
md += `| slug | แบรนด์ | สีทั้งหมด | ขาดรูป | สีที่ขาด | มีแต่ต่ำกว่าเกณฑ์ |\n|---|---|---|---|---|---|\n`;
for (const [slug, e] of [...bySlug.entries()].sort((a, b) => b[1].missing.length - a[1].missing.length || a[0].localeCompare(b[0]))) {
  md += `| \`${slug}\` | ${e.brand} | ${e.total} | ${e.missing.length} | ${e.missing.length ? esc(e.missing.join(", ")) : "—"} | ${e.low} |\n`;
}
md += `\nไม่นับในชั้นนี้ (ตามเกณฑ์ใหม่): ตัวเลือกรส legacy ${info.flavorTotal} รายการ (มีรูปอยู่แล้ว ${info.flavorWithPhoto}) · ตัวเลือกรส ProductMaster ${info.pmFlavorTotal} รายการ (มีรูป ${info.pmFlavorWithPhoto}) · ตัวเลือกอื่นของ ProductMaster: ${Object.entries(info.pmNonColorAxes).filter(([k]) => k !== "flavor").map(([k, v]) => `${k} ${v}`).join(", ") || "—"} · สินค้าที่มีสีเดียว (ไม่นับเป็นช่องว่าง): ${info.singleColorSkipped.map((s) => `\`${s}\``).join(", ") || "—"} · รูปรวมทุกสี (All Colors): มี ${info.lineupWithPhoto} จาก ${info.lineupTotal} สินค้าที่มีตัวเลือก\n\n`;

// ---- Layer 3 ----
md += `## ชั้น 3 — หน้าหลัก\n\n`;
md += `หน้าหลักไม่มีรูป hero/แบนเนอร์/หมวดหมู่แยกต่างหาก — cinematic ใช้รูปการ์ดสินค้า 6 รูปตรง ๆ, Hero/EditorialSplit/CompareCTA ใช้รูปการ์ดของสินค้า flagship, หมวดหมู่ (CategoryNav) ใช้ไอคอน · **ทุกไฟล์ที่โค้ดอ้างถึงมีอยู่จริง ไม่มี placeholder** · แต่ไม่มีรูปใดกว้างถึง ${data.minWidthHome}px (ดูตาราง)\n\n`;

// ---- Full table ----
md += `## ตารางเต็ม (${rows.length} แถว — ชั้น 1–3)\n\n`;
for (const l of LAYER_ORDER) {
  const list = rows.filter((r) => r.layer === l);
  md += `### ${LAYER[l]} (${list.length} แถว)\n\n| slug | รายการ | ชั้น | มี/ไม่มี | ขนาดจริง px | ผ่านเกณฑ์ไหม (${l === "home" ? `กว้าง ≥${data.minWidthHome}` : `ด้านยาว ≥${data.minLongProduct}`}) | โปร่งใสไหม |\n|---|---|---|---|---|---|---|\n`;
  for (const r of list) {
    const note = r.note ? ` <br><sub>${esc(r.note)}</sub>` : "";
    md += `| \`${esc(r.slug)}\` | ${esc(r.item)}${note} | ${LAYER[r.layer].split(" ")[0]} | ${haveText(r)} | ${sizeText(r)} | ${passText(r)} | ${alphaText(r)} |\n`;
  }
  md += `\n`;
}

// ---- Gallery info (excluded) ----
md += `## ข้อมูลประกอบ — ชั้น 4 แกลเลอรี (ไม่อยู่ในยอดรวม)\n\n`;
md += `- legacy ${data.legacyCount} รายการ: มีแกลเลอรีจริง ${info.galleryLegacy.length} รายการ (${info.galleryLegacy.map((g) => `\`${g.slug}\` ${g.count} รูป`).join(", ")}) — ที่เหลือส่วน ProductGallery ซ่อนอัตโนมัติ\n`;
md += `- ProductMaster ${data.publishedCount} รายการ: ระบบไม่มีแกลเลอรีเลย (หน้าสินค้ามีแค่รูปการ์ด + รูปตัวเลือก)\n\n`;

// ---- Totals ----
md += `## ยอดรวม (ชั้น 1–3)\n\n`;
md += `| | จำนวน |\n|---|---|\n| มีและผ่านเกณฑ์ | **${S.pass}** |\n| มีแต่ต่ำกว่าเกณฑ์ | **${S.low}** |\n| ไม่มีเลย | **${S.missing}** |\n| พื้นหลังไม่โปร่งใส (ในรูปที่มี) | **${S.opaque}** |\n| รวมแถว | ${S.total} |\n\n`;

// ---- Request list by brand ----
md += `## รายการไปขอรูป (จัดตามแบรนด์)\n\n`;
md += `นับเฉพาะรูปที่ **ไม่มีเลย** ในชั้น 1 (การ์ด) และชั้น 2 (สีเครื่อง) — รูปที่มีแต่ต่ำกว่าเกณฑ์แสดงแยกเป็นตัวเลขประกอบ ไม่รวมในยอด "ต้องขอ" · "เว็บทางการ" = \`referenceUrl\` ที่บันทึกใน \`src/data/brands.ts\` [ตรวจแล้วจริง] · ข้อความว่ามีรูปหรือไม่ กำกับความมั่นใจไว้ทุกบรรทัด\n\n`;
const byBrand = new Map();
for (const r of rows.filter((r) => r.layer !== "home")) {
  if (!byBrand.has(r.brandId)) byBrand.set(r.brandId, { name: r.brandName, missCard: [], missColor: [], low: 0 });
  const e = byBrand.get(r.brandId);
  if (!r.exists) (r.layer === "card" ? e.missCard : e.missColor).push(r.layer === "card" ? r.slug : `${r.slug} — ${r.item.replace(/^สี: /, "")}`);
  else if (!r.pass) e.low++;
}
const brandsSorted = [...byBrand.entries()].sort((a, b) => (b[1].missCard.length + b[1].missColor.length) - (a[1].missCard.length + a[1].missColor.length));
md += `| แบรนด์ | ต้องขอ (การ์ด + สี) | การ์ดที่ขาด | สีที่ขาด | มีแต่ต่ำกว่าเกณฑ์ |\n|---|---|---|---|---|\n`;
let grand = 0;
for (const [, e] of brandsSorted) { const n = e.missCard.length + e.missColor.length; grand += n; md += `| ${e.name} | **${n}** | ${e.missCard.length} | ${e.missColor.length} | ${e.low} |\n`; }
md += `| **รวม** | **${grand}** | | | |\n\n`;
for (const [id, e] of brandsSorted) {
  const n = e.missCard.length + e.missColor.length;
  const site = BRAND_SITE[id] ?? { url: "ไม่มีข้อมูลในโค้ด", photos: "ไม่ทราบ" };
  md += `### ${e.name} — ต้องขอ ${n} รูป\n`;
  md += `- เว็บทางการ: ${site.url}\n- มีรูปสินค้าไหม: ${site.photos}\n`;
  md += `- การ์ดที่ขาด (${e.missCard.length}): ${e.missCard.length ? e.missCard.map((s) => `\`${s}\``).join(", ") : "—"}\n`;
  md += `- สีที่ขาด (${e.missColor.length}): ${e.missColor.length ? e.missColor.map((s) => `\`${esc(s)}\``).join(", ") : "—"}\n`;
  md += `- มีรูปแล้วแต่ต่ำกว่าเกณฑ์ (ข้อมูลประกอบ ไม่รวมในยอดขอ): ${e.low}\n\n`;
}

fs.writeFileSync(outFile, md);
console.log(JSON.stringify({ ...S, requestTotal: grand, missingReal: missingReal.length }));
