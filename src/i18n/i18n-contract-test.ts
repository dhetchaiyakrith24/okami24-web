/**
 * OKami24 — Phase 3.2: i18n foundation contract tests.
 *
 * Covers the owner's 2026-09-06 language rule (Thai for everyone, no country guessing, the
 * visitor's own choice remembered), dictionary structural coverage (every locale implements the
 * same keys — a missing key would otherwise only surface as `undefined` rendered in the UI), and
 * the structural guards that keep translated content actually reaching the page.
 */

import fs, { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from "./config";
import { readLocaleCookie, writeLocaleCookie } from "./cookie";
import { getDictionary } from "./dictionaries";

export interface I18nContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

/** Every .ts/.tsx file under a folder — used by the "no geo detection anywhere" guard. */
function sourceFilesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFilesUnder(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => flattenKeys(v, prefix ? `${prefix}.${k}` : k));
}

export function runI18nContractTests(): I18nContractResult[] {
  const results: I18nContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  // --- Thai is the default for everyone (owner decision 2026-09-06, BSOT §20) ---
  check("Thai is the site-wide default locale", DEFAULT_LOCALE === "th", `DEFAULT_LOCALE=${DEFAULT_LOCALE}`);
  check("all three locales are still offered, so the switcher can reach them", LOCALES.join(",") === "th,en,zh", LOCALES.join(","));

  // The static HTML a crawler receives carries no cookie, so `<html lang>` in the root layout IS
  // what Google reads. Checked as text because rendering the layout here would need a full React
  // server render; the attribute is a literal in the file exactly so it can be checked this way.
  const rootLayout = readFileSync(path.join(process.cwd(), "src", "app", "layout.tsx"), "utf-8");
  check(
    'the root layout server-renders lang="th" — what a crawler with no cookie sees',
    /<html\s[^>]*lang="th"/.test(rootLayout),
    (rootLayout.match(/lang="[a-z-]+"/) ?? ["none found"])[0]
  );

  // Regression guard: the country-guessing path was deleted, not re-pointed at another host's
  // header (Render sits behind Cloudflare, which offers `cf-ipcountry` — the owner's decision was
  // explicitly NOT to use it). Anything reintroducing a geo guess should fail here first.
  // Matches real code — a request header being read for a country, or an import of the deleted
  // detector — not prose. The files' own comments are free to explain the history (config.ts
  // does), and a guard that fired on its own explanation would only teach the next session to
  // delete the explanation.
  const GEO_CODE = [/headers\s*\.\s*get\(\s*["'`][^"'`]*country/i, /from\s+["'`][^"'`]*detect-locale["'`]/, /geoip/i];
  const geoOffenders = sourceFilesUnder(path.join(process.cwd(), "src"))
    .filter((file) => !file.endsWith("i18n-contract-test.ts"))
    .filter((file) => GEO_CODE.some((re) => re.test(readFileSync(file, "utf-8"))))
    .map((file) => path.relative(process.cwd(), file));
  // src/proxy.ts used to be the locale-guessing proxy, so its mere existence failed this check. Since the image-fix
  // round (2026-09-30) a proxy exists for one job only — force WebP on /_next/image (src/proxy.ts head). Its CODE is
  // pinned here token for token (block comments and whitespace ignored): any change to what it matches or reads —
  // a wider matcher, another header, the URL, cookies, the client IP — fails this check until someone rewrites the
  // pin on purpose. (A pattern-based check was tried first; the checker bypassed it four ways, PR #113.)
  const PROXY_PIN =
    'import { NextResponse } from "next/server"; import type { NextRequest } from "next/server"; ' +
    'export function proxy(request: NextRequest) { const accept = request.headers.get("accept") ?? ""; ' +
    'if (accept.includes("image/webp")) return NextResponse.next(); const headers = new Headers(request.headers); ' +
    'headers.set("accept", accept ? `image/webp,${accept}` : "image/webp,*/*"); return NextResponse.next({ request: { headers } }); } ' +
    'export const config = { matcher: "/_next/image", };';
  const pinText = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\s+/g, " ").trim();
  const proxyPath = path.join(process.cwd(), "src", "proxy.ts");
  const proxySrc = fs.existsSync(proxyPath) ? readFileSync(proxyPath, "utf-8") : null;
  const proxyImageOnly = proxySrc === null || pinText(proxySrc) === pinText(PROXY_PIN);
  check(
    "no country/geo detection anywhere in src — Thai is not conditional on where a visitor is",
    proxyImageOnly &&
      !fs.existsSync(path.join(process.cwd(), "src", "i18n", "detect-locale.ts")) &&
      geoOffenders.length === 0,
    JSON.stringify({ geoOffenders, proxy: proxySrc === null ? "none" : proxyImageOnly ? "image-only" : "NOT image-only" })
  );

  // --- the visitor's own choice is remembered (the only thing that changes the language) ---
  // cookie.ts is browser-only by design; a minimal `document` stub is enough to prove the
  // round-trip its two functions promise — write a choice, read the same choice back.
  const savedDocument = (globalThis as { document?: unknown }).document;
  try {
    (globalThis as { document?: unknown }).document = { cookie: "" };
    check("no cookie yet → nothing to read, so the visitor gets DEFAULT_LOCALE (th)", readLocaleCookie() === null, "n/a");
    writeLocaleCookie("en");
    check("choosing English writes the cookie and reads back as English on the next visit", readLocaleCookie() === "en", String((globalThis as { document?: { cookie?: string } }).document?.cookie));
    check(
      "the remembered choice lasts a year and is site-wide (path=/)",
      /max-age=31536000/.test(String((globalThis as { document?: { cookie?: string } }).document?.cookie)) &&
        /path=\//.test(String((globalThis as { document?: { cookie?: string } }).document?.cookie)),
      String((globalThis as { document?: { cookie?: string } }).document?.cookie)
    );
    (globalThis as { document?: unknown }).document = { cookie: `${LOCALE_COOKIE}=klingon` };
    check("a junk cookie value is ignored rather than rendering an unsupported locale", readLocaleCookie() === null, "n/a");
  } finally {
    if (savedDocument === undefined) delete (globalThis as { document?: unknown }).document;
    else (globalThis as { document?: unknown }).document = savedDocument;
  }

  // --- dictionary structural coverage ---
  const [enKeys, thKeys, zhKeys] = LOCALES.map((l) => flattenKeys(getDictionary(l)).sort());
  check("th dictionary has exactly the same key set as en", JSON.stringify(thKeys) === JSON.stringify(enKeys), `missing/extra: ${JSON.stringify(thKeys.filter((k) => !enKeys.includes(k)).concat(enKeys.filter((k) => !thKeys.includes(k))))}`);
  check("zh dictionary has exactly the same key set as en", JSON.stringify(zhKeys) === JSON.stringify(enKeys), `missing/extra: ${JSON.stringify(zhKeys.filter((k) => !enKeys.includes(k)).concat(enKeys.filter((k) => !zhKeys.includes(k))))}`);
  for (const l of LOCALES) {
    const dict = getDictionary(l);
    const values = flattenKeys(dict).map((k) => k.split(".").reduce<unknown>((o, part) => (o as Record<string, unknown>)?.[part], dict));
    check(`${l} dictionary has no empty-string values`, values.every((v) => typeof v === "string" && v.length > 0), "n/a");
  }

  // The language button is the ONLY way the language changes now, so it has to be on every page.
  // Header and Footer are both rendered by the root layout — the switcher living in either one
  // reaches every page; checking both files keeps the guard honest if it moves between them.
  const switcherHomes = [
    path.join(process.cwd(), "src", "components", "layout", "Header.tsx"),
    path.join(process.cwd(), "src", "components", "layout", "Footer.tsx"),
  ].filter((file) => fs.existsSync(file) && readFileSync(file, "utf-8").includes("LanguageSwitcher"));
  check(
    "the language switcher is mounted in a layout-level component, so every page can reach it",
    switcherHomes.length > 0 && readFileSync(path.join(process.cwd(), "src", "app", "layout.tsx"), "utf-8").match(/Header|Footer/) !== null,
    switcherHomes.map((f) => path.basename(f)).join(",") || "not found in Header.tsx or Footer.tsx"
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
  //   - how-to-order / shipping / contact / privacy (2026-09-06, LAUNCH_AUDIT 3/4) — the SAME
  //     exception as about/page.tsx: whole-page Thai brand/policy copy drafted by the writer from
  //     docs/BUSINESS_SOURCE_OF_TRUTH.md (see docs/PAGE_COPY_2026-09-06.md), pending owner answers
  //     on the open facts. Translating only the header would be the same half-translated result;
  //     a full th/en/zh version of policy text needs owner-reviewed wording first (BSOT §12).
  //   - preview/claims-policy — the claims-policy DRAFT: NODE_ENV-gated like product-master,
  //     `notFound()` in production, not linked, not in the sitemap; owner-only reading copy.
  const EXCLUDED = [
    path.join("preview", "product-master"),
    path.join("preview", "claims-policy"),
    path.join("about", "page.tsx"),
    path.join("how-to-order", "page.tsx"),
    path.join("shipping", "page.tsx"),
    path.join("contact", "page.tsx"),
    path.join("privacy", "page.tsx"),
  ];
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
