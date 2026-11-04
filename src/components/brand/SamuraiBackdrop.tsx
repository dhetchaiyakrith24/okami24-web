import Image from "next/image";
import "./samurai-backdrop.css";

/**
 * Samurai theme on /products (designer "เงาจันทร์", owner 29/10; owner 04/11 "สีเดียวกันกับการ์ดโอน"): the owner's samurai
 * character behind the top of the page — NOT boxed in the header: it starts at the page top and fades TOP → BOTTOM, gone
 * before the first card row. Since 04/11 it wears the transfer PAYMENT CARD's treatment (OrderStatusView): greyed and
 * darkened onto a warm charcoal with the card's fine vertical lines, so the red moon and mist turn black and only a faint
 * silver figure is left (owner: the full-colour one "เด่นและดูเป็นเว็บ Game … ไม่โต"). On a wide screen it sits on the right
 * and also fades toward the title; on a phone it spans the width behind the header. Decorative only: no alt text, never
 * catches a tap. Parent = a `relative isolate` wrapper (this layer is z −1 inside it); the layer is as tall as the picture.
 * The picture is the owner's file (_incoming/logo-2710/ref/samurai-character-owner-2810.webp), top 1600 px, re-encoded only.
 * Its CSS lives next to it (samurai-backdrop.css), not in globals — one page only (LESSONS 40).
 */
export function SamuraiBackdrop() {
  return (
    <div aria-hidden="true" className="samurai-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
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
