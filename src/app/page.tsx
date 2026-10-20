import type { Metadata } from "next";
import { allProducts, getFlagshipProducts, getProduct } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { brands } from "@/data/brands";
import { guides } from "@/data/guides";
import { HomeIntro } from "@/components/home/HomeIntro";
import { Hero } from "@/components/home/Hero";
import { HeroShowcase, type HeroSlotView } from "@/components/home/HeroShowcase";
import { HomeFlow } from "@/components/home/HomeFlow";
import { DESKTOP_INTRO, HOME_HERO_SLOTS, PHONE_HERO } from "@/data/home-hero";
import { getCatalogItem } from "@/lib/catalog-index";
import { getCategory } from "@/data/categories";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { CategoryNav } from "@/components/home/CategoryNav";
import { HomeTypeSection } from "@/components/home/HomeTypeSection";
import { HOME_TYPE_SECTIONS } from "@/data/home-sections";
import { CompareCTA } from "@/components/home/CompareCTA";
import { GuideTeaserGrid } from "@/components/home/GuideTeaserGrid";
import { HomeProductIndex } from "@/components/home/HomeProductIndex";
import { CONTACT } from "@/data/contact";
import { canonicalFor, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

// The homepage's own canonical — deliberately set HERE, not on the root layout, so it doesn't
// leak as the default for every other page (see layout.tsx's metadata comment).
export const metadata: Metadata = canonicalFor("/");

export default function Home() {
  const flagships = getFlagshipProducts();
  const flagship = getProduct("caliburn-g5")!;
  const mBar10k = getProduct("m-bar-10k")!;

  // The hero's four slots (src/data/home-hero.ts), resolved here so the client component only gets
  // the four small records it shows. A product that is no longer visible, or has no card photo,
  // drops its slot rather than breaking the hero.
  const heroSlots: HeroSlotView[] = HOME_HERO_SLOTS.flatMap(({ type, product, photo }) => {
    const item = getCatalogItem(product);
    const category = getCategory(type);
    if (!item?.image || !category) return [];
    return [{
      type,
      categoryHref: `/products/${category.slug}`,
      productHref: item.href,
      // legacy products carry a short model name ("Caliburn G5"); displayName repeats the brand in caps
      name: getProduct(product)?.name ?? item.name,
      brand: item.brandName ?? "",
      // the hero's own cut-out when the slot has one (home-hero.ts `photo`), else the card photo
      image: photo ? { src: photo, alt: item.image.alt } : item.image,
    }];
  });

  // The hero's two counters used to be hardcoded ("28 products", "3 brands") and had drifted far
  // from the catalog — /products already showed 53. Both are now counted from the same two sources
  // that page counts, and the brand figure from the same list its brand filter is built from, so
  // the homepage cannot silently go stale again (owner, 2026-09-09, round 30.1).
  const publishedProducts = getPublishedProducts();
  const productCount = allProducts.length + publishedProducts.length;
  const brandIdsInCatalog = new Set([...allProducts.map((p) => p.brandId), ...publishedProducts.map((p) => p.brandId)]);
  const brandCount = brands.filter((b) => brandIdsInCatalog.has(b.id)).length;

  return (
    <>
      {/* Organization + WebSite structured data live on the homepage only — one entity node per
          site, referenced by `@id` from every product page's `Offer.seller` (see seo.ts). Same
          injection pattern as the product page's breadcrumb JSON-LD; nothing visible renders. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(CONTACT)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
      {/* Mobile round C, MOBILE_SPEC [M1] "plays once, and not again on back". The phone's hero
          motion is pure CSS so that it starts in the first painted frame, before hydration —
          which means the "has this already played?" decision has to be made before that frame
          too, or a reload inside the same session would restart the animation and then have it
          cut short mid-flight. This line runs while the HTML is still parsing and, on a repeat
          view, marks <html> so the CSS never arms the animation at all. Back/forward inside the
          app is a client render that never re-runs this, so Hero.tsx sets the same attribute
          itself once the motion has finished (see the effect there). Desktop never reads it. */}
      {/* The second line is M1b's Save-Data / 2G opt-out. It has to run here, before the first
          painted frame, for the same reason as the line above it: the hero's background motion is
          CSS, so the decision not to arm it cannot wait for hydration. `data-okami-lite` drops the
          whole layer in globals.css, which also means its lazy ghost image is never requested —
          the point of honouring Save-Data in the first place. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{if(sessionStorage.getItem("okami24-home-intro"))document.documentElement.dataset.okamiIntro="played"}catch(e){}' +
            'try{var c=navigator.connection;if(c&&(c.saveData||/(^|-)2g$/.test(c.effectiveType||"")))document.documentElement.dataset.okamiLite="1"}catch(e){}',
        }}
      />
      {DESKTOP_INTRO ? <HomeIntro /> : null}
      {/* Round "หน้าแรก hero" (owner 20/10): the new hero everywhere; PHONE_HERO = "classic" puts the
          previous phone hero (Hero.tsx) back below 64rem in one step, desktop keeps the new one. */}
      {PHONE_HERO === "classic" ? (
        <>
          <div className="lg:hidden">
            <Hero flagship={flagship} backdrop={mBar10k} productCount={productCount} brandCount={brandCount} />
          </div>
          <div className="hidden lg:block">
            <HeroShowcase slots={heroSlots} />
          </div>
        </>
      ) : (
        <HeroShowcase slots={heroSlots} />
      )}
      {/* everything below the hero sits in one box: the hero's light carried down the page (HomeFlow)
          runs on a sticky stage behind its sections, which are see-through there (globals.css .okh-flow) */}
      <div className="okh-flow">
        <HomeFlow />
        <BrandMarquee />
        <CategoryNav />

        {/* Round "หน้าแรก hero" (owner 20/10 ~03:40): the page is organised by product TYPE, not around one
            line — a section per hero tab, each with every product of the type as the shop's own cards
            (src/data/home-sections.ts). The flagship rail, the Caliburn and VOOPOO rails, the two
            editorial blocks and the flavour teaser were cut to keep the page clean (Friday's pick, owner
            asked for less clutter); one revert brings them back. */}
        {HOME_TYPE_SECTIONS.map((s) => (
          <HomeTypeSection key={s.type} type={s.type} categories={s.categories} first={s.first} />
        ))}

        <CompareCTA products={flagships} />

        {/* Round 8 B1 (owner 2026-09-23): every product page, as text links grouped by category —
            the rails above are curated and left 32 of 53 product pages with no link from here.
            Placed after the compare CTA (designer #1): it is a reference list for people who know
            the model name, not a story beat, and at 390 it is ~2.5 screens tall — between the rails
            it pushed the flavour teaser, compare CTA and guides that far down. */}
        <HomeProductIndex eyebrow="Catalog Index" />

        <GuideTeaserGrid guides={guides.slice(0, 3)} />
      </div>
    </>
  );
}
