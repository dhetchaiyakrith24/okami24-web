"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps the selected colour/flavour chip in view on phones — MOBILE_SPEC M2.2 ("แถบชิปด้านล่าง
 * … เลื่อนตัวเองให้ชิปที่เลือกอยู่ในสายตาเสมอ"), chat A 2026-09-08.
 *
 * On phone/tablet widths a product with more than TILE_LIMIT options shows them as one horizontally scrolling
 * photo strip (PhoneOptionTiles, queue Q5 24/10), so
 * when a swipe on the gallery selects an option whose chip is off to the side, the row scrolls
 * itself so that chip is centred. Horizontal only — the page's vertical position is never
 * touched, which is why this does not use `scrollIntoView` (that would also pull the page up
 * or down to reach the chip). Does nothing at `lg` and above, where the lists wrap instead of
 * scrolling, so the desktop behaviour is exactly as before. Respects reduced motion.
 *
 * The chip buttons mark themselves with `data-option-id`; that is the only contract.
 */
export function useChipAutoscroll(listRef: RefObject<HTMLElement | null>, selectedId: string | null | undefined) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || !selectedId) return;
    if (!window.matchMedia("(max-width: 63.98rem)").matches) return;
    if (list.scrollWidth <= list.clientWidth) return;
    const chip = Array.from(list.querySelectorAll<HTMLElement>("[data-option-id]")).find((el) => el.dataset.optionId === selectedId);
    if (!chip) return;
    const listRect = list.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const delta = chipRect.left - listRect.left - (listRect.width - chipRect.width) / 2;
    if (Math.abs(delta) < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: delta, behavior: reduce ? "auto" : "smooth" });
  }, [listRef, selectedId]);
}
