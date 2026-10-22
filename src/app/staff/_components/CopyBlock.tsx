"use client";

import { useState } from "react";

/** A text block with one "copy" button — the warehouse order text on /staff/orders/<n>. */
export function CopyBlock({ text, label, doneLabel }: { text: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <pre className="whitespace-pre-wrap rounded-lg border border-surface-border-soft bg-surface-2 p-3 text-sm leading-relaxed text-foreground">{text}</pre>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          } catch {
            /* clipboard blocked — the text above can still be selected by hand */
          }
        }}
        className="self-start rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong"
      >
        {done ? doneLabel : label}
      </button>
    </div>
  );
}
