"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, Search, Heart, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { dict } = useLocale();

  const PRIMARY_LINKS = [
    { label: dict.nav.eliquid, href: "/e-liquid" },
    { label: dict.nav.compare, href: "/compare" },
    { label: dict.nav.finder, href: "/finder" },
    { label: dict.nav.guides, href: "/guides" },
    { label: dict.nav.technology, href: "/technology" },
    { label: dict.nav.faq, href: "/faq" },
    { label: dict.nav.about, href: "/about" },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-surface-border-soft bg-surface-0/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link href="/" className="flex items-center" aria-label="OKami24">
          <Image
            src="/brand/okami-logo-red.png"
            alt="OKami24"
            width={568}
            height={480}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
              onClick={() => setProductsOpen((v) => !v)}
              aria-expanded={productsOpen}
              aria-haspopup="true"
            >
              {dict.nav.products} <ChevronDown size={14} aria-hidden />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full w-72 rounded-xl border border-surface-border bg-surface-1 p-3 shadow-2xl">
                <Link
                  href="/products"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-2"
                >
                  {dict.nav.allProducts}
                </Link>
                <div className="my-2 h-px bg-surface-border-soft" />
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products/${c.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground-muted hover:bg-surface-2 hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <Link
            href="/search"
            aria-label={dict.nav.search}
            className="rounded-full p-2 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Search size={19} aria-hidden />
          </Link>
          <Link
            href="/favorites"
            aria-label={dict.nav.favorites}
            className="hidden rounded-full p-2 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:inline-flex"
          >
            <Heart size={19} aria-hidden />
          </Link>
          <button
            className="rounded-full p-2 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </Container>
    </header>

      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-surface-0 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav
          className="flex flex-col gap-1 p-6"
          aria-label="Mobile"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
          }}
        >
          <span className="label-mono px-3 py-2 text-xs text-foreground-dim">{dict.nav.products}</span>
          <Link href="/products" className="rounded-lg px-3 py-3 text-base font-semibold text-foreground hover:bg-surface-2">
            {dict.nav.allProducts}
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/products/${c.slug}`} className="rounded-lg px-3 py-3 text-base text-foreground-muted hover:bg-surface-2">
              {c.name}
            </Link>
          ))}
          <div className="my-3 h-px bg-surface-border-soft" />
          {PRIMARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-surface-2">
              {link.label}
            </Link>
          ))}
          <Link href="/favorites" className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-surface-2">
            {dict.nav.favorites}
          </Link>
        </nav>
      </div>
    </>
  );
}
