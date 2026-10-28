import { FLAT_SHIPPING_FEE_THB } from "@/lib/commerce/pricing";
import { wooId } from "@/lib/woo/catalog";

/**
 * One web order as a WooCommerce order (REST v3 "order" object — woocommerce.github.io/woocommerce-rest-api-docs, Orders),
 * the body a Woo shop POSTs to its "order.created" webhook and answers on GET /orders/<id>. Pure, so the contract test
 * can hold it to the rules (Shipnity link, owner 27/10 + 28/10):
 *   - only what the warehouse needs to pack and ship: items with the Shipnity code as `sku`, the recipient, the address,
 *     the shipping fee; no slip, no refund account, no customer note, no email, no member id;
 *   - the real shipping fee on its own line every time; free shipping = a shop-paid discount line (BSOT §10, survey
 *     "Order push") — the order total stays what the customer paid;
 *   - lines refunded after an out-of-stock (batch E) are not sent (same rule as the copy-to-warehouse text).
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
}

const money = (n: number) => n.toFixed(2);
const wooDate = (iso: string) => iso.replace(/\.\d+Z$/, "").replace(/Z$/, "");

export function wooOrderJson(o: PushOrder, siteUrl: string) {
  const itemsTotal = o.lines.reduce((n, l) => n + l.lineTotal, 0);
  const shippingReal = FLAT_SHIPPING_FEE_THB;
  const discount = Math.max(0, shippingReal - o.shippingFee);
  const total = itemsTotal + shippingReal - discount;
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
    customer_note: "",
    billing: { ...address, email: "" },
    shipping: address,
    payment_method: "bacs",
    payment_method_title: "โอนเงิน (ชำระแล้ว)",
    transaction_id: "",
    set_paid: true,
    meta_data: [],
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
    shipping_lines: [{ id: 1, method_title: "ค่าส่ง", method_id: "flat_rate", total: money(shippingReal), total_tax: "0.00", taxes: [], meta_data: [] }],
    fee_lines: [],
    coupon_lines: discount > 0 ? [{ id: 1, code: "free-shipping", discount: money(discount), discount_tax: "0.00", meta_data: [] }] : [],
    refunds: [],
    _links: { self: [{ href: `${siteUrl}/wp-json/wc/v3/orders/${o.id}` }] },
  };
}
