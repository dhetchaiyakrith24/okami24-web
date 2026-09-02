import type { Metadata } from "next";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Products",
  description: "Every product in the OKami24 catalog — pod systems, pod kits, disposables, pods, cartridges, coils, and more.",
  ...canonicalFor("/products"),
};

export default function ProductsPage() {
  // Real, published ProductMaster products belong on the main catalog index the same as legacy
  // products — a customer browsing "All Products" shouldn't need to already know a product's data
  // origin to find it here. See CatalogBrowser's own doc comment.
  const publishedProducts = getPublishedProducts();
  const totalCount = allProducts.length + publishedProducts.length;
  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="All Products"
        description={`${totalCount} products across the OKami24 catalog — filter by brand, category, screen, and portability, or search by name.`}
      />
      <Container className="py-12 lg:py-16">
        <CatalogBrowser products={allProducts} publishedProducts={publishedProducts} />
      </Container>
    </>
  );
}
