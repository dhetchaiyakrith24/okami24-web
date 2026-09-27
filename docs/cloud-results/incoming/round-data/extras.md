# Data round — extras (13.10 #1 ง) + hand-offs to later rounds · chat 2, 2026-09-24

## Done beyond the instruction (each one reversible on its own; customer-facing ones are in owner-table.md)
| # | What | Why (1 line) | How to undo |
|---|---|---|---|
| X1 | /search and category search boxes match only verified spec rows (`src/data/products/index.ts` SEARCH_TEXT) | typing "14mL" or "650mAh" brought up M Bar 9K / Joiway as if the hidden number were a fact | revert the index.ts hunk (2 lines) |
| X2 | gate check 7+8 in `verified-specs-contract-test.ts`: head descriptions + published taglines state only verified numbers; published rows with a URL name a maker domain | the meta description is a place specs are read (instruction v2) and chat 1's gate did not cover it — it had let coil-94 "ความจุ 2mL" through | delete the two checks |
| X3 | m-switch-pod gets "Resistance 1.0Ω", m-bar-pod "Capacity 2.2mL" (both read on salthub.com in a real browser) | fills 2 of the 10 empty card lines with a real maker fact instead of a design workaround | revert the salthub.ts rows |
| X4 | product-master schema accepts a per-row `sourceUrl` (same as the legacy schema since chat 1) | pod-159's new rows carry their URL row by row, as the owner's gate rule asks | drop the one schema line + the row URLs |

## Not done in this round — with the reason
- **Hydration / JS bundles still carry held-back rows.** Chat 2 scrubbed the Thai overlay (28 values) and search, but the raw
  rows + unbacked attribute numbers still reach the browser: product pages pass the whole `product` to client components
  (SpecSheet, ProductHero …), and `/finder`, `/search`, `/compare`, `/favorites` import the whole catalog into their JS bundle
  (FinderTool, SearchTool, FavoritesList, CompareTool/ProductPicker are client components). Removing them needs either
  deleting the unverified rows from `src/data/products/*.ts` or a server-only split of the catalog — both outside the files
  this round released, and deleting attribute numbers would change Finder's ranking, which the owner wants unchanged.
  Proposal for a small code round: move `specifications` rows with `sourceStatus: "unverified"` and the Finder ranking
  numbers into a server-only module; Finder ranks on the server (or on precomputed booleans) → nothing unverified ships.
- **Finder ranks on unverified numbers (internal only).** Kept on purpose so the list is identical (864/864 answer sets,
  `finder-before.txt` = `finder-after.txt`); 3 reasons a customer read are gone because no verified row backs them
  (G3 Pro KOKO "low wattage" ×27 answer sets · Joiway F3 "big battery" ×84 · Joiway F4 ×44 — `finder-reasons-*.txt`).
- **/compare "Charging" row "—" on 19 devices** (optional item) — not attempted this chat; needs a maker source per device.
- **Shipnity products show Thai names / Thai spec labels on EN/ZH pages** (pre-existing; pod-159's new rows are Thai too,
  same as every other Shipnity product) → language round.
- **/brands/uwell uniform spec format** — out of this round (instruction v2).

## Questions found (manufacturer data contradicts itself or cannot be reached — not decided, per "ถ้าติด")
- Q1 VOOPOO TPP Pod (coil-87) "แม่เหล็ก" (spec row + head description): voopoo.com unreachable from here → keep or cut?
- Q2 IQOS ILUMA i PRIME battery: our verified row "2380mAh" vs iqos.com/ph compare table "300 mAh Holder / 2700 mAh Charger".
- Q3 SALTHUB ZERO PRO: salthub.com "The Benefits ZERO PRO … Puff 15000puff" (a copy of the M SWITCH POD block) vs our verified
  "Up to 5,000 per cartridge".

## For round 11A (images)
- pod-159 Esko Bar Switch 20K: **none of the 20 flavours has its own photo** (card image only) — all 20 need one; the maker
  page has a clean per-flavour photo for each (`eskobarvape.com/assets/product-pod542-flavor-<name>.jpg`, LAUNCH_AUDIT 33).
