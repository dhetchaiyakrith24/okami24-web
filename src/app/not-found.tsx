import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { NOT_FOUND_TITLE_TH } from "@/i18n/search-head-copy";

// SEO round ก row C22 (owner เคาะ 2026-09-21): the 404 used to fall back to the site title.
export const metadata: Metadata = { title: NOT_FOUND_TITLE_TH };

// Round 30.3ข: the text lives in NotFoundContent (a client component, so it follows the visitor's
// language like every other page); this file stays the App Router's not-found boundary.
export default function NotFound() {
  return <NotFoundContent />;
}
