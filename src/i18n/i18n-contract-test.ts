/**
 * OKami24 — Phase 3.2: i18n foundation contract tests.
 *
 * Covers locale resolution (`detectLocale`), dictionary structural coverage (every locale
 * implements the same keys — a missing key would otherwise only surface as `undefined` rendered
 * in the UI), and the middleware's "never overwrite an existing choice" precedence guarantee.
 */

import { NextRequest } from "next/server";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
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

  // --- static regression guard: a Server Component `page.tsx` calling `<PageHeader>` directly
  //     — with ANY prop value, not just a literal string — can never localize, because a Server
  //     Component structurally cannot read the real locale (see LocaleProvider.tsx's own
  //     architecture note). Originally this check only flagged a LITERAL quoted-string prop
  //     (`title="..."`), which caught the first 4 instances of this bug (found live, 2026-09-02,
  //     on /faq, /technology, /guides, /e-liquid) but missed a structurally identical fifth one on
  //     `/guides/[slug]` — that page passed `title={guide.title}` and a template-literal eyebrow,
  //     both `{expression}` props, not literal strings, so the narrower regex never matched even
  //     though the page was exactly as unable to localize as the other four. Widened to flag ANY
  //     direct `<PageHeader` JSX usage in a non-"use client" page.tsx, literal or not — the fix is
  //     always the same shape: extract into a small `"use client"` component that reads `dict.*`
  //     (and, for content-derived text, an id-keyed translation overlay — see faq-copy.ts /
  //     guides-copy.ts / technology-copy.ts / flavor-copy.ts), exactly like ComparePageHeader/
  //     FinderPageHeader/SearchPageHeader/FAQPageHeader/TechnologyPageHeader/GuidesPageHeader/
  //     GuideDetailPageHeader/ELiquidPageHeader/ELiquidFamilyPageHeader already do — so this check
  //     enforces that shape structurally instead of relying on someone remembering the rule for
  //     the next new page (dynamic `[slug]` routes included; the first version of this check
  //     enumerated `page.tsx` files without regard to dynamic segments, which is why it should
  //     have caught this — the regex was the actual gap, not the file discovery). */
  const APP_DIR = path.join(process.cwd(), "src", "app");
  function findPageFiles(dir: string): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) out.push(...findPageFiles(full));
      else if (entry === "page.tsx") out.push(full);
    }
    return out;
  }
  // Deliberately excluded, with reasons — not gaps this check missed:
  //   - preview/product-master/** — an internal DEV-only tool (see storefront-preview-read-
  //     model.ts's own doc comment): NODE_ENV-gated, `notFound()`s in production, no customer
  //     ever reaches it. Localizing an admin-only preview UI has no customer-facing value.
  //   - about/page.tsx — deliberately Thai-only brand voice, the SAME documented exception as
  //     footer.tagline/footer.ageNotice (see i18n/dictionaries/en.ts's own comment on those keys):
  //     the entire page body is real brand copy the owner wrote in Thai, not a UI label, so a
  //     hardcoded eyebrow next to hardcoded Thai title/description is consistent, not broken —
  //     switching only the eyebrow while the rest of the page stays Thai would be a worse,
  //     half-translated result than leaving it alone.
  const EXCLUDED = [path.join("preview", "product-master"), path.join("about", "page.tsx")];
  const offendingPages: string[] = [];
  for (const file of findPageFiles(APP_DIR)) {
    const rel = path.relative(process.cwd(), file);
    if (EXCLUDED.some((ex) => rel.includes(ex))) continue;
    const src = readFileSync(file, "utf-8");
    if (src.includes('"use client"')) continue; // client components correctly reach useLocale() directly
    // ANY direct `<PageHeader` JSX usage here is disqualifying, literal props or not — a Server
    // Component cannot read the real locale no matter what it passes in. See this check's header
    // comment for why the earlier literal-string-only regex missed a real instance of this bug.
    const directPageHeaderUsage = /<PageHeader\b/;
    if (directPageHeaderUsage.test(src)) offendingPages.push(rel);
  }
  check(
    "no Server Component page.tsx calls <PageHeader> directly, with any prop shape (must go through a `\"use client\"` dict-reading wrapper instead)",
    offendingPages.length === 0,
    JSON.stringify(offendingPages)
  );

  // --- static regression guard #2: a translation overlay file (faq-copy.ts, guides-copy.ts,
  //     technology-copy.ts, flavor-copy.ts, finder-copy.ts) existing is not the same as it being
  //     APPLIED everywhere that domain's content renders. Found live, 2026-09-03: guides-copy.ts
  //     and technology-copy.ts were built and wired into the DETAIL pages
  //     (guides/[slug], technology/[slug]) but never into the LISTING pages (GuideCard.tsx,
  //     technology/page.tsx's card grid) — the first, and often only, place a customer actually
  //     reads that content. A content domain is only genuinely localized when EVERY file that
  //     renders its English source data also imports the matching overlay.
  const CONTENT_LOCALIZATION_SURFACES: { domain: string; copyModule: string; mustImportIn: string[] }[] = [
    {
      domain: "guides",
      copyModule: "guides-copy",
      mustImportIn: [path.join("src", "components", "content", "GuideCard.tsx"), path.join("src", "app", "guides", "[slug]", "page.tsx")],
    },
    {
      domain: "technology",
      copyModule: "technology-copy",
      mustImportIn: [
        path.join("src", "components", "content", "TechnologyEntryGrid.tsx"),
        path.join("src", "app", "technology", "[slug]", "page.tsx"),
      ],
    },
    {
      domain: "flavor families",
      copyModule: "flavor-copy",
      // The [family] detail PAGE delegates entirely to these two client components rather than
      // importing flavor-copy itself (unlike guides/technology's detail pages, which import their
      // copy module directly) — checking the actual rendering surface, not the page wrapper.
      mustImportIn: [
        path.join("src", "components", "content", "FlavorFamilyGrid.tsx"),
        path.join("src", "components", "content", "ELiquidFamilyPageHeader.tsx"),
      ],
    },
    {
      domain: "FAQ",
      copyModule: "faq-copy",
      mustImportIn: [path.join("src", "components", "content", "FAQAccordion.tsx")],
    },
    {
      domain: "Finder",
      copyModule: "finder-copy",
      mustImportIn: [path.join("src", "components", "tools", "FinderTool.tsx")],
    },
  ];
  const missingOverlayImports: string[] = [];
  for (const surface of CONTENT_LOCALIZATION_SURFACES) {
    for (const rel of surface.mustImportIn) {
      const full = path.join(process.cwd(), rel);
      let src: string;
      try {
        src = readFileSync(full, "utf-8");
      } catch {
        missingOverlayImports.push(`${rel} (file not found)`);
        continue;
      }
      if (!src.includes(surface.copyModule)) {
        missingOverlayImports.push(`${rel} does not import ${surface.copyModule} (${surface.domain} content would render English-only under a translated locale)`);
      }
    }
  }
  check(
    "every listing AND detail surface for a translated content domain (Guides/Technology/Flavor families/FAQ/Finder) imports that domain's translation overlay — not just one of the two",
    missingOverlayImports.length === 0,
    JSON.stringify(missingOverlayImports)
  );

  return results;
}

// Storefront quality-correction pass (2026-09-02) — this file had NO self-executing runner, so
// `npx tsx src/i18n/i18n-contract-test.ts` (exactly what scripts/verify-catalog.ts's process-spawn-
// based runner does) exited 0 without ever calling runI18nContractTests() — every check in this
// file, including the brand-new hardcoded-PageHeader guard above, was silently inert despite
// `verify:catalog` reporting this step as passing. Confirmed the identical defect exists in every
// other *-contract-test.ts/validate-*.ts file in the project; all fixed alongside this one.
if (require.main === module) {
  const results = runI18nContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail && r.detail !== "n/a" ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
