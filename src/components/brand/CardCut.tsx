"use client";

import { useEffect } from "react";

/** Pages where the card effects never play (designer "เงาจันทร์" 29/10: no theme on cart, checkout or staff; order pages likewise). */
const QUIET = /^\/(cart|checkout|staff|orders)(\/|$)/;
const NS = "http://www.w3.org/2000/svg";

/** The product photo inside a card: the image itself and the panel it sits in (`data-card-photo`). */
function photoOf(card: Element): { panel: HTMLElement; img: HTMLImageElement } | null {
  const panel = card.querySelector<HTMLElement>("[data-card-photo]");
  const img = panel?.querySelector<HTMLImageElement>("img");
  return panel && img && img.complete && img.naturalWidth > 0 ? { panel, img } : null;
}

/**
 * Click = a light tap (owner 09/11: the old "ตัดขาด" split made the page wait before it moved — "กดปุ๊ปก็ยังไปปั๊ป",
 * keep a thin, light effect that only says something happened). The page moves at once through the card's own Link;
 * this never cancels the click. A hairline cut (−20°, the brand's angle) draws across the photo in 160 ms and the card
 * presses in a touch. Drawn inside the card, so it leaves with the card when the next page renders.
 */
function playTap(card: HTMLElement): void {
  card.animate([{ scale: "1" }, { scale: "0.985", offset: 0.35 }, { scale: "1" }], { duration: 180, easing: "ease-out" });
  const photo = photoOf(card);
  if (!photo) return;
  const { width: w, height: h } = photo.panel.getBoundingClientRect();
  const len = w / Math.cos((20 * Math.PI) / 180);
  const line = document.createElementNS(NS, "svg");
  line.setAttribute("aria-hidden", "true");
  line.setAttribute("viewBox", "0 0 100 2");
  line.setAttribute("preserveAspectRatio", "none");
  Object.assign(line.style, {
    position: "absolute", left: `${(w - len) / 2}px`, top: `${h * 0.62 - 1}px`, width: `${len}px`, height: "2px",
    transform: "rotate(-20deg)", pointerEvents: "none", zIndex: "5",
  } satisfies Partial<CSSStyleDeclaration>);
  line.innerHTML =
    '<defs><linearGradient id="okami-tap" x1="0" x2="1"><stop offset="0" stop-color="#f23030" stop-opacity="0"/>' +
    '<stop offset="0.5" stop-color="#f23030" stop-opacity="0.7"/><stop offset="1" stop-color="#f23030" stop-opacity="0"/></linearGradient></defs>' +
    '<rect width="100" height="2" fill="url(#okami-tap)"/>';
  photo.panel.appendChild(line);
  line.animate(
    [
      { clipPath: "inset(0 100% 0 0)", opacity: 1 },
      { clipPath: "inset(0 0 0 0)", opacity: 1, offset: 0.6 },
      { clipPath: "inset(0 0 0 0)", opacity: 0 },
    ],
    { duration: 160, easing: "ease-out", fill: "forwards" },
  ).onfinish = () => line.remove();
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
 * The product-card effects (samurai theme): click = a light tap that never delays the page, mouse hover = the glint.
 * Modified clicks (new tab), the heart button inside the card, reduced motion and the quiet pages get no effect.
 * Renders nothing.
 */
export function CardCut() {
  useEffect(() => {
    const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || QUIET.test(window.location.pathname);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const card = target?.closest<HTMLAnchorElement>("a[data-card-cut]");
      if (!card || target?.closest("button") || still()) return;
      playTap(card); // never preventDefault: the card's Link navigates now
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
  }, []);
  return null;
}
