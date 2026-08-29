import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands, getBrand } from "@/data/brands";
import { familiesForBrand } from "@/data/families";
import { getProductsByBrand } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) return {};
  return { title: brand.name, description: brand.description };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) notFound();

  const families = familiesForBrand(brand.id);
  const products = getProductsByBrand(brand.id);

  return (
    <>
      <PageHeader
        eyebrow={brand.tagline}
        title={brand.name}
        description={brand.description}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {families.map((f) => (
              <Badge key={f.id} tone="steel">
                {f.name}
              </Badge>
            ))}
            <a
              href={brand.referenceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="label-mono ml-2 text-xs text-foreground-dim hover:text-foreground-muted"
            >
              Official site ↗
            </a>
          </div>
        }
      />
      <Container className="py-12 lg:py-16">
        <CatalogBrowser products={products} />
      </Container>
    </>
  );
}
