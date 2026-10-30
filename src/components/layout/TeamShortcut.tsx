"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { TEAM_MARKER_COOKIE } from "@/lib/staff/team-marker";

/**
 * "ทีมงาน" — a small button on the shop pages for the shop's own team (owner 30/10: "เพิ่มปุ่มสำหรับทีมงาน … ให้ทีมงานเข้ามากด
 * ตรวจออเดอร์ ส่งออเดอร์ เช็กสต็อก"). It shows only on a device where someone has logged in to /staff in the last 12 hours:
 * the staff login also sets a plain marker cookie `okami24_team` (src/lib/staff/auth.ts), and this component reads it in the
 * browser after the page has loaded. That keeps every shop page static (the page itself never reads a cookie), shows nothing
 * to visitors, and adds no link to /staff for search engines. The marker proves nothing — /staff still asks for its own login.
 */
const subscribe = () => () => {};
const read = () => document.cookie.split("; ").some((c) => c === `${TEAM_MARKER_COOKIE}=1`);
const server = () => false;

export function TeamShortcut() {
  const isTeam = useSyncExternalStore(subscribe, read, server);
  const pathname = usePathname();
  if (!isTeam || pathname.startsWith("/staff")) return null;
  return (
    <Link
      href="/staff"
      prefetch={false}
      className="team-shortcut fixed z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-surface-border bg-surface-1/95 px-4 text-sm font-semibold text-foreground shadow-2xl backdrop-blur-md transition-colors hover:border-foreground-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      style={{
        // Same lift as the LINE button: above the product page's sticky buy bar on phones.
        bottom: "calc(1rem + var(--okami-fab-lift, 0px) + env(safe-area-inset-bottom, 0px))",
        left: "calc(1rem + env(safe-area-inset-left, 0px))",
      }}
    >
      <span aria-hidden className="h-2 w-2 rounded-full bg-ember" />
      ทีมงาน
    </Link>
  );
}
