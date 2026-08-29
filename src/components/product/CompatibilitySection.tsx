import type { Product } from "@/types/catalog";
import { Plug, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function CompatibilitySection({ product }: { product: Product }) {
  if (product.compatibility.length === 0 && product.whoIsThisFor.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {product.compatibility.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Plug size={18} className="text-steel" aria-hidden />
              <h2 className="font-display text-xl font-semibold text-foreground">Compatibility</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {product.compatibility.map((c, i) => (
                <li key={i} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                  <p className="text-sm font-semibold text-foreground">{c.label}</p>
                  {c.note && <p className="mt-1 text-xs text-foreground-muted">{c.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.whoIsThisFor.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-ember" aria-hidden />
              <h2 className="font-display text-xl font-semibold text-foreground">Who is this for?</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {product.whoIsThisFor.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
