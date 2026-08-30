import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { buildStorefrontPreview } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PreviewBanner } from "./_components/PreviewBanner";
import { PreviewProductCard } from "./_components/PreviewProductCard";
import { assertPreviewAllowedInThisEnvironment } from "./_components/preview-guard";

export const metadata: Metadata = {
  title: "[Preview] ProductMaster Active Catalog",
  robots: { index: false, follow: false },
};

export default function ProductMasterPreviewPage() {
  assertPreviewAllowedInThisEnvironment();
  const products = buildStorefrontPreview();

  return (
    <>
      <PreviewBanner />
      <PageHeader
        eyebrow="Phase 2.8 · Internal preview"
        title="ProductMaster Active Catalog Preview"
        description="สินค้าจริงจาก Shipnity ที่ผ่าน minimum enrichment (Phase 2.7) — ยังไม่ publish บน storefront จริง"
      />
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((p) => (
            <PreviewProductCard key={p.slug} product={p} />
          ))}
        </div>
        {products.length === 0 && <p className="text-sm text-foreground-muted">No preview-ready products found.</p>}
      </Container>
    </>
  );
}
