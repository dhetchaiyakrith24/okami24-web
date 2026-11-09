import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allCatalogItems } from "@/lib/catalog-index";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { readSwitches } from "@/lib/commerce/shop-switches";
import { Container } from "@/components/ui/Container";
import type { Alert } from "@/components/dashboard/Alerts";
import { ViewSwitch, type DashView } from "@/components/dashboard/ViewSwitch";
import { Vapour } from "@/components/dashboard/Vapour";
import { isBestSeller } from "@/data/sales-badges";
import GOOGLE_WEEKLY from "@/data/owner/google-weekly.json";
import { isOwner, ownerAreaEnabled } from "@/lib/owner/auth";
import { lastRound } from "@/lib/owner/bill-rules";
import { listRounds } from "@/lib/owner/bills";
import { codesWithoutCost, profitDays } from "@/lib/owner/costs";
import { cartsNotOrdered, lineClicks, oldestOrders, soldOptions, topWebProducts } from "@/lib/owner/dashboard";
import { sameHourLastWeek, stockSummary, sumSales } from "@/lib/owner/dashboard-rules";
import { isStaff } from "@/lib/staff/auth";
import { salesDays } from "@/lib/staff/daily-sales";
import { countByJob } from "@/lib/staff/orders";
import { stockBook } from "@/lib/staff/stock-book";
import { feedHealth } from "@/lib/woo/watch";
import { FEED_LIGHT } from "@/app/staff/_components/feed-light";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { ControlPanel } from "@/app/staff/owner/_dash/ControlPanel";
import { HowCounted } from "@/app/staff/owner/_dash/HowCounted";
import { dayLabel, TodayPanel } from "@/app/staff/owner/_dash/TodayPanel";
import { WeekPanel } from "@/app/staff/owner/_dash/WeekPanel";

/**
 * /staff/owner — the owner's section (back-office round 07/11). Google sign-in only; the staff password opens nothing here.
 * 404 until OKAMI24_OWNER_GOOGLE_EMAIL is set on the host (src/lib/owner/auth.ts). Not linked from the shop, not in the sitemap.
 * The owner's dashboard (owner 08/11, "ใส่จัดเต็มทุกอย่างที่พี่ควรรู้"): today, the week, the shop. Every figure comes from the system,
 * and what the system does not know says so. LINE profit is weekly by the owner's ruling 04/11: a slip says nothing about what
 * was bought, so only the warehouse bill can price it, and no page adds it to a day. Rules = src/lib/owner/dashboard-rules.ts.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ส่วนเจ้าของ",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const PROFIT_DAYS = 14;
const readClock = () => Date.now();

export default async function OwnerPage({ searchParams }: { searchParams: Promise<{ denied?: string; view?: string }> }) {
  if (!ownerAreaEnabled()) notFound();
  const { denied, view } = await searchParams;

  if (!(await isOwner())) {
    return (
      <Container className="flex max-w-xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
        <StaffBar />
        <header className="flex flex-col gap-2">
          <span className="label-mono text-xs text-ember">OKami24 · เจ้าของ</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">ส่วนเจ้าของ</h1>
          <p className="text-sm leading-relaxed text-foreground-muted">หน้านี้เปิดได้เฉพาะบัญชี Google ของเจ้าของร้าน</p>
        </header>
        {denied !== undefined && <p className="text-sm text-danger">บัญชีนี้เข้าส่วนเจ้าของไม่ได้</p>}
        {/* A full page load on purpose: the route answers with a redirect to Google. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/auth/owner"
          className="inline-flex min-h-12 w-fit items-center rounded-full bg-ember px-6 text-sm font-semibold text-background hover:opacity-90"
        >
          เข้าสู่ระบบด้วย Google
        </a>
      </Container>
    );
  }

  const now = readClock();
  const sales = salesDays();
  const profit = profitDays(PROFIT_DAYS);
  const rounds = listRounds(8);
  const due = lastRound(now);
  const counts = countByJob();
  const canOpenOrders = await isStaff();
  const week = sumSales(sales.slice(0, 7));
  const unpriced = profit.reduce((n, d) => n + d.unpriced, 0);
  const unclear = sales.slice(0, PROFIT_DAYS).reduce((n, d) => n + d.unclear.length, 0);
  const feed = feedHealth();
  const noCost = codesWithoutCost().length;
  const billDue = !rounds[0] || rounds[0].to < due.to;
  const switches = readSwitches();
  const catalog = allCatalogItems().map((item) => ({ slug: item.slug, name: item.name }));

  // Most urgent first: a silent warehouse stops stock, then money waiting on the team, then what the owner fixes.
  const alerts: Alert[] = [
    ...(switches.siteClosed ? [{ text: "เว็บปิดอยู่", href: "/staff/owner?view=control", tone: "danger" as const, hideOn: "control" }] : []),
    ...(switches.cartOff ? [{ text: "ตะกร้าปิดอยู่", href: "/staff/owner?view=control", tone: "warn" as const, hideOn: "control" }] : []),
    ...(feed.state === "ok" ? [] : [{ text: `คลัง${FEED_LIGHT[feed.state].long}`, tone: feed.state === "down" ? ("danger" as const) : ("warn" as const) }]),
    ...(counts.slip > 0 ? [{ text: `รอตรวจสลิป ${counts.slip}`, href: canOpenOrders ? "/staff/orders?f=slip" : undefined, tone: "warn" as const }] : []),
    ...(counts.tracking > 0 ? [{ text: `รอใส่เลขพัสดุ ${counts.tracking}`, href: canOpenOrders ? "/staff/orders?f=tracking" : undefined, tone: "warn" as const }] : []),
    ...(unclear > 0 ? [{ text: `สลิปไม่แน่ใจ ${unclear}`, tone: "warn" as const }] : []),
    ...(unpriced > 0 ? [{ text: `ออเดอร์รอใส่ทุน ${unpriced}`, href: "/staff/owner/costs", tone: "warn" as const }] : []),
    ...(billDue ? [{ text: "บิลรอเทียบ", href: "/staff/owner/bill#new", tone: "warn" as const, hideOn: "week" }] : []),
  ];

  const views: DashView[] = [
    {
      id: "today",
      label: "วันนี้",
      content: (
        <TodayPanel
          days={sales}
          profit={profit}
          hour={sameHourLastWeek(sales, now)}
          avgSatang={week.orders > 0 ? Math.round(week.webSatang / week.orders / 100) * 100 : null}
          counts={counts}
          oldest={oldestOrders()}
          canOpenOrders={canOpenOrders}
          stock={stockSummary(stockBook().filter((p) => !switches.hidden.includes(p.slug)), isBestSeller, soldOptions(30))}
          feed={feed}
          now={now}
        />
      ),
    },
    {
      id: "week",
      label: "สัปดาห์",
      content: <WeekPanel rounds={rounds} due={due} week={week} weekDays={{ from: sales[Math.min(6, sales.length - 1)].date, to: sales[0].date }} clicks={lineClicks(7)} carts={cartsNotOrdered(7)} top={topWebProducts(7)} google={GOOGLE_WEEKLY} />,
    },
    { id: "control", label: "ควบคุมร้าน", content: <ControlPanel switches={{ orderingBuilt: ORDERING_ENABLED, cartOff: switches.cartOff, siteClosed: switches.siteClosed, lineToWarehouse: switches.lineToWarehouse, autoToWarehouse: switches.autoToWarehouse, hidden: catalog.filter((p) => switches.hidden.includes(p.slug)), products: catalog }} noCost={noCost} teamHome={canOpenOrders} billDue={billDue ? due : null} /> },
  ];

  return (
    <Container className="relative isolate flex max-w-2xl flex-col gap-3.5 pb-8 pt-4 lg:max-w-6xl lg:gap-5 lg:pt-8">
      <StaffBar />
      <Vapour />
      <h1 className="text-sm font-normal text-foreground-muted">ส่วนเจ้าของ · {dayLabel(sales[0].date)}</h1>
      <ViewSwitch views={views} initial={view ?? ""} label="เลือกมุมมอง" alerts={alerts} footer={<HowCounted />} footerHiddenOn={["control"]} />
    </Container>
  );
}
