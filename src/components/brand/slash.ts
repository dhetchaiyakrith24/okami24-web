/**
 * The red sword slash (logo round batch 2, owner 28/10 "ได้ ตามร่าง"; designer spec 28/10): a tapered crescent stroke,
 * tilted −14°, that draws left to right and fades — never ember (that orange is the checkout button's), no glow except a
 * faint shadow on "paid". Three moments only: an add to cart (across the pressed button, the moment it is pressed — owner
 * 29/10 "รู้สึกหน่วง": it used to wait for the server and the dot flight), the order placed (top edge
 * of the order-number box), the order paid (across the thank-you card). Reduced motion = no slash at all; the static red
 * rule the pages already have stays. Drawn as a fixed overlay over the target, removed when done; never catches a tap.
 */

export interface SlashOptions {
  /** Length in px. */
  length: number;
  /** Thickness of the stroke's middle in px. */
  thickness: number;
  draw: number;
  hold?: number;
  fade: number;
  /** Where on the target: its centre, its top edge or its bottom edge. */
  at?: "center" | "top" | "bottom";
  /** Moves the stroke's centre up (negative) or down from that point, in px. */
  offsetY?: number;
  shadow?: boolean;
  /** A dark edge around the stroke — for a cut across a bright surface (the ember add button), where red alone sinks in. */
  dark?: boolean;
  /** Tilt in degrees (default −14). The product-card cut is steeper (−20, owner 29/10 theme). */
  angle?: number;
}

const NS = "http://www.w3.org/2000/svg";

export function playSlash(target: Element | null, o: SlashOptions): void {
  if (!target || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = target.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = (o.at === "top" ? r.top : o.at === "bottom" ? r.bottom : r.top + r.height / 2) + (o.offsetY ?? 0);
  // The crescent's middle is about 0.4 of the box height (the path below), so the box is 2.5 × the stroke.
  const h = o.thickness * 2.5;
  const tilt = `rotate(${o.angle ?? -14}deg)`;

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 100 10");
  svg.setAttribute("preserveAspectRatio", "none");
  Object.assign(svg.style, {
    position: "fixed",
    left: `${cx - o.length / 2}px`,
    top: `${cy - h / 2}px`,
    width: `${o.length}px`,
    height: `${h}px`,
    zIndex: "36",
    pointerEvents: "none",
    transform: tilt,
    filter: o.dark
      ? "drop-shadow(0 0 1px rgba(0,0,0,0.9)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))"
      : o.shadow
        ? "drop-shadow(0 0 8px rgba(242,48,48,0.25))"
        : "",
  } satisfies Partial<CSSStyleDeclaration>);
  // Owner 29/10 "ฟาด ฟัน เฉือนไปเลย … แว๊บเดียว": a hard cut, not a brush — a crescent that is dark where the blade enters
  // and hot red where it leaves, with a white-hot edge along its top; it draws in one snap and, on the way out, thins
  // and slides on a little in the cut's direction (the blade passing through) while it fades.
  const id = `okami-slash-${Math.random().toString(36).slice(2, 8)}`;
  svg.innerHTML =
    `<defs><linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">` +
    `<stop offset="0" stop-color="#5c0000" stop-opacity="0"/><stop offset="0.18" stop-color="#b30000"/>` +
    `<stop offset="0.65" stop-color="#f23030"/><stop offset="1" stop-color="#ff5c5c"/>` +
    `</linearGradient></defs>` +
    `<path d="M0 7 Q50 -1 100 3 Q50 5 0 7Z" fill="url(#${id})"/>` +
    `<path d="M10 6.1 Q52 0.5 100 3 Q52 2.2 10 6.1Z" fill="#fff1ec" opacity="0.9"/>`;
  document.body.appendChild(svg);

  const hold = o.hold ?? 0;
  const total = o.draw + hold + o.fade;
  const anim = svg.animate(
    [
      { clipPath: "inset(0 100% 0 0)", opacity: 1, transform: tilt, easing: "cubic-bezier(.05,.9,.1,1)" },
      { clipPath: "inset(0 0 0 0)", opacity: 1, transform: tilt, offset: o.draw / total },
      { clipPath: "inset(0 0 0 0)", opacity: 1, transform: tilt, offset: (o.draw + hold) / total, easing: "cubic-bezier(.4,0,1,1)" },
      { clipPath: "inset(0 0 0 0)", opacity: 0, transform: `${tilt} translateX(8%) scaleY(0.35)` },
    ],
    { duration: total, fill: "forwards" },
  );
  anim.onfinish = () => svg.remove();
}

/** Plays once per event: an order's "placed" or "paid" slash does not replay on refresh or back (sessionStorage). */
export function playSlashOnce(key: string, target: Element | null, o: SlashOptions): void {
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    return; // storage blocked: skip the flourish rather than replay it on every visit
  }
  playSlash(target, o);
}
