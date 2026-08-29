import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";

export function SourceNote({ product }: { product: Product }) {
  return (
    <section className="bg-surface-1 py-8">
      <Container>
        <details className="text-xs text-foreground-dim">
          <summary className="label-mono cursor-pointer text-[0.65rem] text-foreground-dim hover:text-foreground-muted">
            Reference sources
          </summary>
          <ul className="mt-3 flex flex-col gap-1.5">
            {product.sourceUrls.map((url) => (
              <li key={url} className="break-all">
                <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-foreground-muted hover:underline">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </Container>
    </section>
  );
}
