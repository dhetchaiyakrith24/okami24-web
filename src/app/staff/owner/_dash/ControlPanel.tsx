import Link from "next/link";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { ownerLogoutAction } from "@/app/staff/owner/actions";

/** The shop as it stands, and the owner's other pages. */

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

export function ControlPanel({ ordering, noCost, teamHome, billDue }: { ordering: boolean; noCost: number; teamHome: boolean; billDue: { from: string; to: string } | null }) {
  return (
    <>
      <section aria-label="ร้านตอนนี้" className="dash-card dash-rise">
        <h2 className="font-semibold text-foreground">ร้านตอนนี้</h2>
        <ul className="dash-rows flex flex-col">
          <li className="flex min-h-14 items-center justify-between gap-3 py-1">
            <span className="text-foreground">ตะกร้าและการสั่งซื้อ</span>
            <span className={`text-sm ${ordering ? "text-verified" : "text-unverified"}`}>{ordering ? "เปิดอยู่" : "ปิดอยู่ สั่งผ่าน LINE"}</span>
          </li>
        </ul>
      </section>
      <section aria-label="จัดการ" className="dash-card dash-rise">
        <h2 className="font-semibold text-foreground">จัดการ</h2>
        <ul className="dash-rows flex flex-col">
          <Go href="/staff/owner/bill#new" label="เทียบบิลคลัง" line={billDue ? `รอบ ${ddmm(billDue.from)}–${ddmm(billDue.to)} ยังไม่วาง` : "วางไฟล์ทุกเสาร์"} warn={Boolean(billDue)} />
          <Go href="/staff/owner/costs" label="ตารางทุน" line={noCost > 0 ? `ไม่มีทุน ${noCost} รหัส` : "อัปเดตทุน"} warn={noCost > 0} />
          {teamHome && <Go href="/staff" label="หน้างานทีม" line="ออเดอร์และสต็อก" />}
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
