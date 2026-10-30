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
      // Mirrors the LINE button on the opposite edge (designer 30/10): phone 1rem + the buy-bar lift + safe areas, 48 px tall like
      // the LINE bubble; from sm 2rem from the edge like the LINE pill, lifted above the buy bar below lg only.
      className="team-shortcut fixed bottom-[calc(1rem+var(--okami-fab-lift,0px)+env(safe-area-inset-bottom,0px))] left-[calc(1rem+env(safe-area-inset-left,0px))] z-30 inline-flex min-h-12 items-center gap-2 rounded-full border border-surface-border bg-surface-1/95 px-4 text-sm font-semibold text-foreground shadow-2xl backdrop-blur-md transition-colors hover:border-foreground-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember sm:bottom-8 sm:left-8 sm:max-lg:bottom-[calc(2rem+var(--okami-fab-lift,0px))]"
    >
      <span aria-hidden className="h-2 w-2 rounded-full bg-ember" />
      ทีมงาน
    </Link>
  );
}
