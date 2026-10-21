import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Real navigational trail (Home → Category → Product), rendered above the page header — visible,
 * clickable, internal-linking value on top of the `BreadcrumbList` JSON-LD emitted alongside it
 * (see `breadcrumbJsonLd` in `lib/seo.ts`). The last item is the current page — plain text, not a
 * link, matching standard breadcrumb convention.
 */
export function Breadcrumbs({ trail }: { trail: { name: ReactNode; path: string }[] }) {
  if (trail.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="border-b border-surface-border-soft bg-surface-1">
      <Container className="py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-dim">
          {trail.map((item, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {isLast ? (
                  <span className="text-foreground-muted">{item.name}</span>
                ) : (
                  <Link href={item.path} className="transition-colors hover:text-foreground">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
