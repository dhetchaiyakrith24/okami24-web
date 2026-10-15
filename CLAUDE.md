@AGENTS.md

@.claude/TEAM_RULES.md

@.claude/memory/MEMORY.md

Rules: web team rules = `.claude/TEAM_RULES.md` (imported above — its head also maps where every kind of thing lives) ·
central rules §5–12 = the copy `.claude/rules/central-rules.md` (auto-loaded; never edit it by hand).

`AGENTS.md` (line 1, rewritten by `next dev`) binds only when code under `src/` changes. If `next dev` rewrites it, commit that
as its own `chore` commit, never inside a feature commit (this wins over its last sentence, which cannot be edited).

# Business context

This project is being converted from the NOVA VAPOR demo into the production website for
**OKami24**. Before making any production/business/architecture decision (catalog data
model, pricing, stock, checkout flow, customer accounts, etc.), read
[docs/BUSINESS_SOURCE_OF_TRUTH.md](docs/BUSINESS_SOURCE_OF_TRUTH.md) — it is the
authoritative source for brand, product-source-of-truth, pricing authority, stock policy,
payment model, and known TBDs. Do not infer or invent business rules; if something isn't
covered there, treat it as unresolved rather than guessing. The file stays in git; **never add another copy of it (or of
the owner's backups that hold customer data) to git** (removing it from history would need a force push).

**Catalog completeness rule (owner, 2026-09-06):** every product must show **every colour and every
flavour the manufacturer offers, even ones the shop has no stock of**. Never drop a colour/flavour/image
because "we don't sell it" — stock, "Sold out" and greyed-out states are the cart/stock system's job
later, not a reason to cut catalog truth. Image standards live in `docs/IMAGE_SPEC.md`.

If instructions conflict, resolve in this order: (1) the current user's explicit instruction in chat (a method the owner dictates is read as a goal: object in one
line first, then take the better way unless the owner says "as told" — TEAM_RULES 13.8),
(2) the rules — central §5–12 and `.claude/TEAM_RULES.md`; the team rules add web detail and may not contradict the
central rules except on a line that names the central item it replaces ("แทนกฎกลาง …"), (3)
`docs/BUSINESS_SOURCE_OF_TRUTH.md` — a conflict with it is not resolved silently, it is a stop-and-ask case (13.3 #3),
(4) `docs/THAI_STYLE.md` for anything about Thai wording on the site, (5) this file, (6) implementation assumptions.
Never silently overwrite business rules in the source-of-truth doc.
