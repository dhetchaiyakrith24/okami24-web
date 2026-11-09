import Link from "next/link";
import type { ComponentProps } from "react";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { ShopSwitchPanel } from "@/app/staff/owner/_dash/ShopSwitchPanel";
import { ownerLogoutAction } from "@/app/staff/owner/actions";
import { ownerToAdminAction } from "@/app/staff/owner/team/actions";

/** The owner's switches and other pages. */

function Go({ href, label, line, warn }: { href: string; label: string; line: string; warn?: boolean }) {
  return (
    <li>
      <Link href={href} className="flex min-h-14 items-center justify-between gap-3 py-1 hover:text-ember-strong">
        <span className="text-foreground">{label}</span>
        <span className={`text-sm ${warn ? "text-unverified" : "text-foreground-muted"}`}>{line} ›</span>
      </Link>
    </li>
  );
}

const ddmm = (at: string) => `${at.slice(8, 10)}/${at.slice(5, 7)}`;

export function ControlPanel({
  switches,
  noCost,
  teamHome,
  billDue,
  team,
}: {
  switches: ComponentProps<typeof ShopSwitchPanel>;
  noCost: number;
  teamHome: boolean;
  billDue: { from: string; to: string } | null;
  /** Owner 10/11: the admins' accounts — how many, and how many have not signed in with Google yet. */
  team: { active: number; notSignedIn: number };
}) {
  return (
    <>
      <ShopSwitchPanel {...switches} />
      <section aria-label="จัดการ" className="dash-card dash-rise">
        <h2 className="font-semibold text-foreground">จัดการ</h2>
        <ul className="dash-rows flex flex-col">
          <Go href="/staff/owner/bill#new" label="เทียบบิลคลัง" line={billDue ? `รอบ ${ddmm(billDue.from)}–${ddmm(billDue.to)} ยังไม่วาง` : "วางไฟล์ทุกเสาร์"} warn={Boolean(billDue)} />
          <Go href="/staff/owner/costs" label="ตารางทุน" line={noCost > 0 ? `ไม่มีทุน ${noCost} รหัส` : "อัปเดตทุน"} warn={noCost > 0} />
          <Go
            href="/staff/owner/team"
            label="ทีมงาน"
            line={team.active === 0 ? "เพิ่มแอดมิน" : team.notSignedIn > 0 ? `ยังไม่เคยเข้า ${team.notSignedIn} คน` : `แอดมิน ${team.active} คน`}
            warn={team.active === 0 || team.notSignedIn > 0}
          />
          {teamHome ? (
            <Go href="/staff" label="หน้างานทีม" line="ออเดอร์และสต็อก" />
          ) : (
            // Owner 10/11: the owner steps into the admin view with this sign-in — no team password, recorded as "เจ้าของ".
            <li>
              <form action={ownerToAdminAction}>
                <PendingButton className="flex min-h-14 w-full items-center justify-between gap-3 py-1 text-left hover:text-ember-strong" pendingText="กำลังเปิด…">
                  <span className="text-foreground">หน้างานทีม</span>
                  <span className="text-sm text-foreground-muted">ออเดอร์และสต็อก ›</span>
                </PendingButton>
              </form>
            </li>
          )}
        </ul>
      </section>
      <form action={ownerLogoutAction} className="dash-rise">
        <PendingButton className="-ml-3 inline-flex min-h-11 items-center rounded-full px-3 text-sm text-foreground-muted hover:bg-white/5 hover:text-foreground" pendingText="กำลังออก…">
          ออกจากระบบ
        </PendingButton>
      </form>
    </>
  );
}
