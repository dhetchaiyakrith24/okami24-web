import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";

const LEARN_LINKS = [
  { label: "Guides", href: "/guides" },
  { label: "Technology", href: "/technology" },
  { label: "E-Liquid", href: "/e-liquid" },
  { label: "FAQ", href: "/faq" },
];

const TOOL_LINKS = [
  { label: "Compare", href: "/compare" },
  { label: "Product Finder", href: "/finder" },
  { label: "Search", href: "/search" },
  { label: "Favorites", href: "/favorites" },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-border-soft bg-surface-1">
      <Container className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4 lg:grid-cols-5 lg:py-20">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
            NOVA<span className="text-ember"> VAPOR</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
            A product-discovery platform for pod systems, disposables, e-liquid, and vape technology — built as a
            design and engineering demonstration, not an active storefront.
          </p>
        </div>

        <FooterColumn title="Shop">
          {categories.map((c) => (
            <FooterLink key={c.id} href={`/products/${c.slug}`}>
              {c.shortName}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Learn">
          {LEARN_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Tools">
          {TOOL_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-t border-surface-border-soft">
        <Container className="flex flex-col gap-4 py-8 text-xs text-foreground-dim sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {brands.map((b) => (
              <Link key={b.id} href={`/brands/${b.slug}`} className="hover:text-foreground-muted">
                {b.name}
              </Link>
            ))}
          </div>
          <p className="max-w-2xl leading-relaxed">
            21+ only. Nicotine is an addictive chemical. This is a demonstration project — no products are sold or
            shipped from this site, and no health or cessation claims are made.
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-mono text-xs text-foreground-dim">{title}</span>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-foreground-muted transition-colors hover:text-foreground">
      {children}
    </Link>
  );
}
