import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/data/brands";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description: "What NOVA VAPOR is, how the catalog was built, and why every spec is labeled verified or unverified.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A catalog built on what's actually documented."
        description="NOVA VAPOR is a product-discovery and design demonstration — an original catalog, comparison tool, and finder built from real, researched device specifications."
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">What this is</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              This site organizes 28 real pod systems, pod kits, disposables, and cartridges from three brands —
              UWELL, VOOPOO, and SALTHUB — into a single catalog, with a comparison tool, a guided product finder,
              and buying guides. It is a demonstration of product discovery and information design, not an active
              storefront: no products can be purchased here.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">How the catalog was built</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              Every product record was researched against official brand pages and cross-checked against
              secondary retailer or review listings where the primary source wasn&apos;t directly accessible. Each
              specification carries a <span className="text-verified">verified</span> or{" "}
              <span className="text-unverified">unverified</span> label — an unverified field means it could not
              be independently confirmed, and it&apos;s shown as a labeled gap rather than a guess.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">The brands referenced</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              Product taxonomy and specifications are drawn from three official sources. NOVA VAPOR is an
              independent, original project — it is not affiliated with, endorsed by, or operated by any of them.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {brands.map((b) => (
                <li key={b.id} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                  <Link href={`/brands/${b.slug}`} className="font-semibold text-foreground hover:text-ember">
                    {b.name}
                  </Link>
                  <p className="mt-1 text-sm text-foreground-muted">{b.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">Design approach</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              Every product illustration on this site is an original, parametric vector rendering generated from
              that product&apos;s own catalog data — form factor, screen type, flagship status — rather than
              manufacturer photography. Two of the three flagship pages additionally include a small gallery of
              official campaign photography, clearly labeled with its source. The visual system itself was built
              from scratch for this project rather than copying any referenced brand&apos;s layout.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">Compliance</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              This site is intended for adults of legal purchase age in their jurisdiction, makes no health,
              safety, or cessation claims about vaping, and does not implement a real transactional purchase
              flow. Nicotine is an addictive chemical.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
