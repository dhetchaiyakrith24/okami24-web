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

**Slogan and promise approved by the owner on 2026-09-07.** Both are already live (the site title
on every page and the /about hero). Background: the owner's original interview file drafted the
promise as "การบริการที่ดีที่ Okami มีให้คุณ" and asked for a slogan to be written; the two lines above
are the result and are now settled — do not propose alternatives.

> **"The interview file"** referred to in §1, §5, §10, §11 and §12 = the owner's upstream brand
> questionnaire, kept **outside this repo** on the owner's machine at
> `C:\Users\dhetc\OneDrive\Desktop\Run prompt\Backup\1. ตัวตนของแบรนด์.txt` (attached to the chat on
> 2026-09-07 and compared against this document that day). Quotes from it in this document are
> spelling-normalised; the file itself has typos. Where it disagrees with a dated owner decision in
> this document, the dated decision wins.

**Previous website (history only, nothing to do):** https://okmi24.com — the shop's earlier site,
red / white / black colour scheme. Recorded 2026-09-07 so the reference is not lost. It is not a
price source (see §5) and not a design source (see §2).

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

**Which Shipnity (owner, chat 2026-10-08):** only **Shipnity Max** (`app.shipnitymax.com`), the warehouse's own account —
the shop reads it, it does not own it. The old Shipnity (`shipnity.com`) is no longer used ("ตัวเก่าเขาไม่ได้ใช้แล้ว"):
product codes, stock and prices are never taken from it. The business model is dropship: the warehouse holds the stock,
packs and ships, and bills the shop cost per item + shipping on every order (owner, same chat; details and the open
shipping-fee questions: `docs/cloud-results/stock-api-sku-survey.md`, last section).

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
- **The shop's legacy prices are stale (owner, interview file; confirmed 2026-09-07):** the owner
  said the old shop's prices "ไม่ได้อัพราคานานแล้ว". "Existing OKami24 pricing" stays a reference, but
  every one of the 22 legacy prices must be confirmed by the owner before online ordering is
  switched back on — this is criterion 1 of LAUNCH_AUDIT item 44 (the "ข้อมูลสินค้านิ่ง" gate).
- **2026-09-21 — every legacy product now has an approved price, 45/45**
  (`src/data/shipnity-seed/legacy-price-approvals.ts`): 25 basis `"shipnity"` (16 pre-existing rows +
  9 new) and 20 basis `"owner-estimate"`, verified by
  `npx tsx src/data/shipnity-seed/legacy-price-approvals-contract-test.ts` printing "25 shipnity · 20
  owner-estimate". The 20 owner-estimate rows will be overwritten, in that one file, by the real
  supplier price when the stock API arrives. This supersedes the "22 legacy prices must be
  confirmed" bullet above for the 25 Shipnity-basis rows; for the remaining 20 it is partial —
  each now has an owner-approved price, but an estimate, not a supplier-confirmed figure. The
  bullet above is kept as written, not deleted, because it still states the underlying rule
  (owner approval as the final gate).
- **Owner's pricing rule for the 20 estimates (owner, prices round instruction file, quoted
  exactly, 2026-09-21):** "พอตใช้แล้วทิ้งอ้าง vapenow.shop ไม่ต่ำกว่าราคาเขา เลขสวย · pod system ถ้า
  vapenow มีใช้ตามนั้น ไม่มี = ราคาตลาด ±50–100" — the owner ruled the 20 estimates acceptable on
  2026-09-21.
- **2026-10-06 — the admin's current selling prices replace the site's (owner, chat; HANDOFF §18
  "Selling prices"):** the 17-row list the owner confirmed on 2026-10-01 (kept outside git). Applied
  rows carry basis `"owner-confirmed"` in `legacy-price-approvals.ts` (or an "owner override" note in
  `publication-approvals.ts`): an owner-set price that outranks the Shipnity "ราคาขาย" and is **not**
  overwritten by the stock API. The two price files themselves list which rows were applied.

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

> **TEMPORARY EXCEPTION — online ordering switched OFF (owner decision 2026-09-07).**
> Reason, in the owner's words: "ข้อมูลสินค้ายังไม่นิ่ง". While it is off the rule below ("website =
> primary order channel") is suspended, not changed: the catalogue stays fully browsable with
> prices, colours/flavours, specs, images, categories, search and compare; the "add to cart"
> button on every product becomes "สั่งซื้อทางไลน์ @okm24" (opens the shop's LINE and copies the
> product name + selected option to the clipboard); the header's cart icon is hidden; /cart and
> /checkout send the visitor to /products with the note "ตอนนี้สั่งทางไลน์เร็วกว่า ทัก @okm24 ได้เลย".
> Nothing was deleted — the whole cart/checkout code is intact, and the order-status page plus the
> "I have paid" action keep working for orders that already exist (the owner's test order stays).
> Structured data keeps the price and marks offers `InStoreOnly` (owner-approved 2026-09-07).
> Three sentences that said "order on the site" were approved as the only wording exceptions to
> the "do not touch site text" rule (LAUNCH_AUDIT item 30): the site description for search
> engines, the how-to-order page intro, and the "how do I order" FAQ answer — all switch-bound.
> **How to turn ordering back on:** in Render, set `OKAMI24_ORDERING` to `on` (in `render.yaml`
> then merge, since the service is Blueprint-managed) and choose "Save, rebuild, and deploy".
> Code: `src/lib/commerce/ordering-mode.ts`. Tracked as LAUNCH_AUDIT item 43.

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

Do not implement payment automation yet — **one exception (owner 2026-10-07, chat):** a **staff-only slip-check
page** on the site. Staff (who take orders in LINE) upload a customer's slip image; the page asks **EasySlip**
(developer.easyslip.com, the owner's own account — plan **฿350 / 1,000 slips per month**) and shows the bank's
answer: amount, date/time, receiver account (must be the account below), and whether the same slip was already
checked. A **human still approves** every payment — the page never changes an order by itself. Access = **one shared
staff password** (owner pick A); the page is not linked from the site, not indexed, not in the sitemap. The API key
and the staff password live only in the host's secret settings, entered by the owner — never in git or chat.
**Built (#347, 2026-10-07):** `/staff` (404 until the password is set) · a staff session lasts 12 hours · 5 wrong passwords
from one address in 15 minutes (or 30 from anywhere) pause logins for 15 minutes · the page keeps, per checked slip, only the
bank's transaction reference, amount, transfer time, the receiver verdict and when it was checked — no slip image, no names or
account numbers · **the first check of a slip is the verdict; the same transfer checked again is always shown red "already
checked — do not use for a new order"** (owner 08/10 "ผ่านคือผ่าน ไม่ผ่านคือไม่ผ่าน", no "used" button) · the same file
uploaded again is answered from that record (no EasySlip call) when its receiver was the shop's · a slip paid through the
shop's PromptPay QR is recognised by the QR's reference (08/10) · quota shown from EasySlip's own count. Owner setup = `docs/DEPLOY-RENDER.md` §7 · staff guide = `docs/คู่มือแอดมิน-ตรวจสลิป.md`.

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
transferring**. **After the transfer there is no cancellation and no refund** (cancelling an order — a failed
authenticity check is a claim, §12 "Authenticity"). Say this on the
how-to-order page and on the order page next to the bank details.

---

## 10. Shipping

- **Standard shipping fee:** 50 THB (owner, chat 2026-10-09: "พี่คิดลูกค้า 50 บาท" — was 60 THB). The warehouse (Shipnity Max,
  dropship) bills the shop 35 THB shipping per order ("คลังคิดพี่ 35 บาท") — internal cost, never shown to customers.
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

**Carrier names are NOT shown to customers (owner decision 2026-09-07).** The shipping page and
its meta description must not name EMS / Thailand Post / Flash Express. Say only
"ส่งไว 1–3 วัน มีเลข Track ให้เช็ค". The carriers listed above are internal knowledge for the team.
The owner said this in the original interview ("ไม่อยากให้ขึ้น … อยากโชว์เรื่องส่งไว") and re-confirmed
it on 2026-09-07 after the live /shipping page was found to name both carriers. **The wording change
is queued as point 4 of LAUNCH_AUDIT item 30 (the Thai language pass) — the page is not edited yet.**

---

## 11. Customer Account

**Owner decision 2026-09-07 — guest checkout, no sign-up required.** This supersedes the
interview answer "อยากให้สมัครนะ" and the earlier line here that "a customer account is required".
Customers buy without registering, but the shop must still capture customer data — at minimum the
phone number. Build this in the round that turns online ordering back on (§8 exception), not now.
Today's checkout already asks for a phone number with no code (§9, OTP off); whether that alone
counts as "captured" is settled in that round.

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
  stock, the customer picks **another item of the same price**. **No cash refund** — the one
  exception is a failed authenticity check (bullet "Authenticity" below).
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

  This list + the "Authenticity" bullet below (owner 2026-10-16) is the whole policy — do not add symptoms to it, and do not soften a "not covered"
  line on the website.
- **Authenticity (owner 2026-10-16, answering owner list item 67):** if the customer checks the
  item on the brand's own official authenticity page and it **fails**, they message LINE with the
  check result + the unboxing video, inside the same 7-day window. The shop reviews it, then
  **replaces the item or refunds** (the shop decides after review). This is the **only case with a
  cash refund**; every other claim stays "no cash refund". The unboxing video is also the proof
  that the parcel really came from OKami24 (owner's reason — say it on the site).
- **Published at /warranty on 2026-09-06** (owner wording), linked from the footer help column,
  the shipping page and the sitemap. The old `/preview/claims-policy` draft route is deleted.
- **Owner decision 2026-09-07:** the original interview file's wording "ภายใน 7 วัน เคลมทุกกรณี" is
  superseded. The policy is exactly what /warranty says — 7 days + unboxing video + the three
  "not covered" lines in the table above. Do not widen it back to "every case".

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

**Backup — คำตัดสินเจ้าของ 2026-09-07 (LAUNCH_AUDIT ข้อ 42):**
- รับ **ทาง 1** ทันที: snapshot ดิสก์ของ Render (อัตโนมัติทุก 24 ชม. เก็บอย่างน้อย 7 วัน) คือ backup ปัจจุบันของร้าน
- **ทาง 2** (แอปส่งสำเนาออกไป Cloudflare R2 หรือ Backblaze B2 ทุก 6 ชม.) เข้าคิว**หลังหน้าแอดมิน ก่อนเปิดตะกร้ากลับ** · ยังไม่เลือกว่า R2 หรือ B2
- **ไม่เอาทาง 3** (เจ้าของดาวน์โหลดไฟล์เองทุกสัปดาห์)
- ขอบเขตที่พิสูจน์แล้ว ห้ามพูดเกินนี้: สำเนาฐานข้อมูลเปิดอ่านได้ในพื้นที่แยก · ยังไม่ได้ทดสอบกู้ทั้งระบบ · สำเนาที่แอปทำเองยังอยู่ดิสก์เดียวกับต้นฉบับ

---

## 19. Unknowns / TBD

Explicit unresolved items — **never invent answers for these**:

- High-margin products
- Exact production database/backend
- Shipnity integration mechanism/API availability
- Final authentication implementation
- Final payment implementation (automation — the receiving account is resolved, and a staff-only slip-check page
  with a human approving is decided, both in §9)
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

### SALTHUB เป็นเจ้าของ Marbo / M Bar — เจ้าของยืนยัน 2026-09-23 (ปิดรอบ 8)
- **คำตัดสินเจ้าของ:** SALTHUB เป็นเจ้าของแบรนด์ Marbo / M Bar (ตระกูลเดียวกับ M Switch และ Zero) — ประโยคบนเว็บ
  "SALTHUB เจ้าของ M Bar …" (`src/data/brands.ts` คำโปรยแบรนด์) **คงไว้** และ `brandId` ของทั้งตระกูลคือ `salthub` ถาวร
  (คอมเมนต์เก่าใน `src/data/products/salthub.ts` ที่ว่า "brandId stays salthub until the owner confirms" = ยืนยันแล้ว)
- **ที่มา:** (1) เจ้าของเอง ซึ่งอยู่ในวงการขายพอต (2) โลโก้ Marbo ที่ท้ายเว็บทางการ salthub.com และหน้า salthub.com/m-bar-10k/
  (researcher รอบ 8 เปิดดูเอง 2026-09-23 · `_incoming/round8/researcher-1-result.md` แถว 1)
- **สิ่งที่ยังไม่มีแหล่งภายนอกยืนยัน:** researcher ไม่พบหน้าเว็บใดเขียนตรง ๆ ว่า "ผู้ผลิต/ตัวแทนจำหน่าย" (แถว 3c) — ข้อความบนเว็บ
  จึงพูดเท่าที่พิสูจน์ได้ ("หลายร้านเรียก M Bar ว่า Marbo" · "salthub.com มีโลโก้ Marbo") ถ้าจะเขียนคำว่า "ผู้ผลิต" บนเว็บ ให้อ้างคำตัดสินนี้
  และถามเจ้าของก่อน (ข้อเท็จจริงทางธุรกิจที่ยังยืนยันไม่ได้ — ไม่ขึ้นเว็บจนเจ้าของยืนยัน)
- **โรงงาน "MARBOVAPE" (marbovapor.com)** เป็นชื่อพ้อง เชื่อมกับ SALTHUB ไม่ได้ — ห้ามอ้างเป็นผู้ผลิต · โดเมนสะกดคล้าย salthub.com
  (salthab / salthvb / sallthub) ห้ามใช้เป็นแหล่งอ้างอิง

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

> **Superseded 2026-10-06 (owner, chat):** "ตอนนี้มีแต่หัวดำ" — the shop now sells ONLY the black pod; the clear pod is the
> problem model and comes off the site (M Bar 15K shows the black pod only). The black pod = the owner's photos of real stock
> (30/09) already live on `m-switch-pod`. The text below is the history of the earlier ruling.
>
> **ตอบแล้ว 2026-10-08 (เจ้าของในแชท) — M Bar 15K รวมเข้า M Switch Kit:** เมื่อหัวใสออกจากเว็บ สิ่งที่ร้านขายในชื่อ "M Bar 15K"
> (ตัวเครื่อง M Switch + หัวดำ) = M Switch Kit ทุกประการ และหัวดำอย่างเดียว = M Switch Pod (ใบราคาแอดมินเรียก "หัว M Bar 15K")
> ราคาของเจ้าของ 07/10 (ชุด ฿600 · หัวอย่างเดียว ฿400) = ราคาของ 2 หน้านี้อยู่แล้ว · ผล: หน้า `m-bar-15k` ซ่อน (ข้อมูล/รูปเก็บไว้)
> และ `/products/m-bar-15k` ส่งต่อถาวรไป `/products/m-switch-kit` · หน้า Kit และ Pod ใช้ชื่อ "M Bar 15K" ด้วย (ค้นหาเจอ + ข้อความบนหน้า)
> · ราคา ฿349 ของ `m-bar-15k` ไม่ขึ้นเว็บอีก (หน้าซ่อน)
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

#### Answered 2026-09-06 — the clear set belongs to M Bar 15K
The question above was put to the owner with the evidence laid out, and **the owner chose M Bar
15K**. So this is settled, not inferred:
- The 15 clean clear-pod photos (Vapeauras / ueeshop CDN) are **`m-bar-15k`'s per-flavour images**.
  They are live at `public/assets/products/m-bar-15k/variant-<id>.webp`, with a composed
  `lineup.webp` beside them.
- **`m-switch-pod` keeps the black COTTON MESH pod** and did not get per-flavour images: a 12-source
  search on 2026-09-06 found exactly one clean black-pod photo out of 18 flavours, and its product
  pixels (640px) were no larger than the card already in place, so nothing was overwritten. The
  other 17 flavours stand at `[ยังไม่มีรูป]` rather than borrowing the clear pod — the owner's rule
  "หาไม่ได้ใส่ [ยังไม่มีรูป] ห้ามเอารูปตัวเลือกอื่นแทน" applies, and the two pods differ visibly.
- The evidence the decision rested on: salthub.com/m-bar-15k/ illustrates its flavours with the
  clear pod (alt text "M Bar 15K &lt;flavour&gt;"), salthub.com/m-switch-pod/ uses the black one, the
  clear set is exactly the 15 flavours `m-bar-15k` carries, and the `m-bar-15k` card photo is a
  device with this same clear pod seated in it.

#### Answered 2026-09-06 — the lineup shot is NOT the first image
`docs/IMAGE_SPEC.md` §0 rule 5 says the all-options lineup should be the first card. Shown both
options rendered at real phone size, **the owner chose to keep a single clear flavour as the opening
image** and to say "there are many" in words instead:
- Catalogue cards carry an option-count badge ("15 กลิ่น" / "8 สี" / "15 flavours"), added as
  `src/components/catalog/OptionCountBadge.tsx`. It shows on **every** product with 2+ options.
- The lineup stays behind the "ทั้งหมด" button on the product page.
- Reason: at 15–18 options the lineup gives each flavour ~17px inside a catalogue card and ~43px in
  the hero — good for "there are many", useless for "I want that one".
- This supersedes IMAGE_SPEC §0 rule 5's "ให้เป็นการ์ดใบแรก" for high-option products. The lineup
  image itself is still required, and is still built to spec.

#### Answered 2026-09-06 — M Switch Pod stays without per-flavour photos until the owner supplies them
- After a 12-source search found no clean black-pod photo set, the owner chose to **leave
  `m-switch-pod`'s 17 unphotographed flavours at `[ยังไม่มีรูป]`** rather than borrow the clear-pod
  set or retouch the marketing composites. **The owner will request the photo files from the
  supplier directly.** Nobody else should go looking again; when the files arrive they go through
  `scripts/process-images.ts` like any other set.

#### Answered 2026-09-30 — หัว M Switch ที่ร้านขาย = หัวดำทึบ ใส่รูปรายกลิ่นได้ (แทนข้อ 2026-09-06 ข้างบน และข้อสงสัยของรอบ 28/09)
- เจ้าของในแชท รอบรูปทั้งเว็บ ก้อน 2: เว็บ SALTHUB ยังมีรูปหัวใสรุ่นแรก (รุ่นที่มีปัญหา) แต่ของที่ขายตอนนี้เปลี่ยนเป็น**หัวดำทึบ**แล้ว
  — เจ้าของส่งรูปของจริงมาให้ดู: ปากดูดกับวงแหวนดำเงา ตัวฐานดำด้าน ตัว M กับป้ายชื่อกลิ่นเป็นสีตามกลิ่น
  และบอกว่ารูปหัวที่ทำจากรูปรายกลิ่นของ SALTHUB "ถูก ใกล้เคียงแล้ว"
- ผล: `m-switch-pod` และ `m-switch-kit` มีรูปรายกลิ่นแล้ว (ที่มาและการตรวจของแต่ละไฟล์ = `scripts/process-images.map.json` ช่อง `aiRender`)
- เจ้าของบอกด้วยว่า M Switch 15K ขายเป็น **Starter Kit** (ตัวเครื่อง + หัว) ตัวเครื่องเปล่าไม่มีขายแยก หัวน้ำยามีขายแยก

#### Answered 2026-09-28 — Cool Mint does not exist; removed (replaces the 2026-09-06 answer below)
- Owner in chat, image-fix round: "M switch กลิ่น cool mint ไม่มีจริงครับ". `cool-mint` is removed from
  `m-switch-pod` and `m-switch-kit`, and from the Marbo flavour guide lists. The 2026-09-06 entry below is
  kept as history only.
- Same message: **Caliburn G4 Pro KOKO "Golden Carbon" is real** ("G4 pro koko สี Golden cabon มีจริง") —
  it stays in the catalogue although no public source lists it; it still needs a photo.

#### Answered 2026-09-06 — Cool Mint is a real M Switch Pod flavour; keep it
- Research flagged that salthub.com lists 17 flavours without Cool Mint, and no reseller checked
  carried it either. **The owner confirms Cool Mint is genuinely sold and stays in the catalogue**
  (`m-switch-pod` and `m-switch-kit`, id `cool-mint`) even though the manufacturer's site does not
  show it. Do not remove it on the strength of the manufacturer's page; the shop's own stock is the
  authority here. It still needs a photo — see the entry above.
