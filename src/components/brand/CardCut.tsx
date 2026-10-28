"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Pages where the card effects never play (designer "เงาจันทร์" 29/10: no theme on cart, checkout or staff; order pages likewise). */
const QUIET = /^\/(cart|checkout|staff|orders)(\/|$)/;
/** When the page moves on: the halves are fully apart at this moment (designer: navigation waits ≤ 150 ms). */
const NAV_DELAY = 150;
const NS = "http://www.w3.org/2000/svg";
const TILT = (20 * Math.PI) / 180;

/** The product photo inside a card: the image itself and the panel it sits in (`data-card-photo`). */
function photoOf(card: Element): { panel: HTMLElement; img: HTMLImageElement } | null {
  const panel = card.querySelector<HTMLElement>("[data-card-photo]");
  const img = panel?.querySelector<HTMLImageElement>("img");
  return panel && img && img.complete && img.naturalWidth > 0 ? { panel, img } : null;
}

/** A copy of the photo laid exactly over the original, inside the same parent (so the hover zoom still applies). */
function overlayCopy(img: HTMLImageElement): HTMLImageElement {
  const copy = img.cloneNode() as HTMLImageElement;
  copy.removeAttribute("id");
  copy.alt = "";
  copy.setAttribute("aria-hidden", "true");
  Object.assign(copy.style, {
    position: "absolute", inset: "auto", margin: "0", maxWidth: "none", maxHeight: "none", pointerEvents: "none",
    left: `${img.offsetLeft}px`, top: `${img.offsetTop}px`, width: `${img.offsetWidth}px`, height: `${img.offsetHeight}px`,
  } satisfies Partial<CSSStyleDeclaration>);
  img.parentElement!.appendChild(copy);
  return copy;
}

/**
 * Click = "ตัดขาด" (owner 29/10 picked option B of the designer's three, demo artifact 132jaUiMjeM8G2oXNgmpDZ): the photo is
 * cut along a −20° line at 62% of the panel height (clear of most screens), the two halves slide a few px apart along
 * the cut while a thin white-hot line with red edges draws across, the card presses in a touch, then the halves close.
 * 360 ms in all; the page moves at NAV_DELAY, when the halves are fully apart. Drawn inside the card, so it leaves
 * with the card when the next page renders (the old slash was a fixed overlay on <body> that could linger).
 */
function playSplit(card: HTMLElement): boolean {
  const photo = photoOf(card);
  if (!photo) return false;
  const { panel, img } = photo;
  const p = panel.getBoundingClientRect(), r = img.getBoundingClientRect();
  const w = p.width, h = p.height, cy = h * 0.62;
  const y0 = cy + (w / 2) * Math.tan(TILT), y1 = cy - (w / 2) * Math.tan(TILT); // the cut line, panel coordinates
  // the same line in the copy's own coordinates (the copy sits where the image is)
  const ox = r.left - p.left, oy = r.top - p.top, iw = r.width;
  const ly = (x: number) => y0 + ((y1 - y0) * x) / w - oy;
  const a = -ox, b = iw + (w - iw - ox);
  const top = overlayCopy(img), bottom = overlayCopy(img);
  top.style.clipPath = `polygon(${a}px -50px, ${b}px -50px, ${b}px ${ly(w)}px, ${a}px ${ly(0)}px)`;
  bottom.style.clipPath = `polygon(${a}px ${ly(0)}px, ${b}px ${ly(w)}px, ${b}px ${r.height + 50}px, ${a}px ${r.height + 50}px)`;
  img.style.visibility = "hidden";

  const len = w / Math.cos(TILT) + 8, th = 6;
  const line = document.createElementNS(NS, "svg");
  line.setAttribute("aria-hidden", "true");
  line.setAttribute("viewBox", "0 0 100 6");
  line.setAttribute("preserveAspectRatio", "none");
  Object.assign(line.style, {
    position: "absolute", left: `${(w - len) / 2}px`, top: `${cy - th / 2}px`, width: `${len}px`, height: `${th}px`,
    transform: "rotate(-20deg)", pointerEvents: "none", zIndex: "5", filter: "drop-shadow(0 0 6px rgba(242,48,48,0.45))",
  } satisfies Partial<CSSStyleDeclaration>);
  line.innerHTML =
    '<defs><linearGradient id="okami-cut" x1="0" x2="1"><stop offset="0" stop-color="#f23030" stop-opacity="0"/>' +
    '<stop offset="0.12" stop-color="#f23030"/><stop offset="0.88" stop-color="#f23030"/><stop offset="1" stop-color="#f23030" stop-opacity="0"/></linearGradient></defs>' +
    '<path d="M0 3 Q50 0.6 100 3 Q50 5.4 0 3Z" fill="url(#okami-cut)"/><path d="M6 3 Q50 2.2 94 3 Q50 3.8 6 3Z" fill="#fff1ec"/>';
  panel.appendChild(line);

  const T = 360, at = (ms: number) => ms / T;
  line.animate(
    [
      // easing per step, never on the whole effect (that warps the timeline: the line was nearly gone while the halves were apart)
      { clipPath: "inset(0 100% 0 0)", opacity: 1, transform: "rotate(-20deg)", easing: "cubic-bezier(.05,.9,.1,1)" },
      { clipPath: "inset(0 0 0 0)", opacity: 1, transform: "rotate(-20deg)", offset: at(70) },
      { clipPath: "inset(0 0 0 0)", opacity: 1, transform: "rotate(-20deg)", offset: at(190), easing: "cubic-bezier(.4,0,1,1)" },
      { clipPath: "inset(0 0 0 0)", opacity: 0, transform: "rotate(-20deg) scaleY(0.3)" },
    ],
    { duration: T, fill: "forwards" },
  );
  const dx = Math.cos(TILT), dy = -Math.sin(TILT);
  const slide = (el: HTMLElement, along: number, perp: number) => {
    const apart = `translate(${dx * along + dy * perp}px, ${dy * along - dx * perp}px)`;
    el.animate(
      [
        { transform: "none" },
        { transform: "none", offset: at(50), easing: "cubic-bezier(.2,.8,.2,1)" },
        { transform: apart, offset: at(130) },
        { transform: apart, offset: at(190), easing: "cubic-bezier(.4,0,.2,1)" },
        { transform: "none" },
      ],
      { duration: T },
    );
  };
  slide(top, 4, 1.5);
  slide(bottom, -2, 0);
  card.animate([{ scale: "1" }, { scale: "0.985", offset: at(60) }, { scale: "1", offset: at(260) }, { scale: "1" }], { duration: T });
  window.setTimeout(() => {
    top.remove();
    bottom.remove();
    line.remove();
    img.style.visibility = "";
  }, T);
  return true;
}

/**
 * Mouse hover = "เงาคม" (owner 29/10: option A, "ให้เกิดขึ้นตอนเอาเม้าไปชี้"): a light band sweeps once across the
 * product itself — masked to the photo's own transparent silhouette, so the card background stays dark — like light on
 * a polished blade. Mouse pointers only (a phone has no hover); once per entry.
 */
function playGlint(card: HTMLElement): void {
  const photo = photoOf(card);
  if (!photo) return;
  const { img } = photo;
  const src = `url("${img.currentSrc || img.src}")`;
  const band = document.createElement("div");
  band.setAttribute("aria-hidden", "true");
  Object.assign(band.style, {
    position: "absolute", pointerEvents: "none", mixBlendMode: "screen",
    left: `${img.offsetLeft}px`, top: `${img.offsetTop}px`, width: `${img.offsetWidth}px`, height: `${img.offsetHeight}px`,
    background: "linear-gradient(110deg, transparent 38%, rgba(255,241,236,0.6) 48%, rgba(242,48,48,0.35) 54%, transparent 62%)",
    backgroundSize: "300% 100%",
    webkitMaskImage: src, maskImage: src, webkitMaskSize: "contain", maskSize: "contain",
    webkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", webkitMaskPosition: "center", maskPosition: "center",
  } satisfies Partial<CSSStyleDeclaration>);
  img.parentElement!.appendChild(band);
  band
    .animate([{ backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0" }], { duration: 560, easing: "cubic-bezier(.3,0,.2,1)", fill: "forwards" })
    .onfinish = () => band.remove();
}

/**
 * The product-card effects (samurai theme): click = the cut, mouse hover = the glint. One capture listener for clicks
 * runs before the card's Next Link and cancels the click, which makes Link skip its own navigation (`e.defaultPrevented`,
 * next/dist/client/app-dir/link.js), so the page moves once, NAV_DELAY later. Modified clicks (new tab), the heart
 * button inside the card, reduced motion, a photo not loaded yet and the quiet pages keep the card's normal behaviour.
 * Renders nothing.
 */
export function CardCut() {
  const router = useRouter();
  useEffect(() => {
    const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || QUIET.test(window.location.pathname);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const card = target?.closest<HTMLAnchorElement>("a[data-card-cut]");
      if (!card || target?.closest("button") || still()) return;
      const href = card.getAttribute("href");
      if (!href || !playSplit(card)) return;
      e.preventDefault();
      window.setTimeout(() => router.push(href), NAV_DELAY);
    };
    const glinting = new WeakSet<Element>();
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || still()) return;
      const card = (e.target as Element | null)?.closest<HTMLElement>("a[data-card-cut]");
      if (!card || glinting.has(card) || card.contains(e.relatedTarget as Node | null)) return;
      glinting.add(card);
      playGlint(card);
      window.setTimeout(() => glinting.delete(card), 600);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onOver);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onOver);
    };
  }, [router]);
  return null;
}
