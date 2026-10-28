import Image from "next/image";

/**
 * Samurai theme on /products (designer "เงาจันทร์", owner 29/10 "go, with changes"): the owner's samurai character
 * behind the top of the page — NOT boxed in the header: it starts at the page top and fades TOP → BOTTOM, slowly, until
 * it is gone 1–2 card rows down (owner on the live page: deeper and longer than the first build, which ended at the
 * cards), at 0.15 opacity (owner 29/10: 0.25 "ชัดไป" → 10–15%; then "ถ้าไม่ smooth ขยับ 12 เป็น 15"). On a wide screen it sits on
 * the right and also fades toward the title; on a phone it spans the width behind the header. The petals are the ones
 * already in the owner's picture. Decorative only: no alt text, never catches a tap.
 * Parent = a `relative isolate` wrapper (this layer is z −1 inside it); the layer is as tall as the picture.
 * The picture is the owner's file (_incoming/logo-2710/ref/samurai-character-owner-2810.webp), top 1600 px (down to
 * where its red mist turns black), re-encoded only.
 */
export function SamuraiBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
      <div className="samurai-backdrop-figure">
        <Image
          src="/brand/samurai-products-bg-v2.webp"
          alt=""
          width={1131}
          height={1600}
          sizes="(min-width: 1024px) 74vw, 180vw"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
