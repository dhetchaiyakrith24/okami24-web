"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart, X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { PhoneOptionTiles } from "@/components/product/PhoneOptionTiles";
import { addToCartAction } from "@/app/cart/actions";
import { pilotName } from "@/i18n/product-names-en";
import type { CartSuggestion } from "@/lib/commerce/cart-suggestions";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

/** Same form fields the product page posts — the server (addToCartAction → resolveProductRef) stays the only judge. */
async function addOne(slug: string, variantId: string | null): Promise<boolean> {
  const form = new FormData();
  form.set("slug", slug);
  if (variantId) form.set("variantId", variantId);
  form.set("quantity", "1");
  return (await addToCartAction(form)).ok;
}

/**
 * The cart's suggestion row (owner queue Q8, designer spec 26/10; no brand line — every catalog name already leads with it)
 * — the cards come picked from the server (`cartSuggestions`), so this file holds no catalog. Calm on purpose
 * ("ยืนบนความเรียบหรู"): the card is one link to the product page, hover only lifts the border colour; no lift, zoom or glow
 * (the green glow belongs to "shipped"). Phones 2 × 2 under the checkout button; ≥640 one row of four.
 *
 * Quick add (owner 26/10: "กดตะกร้าปุ๊บก็จะมีสีให้ขึ้นเลือกเลย", designer spec): a quiet round cart button beside the price —
 * never ember, the page's one orange button is the checkout. One sellable option (or none) = one tap adds it; more = a
 * picker (bottom sheet on phones, a centred dialog ≥ lg) with the product page's photo tiles, sold-out options shown but
 * not tappable. After an add the page stays where it is and a status line under the heading says what was added.
 */
export function CartSuggestions({ items, className = "" }: { items: CartSuggestion[]; className?: string }) {
  const { dict, locale } = useLocale();
  const router = useRouter();
  const [picking, setPicking] = useState<CartSuggestion | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  if (items.length === 0) return null;

  const nameOf = (item: CartSuggestion) => pilotName(item.slug, item.name, locale);

  function added(item: CartSuggestion, optionName: string | null) {
    setStatus(dict.cart.suggestionAdded.replace("{name}", optionName ? `${nameOf(item)} · ${optionName}` : nameOf(item)));
    setJustAdded(item.slug);
    setTimeout(() => setJustAdded((s) => (s === item.slug ? null : s)), 1500);
  }

  function quickAdd(item: CartSuggestion) {
    if (pendingSlug) return;
    const sellable = item.options.filter((o) => o.sellable);
    if (item.options.length > 0 && sellable.length !== 1) {
      setPicking(item);
      return;
    }
    const only = sellable[0] ?? null;
    setPendingSlug(item.slug);
    startTransition(async () => {
      const ok = await addOne(item.slug, only?.id ?? null);
      setPendingSlug(null);
      if (ok) added(item, only?.name ?? null);
      else router.refresh();
    });
  }

  return (
    <section aria-labelledby="cart-suggestions" className={className}>
      <h2 id="cart-suggestions" className="font-display text-xl font-semibold text-foreground">
        {dict.cart.suggestionsTitle}
      </h2>
      <p aria-live="polite" className="mb-3 mt-1 min-h-5 text-sm text-foreground-muted">
        {status}
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {items.map((item) => (
          <li key={item.slug} className="relative">
            <Link
              href={item.href}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 transition-colors hover:border-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
            >
              <div className="relative aspect-square bg-surface-2/40">
                {item.image && (
                  <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 25vw, 50vw" className="object-contain p-3" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="line-clamp-2 min-h-[2.5em] text-sm font-semibold leading-[1.25] text-foreground">{nameOf(item)}</span>
                {/* right padding keeps the price clear of the cart button laid over this corner */}
                <span className="mt-auto pr-12 pt-1 font-display text-[15px] font-bold leading-[2.75rem] text-foreground">{formatTHB(item.price)}</span>
              </div>
            </Link>
            {/* A sibling of the link (a button may not sit inside an <a>), laid over the card's bottom-right corner. */}
            <button
              type="button"
              onClick={() => quickAdd(item)}
              disabled={pendingSlug === item.slug}
              aria-busy={pendingSlug === item.slug || undefined}
              aria-label={dict.cart.suggestionAddLabel.replace("{name}", nameOf(item))}
              className="absolute bottom-3 right-3 flex size-11 items-center justify-center rounded-full border border-surface-border bg-surface-2 text-foreground transition-colors hover:border-foreground-dim focus-visible:outline-2 focus-visible:outline-ember disabled:cursor-progress disabled:opacity-80"
            >
              {justAdded === item.slug ? <Check size={18} aria-hidden /> : <ShoppingCart size={18} aria-hidden />}
            </button>
          </li>
        ))}
      </ul>
      {picking && (
        <OptionPicker
          key={picking.slug}
          item={picking}
          name={nameOf(picking)}
          onClose={() => setPicking(null)}
          onAdded={(optionName) => {
            const item = picking;
            setPicking(null);
            added(item, optionName);
          }}
        />
      )}
    </section>
  );
}

/** The picker: one body, two shells — the shared BottomSheet below lg, a native modal <dialog> from lg up (BottomSheet
 *  closes itself at that width). The native dialog brings Escape, the inert page behind and focus return for free. */
function OptionPicker({ item, name, onClose, onAdded }: { item: CartSuggestion; name: string; onClose: () => void; onAdded: (optionName: string) => void }) {
  const { dict } = useLocale();
  const router = useRouter();
  const [desktop] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 64rem)").matches);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (desktop) dialogRef.current?.showModal();
  }, [desktop]);

  const selected = item.options.find((o) => o.id === selectedId) ?? null;
  const photo = selected?.image ?? item.image;
  const axisLabel = item.axis === "color" ? dict.product.colorLabel : item.axis === "flavor" ? dict.product.flavorLabel : null;

  function confirm() {
    if (!selected || pending) return;
    startTransition(async () => {
      const ok = await addOne(item.slug, selected.id);
      if (ok) onAdded(selected.name);
      else {
        // Sold out meanwhile: nothing changed in the cart; refresh so that option turns sold out here too.
        setFailed(true);
        setSelectedId(null);
        router.refresh();
      }
    });
  }

  const body = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-surface-border-soft bg-surface-2">
          {photo && <Image src={photo.src} alt="" fill sizes="72px" className="object-contain p-1.5" />}
        </div>
        <span className="font-display text-lg font-bold text-foreground">{formatTHB(item.price)}</span>
      </div>
      <PhoneOptionTiles
        options={item.options.map((o) => ({ id: o.id, name: o.name, image: o.image, swatchHex: o.swatchHex, out: !o.sellable }))}
        selectedId={selectedId}
        onSelect={(id) => {
          setFailed(false);
          setSelectedId(id);
        }}
        label={axisLabel}
        outDisabled
      />
      {failed && (
        <p role="alert" className="text-sm text-danger">
          {dict.cart.suggestionAddFailed}
        </p>
      )}
    </div>
  );

  const footer = (
    <div className="flex flex-col items-center gap-2">
      <span aria-busy={pending || undefined} className="w-full">
        <Button onClick={confirm} disabled={!selected || pending} className="w-full justify-center">
          {selected ? `${dict.productActions.addToCartCta} · ${formatTHB(item.price)}` : dict.product.optionPickPrompt}
        </Button>
      </span>
      <Link href={item.href} className="text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline">
        {dict.cart.suggestionViewProduct}
      </Link>
    </div>
  );

  if (!desktop) {
    return (
      <BottomSheet open onClose={onClose} title={name} closeLabel={dict.nav.closeMenu} footer={footer}>
        {body}
      </BottomSheet>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-label={name}
      className="m-auto w-full max-w-md rounded-2xl border border-surface-border bg-surface-1 p-0 text-foreground backdrop:bg-surface-0/80"
    >
      <div className="flex items-center justify-between gap-3 border-b border-surface-border-soft px-5 py-4">
        <h3 className="font-display text-lg font-semibold">{name}</h3>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label={dict.nav.closeMenu}
          className="flex size-10 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ember"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto px-5 py-4">{body}</div>
      <div className="border-t border-surface-border-soft px-5 py-4">{footer}</div>
    </dialog>
  );
}
