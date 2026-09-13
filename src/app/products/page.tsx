import type { Metadata } from "next";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { ProductsPageHeader } from "@/components/catalog/ProductsPageHeader";
import { canonicalFor } from "@/lib/seo";
import { Suspense } from "react";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { LineOrderingNotice } from "@/components/commerce/LineOrderingNotice";

export const metadata: Metadata = {
  // Round 30.4 (owner 2026-09-13, THAI_STYLE §6): no e-liquid is on the storefront today (legacy 0,
  // the three Shipnity SKUs are not cleared), so the title and meta do not promise it. Put "น้ำยา"
  // back in both the day the category has products.
  title: "รวมพอต หัวพอต คอยล์ และ IQOS ของแท้ทุกรุ่น",
  description: "สินค้าทั้งหมดในหน้าเดียว พอตทุกแบบ หัวพอต คอยล์ และ IQOS ของแท้ทุกชิ้น กรองตามแบรนด์หรือค้นด้วยชื่อรุ่นได้ สั่งซื้อและสอบถามทาง LINE @okm24",
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
        <CatalogBrowser products={allProducts} publishedProducts={publishedProducts} />
      </Container>
    </>
  );
}
