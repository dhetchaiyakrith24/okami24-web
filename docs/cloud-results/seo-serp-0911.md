# 09/11 read — real Google result pages + indexing requests (PC child chat of Friday, 09/11 about 00:25–01:05 Thai)

Input for the 09/11 rows of `docs/SEO_BASELINE.md` (round "rankings back" start-point table, Change 2 keys) and block 4 of
`docs/rounds/รอบพอตใช้แล้วทิ้ง-05-11.md`. The Search Console numbers for the same read are written by the cloud SEO chat from the
09/11 gsc-data export; the export-based lines at the end are only what was on branch gsc-data at 00:30 (export 08/11, data to 05/11).

## Method (same as SEO_BASELINE "REAL GOOGLE RESULT PAGE")
- Built-in browser of the Claude app (the owner's Chrome was offline at the start), `google.co.th/search?q=<q>&hl=th&gl=th&pws=0`,
  pages `start=0` and `start=10` (top ≈ 17–20 organic), ≥ 22 s between loads, one load at a time. 32 desktop + 4 mobile loads, **no CAPTCHA**.
- Organic results = `#rso a h3`, one per result block, domain from the block's `<cite>` (YouTube / Facebook blocks show a view or
  follower count instead of a domain). "not in top N" = no okami24.store block in N organic results, and "okami24" nowhere in the page text.
- Mobile = `resize_window` preset mobile (375×812, Android Chrome user agent), page 1 only, for 4 queries.

## Desktop, 09/11 about 00:35–00:52

| query | okami24 | URL Google chose | read depth | top 3 (organic) | 02/11 (desktop) |
|---|---|---|---|---|---|
| pod system | not in top 17 | — | 17 | YouTube · ihavevape.net · vapedumpthailand.store | not in top 17 |
| pod | not in top 17 | — | 17 | vap150ipro.com · pod2vape.co · th.wikipedia.org | not in top 16 |
| **voopoo drag 6 ราคา** | **#1** | /products/drag-6 (title "VOOPOO DRAG 6 พอตซิสเต็ม ของแท้ ฿2490 - OKami24", snippet = our meta, ends "สั่งบนเว็บหรือ LINE …") | 17 | okami24.store · vmaniath.com · ubuy.co.th | not in top 7 |
| relx lumi 18k | not in top 17 | — | 17 | vap150ipro.com · YouTube · maneevp.com | not read |
| voopoo drag 6 | not in top 17 | — | 17 | voopoo.com · YouTube · vaping360.com | not read |
| joiway | not in top 16 | — | 16 | Facebook · Facebook · maneevp.com | not read |
| caliburn g5 | not in top 17 | — | 17 | vaping360.com · myuwell.com · YouTube | not read |
| พอตใช้แล้วทิ้ง | not in top 17 | — | 17 | yaivapestore.com · dudekub.net · YouTube | not read (05/11: not on page 1) |
| disposable pod | not in top 17 | — | 17 | vapedumpthailand.store · maneevp.com · vap150ipro.com | 05/11: not on page 1 |
| disposable | not in top 17 | — | 17 | dict.longdo.com · dictionary.cambridge.org · engoo.co.th | — |
| น้ำยาบุหรี่ไฟฟ้า | not in top 17 | — | 17 | lazada.co.th · sudjud9.com · vap150ipro.com | not in top 19 |
| พอตเปลี่ยนหัว | not in top 18 | — | 18 | sudjud9.com · maneevp.com · YouTube | — |
| พอต | not in top 20 | — | 20 | dudekub.net · yaivapestore.com · maneevp.com | not in top 20 |
| relx | not in top 17 | — | 17 | relxnow.com · relxon.com · Facebook | not in top 17 |
| voopoo | not in top 14 | — | 14 (page 1 had 5 organic) | voopoo.com · Facebook · vapestore.co.uk | not in top 14 |
| okami24 (control) | #1 | / | 6 | okami24.store · YouTube (another "OKAMI") · instagram.com/okami24 | #1 |

- **Home snippet for "okami24" is now our meta** ("OKami24 (OKM) ร้านพอตไฟฟ้าและบุหรี่ไฟฟ้า ของแท้ ราคาตรง มีพอตซิสเต็ม …"), no longer the
  21+ age-gate text (02/11) → the `data-nosnippet` on the gate (PR #1121) works.
- "voopoo drag 6 ราคา" is back at #1 (GSC 13–26/10 pos 1.0). Nothing else in the list is back in the top 20.

## Mobile, 09/11 about 00:53–00:55 (page 1 only)

| query | okami24 |
|---|---|
| voopoo drag 6 ราคา | #1 |
| pod system | not on page 1 (8 organic) |
| พอตใช้แล้วทิ้ง | not on page 1 (9 organic) |
| disposable pod | not on page 1 (9 organic) |

## Search Console: what branch gsc-data held at 00:30 (export 08/11 02:38Z, last day with data 05/11)
- Daily site totals (clicks/impressions · pos), from `last90-date`: 01/11 10/26 · 4.8 · 02/11 7/16 · 4.3 · 03/11 11/25 · 4.3 · 04/11 5/16 · 4.9 ·
  05/11 11/23 · 5.1. Before the drop (20–26/10) 18–30 clicks and 179–297 impressions a day. **No recovery through 05/11.**
- `scripts/seo-weekly-numbers.js`: 30/10–05/11 = 61 clicks / 140 impressions / pos 4.9 vs 23–29/10 129 / 926 / 12.0;
  recovery levels 0 of 7 days (halfway = 100+ impressions a day).
- Queries whose 28-day impressions grew between the 01/11 and 08/11 exports (= the days 31/10–06/11 brought at least that much):
  okami24 +11 · "ราคา" +5 · caliburn g5 ราคา +4 (+6 clicks) · joysway f4 +2 · six single-impression long phrases. **No generic,
  category, disposable or e-liquid query gained an impression.** "น้ำยาบุหรี่ไฟฟ้า" still has only its old /e-liquid row (0/11 · 69.0);
  nothing on /products/e-liquid yet.
- These are lower bounds from export differences, not the Performance screen with URL filters; the cloud SEO chat reads the 09/11 export.

## Indexing requests 09/11 (owner's Chrome, Search Console URL inspection, skill seo-after-publish)
Requested, each confirmed by the dialog "ขอการจัดทำดัชนีแล้ว" (and logged in `_incoming/seo-requests.log`):

| # | page | state at inspection |
|---|---|---|
| 1 | /products/disposables | on Google (last crawl before the 08/11 change) |
| 2 | /products/relx-pod | not on Google: URL unknown to Google |
| 3 | /products/relx-pod-pro | not on Google: discovered, not indexed |
| 4 | /brands/smok | not on Google: URL unknown |
| 5 | /products/smok-nord-5 | not on Google |
| 6 | /products/smok-rpm-5 | not on Google |
| 7 | /products/vazer-reload-15k | not on Google |
| 8 | /products/86-bar-20k | not on Google |
| 9 | /products/nexas-booster-16k | not on Google |
| 10 | /products/caliburn-g3-lite | not on Google |
| 11 | /guides/how-to-vape-without-coughing | on Google (read 23/10, changed 08/11) |

12th (/guides/pg-vg-in-e-liquid): **"เกินโควต้าแล้ว … โปรดลองส่งอีกครั้งในวันพรุ่งนี้"** → stopped. Left for 10/11 (they stay on the
`scripts/gsc-unread.ts` list by themselves): /guides/pg-vg-in-e-liquid, `/` (home, changed 08/11), /products/relx-artisan-plus and the
other never-read pages of 07/11 (relx-diva-30k, relx-novo-14k, relx-sparta-20k, drag-x2, relx-ultra-pod, pod-150, relx-ultra-kit).
