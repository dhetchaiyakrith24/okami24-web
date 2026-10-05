/**
 * OKami24 — every spec number a customer sees traces back to a manufacturer source (data round, owner 2026-09-24).
 *
 * The owner's rule for the round: a fact counts only from the manufacturer — its own site, a poster on its domain, or
 * its manual (a manuals.plus copy counts); a shop page does not. On the site that becomes two guarantees, and this test
 * fails the day either one is broken:
 *   (a) a VERIFIED spec row of a product in SOURCED_ROW_PRODUCTS names the manufacturer URL it came from, and any row
 *       that names a URL names a manufacturer's (owner ruling, question 1 ค: per row, required for the rows touched in
 *       this round and for the products the five live round-10B guides link to — older rows are grandfathered);
 *   (b) nothing that renders spec rows or attribute numbers bypasses src/lib/verified-specs.ts — an unverified row or
 *       an attribute no verified row states never reaches a page.
 * Plus the product prose: a number with a unit in a product's own copy (all three languages) must appear in that
 * product's verified rows.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { allProducts, getFlagshipProducts } from "@/data/products";
import { allCatalogItems } from "@/lib/catalog-index";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { PRODUCT_DESCRIPTION_HEAD_TH } from "@/i18n/search-head-copy";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { verifiedAttributes, verifiedRows } from "@/lib/verified-specs";
import type { Product } from "@/types/catalog";

export interface VerifiedSpecsContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

/** Products whose verified rows must each carry a manufacturer `sourceUrl` (see the header, rule (a)). */
export const SOURCED_ROW_PRODUCTS = [
  // linked by the five live round-10B guides (batch 2 sample check, re-read in a real browser 2026-09-24)
  "m-bar-9k", "m-bar-10k", "m-switch-kit", "m-switch-pod", "relx-smash-go-12k", "caliburn-g4-mini", "caliburn-g4",
  // (m-bar-pod left this list 2026-09-30: the owner took it off the storefront — the test only knows storefront slugs)
] as const;

/** Manufacturer domains (and the manual mirror the owner allowed). A reseller domain is never added here. */
const MANUFACTURER_HOSTS = [
  "salthub.com", "img.salthub.com", "relxnow.com", "myuwell.com", "files.myuwell.com", "manuals.plus", "eskobarvape.com",
  "voopoo.com", "shop.voopoo.com", "iqos.com", "nevoks.com", "wotofo.com",
  // batch 4a (06/10): JOIWAY's Thai site — it serves JOIWAY's product API + poster files (_incoming/joiway/SOURCE.md)
  "thai.myjoiway.com",
  // batch 4g (05/10): TFIT's own site — its product API + poster files (_incoming/sitewide-template/4/facts-tfit-m-power-20k.md)
  "tfitvape.com",
];

/** Published (Shipnity) products whose verified rows must each name a manufacturer `sourceUrl` — the same rule (a) as
 *  SOURCED_ROW_PRODUCTS, for the storefront-bridge pool: every product whose rows were written or rewritten in the data
 *  rounds. Keyed by storefront slug. */
export const SOURCED_PUBLISHED_ROW_PRODUCTS = [
  "pod-159", // data round chat 2 (eskobarvape.com)
  "coil-55", "coil-68", "coil-54", "iqosheet-16", "iqosheet-18", // round data 2
] as const;

/** A number in one product's copy that is another product's verified fact, named as such in the sentence. */
const CROSS_PRODUCT_MENTIONS: Record<string, string[]> = {
  // "…don't need the full 35W ceiling" — the ARGUS G4's 35W (argus-g4 verified row), the Mini's own ceiling is 30W.
  "argus-g4-mini": ["35W", "35 วัตต์"],
};

/** Files that read spec rows / attribute numbers without importing the gate, and why that is safe. */
const RENDER_EXCEPTIONS: Record<string, string> = {
  "src/components/home/Hero.tsx": "HANDOFF §17 'Do not touch' — its flagship numbers are asserted backed below (check 4)",
  "src/components/tools/CompareTool.tsx": "reads CatalogItem.attributes (gated in catalog-index.ts, check 1) and filters rows in verifiedSpecRows()",
};

const ROOT = process.cwd();
const NUMERIC_ATTRIBUTE = /\.attributes\??\.(batteryMah|wattageMin|wattageMax|puffCount|capacityMl|weightG|dimensions|screenSize|chargingType)\b/;
const SPEC_ROW_READ = /\.specifications\??\.(map|filter|some|find|length|every|forEach)\b/;

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const UNIT = /(\d[\d,.]*(?:\s*[–-]\s*\d[\d,.]*)?)\s*(mAh|mL|ml|W\b|Ω|วัตต์|โอห์ม|พัฟ|puffs?|mg|นาที|minutes?)/gi;
const normalize = (s: string) =>
  s.replace(/,/g, "").replace(/\s+/g, "").replace(/ml/i, "mL").replace(/วัตต์/, "W").replace(/โอห์ม/, "Ω").replace(/puffs?|พัฟ/i, "puff").replace(/minutes?|นาที/i, "min");
const strings = (x: unknown): string[] =>
  typeof x === "string" ? [x] : Array.isArray(x) ? x.flatMap(strings) : x && typeof x === "object" ? Object.values(x).flatMap(strings) : [];

function unbackedProseNumbers(p: Product): string[] {
  const verified = verifiedRows(p.specifications).map((r) => r.value).join(" | ");
  const withUnit = new Set([...verified.matchAll(UNIT)].map((m) => normalize(m[0])));
  const bare = new Set([...verified.matchAll(/\d[\d,.]*/g)].map((m) => m[0].replace(/,/g, "")));
  const allowed = new Set(CROSS_PRODUCT_MENTIONS[p.slug] ?? []);
  const th = PRODUCT_COPY_TH[p.slug];
  const prose = [
    ...strings([p.tagline, p.shortDescription, p.features, p.faqs, p.whoIsThisFor]),
    ...strings(th ? { ...th, specifications: undefined } : undefined),
  ];
  const misses: string[] = [];
  for (const text of prose) {
    for (const m of text.matchAll(UNIT)) {
      if (allowed.has(m[0])) continue;
      const parts = m[1].replace(/,/g, "").split(/[–-]/).map((s) => s.trim());
      if (withUnit.has(normalize(m[0])) || parts.every((x) => bare.has(x))) continue;
      misses.push(`${p.slug}: "${m[0]}"`);
    }
  }
  return misses;
}

export function runVerifiedSpecsContractTests(): VerifiedSpecsContractResult[] {
  const results: VerifiedSpecsContractResult[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

  // ---- 0. The gate itself: an unverified row backs nothing, a verified one backs its number ----
  const probe = (status: "verified" | "unverified") =>
    verifiedAttributes({ attributes: { batteryMah: 650, puffCount: 12000, beginnerFriendly: true }, specifications: [{ value: "650mAh, up to 12,000", sourceStatus: status }] });
  const off = probe("unverified");
  const on = probe("verified");
  check("gate: an unverified row backs no attribute, a verified row backs its own number", off.batteryMah === undefined && off.puffCount === undefined && on.batteryMah === 650 && on.puffCount === 12000, `unverified → ${JSON.stringify(off)} · verified → ${JSON.stringify(on)}`);

  // ---- 1. /compare and Finder read gated attributes ----
  const leaks = allCatalogItems()
    .filter((i) => i.origin === "legacy")
    .flatMap((i) => {
      const p = allProducts.find((x) => x.slug === i.slug);
      return p && JSON.stringify(i.attributes) !== JSON.stringify(verifiedAttributes(p)) ? [i.slug] : [];
    });
  check(`catalog-index hands /compare only verified attributes (${allProducts.length} legacy products)`, leaks.length === 0, leaks.join(", ") || "none");

  // ---- 2. Renderers go through the gate ----
  const offenders: string[] = [];
  for (const file of [...sourceFiles(path.join(ROOT, "src", "components")), ...sourceFiles(path.join(ROOT, "src", "app"))]) {
    const rel = path.relative(ROOT, file).split(path.sep).join("/");
    if (rel.startsWith("src/app/preview/") || RENDER_EXCEPTIONS[rel]) continue;
    const src = readFileSync(file, "utf8");
    const code = src.split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
    const reads = code.filter((l) => NUMERIC_ATTRIBUTE.test(l) || SPEC_ROW_READ.test(l));
    if (reads.length > 0 && !src.includes("@/lib/verified-specs")) offenders.push(`${rel} (${reads.length} line${reads.length > 1 ? "s" : ""})`);
  }
  check("every component that reads spec rows or attribute numbers imports src/lib/verified-specs.ts", offenders.length === 0, offenders.join("; ") || `none (exceptions: ${Object.keys(RENDER_EXCEPTIONS).join(", ")})`);

  // ---- 3. No unverified row is rendered by the spec sheet (the gate filters it) ----
  const shown = allProducts.flatMap((p) => verifiedRows(p.specifications).filter((r) => r.sourceStatus !== "verified").map((r) => `${p.slug}:${r.key}`));
  const hiddenCount = allProducts.reduce((n, p) => n + p.specifications.filter((r) => r.sourceStatus !== "verified").length, 0);
  check(`no unverified spec row reaches a page (${hiddenCount} unverified rows held back in data)`, shown.length === 0, shown.join(", ") || "none");

  // ---- 4. Home Hero (do-not-touch file) prints flagship battery + wattage — both must be backed ----
  const heroMisses = getFlagshipProducts().flatMap((p) => {
    const f = verifiedAttributes(p);
    return [
      p.attributes.batteryMah !== f.batteryMah ? `${p.slug} battery ${p.attributes.batteryMah}` : "",
      p.attributes.wattageMax !== f.wattageMax ? `${p.slug} wattage ${p.attributes.wattageMax}` : "",
    ].filter(Boolean);
  });
  check(`home Hero flagship numbers are backed by verified rows (${getFlagshipProducts().length} flagships)`, heroMisses.length === 0, heroMisses.join(", ") || "none");

  // ---- 5. Per-row manufacturer source ----
  const missingUrl: string[] = [];
  const badHost: string[] = [];
  let grandfathered = 0;
  for (const p of allProducts) {
    const required = (SOURCED_ROW_PRODUCTS as readonly string[]).includes(p.slug);
    for (const r of verifiedRows(p.specifications)) {
      if (r.sourceUrl) {
        const host = new URL(r.sourceUrl).hostname.replace(/^www\./, "");
        if (!MANUFACTURER_HOSTS.includes(host)) badHost.push(`${p.slug}:${r.key} → ${host}`);
      } else if (required) missingUrl.push(`${p.slug}:${r.key}`);
      else grandfathered += 1;
    }
  }
  const unknown = SOURCED_ROW_PRODUCTS.filter((s) => !allProducts.some((p) => p.slug === s));
  check(`every verified row of the ${SOURCED_ROW_PRODUCTS.length} sourced products names its manufacturer URL`, missingUrl.length === 0 && unknown.length === 0, [...missingUrl, ...unknown.map((u) => `unknown slug ${u}`)].join(", ") || `none (${grandfathered} older verified rows grandfathered)`);
  check("every row source URL is a manufacturer domain (never a shop)", badHost.length === 0, badHost.join(", ") || "none");

  // ---- 6. Product prose states no number its verified rows do not ----
  const prose = allProducts.flatMap(unbackedProseNumbers);
  check(`product copy (en + th) states only numbers its verified rows state (${allProducts.length} products)`, prose.length === 0, prose.join("; ") || "none");

  // ---- 7. Head descriptions + published (Shipnity) product copy (data round chat 2) ----
  // The meta description is a place a customer reads specs too (Google shows it). A number with a unit there — and in a
  // published product's tagline (the one line of its own copy a page shows) — must appear, as written, in that product's verified rows or be
  // one of its option labels ("0.8Ω" is a real option). "2mL" is not backed by "2.0–3.0 mL": the spelling must match.
  const exact = (s: string) => new Set([...s.matchAll(/\d[\d,.]*/g)].map((m) => m[0].replace(/,/g, "").replace(/\.$/, "")));
  const published = getPublishedProducts();
  const headMisses: string[] = [];
  const scanExact = (slug: string, where: string, text: string, backing: string) => {
    const ok = exact(backing);
    for (const m of text.matchAll(UNIT)) {
      const parts = m[1].replace(/,/g, "").split(/[–-]/).map((x) => x.trim());
      if (!parts.every((x) => ok.has(x))) headMisses.push(`${slug} ${where}: "${m[0]}"`);
    }
  };
  const catalog = allCatalogItems();
  for (const [slug, text] of Object.entries(PRODUCT_DESCRIPTION_HEAD_TH)) {
    const item = catalog.find((i) => i.slug === slug);
    if (!item) { headMisses.push(`${slug}: head description for a product not on the storefront`); continue; }
    const options = published.find((p) => p.slug === slug)?.variants.map((v) => v.label).join(" ") ?? "";
    scanExact(slug, "head", text, `${verifiedRows(item.specifications).map((r) => r.value).join(" | ")} ${options}`);
  }
  for (const p of published) {
    const backing = `${verifiedRows(p.specifications).map((r) => r.value).join(" | ")} ${p.variants.map((v) => v.label).join(" ")}`;
    scanExact(p.slug, "tagline", p.tagline, backing);
  }
  const publishedBadHost = published.flatMap((p) =>
    p.specifications.flatMap((r) => {
      const url = (r as { sourceUrl?: string }).sourceUrl;
      if (!url) return [];
      const host = new URL(url).hostname.replace(/^www\./, "");
      return MANUFACTURER_HOSTS.includes(host) ? [] : [`${p.slug}:${r.key} → ${host}`];
    })
  );
  check("every published product row that names a source URL names a manufacturer domain", publishedBadHost.length === 0, publishedBadHost.join(", ") || "none");
  const publishedMissing = SOURCED_PUBLISHED_ROW_PRODUCTS.flatMap((slug) => {
    const p = published.find((x) => x.slug === slug);
    if (!p) return [`unknown slug ${slug}`];
    const rows = verifiedRows(p.specifications);
    if (rows.length === 0) return [`${slug}: no verified row`];
    return rows.filter((r) => !(r as { sourceUrl?: string }).sourceUrl).map((r) => `${slug}:${r.key}`);
  });
  check(`every verified row of the ${SOURCED_PUBLISHED_ROW_PRODUCTS.length} sourced published products names its manufacturer URL`, publishedMissing.length === 0, publishedMissing.join(", ") || "none");
  check(`head descriptions (${Object.keys(PRODUCT_DESCRIPTION_HEAD_TH).length}) and published product copy (${published.length}) state only numbers their verified rows or options state`, headMisses.length === 0, headMisses.join("; ") || "none");

  return results;
}

if (require.main === module) {
  const results = runVerifiedSpecsContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
