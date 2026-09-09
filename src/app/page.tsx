import type { Metadata } from "next";
import { getFlagshipProducts, getProduct, getProductsByFamily, getProductsByBrand } from "@/data/products";
import { guides } from "@/data/guides";
import { HomeIntro } from "@/components/home/HomeIntro";
import { Hero } from "@/components/home/Hero";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { CategoryNav } from "@/components/home/CategoryNav";
import { ProductRailSection } from "@/components/home/ProductRailSection";
import { EditorialSplit } from "@/components/home/EditorialSplit";
import { FlavorTeaser } from "@/components/home/FlavorTeaser";
import { CompareCTA } from "@/components/home/CompareCTA";
import { GuideTeaserGrid } from "@/components/home/GuideTeaserGrid";
import { canonicalFor } from "@/lib/seo";

// The homepage's own canonical — deliberately set HERE, not on the root layout, so it doesn't
// leak as the default for every other page (see layout.tsx's metadata comment).
export const metadata: Metadata = canonicalFor("/");

export default function Home() {
  const flagships = getFlagshipProducts();
  const flagship = getProduct("caliburn-g5")!;
  const caliburnFamily = getProductsByFamily("caliburn");
  const voopooProducts = getProductsByBrand("voopoo");
  const mBar10k = getProduct("m-bar-10k")!;

  return (
    <>
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
      <HomeIntro />
      <Hero flagship={flagship} backdrop={mBar10k} />
      <BrandMarquee />
      <CategoryNav />

      <ProductRailSection
        eyebrow="Flagship Devices"
        title="One flagship per brand, chosen for depth of documentation."
        description="Every device in the catalog is real. These three get the full treatment — gallery-ready detail pages, anatomy callouts, and richer feature storytelling."
        viewAllHref="/products"
        products={flagships}
      />

      <EditorialSplit
        eyebrow="Technology · Control"
        title="Fewer buttons, same control."
        paragraphs={[
          "UWELL's Smart Triple-Tap Control replaces a row of physical buttons with a tap gesture sensor — switching output modes without adding hardware that can wear out or let in moisture.",
          "It's part of a broader shift across the catalog: gesture sensors, full touchscreens, and auto-adjusting chipsets are steadily replacing fixed button rows on compact pod devices.",
        ]}
        ctaHref="/technology/gesture-and-triple-tap-control"
        ctaLabel="Read the technology story"
        product={flagship}
      />

      <ProductRailSection
        eyebrow="UWELL · Caliburn Family"
        title="Open-System Pod Systems"
        description="Ten generations deep, from the screen-free G4 Mini to the touchscreen-driven G4 Pro KOKO."
        viewAllHref="/products/pod-systems"
        products={caliburnFamily}
      />

      <EditorialSplit
        eyebrow="SALTHUB · M Bar"
        title="A disposable built around mode control."
        paragraphs={[
          "The M Bar 10K trades the single fixed output of most disposables for three switchable power modes — Eco, Soft, and Boost — cycled with a double-click and shown through an RGB status indicator.",
          "It's rechargeable over USB-C rather than single-use, positioning it between a traditional disposable and a reusable switch-style device.",
        ]}
        ctaHref="/products/disposables"
        ctaLabel="Browse disposables"
        product={mBar10k}
        reverse
        tone="surface-1"
      />

      <ProductRailSection
        eyebrow="VOOPOO"
        title="Pod Kits & Pod Mods"
        description="From the ultra-light VMATE i3 to the 220W DRAG 6 — ARGUS, DRAG, VINCI, and V series in one lineup."
        viewAllHref="/products/pod-kits"
        products={voopooProducts}
      />

      <FlavorTeaser />

      <CompareCTA products={flagships} />

      <GuideTeaserGrid guides={guides.slice(0, 3)} />
    </>
  );
}
