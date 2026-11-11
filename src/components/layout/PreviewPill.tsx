"use client";

import { useSyncExternalStore } from "react";
import { endPreview, previewWord } from "@/lib/preview";

/**
 * "พรีวิว" — the small pill that says this device is looking at a design draft (owner 12/11, preview links — src/lib/preview.ts),
 * with the one button that turns it off. Shows only where `<html data-preview>` is set (by the inline head script, before
 * paint), so customers and search engines never get it: the server renders nothing and the page stays static.
 * Top right under the header — the bottom corners belong to the LINE button and the team button.
 */
const subscribe = () => () => {};
const server = () => null;

export function PreviewPill() {
  const word = useSyncExternalStore(subscribe, previewWord, server);
  if (!word) return null;
  return (
    <div
      role="status"
      lang="th"
      className="fixed right-[calc(0.75rem+env(safe-area-inset-right,0px))] top-[4.5rem] z-40 inline-flex items-center gap-1 rounded-full border border-surface-border bg-surface-1/95 py-1 pl-3 pr-1 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-md sm:top-[5.75rem]"
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ember" />
      <span className="px-1">พรีวิว</span>
      <button
        type="button"
        onClick={endPreview}
        className="inline-flex min-h-8 items-center rounded-full border border-surface-border px-3 text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        ปิด
      </button>
    </div>
  );
}
