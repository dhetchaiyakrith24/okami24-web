"use client";

import type { ReactNode } from "react";
import type { ColorVariant } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { PhoneOptionTiles } from "./PhoneOptionTiles";
import { DesktopOptionTiles } from "./DesktopOptionTiles";
import type { PhotoBox } from "@/lib/option-photo-box";

/**
 * Real manufacturer color/finish selector for a Legacy Product Detail hero (owner quality review,
 * 2026-09-02 — "Legacy 28 color/variant coverage"). A row of swatch dots, not a dropdown — the
 * owner explicitly asked for a native, cinematic interaction rather than generic HTML `<select>`.
 * Selecting a color with a verified `image` swaps the hero photo (handled by the parent, which
 * owns `selectedId`); selecting a color with no `image` still updates the name label and the
 * selection ring, it just leaves the hero photo as-is — this is the deliberate "don't pretend a
 * color exists if its exact image is unavailable" rule, made visible rather than hidden.
 *
 * "All Colors" chip (owner mandate, 2026-09-03 — every multi-color family should let a customer
 * move naturally between one lineup view and individual colors). Rendered ONLY when the parent
 * passes `onSelectAll` (i.e. `product.lineupImage` exists — see `ProductHero`) so a family with no
 * real lineup shot never shows a chip that does nothing. Deliberately styled as a small labeled
 * pill, not another color dot — it isn't a color, and shouldn't visually pretend to be one.
 *
 * Sold-out colours (owner instruction, 2026-09-06): a colour whose `availability` is
 * `"out-of-stock"` still renders — catalog truth is never hidden — but dimmed, struck through
 * with a diagonal and labelled in its tooltip. Since stock round batch 2c (owner 08/10) it IS selectable, so the
 * customer can look at that colour's photo; ProductHero then shows the sold-out state (photo badge + buy action) and
 * the cart gates (ProductHero + `resolveProductRef()`) keep it out of the cart. `"unknown"`/absent renders like
 * in-stock, matching the legacy cart gate.
 *
 * Phones (queue Q5, owner 24/10): below `lg` PhoneOptionTiles (photo tiles with an in-stock / sold-out pill; a photo
 * strip past 12 options). From `lg` DesktopOptionTiles (owner 13/11: real-device photo tiles replaced the swatch dots).
 */
export function ColorVariantRail({
  variants,
  selectedId,
  onSelect,
  label,
  allLabel,
  isAllSelected,
  onSelectAll,
  allChips,
  counts,
  countLine,
  bestIds,
  photoBoxes,
  className,
}: {
  variants: ColorVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
  allLabel?: string;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
  /** More than one "all" image: one pill per image, in order (replaces `allLabel`/`isAllSelected`/`onSelectAll`). */
  allChips?: { label: string; selected: boolean; onSelect: () => void }[];
  /** Live warehouse count per option id (/api/stock — owner 30/10); empty until it arrives. */
  counts?: Record<string, number>;
  /** The picked option's count line, shown under the phone tiles' header (PhoneOptionTiles). */
  countLine?: ReactNode;
  /** Best-selling colour ids (src/data/bestseller-options.ts — owner 02/11): "ขายดี" on the tile and by the picked name, a small ember dot on the swatch. */
  bestIds?: ReadonlySet<string>;
  /** Where each colour's device sits in its photo, by image src (src/lib/option-photo-box.ts) — the desktop tiles' fit. */
  photoBoxes?: Record<string, PhotoBox>;
  /** Extra classes on the root (the product page uses it for its phone-only ordering). */
  className?: string;
}) {
  // Several "all" images (lineupImage2 — owner 01/10: Caliburn G3 Pro's 16 colours as two groups of 8): one pill each,
  // labelled by the parent ("สีที่ 1–8" / "ภาพรวมสี 1" — T2-31); `allLabel`/`isAllSelected`/`onSelectAll` stay the single-pill case.
  const pills = allChips ?? (onSelectAll && allLabel ? [{ label: allLabel, selected: !!isAllSelected, onSelect: onSelectAll }] : []);
  const anyAll = pills.some((p) => p.selected);
  const options = variants.map((v) => ({ id: v.id, name: v.name, image: v.image, swatchHex: v.swatchHex, out: v.availability === "out-of-stock", ask: !!v.stockAsk, left: counts?.[v.id], best: bestIds?.has(v.id), box: v.image ? photoBoxes?.[v.image.src] : undefined }));

  return (
    <div data-option-picker className={cn("flex flex-col gap-2.5", className)}>
      <PhoneOptionTiles
        className="lg:hidden"
        options={options}
        selectedId={anyAll ? null : selectedId}
        countLine={countLine}
        onSelect={onSelect}
        label={label}
        pills={pills}
      />
      {/* lg+: real-device photo tiles (owner 13/11 — the "tiles" preview became the default; the 32px dot row and the
          "sold-out names" line went with it: each sold-out tile says "หมด" itself). */}
      <DesktopOptionTiles className="max-lg:hidden" options={options} selectedId={anyAll ? null : selectedId} onSelect={onSelect} label={label} pills={pills} />
    </div>
  );
}
