import { getFlagshipProducts, getProduct, getProductsByFamily, getProductsByBrand } from "@/data/products";
import { guides } from "@/data/guides";
import { Hero } from "@/components/home/Hero";
import { CategoryNav } from "@/components/home/CategoryNav";
import { ProductRailSection } from "@/components/home/ProductRailSection";
import { EditorialSplit } from "@/components/home/EditorialSplit";
import { FlavorTeaser } from "@/components/home/FlavorTeaser";
import { CompareCTA } from "@/components/home/CompareCTA";
import { GuideTeaserGrid } from "@/components/home/GuideTeaserGrid";

export default function Home() {
  const flagships = getFlagshipProducts();
  const flagship = getProduct("caliburn-g5")!;
  const caliburnFamily = getProductsByFamily("caliburn");
  const voopooProducts = getProductsByBrand("voopoo");
  const mBar10k = getProduct("m-bar-10k")!;

  return (
    <>
      <Hero flagship={flagship} />
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
