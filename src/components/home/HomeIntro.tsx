"use client";

import { useSyncExternalStore } from "react";
import { CinematicIntro } from "./cinematic/CinematicIntro";

/**
 * Mobile round C — MOBILE_SPEC [M1]: the scroll-scrubbed cinematic intro is DESKTOP ONLY.
 *
 * Measured before this existed (headless Chrome, 390x800, build of d3e772f): the intro's scroll
 * track was 2560px tall on a phone, and the real Hero's heading did not start until 2747px down.
 * Nothing about it was time-based, so "make the intro shorter" was never possible by tuning a
 * duration — a phone visitor had to scroll 3.2 screens of a sticky full-screen stage before the
 * store appeared. The owner's rule is the opposite: a phone must see the product, the heading and
 * the buttons in the first frame.
 *
 * Why this shape, and not one of the simpler ones:
 *  - The server always emits the intro inside `hidden lg:block`. So the HTML is identical for
 *    every visitor (no user-agent branching, which the spec forbids), and CSS — not JavaScript —
 *    decides in the very first frame. A phone therefore never flashes the black stage, and
 *    `display: none` also means the 320vh track contributes no height at all.
 *  - After hydration `useSyncExternalStore` re-reads the same 64rem breakpoint Tailwind's `lg`
 *    uses and, on a phone, drops `CinematicIntro` out of the tree for real — its scroll listener,
 *    its spring, the endless SCROLL arrow and five product images all stop existing rather than
 *    merely being invisible. `getServerSnapshot` returns desktop, so a desktop browser hydrates
 *    the exact tree it was sent and never re-renders: no remount, no flash, no pixel moved.
 *
 * `CinematicIntro` itself is deliberately NOT edited by this round — the desktop intro must stay
 * byte-for-byte what the owner already approved.
 */
const DESKTOP_QUERY = "(min-width: 64rem)";

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/** Desktop is the snapshot the HTML is built from — see the block comment above. */
function getServerSnapshot() {
  return true;
}

export function HomeIntro() {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isDesktop) return null;

  // Round 30.4ค batch 8 (LAUNCH_AUDIT 36): the intro's `.label-mono` marks are Latin brand marks
  // (UWELL · VOOPOO · SALTHUB · OKAMI24 · SCROLL) with their own wide tracking; lang="en" keeps them
  // out of the Thai `.label-mono` rule in globals.css without touching cinematic/ itself.
  return (
    <div className="hidden lg:block" lang="en">
      <CinematicIntro />
    </div>
  );
}
