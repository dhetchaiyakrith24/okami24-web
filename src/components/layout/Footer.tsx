"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { CONTACT } from "@/data/contact";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function Footer() {
  const { dict } = useLocale();

  const LEARN_LINKS = [
    { label: dict.nav.guides, href: "/guides" },
    { label: dict.nav.technology, href: "/technology" },
    { label: dict.nav.eliquid, href: "/e-liquid" },
    { label: dict.nav.faq, href: "/faq" },
  ];

  const TOOL_LINKS = [
    { label: dict.nav.compare, href: "/compare" },
    { label: dict.nav.finder, href: "/finder" },
    { label: dict.nav.search, href: "/search" },
    { label: dict.nav.favorites, href: "/favorites" },
  ];

  return (
    <footer className="border-t border-surface-border-soft bg-surface-1">
      <Container className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4 lg:grid-cols-5 lg:py-20">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
          <Link href="/" className="flex items-center" aria-label="OKami24">
            <Image src="/brand/okami-logo-red.png" alt="OKami24" width={568} height={480} className="h-10 w-auto" />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">{dict.footer.tagline}</p>
          <div className="flex items-center gap-3 pt-1">
            <Link
              href={CONTACT.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ติดต่อ OKami24 ทาง LINE"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-foreground-muted transition-colors hover:border-red hover:text-red"
            >
              <LineIcon className="h-4 w-4" />
            </Link>
            <Link
              href={CONTACT.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ช่อง YouTube ของ OKami24"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-foreground-muted transition-colors hover:border-red hover:text-red"
            >
              <YoutubeIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <FooterColumn title={dict.footer.shop}>
          {categories.map((c) => (
            <FooterLink key={c.id} href={`/products/${c.slug}`}>
              {c.shortName}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={dict.footer.learn}>
          {LEARN_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={dict.footer.tools}>
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
            {dict.footer.ageNotice} {CONTACT.lineId}
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

function LineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.477 2 2 5.626 2 10.1c0 4.008 3.567 7.36 8.386 7.99.327.07.771.216.883.497.101.254.066.652.033.909l-.144.865c-.043.254-.203.996.872.543 1.076-.454 5.805-3.42 7.92-5.856C21.402 13.325 22 11.79 22 10.1 22 5.626 17.523 2 12 2zM8.5 12.75H6.9a.35.35 0 0 1-.35-.35V8.1a.35.35 0 0 1 .7 0v3.95h1.25a.35.35 0 0 1 0 .7zm1.75-.35a.35.35 0 0 1-.7 0V8.1a.35.35 0 0 1 .7 0v4.3zm4.4 0a.35.35 0 0 1-.629.213l-2.166-2.947v2.734a.35.35 0 0 1-.7 0V8.1a.35.35 0 0 1 .629-.213l2.166 2.947V8.1a.35.35 0 0 1 .7 0v4.3zm3.15-2.5a.35.35 0 0 1 0 .7h-1.25v1.05h1.25a.35.35 0 0 1 0 .7h-1.6a.35.35 0 0 1-.35-.35V8.1a.35.35 0 0 1 .35-.35h1.6a.35.35 0 0 1 0 .7h-1.25v1.05z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.582 7.186a2.51 2.51 0 0 0-1.768-1.777C18.254 5 12 5 12 5s-6.254 0-7.814.409a2.51 2.51 0 0 0-1.768 1.777C2 8.756 2 12 2 12s0 3.244.418 4.814a2.51 2.51 0 0 0 1.768 1.777C5.746 19 12 19 12 19s6.254 0 7.814-.409a2.51 2.51 0 0 0 1.768-1.777C22 15.244 22 12 22 12s0-3.244-.418-4.814ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}
