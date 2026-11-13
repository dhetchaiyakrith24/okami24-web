"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { TEAM_MARKER_COOKIE } from "@/lib/staff/team-marker";

/**
 * Is this device the shop team's? (owner 30/10 "ปุ่มสำหรับทีมงาน"; 12/11 the floating "ทีมงาน" pill gave way to the
 * "หลังบ้าน" menu in the header — TeamMenu.tsx.) True on a device where someone logged in to /staff in the last 12 hours:
 * the staff login also sets a plain marker cookie `okami24_team` (src/lib/staff/auth.ts), read here in the browser after
 * load. That keeps every shop page static (the page never reads a cookie), shows nothing to visitors, and adds no /staff
 * link for search engines. The marker proves nothing — /staff still asks for its own login. This file stays the ONE shop
 * file that names the marker (staff-gate-contract-test.ts); Header asks it through useIsTeam(). False on /staff itself.
 */
const subscribe = () => () => {};
const read = () => document.cookie.split("; ").some((c) => c === `${TEAM_MARKER_COOKIE}=1`);
const server = () => false;

export function useIsTeam(): boolean {
  const isTeam = useSyncExternalStore(subscribe, read, server);
  const pathname = usePathname();
  return isTeam && !pathname.startsWith("/staff");
}
