"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pilotName } from "@/i18n/product-names-en";
import { fitsDeviceNames } from "@/data/fits-devices";
import type { RelatedDevice } from "@/data/catalog-relationships";

/**
 * T2-31 (outside tester 10/11: "หัวพอตไม่บอกว่าใช้กับเครื่องไหน"): one line under a pod head's / coil's price —
 * "ใช้กับเครื่อง DRAG 6 · DRAG X2 · Drag S2". First the devices the shop sells (links, from the cited edges in
 * src/data/catalog-relationships.ts — the same list as the "fits these devices" cards lower on the page), then the
 * maker-named devices the shop does not sell (plain text, src/data/fits-devices.ts). Nothing cited = no line.
 *
 * A linked device drops the brand word when it begins its name ("VOOPOO DRAG 6" → "DRAG 6"): the line names models of
 * the part's own system, and the brand is already on the page. Each model name stays on one line; the break falls
 * only at a " · ".
 */
export function FitsDeviceLine({ slug, devices, className }: { slug: string; devices: RelatedDevice[]; className?: string }) {
  const { dict, locale } = useLocale();
  const linked = devices.map((d) => {
    const name = pilotName(d.ref.slug, d.ref.name, locale);
    const brand = d.ref.brandName;
    const short = brand && name.toLowerCase().startsWith(`${brand.toLowerCase()} `) ? name.slice(brand.length + 1) : name;
    return { key: d.ref.slug, href: d.ref.href, name: short };
  });
  const plain = fitsDeviceNames(slug, linked.map((l) => l.name));
  if (linked.length === 0 && plain.length === 0) return null;
  const items = [
    ...linked.map((l) => (
      <Link key={l.key} href={l.href} lang="en" className="whitespace-nowrap text-foreground underline decoration-surface-border underline-offset-2 transition-colors hover:text-ember hover:decoration-ember">
        {l.name}
      </Link>
    )),
    ...plain.map((n) => (
      <span key={n} lang="en" className="whitespace-nowrap text-foreground">
        {n}
      </span>
    )),
  ];
  return (
    <p className={`text-sm leading-relaxed text-foreground-muted ${className ?? ""}`}>
      <span className="mr-1.5 text-foreground-dim">{dict.product.fitsDeviceLine}</span>
      {items.map((node, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-foreground-dim"> · </span>}
          {node}
        </Fragment>
      ))}
    </p>
  );
}
