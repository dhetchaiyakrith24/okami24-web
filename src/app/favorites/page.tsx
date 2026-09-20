import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FavoritesList } from "@/components/tools/FavoritesList";
import { FavoritesPageHeader } from "@/components/tools/FavoritesPageHeader";
import { NOINDEX_FOLLOW, canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "รายการโปรด",
  description: "สินค้าที่คุณกดบันทึกไว้ เก็บในเบราว์เซอร์เครื่องนี้เท่านั้น ไม่ต้องสมัครสมาชิก",
  // noindex — localStorage-only; a crawler sees an always-empty, generic personalized shell.
  ...canonicalFor("/favorites"),
  ...NOINDEX_FOLLOW,
};

export default function FavoritesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/favorites")) }} />
      <FavoritesPageHeader />
      <Container className="py-12 lg:py-16">
        <FavoritesList />
      </Container>
    </>
  );
}
