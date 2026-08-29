import Image from "next/image";
import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProductGallery({ product }: { product: Product }) {
  const photos = product.assets.filter((a) => a.kind === "official-photo" && a.role === "detail");
  if (photos.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Official campaign imagery."
          description={`Real photography from ${photos[0].sourceName}, used here for reference — not redistributed for commercial purposes.`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <figure key={i} className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-surface-border-soft bg-surface-1">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-2"
                />
              </div>
              <figcaption className="label-mono flex items-center justify-between px-4 pb-3 text-[0.6rem] text-foreground-dim">
                <span>{photo.angle}</span>
                <span>
                  © {photo.sourceName}
                  {photo.sourceUrl && (
                    <>
                      {" · "}
                      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-foreground-muted">
                        source
                      </a>
                    </>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
