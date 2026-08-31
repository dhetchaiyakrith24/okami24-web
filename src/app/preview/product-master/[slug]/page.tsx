import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { buildStorefrontPreview, getStorefrontPreviewBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PreviewBanner } from "../_components/PreviewBanner";
import { ProductMasterGlyph } from "@/components/catalog-bridge/ProductMasterGlyph";
import { ProductMasterVariantPicker } from "@/components/catalog-bridge/ProductMasterVariantPicker";
import { assertPreviewAllowedInThisEnvironment } from "../_components/preview-guard";

export function generateStaticParams() {
  return buildStorefrontPreview().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getStorefrontPreviewBySlug(slug);
  return {
    title: product ? `[Preview] ${product.displayName}` : "[Preview] Not found",
    robots: { index: false, follow: false },
  };
}

export default async function ProductMasterPreviewDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  assertPreviewAllowedInThisEnvironment();
  const { slug } = await params;
  const product = getStorefrontPreviewBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <PreviewBanner />
      <PageHeader
        eyebrow="Phase 2.8 · Internal preview"
        title={product.displayName}
        description={product.tagline}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{product.brandName}</Badge>
            <Badge tone="neutral">{product.categoryName}</Badge>
            <Badge tone="unverified">{product.publicationStatus === "unpublished" ? "Draft · Unpublished" : product.publicationStatus}</Badge>
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

          <Link href="/preview/product-master" className="label-mono text-xs text-foreground-dim underline underline-offset-4">
            ← กลับไปหน้ารายการ preview
          </Link>
        </div>
      </Container>
    </>
  );
}
