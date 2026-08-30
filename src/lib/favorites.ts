"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "okami24-favorites";
const EVENT = "okami24-favorites-change";

const EMPTY: string[] = [];
let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;

// useSyncExternalStore requires a stable reference until the underlying
// value actually changes — re-parsing localStorage on every call would
// return a new array each render and loop forever.
function readFavorites(): string[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? (JSON.parse(raw) as string[]) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function writeFavorites(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // localStorage unavailable — favorites simply won't persist this session
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, readFavorites, getServerSnapshot);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggle = useCallback((slug: string) => {
    const current = readFavorites();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    writeFavorites(next);
  }, []);

  return { favorites, isFavorite, toggle };
}
