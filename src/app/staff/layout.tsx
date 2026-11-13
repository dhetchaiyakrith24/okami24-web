import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

/**
 * /staff as its own home-screen app (owner 12/11 via Friday: name "หลังบ้าน", icon = the mark on solid red; designer pass e).
 * The manifest and icons live under /public, NOT under /staff: src/proxy.ts sends every cookieless /staff/:path+ request
 * to the login, and the phone fetches a manifest/icon without the session cookie. Overrides the shop's manifest and
 * apple-touch-icon on /staff only; the shop pages keep /manifest.webmanifest. Every /staff page also stays noindex.
 */
export const metadata: Metadata = {
  manifest: "/team.webmanifest",
  appleWebApp: { capable: true, title: "หลังบ้าน", statusBarStyle: "black" },
  icons: { apple: "/team-icon-v1-180.png", icon: "/team-icon-v1-192.png" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#0e0e10" };

export default function StaffLayout({ children }: { children: ReactNode }) {
  return children;
}
