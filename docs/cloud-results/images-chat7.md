# Images chat 7 (30–31/10) — hand-over notes

Child chat of the main chat (Friday). Everything below was checked against git / the live site when written (31/10).

## Shipped
| PR | What | Credits | State |
|---|---|---|---|
| #1048 | SKE Crystal B20000 — 8 flavours re-shot as edits of the Grape Yoyo scene, one shared matte, Double Mint listed | 14 | merged ccdb85da, live |
| #1055 | Caliburn G3 Pro KOKO re-centred (stray specks in 7 sources) · INFY PLUS 2.5 ml 18 flavours relabelled onto the Strawberry photo | 0 | merged 0b610ea7, live |
| #1066 | Nexswitch 16K kit (10 colours + card) · MQ Bar 22K (11 + card) · Marbo 10K lookalike (10 + card) — one-scene re-shoots | 68 | merged a234a084, live |
| #1070 | Marbo 10K lookalike back to the shared SALTHUB M Bar 10K photos (owner 31/10 rejected the re-shoot) | 0 | in review at writing |
| #1067 | KS / kardinal Quikpro 15K pod — 15 boxes straight-on from one scene + same pod | 30 | held: owner checks the comparison sheets first |

Credits: owner yes in the images chat 30/10 "อนุมัติไม่เกิน 106" → 98 used (1591.4 → 1493.4, equals the job count). SKE 14 came before that, from the earlier batch approval.

## Open
- #1067 Kardinal: comparison sheets "maker poster | new photo" per box in the images-6 worktree `_incoming/img-3110/kardinal-compare/` (15 PNG + `_all.jpg`). Merge only after the owner's OK (relayed by Friday). Checker round 1 failed (Grape Lychee pink, pod halo) → fixed in ea0d5a67; round 2 still to run after merging main.
- Marbo 10K lookalike: Watermelon Ice and Mocha Latte have no photo (no real colour source).
- RELX Pod Pro 2: Lime Tobacco, Lemon Zest, Ice Tobacco, Blueberry Splash — no source found (Chrome search chat 5 + web search chat 7).

## Where things are
- Renders: `C:\Users\dhetc\OKami24-assets\2026-10\{ske-crystal,nexswitch-16k-kit,mq-bar,ks-quik,mbar-10k-clone-rejected}` + 53 rows in `manifest.csv` (the Marbo set is marked REJECTED — do not reuse).
- Job ids, scripts (shared matte `smatte.js` / `smatte2.js`, `nex-fix.js`, `ks-rect.js`, `ks-compose.js`, `ks-gl.js`, `relabel.js`, `despeck.js`): images-6 worktree `_incoming/img-3110/`.
- Uploads to Higgsfield: `media_upload` with ≥15 file names saves its answer to a file; PUT each file from that file (a 412 on a second PUT = already uploaded).
- `generate_image` is refused by the auto-mode classifier when the credit approval only arrives through another chat's message — the owner has to type the approval in the chat that spends.

## Test tree
`_incoming/wt-img5` (real node_modules) is the verify tree. On 30/10 21:49 its `node_modules/sharp` and `node_modules/better-sqlite3` were emptied by something outside this chat → `next build` "Can't resolve". Restored with robocopy from the main checkout. Before trusting a failing build there: `ls -A node_modules/<pkg>`.
