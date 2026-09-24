"use client";

import type { Product } from "@/types/catalog";
import { DeviceGlyph } from "@/components/visual/DeviceGlyph";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/dictionaries";
import { chargingTypeTh } from "@/i18n/anatomy-copy-th";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { verifiedAttributes, verifiedRows } from "@/lib/verified-specs";

interface AnatomyPoint {
  x: number; // percent
  y: number; // percent
  label: string;
  detail: string;
  /** round 9: the display line is built from a template after the dictionary pass and never went
   *  through the typography — it stays plain so its line breaks do not move */
  plainDetail?: boolean;
}

// Round 30.4ค batch 6 (owner 2026-09-15): every label/detail comes from the dictionary (they were
// hardcoded English and showed on Thai/Chinese pages); the charging-port detail is the product's
// `attributes.chargingType`, shown through anatomy-copy-th.ts when the locale is Thai. The airflow
// row is listed only when the product's spec sheet actually has an airflow row — the old code added
// it to every non-disposable, including two whose data says nothing about airflow (unverifiable =
// not shown). Markup below is unchanged.
function getAnatomyPoints(product: Product, t: Dictionary["product"]["anatomy"], locale: string): AnatomyPoint[] {
  const hasScreen = product.attributes.screenType === "color-display" || product.attributes.screenType === "touchscreen";
  // Data round (owner 2026-09-24): the airflow row, charging port and screen size come from verified rows only.
  const facts = verifiedAttributes(product);
  const hasAirflowSpec = verifiedRows(product.specifications).some((s) => s.key === "airflow");
  const charging = facts.chargingType ? (locale === "th" ? chargingTypeTh(facts.chargingType) : facts.chargingType) : "—";
  // "0.85\"" in the data → Thai says นิ้ว, so the inch mark is dropped for Thai only.
  const size = (facts.screenSize ?? "").trim();
  const sizeForTemplate = locale === "th" ? size.replace(/"/g, "").trim() : size;
  const displayDetail = (product.attributes.screenType === "touchscreen" ? t.displayTouch : t.displayColour).replace("{size}", sizeForTemplate).replace(/\s+/g, " ").trim();

  if (product.systemType === "disposable") {
    return [
      { x: 50, y: 6, label: t.mouthpiece, detail: t.mouthpieceDisposableDetail },
      { x: 50, y: 45, label: t.labelBand, detail: t.labelBandDetail },
      ...(product.attributes.screenType === "led-indicator" ? [{ x: 50, y: 86, label: t.statusLed, detail: t.statusLedDetail }] : []),
      { x: 50, y: 95, label: t.chargingPort, detail: charging },
    ];
  }

  return [
    { x: 50, y: 3, label: t.mouthpiece, detail: t.mouthpiecePodDetail },
    { x: 50, y: 15, label: t.pod, detail: t.podDetail },
    ...(hasScreen ? [{ x: 50, y: 39, label: t.display, detail: displayDetail, plainDetail: true }] : []),
    ...(hasAirflowSpec ? [{ x: 22, y: 83, label: t.airflow, detail: t.airflowDetail }] : []),
    { x: 50, y: 97, label: t.chargingPort, detail: charging },
  ];
}

export function ProductAnatomy({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  const points = getAnatomyPoints(product, dict.product.anatomy, locale);

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-xs">
          <DeviceGlyph product={product} />
          {points.map((p, i) => (
            <div
              key={i}
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ember bg-surface-0 text-[0.65rem] font-semibold text-ember"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-hidden
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow={dict.product.anatomyEyebrow} title={dict.product.anatomyTitle} />
          <ol className="flex flex-col gap-4">
            {points.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ember text-[0.65rem] font-semibold text-ember">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{locale === "th" ? thaiTypographyNode(p.label) : p.label}</p>
                  <p className="text-sm text-foreground-muted">{locale === "th" && !p.plainDetail ? thaiTypographyNode(p.detail) : p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
