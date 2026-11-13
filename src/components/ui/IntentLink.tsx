"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A next/link that prefetches on intent only — the pointer or finger reaching it, or keyboard focus — not on merely being
 * on screen (speed round, owner 13/11 "กดเปลี่ยนหัวข้อหน่วงเป็นช่วงๆ").
 *
 * Measured 13/11 on the test build (phone 390, 4× CPU): one tap from home to /products started 43–46 prefetches, about
 * 0.9 MB on the wire and 5 MB decoded — every product card in view, the header menu and the footer each prefetching its
 * whole page — queued behind the one Render box, so the page the visitor asked for waited behind pages they never opened.
 * With this, a card or menu link prefetches the moment a finger touches it (or a mouse hovers it), which still starts the
 * request before the click lands; the page then arrives as one request instead of one among forty.
 *
 * The pattern is node_modules/next/dist/docs/01-app/02-guides/prefetching.md "Hover-triggered prefetch": `prefetch={false}`
 * until intent, then `null` (the default). Every other prop goes to Link unchanged.
 */
export function IntentLink({ onMouseEnter, onTouchStart, onFocus, ...rest }: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      {...rest}
      prefetch={intent ? null : false}
      onMouseEnter={(e) => {
        setIntent(true);
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        setIntent(true);
        onTouchStart?.(e);
      }}
      onFocus={(e) => {
        setIntent(true);
        onFocus?.(e);
      }}
    />
  );
}
