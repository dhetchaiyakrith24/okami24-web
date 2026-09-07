import type { Metadata } from "next";
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { Footer } from "@/components/layout/Footer";
import { AgeGate } from "@/components/layout/AgeGate";
import { LineContact } from "@/components/layout/LineContact";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { SITE_URL } from "@/lib/seo";
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
// (src/lib/commerce/ordering-mode.ts — owner 2026-09-07, approved as the only wording change in
// this file): while the cart is off, the site must not tell Google "order on the site". Both
// strings are otherwise the owner's exact copy.
const ORDER_CHANNEL_CLAUSE = ORDERING_ENABLED ? "สั่งซื้อบนเว็บได้เลย" : "ช่วงนี้สั่งซื้อผ่าน LINE @okm24";

export const metadata: Metadata = {
  title: {
    default: "OKami24 — ของแท้ ราคาตรง บริการจริง",
    template: "%s — OKami24",
  },
  description: `OKami24: พอดซิสเต็ม ดิสโพส และน้ำยา ของแท้ ราคาตรง ${ORDER_CHANNEL_CLAUSE} ส่งไว มีเลขติดตาม สอบถามหรือให้ช่วยเลือก ทัก LINE @okm24`,
  // The real production domain is TBD (see docs/BUSINESS_SOURCE_OF_TRUTH.md §19) — never
  // hardcoded here. See src/lib/seo.ts's SITE_URL: reads `SITE_URL` from the environment, falls
  // back to localhost in dev, and refuses to build at all in production without it.
  //
  // Deliberately NO `alternates.canonical` here — Next.js metadata is deep-inherited, so a
  // canonical set on the root layout becomes the DEFAULT for every page that doesn't set its own
  // (search/favorites/pilot products/etc. would all wrongly canonicalize to "/"). The homepage
  // sets its own canonical directly on `src/app/page.tsx` instead — see that file.
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "OKami24 — ของแท้ ราคาตรง บริการจริง",
    description: ORDERING_ENABLED
      ? "พอดซิสเต็ม ดิสโพส และน้ำยา ของแท้ ราคาตรง บริการจริง — สั่งซื้อบนเว็บได้เลย หรือทัก LINE @okm24"
      : "พอดซิสเต็ม ดิสโพส และน้ำยา ของแท้ ราคาตรง บริการจริง — ช่วงนี้สั่งซื้อผ่าน LINE @okm24",
    siteName: "OKami24",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
          <AgeGate />
          <Header orderingEnabled={ORDERING_ENABLED} />
          <main className="flex-1">{children}</main>
          <Footer />
          <LineContact />
        </LocaleProvider>
      </body>
    </html>
  );
}
