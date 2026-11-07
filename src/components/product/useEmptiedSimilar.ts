"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { SimilarItem } from "@/lib/similar-in-stock";

/**
 * The closest models for a page the warehouse emptied after the build (round popular models 07/11). A page built with stock
 * carries no list, so it asks /api/similar once when the live stock says every option has gone. The block, the head's jump
 * button and the related row read the same answer, so no card shows twice. A failed request leaves the page as it was built.
 */

const NONE: SimilarItem[] = [];
let answer: { slug: string; items: SimilarItem[] } = { slug: "", items: NONE };
let asked = "";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function ask(slug: string) {
  if (asked === slug) return;
  asked = slug;
  fetch(`/api/similar?slug=${encodeURIComponent(slug)}`, { credentials: "omit" })
    .then((r) => (r.ok ? (r.json() as Promise<{ items?: SimilarItem[] }>) : null))
    .then((a) => {
      if (!a?.items) return;
      answer = { slug, items: a.items };
      listeners.forEach((l) => l());
    })
    .catch(() => {
      /* no list: the page shows no block */
    });
}

/** `builtCount` = how many models the page was built with. Above zero, the build's list stands and nothing is asked. */
export function useEmptiedSimilar(slug: string | undefined, builtCount: number, live: Record<string, { o: boolean }> | null): SimilarItem[] {
  const wanted = Boolean(slug) && builtCount === 0 && live?.[slug ?? ""]?.o === true;
  const items = useSyncExternalStore(
    subscribe,
    () => (answer.slug === slug ? answer.items : NONE),
    () => NONE,
  );
  useEffect(() => {
    if (wanted && slug) ask(slug);
  }, [wanted, slug]);
  return wanted ? items : NONE;
}
