import type { WarehouseNewProduct } from "@/data/stock/warehouse-new";

/**
 * The LINE side of the new-product list (owner 28/10, option A — src/data/stock/warehouse-new.ts). Pure: watch.ts keeps the
 * codes already announced in a file on the data disk and passes them in; the contract test holds the rules.
 */

/** Entries not announced yet — one key per code and status, so a product that waited and then went up is told twice
 *  ("waiting", later "listed"), never more. */
export function alertKey(e: WarehouseNewProduct): string {
  return `${e.code}:${e.status}`;
}

export function unannounced(entries: readonly WarehouseNewProduct[], announced: ReadonlySet<string>): WarehouseNewProduct[] {
  return entries.filter((e) => !announced.has(alertKey(e)));
}

/** One LINE message for every entry not announced yet. No prices: prices are the owner's (BSOT §5). */
export function formatNewProductsAlert(entries: readonly WarehouseNewProduct[], siteUrl: string): string {
  const listed = entries.filter((e) => e.status === "listed");
  const waiting = entries.filter((e) => e.status === "waiting");
  return [
    `📦 สินค้าใหม่จากคลัง ${entries.length} รายการ`,
    ...listed.map((e) => `✓ ลงเว็บแล้ว: ${e.name}${e.href ? ` ${siteUrl}${e.href}` : ""}`),
    ...waiting.map((e) => `… รอลงเว็บ: ${e.name} (${e.code})${e.note ? ` — ${e.note}` : ""}`),
    `รายการทั้งหมด: ${siteUrl}/staff/dev`,
  ].join("\n");
}
