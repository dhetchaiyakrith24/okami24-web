# Data round — what customers see, before → after (for Cowork / owner at merge) — 2026-09-24, chat 1

Sources for every "keep/fix": `_incoming/round-data/sources-verified.md` (opened in a real browser). Cuts/fixes made on
the manufacturer's own page = Cowork can approve. **New sentences a customer reads = owner** (marked ★).

## Batch 1 — the site shows only verified rows and backed numbers (owner answer 1 ก)
| Where | Before | After |
|---|---|---|
| Spec sheet, legacy product pages | unverified rows listed with a "ยังไม่ยืนยัน" badge (25 rows / 11 pages) | not shown; header always reads the "all verified" line |
| 4 pages with no verified row (caliburn-g4-classic · caliburn-g3-pro-koko · joiway-f3 · joiway-f4) | spec section of unverified rows | no spec section, no "ดูสเปก" button |
| ProductHero stats | numbers from attributes | only numbers a verified row states — lost on 8 pages (g5-lite / g5-lite-se capacity · g4-classic battery · g3-pro-koko battery/output/capacity · m-bar-9k capacity · m-switch-pod capacity · joiway-f3/f4 all) |
| /compare classification rows, ProductAnatomy, Finder reasons | attributes | backed attributes only; "USB-C" charging shows "—" on 19 devices whose verified rows never name USB-C (fix = add a sourced charging row later) |
| Cards with an empty headline line | 15 (was counted 6: legacy only) | unchanged — designer's 2-3 options NOT made yet (owner answer 2 ก) → next chat |

## Batch 2 — SALTHUB + sample check (7 products the 5 live guides link to), every row now carries its URL
| Product | Row | Before | After |
|---|---|---|---|
| m-switch-pod | capacity | 2.2mL prefilled | hidden (SALTHUB: 2.2mL only under M BAR POD / ZERO CARTRIDGE) |
| m-switch-pod | battery | — | **600mAh** (SALTHUB "THE BENEFITS — M SWITCH POD") |
| m-switch-kit | battery | hidden | stays hidden (SALTHUB names the POD, not the kit) |
| m-bar-9k | capacity / coil | 14mL / Mesh coil | hidden (on no SALTHUB page) |
| m-bar-9k | nicotine / airflow | 3% (30mg) / MTL-to-DTL | 30mg / Adjustable |
| m-bar-9k | resistance | — | **1.0Ω** (SALTHUB) |
| m-bar-10k | nicotine | 30mg | hidden (on none of 7 posters) |
| relx-smash-go-12k | coil / capacity | MEGA MESH 1.0Ω / unverified | MEGA MESH / **20mL** (relxnow.com "Size 20ml") |
| caliburn-g4-mini | pod / charge time | 0.4Ω/0.9Ω included / ~58 min | **0.6Ω in the box** (UWELL spec image) / hidden |
| caliburn-g4 | charge / firing / pod / output | ~30 min at 2A / Button-fired / +0.6/1.2 sold separately / unverified | USB-C 5V/2A / draw or button (auto) / 0.4Ω+0.9Ω in box / **35W** |
Prose cut to match (3 languages): M Switch Pod 2.2mL (product + guide open-system-vs-disposable) · M Bar 9K 14mL/3%/mesh/MTL-DTL
(product + first-pod guide) · M Bar 10K 30mg (guide + technology) · RELX 1.0Ω · technology mesh-coil section now 10K only.
★ Joiway F3/F4 short descriptions (en + th) rewritten — retailer numbers out, "we could not find the specs on Joiway's
site" in: th "พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว เรายังหาสเปกของรุ่นนี้บนเว็บ Joiway ไม่เจอ เลยยังไม่ใส่ตัวเลข" · F4 same line.
★ m-bar-9k feature line th "ปรับช่องลมได้ที่ตัวเครื่องเอง" · tech page th "รุ่นนี้เป็นพอตใช้แล้วทิ้ง คอยล์เลยไม่ต้องเปลี่ยน…".

## Batch 3 — names (title / Product.name / H1 from one data field)
| Page | `<title>` before (live) | after |
|---|---|---|
| /products/pod-159 | เครื่อง Esko Bar Switch 20k ของแท้ ฿549 — OKami24 | ESKO BAR SWITCH 20K พอตคิท ของแท้ ฿549 — OKami24 |
| /products/iqosheet-16 | IQOS iluma Prime ของแท้ ฿4,900 — OKami24 | IQOS ILUMA i PRIME ของแท้ ฿4,900 — OKami24 |
| /products/iqosheet-18 | Iqos iluma Standard ของแท้ ฿3,900 — OKami24 | IQOS ILUMA i ของแท้ ฿3,900 — OKami24 |
Esko flavours: 5 extra names on the manufacturer page vs the 06/09 Pod-160 ruling → owner answered "Cowork checks Pod-160 first".

## Batch 4 — blinking-light guide (sources: G4 / G4 Mini / G5 manuals on manuals.plus)
| Before | After |
|---|---|
| "…ให้ชาร์จด้วยสาย USB-C กับหัวชาร์จ 5V/2A" (all Caliburn) | "…ให้ชาร์จด้วยสาย USB-C" (G4 Mini manual says 5V/1A) |
| "G4 กับ G4 Mini ตัดเมื่อเกิน 8 วินาที" | "G4 ตัดเมื่อเกิน 8 วินาที" (G4 Mini manual copy is garbled there) |
| "ไฟเขียวกะพริบ 5 ครั้ง คือดูดค้างเกิน 8 วินาที" | "…คือดูดค้างนานเกินไป" |
"NO ATOMIZER" bound on one line. Held guide comparing-caliburn-models: charge-time line cut (stays held).

## Batch 5 (part)
| Page | Before | After |
|---|---|---|
| /products/coil-94 capacity | 2mL (giantvapes.com) | 2.0–3.0 mL by GPP cartridge type (myuwell.com/g-pod-platform) — card shows no capacity number |
| /products/caliburn-g5 pod row (SEO_BASELINE held page — content only) | 3mL, top-fill, magnetic connection | 3.0mL (2.0mL in TPD markets), top refill |
| coil-72, coil-89 | listed under คอยล์และอุปกรณ์ | listed under หัวพอต (URL unchanged) |
Not done: /brands/uwell uniform rows · "magnetic" in ~10 prose spots (on no UWELL page) → next chat.

---

# Chat 2 (2026-09-24) — instruction v2 + the owner's 5 answers

Sources for every row: `_incoming/round-data/sources-verified.md` § "Chat 2". ★ = a sentence a customer reads that is new or
reworded → owner decides at merge (via Cowork). Everything else = a cut or a maker fact → Cowork can approve.

## A. Every new FACT a customer sees in this round (chat 1 + chat 2) — owner asked for all of them here
| Product | Row | Value | Maker source |
|---|---|---|---|
| m-bar-9k | resistance | 1.0Ω | salthub.com "The Benefits M BAR 9K" (chat 1) |
| relx-smash-go-12k | capacity | 20mL | relxnow.com "Size 20ml" (chat 1) |
| caliburn-g4 | max output | 35W | myuwell G4 spec image (chat 1) |
| caliburn-g4 | charging / firing / pod in box | USB-C 5V/2A · draw or button · 0.4Ω + 0.9Ω | myuwell G4 page + spec image + manual (chat 1) |
| caliburn-g4-mini | pod in box | 0.6Ω | myuwell G4 Mini spec image (chat 1) |
| m-switch-pod | battery | 600mAh | salthub.com "The Benefits M SWITCH POD" (chat 1) |
| m-switch-pod | resistance | **1.0Ω** (new, chat 2) — card line now "1.0Ω" | same block |
| m-bar-pod | capacity | **2.2mL** (was held back, chat 2) — card line now "2.2mL" | salthub.com product box "M BAR POD" |
| caliburn-g5 | pod | 3.0mL (2.0mL TPD), top refill | G5 manual + page (chat 1) |
| coil-94 | resistances / capacity | 0.4 / 0.6 / 0.9 / 1.2Ω · 2.0–3.0 mL by GPP type | myuwell.com/g-pod-platform (chat 1) |
| pod-159 | 7 new rows ★ (Thai values) | จำนวนพัฟที่ระบุ สูงสุด 20,000 · แบตเตอรี่ 850mAh · ความจุหัวพอต 18mL · การชาร์จ 5V 0.85A · ช่องลม ปรับได้ 3 ระดับ หมุนที่ก้นพอต · โหมดการทำงาน High กับ Low กดปุ่มเดียวสลับได้ · คอยล์ คอยล์คู่ ทำงานพร้อมกัน — card line "แบตเตอรี่ 850mAh" | eskobarvape.com/product/pod-system/ |

## B. Names / flavours
| Page | Before | After |
|---|---|---|
| /products/pod-159 flavours | 15 (2 in stock + 13 not stocked) | **20** = the maker's list; Blueberry Jam · Chocolate Mint · Coconut · Extra Menthol · Mango added with the same "not stocked" status as the other 13 (owner answer 4, replaces the 06/09 cut) · no flavour has its own photo → all 20 listed for round 11A (extras.md) |

## C. Sentences (3 languages where the page has them; zh product pages show the English line)
| Where | Before | After |
|---|---|---|
| joiway-f3 short description th ★ | พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว เรายังหาสเปกของรุ่นนี้บนเว็บ Joiway ไม่เจอ เลยยังไม่ใส่ตัวเลข | พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว ถ้าอยากได้ 2 รสในเครื่องเดียว ดูรุ่น F4 — thai-copy option ก: without the added half the line is word-for-word the tagline right above it (and it is also the page's meta description); the English line already points to the F4. Option ข (owner's words exactly): "พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว" |
| joiway-f3 en | …the single-flavor model. We could not find the F3 specifications on Joiway's own site, so this page lists no figures yet. OKami24's own YouTube review covers the newer dual-flavor F4 — see that page. | …the single-flavor model. OKami24's own YouTube review covers the newer dual-flavor F4 — see that page. |
| joiway-f4 th ★ | พอตใช้แล้วทิ้ง 2 โหมด 2 รสในเครื่องเดียว เรายังหาสเปก… ส่วนตัวนี้แหละที่ OKami24 รีวิวใช้จริง 30 วันบน YouTube | พอตใช้แล้วทิ้งจาก Joiway 2 โหมด 2 รสในเครื่องเดียว OKami24 รีวิวใช้จริง 30 วันไว้บน YouTube |
| joiway-f4 en | A dual-flavor, dual-mode disposable (rotate the mouthpiece to switch flavors). We could not find… | A dual-flavor, dual-mode disposable from Joiway. This is the exact model OKami24's own YouTube channel reviewed… ("rotate the mouthpiece" cut — on no maker page, only in the held-back row) |
| "2 โหมด 2 รส" (F4) | — | ~~kept by owner exception (answer 3)~~ **superseded 06/10 pm (owner): cut — it was the NOS edition; the page clip is now the F4 TWINS review l-8sAPwOUZw (HANDOFF §18)** |

## D. "magnetic / ยึดด้วยแม่เหล็ก / 磁吸" — counted with `grep -rniE "magnet|แม่เหล็ก|磁" src` (comments excluded): 20 spots before
| Model | Spots | Maker check | Result |
|---|---|---|---|
| Caliburn G5 | 11 (product feature + FAQ en/th · guide choosing-your-first-pod-system en/th/zh · technology gesture page en/th/zh · held article argus-g4-vs-caliburn-g5 th — file only, stays held) | not on myuwell G5 page, not in the G5 manual | **cut** (`caliburn-g5` = held page → SEO_BASELINE) |
| Caliburn G4 Pro | 7 (short description en/th · pod row en/th · technology touch-display page en/th/zh) | not on myuwell G4 Pro page; its manual PDF is image-only, not readable here | **cut** (say if the manual should be read by eye first) |
| VOOPOO TPP Pod (coil-87) | 2 (spec row "การเชื่อมต่อ แม่เหล็ก" + meta description) | voopoo.com unreachable from here | **unchanged — question Q1** |

## E. Hidden values that still reached the customer (goal of batch 1: unverified values shown without a label → 0)
| Where | Before | After |
|---|---|---|
| coil-94 meta description | "…1.2 โอห์ม ความจุ 2mL" | "…1.2 โอห์ม" (the verified row says 2.0–3.0 mL by type) |
| /search + category search box | a held-back value ("14mL", "650mAh") found the product | only verified rows are searched |
| Finder reasons | "big battery" on Joiway F3/F4, "low wattage" on G3 Pro KOKO rested on held-back numbers | those 3 reasons no longer shown; **product lists identical, 864/864 answer sets** (`finder-before.txt` = `finder-after.txt`) |
| Thai overlay (not shown, shipped in the page bundle) | 28 Thai values of held-back rows | 0 |
| hydration / JS bundles | held-back rows travel with the page | **unchanged — reason in extras.md** |

## F. Questions (manufacturer data unreachable or contradicts itself — not decided)
Q1 coil-87 "แม่เหล็ก" keep/cut · Q2 IQOS ILUMA i PRIME battery 2380mAh vs iqos.com table 300/2700mAh · Q3 ZERO PRO 15000 puffs (salthub block) vs 5,000 per cartridge. Detail: extras.md.

## G. Empty card lines — designer's options (owner answer 5; none is placeholder text) — images `_incoming/round-data/shots-c2/`
Count from code (`empty-cards.ts`): 14 empty = the 6 accepted (g4-classic · g3-pro-koko · m-switch-kit · zero-pro · joiway-f3/f4)
+ 8: coil-1 · coil-38 · coil-55 · coil-68 · coil-54 · coil-72 · coil-94 · iqosheet-18. Designer finding: at 1440 six of the 8
already show the option count ("4 ค่าโอห์ม", "2 สี"); truly empty at 1440 = coil-55, coil-54; at 390 all 8 are empty.
| Option | What the card shows | Code | Risk |
|---|---|---|---|
| **ก (designer's pick)** | phone shows the option count like desktop ("4 ค่าโอห์ม" / "2 สี"), only when ≥2 options → fills coil-1, coil-38, coil-72, coil-94, iqosheet-18 | PilotProductCard.tsx phone slot only; the do-not-touch rules untouched | low |
| **ข (designer: use with ก)** | a maker fact per empty pod (as done for m-switch-pod / m-bar-pod this chat) → "ความจุ 2mL" on both widths | data only; needs a maker source per product (coil-55, coil-68, coil-54 have none yet) | none, costs research |
| ค | a range as the headline ("0.4–1.2Ω"), "ใช้กับ TEREA" | opens card-headline-spec.ts rules (do-not-touch, owner's call) | high — a range reads as "all values in one pod" |
Not built: the owner picks. Designer also flagged (pre-existing, not this round): "รีวิวจาก OKami24" twice on pod-159 ·
desktop prices not level when a name wraps to 2 lines · Esko tagline cut "จากแบรน…" on the card.

## H. Small fix from the designer pass
| Where | Before | After |
|---|---|---|
| pod-159 tagline th / en | "…Esko Bar Switch 20k…" under the name "ESKO BAR SWITCH 20K" | "…Esko Bar Switch 20K…" (case only) |
