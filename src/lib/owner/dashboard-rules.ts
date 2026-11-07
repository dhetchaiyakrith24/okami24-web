/**
 * The owner dashboard's sums (owner 08/11) — pure, so the contract test runs them under plain tsx.
 * Sales come from daily-sales-rules, web profit from cost-rules. They are never added together: LINE profit exists only per
 * round, from the bill (owner 04/11), and DayProfit.salesSatang leaves out orders with no cost, so it is not the day's sales.
 */
import type { DaySales } from "@/lib/staff/daily-sales-rules";
import type { StockProduct } from "@/lib/staff/stock-book";
import { LOW_STOCK_AT } from "@/lib/stock/count-rules";

const DAY_MS = 86_400_000;

/** "Good morning" by the Bangkok clock. */
export function greeting(now: number): string {
  const hour = new Date(now + 7 * 3_600_000).getUTCHours();
  if (hour >= 5 && hour < 12) return "สวัสดีตอนเช้า";
  if (hour >= 12 && hour < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

/** How long ago, in the words the page shows. */
export function ageText(iso: string, now: number): string {
  const minutes = Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000));
  if (minutes < 60) return `${minutes} นาที`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} ชั่วโมง`;
  return `${Math.floor(minutes / (24 * 60))} วัน`;
}

export interface SameHour {
  nowSatang: number;
  thenSatang: number;
  /** Whole percent; null when last week had nothing to compare with. */
  percent: number | null;
}

/**
 * Today so far against the same weekday last week up to the same hour. A part-day against a full day would read as a loss
 * every morning. `days` = newest first, so days[7] is that weekday.
 */
export function sameHourLastWeek(days: DaySales[], now: number): SameHour | null {
  const today = days[0];
  const then = days[7];
  if (!today || !then) return null;
  const until = now - 7 * DAY_MS;
  const web = then.orders.filter((o) => Date.parse(o.createdAt) <= until).reduce((n, o) => n + o.total * 100, 0);
  const line = then.slips.filter((s) => Date.parse(s.transferredAt) <= until).reduce((n, s) => n + s.amountSatang, 0);
  const thenSatang = web + line;
  const percent = thenSatang > 0 ? Math.round(((today.totalSatang - thenSatang) / thenSatang) * 100) : null;
  return { nowSatang: today.totalSatang, thenSatang, percent };
}

export interface SalesSum {
  totalSatang: number;
  webSatang: number;
  lineSatang: number;
  orders: number;
  /** Whole percent of the total; null with no sales. */
  webPercent: number | null;
}

export function sumSales(days: DaySales[]): SalesSum {
  const webSatang = days.reduce((n, d) => n + d.webSatang, 0);
  const lineSatang = days.reduce((n, d) => n + d.lineSatang, 0);
  const totalSatang = webSatang + lineSatang;
  return {
    totalSatang,
    webSatang,
    lineSatang,
    orders: days.reduce((n, d) => n + d.orders.length, 0),
    webPercent: totalSatang > 0 ? Math.round((webSatang / totalSatang) * 100) : null,
  };
}

export interface StockAlert {
  name: string;
  /** Null = the option cannot be ordered and the warehouse gave no count. */
  qty: number | null;
  out: boolean;
}

export interface StockSummary {
  low: number;
  out: number;
  /** Best sellers first, what cannot be ordered at the top of each group. */
  urgent: StockAlert[];
}

/**
 * Counted per option, because that is what a customer picks. The catalog shows every colour and flavour the maker offers
 * (owner 06/09), so "out" can be long: the list leads with what the shop really sells.
 */
export function stockSummary(products: StockProduct[], isBest: (slug: string) => boolean, limit = 8): StockSummary {
  let low = 0;
  let out = 0;
  const rows: (StockAlert & { best: boolean })[] = [];
  for (const product of products) {
    for (const option of product.options) {
      const isOut = !option.sells;
      const isLow = option.sells && option.qty !== null && option.qty <= LOW_STOCK_AT;
      if (isOut) out++;
      if (isLow) low++;
      if (!isOut && !isLow) continue;
      const name = option.id === null ? product.name : `${product.name} · ${option.name}`;
      rows.push({ name, qty: option.qty, out: isOut, best: isBest(product.slug) });
    }
  }
  const rank = (r: { best: boolean; out: boolean }) => (r.best ? 0 : 2) + (r.out ? 0 : 1);
  const urgent = rows
    .sort((a, b) => rank(a) - rank(b) || (a.qty ?? 0) - (b.qty ?? 0) || a.name.localeCompare(b.name, "th"))
    .slice(0, limit)
    .map(({ name, qty, out: isOut }) => ({ name, qty, out: isOut }));
  return { low, out, urgent };
}

export interface GoogleWeek {
  /** Last day of the week, YYYY-MM-DD. */
  to: string;
  clicks: number;
  impressions: number;
  position: number;
}

/** "22 ต.ค." style short date for the chart axis: dd/mm. */
export const shortDate = (date: string) => `${Number(date.slice(8, 10))}/${Number(date.slice(5, 7))}`;

/** Oldest first, `slots` long, empty slots at the old end: real bars never stretch to fill the row. */
export function padSlots<T>(rows: T[], slots: number): (T | null)[] {
  const kept = rows.slice(-slots);
  return [...Array.from({ length: slots - kept.length }, () => null), ...kept];
}
