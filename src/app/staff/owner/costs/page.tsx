import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner/auth";
import { codesWithoutCost, currentCosts } from "@/lib/owner/costs";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { CostUpload } from "@/app/staff/owner/costs/CostUpload";

/** /staff/owner/costs — the cost table (back-office round 07/11, batch 4): the owner's Excel in, costs on the server's disk, never in git. */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ตารางทุน",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function OwnerCostsPage() {
  await requireOwner();
  const known = currentCosts().size;
  const missing = codesWithoutCost();

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar />
      <Link href="/staff/owner" className="-ml-2 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-foreground hover:bg-surface-2">
        <span aria-hidden>←</span> ส่วนเจ้าของ
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">ตารางทุน</h1>
        <p className="text-sm text-foreground-muted">มีทุน {known} รุ่น · จับคู่ด้วยรหัสคลังเท่านั้น · ออเดอร์เก่าใช้ทุนของวันนั้น</p>
      </div>
      <CostUpload />
      {missing.length > 0 && (
        <section className="flex flex-col gap-1 text-sm">
          <h2 className="text-unverified">สินค้าบนเว็บที่ยังไม่มีทุน {missing.length} รุ่น ออเดอร์ของรุ่นเหล่านี้จะไม่นับกำไร</h2>
          <p className="break-words leading-relaxed text-foreground-muted">{missing.join(" · ")}</p>
        </section>
      )}
    </Container>
  );
}
