"use client";

import Link from "next/link";
import { useState } from "react";

export interface Alert {
  text: string;
  href?: string;
  tone: "danger" | "warn";
  /** A view that already says this in a card, so the chip would only repeat it there. */
  hideOn?: string;
}

const TONE = { danger: "text-danger", warn: "text-unverified" };
const SHOWN = 3;

/**
 * What needs a look, most urgent first (the caller orders them). Three at most, then "+N". A chip that opens a page looks
 * like a button and says so with "›"; one that cannot be tapped is only a dot and words. Plain data in, nothing of its own.
 */
export function Alerts({ alerts, view }: { alerts: Alert[]; view: string }) {
  const [all, setAll] = useState(false);
  // A chip a view repeats is gone on that view, and on a wide screen, where every view is open at once.
  const live = alerts.filter((a) => a.hideOn !== view);
  if (live.length === 0) return null;
  const shown = all ? live : live.slice(0, SHOWN);
  const more = live.length - shown.length;
  return (
    <ul aria-label="เรื่องที่ควรดู" className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {shown.map((a, i) => (
        // On a phone the third chip makes way for "+N" when more wait, so "+N" never sits alone on a second line.
        <li key={a.text} className={`${a.hideOn ? "lg:hidden" : ""} ${more > 0 && i === SHOWN - 1 ? "max-sm:hidden" : ""}`}>
          {a.href ? (
            <Link href={a.href} className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 text-sm font-medium hover:bg-white/10 ${TONE[a.tone]}`}>
              {a.text} <span aria-hidden>›</span>
            </Link>
          ) : (
            <span className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-medium ${TONE[a.tone]}`}>
              <span aria-hidden className={`size-2 rounded-full ${a.tone === "danger" ? "bg-danger" : "bg-unverified"}`} />
              {a.text}
            </span>
          )}
        </li>
      ))}
      {more > 0 && (
        <li>
          <button type="button" onClick={() => setAll(true)} className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-foreground-muted hover:text-foreground">
            <span className="sm:hidden">+{more + 1}</span>
            <span className="max-sm:hidden">+{more}</span>
          </button>
        </li>
      )}
    </ul>
  );
}
