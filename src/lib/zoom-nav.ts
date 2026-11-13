/**
 * The "Zoom" (owner list ก10 · his reference reel 30/10 · his rulings 13/11): tapping a product card is a CAMERA move —
 * the visitor's view travels into the card, the card never flies out to the visitor. Owner 13/11:
 *   "เมื่อกดต้องเป็นเราเองที่ Zoom ไปหาสินค้า ไม่ใช่สินค้า Zoom เข้าใกล้มาหาเรา … เมื่อกดกลับ ถอยหลังก็ใช้การ Zoom out ออกมาตำแหน่งที่เดิม"
 *   "Smooth ลื่นไหล รวดเร็ว ไม่ช้า ไม่รอเล่น Effect เยอะ แค่ให้รู้ว่า Zoom แต่ Zoom เร็ว" — about 0.35 s each way; the other
 *   cards slide off-screen with the camera on the way in and glide back into place on the way out ("ย้อนเวลา").
 *
 * How (the browser's View Transitions, same-document): on the tap the browser keeps a snapshot of the list as it stands — a
 * GPU texture, no page copy and no repaint (a copied or promoted page held every frame for 0.2–0.4 s, measured 13/11) — and
 * the camera is one transform on that snapshot: the tapped card's photo grows onto the spot where the product page shows
 * its photo, everything else around it moves out of the screen in proportion, like a lens pushing in. The photo itself is
 * a separate sharp layer locked to the same camera (its morph is the same straight line), so it never blurs or stretches.
 * Under the snapshot the route changes at once; at the end of the push the photo stands where the product page has its
 * photo and the page shows round it. Back (popstate to that list) plays the same camera in reverse on the list as it is
 * restored, at the place and scroll the visitor left.
 * The site header keeps its own snapshot and stays put, like the frame round the reel's screen.
 * Browsers without View Transitions, reduced motion, Save-Data, modified clicks … = the plain link (ZoomNav.tsx, attachZoom).
 * Fetched after the page has loaded (ZoomNav.tsx imports this file when the browser is idle), never on the server.
 */

type Router = { push: (href: string, opts?: { scroll?: boolean }) => void; prefetch: (href: string) => void };
type Box = { x: number; y: number; w: number; h: number };
/** p ↦ (tx, ty) + s·p — the camera, as one uniform scale + move (transform-origin 0 0). */
type Cam = { s: number; tx: number; ty: number };
type Transition = { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void>; skipTransition: () => void };
type DocVT = Document & { startViewTransition?: (update: () => void | Promise<void>) => Transition };

/** Pages where cards never zoom (the same quiet pages as the card tap effect, CardCut.tsx). */
const QUIET = /^\/(cart|checkout|staff|orders)(\/|$)/;
/** One way, in or out (owner 13/11: "ประมาณ 0.35 วินาที"). */
const ZOOM_MS = 350;
/** Quick out, soft landing: the camera is already moving on the first frame and settles onto the photo. */
const EASE = "cubic-bezier(0.25, 0.9, 0.25, 1)";
/** The product page showing round the photo once it is there. */
const LIFT_MS = 160;
/** Longest wait for the product page before giving up and simply letting it show. */
const WAIT_MS = 8000;
const HERO_CACHE = "okami-zoom-hero";
/** Where the last zoom started — Back to that list plays it in reverse. */
const BACK_KEY = "okami-zoom-back";
const PHOTO = "okami-zoom-photo";
const HEAD = "okami-zoom-head";

let busy = false;

const raf = () => new Promise<number>((r) => requestAnimationFrame(r));
const startVT = (update: () => void | Promise<void>) => (document as DocVT).startViewTransition!(update);


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

/** The camera that lays `from` onto `to` (same aspect: uniform scale by width). */
function camera(from: Box, to: Box): Cam {
  const s = to.w / from.w;
  return { s, tx: to.x - s * from.x, ty: to.y - s * from.y };
}
const camCss = (c: Cam) => `translate(${c.tx}px, ${c.ty}px) scale(${c.s})`;
const shot = (c: Cam, b: Box): Box => ({ x: c.tx + c.s * b.x, y: c.ty + c.s * b.y, w: c.s * b.w, h: c.s * b.h });

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

/** The sharp picture for a card, started (and decoded) as the finger lands, so the photo layer is drawn on the tap frame. */
const prepared = new WeakMap<HTMLImageElement, HTMLImageElement>();
function prepare(cardImg: HTMLImageElement, pilot: boolean): HTMLImageElement | null {
  if (!cardImg.srcset) return null;
  let sharp = prepared.get(cardImg);
  if (!sharp) {
    sharp = new Image();
    sharp.alt = "";
    sharp.decoding = "async";
    sharp.sizes = `${Math.ceil(Math.max(guessHero(pilot).w, 360))}px`;
    sharp.srcset = cardImg.srcset;
    sharp.decode().catch(() => {});
    prepared.set(cardImg, sharp);
  }
  return sharp;
}

function siteHeader(): HTMLElement | null {
  return document.querySelector<HTMLElement>("body header");
}

/** Every animation the transition runs on one of its pseudo-elements. */
function vtAnimation(pseudo: string): Animation[] {
  return document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.pseudoElement === pseudo);
}

type BackInfo = { list: string; product: string; slug: string; vw: number; y: number; pilot: boolean };

function zoomIn(cardImg: HTMLImageElement, card: HTMLAnchorElement, href: string, router: Router): void {
  busy = true;
  const root = document.documentElement;
  const header = siteHeader();
  const pilot = card.hasAttribute("data-zoom-pilot");
  const path = new URL(href, location.href).pathname;
  const from = drawn(cardImg);
  const aspect = from.w / from.h;
  const to = fit(aspect, guessHero(pilot));
  const cam = camera(from, to);
  try {
    sessionStorage.setItem(BACK_KEY, JSON.stringify({ list: location.pathname + location.search, product: path, slug: card.dataset.cardSlug ?? "", vw: window.innerWidth, y: window.scrollY, pilot } satisfies BackInfo));
  } catch {}

  // The stage: what the camera arrives at — the page colour with the photo standing where the product page shows it.
  // It is the new state of the transition; the product page renders under it and shows through when it is there.
  const stage = document.createElement("div");
  stage.setAttribute("aria-hidden", "true");
  Object.assign(stage.style, { position: "fixed", inset: "0", zIndex: "40", pointerEvents: "none", background: "var(--surface-0, #100e0d)" } satisfies Partial<CSSStyleDeclaration>);
  // The photo layer is the card's <img> box carried by the camera (padding and all), so the morph from the card picture
  // is one uniform scale — the same line the camera draws — and the picture inside lands exactly on `to`.
  const cs = getComputedStyle(cardImg);
  const px = (k: string) => (parseFloat(cs.getPropertyValue(k)) || 0) * cam.s;
  const photo = document.createElement("div");
  Object.assign(photo.style, { position: "absolute", boxSizing: "border-box", transformOrigin: "0 0", padding: `${px("padding-top")}px ${px("padding-right")}px ${px("padding-bottom")}px ${px("padding-left")}px` } satisfies Partial<CSSStyleDeclaration>);
  place(photo, shot(cam, boxOf(cardImg.getBoundingClientRect())));
  const inner = document.createElement("div");
  Object.assign(inner.style, { position: "relative", width: "100%", height: "100%" });
  const base = new Image();
  base.alt = "";
  base.src = cardImg.currentSrc || cardImg.src;
  const sharp = prepare(cardImg, pilot);
  for (const img of sharp ? [base, sharp] : [base]) {
    Object.assign(img.style, { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: cs.objectFit || "contain", objectPosition: cs.objectPosition });
    inner.append(img);
  }
  if (sharp && !sharp.complete) {
    sharp.style.opacity = "0";
    sharp.addEventListener("load", () => sharp.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: "forwards" }), { once: true });
  }
  photo.append(inner);
  stage.append(photo);

  let left = false;
  const onBack = () => (left = true);
  window.addEventListener("popstate", onBack);
  // Scrolling, a key or a touch once the product page is there hands it over at once (nothing left standing on top).
  let handed = false;
  const hand = () => (handed = true);
  const handOpts = { capture: true, passive: true } as const;
  const listen = (on: boolean) => {
    for (const t of ["wheel", "touchstart", "keydown"] as const) (on ? window.addEventListener : window.removeEventListener)(t, hand, handOpts);
  };

  const finish = () => {
    window.removeEventListener("popstate", onBack);
    listen(false);
    delete root.dataset.zoomVt;
    delete root.dataset.zoomDark;
    if (header) header.style.viewTransitionName = "";
    cardImg.style.viewTransitionName = "";
    photo.style.viewTransitionName = "";
    stage.remove();
    busy = false;
  };

  // Names for the two things that are not the camera: the header (stays put) and the photo (old: the card's picture,
  // new: the sharp layer on the stage).
  root.dataset.zoomVt = "in";
  if (header) header.style.viewTransitionName = HEAD;
  cardImg.style.viewTransitionName = PHOTO;
  let vt: Transition;
  try {
    vt = startVT(() => {
      cardImg.style.viewTransitionName = "";
      photo.style.viewTransitionName = PHOTO;
      root.dataset.zoomDark = "1";
      document.body.append(stage);
    });
  } catch {
    finish();
    router.push(href);
    return;
  }

  void (async () => {
    try {
      await vt.ready;
      const timing = { duration: ZOOM_MS, easing: EASE, fill: "both" } as const;
      // The camera on the list, and the stage showing in under it over the last third (the cards that are still on
      // screen at the edges sink into the page colour as they leave).
      root.animate({ transform: ["none", camCss(cam)] }, { ...timing, pseudoElement: "::view-transition-old(root)" });
      root.animate({ opacity: [0, 0, 1], offset: [0, 0.62, 1] }, { ...timing, easing: "linear", pseudoElement: "::view-transition-new(root)" });
      // The photo layer rides the same camera (globals.css sets its group's duration and easing to these).
      for (const a of vtAnimation(`::view-transition-group(${PHOTO})`)) a.effect?.updateTiming({ duration: ZOOM_MS, easing: EASE });
      // The route changes now, under the snapshot (the motion above runs off the main thread; the page render does not hold it).
      // No scroll by the router: the zoom puts the product page at its top itself, under the stage.
      router.push(href, { scroll: false });
      await vt.finished;
      if (header) header.style.viewTransitionName = "";
      photo.style.viewTransitionName = "";
      listen(true);

      // The stage stands: the photo where the product page shows it. Wait for that page.
      const t0 = performance.now();
      let found: ReturnType<typeof heroPhoto> = null;
      for (;;) {
        if (left || performance.now() - t0 > WAIT_MS) throw new Error("gave up");
        if (location.pathname === path) {
          if (!found && (found = heroPhoto())) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          if (found) break;
          if (performance.now() - t0 > 600) throw new Error("no hero");
        }
        await raf();
      }
      let hit = found;
      const target = () => fit(aspect, drawn((hit = heroPhoto() ?? hit).img));
      // The product photo still for two frames (at most ~8): its place is final.
      let at = target();
      for (let i = 0, still = 0; i < 8 && still < 2 && !handed; i++) {
        await raf();
        const next = target();
        still = Math.abs(next.x - at.x) + Math.abs(next.y - at.y) + Math.abs(next.w - at.w) < 1 ? still + 1 : 0;
        at = next;
      }
      try {
        sessionStorage.setItem(HERO_CACHE, JSON.stringify({ ...at, vw: window.innerWidth, pilot }));
      } catch {}
      // A guess that missed (a page laid out differently): one short glide of the photo onto the real one.
      if (!handed && Math.abs(at.x - to.x) + Math.abs(at.y - to.y) + Math.abs(at.w - to.w) > 2) {
        const pb = boxOf(photo.getBoundingClientRect());
        const k = at.w / to.w;
        const end: Box = { x: at.x + (pb.x - to.x) * k, y: at.y + (pb.y - to.y) * k, w: pb.w * k, h: pb.h * k };
        await photo.animate([{ transform: "none" }, { transform: toward(pb, end) }], { duration: 160, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" }).finished;
      }
      // The page's own photo ready (or 0.5 s), then the page shows round it.
      const real = hit.img;
      if (!real.complete && !handed) await Promise.race([new Promise((r) => real.addEventListener("load", r, { once: true })), new Promise((r) => setTimeout(r, 500))]);
      delete root.dataset.zoomDark;
      if (!handed) await stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: LIFT_MS, easing: "ease-out", fill: "forwards" }).finished;
      finish();
    } catch {
      // Back pressed, no product page, anything unexpected: never leave the visitor under the stage.
      vt.skipTransition();
      if (!left && location.pathname === path) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      await stage.animate([{ opacity: getComputedStyle(stage).opacity }, { opacity: 0 }], { duration: 200, fill: "forwards" }).finished.catch(() => {});
      finish();
    }
  })();
}

/**
 * Back to the list a zoom started from: the camera starts where the zoom-in ended (the card's photo on the product photo)
 * and pulls back to the list exactly as the visitor left it — the other cards glide back into place round the card.
 * Returns false when it does not apply (the plain Back then happens as before).
 */
function zoomOut(e: PopStateEvent): boolean {
  if (busy || lite()) return false;
  // A swipe-back the browser animated itself (iOS edge swipe): no second animation on top of it.
  if ((e as PopStateEvent & { hasUAVisualTransition?: boolean }).hasUAVisualTransition) return false;
  let info: BackInfo | null = null;
  try {
    info = JSON.parse(sessionStorage.getItem(BACK_KEY) ?? "null") as BackInfo | null;
  } catch {}
  if (!info || info.vw !== window.innerWidth || location.pathname + location.search !== info.list) return false;
  // Still showing the product page the zoom went to (the router has not swapped it yet) — its photo is where the camera starts.
  const hero = heroPhoto();
  if (!hero) return false;
  const heroBox = drawn(hero.img);
  const onScreen = heroBox.y + heroBox.h > 40 && heroBox.y < window.innerHeight - 40;
  busy = true;
  const root = document.documentElement;
  const header = siteHeader();
  const slug = info.slug;
  const y = info.y;
  root.dataset.zoomVt = "out";
  if (header) header.style.viewTransitionName = HEAD;
  let cam: Cam | null = null;
  const done = () => {
    delete root.dataset.zoomVt;
    if (header) header.style.viewTransitionName = "";
    busy = false;
  };
  let vt: Transition;
  try {
    vt = startVT(async () => {
      // Wait (briefly — the screen holds the product page meanwhile) for the list to be back at the visitor's place.
      const t0 = performance.now();
      let img: HTMLImageElement | null = null;
      while (performance.now() - t0 < 900) {
        img = document.querySelector<HTMLImageElement>(`a[data-card-slug="${CSS.escape(slug)}"] [data-card-photo] img`);
        if (img && location.pathname + location.search === info!.list && !heroPhoto()) {
          if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, left: 0, behavior: "instant" });
          if (Math.abs(window.scrollY - y) <= 2 && img.complete) break;
        }
        await raf();
      }
      if (!img) return;
      const p = drawn(img);
      cam = camera(p, onScreen ? fit(p.w / p.h, heroBox) : fit(p.w / p.h, guessHero(info!.pilot)));
    });
  } catch {
    done();
    return false;
  }
  void (async () => {
    try {
      await vt.ready;
      if (cam) {
        const timing = { duration: ZOOM_MS, easing: EASE, fill: "both" } as const;
        root.animate({ transform: [camCss(cam), "none"] }, { ...timing, pseudoElement: "::view-transition-new(root)" });
        // The product page dissolves into the zoomed list in the first frames (globals.css keeps it on top).
        root.animate({ opacity: [1, 0] }, { duration: 120, easing: "ease-out", fill: "both", pseudoElement: "::view-transition-old(root)" });
      }
      await vt.finished;
    } catch {}
    done();
  })();
  return true;
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
    zoomIn(img, card, href, router);
  };
  // As the finger lands: fetch the product page and decode the sharp photo, so both are usually ready by the tap.
  const onDown = (e: PointerEvent) => {
    const card = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-card-cut]");
    const href = card?.getAttribute("href");
    if (!card || !href?.startsWith("/products/")) return;
    router.prefetch(href);
    const img = card.querySelector<HTMLImageElement>("[data-card-photo] img");
    if (img) prepare(img, card.hasAttribute("data-zoom-pilot"));
  };
  // Back/Forward: instant scroll back (the site-wide smooth scrolling turned the browser's restore into a 0.6 s glide
  // down the list), and the zoom-out when it is Back to the list a zoom started from.
  let popTimer = 0;
  const onPop = (e: PopStateEvent) => {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    window.clearTimeout(popTimer);
    popTimer = window.setTimeout(() => (root.style.scrollBehavior = ""), 1200);
    zoomOut(e);
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
