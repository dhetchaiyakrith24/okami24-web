# Stock round — batch 1 survey: website options vs Shipnity SKUs (2026-10-08)

Round file: `docs/rounds/รอบเชื่อมสต็อก-Shipnity-API-SKU-08-10.txt`. Survey only — no site file changed.

## Sources

- **Website:** every product the storefront shows (legacy catalog + published ProductMaster, hidden products excluded), every
  colour / flavour / resistance option; a product without options counts as one option. Main `246f5bd`.
- **Shipnity:** `app.shipnitymax.com/product/product`, "สินค้าทั่วไป", all channels, 100 per page (1 page), every
  "แสดงเพิ่ม" expanded — read 2026-10-08 ~14:30 in the app browser on the owner's login. 60 parent rows (58 real + `test` +
  `Close`) · 659 child rows (260 "มีของ"). "สินค้าจัดเซ็ต" tab: empty. The list shows only มีของ / ไม่มีของ, no quantities.
- Raw dumps + scripts (not in git): `_incoming/stock-api/` — `shipnity-max-products-2026-10-08.json`, `web-options.json`
  (`web-options.ts`), `match-report.json` (`match.js`). Matching = Shipnity code when the site already carries one
  (ProductMaster), else exact option name under the product's Shipnity parent. No name guessing for parents.

## Result — 528 options on 55 products

| | options | note |
|---|---|---|
| **Matched exactly** | **249** | 104 มีของ · 145 ไม่มีของ |
| Same option, spelling differs | 7 | list below — one side must be corrected |
| Probably related, needs a human | 7 | list below — partial name only, NOT counted as matched |
| Product in Shipnity, option not | 42 | mostly maker colours/flavours the shop never stocked (catalog completeness rule) |
| **Product not in Shipnity Max at all** | **223** | 29 products |
| **Total without a confirmed SKU** | **279** | |

ProductMaster options added from the maker's range (`*-verified-*` ids) = 30 of the 279: by design they have no SKU.

Spelling differs (web ~ Shipnity): Caliburn G4 Pro Iron Gray ~ `Pod-168-3` "lron Gray" · Pearl Silver ~ `Pod-168-4`
"Pearl Sliver" · M Bar 10K Matcha Latte ~ `Pod-172-12` "Matcha Late" · Joiway F3 **Vodak** (web typo) ~ `Pod-133-19` "Vodka" ·
TFIT Hami Melon ~ `Disposable-41-3` "Hemi Melon" · MOOOD Ice Sparkling ~ `Disposable-37-14` "Ice Sparking" · MOOOD Sugar
Apple ~ `Disposable-37-17` "Sugus Apple" (มีของ; HANDOFF §16 item 5 "Sugus" alias gap).

Needs a human: VMATE i3 Starlight Red ? `Pod-177-3` Red · M Switch Kit Grape Aloe ? `Pod-156-1` Grape · Zero Cartridge
Strawberry ? `Pod-85-14` Peach Strawberry · MOOOD Blueberry N5% ? `Disposable-37-7` Blueberry · ILUMA i Digital Violet ?
`IQOSHEET-18-5` Violet · Esko Switch Blueberry Jam ? `Pod-159-12` Blueberry. Read by eye, still counted in the 42: Joiway F3
Funta Grape ? `Pod-133-15` Funta Green (มีของ) · RELX Creator colours ? `Pod-138-1/2` "เฉพาะแบตเตอรี่-สีเทาเหลือง / สีดำ"
(battery only, Thai names).

Not in Shipnity Max (29): Caliburn G5 · G5 Lite · G5 Lite SE · G4 Pro KOKO · G4 · G4 Mini · G4 Classic · G3 Pro · G3 Pro
KOKO · ARGUS G4 mini · P3 · G3 mini · DRAG 6 · S3 · X3 · VINCI S · Zero Nano · Joiway F4 · nexBAR 18K · Muro 3ML (`Pod-120`) ·
nexBar CLEAR 18K (`Pod-180`) · coils/pods `Coil-56/68/70/74/83/87/89` · `coil-54`. Searches for `Pod-18`, `Pod-120`,
`Coil-8`, `Drag`, `Caliburn` confirmed the absence.

Re-coded (matched through the evidence, not a guess): Caliburn G4 Pro — site data `Pod-181`, Max lists `Pod-168` "Caliburn
G4 Pro" · UWELL หัวแทงค์ Caliburn G2 — site `Coil-55`, Max `Coil-55-1` (same name).

## Shipnity side — stock the website cannot show

- 33 of the 58 real Shipnity parents have no product page (e-liquids `ELQ-*`, MQ Bar 22K, Foli Bar 15k (hidden page), Next
  Pro 2 Beyond (hidden), Vmate Pro 2, INFY POD, RELX Essential 2, Esko Bar 20000, IQOS TEREA, Lambda i8, Coil-21 Argus, Coil-92
  PnP X …).
- 77 extra child SKUs under parents that do have a page. In stock today, not on the page: Muro Connector 20K `Pod-171-21…33`
  (13 flavours incl. 50MG) · Zero Cartridge 50mg Grape / Apple Aloe / Menthol Freeze · Zero Pro Copper · MOOOD Sugus Apple ·
  Joiway F3 Funta Green · TPP-DM1 · Coil-1 DW60 box of 5 (`Set-Coil-1-14`) · RELX Creator battery grey-yellow.
- Shipnity splits what the site shows as one option: nicotine strength (`- 50mg`, `Nic 5%`, `50MG`) and unit of sale
  (`/ ตัว` vs `/ ยกกล่อง`, `Set-Coil-…`). One web option can need 2+ SKUs (stock = sum, or one SKU per strength option).

## Two Shipnity systems — must be settled first

The 2026-09 seed (`src/data/shipnity-seed/`) was read from `shipnity.com/reselled_products`; the owner sent
`app.shipnitymax.com`. They differ: 25 parents of the old seed are not in Max (incl. `Pod-120`, `Pod-180`, nine coils,
old e-liquid codes), 27 Max parents are not in the old seed (`ELQ-*` re-codes, `Pod-130…176`), and the old system re-coded
G4 Pro to `Pod-181` while Max still says `Pod-168`. Which one the warehouse uses today decides which codes the site stores.

## API — nothing received yet

No API document in the repo, the round file or the owner's folders (`OneDrive/Desktop/APi.txt` exists but is empty, 0 bytes).
The Max account's settings show only "ข้อมูลบัญชี" and "ตั้งค่าการใช้งาน" — no API / integration page for this login. Public
web: no Shipnity developer docs found; PEAK's help page describes a Shipnity link set up through a token under Shipnity
"ตั้งค่า > ตั้งค่าเชื่อมต่อระบบภายนอก > เชื่อมต่อแอปพลิเคชันภายนอก" (old Shipnity; not seen in Max):
https://intercom.help/peak/en/articles/7940869 .

To ask the stock team / Shipnity (one list):
1. Which system is live for the warehouse — Shipnity (shipnity.com) or Shipnity Max — and will one be retired?
2. API reference: base URL, auth (API key / token / OAuth), how a key is issued, who owns it, rate limits.
3. Read endpoints: list products with child SKU, **numeric quantity** per SKU (per warehouse if "คลัง" > 1), and
   reserved / available; paging; a "changed since" filter.
4. Webhook or push on stock change (vs polling) — and how often stock in Shipnity is updated after a sale / restock.
5. Is the SKU code stable (the G4 Pro `Pod-168` → `Pod-181` re-code shows it is not) — is there an immutable id?
6. Order write (create an order from the website) — later round, but ask now: endpoint, fields, idempotency.
7. A read-only key for testing, separate from the production key.

## Plan — BUSINESS_SOURCE_OF_TRUTH §5–6

Rules that shape it: price from Shipnity is a reference only, never auto-published; owner-confirmed prices are never
overwritten (§5) — this round keeps every price file untouched. Stock > 0 = available · stock = 0 = page stays, "สินค้าหมด"
+ "สอบถามทาง LINE" (§6; the strings already exist in the dictionaries). Every maker option stays on the page; no SKU = sold out.
The owner's sold-out list stays as a manual override on top (only ever marks sold out).

| # | batch | done when | check | rollback |
|---|---|---|---|---|
| 1 | survey (this file) | counts + ask-list + plan | docs-only PR | revert |
| 2 | **SKU map** — one data file: page + option → Shipnity code(s); fix the 7 spellings; owner/admin rule the 7 "needs a human" | every web option has a code or an explicit `none`; contract test fails on an unknown code | checker (13.7 big (2): product data) · no visible change | revert |
| 3 | **stock adapter** (server only, behind the existing Shipnity seam) — reads Shipnity, caches (e.g. 5 min), never blocks a page; API down = last good value, then "unknown" | test against the read-only key: quantities for 10 sample SKUs match the Shipnity screen | full suite (13.5 #3) · key only in Render env (needs【แตะได้】`.env*`/`render.yaml` + owner key) | env flag off |
| 4 | **show stock** on option chips + product status (0 = "สินค้าหมด" + LINE) — legacy and ProductMaster read the same signal | 3 in-stock + 3 sold-out options render right at 390/1440 | tier B + checker | revert / flag |
| 5 | **cart gate** — checkout re-checks stock of every line | an out-of-stock line cannot be paid for | full suite (money) | revert |
| 6 | mismatch report — SKUs in Shipnity with no page, page options with no SKU (the lists above, kept fresh) | staff page or log lists both sides | checker | revert |

Not in this round: order push to Shipnity (needs answer 6) · auto price update (forbidden by §5).

## Order push — the dropship shipping-fee problem (owner, chat 08/10)

Model (owner): dropship — the shop holds no stock; the website takes the order, the warehouse packs and ships, and bills
the shop **cost per SKU + shipping on every order**. Answered by the owner 09/10: the warehouse charges the shop **35 THB**
shipping per order; the shop charges the customer **50 THB** (free from 500 — BSOT §10). The warehouse's problem: an order arriving through the API carries the customer's figures, so a
free-shipping order (BSOT §10: free from 500) arrives with shipping 0 and the warehouse system has no shipping to bill.
Fix to build with the order push: every order sent to the warehouse carries the **real shipping fee on its own field, every
time**, and free shipping as a **separate shop-paid discount line** (customer total unchanged); the warehouse bills from
cost + that field, never from the customer total; the site stores per order sale · cost · shipping · discount · margin for a
monthly match against the warehouse bill. Needs from the API doc: separate shipping and discount fields on order create,
and the shop's cost per SKU. Margin note: a free-shipping order pays the warehouse's 35 out of the shop's margin.

## Shipnity link — the site as a WooCommerce look-alike (owner 27/10, chat "API")

**Why:** the warehouse links every agent's WooCommerce shop for free — the shop makes a WooCommerce REST key pair, the
warehouse types it into Shipnity; a non-Woo site would need Shipnity's paid API (BSOT ~line 327). The warehouse confirmed
27/10 (screenshot in chat): Shipnity's "เชื่อมต่อ WooCommerce" form has exactly **URL WooCommerce · ck · cs**. Shipnity's own
guide (blog.shipnity.com, "การเชื่อมต่อ Wordpress / Woocommerce ในระบบ Shipnity"): key = Read/Write; products matched by
**SKU = the Shipnity code**; Shipnity is the stock master and **pushes the total stock of all its warehouses** to the shop;
new orders reach Shipnity through a Woo webhook "Order Created" to `http://www.shipnity.com/wc_hooks/<shop id>` (API v2
payload) — that guide is for old shipnity.com; Max's hook URL is still to ask. Tracking back to the shop: not mentioned.

**Shipping fee (warehouse 27/10):** "not a problem — I recompute the shipping when I bill; later Shipnity will take the
shipping fee from Shipnity's side". The fee-field design above stays as the plan, but it no longer blocks the order step.

**Owner 27/10:** stock first; orders flowing too is welcome; slips stay with the shop only (the warehouse bills weekly).
New database tables = owner "ได้" 27/10.

| # | step | done when | rollback |
|---|---|---|---|
| 1 | door `/wp-json/wc/v1–v3` (products + variations, no price, orders empty) · keys on `/staff/shipnity` (hashes only, shown once, revoke) · every call logged · stock writes only recorded (`woo_stock_reports`) | warehouse saves the key in Shipnity and the log shows its calls | revert; revoke the key |
| 2 | read the log → fit the door to the calls Shipnity really makes | Shipnity's stock writes land for real codes | revert |
| 3 | compare Shipnity's numbers with the hourly order-entry read for some days | they agree | — |
| 4 | live stock: site reads the table at runtime (B5 ② in HANDOFF §16 3f), hourly stock PRs stop, owner's sold-out list still wins | a Shipnity change shows on the site without a deploy | flag off → build-time stock |
| 5 | orders: paid orders go to Shipnity's hook (no slip, no refund data); tracking back if Shipnity sends it | a test order appears in Shipnity | revert |

Risk: Cloudflare sits in front of the site — if it challenges Shipnity's server, the log stays empty; then allow `/wp-json/*`.
