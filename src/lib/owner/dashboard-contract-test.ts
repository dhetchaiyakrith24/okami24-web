/**
 * Run: npx tsx src/lib/owner/dashboard-contract-test.ts
 * The owner dashboard's sums, on made-up figures.
 */
import type { DaySales } from "@/lib/staff/daily-sales-rules";
import { ageText, optionKey, sameHourLastWeek, shortBaht, stockSummary, sumSales } from "./dashboard-rules";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

const NOW = Date.parse("2026-11-08T10:00:00+07:00");
const day = (date: string, part: Partial<DaySales>): DaySales => ({ date, webSatang: 0, lineSatang: 0, refundedSatang: 0, totalSatang: 0, orders: [], slips: [], unclear: [], heldAsWeb: [], ...part });
const order = (createdAt: string, total: number) => ({ orderNumber: createdAt, runNumber: null, total, createdAt, hasSlipRef: true });
const slip = (transferredAt: string, amountSatang: number) => ({ transRef: transferredAt, amountSatang, transferredAt, receiverStatus: "match" });

const blank = (i: number) => day(`2026-11-0${i}`, {});
const lastWeek = day("2026-11-01", {
  orders: [order("2026-11-01T09:00:00+07:00", 100), order("2026-11-01T20:00:00+07:00", 900)],
  slips: [slip("2026-11-01T09:30:00+07:00", 10_000), slip("2026-11-01T21:00:00+07:00", 500_000)],
});
const today = day("2026-11-08", { webSatang: 30_000, totalSatang: 30_000 });
const hour = sameHourLastWeek([today, blank(7), blank(6), blank(5), blank(4), blank(3), blank(2), lastWeek], NOW);
check("last week counts only up to this hour", hour?.thenSatang === 20_000);
check("the change is a whole percent", hour?.percent === 50);
check("nothing last week gives no percent", sameHourLastWeek([today, blank(7), blank(6), blank(5), blank(4), blank(3), blank(2), blank(1)], NOW)?.percent === null);
check("under 8 days gives no comparison", sameHourLastWeek([today], NOW) === null);

const sum = sumSales([day("a", { webSatang: 300, lineSatang: 700, orders: [order("x", 3)] }), day("b", { webSatang: 0, lineSatang: 0 })]);
check("sales add up, web and LINE apart", sum.totalSatang === 1000 && sum.webPercent === 30 && sum.orders === 1);
check("no sales gives no share", sumSales([]).webPercent === null);

const product = (slug: string, options: { id: string | null; name: string; sells: boolean; qty: number | null }[]) => ({ slug, name: slug, brand: null, price: 1, options });
const stock = stockSummary(
  [
    product("best", [
      { id: "a", name: "A", sells: true, qty: 2 },
      { id: "b", name: "B", sells: false, qty: 0 },
      { id: "c", name: "C", sells: true, qty: 50 },
    ]),
    product("other", [
      { id: "d", name: "D", sells: false, qty: null },
      { id: null, name: "other", sells: true, qty: 3 },
      { id: "e", name: "E", sells: true, qty: null },
    ]),
  ],
  (slug) => slug === "best",
  new Set([optionKey("best", "b")])
);
check("low counts options at or under the owner's line, out counts only what sold lately", stock.low === 2 && stock.out === 1);
check("an out option that never sold and is no best seller stays off the list", !stock.urgent.some((r) => r.name.endsWith("· D")));
check("a best seller keeps its flag for the red", stock.urgent[0].best && stock.urgent.some((r) => !r.best));
check("an option with no count is not called low", !stock.urgent.some((r) => r.name.endsWith("· E")));
check("best sellers lead, what cannot be ordered first", stock.urgent[0].name === "best · B" && stock.urgent[1].name === "best · A");
check("a product with no options reads as its own name", stock.urgent.some((r) => r.name === "other"));

check("a losing round prints short", shortBaht(-1500) === "-1.5k" && shortBaht(-950) === "-950" && shortBaht(22_700) === "22.7k");
check("ages read in the largest whole unit", ageText("2026-11-08T09:20:00+07:00", NOW) === "40 นาที" && ageText("2026-11-06T09:00:00+07:00", NOW) === "2 วัน");

console.log(failed === 0 ? "owner dashboard: PASS" : `owner dashboard: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
