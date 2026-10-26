"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, Heart, ShoppingCart, ChevronDown, PackageSearch } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { NavCategory } from "@/lib/category-visibility";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CategoryLabel } from "@/components/catalog/CategoryLabel";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

/** `orderingEnabled` comes from the root layout (src/lib/commerce/ordering-mode.ts — owner
 *  2026-09-07): while online ordering is off, the cart icon and the mobile-menu cart link are not
 *  rendered at all, because /cart would only redirect. Defaults to true so nothing else changes. */
export function Header({ orderingEnabled = true, categories }: { orderingEnabled?: boolean; categories: NavCategory[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  // Touch screens at lg+ (tablets, touch laptops): the first tap on "สินค้า" opens the menu instead of leaving the page —
  // remembered at pointerdown, before the browser's emulated mouseenter opens it (checker note #817).
  const touchOpensMenu = useRef(false);
  const { dict, locale } = useLocale();
  // Member sign-in (owner 26/10: "อยากให้มีคำว่า 'เข้าสู่ระบบ' เห็นชัดบนหัวเว็บทุกหน้า"). Pages are prerendered and the layout
  // never reads cookies, so the header asks after load whether this browser is signed in (same pattern as the cart count)
  // and then reads "บัญชีสมาชิก" instead. Until it answers — or if it fails — the bar shows "เข้าสู่ระบบ".
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("/api/account/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { signedIn?: boolean } | null) => {
        if (alive && d?.signedIn) setSignedIn(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  const accountLabel = signedIn ? dict.nav.account : dict.nav.login;
  // Round "share-deadend" batch 2 (2026-09-22): both menus list the categories that have a
  // product today (src/lib/category-visibility.ts) — "น้ำยา" used to open an empty page. The root layout computes the
  // list and passes it in (SEO ฉ batch 4, 13/10 — computing it here shipped the whole catalog to every browser).
  // Round 30.3ข (THAI_STYLE §2 layer 2): the product menus show "English / ไทย" for a Thai visitor.
  // Only these two menus and the category page H1 — the footer/home grid keep `shortName` (owner).
  const categoryLabel = (c: (typeof categories)[number]) => (locale === "th" ? c.labelTh : c.name);

  const PRIMARY_LINKS = [
    { label: dict.nav.eliquid, href: "/e-liquid" },
    { label: dict.nav.compare, href: "/compare" },
    { label: dict.nav.finder, href: "/finder" },
    { label: dict.nav.guides, href: "/guides" },
    { label: dict.nav.technology, href: "/technology" },
    { label: dict.nav.faq, href: "/faq" },
    { label: dict.nav.about, href: "/about" },
  ];

  // Escape closes the products menu however it was opened (hover gives it no focus — checker #845).
  useEffect(() => {
    if (!productsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProductsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [productsOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-surface-border-soft bg-surface-0/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-6 lg:gap-4 min-[1400px]:gap-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="OKami24">
          <Image
            src="/brand/okami-logo.png"
            alt="OKami24"
            width={1416}
            height={429}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center lg:flex min-[1400px]:gap-1" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setProductsOpen(false);
            }}
          >
            {/* Q2 (owner 24/10 night: "กดทีเดียวเห็นสินค้าทั้งหมด"): a click goes straight to every product; the categories still
                open on hover, and on keyboard focus. */}
            <Link
              href="/products"
              className="flex items-center gap-1 rounded-full px-2 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground min-[1400px]:px-3"
              onFocus={() => setProductsOpen(true)}
              onPointerDown={(e) => {
                touchOpensMenu.current = e.pointerType === "touch" && !productsOpen;
              }}
              onClick={(e) => {
                if (!touchOpensMenu.current) return;
                touchOpensMenu.current = false;
                e.preventDefault();
                setProductsOpen(true);
              }}
              aria-expanded={productsOpen}
              aria-haspopup="true"
            >
              {dict.nav.products} <ChevronDown size={14} aria-hidden />
            </Link>
            {productsOpen && (
              // A pick inside closes the menu (it stayed open over the next page — checker note #817).
              <div
                className="absolute left-0 top-full w-88 rounded-xl border border-surface-border bg-surface-1 p-3 shadow-2xl"
                onClick={() => setProductsOpen(false)}
              >
                <Link
                  href="/products"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-2"
                >
                  {dict.nav.allProducts}
                </Link>
                {/* Owner 24/10 night: "สินค้าพร้อมส่ง" lives in the menus, not as a pill on the bar (too prominent). */}
                <Link
                  href="/products?stock=in"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-2"
                >
                  {dict.nav.inStock}
                </Link>
                <div className="my-2 h-px bg-surface-border-soft" />
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products/${c.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground-muted hover:bg-surface-2 hover:text-foreground"
                  >
                    <CategoryLabel label={categoryLabel(c)} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-2 py-2 text-sm text-foreground-muted transition-colors hover:text-foreground min-[1400px]:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-2">
          <LanguageSwitcher />
          <Link
            href="/search"
            aria-label={dict.nav.search}
            className="rounded-full p-1.5 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:p-2"
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
          {/* Owner 24/10: "ติดตามคำสั่งซื้อ" as a visible header item — icon on phones (the drawer also lists it), icon + words
              from xl where the bar has room. Not in the lg band (1024–1279): the nav already wraps there and one more item
              pushed "เกี่ยวกับเรา" onto two lines (measured 24/10) — the footer link covers it. Shown even with ordering
              off: past orders can still be followed. */}
          <Link
            href="/orders"
            aria-label={dict.nav.trackOrder}
            className="inline-flex items-center gap-1.5 rounded-full p-1.5 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:p-2 lg:hidden xl:inline-flex xl:px-3"
          >
            <PackageSearch size={19} aria-hidden />
            <span className="hidden text-sm xl:inline">{dict.nav.trackOrder}</span>
          </Link>
          {/* Member sign-in (owner 26/10: the word "เข้าสู่ระบบ" visible on the bar on every page, every width). A gold-outlined
              text pill, the members' accent (account-ui.tsx). Signed in, phones read the short word ("บัญชี") — the full
              "บัญชีสมาชิก" is wider than "เข้าสู่ระบบ" and squeezed the logo at 360 (checker #857). */}
          <Link
            href="/account"
            aria-label={accountLabel}
            className="inline-flex items-center whitespace-nowrap rounded-full border border-[rgba(200,178,138,0.45)] px-2 py-1 text-xs text-[#e8dcc4] transition-colors hover:border-[#c8b28a] hover:text-white sm:px-3 sm:py-1.5 sm:text-[13px]"
          >
            {signedIn ? (
              <>
                <span className="sm:hidden">{dict.nav.accountShort}</span>
                <span className="hidden sm:inline">{accountLabel}</span>
              </>
            ) : (
              accountLabel
            )}
          </Link>
          {orderingEnabled && (
            <Link
              href="/cart"
              aria-label={dict.nav.cart}
              className="rounded-full p-1.5 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:p-2"
            >
              <ShoppingCart size={19} aria-hidden />
            </Link>
          )}
          <button
            className="rounded-full p-1.5 text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:p-2 lg:hidden"
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
          <Link href="/products?stock=in" className="rounded-lg px-3 py-3 text-base font-semibold text-foreground hover:bg-surface-2">
            {dict.nav.inStock}
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/products/${c.slug}`} className="rounded-lg px-3 py-3 text-base text-foreground-muted hover:bg-surface-2">
              <CategoryLabel label={categoryLabel(c)} />
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
          {orderingEnabled && (
            <Link href="/cart" className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-surface-2">
              {dict.nav.cart}
            </Link>
          )}
          <Link href="/orders" className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-surface-2">
            {dict.nav.trackOrder}
          </Link>
          <Link href="/account" className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-surface-2">
            {accountLabel}
          </Link>
        </nav>
      </div>
    </>
  );
}
