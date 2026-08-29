import type { Product } from "@/types/catalog";
import { DeviceGlyph } from "@/components/visual/DeviceGlyph";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface AnatomyPoint {
  x: number; // percent
  y: number; // percent
  label: string;
  detail: string;
}

function getAnatomyPoints(product: Product): AnatomyPoint[] {
  const hasScreen = product.attributes.screenType === "color-display" || product.attributes.screenType === "touchscreen";

  if (product.systemType === "disposable") {
    return [
      { x: 50, y: 6, label: "Mouthpiece", detail: "Fixed draw opening — no removable drip tip on this format." },
      { x: 50, y: 45, label: "Label band", detail: "Flavor and nicotine-strength labeling." },
      ...(product.attributes.screenType === "led-indicator"
        ? [{ x: 50, y: 86, label: "Status LED", detail: "Battery level and active-mode indicator." }]
        : []),
      { x: 50, y: 95, label: "Charging port", detail: product.attributes.chargingType },
    ];
  }

  return [
    { x: 50, y: 3, label: "Mouthpiece", detail: "Draw opening seated above the pod insert." },
    { x: 50, y: 15, label: "Pod / cartridge", detail: "Removable coil pod — capacity and resistance vary by pod." },
    ...(hasScreen ? [{ x: 50, y: 39, label: "Display", detail: `${product.attributes.screenSize ?? ""} ${product.attributes.screenType === "touchscreen" ? "touchscreen" : "colour display"}`.trim() }] : []),
    { x: 22, y: 83, label: "Airflow control", detail: "Adjusts draw resistance." },
    { x: 50, y: 97, label: "Charging port", detail: product.attributes.chargingType },
  ];
}

export function ProductAnatomy({ product }: { product: Product }) {
  const points = getAnatomyPoints(product);

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
          <SectionHeading eyebrow="Anatomy" title="Built from the outside in." />
          <ol className="flex flex-col gap-4">
            {points.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ember text-[0.65rem] font-semibold text-ember">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.label}</p>
                  <p className="text-sm text-foreground-muted">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
