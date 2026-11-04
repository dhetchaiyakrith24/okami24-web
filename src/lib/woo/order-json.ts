import { wooId } from "@/lib/woo/catalog";
import { SHIPNITY_CARRIER_NAME, type CarrierId } from "@/lib/commerce/carriers";

/**
 * One web order as a WooCommerce order (REST v3 "order" object — woocommerce.github.io/woocommerce-rest-api-docs, Orders),
 * the body a Woo shop POSTs to its "order.created" webhook and answers on GET /orders/<id>. Pure, so the contract test
 * can hold it to the rules (Shipnity link, owner 27/10 + 28/10):
 *   - only what the warehouse needs to pack and ship: items with the Shipnity code as `sku`, the recipient, the address,
 *     the shipping fee; no slip, no refund account, no customer note of the customer's, no email, no member id;
 *   - the warehouse's shipping rate on its own line every time, because the warehouse bills the shop what this line says
 *     (bill 22–31/10: 50 on 14 web orders, owner 04/11 "ให้คิดค่าส่ง 35 บาท"; BSOT §10). Free shipping = a shop-paid discount
 *     line, a customer who paid above the rate = a fee line for the rest — the order total stays what the customer paid;
 *   - lines refunded after an out-of-stock (batch E) are not sent (same rule as the copy-to-warehouse text);
 *   - the carrier (owner 30/10: DHL for Phuket 83xxx + Bangkok 10220 / 10250, EMS for the rest) rides as the shipping
 *     line's title in Shipnity's own words (EMS / DHL) and as order meta `shipping_carrier` — Shipnity cannot map Woo
 *     shipping methods (admin 30/10), so one real test order shows which it reads; without a carrier the line keeps "ค่าส่ง".
 *     The first real DHL order (03/11) still landed as EMS — Shipnity uses its account's default carrier — so until it can
 *     map ours, a DHL order also carries a note for the packer (owner 03/11 "ทำหมายเหตุชั่วคราวไปก่อน"), in `customer_note`.
 * Thai address → Woo: address_1 = house/street, address_2 = sub-district, city = district, state = province.
 */

export interface PushLine {
  itemId: number;
  productSlug: string;
  variantId: string | null;
  name: string;
  sku: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PushOrder {
  id: number;
  orderNumber: string;
  createdAt: string;
  /** What the customer paid for shipping (0 when free). */
  shippingFee: number;
  lines: PushLine[];
  recipientName: string;
  phone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  /** The carrier the order goes with (staff's pick, else from the postcode); absent = the line title stays "ค่าส่ง". */
  carrier?: CarrierId;
}

/** Why an order may NOT go to the warehouse now — null = it may. Only a paid order (staff confirmed the money →
 *  "approved") that was never sent before and has no open out-of-stock problem; anything else would hand Shipnity an
 *  unpaid, cancelled or duplicate order marked paid. */
export function pushBlock(o: { status: string; alreadySent: boolean; stockOpen: boolean }): "not-approved" | "already-sent" | "stock-open" | null {
  if (o.alreadySent) return "already-sent";
  if (o.status !== "approved") return "not-approved";
  if (o.stockOpen) return "stock-open";
  return null;
}

/** What the warehouse bills the shop for shipping one order, whatever the customer paid (BSOT §10). */
export const WAREHOUSE_SHIPPING_FEE_THB = 35;

const money = (n: number) => n.toFixed(2);
/** The note a DHL order carries to the warehouse until Shipnity reads the carrier itself (owner 03/11, temporary). */
export const DHL_PACKER_NOTE = "ส่ง DHL — เปลี่ยนขนส่งใน Shipnity เป็น DHL ก่อนออกเลขพัสดุ";

const wooDate = (iso: string) => iso.replace(/\.\d+Z$/, "").replace(/Z$/, "");

export function wooOrderJson(o: PushOrder, siteUrl: string) {
  const itemsTotal = o.lines.reduce((n, l) => n + l.lineTotal, 0);
  const shippingReal = WAREHOUSE_SHIPPING_FEE_THB;
  const discount = Math.max(0, shippingReal - o.shippingFee);
  const extraShipping = Math.max(0, o.shippingFee - shippingReal);
  const total = itemsTotal + shippingReal - discount + extraShipping;
  const carrierName = o.carrier ? SHIPNITY_CARRIER_NAME[o.carrier] : null;
  // Temporary (owner 03/11): Shipnity imports every web order as its default carrier (EMS), so the DHL ones say so in the note.
  const packerNote = o.carrier === "dhl" ? DHL_PACKER_NOTE : "";
  const address = {
    first_name: o.recipientName,
    last_name: "",
    company: "",
    address_1: o.line1,
    address_2: o.subdistrict,
    city: o.district,
    state: o.province,
    postcode: o.postalCode,
    country: "TH",
    phone: o.phone,
  };
  return {
    id: o.id,
    parent_id: 0,
    number: o.orderNumber,
    order_key: `wc_order_${o.orderNumber}`,
    created_via: "checkout",
    version: "9.9.0",
    status: "processing",
    currency: "THB",
    date_created: wooDate(o.createdAt),
    date_created_gmt: wooDate(o.createdAt),
    date_modified: wooDate(o.createdAt),
    date_modified_gmt: wooDate(o.createdAt),
    date_paid: wooDate(o.createdAt),
    date_paid_gmt: wooDate(o.createdAt),
    discount_total: money(discount),
    discount_tax: "0.00",
    shipping_total: money(shippingReal),
    shipping_tax: "0.00",
    cart_tax: "0.00",
    total: money(total),
    total_tax: "0.00",
    prices_include_tax: false,
    customer_id: 0,
    customer_note: packerNote,
    billing: { ...address, email: "" },
    shipping: address,
    payment_method: "bacs",
    payment_method_title: "โอนเงิน (ชำระแล้ว)",
    transaction_id: "",
    set_paid: true,
    meta_data: carrierName ? [{ id: 1, key: "shipping_carrier", value: carrierName }] : [],
    line_items: o.lines.map((l) => ({
      id: l.itemId,
      name: l.name,
      product_id: wooId(`p:${l.productSlug}`),
      variation_id: l.variantId ? wooId(`v:${l.productSlug}/${l.variantId}`) : 0,
      quantity: l.quantity,
      tax_class: "",
      subtotal: money(l.lineTotal),
      subtotal_tax: "0.00",
      total: money(l.lineTotal),
      total_tax: "0.00",
      taxes: [],
      meta_data: [],
      sku: l.sku ?? "",
      price: l.unitPrice,
    })),
    tax_lines: [],
    shipping_lines: [
      { id: 1, method_title: carrierName ?? "ค่าส่ง", method_id: "flat_rate", total: money(shippingReal), total_tax: "0.00", taxes: [], meta_data: [] },
    ],
    fee_lines: extraShipping > 0 ? [{ id: 1, name: "ค่าส่งส่วนที่ลูกค้าจ่ายเกินเรตคลัง", tax_class: "", tax_status: "none", total: money(extraShipping), total_tax: "0.00", taxes: [], meta_data: [] }] : [],
    coupon_lines: discount > 0 ? [{ id: 1, code: "free-shipping", discount: money(discount), discount_tax: "0.00", meta_data: [] }] : [],
    refunds: [],
    _links: { self: [{ href: `${siteUrl}/wp-json/wc/v3/orders/${o.id}` }] },
  };
}
