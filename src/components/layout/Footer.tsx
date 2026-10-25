"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { NavCategory } from "@/lib/category-visibility";
import { CONTACT } from "@/data/contact";
import type { NavBrand } from "@/lib/brand-visibility";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function Footer({ categories, brands, dnsGuideId, orderingEnabled = true }: { categories: NavCategory[]; brands: NavBrand[]; dnsGuideId: string; orderingEnabled?: boolean }) {
  const { dict } = useLocale();
  // Only link brands that actually have a real product in the catalog right now — a brand added
  // on real evidence but still fully media-blocked (see shipnity-seed/README.md) would otherwise
  // be a dead-end link from primary navigation. See brand-visibility.ts's own doc comment.
  // Same rule as the brand list (round "share-deadend", 2026-09-22): the footer lists the
  // categories that have something in them; an empty one keeps its URL but is not offered.
  // Both lists and the DNS help page id come from the root layout as props (SEO ฉ batch 4, 13/10 —
  // computing the lists here, or importing the id from src/data/guides.ts, shipped the whole catalog
  // and every article body to every page's browser bundle).
  // Round "leftovers" (2026-09-22): the two social icons carried Thai aria-labels written straight
  // into the JSX, so a screen reader on the English or Chinese site announced them in Thai on
  // every page. They read the dictionary now, like every other string in this component.

  const LEARN_LINKS = [
    { label: dict.nav.guides, href: "/guides" },
    { label: dict.nav.technology, href: "/technology" },
    { label: dict.nav.eliquid, href: "/e-liquid" },
  ];

  // Customer-service column (2026-09-06, LAUNCH_AUDIT 3/4/12). FAQ moved here from "Learn" — it
  // is a help page, not reading material (designer direction). /warranty joined the column on
  // 2026-09-06 once the owner approved the claim conditions (BSOT §12).
  const HELP_LINKS = [
    { label: dict.nav.howToOrder, href: "/how-to-order" },
    // Owner 24/10: "ติดตามคำสั่งซื้อ" — find your orders by phone number.
    { label: dict.nav.trackOrder, href: "/orders" },
    // Member sign-in (queue Q4, owner 26/10) — also on the header pill at every width.
    { label: dict.nav.account, href: "/account" },
    { label: dict.nav.shipping, href: "/shipping" },
    { label: dict.nav.warranty, href: "/warranty" },
    { label: dict.nav.faq, href: "/faq" },
    { label: dict.nav.contact, href: "/contact" },
    { label: dict.nav.privacy, href: "/privacy" },
  ];

  const TOOL_LINKS = [
    { label: dict.nav.compare, href: "/compare" },
    { label: dict.nav.finder, href: "/finder" },
    { label: dict.nav.search, href: "/search" },
    { label: dict.nav.favorites, href: "/favorites" },
  ];

  return (
    <footer className="border-t border-surface-border-soft bg-surface-1">
      {/* Phones (mobile round B, B3): one column, so each link group can be its own tappable row
          (see FooterColumn). `sm` and up keep the exact grid they had — same columns, same gap,
          same span on the brand block. */}
      <Container className="grid grid-cols-1 gap-10 py-14 max-sm:gap-0 sm:grid-cols-4 lg:grid-cols-6 lg:py-20">
        <div className="flex flex-col gap-4 max-sm:pb-8 sm:col-span-2 lg:col-span-2">
          <Link href="/" className="flex items-center" aria-label="OKami24">
            <Image src="/brand/okami-logo-red.png" alt="OKami24" width={568} height={480} className="h-10 w-auto" />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">{dict.footer.tagline}</p>
          {/* Owner 22/10: each platform's own logo in its own colours, big enough to see and tap (44 px rows), with the
              handle beside it so the two YouTube channels can be told apart. */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              href={CONTACT.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${dict.nav.contactLine} ${CONTACT.lineId}`}
              className={SOCIAL_PILL}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#06C755]">
                <LineIcon className="h-5 w-5 text-white" />
              </span>
              {CONTACT.lineId}
            </Link>
            {CONTACT.youtubeChannels.map((ch) => (
              <Link
                key={ch.url}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dict.nav.youtubeChannel} ${ch.handle}`}
                className={SOCIAL_PILL}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                  <YoutubeIcon className="h-5 w-5 text-[#FF0000]" />
                </span>
                {ch.handle}
              </Link>
            ))}
          </div>
          {/* Round "site unreachable" (owner 11/10): the DNS help page, next to LINE so it reads as help — here and not in
              the help column, which phones show folded (designer 11/10). */}
          <Link href={`/guides/${dnsGuideId}`} className="inline-flex w-fit items-center gap-1 text-sm text-foreground-muted transition-colors hover:text-ember">
            {dict.footer.siteUnreachable}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <FooterColumn title={dict.footer.shop} defaultOpen>
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

        <FooterColumn title={dict.footer.help}>
          {HELP_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-t border-surface-border-soft">
        {/* pb-24 on mobile: the floating LINE button sits over the last footer lines otherwise (designer review 2026-09-06). */}
        <Container className="flex flex-col gap-4 pt-8 pb-24 text-xs text-foreground-dim sm:flex-row sm:items-center sm:justify-between sm:py-8">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {brands.map((b) => (
              <Link key={b.id} href={`/brands/${b.slug}`} className="hover:text-foreground-muted">
                {b.name}
              </Link>
            ))}
          </div>
          <p className="max-w-2xl leading-relaxed">
            {orderingEnabled ? dict.footer.ageNotice : dict.footer.ageNoticeWhileOrderingOff} {CONTACT.lineId}
          </p>
        </Container>
      </div>
    </footer>
  );
}

/**
 * Phones (mobile round B, B3 — the owner picked this layout from two mock-ups, 2026-09-08): the
 * four link groups used to sit in a two-column grid whose rows were as tall as their tallest
 * group, so "Shop" (eight links) left a long empty gap beside "Learn" (three). Below `sm` each
 * group is now a full-width row you tap to open, with the first one open so what a tap does is
 * obvious. The link text and the link order are exactly what they were.
 *
 * At `sm` and above the plain title and the always-visible list render instead — the button is
 * `display:none` there and the title span is `display:none` on phones, so only one of the two is
 * ever drawn and the tablet/desktop footer is untouched.
 */
function FooterColumn({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `footer-group-${title}`;
  return (
    <div className="flex flex-col gap-3 max-sm:gap-0 max-sm:border-t max-sm:border-surface-border-soft">
      <span className="label-mono text-xs text-foreground-dim max-sm:hidden">{title}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="hidden min-h-12 w-full items-center justify-between gap-3 text-left max-sm:flex"
      >
        <span className="label-mono text-xs text-foreground-dim">{title}</span>
        {open ? <Minus size={18} aria-hidden className="text-foreground-dim" /> : <Plus size={18} aria-hidden className="text-foreground-dim" />}
      </button>
      <div id={panelId} className={cn("flex flex-col gap-2.5 max-sm:pb-5", !open && "max-sm:hidden")}>
        {children}
      </div>
    </div>
  );
}

const SOCIAL_PILL =
  "inline-flex min-h-11 items-center gap-2.5 rounded-full border border-surface-border py-1.5 pl-1.5 pr-4 text-sm font-medium text-foreground transition-colors hover:border-foreground-muted";

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
