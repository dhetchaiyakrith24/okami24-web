import type { Metadata } from "next";
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
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

export const metadata: Metadata = {
  title: {
    default: "OKami24 — ของแท้ ราคาตรง บริการจริง",
    template: "%s — OKami24",
  },
  description:
    "OKami24: ร้านอุปกรณ์พอดซิสเต็ม ดิสโพส และน้ำยา คัดสรรของแท้ ราคาตรงไปตรงมา พร้อมบริการหลังการขายที่ดูแลคุณจริง สอบถามและสั่งซื้อผ่าน LINE OA @okM24",
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
    description: "อุปกรณ์พอดซิสเต็ม ดิสโพส และน้ำยา ของแท้ ราคาตรง บริการจริง — สอบถามและสั่งซื้อผ่าน LINE OA",
    siteName: "OKami24",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `lang="en"` matches DEFAULT_LOCALE — LocaleProvider corrects this attribute client-side
    // once it reads the visitor's actual locale cookie (see LocaleProvider.tsx for why this
    // stays a Server Component with no cookies()/headers() call).
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-0 text-foreground font-body">
        <LocaleProvider>
          <AgeGate />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <LineContact />
        </LocaleProvider>
      </body>
    </html>
  );
}
