"use client";

import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";

// Structural prop type (not the legacy `Product`) — this only ever reads `sourceUrls`, so it
// works unchanged for both the legacy catalog and the ProductMaster pilot's `StorefrontProductView`
// (production-readiness audit: reused here instead of a duplicate pilot-only component).
export function SourceNote({ product }: { product: { sourceUrls: string[] } }) {
  const { dict } = useLocale();
  return (
    <section className="bg-surface-1 py-8">
      <Container>
        <details className="text-xs text-foreground-dim">
          <summary className="label-mono cursor-pointer text-[0.65rem] text-foreground-dim hover:text-foreground-muted">
            {dict.product.sourceNoteLabel}
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
