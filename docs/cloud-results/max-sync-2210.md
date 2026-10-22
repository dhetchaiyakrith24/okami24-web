# Shipnity Max × site — full diff 22/10 (line 2, `line2-max-sync-2210`)

Read: Max product list, live, 22/10 ~21:00 in the owner's Chrome (product list only, every "แสดงเพิ่ม" open): 65 cards =
63 products + `test` + `Close`; 799 code rows. Codes cross-checked against the 22/10 18:10 stock snapshot (same codes; only new
parent since 21/10 15:30 = Disposable-45). Raw parent list = `_incoming/maxsync-2210/max-parents-2210.txt` (main folder, not in git).
Site side = `src/data/stock/sku-map.ts` + every product's options at `origin/main` cc68fe6d.
Owner scope 22/10 (via Friday): "สินค้าที่ Max มีเรามี ส่วนราคาถ้ามีการปรับพี่จะแจ้งให้ทราบครับ" → (a)+(b) are fixed; (c)+(d) report only.

## (a) Max parent with no live page — 3

| Max code | Max name | ราคาขาย | Kids (in stock) | State / next step |
|---|---|---|---|---|
| Disposable-45 | SUP Zero 22K | 329 | 15 (15) | **owner-declined 22/10** ("2 ไม่ลง") — not listed. Research: brand "SUP ZERO", one Thai shop only (zeedcupvp.com, tier 2), no maker site |
| Pod-180 | หัว dude 3 ml. | 129 | 10 (10) | **owner-declined 22/10** ("2 ไม่ลง") — not listed. Identity unknown (a DUDE brand sells 10K/16K disposables, no 3 ml refill pod found). Max re-used the code: the site's `pod-180` = nexBar CLEAR 18K from the old seed (see d) |
| Pod-137 | Relx เลโก้ 20000 คำ - เครื่องเปล่า (pods ฿349) | 199 | 31 (0) | owner 22/10 "หาข้อมูลเองเลย" → research: Thai shops (7pods.shop, pod9k.com, ezy-pods.net, siam-pod.com, tier 2) sell it as **RELX Creator 20K pod / "RELX Lego 20000"** for the RELX Creator battery, ฿349, 3%/5%; no relxnow.com page (tier 1 silent). Verdict LIKELY — next: a Max-only page for the pods if Friday agrees; all 31 sold out in Max |

Not pages on purpose: Set-Coil-1-1 / Set-Coil-1-14 / Set-Coil-92-1 (box-of-5 packs of live coils — unit of sale is the cart's job),
ELIQUID-1-1 (฿807 bundle), `test`, `Close`. Coil-55-1 = live as `coil-55`.

## Live after step 2 (22/10)

| PR | What | State |
|---|---|---|
| #722 | this table | merged |
| #723 | Esko Bar Switch pod + kit: 4 options linked (b1) | merged, live 200 |
| #724 | VOOPOO Coil Vinci 4 → 16 coils | merged, live 200 |
| #725 | Muro Connector 20K 20 → 33 flavours | merged, live 200 |
| #729 | SALTHUB: Zero Cartridge 22 → 33 (50mg), M Bar 9K 22 → 24, M Switch Kit Grape Aloe linked | merged, live 200 |
| #730 | RELX Smash GO 10 → 27 (incl. 5% versions) | merged, live 200 |
| #731 | "กลิ่น" / "รส" kept on the line of their number (owner 22/10 "1 ทำ"; whole sitemap: 1 break fixed, 0 new) | merged |
| #732 | MOOOD Monster 14K 21 → 23 | merged |
| #733 | RELX Creator Pod 20K (Pod-137) prepared — **unpublished until a card photo** (line 1) | see PR |

All new options carry Max's names and no photo yet (no-photo panel); line 1 (images) has the option ids. Every (a)/(b) row is now live, prepared, owner-declined, or in the identity list below.

Identity checks (b3) after research 22/10 (no change made): Zero Pro Copper / Champagne — salthub.com shows 8 colours, neither name (maybe shop names for Golden Fade / Pink, unproven) · Prime "Red Brown" — not an IQOS name (Garnet Red is) · Infinity 2 Plus "Dark Asteroid" — not on relxnow.com (Blue Bay is) · Joiway "Funta Green" — shops print Funta Grape (owner chose Funta Grape 06/09) · Lambda i8 Silver — no maker source · TEREA Black Purple — official on iqos.com/id → can be added next · ILUMA i ONE Pebble Grey / Azure Blue — these are **ILUMA ONE** (older line) colours, not i ONE → not added.

## (b) Max children missing from the product's options or not linked in sku-map — 27 products checked, gaps in 17

**b1 — option is on the page, only the sku-map link is missing** (shown "สินค้าหมด" today although Max has it):

| Product (site) | Max codes → site option |
|---|---|
| esko-bar-switch-pod | Pod-160-16 Extra Menthol · Pod-160-17 Mango · Pod-160-18 Blueberry Jam (all in stock) |
| pod-159 Esko Bar Switch kit | Pod-159-16 Extra Menthol → `pod-159-verified-extra-menthol` (in stock) |
| m-switch-kit | Pod-156-14 Grape Aloe → `grape-aloe` (in stock) |

**b2 — flavour/colour Max has and the page lacks (new option):**

| Product (site) | Missing Max children | Note |
|---|---|---|
| muro-connector-20k (Pod-171) | 21 Green Slush · 22 Spear Mint · 23 Yakult Orange · 24 Peach Tea · 25 Fruit Punch · 26 Strawberry Ice Cream · 27 Butterscotch · 28 Chocolate Dubai · 29 Grape 50MG · 30 Watermelon 50MG · 31 Double Mint 50MG · 32 Mix Berries 50MG · 33 Yakult 50MG | 13 |
| relx-smash-go-12k (Disposable-39) | 11 Grape Nic 5% · 12 Watermelon Nic 5% · 13 Cola Nic 5% · 14 Double Mint Nic 5% · 15 Cool Mint Nic 5% · 16 Spearmint 5% · 17 Mixberry 5% · 18 Classic Tobacco 5% · 19 Pink Berry · 20 Lychee · 21 Watermelon Bubblegum · 22 Grape Aloe · 23 Oolong Tea · 24 Pink Guava · 25 Blueberry · 26 Strawberry · 27 Pineapple | 17 |
| zero-cartridge (Pod-85) | 20 Peach Strawberry 50mg · 21 Watermelon 50mg · 22 Grape 50mg · 23 Grape Aloe 50mg · 24 Apple Aloe 50mg · 26 Mint 50mg · 27 Mixberry 50mg · 28 Cola 50mg · 29 Pink Berry 50mg · 30 Banana Strawberry 50mg · 31 Menthol Freeze 50mg | 11 |
| coil-1 VOOPOO Vinci (Coil-1) | 2 0.2Ω · 3 0.3Ω · 4 0.6Ω white · 5 0.8Ω white · 6 0.6Ω red · 7 0.6Ω blue · 8 0.8Ω blue · 9 0.45Ω red · 10 1.0Ω · 13 TW30 0.3Ω · 15 TW15 0.15Ω · 16 TW20 0.2Ω | 12, all sold out in Max |
| iqosheet-17 ILUMA i ONE (IQOSHEET-17) | 1 Pebble Grey · 2 Azure Blue · 4 Oasis Limited (฿3200) · 5 Bright | 4, all sold out |
| mood-monster-14k (Disposable-37) | 16 Watermelon 50MG · 22 Mint N5% | 2 |
| m-bar-9k (Disposable-25) | 23 Blueberry Mint · 24 Strawberry Kiwi | 2 |

**b3 — needs a maker check before it is a new option or a link** (name differs, or may be the same item):

| Product | Max child | Site candidate | Question |
|---|---|---|---|
| zero-pro | Pod-178-3 Copper · Pod-178-6 Champagne | Golden Fade · Pink (unlinked) | same colours under other names, or 2 more colours? |
| iqosheet-16 Prime | IQOSHEET-16-4 Red Brown | Garnet Red (unlinked) | same? |
| relx-infinity-2-plus | Pod-105-2 Dark Asteroid | Blue Bay (unlinked) | official colour list |
| joiway-f3 | Pod-133-15 Funta Green | Funta Grape (unlinked) | spelling or two flavours? |
| iqosheet-14 Lambda i8 | IQOSHEET-14-2 Silver | White ("check") | same? |
| iqosheet-15 TEREA | IQOSHEET-15-18 Black Purple | — | not on iqos.com/id (HANDOFF) — needs a maker source |
| infy-20k | Pod-170-19 Mix Berry | Mixberry = Pod-170-5 | looks like a duplicate row in Max — no new option |
| pod-154 Pop Up 10K | Pod-154-19 ฐานแบตเตอรี่ ฿199 | — | battery base: an accessory row under the refill pod |

## (c) Price: Max ราคาขาย vs site — report only (owner sets prices)

Same price: 36 products (relx-creator counted here). Different: 24 — **every one is an owner-set price** (basis "owner-confirmed" / "owner override" in the price files):

| Site product | Site ฿ | Max ฿ | Basis |
|---|---|---|---|
| argus-g4 | 1100 | 1090 | owner-confirmed 06/10 |
| coil-1 | 150 | 130 | owner override 06/10 |
| coil-53 | 450 | 550 | owner override 06/10 |
| coil-72 | 300 | 350 | owner override 06/10 |
| esko-bar-switch-pod | 400 | 349 | owner ruling |
| pod-159 | 550 | 549 | owner rule 06/10 |
| graple-freebase | 160 | 159 (parent 318) | owner-confirmed 19/10 |
| infy-20k | 400 | 369 | owner-confirmed 06/10 |
| joiway-f3 | 350 | 329 | owner-confirmed 06/10 |
| m-bar-10k | 400 | 379 | owner-confirmed 06/10 |
| m-bar-9k | 350 | 349 | owner-confirmed 06/10 |
| m-switch-pod | 400 | 349 | owner-confirmed 06/10 |
| m-switch-kit | 600 | 550 | owner-confirmed 06/10 |
| mq-bar-22k | 390 | 369 / kids 359 | owner 19/10 |
| muro-connector-20k | 300 | 249 / kids 259 | owner-confirmed 06/10 |
| muro-sc-8000 | 300 | 259 | owner-confirmed 06/10 |
| muro-freebase | 250 | 220 | owner-confirmed 22/10 (admin LINE) |
| relx-lumi-18k | 399 | 349 | owner-confirmed 22/10 (admin LINE) |
| super-cool-saltnic | 280 | 269 | owner-confirmed 22/10 (admin LINE) |
| relx-smash-go-12k | 320 | 299 | owner-confirmed 06/10 |
| tfit-m-power-20k | 350 | 320 | owner-confirmed 19/10 |
| vmate-i3 | 800 | 690 | owner-confirmed 06/10 |
| zero-cartridge | 150 | 129 | owner-confirmed 06/10 |
| eliquid-1 Marbo Saltnic | 290 | 269 | owner 21/10 |
| relx-creator | 250 | 199 parent / 250 kids | matches the kids — no difference |

No difference without an owner basis was found. Max-side child prices that differ from their parent: Oasis Limited ฿3200 (ILUMA ONE).

## (d) Site codes Max no longer has — report only

- **pod-180 nexBar CLEAR 18K** (and its brand twin `wotofo-nexbar-18k`): its options carry old-seed codes Pod-180-1…13 (all linked to
  nothing). Max now uses Pod-180 for a different product ("หัว dude 3 ml."). No wrong stock signal today (all null) — but the codes on
  this page must not be linked to Max's Pod-180.
- **ks-quikpro-kit** (KS Quik Pro 15K kit, Max "Product 780" in round list19): no longer in the Max list. The pods (Pod-150) are.
- Every other code linked in sku-map is still in Max (0 vanished).
- 31 site products have no Max code at all (VOOPOO/Vaporesso devices, old coils, Joiway F4, Muro 3 ml, Zero Nano …): the shop sells
  them outside the warehouse list — unchanged.

## Step 2 order (PRs of 1–3 products of one brand)

1. b1 links (Esko Switch pod + kit, M Switch kit) — data only.
2. RELX Smash GO 17 flavours · Muro Connector 13 · Zero cartridge 11 + M Bar 9K 2 (SALTHUB) · MOOOD Monster 2 · Coil Vinci 12 · ILUMA ONE 4.
3. New pages: SUP Zero 22K · Dude pod 3 ml (after identity) · Pod-137 stays blocked.
4. b3 rows after a maker check each.
