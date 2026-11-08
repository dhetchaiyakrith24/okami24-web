"use client";

import { useState } from "react";

/** One tracking number with a copy button — the carriers' pages take no number in their address, so staff paste it. */
export function CopyNumber({ number }: { number: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(number);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard blocked — the number stays selectable by hand */
        }
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-surface-border px-4 text-sm font-semibold tabular-nums text-foreground transition-colors hover:border-foreground-dim"
    >
      <span className="select-all">{number}</span>
      <span className="text-xs font-normal text-foreground-dim">{done ? "คัดลอกแล้ว" : "คัดลอก"}</span>
    </button>
  );
}
