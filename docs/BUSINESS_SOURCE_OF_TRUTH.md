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

- **LINE OA:** `@okM24`
- **LINE link:** https://lin.ee/QNJWw6o
- **Primary YouTube:** https://www.youtube.com/@OKMYARZ

**Primary customer communication channel:** LINE OA.

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

---

## 10. Shipping

- **Standard shipping fee:** 60 THB
- **Free shipping threshold:** 500 THB

Customer-facing messaging should emphasize fast dispatch and tracking provided. Do not
expose unnecessary internal warehouse or logistics details in customer-facing content.

---

## 11. Customer Account

A customer account is required for the target production experience.

**Initial required customer identity field:** phone number.

Do not collect unnecessary personal information.

**Future account capabilities** (implement only when approved): order history, favorites,
addresses, tracking, product interests.

---

## 12. After-Sales / Trust

OKami24 provides a **7-day claim window** when a product has a problem.

**Requirement:** customer must provide an unboxing video as evidence.

Before publishing final wording, the exact claim policy should be reviewed so the website
promise does not exceed actual operations. Use this policy as a major Trust / Service
differentiator.

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
- Final payment implementation
- Final Product Master schema
- Exact warehouse integration
- Final production domain
- Complete product/variant dataset
