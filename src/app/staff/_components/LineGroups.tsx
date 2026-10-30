import { assignLineGroupAction } from "@/app/staff/actions";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { getGroupName } from "@/lib/line/client";
import { listGroups, type GroupRole } from "@/lib/line/groups";

const ROLE_LABEL: Record<GroupRole, string> = {
  order: "กลุ่มแจ้งออเดอร์",
  slip: "กลุ่มตรวจสลิป",
};

/**
 * The LINE groups the alert bot "OKM ORDER" has been invited into, and which one gets new-order alerts / answers slips
 * (cart round 22/10). A group appears here by itself once the bot is invited; staff press one button per group.
 */
export async function LineGroups() {
  const groups = listGroups();
  const names = await Promise.all(groups.map((g) => getGroupName(g.groupId)));

  return (
    <section id="line-groups" className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
      <h2 className="text-base font-semibold text-foreground">กลุ่มไลน์ของบอท OKM ORDER</h2>
      {groups.length === 0 ? (
        <p className="text-sm leading-relaxed text-foreground-muted">
          ยังไม่มีกลุ่ม เชิญบอทเข้ากลุ่ม OKM Order และ OKM Slip แล้วโหลดหน้านี้ใหม่
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-surface-border-soft">
          {groups.map((g, i) => (
            <li key={g.groupId} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">{names[i] ?? "กลุ่ม (อ่านชื่อไม่ได้)"}</span>
                <span className="text-xs text-foreground-dim">{g.role ? ROLE_LABEL[g.role] : "ยังไม่ได้ตั้ง"}</span>
              </div>
              <form action={assignLineGroupAction} className="flex flex-wrap gap-2">
                <input type="hidden" name="groupId" value={g.groupId} />
                {(["order", "slip"] as const).map((role) => (
                  <PendingButton
                    key={role}
                    name="role"
                    value={role}
                    disabled={g.role === role}
                    pendingText="กำลังตั้ง…"
                    className="rounded-full border border-surface-border px-4 py-2 text-sm text-foreground transition-colors hover:border-foreground-dim disabled:opacity-40"
                  >
                    ใช้เป็น{ROLE_LABEL[role]}
                  </PendingButton>
                ))}
                {g.role && (
                  <PendingButton
                    name="role"
                    value=""
                    pendingText="กำลังตั้ง…"
                    className="rounded-full px-4 py-2 text-sm text-foreground-dim underline-offset-4 hover:text-foreground hover:underline"
                  >
                    เลิกใช้
                  </PendingButton>
                )}
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
