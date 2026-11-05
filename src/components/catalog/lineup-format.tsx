import type { ChooserCopy } from "@/i18n/category-guide-copy";
import type { ChooserGroup } from "@/lib/disposable-lineup";

/** Small shared formats of the disposables chooser and tables: no data import, safe in client components (LESSONS 37). */
export const thousands = (n: number) => n.toLocaleString("en-US");
export const baht = (n: number) => `฿${thousands(n)}`;

/** The label of a chooser group. Puff groups carry a number, budget groups a price: the group's key says which. */
export function groupLabel(g: ChooserGroup, c: ChooserCopy): string {
  const isPrice = g.key.startsWith("price");
  const f = isPrice ? baht : thousands;
  const a = f(g.a);
  const b = f(g.b);
  if (g.kind === "exact") return c.puffsExact.replace("{n}", a);
  if (g.kind === "upFrom") return (isPrice ? c.priceUpFrom : c.puffsUpFrom).replace(/\{[pn]\}/, a);
  if (g.kind === "upTo") return (isPrice ? c.priceUpTo : c.puffsUpTo).replace(/\{[pn]\}/, a);
  return (isPrice ? c.priceRange : c.puffsRange).replace("{a}", a).replace("{b}", b);
}

/** A model name may break only after its first word: "WOTOFO / nexBAR 18K", never inside the model. No NBSP or joiner
 *  (the typography lock, THAI_STYLE §5): a nowrap span keeps the rest together. */
export function BrandSplitName({ name }: { name: string }) {
  const at = name.indexOf(" ");
  if (at < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, at)} <span className="whitespace-nowrap">{name.slice(at + 1)}</span>
    </>
  );
}
