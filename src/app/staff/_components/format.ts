/** Formatting for the staff slip-check page — Thai, Bangkok time, Buddhist year like the bank apps. */

const DATE_TIME = new Intl.DateTimeFormat("th-TH", {
  timeZone: "Asia/Bangkok",
  day: "numeric",
  month: "short",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : `${DATE_TIME.format(d)} น.`;
}

const SHORT = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** "26 ต.ค. 12:57" — the staff order list rows (designer 26/10: the full date cut the province at 390). */
export function formatShortDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : SHORT.format(d);
}

const BAHT = new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatBaht(amount: number): string {
  return `฿${BAHT.format(amount)}`;
}

const COUNT = new Intl.NumberFormat("th-TH");

export function formatCount(n: number): string {
  return COUNT.format(n);
}
