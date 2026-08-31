/**
 * OKami24 — Phase 3.2: i18n foundation contract tests.
 *
 * Covers locale resolution (`detectLocale`), dictionary structural coverage (every locale
 * implements the same keys — a missing key would otherwise only surface as `undefined` rendered
 * in the UI), and the middleware's "never overwrite an existing choice" precedence guarantee.
 */

import { NextRequest } from "next/server";
import { LOCALES } from "./config";
import { detectLocale } from "./detect-locale";
import { getDictionary } from "./dictionaries";
import { proxy } from "../proxy";

export interface I18nContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => flattenKeys(v, prefix ? `${prefix}.${k}` : k));
}

export function runI18nContractTests(): I18nContractResult[] {
  const results: I18nContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  // --- locale resolution ---
  check("Thailand geo resolves to th", detectLocale({ country: "TH", acceptLanguage: null }) === "th", "n/a");
  check("China geo resolves to zh", detectLocale({ country: "CN", acceptLanguage: null }) === "zh", "n/a");
  check(
    "an unrelated geo country resolves to en, not the DEFAULT_LOCALE constant by coincidence",
    detectLocale({ country: "US", acceptLanguage: null }) === "en",
    "n/a"
  );
  check(
    "no geo signal + Accept-Language starting with th resolves to th (dev fallback path)",
    detectLocale({ country: null, acceptLanguage: "th-TH,th;q=0.9,en;q=0.8" }) === "th",
    "n/a"
  );
  check(
    "no geo signal + Accept-Language starting with zh resolves to zh",
    detectLocale({ country: null, acceptLanguage: "zh-CN,zh;q=0.9" }) === "zh",
    "n/a"
  );
  check(
    "no geo signal + unsupported Accept-Language (e.g. fr) falls back to DEFAULT_LOCALE",
    detectLocale({ country: null, acceptLanguage: "fr-FR,fr;q=0.9" }) === "en",
    "n/a"
  );
  check("no signals at all falls back to DEFAULT_LOCALE (en)", detectLocale({ country: null, acceptLanguage: null }) === "en", "n/a");
  check(
    "geo takes priority over a conflicting Accept-Language",
    detectLocale({ country: "TH", acceptLanguage: "zh-CN,zh;q=0.9" }) === "th",
    "n/a"
  );

  // --- dictionary structural coverage ---
  const [enKeys, thKeys, zhKeys] = LOCALES.map((l) => flattenKeys(getDictionary(l)).sort());
  check("th dictionary has exactly the same key set as en", JSON.stringify(thKeys) === JSON.stringify(enKeys), `missing/extra: ${JSON.stringify(thKeys.filter((k) => !enKeys.includes(k)).concat(enKeys.filter((k) => !thKeys.includes(k))))}`);
  check("zh dictionary has exactly the same key set as en", JSON.stringify(zhKeys) === JSON.stringify(enKeys), `missing/extra: ${JSON.stringify(zhKeys.filter((k) => !enKeys.includes(k)).concat(enKeys.filter((k) => !zhKeys.includes(k))))}`);
  for (const l of LOCALES) {
    const dict = getDictionary(l);
    const values = flattenKeys(dict).map((k) => k.split(".").reduce<unknown>((o, part) => (o as Record<string, unknown>)?.[part], dict));
    check(`${l} dictionary has no empty-string values`, values.every((v) => typeof v === "string" && v.length > 0), "n/a");
  }

  // --- middleware precedence: manual/previous choice must never be overwritten ---
  const noCookieRequest = new NextRequest("http://localhost:3000/products/pod-systems", {
    headers: { "accept-language": "en", "x-vercel-ip-country": "TH" },
  });
  const freshResponse = proxy(noCookieRequest);
  check(
    "middleware sets the cookie on a genuinely first visit, matching the detected locale",
    freshResponse.cookies.get("okami24_locale")?.value === "th",
    JSON.stringify(freshResponse.cookies.get("okami24_locale"))
  );

  const existingCookieRequest = new NextRequest("http://localhost:3000/products/pod-systems", {
    headers: { "accept-language": "en", "x-vercel-ip-country": "TH", cookie: "okami24_locale=en" },
  });
  const preservedResponse = proxy(existingCookieRequest);
  check(
    "middleware never overwrites an existing locale cookie even when geo strongly suggests a different one",
    preservedResponse.cookies.get("okami24_locale") === undefined,
    JSON.stringify(preservedResponse.cookies.get("okami24_locale"))
  );

  return results;
}
