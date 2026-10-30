import type { Metadata } from "next";
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { Footer } from "@/components/layout/Footer";
import { TrustBar } from "@/components/layout/TrustBar";
import { AgeGate } from "@/components/layout/AgeGate";
import { LineContact } from "@/components/layout/LineContact";
import { FloatingCart } from "@/components/commerce/FloatingCart";
import { LineClickTracker } from "@/components/layout/LineClickTracker";
import { ImageSaveGuard } from "@/components/layout/ImageSaveGuard";
import { TeamShortcut } from "@/components/layout/TeamShortcut";
import { CardCut } from "@/components/brand/CardCut";
import { navCategories } from "@/lib/category-visibility";
import { navBrands } from "@/lib/brand-visibility";
import { DNS_GUIDE_ID } from "@/data/guides";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { SITE_URL } from "@/lib/seo";
import { HOME_HEAD_TH } from "@/i18n/search-head-copy";
import "./globals.css";

const displayFont = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// One clause of the site description depends on whether online ordering is on
// (src/lib/commerce/ordering-mode.ts — owner 2026-09-07): while the cart is off, the site must
// not tell Google "order on the site". The strings are otherwise the owner's copy, with the
// vocabulary locked in round 30.2 (docs/THAI_STYLE.md §3, owner 2026-09-09): พอต not พอด,
// พอตใช้แล้วทิ้ง not ดิสโพส.
const ORDER_CHANNEL_CLAUSE = ORDERING_ENABLED ? "สั่งซื้อบนเว็บได้เลย" : "ช่วงนี้สั่งซื้อผ่าน LINE @okm24";

// SEO round ก (owner เคาะ 2026-09-21, rows A1/A2 of the batch-2 table): while ordering is off the
// homepage title/description are the approved strings in search-head-copy.ts ("OKami24 (OKM)" so
// the short brand word "okm" — no result for this site in Search Console — is tied to the shop; no
// "น้ำยา" because that category has nothing on the storefront, same ruling as /products). The
// ordering-on wording was never re-approved, so it is the pre-round string, untouched.
const HOME_DESCRIPTION = ORDERING_ENABLED
  ? `OKami24: พอตซิสเต็ม พอตใช้แล้วทิ้ง และน้ำยา ของแท้ ราคาตรง ${ORDER_CHANNEL_CLAUSE} ส่งไว มีเลขติดตาม สอบถามหรือให้ช่วยเลือก ทัก LINE @okm24`
  : HOME_HEAD_TH.description;

export const metadata: Metadata = {
  title: {
    default: HOME_HEAD_TH.title,
    template: "%s — OKami24",
  },
  description: HOME_DESCRIPTION,
  // The real production domain is TBD (see docs/BUSINESS_SOURCE_OF_TRUTH.md §19) — never
  // hardcoded here. See src/lib/seo.ts's SITE_URL: reads `SITE_URL` from the environment, falls
  // back to localhost in dev, and refuses to build at all in production without it.
  //
  // Deliberately NO `alternates.canonical` here — Next.js metadata is deep-inherited, so a
  // canonical set on the root layout becomes the DEFAULT for every page that doesn't set its own
  // (search/favorites/pilot products/etc. would all wrongly canonicalize to "/"). The homepage
  // sets its own canonical directly on `src/app/page.tsx` instead — see that file.
  metadataBase: new URL(SITE_URL),
  // Round "share-deadend" batch 1 (2026-09-22): NO `title`/`description` here on purpose.
  // Next.js inherits this whole object into every page that does not set its own `openGraph`,
  // so the two strings that used to sit here became the share card of 52 of the 105 pages — an
  // article, a brand page and the FAQ all shared one card reading "OKami24 — ของแท้ ราคาตรง
  // บริการจริง". With both fields absent, Next fills og:title/og:description from each page's
  // OWN resolved `title`/`description` (`inheritFromMetadata` in
  // node_modules/next/dist/lib/metadata/resolve-metadata.js), which are the strings the owner
  // already approved in the SEO ก/ข rounds — no new copy, and the homepage card stops showing
  // the pre-SEO-ก wording. What stays here is what every page genuinely shares: the site name,
  // the type, and (by file convention, src/app/opengraph-image.tsx) the default share image.
  // The owner's 2026-09-21 ruling that the share description must equal the meta description is
  // now structural rather than a copied string. Guard: src/lib/og-metadata-contract-test.ts.
  openGraph: {
    siteName: "OKami24",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Computed here, on the server, and handed to the header and footer (Client Components) as plain
  // lists — see NavCategory in src/lib/category-visibility.ts for why.
  const categories = navCategories();
  return (
    // `lang="th"` matches DEFAULT_LOCALE — Thai is what every visitor and every crawler gets
    // (owner decision 2026-09-06, BSOT §20; see i18n/config.ts). LocaleProvider corrects this
    // attribute client-side only for a visitor who has chosen another language and carries the
    // cookie (see LocaleProvider.tsx for why this stays a Server Component with no
    // cookies()/headers() call). Search engines send no cookie, so they read the Thai HTML.
    <html
      lang="th"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-0 text-foreground font-body">
        <LocaleProvider>
          <AgeGate orderingEnabled={ORDERING_ENABLED} />
          <Header orderingEnabled={ORDERING_ENABLED} categories={categories} />
          <main className="flex-1">{children}</main>
          {/* Round 30.4ข batch 5: the four-claim trust strip sits between the page and the footer on
              every route (owner's placement "ก่อน footer"). */}
          <TrustBar />
          <Footer categories={categories} brands={navBrands()} dnsGuideId={DNS_GUIDE_ID} orderingEnabled={ORDERING_ENABLED} />
          <LineContact />
          {/* Cart UX batch B (owner 24/10): the floating cart bubble above the LINE button — only while the cart has items. */}
          <FloatingCart orderingEnabled={ORDERING_ENABLED} />
          {/* Round 8 (owner 2026-09-23, option ก): counts clicks on every LINE link site-wide —
              in-site, no cookie, nothing sent outside. Renders nothing. */}
          <LineClickTracker />
          {/* Owner 2026-10-06: no right-click / drag / long-press save on pictures. Renders nothing. */}
          <ImageSaveGuard />
          {/* Samurai theme (owner 29/10): the short red cut across a product card's photo on click. Renders nothing. */}
          <CardCut />
          {/* Team button (owner 30/10): shows only on a device that logged in to /staff in the last 12 hours — read in the browser from a marker cookie, so every page stays static. */}
          <TeamShortcut />
        </LocaleProvider>
      </body>
    </html>
  );
}
