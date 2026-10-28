import Link from "next/link";
import { StaffTiles, type StaffTab } from "@/app/staff/_components/StaffTiles";

/* Phones: the shop's floating LINE button would sit over the staff page's main button — staff do not need it here. */
const STAFF_CSS = `@media (max-width: 39.98rem){body:has(.staff-page) .okami-line-fab{display:none}}`;

/**
 * The staff page's one way back (staff declutter 27/10 — owner: "ปุ่ม เมนู กล่อง ในการทำงาน"; designer 27/10 "one way per
 * job"): the first line of the page, naming where it goes ("← งาน" · "← รอส่งคลัง"). The bottom tab bar of round B3 is gone:
 * after the home became the job list ("งาน") staff only move between that list and an order, and the bar was a third
 * navigation beside the site menu and this link. The "งาน" page itself has no back link.
 * The three section pages (ออเดอร์ · ตรวจสลิป · Okami dev) show the section boxes instead (`tab`, owner 28/10).
 */
export function StaffBar({ back, tab }: { back?: { href: string; label: string }; tab?: StaffTab }) {
  return (
    <>
      <style>{STAFF_CSS}</style>
      <span hidden className="staff-page" />
      {tab && <StaffTiles active={tab} />}
      {back && (
        <Link
          href={back.href}
          className="-ml-2 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-foreground hover:bg-surface-2"
        >
          <span aria-hidden>←</span> {back.label}
        </Link>
      )}
    </>
  );
}
