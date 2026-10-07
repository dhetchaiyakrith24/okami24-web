"use client";

import Image from "next/image";
import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { galleryCaptionTh } from "@/i18n/gallery-copy-th";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  const photos = product.assets.filter((a) => a.kind === "official-photo" && a.role === "detail");
  if (photos.length === 0) return null;
  // Round 30.4ค batch 5 (owner 2026-09-15): a Thai visitor reads the caption from gallery-copy-th.ts
  // (keyed by the English caption) and the caption row drops `.label-mono`'s mono face, tracking and
  // uppercase — the same treatment as the Thai spec-chip label row (SpecChip.tsx); the dictionary's
  // own "แหล่งที่มา" sits in that row too and was letter-spaced until now. The Thai row is 0.65rem like
  // the spec-chip label (designer option ข, owner 2026-09-15). English/Chinese unchanged.
  const th = locale === "th";

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow={dict.product.galleryEyebrow}
          title={dict.product.galleryTitle}
          // Owner 2026-09-30 cut the "not for commercial use" clause.
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
              <figcaption className={cn("label-mono flex items-center justify-between px-4 pb-3 text-[0.6rem] text-foreground-dim", th && "font-sans! font-medium tracking-normal! normal-case! text-[0.65rem] text-foreground-muted")}>
                <span>{th && photo.angle ? thaiTypographyNode(galleryCaptionTh(photo.angle)) : photo.angle}</span>
                <span>
                  © {photo.sourceName}
                  {photo.sourceUrl && (
                    <>
                      {" · "}
                      {/* Round 30.4ข close (designer, parked since 30.4ก): the Thai caption is already
                          `text-foreground-muted`, so a muted hover did nothing there — the link now
                          brightens to `text-foreground` and underlines in every language. */}
                      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="transition-colors hover:text-foreground hover:underline">
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
