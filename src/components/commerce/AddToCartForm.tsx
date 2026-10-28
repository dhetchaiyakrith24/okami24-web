"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { addToCartAction } from "@/app/cart/actions";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/** Fired on window after a successful add; the floating cart button (FloatingCart) listens. */
export const CART_ADDED_EVENT = "okami:cart-added";
export interface CartAddedDetail {
  count: number;
  /** Centre of the button that was pressed, in viewport px — where the ember dot starts. */
  from: { x: number; y: number };
}

function SubmitButton({ children }: { children: ReactNode }) {
  // While the server answers: a quiet busy state, no spinner (designer, cart UX batch B). The button is disabled meanwhile —
  // a double tap used to add the item twice (checker #792).
  const { pending } = useFormStatus();
  return (
    <span aria-busy={pending || undefined} className={cn("inline-flex", pending && "cursor-progress opacity-80")}>
      <Button type="submit" disabled={pending}>{children}</Button>
    </span>
  );
}

/**
 * The "เพิ่มลงตะกร้า" form of a product page (cart UX batch B, owner 24/10). Same fields and the same server action as
 * before; the only change is that the result comes back to the page, so a successful add tells the floating cart button
 * to play the add moment (an ember dot flies from this button into it) and show the new count. A refused add (sold out
 * meanwhile, bad option) changes nothing on screen, as before — the server stays the only judge of stock and price.
 * Owner 28/10 "Cap it": when the cart already holds every unit the warehouse has, one quiet line under the button says so
 * (a tap that did nothing read as a broken button).
 */
export function AddToCartForm({
  slug,
  variantId,
  className,
  label,
  children,
}: {
  slug: string;
  variantId: string | null;
  className: string;
  label: string;
  children?: ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  // React QUEUES a second submit made before the re-render disables the button and runs it after the first — so a fast
  // double tap is dropped at the submit event itself, before React sees it (a prevented submit runs no action).
  const busy = useRef(false);
  const { dict } = useLocale();
  // Tied to the option it was refused for: picking another flavour/colour hides it (checker #967).
  const [refused, setRefused] = useState<{ variantId: string | null; limit: number } | null>(null);
  const limit = refused && refused.variantId === variantId ? refused.limit : null;

  async function add(formData: FormData) {
    let result: Awaited<ReturnType<typeof addToCartAction>>;
    try {
      result = await addToCartAction(formData);
    } finally {
      busy.current = false;
    }
    setRefused(!result.ok && result.limit !== undefined ? { variantId, limit: result.limit } : null);
    if (!result.ok) return;
    const rect = formRef.current?.querySelector('button[type="submit"]')?.getBoundingClientRect();
    const from = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    window.dispatchEvent(new CustomEvent<CartAddedDetail>(CART_ADDED_EVENT, { detail: { count: result.count, from } }));
  }

  return (
    <form
      ref={formRef}
      action={add}
      onSubmit={(e) => {
        if (busy.current) e.preventDefault();
        else busy.current = true;
      }}
      className={className}
    >
      <input type="hidden" name="slug" value={slug} />
      {variantId && <input type="hidden" name="variantId" value={variantId} />}
      <input type="hidden" name="quantity" value={1} />
      <SubmitButton>{label}</SubmitButton>
      {limit !== null && (
        // w-0 + min-w-full: as wide as the button and never wider — in the phone's sticky bar a wider line pushed the
        // price and the cart button aside (proof 28/10).
        <p role="status" className="w-0 min-w-full basis-full text-xs text-foreground-muted">
          {dict.cart.addLimitReached.replace("{n}", String(limit))}
        </p>
      )}
      {children}
    </form>
  );
}
