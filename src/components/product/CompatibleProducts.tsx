"use client";

import Image from "next/image";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { compatEvidenceTh } from "@/i18n/compat-copy-th";
import type { RelatedConsumable, RelatedDevice } from "@/data/catalog-relationships";

/**
 * Renders the STRUCTURED half of compatibility: real, clickable catalog products verified to work
 * with the product being viewed, from `src/data/catalog-relationships.ts`.
 *
 * Deliberately additive, not a replacement. The existing free-text `CompatibilitySection`
 * (legacy) still carries platform-level facts that name no single catalog product — "UWELL GPP
 * cartridge platform," "USB-C charging" — which remain true and useful and have no product to
 * link to. This section only ever shows edges where BOTH endpoints are real, currently-visible
 * catalog records, so a customer can actually click through to the part that fits.
 *
 * Renders nothing when there are no verified links — never padded, never a category-similarity
 * guess dressed up as compatibility.
 *
 * Cards intentionally do not distinguish legacy from ProductMaster products: that seam is
 * internal, and a customer should just see catalog products (mission §5).
 */
export function CompatibleProducts({
  direction,
  items,
}: {
  /** "works-with" = viewing a device, listing the parts that fit it.
   *  "fits-devices" = viewing a part, listing the devices it fits. */
  direction: "works-with" | "fits-devices";
  items: (RelatedConsumable | RelatedDevice)[];
}) {
  const { dict, locale } = useLocale();
  if (items.length === 0) return null;
  const title = direction === "works-with" ? dict.product.worksWithTitle : dict.product.fitsDevicesTitle;
  // Round 30.4ค batch 7 (owner 2026-09-15): a Thai visitor reads the cited fact from
  // compat-copy-th.ts (keyed by the English evidence string); en/zh keep the data string.
  const th = locale === "th";

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-steel" aria-hidden />
            <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
          </div>
          <p className="text-xs text-foreground-dim">{dict.product.verifiedCompatibilityNote}</p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.ref.slug}>
              <Link
                href={item.ref.href}
                className="group flex h-full items-center gap-4 rounded-xl border border-surface-border-soft bg-surface-1 p-4 transition-colors hover:border-surface-border"
              >
                <div className="relative h-16 w-16 shrink-0 rounded-lg bg-surface-2">
                  {item.ref.image && (
                    <Image src={item.ref.image.src} alt={item.ref.image.alt} fill sizes="64px" className="object-contain p-1.5" />
                  )}
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="label-mono text-[0.6rem] text-foreground-dim">{item.ref.brandName}</span>
                  <span className="text-sm font-semibold leading-snug text-foreground group-hover:text-ember">{item.ref.name}</span>
                  {/* The cited fact itself, not a marketing line — see catalog-relationships.ts. */}
                  <span className="text-xs leading-relaxed text-foreground-muted">{th ? compatEvidenceTh(item.evidence) : item.evidence}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
