@AGENTS.md

# Business context

This project is being converted from the NOVA VAPOR demo into the production website for
**OKami24**. Before making any production/business/architecture decision (catalog data
model, pricing, stock, checkout flow, customer accounts, etc.), read
[docs/BUSINESS_SOURCE_OF_TRUTH.md](docs/BUSINESS_SOURCE_OF_TRUTH.md) — it is the
authoritative source for brand, product-source-of-truth, pricing authority, stock policy,
payment model, and known TBDs. Do not infer or invent business rules; if something isn't
covered there, treat it as unresolved rather than guessing.

**Catalog completeness rule (owner, 2026-09-06):** every product must show **every colour and every
flavour the manufacturer offers, even ones the shop has no stock of**. Never drop a colour/flavour/image
because "we don't sell it" — stock, "Sold out" and greyed-out states are the cart/stock system's job
later, not a reason to cut catalog truth. Image standards live in `docs/IMAGE_SPEC.md`.

If instructions conflict, resolve in this order: (1) the current user's explicit
instruction, (2) `docs/BUSINESS_SOURCE_OF_TRUTH.md`, (3) this file, (4) implementation
assumptions. Never silently overwrite business rules in the source-of-truth doc.
