import Link from "next/link";
import "./admin-home.css";
import { ownerToAdminAction } from "@/app/staff/owner/team/actions";
import { PendingButton } from "@/app/staff/_components/PendingButton";

/**
 * "มุมเจ้าของ | มุมแอดมิน" (owner 10/11, design v2 board 2 passed 11/11): the owner's one switch between the owner's dashboard
 * and the admin home. The yellow count on "มุมแอดมิน" = work waiting on the team. Shown only to the owner — on /staff/owner,
 * and on /staff when the owner is in the admin view. Stepping in without a staff session goes through ownerToAdminAction
 * (the owner's own Google sign-in, recorded as "เจ้าของ" — #1360).
 */
export function OwnerViewPill({
  active,
  waiting,
  ownerHref,
  adminOpen = true,
}: {
  active: "owner" | "admin";
  waiting: number;
  ownerHref: string;
  /** False = the owner has no staff session yet: "มุมแอดมิน" opens one first. */
  adminOpen?: boolean;
}) {
  const side = "flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-[0.95rem]";
  const on = `${side} ah-pill-on font-bold`;
  const off = `${side} font-semibold text-[#ebebeb] hover:bg-white/10`;
  const count = waiting > 0 && (
    <span className="ah-count-wait min-w-6 rounded-full px-2 py-px text-center text-[0.8rem] font-bold tabular-nums" aria-label={`งานรอ ${waiting}`}>
      {waiting}
    </span>
  );
  return (
    <nav aria-label="มุมมอง" className="grid grid-cols-2 gap-1 rounded-full border border-white/14 bg-white/[0.07] p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] lg:max-w-md">
      {active === "owner" ? (
        <span aria-current="page" className={on}>
          มุมเจ้าของ
        </span>
      ) : (
        <Link href={ownerHref} className={off}>
          มุมเจ้าของ
        </Link>
      )}
      {active === "admin" ? (
        <span aria-current="page" className={on}>
          มุมแอดมิน
        </span>
      ) : adminOpen ? (
        <Link href="/staff" className={off}>
          มุมแอดมิน {count}
        </Link>
      ) : (
        <form action={ownerToAdminAction} className="flex">
          <PendingButton className={off} pendingText="กำลังเปิด…">
            มุมแอดมิน {count}
          </PendingButton>
        </form>
      )}
    </nav>
  );
}
