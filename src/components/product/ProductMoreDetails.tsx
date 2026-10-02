"use client";

import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import type { Feature, Product, StoryImage } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductAnatomySheet } from "@/components/product/ProductAnatomySheet";
import { ProductAnatomy } from "@/components/product/ProductAnatomy";
import { ANATOMY_SHEETS } from "@/i18n/anatomy-sheet-copy";
import { ProductArticleBody, ProductArticleLede } from "@/components/product/ProductArticle";
import { productArticle } from "@/data/product-articles";
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
 *  0. `storyCover` — the maker's campaign poster, full container width under the heading; then the "ไล่ดูทีละส่วน"
 *     exploded-view sheet for the slugs listed in anatomy-sheet-copy.ts (round "M Bar 10K exploded view", 2026-09-30).
 *  1. one block per `features[]` entry that has an `image` (the maker's own poster): image 7/12 + text 5/12 on
 *     desktop, alternating sides and backgrounds; on phones the poster sits above its text. Every poster is shown
 *     whole at its own proportions — its headline is printed in it, a crop cuts words (designer 2026-09-30).
 *     Thai text = the same `features` overlay FeatureGrid reads (product-copy-th.ts), English otherwise.
 *  2. every flavour/colour together — the box + device photo (`boxImage`, else `image`) with its name as page text,
 *     so the names are always spelled right and readable on a phone. Owner 2026-09-30: this grid of box + device
 *     photos stays even when the page opens on the lineup; only the wide lineup banner of PR #128 (the same
 *     all-devices picture as the top image) was the duplicate, and it is gone (#130). On a `lineupFirst` product a
 *     flavour with no `boxImage` gets no tile: its device photo is already one swipe away in the gallery above, so a
 *     grid of the same device photos would be that duplicate again (round "image-sitewide" 2026-09-30, M Bar 9K).
 *  A flagship with no exploded-view sheet yet keeps its old anatomy block right after the cover (owner 02/10, Caliburn
 *  G5: the owner is making its exploded view; until then the page keeps the drawn one). M Bar 10K has a sheet → unchanged.
 *  Article round (02/10, designer option A): the product's article (src/data/product-articles.ts) — its lede under the
 *  heading, its buyer-question blocks after the grid. A product with no article renders exactly as before.
 */
function Poster({ img, sizes, className }: { img: StoryImage; sizes: string; className?: string }) {
  return (
    <div className={cn(!img.transparent && "overflow-hidden rounded-2xl border border-surface-border-soft bg-black", className)}>
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
    : (product.flavorVariants ?? []).map((o) => ({ id: o.id, name: o.name, swatchHex: o.swatchHex, photo: o.boxImage ?? (product.lineupFirst ? undefined : o.image) }));
  const tiles = options.filter((t) => t.photo);
  const hasArticle = productArticle(product.slug, locale) !== undefined;
  if (!cover && highlights.length === 0 && tiles.length === 0 && !hasArticle) return null;
  const sourceName = cover?.sourceName ?? highlights[0]?.image?.sourceName;
  const stage = product.storyLayout === "stage";
  const grid =
    tiles.length > 0 ? (
      <Container className="flex flex-col gap-8 py-14 lg:py-20">
        <h3 className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
          {(isColour ? dict.product.moreDetailsAllColours : dict.product.moreDetailsAllFlavours).replace("{count}", String(options.length))}
        </h3>
        <ul className={cn("grid grid-cols-3 gap-3 sm:grid-cols-4 lg:gap-4", stage && tiles.length === 7 ? "lg:grid-cols-7" : "lg:grid-cols-6")}>
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
    ) : null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0" aria-labelledby="more-details-title">
      <Container className="pt-14 lg:pt-20">
        <SectionHeading
          eyebrow={dict.product.featuresEyebrow}
          title={<span id="more-details-title">{dict.product.moreDetailsTitle}</span>}
          description={sourceName ? dict.product.galleryNote.replace("{brand}", sourceName) : undefined}
        />
        <ProductArticleLede slug={product.slug} />
        {cover && (
          <div className="mt-8 flex flex-col gap-2 lg:mt-10">
            <Poster img={cover} sizes="(min-width: 1280px) 1200px, 100vw" />
            <Credit img={cover} linkLabel={dict.product.gallerySourceLinkLabel} />
          </div>
        )}
        <ProductAnatomySheet product={product} />
      </Container>
      {product.isFlagship && !ANATOMY_SHEETS[product.slug] && (
        <div className="mt-10 lg:mt-14">
          <ProductAnatomy product={product} />
        </div>
      )}

      {stage ? (
        <StageStory product={product} highlights={highlights} copyTh={copyTh} grid={grid} />
      ) : (
        <>
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

          {grid}
        </>
      )}
      {hasArticle && (
        <Container className="pb-14 lg:pb-20">
          <ProductArticleBody slug={product.slug} />
        </Container>
      )}
    </section>
  );
}

type FeatureCopyTh = Record<string, { title?: string; description: string; subline?: string; captions?: string[] }> | undefined;

/**
 * "stage" story layout (article round 02/10 — owner: "ทำแบบ Uwell … ปรับให้เป็นแบบฉบับของเรา"; designer option A).
 * UWELL's rhythm in the site's dark theme: a bar of numbered highlight chips that jump to each block, then one centred
 * block per highlight — number · headline · subline · the maker's poster (its phone version below lg when the data has
 * one) · caption chips · text · credit. One continuous background; the posters make the rhythm. The colour/flavour grid
 * follows the block named by `storyColoursAfter` (default: the last). White maker posters stay in their rounded card
 * (lesson ช1) — nothing here bleeds to the screen edge.
 */
function StageStory({ product, highlights, copyTh, grid }: { product: Product; highlights: Feature[]; copyTh: FeatureCopyTh; grid: ReactNode }) {
  const { dict, locale } = useLocale();
  const t = (x: string) => (locale === "th" ? thaiTypographyNode(x) : x);
  const gridAfter = product.storyColoursAfter ?? highlights[highlights.length - 1]?.id;
  return (
    <>
      <Container className="mt-12 lg:mt-16">
        <ol className="grid grid-cols-2 gap-2 lg:grid-cols-6 lg:gap-3">
          {highlights.map((f, i) => (
            <li key={f.id}>
              <a href={`#story-${f.id}`} className="flex h-full flex-col gap-1 rounded-xl border border-surface-border-soft bg-surface-1 px-3 py-2.5 transition-colors hover:border-ember">
                <span className="label-mono text-[0.65rem] text-steel" lang="en">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium leading-snug text-foreground">{t(copyTh?.[f.id]?.title ?? f.title)}</span>
              </a>
            </li>
          ))}
        </ol>
      </Container>
      {highlights.map((f, i) => {
        const img = f.image!;
        const th = copyTh?.[f.id];
        const subline = th?.subline ?? (locale === "th" ? undefined : f.subline);
        const captions = th?.captions ?? (locale === "th" ? undefined : f.captions);
        return (
          <Fragment key={f.id}>
            <div id={`story-${f.id}`} className="scroll-mt-24 py-16 lg:py-28">
              <Container className="flex flex-col items-center text-center">
                <span className="label-mono text-xs text-steel" lang="en">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 max-w-3xl text-balance font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">{t(th?.title ?? f.title)}</h3>
                {subline && <p className="mt-4 max-w-2xl text-lg text-balance text-foreground-muted lg:text-xl">{t(subline)}</p>}
                <div className="mt-8 w-full max-w-5xl lg:mt-12">
                  {f.imageMobile ? (
                    <>
                      <Poster img={f.imageMobile} sizes="100vw" className="lg:hidden" />
                      <Poster img={img} sizes="(min-width: 1280px) 1024px, 80vw" className="hidden lg:block" />
                    </>
                  ) : (
                    <Poster img={img} sizes="(min-width: 1280px) 1024px, 100vw" />
                  )}
                </div>
                {captions && captions.length > 0 && (
                  <ul className="mt-6 flex flex-wrap justify-center gap-2">
                    {captions.map((c) => (
                      <li key={c} className="rounded-full border border-surface-border-soft bg-surface-1 px-3 py-1 text-sm text-foreground-muted">{t(c)}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-foreground-muted">{t(th?.description ?? f.description)}</p>
                <div className="mt-3">
                  <Credit img={img} linkLabel={dict.product.gallerySourceLinkLabel} />
                </div>
              </Container>
            </div>
            {f.id === gridAfter && grid}
          </Fragment>
        );
      })}
    </>
  );
}
