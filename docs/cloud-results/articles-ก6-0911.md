# Owner task ก6 — product articles, cloud hand-over (08–09/11)

Cloud chat session_01XcUy7aP3VuSDTvAHZYP1A3 (branch `claude/gifted-lovelace-cxj6cy`). Goal (owner): every product page has an
article, one brand per PR. Criteria (owner 08/11): every fact and number from the maker, **or from 3 shops that agree** (shops using
the same spec text count as 1); thai-check gates; checker PASS; live page checked after deploy. Not touched: prices, stock, cart.

## Done

| Brand | Page | PR | State |
|---|---|---|---|
| VOOPOO | `/products/drag-x2` | #1320 | merged 09/11 (3d80a80b), live page shows the article (curl) |
| UWELL | `/products/caliburn-g3-lite` | #1323 | merged 09/11 (4b0567dc), live page shows the article (curl). Checker sent it back once (facts repeated with hero / feature card / who-is-this-for), fixed in b8daca23 |

## Left — 40 pages (count: PRODUCT_ARTICLES entry with th sections vs `allProducts` + `getPublishedProducts()`, 09/11;
`m-bar-9k` excluded: it has the editorial layout in `src/data/product-editorial.ts`)

| Brand | Pages | Source route |
|---|---|---|
| RELX | relx-pod · relx-pod-pro · relx-ultra-pod · relx-ultra-kit · relx-artisan-plus · relx-creator-pod-20k (seed, FAQ only) | relxnow.com / relxnow.my (URLs already cited in `src/data/products/relx.ts`) |
| RELX (no maker page) | relx-sparta-20k · relx-novo-14k · relx-diva-30k | box photo or 3 shops (THAI_STYLE §5 exception 07/11 already names these 3) |
| SMOK | smok-nord-5 · smok-rpm-5 | store.smoktech.com + smoktech.com (URLs in `src/data/products/smok.ts`) |
| SALTHUB | zero-nano · eliquid-1 (Marbo Saltnic) · eliquid-109 (Marbo Freebase) | salthub.com has **no** Zero Nano page and nothing on the Marbo bottles (researcher 08/11) → 3 shops |
| Unbranded legacy | nexas-booster-16k · foli-bar-15k · vazer-one-pod · vazer-reload-15k · next-pro-2-beyond · 86-bar-20k | vazerpod.com · xmcvape.com (Foli) · others 3 shops |
| MOOOD | mood-monster-14k | web.archive.org copy of mooodvapes.com (cited in the product file) or 3 shops |
| Seed pages, no brand id | eliquid-64 Double Mint · eliquid-72 Pepo · eliquid-73 Dundu · pod-142 Reswa Sportcan 12K · pod-154 Pop Up 10K · nexswitch-16k-kit · nexswitch-16k-pod · super-cool-saltnic (FAQ only) · punta-ice · graple-freebase · mq-bar-22k (FAQ only) · marbo-10k-clone · dude-pod-3ml | mostly 3 shops |
| Coils / heat | coil-70 Dotmod (dotmod.com) · coil-54 Nevoks Feelin Mini (nevoks.com) · coil-89 Rincoe Jellybox V · iqosheet-14 LAMBDA i8 (lambdasmoke.com) · iqosheet-15 IQOS TEREA (iqos.com, FAQ only) · pod-149 SKE Crystal B20000 | maker sites named |

## Why the cloud stopped at 2 brands

This cloud environment ("Smog.z") allows only a short host list: myuwell.com, salthub.com, voopoo.com and a few others.
relxnow.com (apex), smoktech.com, manuals.plus and every retailer host fail DNS. `update_environment` to add maker hosts was
rejected by the service. WebSearch works but returns summaries only — not enough to show 3 shops agree. → The remaining pages
need the owner's computer (Chrome, any host) or a cloud environment with full network.

## Method that worked (per brand)

1. List pages without an article (script idea above) and read each product record + `product-copy-th.ts` first.
2. Read the maker page yourself (curl + strip tags; spec text often sits in poster images → download, shrink with PIL, read).
3. Write th first, then en/zh from the same facts, in `src/data/product-articles.ts`; a source comment above the entry
   (URL + quotes); legacy page → `sections` only, no article FAQ; seed page → `faq` allowed. ≤ 3 in-body links per locale.
4. **Before writing, list what the page already says** (hero/tagline, feature cards, who-is-this-for, spec rows): one fact at
   most twice outside the spec table. #1323 was sent back for exactly this — the shared G3 cartridges and the three ohm values
   were already in the hero + feature card.
5. Gates in a test worktree under `_incoming/` with a real copy of node_modules (a symlink breaks Turbopack; run `next typegen`
   first): `verify-catalog --full` at the exact head (OKAMI24_ORDERING=off — cart closed), `test-server.js start`, `scan.js`,
   `locale-hydration-scan.js`, `wordbreak-scan.js` on the page, links 200, then `pre-checker-gate.js` → checker → `--done`.
6. Main moved → merge main in, verify again at the new head, narrow checker re-check, `Checker: PASS <head>`.
7. Cloud cannot run `self-merge-check --pr` (GitHub GraphQL is blocked here); read check runs through the GitHub tools instead.

## Held back / noted, not changed

- DRAG X2 spec row "coils in the box: 0.15Ω and 0.2Ω" follows VOOPOO's shop box list; VOOPOO's main page box list says
  0.15Ω + **0.3Ω**. Article avoids the second coil. A data pass should pick the maker page and fix the row.
- Caliburn G3 Lite feature card says the battery is "20% bigger and lasts up to three days" — UWELL's footnote says 20% is
  vs "other common products in the market" and 3 days is "from the UWELL lab test"; the article now says so.
- Word-break scan flags on both pages are pre-existing text: footer "ทักไลน์มา แอดมินตอบเอง ไม่ใช่บอท" (ไม่ at line end at 390)
  and DRAG X2 feature "ส่วนถ่านไม่รวมอยู่ด้วย" (1440).
