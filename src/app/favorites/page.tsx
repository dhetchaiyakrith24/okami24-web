import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FavoritesList } from "@/components/tools/FavoritesList";
import { FavoritesPageHeader } from "@/components/tools/FavoritesPageHeader";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved products — stored locally in this browser only.",
  // noindex — localStorage-only; a crawler sees an always-empty, generic personalized shell.
  ...canonicalFor("/favorites"),
  ...NOINDEX_FOLLOW,
};

export default function FavoritesPage() {
  return (
    <>
      <FavoritesPageHeader />
      <Container className="py-12 lg:py-16">
        <FavoritesList />
      </Container>
    </>
  );
}
