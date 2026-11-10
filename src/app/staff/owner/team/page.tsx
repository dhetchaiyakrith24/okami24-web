import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner/auth";
import { readSwitches } from "@/lib/commerce/shop-switches";
import { listAccounts } from "@/lib/staff/accounts";
import { googleStaffSignIn } from "@/lib/staff/auth";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { formatShortDateTime } from "@/app/staff/_components/format";
import { AddAdmin } from "@/app/staff/owner/team/AddAdmin";
import { renameAdminAction, setAdminActiveAction, setSharedPasswordAction } from "@/app/staff/owner/team/actions";
import "@/components/dashboard/dashboard.css";

/**
 * /staff/owner/team — "ทีมงาน" (owner 10/11 chat: "admin แต่ละคนมีบัญชีของตัวเอง"). The owner adds an admin by name + Google
 * address, renames or disables them, and closes the shared team password once every admin has signed in with Google.
 * Accounts = src/lib/staff/accounts.ts · sign-in = src/lib/staff/auth.ts. The owner's eyes only (requireOwner).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ทีมงาน",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const BUTTON = "inline-flex min-h-11 items-center rounded-full border px-4 text-sm";

export default async function OwnerTeamPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireOwner();
  const { error } = await searchParams;
  const accounts = listAccounts();
  const active = accounts.filter((a) => a.active);
  const signedIn = active.filter((a) => a.lastSignInAt).length;
  const passwordSet = (process.env.OKAMI24_STAFF_PASSWORD?.trim().length ?? 0) >= 8;
  const passwordOff = readSwitches().staffPasswordOff;

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar />
      <Link href="/staff/owner" className="-ml-2 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-foreground hover:bg-surface-2">
        <span aria-hidden>←</span> ส่วนเจ้าของ
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">ทีมงาน</h1>
        <p className="text-sm text-foreground-muted">แอดมินแต่ละคนเข้าหน้าทีมงานด้วยบัญชี Google ของตัวเอง ทุกอย่างที่กดบันทึกในชื่อคนนั้น</p>
      </div>
      <Link href="/staff/owner/team/activity" className="dash-card flex-row! items-center justify-between hover:text-ember-strong">
        <span className="font-semibold text-foreground">ใครทำอะไร</span>
        <span className="text-sm text-foreground-muted">ดูรายวัน แยกตามคน ›</span>
      </Link>
      {!googleStaffSignIn() && <p className="text-sm text-danger">ระบบเข้าด้วย Google ยังไม่ได้ตั้งค่าบนเครื่องเว็บ แอดมินจะยังเข้าด้วย Google ไม่ได้</p>}
      {error === "name" && <p className="text-sm text-danger">ชื่อไม่ถูกต้อง ใส่ 1–30 ตัวอักษร</p>}

      <section aria-label="แอดมิน" className="dash-card flex flex-col gap-3">
        <h2 className="font-semibold text-foreground">แอดมิน {active.length} คน</h2>
        {accounts.length === 0 && <p className="text-sm text-foreground-muted">ยังไม่มี — เพิ่มด้านล่าง</p>}
        <ul className="flex flex-col gap-3">
          {accounts.map((a) => (
            <li key={a.id} className={`flex flex-col gap-2 rounded-2xl bg-surface-2 p-3 ${a.active ? "" : "opacity-70"}`}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-foreground">{a.name}</span>
                <span className={`text-sm ${!a.active ? "text-danger" : a.lastSignInAt ? "text-verified" : "text-unverified"}`}>
                  {!a.active ? "ปิดบัญชีแล้ว" : a.lastSignInAt ? "ใช้งานอยู่" : "ยังไม่เคยเข้า"}
                </span>
              </div>
              <span className="break-all text-sm text-foreground-muted">{a.email}</span>
              {a.lastSignInAt && <span className="text-sm text-foreground-muted">เข้าล่าสุด {formatShortDateTime(a.lastSignInAt)}</span>}
              <details className="text-sm">
                <summary className="inline-flex min-h-11 cursor-pointer items-center text-foreground-muted hover:text-foreground">เปลี่ยนชื่อ · ปิด/เปิดบัญชี</summary>
                <div className="flex flex-col gap-3 pt-2">
                  <form action={renameAdminAction} className="flex gap-2">
                    <input type="hidden" name="id" value={a.id} />
                    <label className="flex min-w-0 flex-1">
                      <span className="sr-only">ชื่อใหม่ของ {a.name}</span>
                      <input name="name" defaultValue={a.name} maxLength={30} required className="min-h-11 w-full min-w-0 rounded-full border border-surface-border bg-surface-0 px-4 text-base text-foreground" />
                    </label>
                    <PendingButton className={`${BUTTON} border-surface-border text-foreground hover:bg-white/5`} pendingText="กำลังบันทึก…">
                      บันทึกชื่อ
                    </PendingButton>
                  </form>
                  <form action={setAdminActiveAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="value" value={a.active ? "off" : "on"} />
                    <PendingButton
                      className={`${BUTTON} ${a.active ? "border-danger/50 text-danger hover:bg-danger/10" : "border-surface-border text-foreground hover:bg-white/5"}`}
                      pendingText="กำลังทำ…"
                    >
                      {a.active ? `ปิดบัญชี ${a.name} (ออกจากระบบทันที)` : `เปิดบัญชี ${a.name} อีกครั้ง`}
                    </PendingButton>
                  </form>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>

      <AddAdmin />

      {passwordSet && (
        <section aria-label="รหัสร่วมทีมงาน" className="dash-card flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-foreground">รหัสร่วมทีมงาน (แบบเดิม)</h2>
            <span className={`text-sm font-semibold ${passwordOff ? "text-foreground-muted" : "text-unverified"}`}>{passwordOff ? "ปิดแล้ว" : "เปิดอยู่"}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground-muted">
            {passwordOff
              ? "เข้าหน้าทีมงานได้ด้วย Google เท่านั้น เปิดกลับได้ทุกเมื่อ"
              : `คนที่เข้าด้วยรหัสร่วม ระบบไม่รู้ว่าเป็นใคร · แอดมินเข้าด้วย Google แล้ว ${signedIn} จาก ${active.length} คน${active.length > 0 && signedIn === active.length ? " — ปิดได้แล้ว" : ""}`}
          </p>
          <form action={setSharedPasswordAction}>
            <input type="hidden" name="value" value={passwordOff ? "on" : "off"} />
            <PendingButton className={`${BUTTON} border-surface-border text-foreground hover:bg-white/5`} pendingText="กำลังทำ…">
              {passwordOff ? "เปิดรหัสร่วมอีกครั้ง" : "ปิดรหัสร่วม (คนที่เข้าด้วยรหัสอยู่จะออกทันที)"}
            </PendingButton>
          </form>
        </section>
      )}
    </Container>
  );
}
