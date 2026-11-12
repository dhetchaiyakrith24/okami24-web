"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronUp } from "lucide-react";

/**
 * Preview "buyrail" (designer pass d, 12/11 — shared notes look-1211-design-passes.md "D sticky buy rail"): on wide
 * screens (xl+) a 300px buy card rides beside the spec sheet → compatibility → compatible products → FAQ, so a visitor
 * who reads down the page never has to scroll back up to buy. Not beside the gallery / anatomy / feature grid (the owner
 * approved those full width). ProductHero renders this only under `?preview=buyrail` and only after load (usePreview), and
 * it portals into the page's `[data-buy-rail]` wrapper — `display: contents` for customers, a positioned box under the
 * preview (src/app/preview-buyrail.css). Same selection, stock and buy logic as the hero: the hero passes the very nodes
 * it renders (price, count line, buy action), so nothing here decides anything.
 */
export function BuyRail({
  name,
  media,
  optionLabel,
  optionSwatch,
  price,
  countLine,
  buy,
}: {
  name: string;
  /** The picked option's photo (or the card photo while nothing is picked), with its sold-out badge. */
  media: ReactNode;
  /** The picked option's name; null while nothing is picked. */
  optionLabel: string | null;
  optionSwatch?: string;
  price: ReactNode;
  countLine: ReactNode;
  buy: ReactNode;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- find the page's rail slot once, after mount
    setHost(document.querySelector<HTMLElement>("[data-buy-rail]"));
  }, []);
  if (!host) return null;
  const toPicker = () => document.querySelector("[data-option-picker]")?.scrollIntoView({ block: "center", behavior: "smooth" });
  return createPortal(
    <aside className="okb-rail" aria-label={name}>
      <div className="okb-card flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-1 p-5 shadow-2xl">
        <div className="okb-media relative w-full overflow-hidden rounded-xl bg-surface-0">{media}</div>
        <p className="line-clamp-2 font-display text-lg font-semibold leading-snug text-foreground">{name}</p>
        {optionLabel && (
          <button
            type="button"
            onClick={toPicker}
            className="flex items-center gap-2 self-start text-left text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            {optionSwatch && <span className="size-3 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: optionSwatch }} aria-hidden />}
            <span className="line-clamp-1">{optionLabel}</span>
            <ChevronUp size={14} className="shrink-0 text-foreground-dim" aria-hidden />
          </button>
        )}
        <div>{price}</div>
        {countLine}
        <div className="flex flex-col gap-2 [&_form]:flex [&_form]:flex-col [&_form]:gap-2 [&_button]:w-full [&_a]:w-full [&_a]:justify-center">{buy}</div>
      </div>
    </aside>,
    host
  );
}
