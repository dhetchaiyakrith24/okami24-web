/**
 * The "Zoom" (owner list ก10 · his reference reel 30/10 · his ruling 13/11): tapping a product card zooms INTO that card's
 * photo from where it sits, and that zoom is the page change. The first version navigated first and animated on the new
 * page; the owner rejected it ("กดสินค้าและสลับไปหน้าสินค้า และจากนั้น Pod ค่อยเคลื่อนที่มา … มันไม่ได้ให้อารมณ์ Zoom").
 *
 * Why not the browser's View Transitions API: its animation can only start once the new page is ready, so the tap
 * would wait on the network first — exactly what the owner turned down. This runs on the tap instead, in every browser
 * (plain Web Animations + one animation-frame loop), in two moves:
 *   1. "push in" (on the tap, nothing waits): the card's photo lifts off as a fixed copy and flies to where the product
 *      page shows it, while the wall of cards behind gently scales up around that card (the camera moving in) and sinks
 *      into the page colour. The wall is a still copy laid over the page, so the real page changes route underneath at
 *      the same moment — the network wait hides inside the motion instead of coming before it.
 *   2. "land": once the product page is there (put at its top under the copy), the photo glides onto the hero's real
 *      photo in one move while the dark lifts off the page; scrolling at that moment hands the page over at once. The hero's own photo then takes over under it (a short cross-fade covers a
 *      different photo or one still loading).
 * Fetched after the page has loaded (ZoomNav.tsx imports this file when the browser is idle), never on the server.
 */

type Router = { push: (href: string, opts?: { scroll?: boolean }) => void; prefetch: (href: string) => void };
type Box = { x: number; y: number; w: number; h: number };

/** Pages where cards never zoom (the same quiet pages as the card tap effect, CardCut.tsx). */
const QUIET = /^\/(cart|checkout|staff|orders)(\/|$)/;
/** The push-in, and the longest landing glide + dim lift (owner 13/11: quicker, calm). */
const PUSH_MS = 420;
const LAND_MS = 300;
/** Longest wait for the product page before giving up and simply letting it show. */
const WAIT_MS = 8000;
const HERO_CACHE = "okami-zoom-hero";
/** The camera's push-in on the wall: a gentle scale about the tapped card, drifting this share of the way toward the photo's spot. */
const CAMERA = 1.15;
const PAN = 0.3;

let busy = false;

const raf = () => new Promise<number>((r) => requestAnimationFrame(r));

/** Less motion asked for, or a slow / Save-Data connection (the home page's data-okami-lite, checked here too because
 *  that flag is set only on the home page). */
function lite(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1") return true;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (!!c.saveData || /(^|-)2g$/.test(c.effectiveType ?? ""));
}

function boxOf(r: DOMRect): Box {
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

/** The rectangle an `object-fit: contain` (centred) image actually paints inside its element box. */
function drawn(img: HTMLImageElement): Box {
  // object-fit draws inside the content box: the compact phone cards pad the <img> itself (card-compact.css, 4px / 16px).
  const r = img.getBoundingClientRect();
  const cs = getComputedStyle(img);
  const px = (k: string) => parseFloat(cs.getPropertyValue(k)) || 0;
  const l = px("padding-left") + px("border-left-width");
  const t = px("padding-top") + px("border-top-width");
  const b: Box = { x: r.left + l, y: r.top + t, w: Math.max(1, r.width - l - px("padding-right") - px("border-right-width")), h: Math.max(1, r.height - t - px("padding-bottom") - px("border-bottom-width")) };
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

/** Where the product page will most likely show its photo: where the last one of this page layout landed on this width,
 *  else its usual spot. `pilot` = the pilot product page (PilotProductDetail), whose photo sits lower. */
function guessHero(pilot: boolean): Box {
  const vw = window.innerWidth;
  try {
    const hit = JSON.parse(sessionStorage.getItem(HERO_CACHE) ?? "null") as (Box & { vw: number; pilot?: boolean }) | null;
    if (hit && hit.vw === vw && !!hit.pilot === pilot) return hit;
  } catch {}
  // Measured on the product pages 13/11 (ProductHero): phone → a square box 20 px in from each side, from y 217, the
  // photo ~24 px inside it; desktop → the right half of the page's content column (the header's max-width box, centred
  // on wide screens — guessing from the window width sent the zoom off to one side at 2000 px), photo 48 px inside.
  // Pilot page: phone → a 4:3 box from y ~320; desktop → a 4:5 box from y ~484 in the same column.
  if (vw < 1024) {
    const s = vw - 40;
    return pilot ? { x: 32, y: 332, w: s - 24, h: s * 0.75 - 24 } : { x: 44, y: 241, w: s - 48, h: s - 48 };
  }
  const header = document.querySelector("header");
  const column = header && [...header.querySelectorAll("div")].find((d) => getComputedStyle(d).maxWidth !== "none");
  const c = column?.getBoundingClientRect() ?? { left: 0, width: vw };
  const w = c.width * 0.48;
  if (pilot) return { x: c.left + c.width * 0.485 + 48, y: 532, w: w - 96, h: w * 1.25 - 96 };
  const y = vw >= 1440 ? 205 : vw >= 1280 ? 238 : 345;
  return { x: c.left + c.width * 0.485 + 48, y: y + 48, w: w - 96, h: Math.min(w - 96, window.innerHeight - y - 96) };
}

/** The product page's hero photo box + the picture with the most area showing inside it. */
function heroPhoto(): { img: HTMLImageElement; hero: HTMLElement } | null {
  // A page may have one box per screen size (the pilot product page: a phone gallery and a desktop photo); the hidden
  // one measures 0 and drops out.
  let best: { img: HTMLImageElement; hero: HTMLElement; area: number } | null = null;
  for (const hero of document.querySelectorAll<HTMLElement>("[data-zoom-hero]")) {
    const h = hero.getBoundingClientRect();
    for (const img of hero.querySelectorAll("img")) {
      const r = img.getBoundingClientRect();
      const area = Math.max(0, Math.min(r.right, h.right) - Math.max(r.left, h.left)) * Math.max(0, Math.min(r.bottom, h.bottom) - Math.max(r.top, h.top));
      if (area > (best?.area ?? 0)) best = { img, hero, area };
    }
  }
  return best ? { img: best.img, hero: best.hero } : null;
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
function stillWall(main: HTMLElement, r: DOMRect, offscreen: Map<number, DOMRect>, lifted: HTMLImageElement): HTMLElement {
  const at = [...main.querySelectorAll("img")].indexOf(lifted);
  const copy = main.cloneNode(true) as HTMLElement;
  // The tapped picture is the one flying: never also in the copy (it may still be showing on the page itself).
  const twin = at >= 0 ? copy.querySelectorAll("img")[at] : undefined;
  if (twin) twin.style.opacity = "0";
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
  // Drawn lighter than the page (globals.css [data-zoom-wall]): no card gradients or shadows, which cost the GPU ~150 ms
  // to paint into a new layer and froze the first frames of the zoom (checker 13/11).
  wall.setAttribute("data-zoom-wall", "");
  Object.assign(wall.style, {
    position: "fixed", inset: "0", overflow: "hidden", zIndex: "30", pointerEvents: "none",
    background: "var(--surface-0, #100e0d)", willChange: "transform",
  } satisfies Partial<CSSStyleDeclaration>);
  wall.append(copy);
  return wall;
}

function zoom(cardImg: HTMLImageElement, href: string, router: Router, pilot: boolean): void {
  busy = true;
  const root = document.documentElement;
  const main = document.querySelector<HTMLElement>("main");
  const start = drawn(cardImg);
  const aspect = start.w / start.h;
  const mid = fit(aspect, guessHero(pilot));
  const path = new URL(href, location.href).pathname;
  let left = false;
  const onBack = () => (left = true);
  window.addEventListener("popstate", onBack);

  // The camera: a short, gentle push-in on the tapped card (scaled about the card, drifting only a little toward where
  // the photo goes) while the room sinks into the dim. The photo itself makes the journey. A long sideways pan of the
  // whole wall read as "the zoom goes off to one side" on wide screens (owner 13/11).
  const cx = start.x + start.w / 2;
  const cy = start.y + start.h / 2;
  const shot = `translate(${(mid.x + mid.w / 2 - cx) * PAN}px, ${(mid.y + mid.h / 2 - cy) * PAN}px) scale(${CAMERA})`;

  // The dim the wall sinks into: the page colour (never quite black — a ghost of the wall stays), with a low warm light
  // where the product will stand. Under the site header, which stays put like the frame round the reel's screen.
  const veil = document.createElement("div");
  veil.setAttribute("aria-hidden", "true");
  Object.assign(veil.style, {
    position: "fixed", inset: "0", zIndex: "49", pointerEvents: "none", opacity: "0",
    background: `radial-gradient(ellipse 60% 24% at ${((mid.x + mid.w / 2) / window.innerWidth) * 100}% ${((mid.y + mid.h * 0.95) / window.innerHeight) * 100}%, rgb(var(--ember-rgb, 240 138 42) / 0.18), transparent 70%), radial-gradient(circle at ${((mid.x + mid.w / 2) / window.innerWidth) * 100}% ${((mid.y + mid.h / 2) / window.innerHeight) * 100}%, color-mix(in srgb, var(--surface-0, #100e0d) 74%, transparent) 0%, color-mix(in srgb, var(--surface-0, #100e0d) 97%, transparent) 60%)`,
  } satisfies Partial<CSSStyleDeclaration>);

  // The lifted photo: the card's own picture (decoded when the finger came down — attachZoom — so it is drawn on the very
  // next frame) + a sharper copy from the same srcset that fades in over it once loaded.
  const flier = document.createElement("div");
  flier.setAttribute("aria-hidden", "true");
  Object.assign(flier.style, { position: "fixed", zIndex: "49", pointerEvents: "none", transformOrigin: "0 0", willChange: "transform" });
  place(flier, start);
  const ready = takePrepared(cardImg);
  const wasReady = ready.early;
  const base = ready.img;
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
  // The lit shelf of the page we are going to waits until the photo lands, so it lights up under it (globals.css "okami-zoom").
  root.dataset.zoomDark = "1";

  // ── Move 1: push in ── nothing waits for it: it starts on the frame after the tap, as transforms and opacities the
  // browser runs off the main thread. Quick to leave, calm to arrive (owner 13/11: "นุ่มๆ นิ่งๆ ค่อนข้างเร็ว").
  const flight = flier.animate([{ transform: "none" }, { transform: toward(start, mid) }], { duration: PUSH_MS, easing: "cubic-bezier(0.2, 0.7, 0.25, 1)", fill: "forwards" });
  veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: PUSH_MS, easing: "cubic-bezier(0.3, 0, 0.5, 1)", fill: "forwards" });
  // The card's own picture gives way once the lifted copy is drawn (decoded + a frame), so it never blinks out.
  const lifted = (wasReady ? raf() : ready.decoded.then(raf).then(raf)).then(() => {
    if (flier.isConnected) cardImg.style.opacity = "0";
  });
  const mainBox = main?.getBoundingClientRect();
  // Cards well off screen (measured now, before anything moves): the wall copy leaves them as empty boxes.
  const offscreen = new Map<number, DOMRect>();
  main?.querySelectorAll("a[data-card-cut]").forEach((card, i) => {
    const b = card.getBoundingClientRect();
    if (b.bottom < -200 || b.top > window.innerHeight + 200 || b.right < -200 || b.left > window.innerWidth + 200) offscreen.set(i, b);
  });
  let wall: HTMLElement | null = null;

  // Ends the zoom, at once or with a short fade — whichever way it ends (landed, scrolled, Back, no product page).
  let ended = false;
  const end = async (fadeMs: number) => {
    if (ended) return;
    ended = true;
    window.removeEventListener("popstate", onBack);
    for (const ev of ["wheel", "touchmove", "keydown"]) window.removeEventListener(ev, interrupt, true);
    if (main) main.style.visibility = "";
    delete root.dataset.zoomLanding;
    delete root.dataset.zoomDark;
    const parts = [veil, flier, ...(wall ? [wall] : [])];
    if (fadeMs > 0) {
      const fade = parts.map((el) => {
        const from = getComputedStyle(el).opacity;
        for (const a of el.getAnimations()) if (el !== flier) a.cancel();
        return el.animate([{ opacity: from }, { opacity: 0 }], { duration: fadeMs, easing: "ease-out", fill: "forwards" });
      });
      await Promise.all(fade.map((a) => a.finished)).catch(() => {});
    }
    for (const el of parts) el.remove();
    cardImg.style.opacity = "";
    busy = false;
  };
  // The visitor scrolls (or keys) while the photo is still over the page: hand the page over at once — a photo pinned
  // to the screen while the page slid under it read as the photo "following" the page (owner's iPhone video 13/11).
  let landedAt = 0;
  const interrupt = () => {
    if (landedAt) void end(120);
  };

  void (async () => {
    try {
      const t0 = performance.now();
      await raf();
      if (main && mainBox) {
        // The copy leaves the tapped picture out, so the flying one must be on screen first.
        await lifted;
        wall = stillWall(main, mainBox, offscreen, cardImg);
        document.body.append(wall);
        wall.style.transformOrigin = `${cx}px ${cy}px`;
        // The camera starts from rest whenever the copy is ready and arrives with the photo.
        const camera = wall.animate([{ transform: "none" }, { transform: shot }], { duration: Math.max(200, PUSH_MS - (performance.now() - t0)), easing: "cubic-bezier(0.3, 0.5, 0.3, 1)", fill: "forwards" });
        // Let the copy be painted before the next page's render takes the main thread (designer 13/11).
        await camera.ready;
        await raf();
        await raf();
        // The real page is now under the copy: stop painting it while the next page renders there.
        main.style.visibility = "hidden";
      }
      // The hero photo of the page we are going to stays hidden until the flying copy is on it (globals.css "okami-zoom").
      root.dataset.zoomLanding = "1";
      // No scroll by the router: it scrolls the new page a beat after it shows (and stops 65 px down, under the header);
      // the zoom puts the page at its top itself the moment it arrives, still under the copy, so nothing moves after.
      router.push(href, { scroll: false });

      // Wait for the product page. The photo holds still at its spot meanwhile (calm, no creeping).
      let found: ReturnType<typeof heroPhoto> = null;
      let arrived = 0;
      for (;;) {
        await raf();
        const t = performance.now() - t0;
        if (left || t > WAIT_MS) throw new Error("gave up");
        if (!arrived && location.pathname === path) arrived = t;
        if (!found && arrived && (found = heroPhoto())) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        // The page is there but has no photo box to land on: fade straight into it rather than holding the dim.
        if (!found && arrived && t - arrived > 400) throw new Error("no hero");
        if (found) break;
      }
      let hit: { img: HTMLImageElement; hero: HTMLElement } = found;
      const target = () => fit(aspect, drawn((hit = heroPhoto() ?? hit).img));
      // Let the new page settle: its photo box still for two frames (at most 8).
      let to = target();
      for (let i = 0, still = 0; i < 8 && still < 2; i++) {
        await raf();
        const next = target();
        still = Math.abs(next.x - to.x) + Math.abs(next.y - to.y) + Math.abs(next.w - to.w) < 1 ? still + 1 : 0;
        to = next;
      }
      // Still flying (a fast page): finish the flight to where the photo really is, from where it is now — one move.
      const from = boxOf(flier.getBoundingClientRect());
      flight.cancel();
      place(flier, from);

      // ── Move 2: land ── the dim and the copy lift off the product page while the photo settles onto its own photo.
      if (main) main.style.visibility = "";
      delete root.dataset.zoomDark;
      const dim = parseFloat(getComputedStyle(veil).opacity);
      for (const a of veil.getAnimations()) a.cancel();
      veil.style.opacity = String(dim);
      for (const ev of ["wheel", "touchmove", "keydown"]) window.addEventListener(ev, interrupt, { capture: true, passive: true });
      landedAt = performance.now();
      const lifting = [veil.animate([{ opacity: dim }, { opacity: 0 }], { duration: LAND_MS, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "forwards" })];
      // The copy is gone before the page shows through, so old and new text never overlap (designer 13/11).
      if (wall) lifting.push(wall.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "ease-out", fill: "forwards" }));
      const far = Math.abs(to.x - from.x) + Math.abs(to.y - from.y) + Math.abs(to.w - from.w);
      if (far > 1) await flier.animate([{ transform: "none" }, { transform: toward(from, to) }], { duration: Math.min(LAND_MS, 160 + far * 0.4), easing: "cubic-bezier(0.25, 0.6, 0.25, 1)", fill: "forwards" }).finished;
      if (ended) return;
      await Promise.all(lifting.map((a) => a.finished));
      if (ended) return;
      wall?.remove();
      try {
        sessionStorage.setItem(HERO_CACHE, JSON.stringify({ ...to, vw: window.innerWidth, pilot }));
      } catch {}
      // Hand over to the page's own photo (a short wait if it is still loading), then let the copy go.
      const real = hit.img;
      if (!real.complete) await Promise.race([new Promise((r) => real.addEventListener("load", r, { once: true })), new Promise((r) => setTimeout(r, 600))]);
      await end(140);
    } catch {
      // Back pressed, no product page, anything unexpected: never leave the visitor under the dim.
      if (!left && location.pathname === path) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      await end(200);
    }
  })();
}

/** The card picture decoded ahead of the tap (pointerdown), so the lifted copy is drawn on the first frame. */
const prepared = new WeakMap<HTMLImageElement, { img: HTMLImageElement; decoded: Promise<void>; early: boolean }>();
function prepare(cardImg: HTMLImageElement): void {
  if (prepared.has(cardImg)) return;
  const img = new Image();
  img.src = cardImg.currentSrc || cardImg.src;
  const entry = { img, decoded: Promise.resolve(), early: false };
  entry.decoded = img.decode().then(
    () => void (entry.early = true),
    () => {},
  );
  prepared.set(cardImg, entry);
}
function takePrepared(cardImg: HTMLImageElement) {
  prepare(cardImg);
  const entry = prepared.get(cardImg)!;
  prepared.delete(cardImg); // one flight per decoded copy (the element moves into the flier)
  return entry;
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
    zoom(img, href, router, card.hasAttribute("data-zoom-pilot"));
  };
  // Fetch the product page as the finger lands, so it is usually ready by the end of the push-in.
  // The card's picture is decoded then too, so the lifted copy is drawn on the frame after the tap.
  const onDown = (e: PointerEvent) => {
    const card = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-card-cut]");
    const href = card?.getAttribute("href");
    if (!href?.startsWith("/products/")) return;
    router.prefetch(href);
    const img = card?.querySelector<HTMLImageElement>("[data-card-photo] img");
    if (img?.complete && img.naturalWidth > 0 && !lite()) prepare(img);
  };
  // Back/Forward after a zoom: the browser puts the page back where it was, but the site-wide smooth scrolling
  // (globals.css html) turned that into a 0.6 s glide down the list (a plain link jumps straight back). Instant for that moment.
  let popTimer = 0;
  const onPop = () => {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    window.clearTimeout(popTimer);
    popTimer = window.setTimeout(() => (root.style.scrollBehavior = ""), 800);
  };
  document.addEventListener("pointerdown", onDown, { capture: true, passive: true });
  document.addEventListener("click", onClick, true);
  window.addEventListener("popstate", onPop);
  return () => {
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("popstate", onPop);
    window.clearTimeout(popTimer);
    document.documentElement.style.scrollBehavior = "";
  };
}
