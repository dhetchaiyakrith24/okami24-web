# Round "mobile" — cloud results (2026-09-26/27)

Round instruction: `origin/inbox:rounds/mobile-full-round.txt` · branch `claude/mobile-full-round-vc6o2b` · base main `f1eefd6`
(= the rollback point; the tag `pre-mobile-round` exists only in the session clone — tag pushes are refused from the
cloud, see batch 1) · machine: claude.ai/code cloud, Ubuntu 24.04, Playwright Chromium 141.0.7390.37, node 22.22.2.
All results below were produced in this cloud session. Evidence folders under `_incoming/mobile-round/` are
git-ignored and die with the container — this file is the record. Nothing here was tried on the Windows computer:
every script change keeps the Windows path unchanged by construction, **[ยังไม่ได้ลองบนคอม]**.

## Batch 1 — one-step machine prep

| Check | Result |
|---|---|
| `node scripts/prepare-clone.js` on a fresh `git clone --depth 50` of the branch | READY in 5 s (hooks set · unshallowed to 664 commits + 39 tags · packages · `next typegen` · browser · Thai font) |
| `npm run verify:catalog -- --full` right after, same fresh clone | **30/30 passed**, 91 s (T4: 28/30 — the 2 failures were clone artefacts) |
| Red: fresh shallow clone, history step skipped, `npx tsx scripts/content-dates.ts --check` | **exit 1** — "content-dates.json is stale — 16 path(s) differ from git" |
| `test-server.js` start → start again → stop → port probe | start OK · second start **refused** ("port 3412 is up (PID …) — refusing to start a second server") · stop OK · port free (ECONNREFUSED) · 0 `next` processes left |
| Why stop failed in T4 | `lsof` does not list next-server's listener in this container; `fuser -n tcp 3412` does. Fix: fuser fallback + kill the detached process group + a TCP probe so start/build refuse and stop fails loudly when no tool names the PID |
| SessionStart hook (`.claude/settings.json` → `prepare-clone.js --session-start`) | **ran by itself** on each session resume in this chat and printed `prepare-clone: READY`; with `CLAUDE_CODE_REMOTE` unset it exits 0 at once (simulated) |
| Tag push from the cloud | **refused**: `git push origin refs/tags/pre-mobile-round` → `HTTP 403` (branch pushes work) |

## Batch 2 — screenshots, scans, fonts

**What the site loads itself** [ตรวจแล้ว, `src/app/layout.tsx`]: Barlow Condensed · Inter · IBM Plex Mono through
`next/font`, **Latin subset only**. The site ships no Thai (or Chinese) font — every Thai glyph a visitor sees comes from
their own device (Windows: Leelawadee UI · Android: Noto Sans Thai · iPhone: Thonburi). A screenshot is therefore only
as representative as the machine's Thai font. The cloud image's own Thai font is Loma (TLWG), which matches no
visitor's phone; `prepare-clone.js` step 6 installs **Noto Sans Thai** (weights 400–800, Google Fonts) and makes
fontconfig prefer it for Thai.

| Check | Result |
|---|---|
| Chromium found by search (`scripts/lib/chrome.js`) | `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, run with `--no-sandbox --disable-dev-shm-usage` (root in a container); Windows keeps `C:/Program Files/Google/Chrome/Application/chrome.exe` and no extra flag |
| `font-check.js` green (`/`, `/products/caliburn-g4-classic`, `/guides/choosing-your-first-pod-system`, 390) | **PASS 3/3** — Thai glyphs 100 % Noto Sans Thai (system) · Latin glyphs from Inter / Barlow Condensed / IBM Plex Mono (web fonts) · 3–6 arrow glyphs per page from Liberation Serif (allowed: characters no site font holds) |
| Red A: web fonts blocked (`--block-webfonts`) | **FAIL** — "latin: 213 element(s), e.g. `<span>` "TH" drawn with Liberation Serif" |
| Red B: expected Noto Sans Thai while the machine still used Loma | **FAIL** — "thai: 199 element(s), e.g. `<span>` "สินค้า" drawn with Loma" |
| Same page shot twice, same build (390) | `/products/caliburn-g4-classic` and the guide: **md5 identical**. Home: differs only in rows 65–1011 css px = the animated hero (known limit, `scripts/shot.js` head) |
| Shot time | 3.5–4.8 s per 390 shot (≤ 10 s target); first shot of a fresh Chromium ~10 s |
| `--max-height` on cloud Chromium | was ignored (home came out 27,618 px tall); fixed with an explicit clip off Windows — now 8,000 px @2x as intended |
| Home at 1440, `--desktop`, full page | **hangs** (`Page.captureScreenshot did not answer within 60s`), with and without the clip · works with `--max-height 2000`, `--viewport` or `--reduced-motion` (4 s) |
| Home at 1440 content | the desktop hero is a scroll-driven intro: at scroll 0 the frame shows light and rings only; with `--reduced-motion` the logo + brand row shows; the H1 ("Pod System ของแท้ ข้อมูลจริง") is in the DOM. Proof of the desktop home hero needs `--reduced-motion` or `--anchor` past the intro |
| `visible-text.js` scan, 51 pages × th × 390+1440, run twice | **102/102 files identical** (`diff -r`), 108 s and 105 s |
| `linemap-scan.js`, 51 pages × 390, run twice | diff: **0 pages with any difference** · 0 overflow · 0 console errors — 55 s / 54 s |
| `wordbreak-scan.js`, 51 pages × 390, run twice | **all output files identical**, 136 s each |
| designer opened the 15 crops in the cloud | **yes** — Thai legible, no tofu/stacked marks, weights right, no layout break at 390 (3 pages) and 1440 (product, guide) · [ยังไม่เทียบภาพคอม] · home 1440: see the row above · position:fixed bars (mobile buy bar, LINE button) do not appear in full-page shots (capture method, not the site) |

Sample = every second URL of the 104-URL sitemap. The empty first line meant `/` was not scanned in the sample runs and
`/products` falls on an even line; scope-auditor flagged both (home was covered by the shots and by batch 4's set).

Site observations passed on by the designer (not this round's to fix — no site change allowed): guide H1 lines at 390
sit very close (upper marks of "เครื่อง" near the line above — [เชื่อว่า] not touching) · the black colour swatch on
the G4 page is almost invisible on the dark background · on a related-products card at 390 the image nearly touches
the "8 สี" label and the heart button.

## Batch 3 — live site and the domains the clip round needs (2026-09-26 17:22 UTC)

| Host | From the cloud |
|---|---|
| `okami24.store` | **200** (curl) · `www.okami24.store` → 301 |
| `fonts.googleapis.com` · `fonts.gstatic.com` | reachable (404 on `/`, a real server answer) |
| `www.youtube.com` · `www.youtube-nocookie.com` · `i.ytimg.com` · `img.youtube.com` · `s.ytimg.com` · `yt3.ggpht.com` · `googlevideo.com` · `rr1---sn-a5mekn6d.googlevideo.com` · `www.google.com` · `play.google.com` · `static.cloudflareinsights.com` · `www.googletagmanager.com` | **blocked** — `curl: (56) CONNECT tunnel failed, response 403`; the proxy log says "gateway answered 403 to CONNECT (policy denial or upstream failure)" |

The site itself loads no third-party script, font or image (every `src`/`href` to another host on a product page is a
link: `lin.ee`, `www.youtube.com`, the maker's site) — so today the live site renders fully from `okami24.store` alone.

**Chromium on the live site**: `shot.js https://okami24.store/…` renders Chrome's "Your connection is not private"
page. The session's egress proxy re-signs TLS with its own CA; curl/node trust it through the CA bundle, but
Chromium on Linux trusts only its root store + the user NSS database, and `/root/.pki/nssdb` holds **0 certificates**
(the proxy README says the browser NSS store is set up; in this container it is empty). A script-side workaround was
refused by the session's safety check and was **not** pursued. So: live-site reading with curl = yes · live-site
screenshots and the `okami24_locale=en` visible-text check = **not possible from the cloud yet**.

## Batch 4 — tier-b-proof rehearsal on round data 2 (known answer)

Before = `0ef8c0f` (the commit round data 2 opened on, HANDOFF §3) · after = `08ed625` (its close, tag `data-facts-2-done`).
Both built in worktrees in the cloud (20 s / 24 s). Sample 41 pages × th/en/zh × 390/1440 = 246 files per side, 266 s /
270 s, 0 failed pages. `diff`: "environment: same machine (cloud-linux-chromium) + browser + font fingerprint on both
sides" · 573 changes in 189 groups · one-side files 0.

| Page(s) | What round data 2 reported (HANDOFF §3 · tools-round known-answer test) | What the cloud saw | Match |
|---|---|---|---|
| coil-1 | phone card prints its option text when the spec line is empty | "2 ค่าโอห์ม" added at 390 (card) | yes |
| coil-38 | same | "4 ค่าโอห์ม" added at 390 | yes |
| coil-72 · coil-94 | same (fallback text) | card rows "4 ค่าโอห์ม" / capacity rows appear on listing + related cards | yes |
| iqosheet-18 | same + 2380mAh dropped | "2380mAh → 3 สี" at 390 · "แบต 2380mAh" removed at 1440 · Pocket Charger / Holder rows added | yes |
| coil-55 · coil-68 · coil-54 | one maker capacity fact each (2mL / 3.5mL / 2mL) | "ความจุ 2mL" (coil-55, coil-54) · "3.5mL (รุ่นมาตรฐาน) เติมด้านบน" (coil-68) + spec section added | yes |
| iqosheet-16 | card drops bare 2380mAh, Pocket Charger 2700mAh / Holder 300mAh rows | "2 สี" shown at 390 · battery rows changed to Pocket Charger 2700mAh / Holder 300mAh | yes |
| coil-87 | "magnetic"/แม่เหล็ก claim cut | "การเชื่อมต่อ · แม่เหล็ก" removed | yes |
| — | tools round (on the computer): **10** Thai strings shown to en/zh visitors on coil-54/55/68 + iqosheet-16/18 | **10** distinct Thai strings on en/zh, same 5 pages (ความจุ · คอยล์ในกล่อง · หัวพอตเปล่า ใช้กับคอยล์ SPL10 / ITO · 3.5mL (รุ่นมาตรฐาน) เติมด้านบน · ใช้ได้กับ · แบตเตอรี่กล่องชาร์จ (Pocket Charger) · 2700mAh ชาร์จเต็มประมาณ 135 นาที · แบตเตอรี่ตัวสูบ (Holder) · ผ่านสาย USB-C (มีในกล่อง)) | yes |
| untouched: `/`, pod-systems, pod-kits, disposables, caliburn-g4-classic, zero-pro, pod-180, 7 brands, 2 guides, 2 technology, faq, about (20 pages) | nothing | **0 changes** on every one | yes — no false difference |

All 9 answer-set slugs found, 0 missed, 0 false changes. The other groups (the same capacity/resistance rows on
`/products`, category and brand listings, and in related-product cards on sibling coil pages) are the same card changes
seen where those cards are listed.

## Round close — full verify set in the cloud (round-close step 3, HEAD before this docs commit = `1829e26`)

| Check | Exit | Time | Last line |
|---|---|---|---|
| `tsc` | 0 | 3s | (no output = no type error) |
| `eslint` (11 scripts touched) | 0 | 5s | (no output = 0 problems) |
| `verify-commerce` | 0 | 3s | All 17 checks passed. |
| `verify-catalog-full` | 0 | 76s | All 30 step(s) passed. |
| `count-storefront` | 0 | 1s | STOREFRONT buyable: 53 |
| `i18n` | 0 | 1s | All 16 checks passed. |
| `raw-chars` | 0 | 0s | raw NBSP/U+2060 in source: 0 |
| `content-dates-check` | 0 | 1s | content-dates.json is current (55 paths) |
| `eol-check` | 0 | 1s | eol-check: OK |
| `rules-move-check` | 0 | 0s | PASS |
| `central-rules-copy` | 0 | 0s | PASS (local checks only — remote comparison SKIPPED) |
| `owner-rules-check` | 0 | 0s | PASS |
| `scan` | 0 | 1s | PASS 0/104 |
| `og-gate` | 0 | 1s | PASS share-card gate: 104/104 pages carry their own card |
| `font-check` | 0 | 6s | font-check: PASS 3/3 · machine cloud-linux-chromium · Chrome/141.0.7390.37 · expected Thai font "Noto Sans  |

Test server: started from the snapshot for `scan` / `og-gate` / `font-check`, then `test-server: stopped PID 3265 on 3412`. Secret scan of `git diff f1eefd6..HEAD` (16 files at that point; patterns: GitHub/Slack/AWS tokens, private-key headers, Render deploy-hook URLs, password/token assignments, Bearer values) = **0 hits** — run after the first pushes, not before (the instruction asked for before; reported). `git diff --stat f1eefd6..HEAD -- src public` = **empty**.
