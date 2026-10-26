"use client";

import { useState } from "react";

/** A text block with one "copy" button — the warehouse order text on /staff/orders/<n>. */
/** `outline` (staff redesign 26/10): when the card's main button sits right below, copying must not look like that step. */
export function CopyBlock({ text, label, doneLabel, outline = false }: { text: string; label: string; doneLabel: string; outline?: boolean }) {
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
        className={
          outline
            ? "self-start rounded-full border border-surface-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground-dim"
            : "self-start rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong"
        }
      >
        {done ? doneLabel : label}
      </button>
    </div>
  );
}
