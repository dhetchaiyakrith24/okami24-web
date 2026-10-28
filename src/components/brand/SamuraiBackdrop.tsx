import Image from "next/image";

/**
 * Samurai theme on /products (designer "เงาจันทร์", owner 29/10 "go, with changes"): the owner's samurai character
 * behind the top of the page — NOT boxed in the header: it starts at the page top and fades TOP → BOTTOM until it is
 * gone where the product cards begin, at half the strength of the 29/10 draft (draft 0.5 at 1440 → 0.25). On a wide
 * screen it sits on the right and also fades toward the title; on a phone it spans the width behind the header.
 * The petals are the ones already in the owner's picture. Decorative only: no alt text, never catches a tap.
 * Parent = a `relative isolate` wrapper (this layer is z −1 inside it). The picture is the owner's file
 * (_incoming/logo-2710/ref/samurai-character-owner-2810.webp), top 1300 px, re-encoded only.
 */
export function SamuraiBackdrop() {
  return (
    <div aria-hidden="true" className="samurai-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
      <div className="samurai-backdrop-figure absolute inset-y-0 right-0">
        <Image
          src="/brand/samurai-products-bg.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
