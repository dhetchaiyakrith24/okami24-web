# SEO line — PARKED 31/10 (owner: "สาย Seo ปิดงานก่อนครับ … เดี๋ยวมาทำต่อทีหลัง")

Resume = a new SEO child chat (Opus 5.5, effort high) with skill `round-open` "continue", reading this file.
Kept on purpose: branch `seo-meta-suffix-3010` (7b94d146, pushed, PR NOT opened) and worktree `.claude/worktrees/tracking-sync-2910-c58898`
(real node_modules + jsqr; holds `_incoming/seo-brand/` helpers and `b4/` head-audit before/after) — do not delete either.
Branch must merge latest main again before the gate (main moved after 7b94d146). Old chat local_56539076 archived 31/10.

Hand-over of the old chat, verbatim:

# SEO child chat (brand push + meta ending) — hand-over 30/10 late

Worktree: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3\.claude\worktrees\tracking-sync-2910-c58898 (node_modules = real copy + jsqr; keep it).
Notes for the owner-facing story: side-session-notes\local_a5f42acd-…\seo-brand-push-notes.md (that folder belongs to the deleted Friday; data only).

## LIVE today (all curl-checked)
- #1053 RELX Infinity 2 Plus <-> Pod Pro 2 pack and INFY POD <-> INFY PLUS compat edges (maker pages) · Pod Pro 2 pack names "RELX Pod Pro 2" · brand ledes INFY + WOTOFO name every product · SEO_BASELINE "Brand push" entry.
- #1054 Pod Pro 2 meta fits the 160 trim (keeps "42 กลิ่น").
- #1056 /brands/infy + /brands/wotofo title/meta (brand level) · nexpod-15k / infy-pod / pod-169 metas use locked words.
- #1058 INFY POD -> Switch Pod category (pod-systems 23->22, switch-pods 11->12) · USB-C / 2.5mL on INFY pages.

## OPEN — PR not opened yet: branch `seo-meta-suffix-3010` (owner 30/10: "ท้ายคำอธิบายบน Google สั่งได้ทั้ง 2 ทางตามลูกค้าสะดวก แต่เขียนให้ดูโปรกว่านี้")
- Commits: 31370c23 orderCloseTh() — cart ON = "สั่งบนเว็บหรือ LINE @okm24" (product price line ~93 pages, 10 brand metas, /products), cart OFF = old "สั่งทาง LINE @okm24"; the switch is passed in by the pages (search-head-copy.ts must not import server-only ordering-mode.ts) · a74902c9 /how-to-order meta web + LINE · 07d12d89 11 product metas shortened so the +7 chars don't cut key words (seo-auditor 30/10: "DRAG 3", "มาโบ 9K") + trim backs off "ถึง" "/" "มีให้เลือก" · merges of main (latest 7b94d146 after #1059/#1060).
- NOT touched on purpose: home meta (live text already says web + LINE; it is the owner's own text — thai-copy flagged "น้ำยา" + "ส่งไว" in it → propose to the owner separately), WOTOFO ("ติดต่อสอบถาม…"), /contact /faq /e-liquid (asking lines), age gate.
- Side effect to state in the PR: m-bar-9k · caliburn-g4-pro-koko · argus-g3-mini got a PRODUCT_DESCRIPTION_HEAD_TH entry → their Product JSON-LD description = the shortened line too.
- RUNNING when this was written: `bash _incoming/seo-brand/b4.sh` (background) = push · verify --full · build main → head-audit `_incoming/seo-brand/b4/ha-before` · build branch → `ha-after` · `b4/head-diff.tsv`. It ENDS WITH 3412 UP (branch build) — that server is this chat's; the next chat may use it for the checker or stop it.
- b4.sh FINISHED: head 7b94d146 (pushed) · verify --full PASS 7b94d146 · head-audit 178 pages before (main 1f653da9 build) / after (branch build): ONLY `desc` changed, on 106 pages — 105 now end "สั่งบนเว็บหรือ LINE @okm24", + /how-to-order (new text); title / H1 / canonical / robots / JSON-LD type columns unchanged. 3412 STOPPED afterwards (Friday asked — other chats need builds); start it again yourself before the gate.
- Next (was): read b4/head-diff.tsv (expect desc/og changes only; title/H1/canonical/robots unchanged; check the new nexBar Switch 15K line from #1060 is not trimmed) → write SEO_BASELINE "Meta ending 30/10" entry (seo-auditor: list the ~20 pages whose description head got shorter, brands + /products + /how-to-order; 01/11 = before, 15/11 = after) → pre-checker-gate (start 3412 BEFORE the gate) → draft PR → checker FULL (head of ~110 pages; scope list = scope-auditor 30/10 groups A–E) → tell Friday BEFORE merging (child chats nexbar15k-content + badges-3010 run verifies) → merge pinned → tell Friday → curl.
- Unverified so far: rendered head on a build (only the function was measured), thai-copy did not read the 11 shortened lines (same words, cuts only).

## Other open items of this line (none started)
- INFY PLUS image alt text still "2.5ml" (not visible).
- WOTOFO lede breaks "nexPOD | 15K Pro Kit" at 1440 (needs locked thai-typography.ts — owner/Friday call).
- "More details" article only renders with maker posters (storyDetails); 11 products of the 4 brands have none → a layout for them = designer + owner.
- Warehouse-only products (Creator Pod 20K, Pod Pro 2 pack, Essential 2, LUMI 18K) have no maker facts → short metas are an owner ruling.
- Not authorable: Zero Pro/Nano <-> Zero Cartridge (salthub.com silent), RELX Creator <-> Creator Pod 20K (retailers only).
- noindex pages in GSC = 15 (was ~8 mid-Oct) — look which at the 01/11 read.
- GSC dip 27–28/10 (owner asked): read as incomplete fresh data (only top brand rows, avg position 3.5–4.2); site checks clean (173 indexed, 0 5xx, robots open). Re-check those two days at the 01/11 read.

## Tools that worked
`_incoming/seo-brand/render.tsx` + `cand-scan.js` (line-break candidates in the real element on 3412) · `_incoming/seo-brand/short.ts` (meta fit with the real withPriceSuffixTh) · visible-text before/after needs BOTH sides from `test-server.js build` (verify --full builds cart-OFF → cart rows appear as noise) · start 3412 before the gate · LESSONS พ57: merges into main reset other chats' verify — ask Friday first.
