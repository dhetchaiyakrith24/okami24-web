"use client";

import Image from "next/image";
import type { Product, StoryImage } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { cn } from "@/lib/utils";

/**
 * "More details" — image-fix round 2026-09-30 (owner: tell the product the way UWELL's product pages do — one highlight
 * at a time, a big image and a short headline, all the options together, specs at the end; designer option A).
 * Rendered only for products with `storyDetails`, in place of ProductGallery + ProductAnatomy + FeatureGrid (page.tsx);
 * the spec sheet that follows on the page closes it, so it is not repeated here.
 *
 *  0. `storyCover` — the maker's campaign poster, full container width under the heading.
 *  1. one block per `features[]` entry that has an `image` (the maker's own poster): image 7/12 + text 5/12 on
 *     desktop, alternating sides and backgrounds; on phones the poster sits above its text. Every poster is shown
 *     whole at its own proportions — its headline is printed in it, a crop cuts words (designer 2026-09-30).
 *     Thai text = the same `features` overlay FeatureGrid reads (product-copy-th.ts), English otherwise.
 *  2. every flavour/colour together — `storyLineup` (the wide lineup banner) when there is one, then the box + device photo (`boxImage`, else `image`) with its name as page text,
 *     so the names are always spelled right and readable on a phone.
 */
function Poster({ img, sizes, className }: { img: StoryImage; sizes: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-surface-border-soft bg-black", className)}>
      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} className="block h-auto w-full" />
    </div>
  );
}

function Credit({ img, linkLabel }: { img: StoryImage; linkLabel: string }) {
  return (
    <p className="label-mono text-[0.6rem] text-foreground-dim" lang="en">
      © {img.sourceName}
      {img.sourceUrl && (
        <>
          {" · "}
          <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="transition-colors hover:text-foreground hover:underline">
            {linkLabel}
          </a>
        </>
      )}
    </p>
  );
}

export function ProductMoreDetails({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  const copyTh = locale === "th" ? PRODUCT_COPY_TH[product.slug]?.features : undefined;
  const highlights = product.features.filter((f) => f.image);
  const cover = product.storyCover;
  const isColour = (product.colorVariants?.length ?? 0) > 0;
  type Tile = { id: string; name: string; swatchHex: string; photo?: { src: string; alt: string } };
  const options: Tile[] = isColour
    ? (product.colorVariants ?? []).map((o) => ({ id: o.id, name: o.name, swatchHex: o.swatchHex, photo: o.image }))
    : (product.flavorVariants ?? []).map((o) => ({ id: o.id, name: o.name, swatchHex: o.swatchHex, photo: o.boxImage ?? o.image }));
  const tiles = options.filter((t) => t.photo);
  if (!cover && highlights.length === 0 && tiles.length === 0) return null;
  const sourceName = cover?.sourceName ?? highlights[0]?.image?.sourceName;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0" aria-labelledby="more-details-title">
      <Container className="pt-14 lg:pt-20">
        <SectionHeading
          eyebrow={dict.product.featuresEyebrow}
          title={<span id="more-details-title">{dict.product.moreDetailsTitle}</span>}
          description={sourceName ? dict.product.galleryNote.replace("{brand}", sourceName) : undefined}
        />
        {cover && (
          <div className="mt-8 flex flex-col gap-2 lg:mt-10">
            <Poster img={cover} sizes="(min-width: 1280px) 1200px, 100vw" />
            <Credit img={cover} linkLabel={dict.product.gallerySourceLinkLabel} />
          </div>
        )}
      </Container>

      <div className="mt-10 flex flex-col lg:mt-14">
        {highlights.map((f, i) => {
          const img = f.image!;
          const th = copyTh?.[f.id];
          const title = th?.title ? thaiTypographyNode(th.title) : f.title;
          const body = th?.description ? thaiTypographyNode(th.description) : f.description;
          const flip = i % 2 === 1;
          return (
            <div key={f.id} className={cn("py-8 lg:py-14", i % 2 === 0 ? "bg-surface-1" : "bg-surface-0")}>
              <Container className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
                <Poster img={img} sizes="(min-width: 1024px) 58vw, 100vw" className={cn("w-full lg:col-span-7", flip && "lg:order-2")} />
                <div className={cn("flex flex-col gap-3 lg:col-span-5", flip && "lg:order-1")}>
                  <span className="label-mono text-xs text-steel" lang="en">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground lg:text-[2rem]">{title}</h3>
                  <p className="max-w-md text-base leading-relaxed text-pretty text-foreground-muted">{body}</p>
                  <Credit img={img} linkLabel={dict.product.gallerySourceLinkLabel} />
                </div>
              </Container>
            </div>
          );
        })}
      </div>

      {tiles.length > 0 && (
        <Container className="flex flex-col gap-8 py-14 lg:py-20">
          <h3 className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
            {(isColour ? dict.product.moreDetailsAllColours : dict.product.moreDetailsAllFlavours).replace("{count}", String(options.length))}
          </h3>
          {product.storyLineup && (
            <Image
              src={product.storyLineup.src}
              alt={product.storyLineup.alt}
              width={product.storyLineup.width}
              height={product.storyLineup.height}
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="block h-auto w-full"
            />
          )}
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4">
            {tiles.map((t) => (
              <li key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-surface-border-soft bg-surface-1">
                <div className="relative aspect-square w-full">
                  <Image src={t.photo!.src} alt={t.photo!.alt} fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw" className="object-contain p-2" />
                </div>
                <div className="flex items-start gap-1.5 px-3 pb-3 text-xs font-medium text-foreground-muted max-lg:px-2">
                  <span className="mt-[0.3em] block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: t.swatchHex }} aria-hidden />
                  <span>{t.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </section>
  );
}
