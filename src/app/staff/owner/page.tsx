import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isOwner, ownerAreaEnabled } from "@/lib/owner/auth";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { ownerLogoutAction } from "@/app/staff/owner/actions";

/**
 * /staff/owner — the owner's section (back-office round 07/11). Google sign-in only; the staff password opens nothing here.
 * 404 until OKAMI24_OWNER_GOOGLE_EMAIL is set on the host (src/lib/owner/auth.ts). Not linked from the shop, not in the sitemap.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ส่วนเจ้าของ",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function OwnerPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  if (!ownerAreaEnabled()) notFound();
  const { denied } = await searchParams;

  if (!(await isOwner())) {
    return (
      <Container className="flex max-w-xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
        <header className="flex flex-col gap-2">
          <span className="label-mono text-xs text-ember">OKami24 · เจ้าของ</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">ส่วนเจ้าของ</h1>
          <p className="text-sm leading-relaxed text-foreground-muted">หน้านี้เปิดได้เฉพาะบัญชี Google ของเจ้าของร้าน</p>
        </header>
        {denied !== undefined && <p className="text-sm text-danger">บัญชีนี้เข้าส่วนเจ้าของไม่ได้</p>}
        <a
          href="/api/auth/owner"
          className="inline-flex min-h-12 w-fit items-center rounded-full bg-ember px-6 text-sm font-semibold text-background hover:opacity-90"
        >
          เข้าสู่ระบบด้วย Google
        </a>
      </Container>
    );
  }

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">ส่วนเจ้าของ</h1>
      <form action={ownerLogoutAction}>
        <PendingButton
          className="-ml-2 inline-flex min-h-11 items-center rounded-full px-2 text-sm text-foreground-dim hover:bg-surface-2 hover:text-foreground"
          pendingText="กำลังออก…"
        >
          ออกจากระบบ
        </PendingButton>
      </form>
    </Container>
  );
}
