import type { Metadata } from "next";
import { canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";
import { ABOUT_HEAD_TH } from "@/i18n/search-head-copy";
import { brandsWithProducts } from "@/lib/brand-visibility";
import { AboutContent } from "@/components/content/AboutContent";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";

// SEO round ก rows A3/A4 (owner เคาะ 2026-09-21) — search-head-copy.ts holds the strings.
// Head copy stays Thai in every language, like every other page on the site: what a crawler and a
// share card read is the Thai shop's own text (round 30.3ข).
export const metadata: Metadata = {
  title: { absolute: ABOUT_HEAD_TH.title },
  description: ABOUT_HEAD_TH.description,
  ...canonicalFor("/about"),
};

// Round 6 "about3lang" batch B2 (2026-09-23): the page body moved to <AboutContent>, a Client
// Component, because the copy is now read per locale (src/i18n/about-copy.tsx) and `useLocale()` is
// a client hook. This route keeps what must stay on the server — metadata, the JSON-LD, and the
// catalog read below — and hands the result down as props.
export default function AboutPage() {
  // Only feature brands with a real, currently-catalogued product — see brand-visibility.ts.
  const brands = brandsWithProducts();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(ABOUT_HEAD_TH.title, "/about")) }} />
      <AboutContent brands={brands} orderingEnabled={ORDERING_ENABLED} />
    </>
  );
}
