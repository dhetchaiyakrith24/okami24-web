# OKami24 — Business Source of Truth

This document is the authoritative business context for the OKami24 website project
(current codebase: NOVA VAPOR demo, being converted to OKami24 production). Every Claude
Code session doing production/business/architecture work on this project must read this
file first, rather than guessing or inferring business rules from code, prior demo
content, or general vape-industry assumptions.

**Status:** living document. Sections marked TBD are explicitly unresolved — do not fill
them in with invented values. When new business facts are confirmed by the owner, update
this file rather than letting the knowledge live only in chat history.

---

## 1. Brand

- **Brand name:** OKami24
- **Short mark:** OKM

**Positioning:**
- Premium
- Trusted
- Bold
- Technology-oriented
- Genuine products
- Curated by experienced seller
- Fair / transparent pricing
- Service-first

**Primary slogan:**
> "OKami24 — ของแท้ ราคาตรง บริการจริง"

**Brand promise:**
> "การบริการที่ดี คือสิ่งที่ OKami24 มีให้คุณ"

---

## 2. Brand Visual Identity

The current NOVA VAPOR visual design is **approved**. Do not redesign it from scratch —
the production OKami24 direction evolves from this existing design, it does not replace it.

**Color hierarchy:**

| Role | Color |
|---|---|
| Foundation | Graphite / Charcoal / Near-black |
| Primary brand identity | **OKami Red** |
| Secondary energy / interaction accent | Existing Ember Orange |
| Content | White / Off-white |
| Technical information | Steel / Neutral gray |

**Rule:** Red identifies OKami24. Orange provides energy and interaction. Red and orange
must not compete equally — red is the brand identifier, orange stays a secondary accent.

The current premium dark-tech character must be preserved.

Logo assets are supplied separately by the owner. The primary production logo uses the
**RED OKami variant**.

---

## 3. Social / Contact

- **LINE OA:** `@okm24`
- **LINE link:** https://lin.ee/QNJWw6o
- **Primary YouTube:** https://www.youtube.com/@OKMYARZ
- **Email (official written channel):** okamisalt@gmail.com — owner 2026-09-06 (answer 8). Shown on
  the contact page next to LINE. Use for documents, PDPA requests, anything that needs a paper trail.

**Primary customer communication channel:** LINE OA — **answered every day, 24 hours** (owner
2026-09-06, answer 7). Customer-facing wording may say "ทักได้ทุกวัน ตลอด 24 ชั่วโมง"; it must not
promise a reply within N minutes.

---

## 4. Product Source of Truth

Different sources serve different responsibilities — do not conflate them.

### Official Manufacturer
**Purpose:** verified specifications, compatibility, official technology information,
official product imagery.

### Vapenow — https://www.vapenow.shop/
**Purpose:** supplier/product ecosystem reference, product availability reference, price
reference.

**Important:** the public Vapenow website does **not** necessarily show every product
available to OKami24. Do not treat the public Vapenow catalog as the complete OKami24
catalog.

### Shipnity
**Purpose:** operational stock / availability, order operations, tracking, warehouse-facing
workflow. Shipnity stock is considered reasonably real-time.

**Important:** Shipnity is **not** the complete product-content master. It does not contain
enough detailed variant/product presentation data for the website.

### OKami24 Product Master
This must become the website's main commerce/catalog data layer for:
- customer-facing product name
- product description
- selling price
- variants/options
- imagery
- SEO
- recommendation metadata
- compatibility
- cross-sell
- merchant knowledge

---

## 5. Pricing

**Price references:** Vapenow, existing OKami24 pricing.

**Final selling price authority:** Owner.

- Do NOT automatically assume Shipnity price is the website selling price.
- Do NOT automatically publish supplier price changes.
- Owner approval is the final gate for selling-price changes.

---

## 6. Stock Policy

Shipnity is the operational stock reference.

- If stock > 0: product can show available status.
- If stock = 0: **do not** delete or hide the product page. Show `"สินค้าหมด"` with a
  `"สอบถามทาง LINE"` CTA.

Preserve the product page for customer information, SEO, alternatives, and future restock.

---

## 7. Product Variants

Shipnity may provide selectable color/options operationally, but it does **not** currently
act as a sufficiently detailed variant master for the website.

The OKami24 Product Master must eventually support variants such as: color, resistance,
flavor, size, and other product-specific options.

**Do not invent variants.** Variants must be verified from actual product/supplier/
operational information.

---

## 8. Sales Channels

**Current:**
- Website → customer discovers product → contacts LINE OA → admin assists → order
- YouTube → customer discovers product → contacts LINE OA → admin assists → order

**Target:**
- Website → customer browses products → chooses product → cart/order flow → admin verifies
  order/payment → approved order flows toward warehouse operations

LINE remains an important support/sales channel — it is not being replaced.

**Order-channel rule (owner 2026-09-06, answer 18) — supersedes the 2026-09-06 morning rule
"never bring 'order via LINE' back":**
- **Website = primary order channel.** The primary button on every product stays "add to cart".
- **LINE = secondary (backup) order channel.** Product pages carry one small line under the cart
  button: "หรือสั่งทางไลน์ @okm24". Service pages say the same in one sentence — LINE is *also*
  a way to order, not the main one. Admin opens the order and sends the customer their order
  status link.
- Do not present LINE as the main way to buy, and do not remove the cart/checkout flow.

---

## 9. Payment Model

**Current payment:** bank transfer / standard QR payment. No COD.

**Important:** payment is **not** automatically considered confirmed merely because the
customer says they paid.

**Target order status** should support at least:
1. Pending payment
2. Payment submitted
3. Awaiting admin verification
4. Approved
5. Processing
6. Shipped
7. Completed
8. Cancelled

Do not implement payment automation yet.

**Receiving account (owner 2026-09-06, answer 1):**
- Bank: **Kasikornbank (KBank)** — read from the owner's PromptPay QR image (K+ branding);
  account name **นาย จีระศักดิ์ เกษมสวัสดิ์** (also read from that image); account number
  **153-8-29240-7** (owner typed `153-8-292407`; same digits, KBank grouping).
- Payment methods: bank transfer to that account, or the owner's **PromptPay QR** (file kept
  outside `public/` at `.data/private/promptpay-qr.png`, served only through the order page).
- **QR file = the QR square only, cropped (owner 2026-09-06).** The owner's original was a full
  PromptPay slip; its blue header, logo and four text lines ate over half the frame, and the
  masked account number printed on it (`xxx-x-x9240-x`) contradicted the full number in the table
  above it — "ลูกค้าจะลังเล". Cropped to 500×500 with a quiet zone; the untouched slip is kept
  beside it as `.data/private/promptpay-qr-fullslip.png` so this is one file-copy to undo.
  **Not owner-approved yet: the owner will scan the cropped code with a phone before it counts as
  passed.** If it does not scan, restore from the backup file.
- **Visibility rule:** the account number and QR are shown **only on the order status page of a
  placed order that is still awaiting payment** — never on public pages, never in the how-to-order
  page, never in the client-side dictionary. Public pages may say "bank details appear on your
  order page after you place the order".
- Source of the lines above: owner chat message 2026-09-06 (account number, "ไม่โชว์ Public จนกว่าจะ
  ถึงขั้นตอนสุดท้ายของการสั่งซื้อ") + the QR image attached to it.
- **Owner verified these details against the bank and confirmed them correct on 2026-09-06** —
  bank, account name and account number are settled, not inferred.

**Phone verification (OTP) — SWITCHED OFF, owner decision 2026-09-06:**
> "OTP: ปิดชั่วคราวตอนเปิดขาย ไม่ต้องต่อ SMS … เปิดใหม่ได้ทีหลังถ้าเจอออเดอร์ผี"
- At checkout the customer enters a mobile number and continues; **no code is sent and none is
  asked for.** The number still identifies the customer, carries the order, and gives them their
  order-status link.
- The switch is one line: `OTP_VERIFICATION_ENABLED` in `src/lib/commerce/otp-mode.ts`. The whole
  verification path (hash+salt, 5-minute expiry, attempt cap, hourly rate limit) is left intact —
  **set it to `true` to turn verification back on**, nothing else changes.
- **Trigger to turn it back on:** fake/ghost orders start appearing (owner's own condition).
- **What this costs:** a phone number at checkout is no longer proved to belong to whoever typed
  it. The compensating control is the one that already exists — payment is verified by a human
  before anything ships ("จ่ายแล้ว ≠ ยืนยัน", above).
- Customer-facing copy was corrected to match (how-to-order step 3 + the checkout form in th/en/zh)
  — the site must never say a code will be texted while this is off.

**Cancellation / refund (owner 2026-09-06, answer 2):** a customer may cancel **before
transferring**. **After the transfer there is no cancellation and no refund.** Say this on the
how-to-order page and on the order page next to the bank details.

---

## 10. Shipping

- **Standard shipping fee:** 60 THB
- **Free shipping threshold:** 500 THB
- **Cut-off (owner 2026-09-06, answer 3):** orders with payment made **and reported before 15:00**
  ship the same day; later ones ship the next working day. (The owner wrote "สั่งก่อน 15:00"; the
  site phrases it as "โอนและแจ้งชำระเงินก่อน 15:00" because nothing ships before the admin has
  verified the payment — see §9. If the owner meant "order placed before 15:00", change both.)
- **Delivery time (answer 3):** 1–3 days after dispatch.
- **Shipping days (answer 4):** Monday–Saturday; no dispatch on Sundays and Thai public holidays.
- **Carriers (answer 5):** Thailand Post (EMS) and Flash Express — chosen per destination. No
  rule yet for which carrier goes where; do not invent one.
- **Coverage (answer 6):** Thailand only. No international shipping.

Customer-facing messaging should emphasize fast dispatch and tracking provided. Do not
expose unnecessary internal warehouse or logistics details in customer-facing content.

---

## 11. Customer Account

A customer account is required for the target production experience.

**Initial required customer identity field:** phone number.

Do not collect unnecessary personal information.

**Future account capabilities** (implement only when approved): order history, favorites,
addresses, tracking, product interests.

**Personal data (PDPA) — owner 2026-09-06, answers 9–11:**
- **Retention:** order and address data are kept **1 year**, counted from order completion, then
  deleted. Customers may ask for earlier deletion via LINE or email.
- **Data controller:** the shop **OKami24** (no legal-entity name given — do not invent one).
- **Official channel for data requests:** email okamisalt@gmail.com (LINE accepted too).
- **DPO:** none.
- Still open (not answered, keep as a LAUNCH_AUDIT item): whether the shop is registered for
  e-commerce and what seller details Thai law then requires on the site.

---

## 12. After-Sales / Trust

OKami24 provides a **7-day claim window** when a product has a problem.

**Requirement:** customer must provide an unboxing video as evidence.

Before publishing final wording, the exact claim policy should be reviewed so the website
promise does not exceed actual operations. Use this policy as a major Trust / Service
differentiator.

**Claim policy details (owner 2026-09-06, answers 13–17):**
- **Outcome of an approved claim (13):** replacement with the **same item**. If it is out of
  stock, the customer picks **another item of the same price**. **No cash refund**, ever.
- **Shipping costs (14):** the customer pays to send the item back; the shop pays to send the
  replacement.
- **Return (15):** the item **must** be sent back in every approved case. Admin gives the return
  address **on LINE after approval**. **The return address is never shown on the website.**
- **Decision time (16):** within **3 working days**.
- **Factory warranty (17):** none. Claims are handled by the shop only.
- **Which faults are covered (owner ticked 2026-09-06, PAGE_COPY item 12 — `1ก 2ก 3ก 4ข 5ข 6ค 7ข`):**

  | # | Symptom | Answer |
  |---|---|---|
  | 1 | Wrong model / colour / flavour vs what was ordered | **covered** |
  | 2 | Dead on arrival — won't switch on, won't charge | **covered** |
  | 3 | E-liquid leaking or seeping while still unused | **covered** |
  | 4 | Dented box but the product works fine | not covered |
  | 5 | Dropped, water damage, misuse | not covered |
  | 6 | Breaks after a while of use | **case by case, only inside the 7-day window** (owner's note: "รับภายใน 7 วันนับจากวันได้รับของ") |
  | 7 | Doesn't like it / changed mind / wants another flavour | not covered |

  This list is the whole policy — do not add symptoms to it, and do not soften a "not covered"
  line on the website.
- **Published at /warranty on 2026-09-06** (owner wording), linked from the footer help column,
  the shipping page and the sitemap. The old `/preview/claims-policy` draft route is deleted.

---

## 13. Team / Operations

- **Admins:** 2. Current responsibilities: customer chat, order handling, stock checking
  through Shipnity, tracking updates.
- **Fulfillment / packing:** handled by external warehouse after the order is entered into
  the operational workflow.
- **Owner:** content, final pricing decisions, business direction.

**Primary automation target:** remove duplicate manual order entry.

**End-state goal:** website order → admin verifies order + payment → admin approves →
order flows to warehouse/operational system, without manually re-entering the same order
data.

---

## 14. Customer Profile

Customers include both beginners and experienced users.

**Typical budget:** 500–2,500 THB.

**Major purchase reasons:** product desire/interest, good service, long-standing trust in
the seller.

**Common concerns:**
- how long shipping takes
- whether the product is good
- whether OKami24 will take responsibility if something goes wrong
- fear of non-delivery
- fear of scams

Service responsiveness is believed to be a major purchase factor.

**Repeat purchase split:** approximately 50/50 repeat vs. non-repeat.

**Common cross-sell:** Device → E-liquid. Disposable → usually no associated repeat
consumable purchase.

---

## 15. Merchant Product Knowledge

This is the seller's own operational/experiential knowledge — keep it explicitly separate
from official manufacturer specifications (see rule at the end of this section).

**Real best sellers:**
- Esko Bar Switch 20K
- Relx Connector 20K
- M Switch 15K

**Customer favorites:**
- Nexbar Clear 18K
- Marbo 10K

**Beginner friendly:**
- Marbo 9K
- Marbo 10K

**Higher problem rate:**
- Muro Space 15K

**Not recommended:**
- Muro Space 15K — reason: stock may have been held for a long time.

**Repeat consumable opportunity:**
- Caliburn G4 Pro
- VOOPOO Pro 2

**Good on paper but less impressive in real use:**
- VOOPOO VMATE i3

**High margin products:** TBD

**Rule:** treat merchant knowledge separately from manufacturer specifications. Never
present subjective merchant experience as official manufacturer fact.

---

## 16. FAQ Knowledge

Customers frequently ask:
- รุ่นนี้ใช้หัวอะไร
- coil ไหนเหมาะ
- ต่างกับอีกรุ่นอย่างไร
- battery อยู่ได้นานไหม
- มีสีอะไร
- ใช้น้ำยาอะไร
- ดูแลอย่างไร
- ของแท้ดูอย่างไร
- ส่งกี่วัน
- ใช้ดีไหม
- ถ้าสินค้ามีปัญหารับผิดชอบไหม

These should later feed: Product FAQ, Buying guides, Finder, Compare, Customer support
content.

---

## 17. Cross-Sell Logic

Future recommendation system should support relationships such as:
- Product → Compatible pod
- Product → Compatible coil
- Device → Suitable e-liquid category
- Product → Relevant accessory
- Out-of-stock product → Alternative product

**Do not create arbitrary relationships.** Cross-sell must be supported by verified
compatibility or merchant knowledge.

---

## 18. Automation Priorities

**Highest operational automation priority:** website order → admin verification →
warehouse/operational workflow, without duplicate manual data entry.

**Future automation candidates:**
- stock synchronization
- low-stock alerts
- tracking updates
- order notifications
- product availability
- image optimization
- sitemap generation
- monitoring
- backup

---

## 19. Unknowns / TBD

Explicit unresolved items — **never invent answers for these**:

- High-margin products
- Exact production database/backend
- Shipnity integration mechanism/API availability
- Final authentication implementation
- Final payment implementation (automation / slip verification — the receiving account itself is
  resolved, see §9)
- E-commerce registration / legally required seller details (§11)
- SMS provider — still unchosen, and no longer blocking: OTP is switched off for launch (§9)
- Final Product Master schema
- Exact warehouse integration
- Complete product/variant dataset

**Resolved on 2026-09-06 — no longer unknowns:**

- **Domain: `okami24.store`** — bought by the owner, registered and managed at Cloudflare (the
  same account as `okami-pod.com`). This is the production domain; `SITE_URL` is set to
  `https://okami24.store` everywhere. The earlier `https://okami24.co` in verify scripts was a
  placeholder and has been replaced.
- **Hosting: Render, Singapore region**, one Starter instance with a persistent disk, chosen by
  the owner after comparing Railway, Render and a Vultr VPS against his own criteria (easy for a
  non-coder · safe long-term with nobody administering a server · fast for Thai customers · good
  for SEO). Not yet signed up for at the time of writing — the account, the card and the DNS are
  the owner's steps, written out in `docs/DEPLOY-RENDER.md`.

---

## 20. Website Language (owner rule, 2026-09-06)

Recorded on the owner's instruction. The **default-language rule below is implemented and
verified**; the wording rules under it are still the brief for the "Thai language pass" item in
`docs/LAUNCH_AUDIT.md`.

### The permanent rule: Thai is the site's default (owner decision, 2026-09-06)

**Thai is what every visitor gets, everywhere, on every page, on a first visit — no exceptions and
no conditions.** This is a standing rule, not a phase: a future session may not make the language
depend on the visitor again.

- **The site never guesses.** It does not read the visitor's country (no `cf-ipcountry`, no
  `x-vercel-ip-country`, no geo-IP service) and does not read the browser's `Accept-Language`.
  The guessing code — `src/proxy.ts` and `src/i18n/detect-locale.ts` — was **deleted** rather than
  pointed at the new host's header, on the owner's instruction: "ยิ่งน้อยยิ่งพลาดยาก". A contract
  test in `src/i18n/i18n-contract-test.ts` fails the build if geo detection reappears.
- **The language button stays visible** on every page (header, all widths) so foreign visitors can
  switch themselves. Thai customers are the business; other languages are a courtesy.
- **A visitor's own choice is remembered** for a year, site-wide, in the `okami24_locale` cookie,
  and a redeploy never resets it.
- **Search engines read the site in Thai**: the server renders `<html lang="th">` and Thai text
  into the static HTML, and a crawler sends no cookie. Verified 2026-09-06 by fetching `/`,
  `/products` and `/warranty` as Googlebot — `lang="th"` on all three, and 1,611 / 3,219 / 3,414
  Thai characters in the HTML respectively (evidence in `_incoming/qc/2026-09-06-lang/`).
- Implemented in `src/i18n/config.ts` (`DEFAULT_LOCALE = "th"`) and `src/app/layout.tsx`.

### How the Thai itself must read (still the brief for the language pass)

- **Never translate into Thai:**
  - **Category names** — every category, e.g. Pod System, Disposable Pod, Pod Kit, Coils &
    Accessories, HNB Devices, HNB Sticks, E-Liquid.
  - **Product names and model names** — e.g. ARGUS G4, Caliburn G4 Pro, RELX Smash Go 12K.
  - **Trade terms the Thai vape market uses in English** — Coil, Pod, Nicotine, Puffs, mAh, Mesh.
- **Never transliterate a term Thai customers don't actually say** (e.g. writing "ดิสโพส" for
  disposable). If there is no Thai word real customers use, keep the English word as-is.
- Everything else that a customer reads — sentences, explanations, buttons, help pages — should
  read like natural spoken Thai, not translated-from-English Thai.
- The owner reviewed the five service pages on 2026-09-06 and **approved them as published**, while
  noting the Thai still reads stiff in places; rewriting that copy is the separate language-pass
  job above, not a reason to hold the pages back.

---

## 21. Product / Flavour Decisions (owner, 2026-09-06)

Answers given while the image work was being planned. **Nothing has been built from these yet** —
they are the brief for the image batches in `docs/LAUNCH_AUDIT.md`.

### Esko Bar Switch 20K (`pod-159`) — expand to the manufacturer's full 20 flavours
- The manufacturer's own site (`eskobarvape.com/product/pod-system/`) lists **20 flavours** with a
  clean per-flavour photo each (single black pod, flat white background, no watermark). Our data
  currently carries **2** (Cool Mint, Cola).
- **Owner decision: add all 20**, under the standing catalogue rule "show every flavour the maker
  offers even with no stock". Flavours with no stock get the greyed-out / sold-out treatment
  (`src/data/stock/sold-out.ts`) — they are not dropped.
- This is the one sanctioned exception to IMAGE_SPEC §5 ("do not add flavours yourself"): the
  owner asked for it explicitly, so add them; do not invent names beyond the manufacturer's list.

### M Bar 15K / M Switch Pod — the shop sells BOTH pod types
- **Owner correction to the 2026-09-04 note** (which said only the black COTTON MESH pod is
  stocked): **both the clear pod and the black pod are genuinely sold.**
- Authoritative references, given by the owner — follow how salthub.com itself splits them, do not
  guess which product is which:
  - https://www.salthub.com/m-switch-pod/
  - https://www.salthub.com/m-bar-15k/
- Therefore the clean 15-flavour clear-pod set found on 2026-09-06 **is usable** — these products
  must NOT be marked `[ยังไม่มีรูป]`.
- If the two pages turn out to describe two different products, **split them into two products the
  same way salthub.com does** rather than merging or guessing.
