"use client";

import { Fragment, useState } from "react";
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
 * Devices only: an edge whose "device" end is itself a pod or coil (a coil that fits a pod — coil-53 → Caliburn G2 pod) stays
 * in the cards lower on the page, not in this line, which says "fits device".
 * A linked device drops the brand word when it begins its name and is the part's own brand ("VOOPOO DRAG 6" → "DRAG 6" on a
 * VOOPOO coil; LAMBDA i8 keeps "LAMBDA" on the IQOS TEREA page), and only when a model name is left (INFY "POD" keeps "INFY"). Each model name stays on one line; the break falls
 * only at a " · ".
 *
 * Designer 11/11: two levels — a device you can buy here is bright with a clear underline, one the shop does not sell is
 * muted; more than SHOWN names = the first SHOWN (links first) and a "+N รุ่น" button that opens the rest in place (the full
 * list is also the "ใช้ได้กับ" row of the spec table where the product has one).
 */
const SHOWN = 6;

const PART_CATEGORIES = new Set(["pods-cartridges", "coils-accessories"]);

export function FitsDeviceLine({ slug, devices, ownBrand, className }: { slug: string; devices: RelatedDevice[]; ownBrand: string | null; className?: string }) {
  const { dict, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const linked = devices.filter((d) => !PART_CATEGORIES.has(d.ref.categoryId)).map((d) => {
    const name = pilotName(d.ref.slug, d.ref.name, locale);
    const brand = d.ref.brandName;
    const rest = brand && name.toLowerCase().startsWith(`${brand.toLowerCase()} `) ? name.slice(brand.length + 1) : null;
    const sameBrand = !!brand && !!ownBrand && brand.toLowerCase() === ownBrand.toLowerCase();
    const short = rest && sameBrand && (/d/.test(rest) || rest.trim().includes(" ")) ? rest : name;
    return { key: d.ref.slug, href: d.ref.href, name: short };
  });
  const plain = fitsDeviceNames(slug, linked.map((l) => l.name));
  if (linked.length === 0 && plain.length === 0) return null;
  const items = [
    ...linked.map((l) => (
      <Link key={l.key} href={l.href} lang="en" className="whitespace-nowrap text-foreground underline decoration-foreground-dim decoration-1 underline-offset-2 transition-colors hover:text-ember hover:decoration-ember">
        {l.name}
      </Link>
    )),
    ...plain.map((n) => (
      <span key={n} lang="en" className="whitespace-nowrap text-foreground-muted">
        {n}
      </span>
    )),
  ];
  const hidden = open ? 0 : Math.max(0, items.length - SHOWN);
  const shown = hidden > 0 ? items.slice(0, SHOWN) : items;
  return (
    <p className={`text-sm leading-relaxed text-foreground-dim ${className ?? ""}`}>
      <span className="mr-1.5">{dict.product.fitsDeviceLine}</span>
      {shown.map((node, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-foreground-dim"> · </span>}
          {node}
        </Fragment>
      ))}
      {hidden > 0 && (
        <>
          <span className="text-foreground-dim"> · </span>
          <button type="button" onClick={() => setOpen(true)} className="whitespace-nowrap text-foreground-dim underline underline-offset-2 transition-colors hover:text-foreground">
            {dict.product.fitsDeviceMore.replace("{n}", String(hidden))}
          </button>
        </>
      )}
    </p>
  );
}
