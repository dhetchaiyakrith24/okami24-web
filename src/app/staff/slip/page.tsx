import type { Metadata } from "next";
import Link from "next/link";
import { countByJob } from "@/lib/staff/orders";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { easySlipConfigured, getQuota } from "@/lib/staff/easyslip";
import { recentChecks } from "@/lib/staff/slip-checks";
import { SlipChecker } from "@/app/staff/_components/SlipChecker";
import { StaffBar } from "@/app/staff/_components/StaffBar";

/**
 * /staff/slip — the slip-check tool (owner ruling 2026-10-07, BSOT §9 "one exception"; round file
 * docs/rounds/รอบ-ตรวจสลิป-หน้าทีมงาน-07-10.txt): staff upload a slip a customer sent in LINE and read the bank's answer.
 * It never changes an order. Lived on /staff itself until the staff redesign (owner 26/10, queue B3) made /staff the
 * job board. Same lock as every staff page: 404 until the staff password is set, the login on /staff otherwise.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ตรวจสลิป (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffSlipPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const configured = easySlipConfigured();
  const quota = configured ? await getQuota() : null;
  const waitingSlips = countByJob().slip;

  return (
    <Container className="flex max-w-xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar tab="slip" />
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">ตรวจสลิปโอนเงิน</h1>
        <p className="text-sm leading-relaxed text-foreground-muted">
          อัปโหลดรูปสลิปจากลูกค้า แล้วดูผลยืนยันจากธนาคาร <span className="whitespace-nowrap">ทั้งยอดเงิน</span> เวลาโอน และบัญชีผู้รับ
          · สลิปของออเดอร์เว็บ ระบบตรวจให้แล้วในหน้าออเดอร์
        </p>
        {/* Designer 28/10: someone who came here for a web order's slip finds its list in one tap. */}
        <Link href="/staff/orders?f=slip" className="w-fit text-sm font-semibold text-foreground hover:underline">
          ออเดอร์เว็บรอตรวจสลิป · <span className={waitingSlips > 0 ? "text-unverified" : "text-foreground-dim"}>{waitingSlips}</span> →
        </Link>
      </header>
      <SlipChecker configured={configured} initialQuota={quota && quota.ok ? quota.data : null} recent={recentChecks(30)} />
    </Container>
  );
}
