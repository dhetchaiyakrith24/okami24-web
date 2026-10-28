/** Pure parts of the warehouse-change alert (order-events.ts) — the contract test holds them. */

/** The changes staff must hear about: the warehouse will not ship this order as it is. */
export function alertWorthy(status: string | null): boolean {
  return status === "cancelled" || status === "deleted" || status === "refunded" || status === "failed" || status === "trash";
}

const STATUS_TH: Record<string, string> = {
  cancelled: "คลังยกเลิกออเดอร์",
  deleted: "คลังลบออเดอร์",
  trash: "คลังลบออเดอร์",
  refunded: "คลังคืนเงิน / ยกเลิกออเดอร์",
  failed: "คลังแจ้งออเดอร์ไม่สำเร็จ",
};

/** The LINE text for the "OKM Order" group. No customer name, phone or address in the group — the staff page has them. */
export function formatWarehouseChangeAlert(o: { orderNumber: string; runNumber: string | null; items: string; status: string; siteUrl: string }): string {
  return [
    `⚠️ ${STATUS_TH[o.status] ?? "คลังเปลี่ยนสถานะออเดอร์"} ${o.runNumber ?? o.orderNumber}`,
    o.items ? `สินค้า: ${o.items}` : null,
    "อาจเป็นเพราะของหมดที่คลัง — คุยกับแอดมินคลัง แล้วแจ้งลูกค้า (เปลี่ยนสินค้า / คืนเงิน ใช้กล่องสินค้าหมดในหน้าออเดอร์)",
    `เปิดดู: ${o.siteUrl}/staff/orders/${encodeURIComponent(o.orderNumber)}`,
  ]
    .filter(Boolean)
    .join("\n");
}
