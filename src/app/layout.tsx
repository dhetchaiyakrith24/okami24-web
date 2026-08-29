import type { Metadata } from "next";
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from "next/font/google";
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
    default: "NOVA VAPOR — Premium Pod, Disposable & E-Liquid Platform",
    template: "%s — NOVA VAPOR",
  },
  description:
    "An original product-discovery platform for pod systems, disposables, e-liquid, and vape technology — flagship devices, buying guides, comparison and a guided product finder.",
  metadataBase: new URL("https://nova-vapor.example.com"),
  openGraph: {
    title: "NOVA VAPOR — Premium Pod, Disposable & E-Liquid Platform",
    description:
      "A complete product-discovery ecosystem for pod systems, disposables, e-liquid, and vape technology.",
    siteName: "NOVA VAPOR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-0 text-foreground font-body">
        {children}
      </body>
    </html>
  );
}
