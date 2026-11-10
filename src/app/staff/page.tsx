import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { currentStaff, googleStaffSignIn, sharedPasswordOpen, staffAreaEnabled } from "@/lib/staff/auth";
import { StaffLogin } from "@/app/staff/_components/StaffLogin";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { AdminHome } from "@/app/staff/_components/AdminHome";
import { DONE_TEXT, ERROR_TEXT, STOCK_ERROR_TEXT } from "@/app/staff/_components/order-notices";
import { countByJob, listStaffOrders } from "@/lib/staff/orders";
import { orderCountDays } from "@/lib/staff/order-count";
import { myCountsToday } from "@/lib/staff/audit";
import { salesToday } from "@/lib/staff/daily-sales";
import { homeDate, homeNotice } from "@/lib/staff/admin-home-rules";
import { readSwitches } from "@/lib/commerce/shop-switches";
import { feedHealth } from "@/lib/woo/watch";
import { shipnityReady } from "@/lib/woo/order-push";

/**
 * /staff — the admin home (owner 10/11 "admin และพี่ แต่ละคนมี dashboard ของตัวเอง"; design v2 passed 11/11). What waits on the
 * team now, in the order to do it, with the everyday step in the row; the look and the parts = src/app/staff/_components/
 * AdminHome.tsx. Still here from the old home: the day's order count, today and yesterday (LINE_ORDERS_GAPS.md #13 — the web
 * IS the daily count), the other job lists, the shortcuts, who is signed in and log out. The owner in the admin view sees the
 * same page under "เจ้าของ" with the switch back to the owner's dashboard.
 *
 * Not for customers and not for search: no link to it anywhere on the site, not in the sitemap, noindex here. It is also
 * deliberately NOT listed in robots.txt — that file is public, and listing the path there would only advertise it. 404
 * until the team password or Google sign-in is configured on the host (src/lib/staff/auth.ts).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ทีมงาน",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const readClock = () => Date.now();

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ denied?: string; order?: string; done?: string; error?: string }> }) {
  if (!staffAreaEnabled()) notFound();
  const actor = await currentStaff();
  const query = await searchParams;

  if (!actor) {
    const google = googleStaffSignIn();
    const password = sharedPasswordOpen();
    return (
      <Container className="flex max-w-xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
        <header className="flex flex-col gap-2">
          <span className="label-mono text-xs text-ember">OKami24 · ทีมงาน</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">หน้าทีมงาน</h1>
          <p className="text-sm leading-relaxed text-foreground-muted">
            หน้านี้สำหรับทีมงานร้านเท่านั้น{google ? " เข้าด้วยบัญชี Google ที่เจ้าของร้านเพิ่มไว้" : " ใส่รหัสทีมงานเพื่อเข้าใช้"}
          </p>
        </header>
        {query.denied !== undefined && <p className="text-sm leading-relaxed text-danger">บัญชี Google นี้ยังไม่มีสิทธิ์เข้าหน้าทีมงาน ให้เจ้าของร้านเพิ่มอีเมลนี้ก่อน</p>}
        {google && (
          // A full page load on purpose: the route answers with a redirect to Google.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/api/auth/staff"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ember px-6 text-sm font-semibold text-background hover:opacity-90"
          >
            เข้าสู่ระบบด้วย Google
          </a>
        )}
        {password && (
          <>
            {google && <p className="text-xs text-foreground-dim">หรือใช้รหัสทีมงาน (แบบเดิม)</p>}
            <StaffLogin secondary={google} />
          </>
        )}
      </Container>
    );
  }

  const days = orderCountDays(2);
  const switches = readSwitches();

  return (
    <div className="ah-page">
      <div aria-hidden className="ah-aura" />
      <Container className="flex max-w-2xl flex-col pb-10 pt-4 lg:max-w-6xl lg:pt-6">
        <StaffBar />
        <AdminHome
          actor={actor}
          now={readClock()}
          counts={countByJob()}
          waiting={listStaffOrders("todo")}
          days={days}
          // The shared password is nobody in particular — no "what I did today" for it.
          mine={actor.kind === "shared" ? null : myCountsToday(actor, days[0].date)}
          feed={feedHealth()}
          salesTodaySatang={salesToday().totalSatang}
          shop={{
            cartOff: switches.cartOff,
            siteClosed: switches.siteClosed,
            lineToWarehouse: switches.lineToWarehouse,
            autoToWarehouse: switches.autoToWarehouse,
            shipnityReady: shipnityReady(),
          }}
          notice={homeNotice(query, DONE_TEXT, { ...STOCK_ERROR_TEXT, ...ERROR_TEXT })}
          dateLabel={homeDate(days[0].date)}
        />
      </Container>
    </div>
  );
}
