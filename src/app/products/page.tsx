import type { Metadata } from "next";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { catalogSearchTexts } from "@/lib/catalog-search-entries";
import { inStockEntryKeys } from "@/lib/in-stock";
import { ProductsPageHeader } from "@/components/catalog/ProductsPageHeader";
import { canonicalFor, collectionPageJsonLd, pageBreadcrumbJsonLd } from "@/lib/seo";
import { productsHeadTh } from "@/i18n/search-head-copy";
import { Suspense } from "react";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { LineOrderingNotice } from "@/components/commerce/LineOrderingNotice";

// The count in the <title>/description is the same "shown products" number the page header
// prints — counted from the two catalog halves at build, never typed (owner 2026-09-21, SEO
// round ก rows A7/A8). Round 30.4's ruling still holds: no "น้ำยา" until that category has
// products on the storefront (owner 2026-09-13, THAI_STYLE §6).
const PRODUCTS_TOTAL_COUNT = allProducts.length + getPublishedProducts().length;
const PRODUCTS_HEAD = productsHeadTh(PRODUCTS_TOTAL_COUNT);

export const metadata: Metadata = {
  title: { absolute: PRODUCTS_HEAD.title },
  description: PRODUCTS_HEAD.description,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd({ name: PRODUCTS_HEAD.title, description: PRODUCTS_HEAD.description, path: "/products" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(PRODUCTS_HEAD.title, "/products")) }} />
      <ProductsPageHeader totalCount={totalCount} />
      <Container className="py-12 lg:py-16">
        {/* Only while online ordering is off, and only visible when /cart or /checkout sent the
            visitor here (?order=line) — read client-side so this page stays prerendered.
            src/lib/commerce/ordering-mode.ts, owner 2026-09-07. */}
        {!ORDERING_ENABLED && (
          <Suspense fallback={null}>
            <LineOrderingNotice />
          </Suspense>
        )}
        <CatalogBrowser products={allProducts} publishedProducts={publishedProducts} searchTexts={catalogSearchTexts(allProducts, publishedProducts)} inStockKeys={inStockEntryKeys(allProducts, publishedProducts)} />
      </Container>
    </>
  );
}
