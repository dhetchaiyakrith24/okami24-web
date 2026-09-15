"use client";

import Image from "next/image";
import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { galleryCaptionTh } from "@/i18n/gallery-copy-th";

export function ProductGallery({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  const photos = product.assets.filter((a) => a.kind === "official-photo" && a.role === "detail");
  if (photos.length === 0) return null;
  // Round 30.4ค batch 5 (owner 2026-09-15): a Thai visitor reads the caption from gallery-copy-th.ts
  // (keyed by the English caption). English/Chinese unchanged.
  const th = locale === "th";

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow={dict.product.galleryEyebrow}
          title={dict.product.galleryTitle}
          description={dict.product.galleryNote.replace("{brand}", photos[0].sourceName ?? "")}
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
                <span>{th && photo.angle ? galleryCaptionTh(photo.angle) : photo.angle}</span>
                <span>
                  © {photo.sourceName}
                  {photo.sourceUrl && (
                    <>
                      {" · "}
                      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-foreground-muted">
                        {dict.product.gallerySourceLinkLabel}
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
