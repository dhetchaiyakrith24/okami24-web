import Link from "next/link";

export type StaffSection = "home" | "orders" | "slip";

const TABS: { key: StaffSection; href: string; label: string }[] = [
  { key: "home", href: "/staff", label: "หน้าแรก" },
  { key: "orders", href: "/staff/orders", label: "ออเดอร์" },
  { key: "slip", href: "/staff/slip", label: "ตรวจสลิป" },
];

/* Phones/tablets: the tab bar is fixed to the bottom edge, so the page gets room under its last line and the floating LINE
   button climbs above it (phones: hidden — staff do not need the shop's LINE button here). Same mechanism as the product
   page's buy bar in globals.css (body:has(.mobile-buy-bar)), kept here so only staff pages carry it. */
const TABBAR_CSS = `@media (max-width: 63.98rem){body:has(.staff-tabbar){padding-bottom:calc(4.5rem + env(safe-area-inset-bottom,0px));--okami-fab-lift:4.25rem}}
@media (max-width: 39.98rem){body:has(.staff-tabbar) .okami-line-fab{display:none}}`;

/**
 * The staff menu on every staff page (owner 26/10, queue B3: "ย้อนกลับ/ไปหน้าอื่นยาก · ใช้บนมือถือ"; designer direction
 * 26/10). Two parts:
 *  - Back: the first line of the page, naming where it goes ("← รอส่งคลัง"), not fixed — the home has none;
 *  - the three staff places: a tab bar fixed to the bottom of the screen on phones/tablets (thumb reach, always there on a
 *    long order page, and it does not stack under the already-sticky site header), plain tabs under the header from `lg`.
 * `todo` = orders waiting on the team, shown as a yellow count on the Orders tab.
 */
export function StaffBar({ current, back, todo = 0 }: { current: StaffSection; back?: { href: string; label: string }; todo?: number }) {
  return (
    <>
      <style>{TABBAR_CSS}</style>
      <nav
        aria-label="เมนูทีมงาน"
        className="staff-tabbar fixed inset-x-0 bottom-0 z-40 border-t border-surface-border-soft bg-surface-0/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:static lg:z-auto lg:border-t-0 lg:border-b lg:bg-transparent lg:pb-0 lg:backdrop-blur-none"
      >
        <ul className="mx-auto grid h-14 max-w-xl grid-cols-3 lg:mx-0 lg:flex lg:h-auto lg:max-w-none lg:gap-1">
          {TABS.map((t) => {
            const active = current === t.key;
            return (
              <li key={t.key} className="flex">
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 text-sm lg:min-h-11 lg:flex-none lg:px-3 ${
                    active ? "font-semibold text-ember" : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {active && <span aria-hidden className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-ember lg:inset-x-3 lg:bottom-0 lg:top-auto" />}
                  {t.label}
                  {t.key === "orders" && todo > 0 && (
                    <span className="rounded-full bg-unverified/15 px-1.5 text-xs font-bold tabular-nums text-unverified">{todo}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
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
