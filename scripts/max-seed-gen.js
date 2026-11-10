/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Shipnity MAX product list → src/data/shipnity-seed/max-seed.ts (round list19, 17/10 — owner "ลงสินค้าดีกว่าครับ", Friday's plan:
// move the ProductMaster seed off the OLD Shipnity export of 31/08, which BSOT §4 says is no longer used).
//
//   node scripts/max-seed-gen.js <max-products.json> <YYYY-MM-DD>
//
// <max-products.json> = rows [kind "P"|"C", code, name, "ราคาขาย", "มีของ"|"ไม่มีของ", _, parentCode] read from
// https://app.shipnitymax.com/product/product?page=1&per_page=1000 with every "แสดงเพิ่ม N รายการ" opened (product list only,
// never order pages). The Max list carries no cost column, so nothing here can leak a cost (BSOT §5).
// Output = one entry per OLD seed id that Max still sells (MAX_PARENT_OF maps the ids Max re-coded). build-active-catalog.ts
// uses it for every record that is not frozen (FROZEN there: published records + the SEO line's TEREA).
const fs = require("fs");
const path = require("path");

const [file, date] = process.argv.slice(2);
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error("usage: node scripts/max-seed-gen.js <max-products.json> <YYYY-MM-DD>");
  process.exit(1);
}
const rows = JSON.parse(fs.readFileSync(file, "utf8"));
// Old seed id → Max parent code, where Max uses another code (read 17/10; names match the old seed's names).
const MAX_PARENT_OF = {
  "Pod-149": "Product 1141360", // SKE Crystal B20000 Puffs (children still Pod-149-*)
  "Pod-142": "Product 1129596", // Reswa Sportcan 12000 Puffs (children still Pod-142-*)
  "ELIQUID-1": "ELQ-1", // Marbo Saltnic
  "Eliquid-64": "ELQ-64", // Double Mint Salt Nic
  "Eliquid-72": "ELQ-5", // Pepo Salt Nic
  "Eliquid-109": "ELQ-3", // Marbo Freebase ขวดยาว
  "eliquid-62": "ELQ-4", // Muro Salt Nic
  "Coil-55": "Coil-55-1", // หัวแทงค์ Caliburn G2 (a parent row with no children)
  "Pod-180": "Disposable-46", // Nexbar Clear 18k (re-coded 26/10; Max's Pod-180 is now another product, "หัว dude 3 ml.")
};
// Max-only products (no old seed record) → the record id they get here (round list19 18/10, owner "ทำเลยครับทั้งหมด"). The record id
// is the storefront slug once lowercased (same rule as every seed record), so it is a readable model name, not Max's "Product N".
// A value may also be { max, childPrefix }: one Max parent that holds two products (Nexswitch: kit ฿419 rows Pod-161-* and
// refill-pod ฿269 rows Pod-162-*) → one record per child-code prefix, priced at its own children's ราคาขาย.
// Or { max, childIds: [...] }: the exact Max children of one product when no prefix separates them (C list 10/11: Max IQOSHEET-17
// holds ILUMA ONE colours, the OASIS edition at another price and the ILUMA i ONE's Breeze Blue; a "Set-…" 5-coil box sits
// under its loose coil's parent). Same one-price rule as childPrefix.
// + alsoParents: [...]: more Max parents whose rows join the record (a parent with no child rows joins as itself) — C list 10/11: Max
// sells the Vinci 0.15Ω 5-coil box as its own parent "Set-Coil-1-1", while the DW60 0.6Ω box is a row under Coil-1.
const MAX_ONLY_RECORDS = {
  "KS-QUIKPRO-KIT": "Product 780", // KS Quik Pro 15000 คำ (device + pod)
  "NEXSWITCH-16K-KIT": { max: "Product 1176446", childPrefix: "Pod-161-" }, // Nexswitch 16000 Puffs — "เครื่อง + หัวพอต <flavour>"
  "NEXSWITCH-16K-POD": { max: "Product 1176446", childPrefix: "Pod-162-" }, // Nexswitch 16000 Puffs — "หัวพอต <flavour>"
  "RELX-LUMI-18K": "Disposable-44", // RELX LUMI 18k (round list19 18/10)
  "ESKO-BAR-20K": "Pod-130", // Esko Bar 20000 Puffs = ESKO BAR 498 (round p63 19/10, owner item 69 ฿389)
  "ESKO-BAR-SWITCH-POD": "Pod-160", // หัวพอต Esko Bar Switch 20k (round list19 19/10) — the refill pod of the ESKO BAR SWITCH (pod-159)
  // Round list19 (19/10, owner "list everything first"): warehouse products with no card photo yet — prepared, not published (IMAGE_SPEC §4).
  "SUPER-COOL-SALTNIC": "ELQ-6", // Super Cool Salt Nic
  "PUNTA-ICE": "eliquid-78", // Punta Ice
  "INFY-POD": "Pod-158", // INFY POD
  "VMATE-PRO-2": "Pod-176", // Vmate Pro 2
  "GRAPLE-FREEBASE": "ELQ-2", // Graple Freebase (Max parent ฿795, its one child ฿159; owner price ฿160 for both, 19/10)
  "MQ-BAR-22K": "Disposable-43", // MQ Bar 22K (Max parent ฿369, children ฿359; owner price ฿390 for all, 19/10)
  // maxlist (20/10): added to max-seed.ts by hand then; written here so a re-run keeps them (line 2 max-sync 22/10).
  "RELX-ESSENTIAL-2": "Pod-157", // Relx Essential 2
  "RELX-INFINITY-PRO-2-POD": "Pod-27", // หัวพอต RELX Infinity Pro 2
  // line 2 max-sync (22/10): Max "Relx Creator Pod 20K" (17/10; renamed "Relx เลโก้ 20000 คำ" 22/10) — Thai shops sell it as RELX Creator 20K pod.
  "RELX-CREATOR-POD-20K": "Pod-137",
  "SUP-ZERO-22K": "Disposable-45", // SUP Zero 22K (owner brief 26/10)
  "MARBO-10K-CLONE": "Disposable-47", // Marbo 10k โคลน — sold as "Marbo 10K (เทียบแท้)" (owner 27/10, HANDOFF §18)
  "NEXBAR-SWITCH-15K-POD": "Pod-181", // nexBar Switch 15k — refill pods, 15 flavours (owner 30/10: list it so Shipnity and the site link up)
  "DUDE-POD-3ML": "Pod-180", // หัว dude 3 ml. — 10 flavours (owner 31/10 "ลงได้เลย"); Max re-used Pod-180 (nexBar CLEAR 18K is Disposable-46)
  // C list 10/11 (owner list item 134 "ตามแนะนำ"): Max "Iqos iluma one" (IQOSHEET-17) holds the ORIGINAL ILUMA ONE's colours at ฿2,900, its
  // OASIS edition at ฿3,200 and the ILUMA i ONE's Breeze Blue (IQOSHEET-17-3, already the iqosheet-17 page) → two more records.
  "IQOS-ILUMA-ONE": { max: "IQOSHEET-17", childIds: ["IQOSHEET-17-1", "IQOSHEET-17-2", "IQOSHEET-17-5"] },
  "IQOS-ILUMA-ONE-OASIS": { max: "IQOSHEET-17", childIds: ["IQOSHEET-17-4"] },
  // C list 10/11 (item 134 1A): VOOPOO coils sold by the box of 5 — ฿350 Vinci (DW60 0.6Ω under Coil-1 + 0.15Ω its own parent) · ฿400 PnP X.
  "VOOPOO-VINCI-COIL-5PACK": { max: "Coil-1", childIds: ["Set-Coil-1-14"], alsoParents: ["Set-Coil-1-1"] },
  "VOOPOO-PNP-X-COIL-5PACK": { max: "Coil-92", childIds: ["Set-Coil-92-1"] },
};
const seedSrc = fs.readFileSync(path.join(__dirname, "..", "src", "data", "shipnity-seed", "active-catalog-source.ts"), "utf8");
const seedIds = [...seedSrc.matchAll(/shipnityProductId: "([^"]+)"/g)].map((m) => m[1]).filter((id) => id !== "Close" && id !== "test"); // excludedNonProductRows
const num = (s) => Number(String(s).replace(/,/g, ""));
const parents = new Map(rows.filter((r) => r[0] === "P").map((r) => [r[1], r]));
const out = {};
const missing = [];
for (const id of seedIds) {
  const maxId = MAX_PARENT_OF[id] ?? id;
  const p = parents.get(maxId);
  if (!p) { missing.push(id); continue; }
  const children = rows.filter((r) => r[0] === "C" && r[6] === maxId)
    .map((r) => ({ shipnityVariantId: r[1], rawLabel: r[2], sellingPrice: num(r[3]), inStock: r[4] === "มีของ" }));
  out[id] = { maxParentId: maxId, name: p[2], operationalSellingPrice: num(p[3]), children };
}
const maxOnly = [];
for (const [id, spec] of Object.entries(MAX_ONLY_RECORDS)) {
  const maxId = typeof spec === "string" ? spec : spec.max;
  const prefix = typeof spec === "string" ? "" : spec.childPrefix ?? "";
  const ids = typeof spec === "string" ? null : spec.childIds ?? null;
  const p = parents.get(maxId);
  if (!p) { missing.push(id); continue; }
  const children = rows.filter((r) => r[0] === "C" && r[6] === maxId && r[1].startsWith(prefix) && (!ids || ids.includes(r[1])))
    .map((r) => ({ shipnityVariantId: r[1], rawLabel: r[2], sellingPrice: num(r[3]), inStock: r[4] === "มีของ" }));
  for (const extra of (typeof spec === "string" ? null : spec.alsoParents) ?? []) {
    const ep = parents.get(extra);
    if (!ep) { console.error(`${id}: Max parent ${extra} not in the read`); process.exit(1); }
    const rowsOf = rows.filter((r) => r[0] === "C" && r[6] === extra);
    for (const r of rowsOf.length ? rowsOf : [ep]) children.push({ shipnityVariantId: r[1], rawLabel: r[2], sellingPrice: num(r[3]), inStock: r[4] === "มีของ" });
  }
  const prices = [...new Set(children.map((c) => c.sellingPrice))];
  const split = Boolean(prefix || ids);
  if (split && prices.length !== 1) { console.error(`${id}: children ${prefix || ids.join(",")} carry ${prices.length} prices — one record needs one price`); process.exit(1); }
  out[id] = { maxParentId: maxId, name: p[2], operationalSellingPrice: split ? prices[0] : num(p[3]), children };
  maxOnly.push(id);
}
const body = `/**
 * GENERATED by scripts/max-seed-gen.js from the Shipnity MAX product list read ${date} — do not edit by hand; re-run the script.
 * One entry per old seed id (active-catalog-source.ts) that Max still lists. \`maxParentId\` = Max's own parent code when Max
 * re-coded it. Children = EVERY Max child (in stock or not — stock is warehouse-stock.ts's job), each with its own ราคาขาย.
 * Plus the Max-only records (no old seed id) listed in MAX_ONLY_IDS — keyed by the record id the script gives them.
 * No cost: the Max list has no cost column. Not in Max on ${date}: ${missing.join(", ") || "none"}.
 */
export interface MaxSeedChild { shipnityVariantId: string; rawLabel: string; sellingPrice: number; inStock: boolean }
export interface MaxSeedParent { maxParentId: string; name: string; operationalSellingPrice: number; children: MaxSeedChild[] }

export const MAX_SEED_DATE = "${date}";
export const MAX_SEED: Record<string, MaxSeedParent> = ${JSON.stringify(out, null, 2)};
export const MAX_ONLY_IDS: readonly string[] = ${JSON.stringify(maxOnly)};
`;
const dest = path.join(__dirname, "..", "src", "data", "shipnity-seed", "max-seed.ts");
fs.writeFileSync(dest, body.replace(/\r?\n/g, "\r\n")); // repo convention: CRLF on disk (HANDOFF §17)
console.log(`wrote ${path.relative(process.cwd(), dest)} · ${Object.keys(out).length} of ${seedIds.length} seed ids in Max · not in Max: ${missing.join(", ")}`);
