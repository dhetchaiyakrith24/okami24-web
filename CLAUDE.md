@AGENTS.md

# Business context

This project is being converted from the NOVA VAPOR demo into the production website for
**OKami24**. Before making any production/business/architecture decision (catalog data
model, pricing, stock, checkout flow, customer accounts, etc.), read
[docs/BUSINESS_SOURCE_OF_TRUTH.md](docs/BUSINESS_SOURCE_OF_TRUTH.md) — it is the
authoritative source for brand, product-source-of-truth, pricing authority, stock policy,
payment model, and known TBDs. Do not infer or invent business rules; if something isn't
covered there, treat it as unresolved rather than guessing.

If instructions conflict, resolve in this order: (1) the current user's explicit
instruction, (2) `docs/BUSINESS_SOURCE_OF_TRUTH.md`, (3) this file, (4) implementation
assumptions. Never silently overwrite business rules in the source-of-truth doc.
