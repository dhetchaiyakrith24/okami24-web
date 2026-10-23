"use client";

import { useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { addToCartAction } from "@/app/cart/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Fired on window after a successful add; the floating cart button (FloatingCart) listens. */
export const CART_ADDED_EVENT = "okami:cart-added";
export interface CartAddedDetail {
  count: number;
  /** Centre of the button that was pressed, in viewport px — where the ember dot starts. */
  from: { x: number; y: number };
}

function SubmitButton({ children }: { children: ReactNode }) {
  // While the server answers: a quiet busy state, no spinner (designer, cart UX batch B).
  const { pending } = useFormStatus();
  return (
    <span aria-busy={pending || undefined} className={cn("inline-flex", pending && "cursor-progress opacity-80")}>
      <Button type="submit">{children}</Button>
    </span>
  );
}

/**
 * The "เพิ่มลงตะกร้า" form of a product page (cart UX batch B, owner 24/10). Same fields and the same server action as
 * before; the only change is that the result comes back to the page, so a successful add tells the floating cart button
 * to play the add moment (an ember dot flies from this button into it) and show the new count. A refused add (sold out
 * meanwhile, bad option) changes nothing on screen, as before — the server stays the only judge of stock and price.
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

  async function add(formData: FormData) {
    const result = await addToCartAction(formData);
    if (!result.ok) return;
    const rect = formRef.current?.querySelector('button[type="submit"]')?.getBoundingClientRect();
    const from = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    window.dispatchEvent(new CustomEvent<CartAddedDetail>(CART_ADDED_EVENT, { detail: { count: result.count, from } }));
  }

  return (
    <form ref={formRef} action={add} className={className}>
      <input type="hidden" name="slug" value={slug} />
      {variantId && <input type="hidden" name="variantId" value={variantId} />}
      <input type="hidden" name="quantity" value={1} />
      <SubmitButton>{label}</SubmitButton>
      {children}
    </form>
  );
}
