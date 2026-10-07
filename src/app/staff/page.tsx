import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { easySlipConfigured, getQuota } from "@/lib/staff/easyslip";
import { recentChecks } from "@/lib/staff/slip-checks";
import { staffLogoutAction } from "@/app/staff/actions";
import { StaffLogin } from "@/app/staff/_components/StaffLogin";
import { SlipChecker } from "@/app/staff/_components/SlipChecker";

/**
 * /staff — the staff-only slip-check page (owner ruling 2026-10-07, docs/BUSINESS_SOURCE_OF_TRUTH.md §9
 * "one exception"; round file docs/rounds/รอบ-ตรวจสลิป-หน้าทีมงาน-07-10.txt).
 *
 * Not for customers and not for search: no link to it anywhere on the site, not in the sitemap, noindex
 * here. It is also deliberately NOT listed in robots.txt — that file is public, and listing the path
 * there would only advertise it. 404 until the owner sets OKAMI24_STAFF_PASSWORD on the host.
 * The page only helps a person check a slip; it never changes an order.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ตรวจสลิป (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffPage() {
  if (!staffAreaEnabled()) notFound();
  const loggedIn = await isStaff();

  const configured = loggedIn && easySlipConfigured();
  const quota = configured ? await getQuota() : null;

  return (
    <Container className="flex max-w-xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
      <header className="flex flex-col gap-2">
        <span className="label-mono text-xs text-ember">OKami24 · ทีมงาน</span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">ตรวจสลิปโอนเงิน</h1>
        <p className="text-sm leading-relaxed text-foreground-muted">
          {loggedIn ? (
            <>
              อัปโหลดรูปสลิปจากลูกค้า แล้วดูผลยืนยันจากธนาคาร <span className="whitespace-nowrap">ทั้งยอดเงิน</span> เวลาโอน
              และบัญชีผู้รับ
            </>
          ) : (
            "หน้านี้สำหรับทีมงานร้านเท่านั้น ใส่รหัสทีมงานเพื่อเข้าใช้"
          )}
        </p>
      </header>

      {loggedIn ? (
        <>
          <SlipChecker
            configured={configured}
            initialQuota={quota && quota.ok ? quota.data : null}
            recent={recentChecks(30)}
          />
          <form action={staffLogoutAction} className="flex justify-center">
            <button type="submit" className="text-sm text-foreground-dim underline-offset-4 hover:text-foreground hover:underline">
              ออกจากระบบ
            </button>
          </form>
        </>
      ) : (
        <StaffLogin />
      )}
    </Container>
  );
}
