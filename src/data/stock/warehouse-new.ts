/**
 * New products the warehouse added in Shipnity Max (owner 28/10, option A: "แจ้งกลุ่ม LINE + รายการในหน้าพนักงาน").
 * Shipnity never tells the site about a product the site does not have, so the daily 15:00 run
 * (scheduled task okami24-new-products-daily) finds them in Shipnity's order-entry picker and adds one entry here in the
 * same PR that lists (or prepares) the product. After the deploy, the server tells the "OKM Order" LINE group once per
 * entry (src/lib/woo/watch.ts) and Okami dev lists the recent ones. Append only, newest last; never edit an old entry
 * except to move it from "waiting" to "listed" when the product goes up later.
 *
 *   code    — the Shipnity Max parent code (Pod-181, Disposable-48 …)
 *   name    — the name customers will see (or Shipnity's name while it waits)
 *   seenOn  — the day the 15:00 run first found it (YYYY-MM-DD)
 *   status  — "listed" (on the site: `href`) · "waiting" (prepared unpublished or not yet listed: `note` says why)
 */
export interface WarehouseNewProduct {
  code: string;
  name: string;
  seenOn: string;
  status: "listed" | "waiting";
  href?: string;
  note?: string;
}

export const WAREHOUSE_NEW: readonly WarehouseNewProduct[] = [];
