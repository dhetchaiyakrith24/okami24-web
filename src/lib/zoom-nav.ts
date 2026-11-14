/**
 * The "Zoom" (owner list ก10 · his reference reel 30/10 · his rulings 13/11): tapping a product card is a CAMERA move —
 * the visitor's view travels into the card, the card never flies out to the visitor. Owner 13/11:
 *   "เมื่อกดต้องเป็นเราเองที่ Zoom ไปหาสินค้า ไม่ใช่สินค้า Zoom เข้าใกล้มาหาเรา … เมื่อกดกลับ ถอยหลังก็ใช้การ Zoom out ออกมาตำแหน่งที่เดิม"
 *   "Smooth ลื่นไหล รวดเร็ว ไม่ช้า ไม่รอเล่น Effect เยอะ แค่ให้รู้ว่า Zoom แต่ Zoom เร็ว" — about 0.35 s each way; the other
 *   cards slide off-screen with the camera on the way in and glide back into place on the way out ("ย้อนเวลา").
 *
 * How (the browser's View Transitions, same-document): on the tap the browser keeps a snapshot of the list as it stands — a
 * GPU texture, no page copy (a copied or promoted page held every frame for 0.2–0.4 s, measured 13/11; the snapshot frame
 * costs ~25 ms once the off-screen cards skip painting, see ease()) — and the camera is one transform on that snapshot:
 * the tapped card's photo grows onto the spot where the product page shows its photo, everything else around it moves out
 * of the screen in proportion, like a lens pushing in. The photo itself is a separate sharp layer locked to the same
 * camera (the same straight line, also a transform), so it never blurs or stretches. Both run off the main thread; the
 * route changes right after the snapshot; the camera holds on the card until the product page is there, and the page
 * shows round the photo as the camera lands — never a blank screen in between. Back to that list plays the same camera in reverse on the
 * list as it is restored, at the place and scroll the visitor left, starting on the product photo.
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
const LIFT_MS = 120;
/** Desktop: longest wait, on the still list, for the product page's real photo frame before the camera flies (past it the
 *  camera flies to the guess and corrects once the page is there). ~150–260 ms is a product page's render at 1×. */
const AIM_MS = 300;
/** Longest wait for the product page before giving up and simply letting it show. */
const WAIT_MS = 8000;
const HERO_CACHE = "okami-zoom-hero";
/** Where the last zoom started — Back to that list plays it in reverse. */
const BACK_KEY = "okami-zoom-back";
const PHOTO = "okami-zoom-photo";
/** Most bigger card photos fetched ahead on one page (readyAhead in attachZoom): a screenful or two, not the whole list. */
const AHEAD = 8;
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

/**
 * Where the device itself sits inside a picture, as shares of the picture (0–1): the box of its visible pixels (alpha),
 * read once per picture from a 64 px copy (same-origin /_next/image, so the canvas stays readable) and kept. Product
 * pictures are cut-outs on a transparent canvas and the device is not always in the middle of it, so aiming at the
 * picture's box sent the zoom beside the model on desktop (owner 14/11 "ไม่ได้ซูมไปตรงกลางของตัวโมเดล"). A picture that
 * cannot be read (not loaded, no alpha, a tainted canvas) counts as the whole picture.
 */
type Share = { l: number; t: number; r: number; b: number };
const WHOLE: Share = { l: 0, t: 0, r: 1, b: 1 };
const shares = new Map<string, Share>();
function deviceShare(img: HTMLImageElement): Share {
  const src = img.currentSrc || img.src;
  const hit = shares.get(src);
  if (hit) return hit;
  if (!img.complete || !img.naturalWidth) return WHOLE;
  let s = WHOLE;
  try {
    const N = 64;
    const c = document.createElement("canvas");
    c.width = N;
    c.height = N;
    const g = c.getContext("2d", { willReadFrequently: true });
    if (g) {
      g.drawImage(img, 0, 0, N, N);
      const d = g.getImageData(0, 0, N, N).data;
      let l = N, t = N, r = -1, b = -1;
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++)
          if (d[(y * N + x) * 4 + 3] > 24) {
            if (x < l) l = x;
            if (x > r) r = x;
            if (y < t) t = y;
            if (y > b) b = y;
          }
      // A picture with no transparent margin (a photo on a background) is aimed as a whole.
      if (r >= l && b >= t && (l > 0 || t > 0 || r < N - 1 || b < N - 1)) s = { l: l / N, t: t / N, r: (r + 1) / N, b: (b + 1) / N };
    }
  } catch {}
  shares.set(src, s);
  return s;
}
/** The device's box inside a picture drawn at `box`. */
const deviceIn = (box: Box, s: Share): Box => ({ x: box.x + s.l * box.w, y: box.y + s.t * box.h, w: (s.r - s.l) * box.w, h: (s.b - s.t) * box.h });
const centre = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

/** `aspect` fitted (contain) and centred in `box`. */
function fit(aspect: number, box: Box): Box {
  const w = Math.min(box.w, box.h * aspect);
  const h = w / aspect;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
}

/** The card picture (drawn at `from`, its device at `share`) laid into `frame` the way the page lays its photo (contain),
 *  then moved so the device's centre sits exactly on `aim` — the device lands in the middle of the photo frame. */
function landing(from: Box, share: Share, frame: Box, aim: { x: number; y: number }): Box {
  const b = fit(from.w / from.h, frame);
  const c = centre(deviceIn(b, share));
  return { ...b, x: b.x + aim.x - c.x, y: b.y + aim.y - c.y };
}
/** Where to aim on the product page's photo: its device's centre when its picture can be read, else the frame's centre.
 *  `cachedOnly` (Back): never reads pixels there — Back's task already holds the list's re-render (~0.3 s at 1×); the
 *  photo's share is read in idle time after the zoom-in lands (readHeroLater). */
function aimOf(img: HTMLImageElement, box: Box, cachedOnly = false): { x: number; y: number } {
  const s = cachedOnly ? shares.get(img.currentSrc || img.src) : img.complete && img.naturalWidth ? deviceShare(img) : undefined;
  return centre(s ? deviceIn(box, s) : box);
}
/** The product photo's device share, read when the browser is idle once the picture has loaded. */
function readHeroLater(img: HTMLImageElement): void {
  const read = () => idle(() => deviceShare(img));
  if (img.complete && img.naturalWidth) read();
  else img.addEventListener("load", read, { once: true });
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

/** The product page's photo once `path` is the route and the photo is laid out, polled on timers (inside a transition's
 *  update the browser pauses frames, so no rAF) for at most `ms`; null past that. */
async function heroSoon(path: string, ms: number): Promise<ReturnType<typeof heroPhoto>> {
  const t0 = performance.now();
  // Laid out AND settled: the same box on three reads in a row — the page's first render can still move its photo
  // (joiway-f3 at 1440: 16 px, ~70 ms after it first showed, checker 14/11).
  let last = "";
  let same = 0;
  let h: ReturnType<typeof heroPhoto> = null;
  for (;;) {
    if (location.pathname === path && (h = heroPhoto())) {
      const b = drawn(h.img);
      const k = `${Math.round(b.x)},${Math.round(b.y)},${Math.round(b.w)}`;
      same = k === last ? same + 1 : 0;
      last = k;
      if (same >= 2) return h;
    }
    if (performance.now() - t0 > ms) return h;
    await new Promise((r) => setTimeout(r, 16));
  }
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
  deviceShare(cardImg); // the aim, read now (64 px, ~1 ms) rather than on the tap frame
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

/**
 * The snapshot paints the whole page, not only the screen: on /products the off-screen cards made the tap frame ~70–100 ms
 * (1×) / ~450–720 ms (4× CPU). Cards that skip painting while off screen (content-visibility: auto, the browser's own) at
 * their own measured size ("auto W H": nothing moves, the scrollbar stays) bring it to ~25 / ~160–180 ms (measured 13/11).
 * Set when the browser is idle — on load, when cards are added, after a resize (attachZoom) — never on the tap: done on
 * the finger-down it held the click ~200 ms at 4× CPU (checker 13/11). The cards clip their contents already
 * (overflow-hidden), so the paint containment this brings changes nothing on screen.
 */
const CARDS = "main a[data-card-cut]";
const eased = new WeakSet<HTMLElement>();
function ease(): void {
  const cards = [...document.querySelectorAll<HTMLElement>(CARDS)].filter((c) => !eased.has(c));
  const boxes = cards.map((c) => c.getBoundingClientRect()); // all reads before any write: one layout
  cards.forEach((c, i) => {
    const b = boxes[i];
    if (!b.width || !b.height) return;
    c.style.containIntrinsicSize = `auto ${b.width}px ${b.height}px`;
    c.style.contentVisibility = "auto";
    eased.add(c);
  });
}
function unease(): void {
  for (const c of document.querySelectorAll<HTMLElement>(CARDS)) {
    if (!eased.has(c)) continue;
    c.style.contentVisibility = "";
    c.style.containIntrinsicSize = "";
    eased.delete(c);
  }
}
const idle = (f: () => void): void => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(f, { timeout: 1500 });
  else setTimeout(f, 300);
};

/** A picture layer in `cardImg`'s box carried by `cam` (its padding scaled too), drawing `src` the way the card
 *  draws its picture, with `sharp` (a bigger copy) laid over it once that has loaded. */
function photoLayer(cardImg: HTMLImageElement, cam: Cam, src: string, sharp: HTMLImageElement | null): HTMLElement {
  const cs = getComputedStyle(cardImg);
  const px = (k: string) => (parseFloat(cs.getPropertyValue(k)) || 0) * cam.s;
  const photo = document.createElement("div");
  Object.assign(photo.style, { position: "absolute", boxSizing: "border-box", transformOrigin: "0 0", padding: `${px("padding-top")}px ${px("padding-right")}px ${px("padding-bottom")}px ${px("padding-left")}px` } satisfies Partial<CSSStyleDeclaration>);
  place(photo, shot(cam, boxOf(cardImg.getBoundingClientRect())));
  const inner = document.createElement("div");
  Object.assign(inner.style, { position: "relative", width: "100%", height: "100%" });
  const base = new Image();
  base.alt = "";
  base.src = src;
  for (const img of sharp ? [base, sharp] : [base]) {
    Object.assign(img.style, { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: cs.objectFit || "contain", objectPosition: cs.objectPosition });
    inner.append(img);
  }
  if (sharp && !sharp.complete) {
    sharp.style.opacity = "0";
    sharp.addEventListener("load", () => sharp.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: "forwards" }), { once: true });
  }
  photo.append(inner);
  return photo;
}

function siteHeader(): HTMLElement | null {
  return document.querySelector<HTMLElement>("body header");
}

/**
 * Until the main thread is free: three frames in a row each within ~two refreshes (≤ 34 ms), or `cap` ms. Motion started
 * while the page is busy stalls mid-way (live 14/11 at 375 px: a 263 ms freeze in the middle of the zoom, right after the
 * route change; the owner: "กระตุก · ไม่สมูท"). Started on a quiet main thread it runs through. Each move of the Zoom
 * waits here first, standing still on the frame it starts from, and nothing heavy runs while one is moving.
 */
async function quiet(cap: number): Promise<void> {
  const t0 = performance.now();
  let last = await raf();
  for (let calm = 0; calm < 3 && performance.now() - t0 < cap; ) {
    const t = await raf();
    calm = t - last <= 34 ? calm + 1 : 0;
    last = t;
  }
}
/** Animations set up paused on their first frame, then all started together. */
const hold0 = (anims: Animation[]) => {
  for (const a of anims) a.pause();
  return () => {
    for (const a of anims) a.play();
  };
};

/** The photo's group (globals.css: no browser morph, origin 0 0) sits on its new box `to`; this carries it from the old
 *  box `from` (same aspect: one scale) — a transform only, so it runs beside the camera off the main thread. */
function morph(from: Box, to: Box, timing: KeyframeAnimationOptions): Animation {
  return document.documentElement.animate(
    { transform: [`translate(${from.x}px, ${from.y}px) scale(${from.w / to.w})`, `translate(${to.x}px, ${to.y}px)`] },
    { ...timing, pseudoElement: `::view-transition-group(${PHOTO})` },
  );
}

type BackInfo = { list: string; product: string; slug: string; vw: number; y: number; pilot: boolean };

function zoomIn(cardImg: HTMLImageElement, card: HTMLAnchorElement, href: string, router: Router): void {
  busy = true;
  const root = document.documentElement;
  const header = siteHeader();
  const pilot = card.hasAttribute("data-zoom-pilot");
  const path = new URL(href, location.href).pathname;
  const from = drawn(cardImg);
  // Aimed at the device, not the picture (owner 14/11 "ไม่ได้ซูมไปตรงกลางของตัวโมเดล"): its centre lands on the centre
  // of the product page's photo frame.
  const share = deviceShare(cardImg);
  const frame = guessHero(pilot);
  let to = landing(from, share, frame, centre(frame));
  let cam = camera(from, to);
  // Desktop: the photo frame's place depends on each product (its photo column is centred against its text), so no guess
  // from the list can be exact — the camera waits (on the still list, ≤ AIM_MS) for the product page and flies once,
  // straight onto its real photo: no correction when the page shows. Phones keep the guess (their frame does not move).
  const exact = window.innerWidth >= 1024;
  let pushed = false;
  let found: ReturnType<typeof heroPhoto> = null;
  let heroBox: Box | null = null;
  try {
    sessionStorage.setItem(BACK_KEY, JSON.stringify({ list: location.pathname + location.search, product: path, slug: card.dataset.cardSlug ?? "", vw: window.innerWidth, y: window.scrollY, pilot } satisfies BackInfo));
  } catch {}

  // The stage: the photo standing where the product page shows it — the new side of the transition. The product page
  // renders under it, and is shown round it (the new snapshot faded in) as soon as it is there.
  const stage = document.createElement("div");
  stage.setAttribute("aria-hidden", "true");
  Object.assign(stage.style, { position: "fixed", inset: "0", zIndex: "40", pointerEvents: "none" } satisfies Partial<CSSStyleDeclaration>);
  const cardBox = boxOf(cardImg.getBoundingClientRect());
  const sharp = prepare(cardImg, pilot);
  const cardSrc = cardImg.currentSrc || cardImg.src;
  let photo: HTMLElement | null = null;

  let left = false;
  const onBack = () => (left = true);
  window.addEventListener("popstate", onBack);
  // Scrolling, a key or a touch once the product page shows hands it over at once (nothing left standing on top).
  let handed = false;
  let onHand = () => {};
  const handing = new Promise<void>((r) => (onHand = r));
  const hand = () => {
    handed = true;
    onHand();
  };
  const handOpts = { capture: true, passive: true } as const;
  const listen = (on: boolean) => {
    for (const t of ["wheel", "touchstart", "pointerdown", "keydown"] as const) (on ? window.addEventListener : window.removeEventListener)(t, hand, handOpts);
  };
  // The product page's own photo stays hidden while ours stands on it (never two photos, never a double edge).
  let veiled: HTMLImageElement[] = [];
  const unveil = () => {
    for (const i of veiled) i.style.opacity = "";
    veiled = [];
  };

  const moves: Animation[] = [];
  const finish = () => {
    window.removeEventListener("popstate", onBack);
    listen(false);
    for (const a of moves) a.cancel();
    unveil();
    if (header) header.style.viewTransitionName = "";
    cardImg.style.viewTransitionName = "";
    if (photo) photo.style.viewTransitionName = "";
    stage.remove();
    busy = false;
  };

  // Names for the two things that are not the camera: the header (stays put) and the photo (old: the card's picture,
  // new: the sharp layer on the stage).
  if (header) header.style.viewTransitionName = HEAD;
  cardImg.style.viewTransitionName = PHOTO;
  let vt: Transition;
  try {
    vt = startVT(async () => {
      cardImg.style.viewTransitionName = "";
      if (exact) {
        // The list stands still as a snapshot while the product page renders under it (nothing moves, so a busy main
        // thread cannot show); its real photo frame is then known before the camera moves.
        router.push(href, { scroll: false });
        pushed = true;
        found = await heroSoon(path, AIM_MS);
        if (found) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          heroBox = drawn(found.img);
          to = landing(from, share, heroBox, aimOf(found.img, heroBox));
          cam = camera(from, to);
        }
      }
      // The photo layer: the card's <img> box carried by the camera, so the morph from the card picture is one uniform
      // scale — the same line the camera draws — and the picture inside lands exactly on `to`.
      photo = photoLayer(cardImg, cam, cardSrc, sharp);
      photo.style.viewTransitionName = PHOTO;
      stage.append(photo);
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
      const t0 = performance.now();
      const timing = { duration: ZOOM_MS, easing: EASE, fill: "both" } as const;
      // The camera on the list — it then holds, zoomed in on the card, until the product page is there (never a blank
      // screen) — the photo layer riding the same camera, and the product page held back until it is there.
      const camera = [
        root.animate({ transform: ["none", camCss(cam)] }, { ...timing, pseudoElement: "::view-transition-old(root)" }),
        morph(cardBox, shot(cam, cardBox), timing),
      ];
      moves.push(...camera);
      const hold = root.animate({ opacity: [0, 0] }, { duration: WAIT_MS, fill: "both", pseudoElement: "::view-transition-new(root)" });
      moves.push(hold);
      // The camera moves on a quiet main thread (≤ 120 ms wait) and nothing heavy runs while it moves: the route
      // changes once it has landed — the product page then renders (the main thread's longest stretch, 150–260 ms at
      // 1×) while the camera holds still on the photo, where a busy main thread cannot show.
      const go = hold0(camera);
      await quiet(120);
      go();
      await camera[0].finished;
      // No scroll by the router: the zoom puts the product page at its top itself.
      if (!pushed) router.push(href, { scroll: false });

      // The product page: its route, then its photo box (or, past 0.6 s on its route, none — then it simply shows).
      // Desktop already has it when it was there within AIM_MS.
      let routed = 0;
      while (!found) {
        if (left || performance.now() - t0 > WAIT_MS) throw new Error("gave up");
        if (location.pathname === path) {
          routed ||= performance.now();
          if ((found = heroPhoto())) break;
          if (performance.now() - routed > 600) break;
        }
        await raf();
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      // Where the product page shows its photo (the guess `to` is right once this layout landed on this width before).
      const real = found?.img ?? null;
      // The real photo frame, and the device landed on the page's own device (its centre) — so nothing shifts when the
      // page's photo takes over; the frame is kept as the next guess for this layout and width.
      // Measured again here, just before the page shows: if it still moved after the camera was aimed, the short glide
      // below carries the photo onto it (never a jump when the stage goes); unmoved = the same box, no glide.
      heroBox = found ? drawn(found.img) : null;
      const at = found && heroBox ? landing(from, share, heroBox, aimOf(found.img, heroBox)) : null;
      if (found && heroBox) {
        readHeroLater(found.img); // for Back's aim, off its busy task
        veiled = [...found.hero.querySelectorAll("img")];
        for (const i of veiled) i.style.opacity = "0";
        try {
          sessionStorage.setItem(HERO_CACHE, JSON.stringify({ ...heroBox, vw: window.innerWidth, pilot }));
        } catch {}
        // For the aim checks (nothing on screen): where the camera put the device, the photo frame's centre and the
        // page's own device centre.
        performance.mark("okami-zoom-land", { detail: { camera: centre(deviceIn(to, share)), frame: centre(heroBox), device: aimOf(found.img, heroBox), final: at && centre(deviceIn(at, share)) } });
      }
      // The page shows round the photo once its render has let go of the main thread (≤ 0.4 s), so the fade runs smooth.
      await quiet(400);
      hold.cancel();
      moves.push(root.animate({ opacity: [0, 1] }, { duration: LIFT_MS, easing: "ease-out", fill: "both", pseudoElement: "::view-transition-new(root)" }));
      listen(true);
      // A guess that missed (a layout not seen yet on this width): the photo glides onto the real one, inside the
      // transition — added on top of its camera move (composite "add": the morph ends untransformed on its own box `pb`).
      const pb = shot(cam, cardBox);
      let end: Box | null = null;
      if (at && Math.abs(at.x - to.x) + Math.abs(at.y - to.y) + Math.abs(at.w - to.w) > 2) {
        const k = at.w / to.w;
        end = { x: at.x + (pb.x - to.x) * k, y: at.y + (pb.y - to.y) * k, w: pb.w * k, h: pb.h * k };
        moves.push(
          root.animate(
            { transform: ["translate(0px, 0px) scale(1)", `translate(${end.x - pb.x}px, ${end.y - pb.y}px) scale(${k})`] },
            { duration: LIFT_MS + 40, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "both", composite: "add", pseudoElement: `::view-transition-group(${PHOTO})` },
          ),
        );
      }
      // The page's own photo already there (or no photo box at all): it takes over inside the transition — ours fades
      // as the page shows, and nothing of the zoom stands after it.
      const inside = !real || (real.complete && real.naturalWidth > 0);
      if (inside) {
        unveil();
        moves.push(root.animate({ opacity: [1, 0] }, { duration: LIFT_MS, easing: "ease-out", fill: "both", pseudoElement: `::view-transition-image-pair(${PHOTO})` }));
      }
      await vt.finished;
      for (const a of moves) a.cancel();
      moves.length = 0;
      if (header) header.style.viewTransitionName = "";
      const layer = photo as HTMLElement | null; // set in the transition's update, before `ready`
      if (layer) layer.style.viewTransitionName = "";
      if (inside || handed || !layer) return finish();

      // Otherwise ours stands on it until it has loaded (≤ 0.15 s), then hands over.
      const guard = window.setTimeout(hand, 1500);
      if (end) Object.assign(layer.style, { transformOrigin: "0 0", transform: toward(pb, end) });
      if (real && !real.complete) await Promise.race([new Promise((r) => real.addEventListener("load", r, { once: true })), new Promise((r) => setTimeout(r, 150)), handing]);
      unveil();
      if (!handed) await Promise.race([layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "ease-out", fill: "forwards" }).finished, handing]);
      window.clearTimeout(guard);
      finish();
    } catch {
      // Back pressed, no product page, anything unexpected: never leave the visitor under the zoom.
      vt.skipTransition();
      for (const a of moves) a.cancel();
      unveil();
      if (!left && location.pathname === path) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      await stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).finished.catch(() => {});
      finish();
    }
  })();
}

/** Back to a list: the product photo as it stood, measured before the router swaps the page (capture-phase popstate). */
type Leaving = { src: string; box: Box; aim: { x: number; y: number }; fit: string; position: string } | null;

/**
 * Back to the list a zoom started from: the camera starts where the zoom-in ended — the card's photo standing on the
 * product photo — and pulls back to the list exactly as the visitor left it; the other cards glide back into place round
 * the card ("ย้อนเวลา"). Runs after the router has put the list back (it does so inside its own popstate handler): the
 * list's snapshot is taken as it stands, then shown through the reversed camera. Returns false when it does not apply
 * (the plain Back then happens as before).
 */
function zoomOut(e: PopStateEvent, leaving: Leaving): boolean {
  if (busy || lite()) return false;
  // A swipe-back the browser animated itself (iOS edge swipe): no second animation on top of it.
  if ((e as PopStateEvent & { hasUAVisualTransition?: boolean }).hasUAVisualTransition) return false;
  let info: BackInfo | null = null;
  try {
    info = JSON.parse(sessionStorage.getItem(BACK_KEY) ?? "null") as BackInfo | null;
  } catch {}
  if (!info || info.vw !== window.innerWidth || location.pathname + location.search !== info.list) return false;
  const img = document.querySelector<HTMLImageElement>(`a[data-card-slug="${CSS.escape(info.slug)}"] [data-card-photo] img`);
  if (!img) return false;
  busy = true;
  const root = document.documentElement;
  const header = siteHeader();
  // The list back at the visitor's place before anything is measured, and its cards made cheap to snapshot (this list was
  // just rendered again). The browser's own scroll restore comes after this listener and moved a deep list 12–15 px
  // mid-pull-back (Coil-1, 13/11): off for this one Back (the current entry's mode), on again when the zoom-out ends.
  const y = info.y;
  history.scrollRestoration = "manual";
  if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, left: 0, behavior: "instant" });
  ease();
  const p = drawn(img);
  const cardBox = boxOf(img.getBoundingClientRect());
  const onScreen = !!leaving && leaving.box.y + leaving.box.h > 40 && leaving.box.y < window.innerHeight - 40;
  // The mirror of the zoom-in's aim: the card's device starts on the product photo's device.
  const frame = onScreen ? leaving!.box : guessHero(info.pilot);
  const cam = camera(p, landing(p, deviceShare(img), frame, onScreen ? leaving!.aim : centre(frame)));
  // The frame the snapshot is taken in shows the list already through the camera (zoomed in on the card), not the list as
  // it stands for a frame and not a blank: the pull-back starts the moment the product page goes. The camera goes on
  // <main>'s children with <main> clipped sideways: on a phone, anything reaching past the right edge widens the page and
  // the browser cancels the transition ("Viewport size changed", measured 13/11 — moving down or scaling down does not).
  const main = document.querySelector<HTMLElement>("main");
  const parts = main ? [...main.children].filter((k): k is HTMLElement => k instanceof HTMLElement) : [];
  const partBoxes = parts.map((k) => k.getBoundingClientRect());
  if (main) main.style.overflowX = "clip";
  parts.forEach((k, i) => Object.assign(k.style, { transformOrigin: `${-partBoxes[i].left}px ${-partBoxes[i].top}px`, transform: camCss(cam) }));
  // The product photo, standing where it stood, in the card photo's box carried by the camera (the mirror of the
  // zoom-in's photo layer): the old side of the photo's morph, so the pull-back starts on the sharp product photo.
  const ghost = onScreen ? photoLayer(img, cam, leaving!.src, null) : null;
  if (ghost) {
    for (const i of ghost.querySelectorAll("img")) Object.assign(i.style, { objectFit: leaving!.fit, objectPosition: leaving!.position });
    Object.assign(ghost.style, { position: "fixed", zIndex: "40", pointerEvents: "none" });
    ghost.setAttribute("aria-hidden", "true");
    ghost.style.viewTransitionName = PHOTO;
    document.body.append(ghost);
  }
  if (header) header.style.viewTransitionName = HEAD;
  const moves: Animation[] = [];
  const unzoom = () => {
    for (const k of parts) Object.assign(k.style, { transformOrigin: "", transform: "" });
    if (main) main.style.overflowX = "";
  };
  const done = () => {
    for (const a of moves) a.cancel();
    unzoom();
    ghost?.remove();
    img.style.viewTransitionName = "";
    if (header) header.style.viewTransitionName = "";
    history.scrollRestoration = "auto";
    busy = false;
  };
  let vt: Transition;
  try {
    vt = startVT(() => {
      unzoom();
      if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, left: 0, behavior: "instant" });
      ghost?.remove();
      if (ghost) img.style.viewTransitionName = PHOTO;
    });
  } catch {
    done();
    return false;
  }
  void (async () => {
    try {
      await vt.ready;
      const timing = { duration: ZOOM_MS, easing: EASE, fill: "both" } as const;
      // The list pulls back from the same zoom the snapshot shows (the old snapshot under it is that same picture).
      moves.push(root.animate({ transform: [camCss(cam), "none"] }, { ...timing, pseudoElement: "::view-transition-new(root)" }));
      if (ghost) {
        moves.push(morph(shot(cam, cardBox), cardBox, timing));
        // Sharp product photo first, the card's own picture by the time it is card-sized again.
        moves.push(root.animate({ opacity: [0, 1] }, { duration: ZOOM_MS * 0.7, delay: ZOOM_MS * 0.1, easing: "linear", fill: "both", pseudoElement: `::view-transition-new(${PHOTO})` }));
      }
      // The list has just been rendered again; its after-work (effects, pictures) would stall the pull-back mid-way
      // (a 133–149 ms gap at 1×, measured 14/11). It stands on its zoomed first frame until the main thread is quiet
      // (≤ 300 ms), then pulls back in one go.
      const go = hold0(moves);
      await quiet(300);
      go();
      await vt.finished;
    } catch {}
    done();
  })();
  return true;
}

/** The engine as ZoomNav.tsx holds it: `zoom(card)` = zoom into that card now if the Zoom applies (true), else false
 *  (the caller then navigates plainly); `detach` = take every listener off; `afterRouter` = once the router is up,
 *  put the zoom-out's popstate listener behind the router's own again. */
export type ZoomEngine = { zoom: (card: HTMLAnchorElement) => boolean; detach: () => void; afterRouter: () => void };

/** Picture to zoom from, when this card zooms at all (the same checks for a click and for a held first tap). */
function zoomable(card: HTMLAnchorElement): { img: HTMLImageElement; href: string } | null {
  if (busy || lite() || QUIET.test(location.pathname)) return null;
  const href = card.getAttribute("href");
  const img = card.querySelector<HTMLImageElement>("[data-card-photo] img");
  if (!href?.startsWith("/products/") || new URL(href, location.href).pathname === location.pathname) return null;
  if (!img || !img.complete || img.naturalWidth === 0) return null;
  return { img, href };
}

/** Capture-phase click on `a[data-card-cut]` (every product card): zoom instead of the Link's own navigation. */
export function attachZoom(router: Router): ZoomEngine {
  const zoom = (card: HTMLAnchorElement): boolean => {
    const z = zoomable(card);
    if (!z) return false;
    zoomIn(z.img, card, z.href, router);
    return true;
  };
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = e.target as Element | null;
    const card = target?.closest<HTMLAnchorElement>("a[data-card-cut]");
    if (!card || target?.closest("button")) return;
    const z = zoomable(card);
    if (!z) return;
    e.preventDefault(); // the Link sees defaultPrevented and stands down; the zoom navigates itself
    zoomIn(z.img, card, z.href, router);
  };
  // As the finger lands: fetch the product page and decode the sharp photo, so both are usually ready by the tap.
  // A mouse rests on the card a moment before the click: the same, from the pointer coming onto the card (once per card),
  // so on desktop the product page is usually there inside AIM_MS and the camera flies straight onto its photo.
  const readied = new WeakSet<HTMLAnchorElement>();
  const onDown = (e: PointerEvent) => {
    const card = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-card-cut]");
    const href = card?.getAttribute("href");
    if (!card || !href?.startsWith("/products/")) return;
    if (e.type === "pointerover" && (e.pointerType !== "mouse" || readied.has(card) || busy)) return;
    readied.add(card);
    router.prefetch(href);
    const img = card.querySelector<HTMLImageElement>("[data-card-photo] img");
    if (img) prepare(img, card.hasAttribute("data-zoom-pilot"));
  };
  // The bigger photos of the cards in view, fetched and decoded ahead when the list stands still (idle, at most
  // AHEAD per page): the zoom's sharp layer is then ready on the first tap too (owner 13/11 23:33: "หรือว่ามันเป็นเพราะว่า
  // ต้องโหลดรูปภาพก่อน"). The card pictures themselves are already on screen.
  let ahead = 0;
  let aheadPath = location.pathname;
  let aheadTimer = 0;
  const readyAhead = () => {
    if (location.pathname !== aheadPath) {
      aheadPath = location.pathname;
      ahead = 0;
    }
    if (busy) return void (aheadTimer = window.setTimeout(() => idle(readyAhead), 400));
    if (ahead >= AHEAD || QUIET.test(location.pathname) || lite()) return;
    const h = window.innerHeight;
    for (const card of document.querySelectorAll<HTMLAnchorElement>(CARDS)) {
      if (ahead >= AHEAD) break;
      const img = card.querySelector<HTMLImageElement>("[data-card-photo] img");
      if (!img || !img.complete || prepared.has(img)) continue;
      const r = card.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h || r.width === 0) continue;
      prepare(img, card.hasAttribute("data-zoom-pilot"));
      ahead++;
    }
  };
  const onScrollStill = () => {
    window.clearTimeout(aheadTimer);
    aheadTimer = window.setTimeout(() => idle(readyAhead), 250);
  };
  idle(readyAhead);
  window.addEventListener("scroll", onScrollStill, { passive: true });
  // The cards made cheap to snapshot, in idle time: now, whenever cards are added, and after a resize (sizes change).
  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    idle(() => {
      queued = false;
      // Never while a zoom runs (its moves must have the main thread to themselves): again after it.
      if (busy) return void window.setTimeout(queue, 400);
      if (!QUIET.test(location.pathname)) ease();
    });
  };
  queue();
  const watch = new MutationObserver(queue);
  watch.observe(document.body, { childList: true, subtree: true });
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      unease();
      queue();
    }, 300);
  };
  window.addEventListener("resize", onResize, { passive: true });
  // Back/Forward: instant scroll back (the site-wide smooth scrolling turned the browser's restore into a 0.6 s glide
  // down the list), and the zoom-out when it is Back to the list a zoom started from.
  let popTimer = 0;
  let leaving: Leaving = null;
  const measure = () => {
    const hero = heroPhoto();
    if (!hero) return;
    const cs = getComputedStyle(hero.img);
    const box = drawn(hero.img);
    leaving = { src: hero.img.currentSrc || hero.img.src, box, aim: aimOf(hero.img, box, true), fit: cs.objectFit || "contain", position: cs.objectPosition };
  };
  // Back/Forward: the Navigation API's "navigate" comes before the router swaps the page (popstate comes after, measured
  // 13/11); without that API the zoom-out runs without the product photo.
  type Nav = EventTarget & { addEventListener: (t: "navigate", f: (e: Event & { navigationType?: string }) => void) => void };
  const nav = (window as Window & { navigation?: Nav }).navigation;
  const onNavigate = (e: Event & { navigationType?: string }) => {
    if (e.navigationType === "traverse") measure();
  };
  const onPopEarly = () => {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    window.clearTimeout(popTimer);
    popTimer = window.setTimeout(() => (root.style.scrollBehavior = ""), 1200);
    measure();
  };
  // This file loads after the page is up, so this listener comes after the router's own: the list is back by now.
  const onPop = (e: PopStateEvent) => {
    zoomOut(e, leaving);
    leaving = null;
  };
  document.addEventListener("pointerdown", onDown, { capture: true, passive: true });
  document.addEventListener("pointerover", onDown, { capture: true, passive: true });
  document.addEventListener("click", onClick, true);
  nav?.addEventListener("navigate", onNavigate);
  window.addEventListener("popstate", onPopEarly, true);
  window.addEventListener("popstate", onPop);
  const detach = () => {
    window.removeEventListener("scroll", onScrollStill);
    window.clearTimeout(aheadTimer);
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("pointerover", onDown, true);
    watch.disconnect();
    window.removeEventListener("resize", onResize);
    window.clearTimeout(resizeTimer);
    unease();
    document.removeEventListener("click", onClick, true);
    nav?.removeEventListener("navigate", onNavigate as EventListener);
    window.removeEventListener("popstate", onPopEarly, true);
    window.removeEventListener("popstate", onPop);
    window.clearTimeout(popTimer);
    document.documentElement.style.scrollBehavior = "";
  };
  // The zoom-out must run after the router's own popstate handler (that one puts the list back). Attached before
  // hydration, the engine registered first and Back lost its zoom-out (13/11); ZoomNav calls this once the router has
  // registered its handler, and the listener goes to the back of the line again.
  const afterRouter = () => {
    window.removeEventListener("popstate", onPop);
    window.addEventListener("popstate", onPop);
  };
  return { zoom, detach, afterRouter };
}
