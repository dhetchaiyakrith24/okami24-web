/**
 * How the warehouse count of one option reads on the product page (owner 30/10: "ใส่ตัวเลขที่เหลือในสต๊อกลงไปในสินค้าด้วย
 * เลยว่าเหลือกี่ตัว" → his answer "2 A": the count of the picked option, live, "ใกล้หมด · เหลือ N ชิ้น" at ≤ LOW_STOCK_AT,
 * "มากกว่า 20 ชิ้น" above COUNT_CEILING). Pure and import-free: the stock API (server) and the product page (browser) both read it.
 */

/** A count at or under this shows the low-stock word (owner 26/10, HANDOFF §18 "Low-stock label"). */
export const LOW_STOCK_AT = 3;

/** Counts above this leave the server as COUNT_CEILING + 1 and read "มากกว่า 20 ชิ้น" — the cart's own cap without a
 *  number (§18 "Cart cap"), so the public stock answer never lists the warehouse's full holding. */
export const COUNT_CEILING = 20;

/** The count the public stock answer carries for an option the live rules sell; null = no number to show. */
export function publicCount(quantity: number | null): number | null {
  if (quantity === null || quantity <= 0) return null;
  return Math.min(quantity, COUNT_CEILING + 1);
}

export type CountKind = "low" | "count" | "many";

export function countKind(n: number): CountKind {
  return n <= LOW_STOCK_AT ? "low" : n > COUNT_CEILING ? "many" : "count";
}

/** The words for a count: `lowStock` / `stockLeft` / `stockMany` from the product dictionary, `{n}` filled. */
export function countText(t: { lowStock: string; stockLeft: string; stockMany: string }, n: number): { kind: CountKind; text: string } {
  const kind = countKind(n);
  const text = kind === "low" ? t.lowStock.replace("{n}", String(n)) : kind === "many" ? t.stockMany.replace("{n}", String(COUNT_CEILING)) : t.stockLeft.replace("{n}", String(n));
  return { kind, text };
}
