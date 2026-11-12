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
const PUSH_MS = 560;
const LAND_MS = 560;
/** Longest wait for the product page before giving up and simply letting it show. */
const WAIT_MS = 8000;
const HERO_CACHE = "okami-zoom-hero";
/** How long the camera keeps creeping in after the push-in while the product page is still coming. */
const DRIFT_MS = 1800;
/** The dim at the end of the push-in. The veil itself is a radial dim (see zoom()): ~0.74 round the product, ~0.97 at the
 *  edges — the wall stays faintly there (never a black "loading" screen) but the far side of a zoomed page (a filter
 *  list blown up 2×) sinks away (designer 13/11). */
const VEIL_MAX = 1;

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

/** Where the product page will most likely show its photo: where the last one landed on this width, else the usual spot. */
function guessHero(): Box {
  const vw = window.innerWidth;
  try {
    const hit = JSON.parse(sessionStorage.getItem(HERO_CACHE) ?? "null") as (Box & { vw: number }) | null;
    if (hit && hit.vw === vw) return hit;
  } catch {}
  // Measured on the product page (Caliburn G5 landing, 13/11): phone 390 → photo area from y 178, 0.76 × width tall;
  // desktop 1440 → right half, y 288, 516 tall. A wrong guess only means a longer glide in move 2.
  if (vw < 1024) return { x: 16, y: 178, w: vw - 32, h: vw * 0.76 };
  return { x: vw * 0.485, y: 288, w: vw * 0.468, h: Math.min(516, vw * 0.36) };
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

/**
 * A still copy of the page body (`<main>`), clipped to the screen and laid exactly over the page, under the header and the
 * floating buttons — the wall
 * the camera pushes into. Product cards off screen are copied as empty boxes of the same size (`offscreen`, measured
 * before anything moved), so copying a long grid costs little more than the screenful the visitor sees.
 */
function stillWall(main: HTMLElement, r: DOMRect, offscreen: Map<number, DOMRect>): HTMLElement {
  const copy = main.cloneNode(true) as HTMLElement;
  copy.removeAttribute("id");
  for (const el of copy.querySelectorAll("[id], [data-zoom-hero]")) {
    el.removeAttribute("id");
    el.removeAttribute("data-zoom-hero");
  }
  // The card tap effect's red hairline (CardCut.tsx) would freeze mid-stroke in a still copy.
  for (const line of copy.querySelectorAll("[data-card-photo] > svg")) line.remove();
  copy.querySelectorAll<HTMLElement>("a[data-card-cut]").forEach((card, i) => {
    const box = offscreen.get(i);
    if (box) Object.assign(card.style, { contentVisibility: "hidden", containIntrinsicSize: `${box.width}px ${box.height}px` });
  });
  Object.assign(copy.style, { position: "absolute", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, margin: "0" });
  const wall = document.createElement("div");
  wall.setAttribute("aria-hidden", "true");
  wall.setAttribute("inert", "");
  Object.assign(wall.style, {
    position: "fixed", inset: "0", overflow: "hidden", zIndex: "30", pointerEvents: "none",
    background: "var(--surface-0, #100e0d)", willChange: "transform",
  } satisfies Partial<CSSStyleDeclaration>);
  wall.append(copy);
  return wall;
}

function zoom(cardImg: HTMLImageElement, href: string, router: Router): void {
  busy = true;
  const root = document.documentElement;
  const main = document.querySelector<HTMLElement>("main");
  const start = drawn(cardImg);
  const aspect = start.w / start.h;
  const mid = fit(aspect, guessHero());
  const path = new URL(href, location.href).pathname;
  let left = false;
  const onBack = () => (left = true);
  window.addEventListener("popstate", onBack);

  // The camera: it pushes in on the tapped card AND travels with it, so the card's centre arrives where the product
  // photo will stand (the wall moves with the pod instead of the pod sliding across the other products), scaled about
  // as much as the photo grows, so the pod stays sitting in its own card on the way.
  const cx = start.x + start.w / 2;
  const cy = start.y + start.h / 2;
  const dx = mid.x + mid.w / 2 - cx;
  const dy = mid.y + mid.h / 2 - cy;
  const scale = Math.min(3.2, Math.max(1.8, mid.w / start.w));
  const shot = (s: number) => `translate(${dx}px, ${dy}px) scale(${s})`;

  // The dim the wall sinks into: the page colour (never quite black — a ghost of the wall stays), with a low warm light
  // where the product will stand. Under the site header, which stays put like the frame round the reel's screen.
  const veil = document.createElement("div");
  veil.setAttribute("aria-hidden", "true");
  Object.assign(veil.style, {
    position: "fixed", inset: "0", zIndex: "49", pointerEvents: "none", opacity: "0",
    background: `radial-gradient(ellipse 60% 24% at ${((mid.x + mid.w / 2) / window.innerWidth) * 100}% ${((mid.y + mid.h * 0.95) / window.innerHeight) * 100}%, rgb(var(--ember-rgb, 240 138 42) / 0.18), transparent 70%), radial-gradient(circle at ${((mid.x + mid.w / 2) / window.innerWidth) * 100}% ${((mid.y + mid.h / 2) / window.innerHeight) * 100}%, color-mix(in srgb, var(--surface-0, #100e0d) 74%, transparent) 0%, color-mix(in srgb, var(--surface-0, #100e0d) 97%, transparent) 60%)`,
  } satisfies Partial<CSSStyleDeclaration>);

  // The lifted photo: the card's own picture (already painted, so it shows at once) + a sharper copy from the same srcset
  // that fades in over it once loaded (the card picture is small for a screen-wide photo).
  const flier = document.createElement("div");
  flier.setAttribute("aria-hidden", "true");
  Object.assign(flier.style, { position: "fixed", zIndex: "49", pointerEvents: "none", transformOrigin: "0 0", willChange: "transform" });
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

  document.body.append(veil, flier);
  // The lit shelf of the page we are going to waits until the photo starts landing, so it lights up under it (globals.css "okami-zoom").
  root.dataset.zoomDark = "1";
  cardImg.style.opacity = "0";

  // ── Move 1: push in ── started first and kept cheap, so the tap answers on the very next frame. Every part is a
  // transform or an opacity, which the browser animates off the main thread: it keeps moving while the page is busy below.
  const timing = { duration: PUSH_MS, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "forwards" } as const;
  const pushing = [
    flier.animate([{ transform: "none" }, { transform: toward(start, mid) }], timing),
    // The dim comes late (ease-in): the wall is seen rushing in first, then sinks behind the product.
    veil.animate([{ opacity: 0 }, { opacity: VEIL_MAX }], { ...timing, easing: "cubic-bezier(0.6, 0, 0.9, 0.6)" }),
  ];
  const mainBox = main?.getBoundingClientRect();
  // Cards well off screen (measured now, before anything moves): the wall copy leaves them as empty boxes.
  const offscreen = new Map<number, DOMRect>();
  main?.querySelectorAll("a[data-card-cut]").forEach((card, i) => {
    const b = card.getBoundingClientRect();
    if (b.bottom < -200 || b.top > window.innerHeight + 200 || b.right < -200 || b.left > window.innerWidth + 200) offscreen.set(i, b);
  });
  const camera = (el: HTMLElement, origin: string) => {
    el.style.transformOrigin = origin;
    return el.animate([{ transform: "none" }, { transform: shot(scale) }], timing);
  };
  const moving = main && mainBox ? camera(main, `${cx - mainBox.left}px ${cy - mainBox.top}px`) : null;
  let wall: HTMLElement | null = null;

  const finish = () => {
    window.removeEventListener("popstate", onBack);
    delete root.dataset.zoomLanding;
    delete root.dataset.zoomDark;
    moving?.cancel();
    if (main) Object.assign(main.style, { transformOrigin: "", visibility: "" });
    cardImg.style.opacity = "";
    wall?.remove();
    veil.remove();
    flier.remove();
    busy = false;
  };

  void (async () => {
    try {
      const t0 = performance.now();
      // Once the motion is on screen: lay a still copy of the wall over the page (same motion, same clock) and change
      // route under it. Copying a long page can hold the main thread for a moment; the motion above does not need it.
      await raf();
      if (main && mainBox && moving) {
        await moving.ready;
        wall = stillWall(main, mainBox, offscreen);
        document.body.append(wall);
        const copy = camera(wall, `${cx}px ${cy}px`);
        copy.startTime = moving.startTime;
        pushing.push(copy);
        // Let the copy be painted and moving on screen before the next page's render takes the main thread (on desktop
        // the copy otherwise stood still for ~0.3 s while the pod flew on — designer 13/11).
        await copy.ready;
        await raf();
        await raf();
        // The real page is now under the copy: stop moving it and stop painting it while the next page renders there.
        moving.cancel();
        main.style.visibility = "hidden";
      }
      // The hero photo of the page we are going to stays hidden until the flying copy is on it (globals.css "okami-zoom") —
      // set only now, under the copy, so a product page we are leaving never blinks its own photo.
      root.dataset.zoomLanding = "1";
      // No scroll by the router: it scrolls the new page a beat after it shows (and stops 65 px down, under the header);
      // the zoom puts the page at its very top itself the moment it arrives, so the photo it lands on holds still.
      router.push(href, { scroll: false });

      // Wait for the product page — the motion never stops meanwhile: past the push-in the camera keeps creeping in and
      // the photo keeps growing a touch until the page is there. The landing may start in the push's last 100 ms.
      let found: ReturnType<typeof heroPhoto> = null;
      let drifting = false;
      for (;;) {
        await raf();
        const t = performance.now() - t0;
        if (left || t > WAIT_MS) throw new Error("gave up");
        if (!found && location.pathname === path && (found = heroPhoto())) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (found && t >= PUSH_MS - 100) break;
        if (!drifting && t >= PUSH_MS) {
          drifting = true;
          const drift = { duration: DRIFT_MS, easing: "cubic-bezier(0.2, 0.6, 0.4, 1)", fill: "forwards" } as const;
          const grown: Box = { x: mid.x - mid.w * 0.03, y: mid.y - mid.h * 0.03, w: mid.w * 1.06, h: mid.h * 1.06 };
          flier.animate([{ transform: toward(start, mid) }, { transform: toward(start, grown) }], drift);
          wall?.animate([{ transform: shot(scale) }, { transform: shot(scale * 1.18) }], drift);
        }
      }
      let hit: { img: HTMLImageElement; hero: HTMLElement } = found;
      // Let the new page settle (the hero photo still for two frames, at most ~8; the second glide below catches a later shift).
      const target = () => fit(aspect, drawn((hit = heroPhoto() ?? hit).img));
      let to = target();
      for (let i = 0, still = 0; i < 8 && still < 2; i++) {
        await raf();
        const next = target();
        still = Math.abs(next.x - to.x) + Math.abs(next.y - to.y) + Math.abs(next.w - to.w) < 1 ? still + 1 : 0;
        to = next;
      }

      // ── Move 2: land ── the photo glides onto the hero photo while the wall copy and the dim lift off the product page.
      // Transforms and opacities again, so it glides even if the new page is still busy; if the page moved meanwhile,
      // a short second glide puts it right.
      const from = boxOf(flier.getBoundingClientRect());
      for (const a of flier.getAnimations()) a.cancel();
      place(flier, from);
      const dim = parseFloat(getComputedStyle(veil).opacity);
      for (const a of veil.getAnimations()) a.cancel();
      veil.style.opacity = String(dim);
      if (main) Object.assign(main.style, { transformOrigin: "", visibility: "" });
      delete root.dataset.zoomDark;
      const lifting = [veil.animate([{ opacity: dim }, { opacity: 0 }], { duration: LAND_MS - 120, delay: 120, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "both" })];
      // The copy is gone before the page shows through, so old and new text never overlap (designer 13/11).
      if (wall) lifting.push(wall.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: "ease-out", fill: "forwards" }));
      await flier.animate([{ transform: "none" }, { transform: toward(from, to) }], { duration: LAND_MS, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" }).finished;
      for (const a of flier.getAnimations()) a.cancel();
      place(flier, to);
      const now = target();
      if (Math.abs(now.x - to.x) + Math.abs(now.y - to.y) + Math.abs(now.w - to.w) > 1.5) {
        await flier.animate([{ transform: "none" }, { transform: toward(to, now) }], { duration: 200, easing: "ease-out", fill: "forwards" }).finished;
        for (const a of flier.getAnimations()) a.cancel();
        place(flier, now);
        to = now;
      }
      await Promise.all(lifting.map((a) => a.finished));
      wall?.remove();
      try {
        sessionStorage.setItem(HERO_CACHE, JSON.stringify({ ...to, vw: window.innerWidth }));
      } catch {}

      // Hand over to the page's own photo (wait for it if it is still loading), then let the copy go.
      const real = hit.img;
      if (!real.complete) await Promise.race([new Promise((r) => real.addEventListener("load", r, { once: true })), new Promise((r) => setTimeout(r, 1500))]);
      delete root.dataset.zoomLanding;
      await flier.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: "ease-out", fill: "forwards" }).finished;
      finish();
    } catch {
      // Back pressed, no product page, anything unexpected: never leave the visitor under the dim — fade it all away and
      // let whatever page is there be.
      if (main) Object.assign(main.style, { transformOrigin: "", visibility: "" });
      delete root.dataset.zoomLanding;
      if (!left && location.pathname === path) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const fade = [veil, flier, ...(wall ? [wall] : [])].map((el) =>
        el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], { duration: 220, fill: "forwards" }),
      );
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
  // Fetch the product page as the finger lands, so it is usually ready by the end of the push-in.
  const onDown = (e: PointerEvent) => {
    const href = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-card-cut]")?.getAttribute("href");
    if (href?.startsWith("/products/")) router.prefetch(href);
  };
  document.addEventListener("pointerdown", onDown, { capture: true, passive: true });
  document.addEventListener("click", onClick, true);
  return () => {
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("click", onClick, true);
  };
}
