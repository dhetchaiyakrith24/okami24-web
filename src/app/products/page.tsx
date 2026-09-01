import type { Metadata } from "next";
import { allProducts } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Products",
  description: "Every device in the OKami24 catalog — pod systems, pod kits, disposables, pods, and cartridges from UWELL, VOOPOO, and SALTHUB.",
  ...canonicalFor("/products"),
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="All Products"
        description={`${allProducts.length} devices across UWELL, VOOPOO, and SALTHUB — filter by brand, screen, and portability, or search by name.`}
      />
      <Container className="py-12 lg:py-16">
        <CatalogBrowser products={allProducts} />
      </Container>
    </>
  );
}
