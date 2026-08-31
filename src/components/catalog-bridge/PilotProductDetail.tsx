import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { ProductMasterGlyph } from "./ProductMasterGlyph";
import { ProductMasterVariantPicker } from "./ProductMasterVariantPicker";
import { PilotRelatedProducts } from "./PilotRelatedProducts";

/**
 * Phase 3.0 — storefront-native product detail body for a ProductMaster pilot product, rendered
 * from the real `/products/[slug]` route (see that page's third branch). Deliberately NOT the
 * legacy `ProductHero`/`ProductGallery`/`ProductAnatomy`/`FeatureGrid`/`SpecSheet`/
 * `CompatibilitySection` — every one of those reads `product.attributes`/`.specifications`/
 * `.features`/`.compatibility`, none of which exist on a Shipnity-sourced draft (see the
 * Phase 3.0 report §LEGACY CONSUMER FRICTION). Structure carried over from the Phase 2.8/2.9
 * isolated preview's detail page, minus the "internal preview" framing — this now IS the real
 * page for these 5 products, just gated to non-production by `storefront-bridge.ts`.
 */
export function PilotProductDetail({ product, related }: { product: StorefrontProductView; related: StorefrontProductView[] }) {
  return (
    <>
      <PageHeader
        eyebrow={product.categoryName}
        title={product.displayName}
        description={product.tagline}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{product.brandName}</Badge>
            <Badge tone="unverified">Unpublished</Badge>
          </div>
        }
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div className="relative aspect-[4/5] w-full rounded-2xl border border-surface-border bg-surface-1 p-10">
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-contain p-4"
              priority
            />
          ) : (
            <ProductMasterGlyph kind={product.glyphKind} />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="label-mono text-xs text-foreground-dim">ราคาอ้างอิงจากระบบปฏิบัติการ (Shipnity)</span>
            <p className="font-display text-3xl font-bold text-foreground">
              {product.priceReferenceValue !== null ? `฿${product.priceReferenceValue.toLocaleString("th-TH")}` : "ไม่มีข้อมูล"}
            </p>
            <p className="text-xs text-foreground-muted">
              แหล่งที่มา: {product.priceReferenceSource ?? "—"} — ยังไม่ใช่ราคาขายสุดท้ายที่ owner อนุมัติ
            </p>
          </div>

          <ProductMasterVariantPicker optionAxisLabel={product.optionAxisLabel} variants={product.variants} />
        </div>
      </Container>

      <PilotRelatedProducts products={related} />
    </>
  );
}
