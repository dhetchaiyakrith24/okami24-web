"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard } from "lucide-react";

/**
 * "หลังบ้าน" — the shop team's way into /staff from any shop page (owner 12/11 picks via Friday: name "หลังบ้าน", way A,
 * the floating "ทีมงาน" pill removed). Loaded by Header with next/dynamic ONLY on a device that carries the team marker
 * (useIsTeam in TeamShortcut.tsx — the one shop file allowed to read it), so visitors download none of this and the shop
 * HTML gains no /staff link. Every link is prefetch={false}: /staff asks for its own login, a prefetch would only bounce.
 *   - TeamDrawerSection: the top of the burger drawer (below xl) — "+ คีย์ออเดอร์ LINE" full row, then 2-column tiles.
 *   - TeamHeaderMenu: from sm the header's heart slot becomes a dashboard icon with an orange dot; a click opens a panel like
 *     the "สินค้า" menu (Esc / outside click closes). Its last row is "รายการโปรด", so favourites stay one click away.
 * No /staff/owner here: the marker cookie carries no role (designer pass e).
 */
const KEY_LINE = { href: "/staff/line-order", label: "+ คีย์ออเดอร์ LINE" };
const LINKS = [
  { href: "/staff", label: "งานรอทำ" },
  { href: "/staff/orders?f=all", label: "ออเดอร์" },
  { href: "/staff/slip", label: "ตรวจสลิป LINE" },
  { href: "/staff/stock", label: "เช็คสต็อก" },
  { href: "/staff/tracking", label: "เช็คพัสดุ" },
  { href: "/staff/sales", label: "ยอดเงินรายวัน" },
];
const TITLE = "หลังบ้าน";

export function TeamDrawerSection() {
  return (
    <div className="mb-3 flex flex-col gap-2 border-b border-surface-border-soft pb-4" data-team-menu="drawer">
      <span className="label-mono flex items-center gap-2 px-3 py-2 text-xs text-foreground-dim">
        <span aria-hidden className="size-2 rounded-full bg-ember" />
        {TITLE}
      </span>
      <Link
        href={KEY_LINE.href}
        prefetch={false}
        className="flex min-h-12 items-center justify-center rounded-xl bg-ember px-4 text-base font-semibold text-[#181008] transition-colors hover:brightness-110"
      >
        {KEY_LINE.label}
      </Link>
      <div className="grid grid-cols-2 gap-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            prefetch={false}
            className="flex min-h-11 items-center rounded-xl border border-surface-border-soft bg-surface-1 px-3 text-sm font-semibold text-foreground hover:bg-surface-2"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TeamHeaderMenu({ favoritesLabel }: { favoritesLabel: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  const item = "block rounded-lg px-3 py-2 text-sm text-foreground-muted hover:bg-surface-2 hover:text-foreground";
  return (
    <div ref={rootRef} className="relative hidden sm:inline-flex" data-team-menu="header">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={TITLE}
        title={TITLE}
        className="relative rounded-full p-2 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <LayoutDashboard size={19} aria-hidden />
        <span aria-hidden className="absolute right-1 top-1 size-2 rounded-full bg-ember" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-surface-border bg-surface-1 p-2 shadow-2xl" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          <span className="label-mono block px-3 py-2 text-xs text-foreground-dim">{TITLE}</span>
          <Link href={KEY_LINE.href} prefetch={false} className="block rounded-lg px-3 py-2 text-sm font-semibold text-ember hover:bg-surface-2">
            {KEY_LINE.label}
          </Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} prefetch={false} className={item}>
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-surface-border-soft" />
          <Link href="/favorites" className={item}>
            {favoritesLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
