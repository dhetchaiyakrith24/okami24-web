"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { readLocaleCookie, writeLocaleCookie } from "@/i18n/cookie";
import { thaiTypographyDeep } from "@/lib/thai-typography";

/**
 * OKami24 — Phase 3.2: client-side locale context.
 *
 * Root layout.tsx is a Server Component with no `cookies()`/`headers()` call, so it — and every
 * static product/category page it wraps — keeps rendering exactly as it does today (no new
 * dynamic-rendering cost to the site's existing static generation; see the Phase 3.2 report
 * §LOCALE ROUTING STRATEGY for the reasoning). This provider resolves locale entirely client-
 * side instead: it initializes at `DEFAULT_LOCALE` (matching what the server rendered, so
 * hydration never mismatches), then reads the real cookie value in an effect and re-renders once
 * with the user's actual locale. That one-time correction is the honest tradeoff of this
 * approach — documented, not hidden — versus the alternative of forcing every page in the site
 * into dynamic rendering just to read a cookie in Server Components.
 */

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // Reads the visitor's cookie — a real browser-only external system, not derivable during the
    // render that must match the server's DEFAULT_LOCALE-based HTML (see the module doc comment
    // above for why this one-time post-hydration correction is the deliberate design, not an
    // avoidable extra render).
    const fromCookie = readLocaleCookie();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromCookie && fromCookie !== DEFAULT_LOCALE) setLocaleState(fromCookie);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    writeLocaleCookie(next);
    setLocaleState(next);
  }, []);

  // Round 30.4ค closing (owner 2026-09-16): the Thai dictionary the client components render gets
  // the render-time typography (no-break spaces before ๆ, between a number and its unit and inside
  // two-word model names; the owner's joiner exceptions). generateMetadata reads the plain
  // dictionary directly, so <title>/meta/JSON-LD stay plain; en/zh are untouched.
  const dict = useMemo(() => (locale === "th" ? thaiTypographyDeep(getDictionary(locale)) : getDictionary(locale)), [locale]);
  const value = useMemo(() => ({ locale, dict, setLocale }), [locale, dict, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
