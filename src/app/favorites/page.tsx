import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { FavoritesList } from "@/components/tools/FavoritesList";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved products — stored locally in this browser only.",
};

export default function FavoritesPage() {
  return (
    <>
      <PageHeader eyebrow="Saved" title="Favorites" description="Stored locally in this browser — not tied to an account." />
      <Container className="py-12 lg:py-16">
        <FavoritesList />
      </Container>
    </>
  );
}
