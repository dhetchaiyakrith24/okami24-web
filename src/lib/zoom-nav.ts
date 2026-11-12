/**
 * The "Zoom" (owner list ก10 · his reference reel 30/10 · his ruling 13/11): tapping a product card zooms INTO that card's
 * photo from where it sits, and that zoom is the page change. The first version navigated first and animated on the new
 * page; the owner rejected it ("กดสินค้าและสลับไปหน้าสินค้า และจากนั้น Pod ค่อยเคลื่อนที่มา … มันไม่ได้ให้อารมณ์ Zoom").
 *
 * Why not the browser's View Transitions API: its animation can only start once the new page is ready, so the tap
 * would wait on the network first — exactly what the owner turned down. This runs on the tap instead, in every browser
 * (plain Web Animations + one animation-frame loop), in two moves:
 *   1. "push in" (on the tap, nothing waits): the card's photo lifts off as a fixed copy and grows toward where the
 *      product page shows it, while the wall of cards behind scales up around that card (the camera moving in) and sinks
 *      into the page colour. The wall is a still copy laid over the page, so the real page changes route underneath at
 *      the same moment — the network wait hides inside the motion instead of coming before it.
 *   2. "land": once the wall is dark and the product page is there, the photo glides onto the hero's real photo — it
 *      follows that photo every frame, so a late scroll or layout change on the new page cannot leave it off target —
 *      while the dark lifts off the page. The hero's own photo then takes over under it (a short cross-fade covers a
 *      different photo or one still loading).
 * Loaded only on a device previewing the Zoom (ZoomNav.tsx imports this file on demand), so no customer downloads it.
 */

type Router = { push: (href: string, opts?: { scroll?: boolean }) => void; prefetch: (href: string) => void };
type Box = { x: number; y: number; w: number; h: number };

/** Pages where cards never zoom (the same quiet pages as the card tap effect, CardCut.tsx). */
const QUIET = /^\/(cart|checkout|staff|orders)(\/|$)/;
const PUSH_MS = 380;
const LAND_MS = 560;
/** Longest wait for the product page before giving up and simply letting it show. */
const WAIT_MS = 8000;
const HERO_CACHE = "okami-zoom-hero";
/** The camera's push-in on the wall behind the card (scale at the end of move 1). */
const PUSH_SCALE = 1.5;

let busy = false;

const raf = () => new Promise<number>((r) => requestAnimationFrame(r));

function lite(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";
}

function boxOf(r: DOMRect): Box {
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

/** The rectangle an `object-fit: contain` (centred) image actually paints inside its element box. */
function drawn(img: HTMLImageElement): Box {
  const b = boxOf(img.getBoundingClientRect());
  const nw = img.naturalWidth || b.w;
  const nh = img.naturalHeight || b.h;
  const s = Math.min(b.w / nw, b.h / nh);
  return { x: b.x + (b.w - nw * s) / 2, y: b.y + (b.h - nh * s) / 2, w: nw * s, h: nh * s };
}

/** `aspect` fitted (contain) and centred in `box`. */
function fit(aspect: number, box: Box): Box {
  const w = Math.min(box.w, box.h * aspect);
  const h = w / aspect;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
}

/** Where the product page will most likely show its photo box: last measured on this width, else the usual spot. */
function guessHero(): Box {
  const vw = window.innerWidth;
  try {
    const hit = JSON.parse(sessionStorage.getItem(HERO_CACHE) ?? "null") as (Box & { vw: number }) | null;
    if (hit && hit.vw === vw) return hit;
  } catch {}
  if (vw < 1024) return { x: 16, y: 130, w: vw - 32, h: vw - 32 };
  const side = Math.min(560, vw * 0.4);
  return { x: vw / 2 + Math.max(0, (Math.min(vw, 1280) / 2 - side) / 2), y: 150, w: side, h: side };
}

/** The product page's hero photo box + the picture with the most area showing inside it. */
function heroPhoto(): { img: HTMLImageElement; hero: HTMLElement } | null {
  const hero = document.querySelector<HTMLElement>("[data-zoom-hero]");
  if (!hero) return null;
  const h = hero.getBoundingClientRect();
  let best: { img: HTMLImageElement; area: number } | null = null;
  for (const img of hero.querySelectorAll("img")) {
    const r = img.getBoundingClientRect();
    const area = Math.max(0, Math.min(r.right, h.right) - Math.max(r.left, h.left)) * Math.max(0, Math.min(r.bottom, h.bottom) - Math.max(r.top, h.top));
    if (area > (best?.area ?? 0)) best = { img, area };
  }
  return best ? { img: best.img, hero } : null;
}

function place(el: HTMLElement, b: Box): void {
  Object.assign(el.style, { left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px` });
}

/** Keyframe transform taking an element laid out at `from` to `to` (origin top-left). */
function toward(from: Box, to: Box): string {
  return `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(${to.w / from.w}, ${to.h / from.h})`;
}

/** A still copy of the page body (`<main>`) laid exactly over it, under the header — the wall the camera pushes into. */
function stillWall(main: HTMLElement): HTMLElement {
  const r = main.getBoundingClientRect();
  const wall = main.cloneNode(true) as HTMLElement;
  wall.setAttribute("aria-hidden", "true");
  wall.setAttribute("inert", "");
  wall.removeAttribute("id");
  for (const el of wall.querySelectorAll("[id], [data-zoom-hero]")) {
    el.removeAttribute("id");
    el.removeAttribute("data-zoom-hero");
  }
  Object.assign(wall.style, {
    position: "fixed", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: "0",
    zIndex: "49", pointerEvents: "none", background: "var(--surface-0, #100e0d)", willChange: "transform",
  } satisfies Partial<CSSStyleDeclaration>);
  return wall;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.2);

function zoom(cardImg: HTMLImageElement, href: string, router: Router): void {
  busy = true;
  const root = document.documentElement;
  const main = document.querySelector<HTMLElement>("main");
  const start = drawn(cardImg);
  const aspect = start.w / start.h;
  const mid = fit(aspect, guessHero());
  const path = new URL(href, location.href).pathname;

  // The dark the wall sinks into: the page colour, with a low warm light where the product will stand.
  const veil = document.createElement("div");
  veil.setAttribute("aria-hidden", "true");
  Object.assign(veil.style, {
    position: "fixed", inset: "0", zIndex: "60", pointerEvents: "none", opacity: "0",
    background: `radial-gradient(ellipse 60% 24% at ${((mid.x + mid.w / 2) / window.innerWidth) * 100}% ${((mid.y + mid.h * 0.95) / window.innerHeight) * 100}%, rgb(var(--ember-rgb, 240 138 42) / 0.16), transparent 70%), var(--surface-0, #100e0d)`,
  } satisfies Partial<CSSStyleDeclaration>);

  // The lifted photo: the card's own picture (already painted, so it shows at once) + a sharper copy from the same srcset
  // that fades in over it once loaded (the card picture is small for a screen-wide photo).
  const flier = document.createElement("div");
  flier.setAttribute("aria-hidden", "true");
  Object.assign(flier.style, { position: "fixed", zIndex: "61", pointerEvents: "none", transformOrigin: "0 0", willChange: "transform" });
  place(flier, start);
  const base = new Image();
  base.src = cardImg.currentSrc || cardImg.src;
  const sharp = new Image();
  for (const img of [base, sharp]) {
    img.alt = "";
    img.decoding = "async";
    Object.assign(img.style, { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "contain" });
  }
  flier.append(base);
  if (cardImg.srcset) {
    sharp.style.opacity = "0";
    sharp.style.transition = "opacity 160ms ease-out";
    sharp.onload = () => (sharp.style.opacity = "1");
    sharp.sizes = `${Math.ceil(Math.max(mid.w, 360))}px`;
    sharp.srcset = cardImg.srcset;
    flier.append(sharp);
  }

  const wall = main ? stillWall(main) : null;
  if (wall) {
    const photo = wall.querySelector<HTMLElement>(`a[href="${CSS.escape(href)}"] [data-card-photo] img`);
    // Only the copy's photo hides: the real card under it stays as it was (the page leaves anyway).
    if (photo) photo.style.opacity = "0";
    wall.style.transformOrigin = `${start.x + start.w / 2 - parseFloat(wall.style.left)}px ${start.y + start.h / 2 - parseFloat(wall.style.top)}px`;
    document.body.append(wall);
  }
  document.body.append(veil, flier);
  // The hero photo of the page we are going to stays hidden until the flying copy is on it (globals.css "okami-zoom").
  root.dataset.zoomLanding = "1";
  // The real page changes route now, under the still wall.
  router.push(href, { scroll: true });

  // ── Move 1: push in ──
  const ease = "cubic-bezier(0.32, 0, 0.18, 1)";
  const pushing = [
    flier.animate([{ transform: "none" }, { transform: toward(start, mid) }], { duration: PUSH_MS, easing: ease, fill: "forwards" }),
    // The dark comes late (ease-in): the wall is seen moving in first, then fades behind the product.
    veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: PUSH_MS, easing: "cubic-bezier(0.6, 0, 0.9, 0.6)", fill: "forwards" }),
  ];
  if (wall) pushing.push(wall.animate([{ transform: "none" }, { transform: `scale(${PUSH_SCALE})` }], { duration: PUSH_MS, easing: ease, fill: "forwards" }));

  const finish = () => {
    delete root.dataset.zoomLanding;
    wall?.remove();
    veil.remove();
    flier.remove();
    busy = false;
  };

  void (async () => {
    try {
      const t0 = performance.now();
      await Promise.all(pushing.map((a) => a.finished));
      wall?.remove(); // fully dark now

      // Usually the product page is already there; if not, the photo breathes in a touch while it comes.
      let found = location.pathname === path ? heroPhoto() : null;
      if (!found) {
        const breathe = flier.animate(
          [{ transform: toward(start, mid) }, { transform: toward(start, { x: mid.x - mid.w * 0.025, y: mid.y - mid.h * 0.025, w: mid.w * 1.05, h: mid.h * 1.05 }) }],
          { duration: 2600, easing: "ease-out", fill: "forwards" },
        );
        while (performance.now() - t0 < WAIT_MS) {
          await raf();
          if (location.pathname === path && (found = heroPhoto())) break;
        }
        const now = flier.getBoundingClientRect();
        breathe.commitStyles();
        breathe.cancel();
        place(flier, boxOf(now));
        flier.style.transform = "";
      } else {
        place(flier, mid);
        flier.style.transform = "";
      }
      for (const a of pushing) a.cancel();
      veil.style.opacity = "1";
      if (!found) throw new Error("no hero");
      let hit: { img: HTMLImageElement; hero: HTMLElement } = found;
      await raf(); // let the new page take its scroll position

      // ── Move 2: land ── the photo follows the hero photo frame by frame while the dark lifts off the page.
      const from = boxOf(flier.getBoundingClientRect());
      const lift = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: LAND_MS - 60, delay: 60, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "both" });
      const l0 = performance.now();
      let to = from;
      for (;;) {
        const t = Math.min(1, (performance.now() - l0) / LAND_MS);
        const e = easeOut(t);
        hit = heroPhoto() ?? hit;
        to = fit(aspect, drawn(hit.img));
        place(flier, { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e });
        if (t >= 1) break;
        await raf();
      }
      await lift.finished;
      try {
        const box = boxOf(hit.hero.getBoundingClientRect());
        sessionStorage.setItem(HERO_CACHE, JSON.stringify({ ...box, vw: window.innerWidth }));
      } catch {}

      // Hand over to the page's own photo (wait for it if it is still loading), then let the copy go.
      const real = hit.img;
      if (!real.complete) await Promise.race([new Promise((r) => real.addEventListener("load", r, { once: true })), new Promise((r) => setTimeout(r, 1500))]);
      delete root.dataset.zoomLanding;
      await flier.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: "ease-out", fill: "forwards" }).finished;
      finish();
    } catch {
      // Anything unexpected: never leave the visitor under the dark — fade it away and let the page be.
      wall?.remove();
      const fade = [veil, flier].map((el) => el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], { duration: 200, fill: "forwards" }));
      await Promise.all(fade.map((a) => a.finished)).catch(() => {});
      finish();
    }
  })();
}

/** Capture-phase click on `a[data-card-cut]` (every product card): zoom instead of the Link's own navigation. */
export function attachZoom(router: Router): () => void {
  const onClick = (e: MouseEvent) => {
    if (busy || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = e.target as Element | null;
    const card = target?.closest<HTMLAnchorElement>("a[data-card-cut]");
    if (!card || target?.closest("button") || lite() || QUIET.test(location.pathname)) return;
    const href = card.getAttribute("href");
    const img = card.querySelector<HTMLImageElement>("[data-card-photo] img");
    if (!href?.startsWith("/products/") || new URL(href, location.href).pathname === location.pathname) return;
    if (!img || !img.complete || img.naturalWidth === 0) return;
    e.preventDefault(); // the Link sees defaultPrevented and stands down; the zoom navigates itself
    zoom(img, href, router);
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
