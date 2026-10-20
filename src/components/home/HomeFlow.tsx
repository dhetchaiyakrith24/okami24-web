"use client";

import { useEffect, useRef } from "react";
import { mainThreadDriver, type RibbonDriver } from "@/lib/hero-ribbons";
import { workerDriver } from "./ribbon-driver";
import { FLOW_DRAW_ON_SCROLL, FLOW_GLOW_ON_SCROLL } from "@/data/home-hero";

/**
 * The hero's light carried down the whole homepage (round "หน้าแรก hero"; owner 20/10 ~05:00, from
 * his reference: thick and soft like the hero's ribbons, smooth, passing BEHIND the boxes — which
 * blur it, so the eye stays on the box — and brightness that swells and dims along it).
 *
 * The same ribbon engine as the hero, in "flow" mode: the ribbons follow a route laid on the PAGE
 * (routeOf — owner ~05:20: it scrolls with the boxes, never sways), starting on the left where the
 * hero's light leaves. They are drawn on TILES: three screen-tall canvases that sit on the page in a
 * layer BEHIND every section of the wrapper (`.okh-flow` in page.tsx) and are moved ahead of the
 * visitor as the page scrolls (place) — so the browser itself scrolls the light with the boxes (owner
 * 20/10: "jerky on the phone" — the earlier screen-fixed canvas, redrawn for each scroll position,
 * trailed the page by a frame or two). The sections are see-through there, their boxes are frosted
 * glass (globals.css) so the light shows through them blurred — on phones the ribbon itself turns to a
 * soft glow inside the boxes instead of a backdrop blur (boxRects) — and behind text without a box the
 * ribbon fades to a soft glow (textBlocks — checker #639: no sharp line through a word).
 *
 * Like the hero: it starts after load + idle, runs in a worker when the browser can, stops when the
 * flow area is off screen or the tab is hidden; reduced motion / Save-Data draw one still frame per tile.
 */
/** text that sits on the page without a box of its own — the ribbon fades to a glow behind it */
const TEXT = "h2, h3, p, a, button, .label-mono";
/** a frosted box (globals.css .okh-flow) — text inside one is already over a blurred ribbon */
const BOX = ".bg-surface-0, .bg-surface-1";
const PAD = 14;
/** canvases moved down the page as it scrolls: the two the screen can overlap + one placed ahead */
const TILES = 3;

/**
 * The text blocks the ribbon must not cross sharply (checker #639: a thin bright line through the
 * headings, ledes and the text buttons): every heading/text/link outside a frosted box, padded and
 * merged with its neighbours into blocks, as x, y, w, h from the top of the flow area. The brand
 * strip (first child) is skipped — it is blurred as a whole.
 */
function textBlocks(wrap: HTMLElement, wr: DOMRect): number[] {
  const rects: { x: number; y: number; w: number; h: number }[] = [];
  Array.from(wrap.children).forEach((section) => {
    if (section.tagName !== "SECTION") return;
    section.querySelectorAll<HTMLElement>(TEXT).forEach((el) => {
      const box = el.closest(BOX);
      if (box && box !== section) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      rects.push({ x: r.left - wr.left - PAD, y: r.top - wr.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 });
    });
  });
  const touch = (a: (typeof rects)[number], b: (typeof rects)[number]) =>
    a.x <= b.x + b.w && b.x <= a.x + a.w && a.y <= b.y + b.h && b.y <= a.y + a.h;
  let blocks = rects;
  for (let merged = true; merged; ) {
    merged = false;
    const out: typeof rects = [];
    for (const r of blocks) {
      const hit = out.find((o) => touch(o, r));
      if (!hit) {
        out.push({ ...r });
        continue;
      }
      const x = Math.min(hit.x, r.x);
      const y = Math.min(hit.y, r.y);
      hit.w = Math.max(hit.x + hit.w, r.x + r.w) - x;
      hit.h = Math.max(hit.y + hit.h, r.y + r.h) - y;
      hit.x = x;
      hit.y = y;
      merged = true;
    }
    blocks = out;
  }
  return blocks.flatMap((b) => [b.x, b.y, b.w, b.h]);
}

/**
 * Phones: the frosted boxes (globals.css: the brand strip + the outermost box inside each section), as
 * x, y, w, h from the top of the flow area — the ribbon turns to a soft glow inside them.
 */
function boxRects(wrap: HTMLElement, wr: DOMRect): number[] {
  const out: number[] = [];
  Array.from(wrap.children).forEach((el) => {
    const boxes = el.tagName === "NAV" ? [el] : el.tagName === "SECTION" ? Array.from(el.querySelectorAll(BOX)) : [];
    boxes.forEach((b) => {
      const outer = b.parentElement?.closest(BOX);
      if (b !== el && outer && outer !== el && el.contains(outer)) return;
      const r = b.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.right < wr.left || r.left > wr.right) return;
      out.push(r.left - wr.left, r.top - wr.top, r.width, r.height);
    });
  });
  return out;
}

/**
 * The ribbon's route down the page (owner 20/10 ~05:20: "like an S, but not quite — it curves
 * through the gaps, runs close along the boxes, passes behind them; every box has its own spot; it
 * must not sway when the page scrolls"). Points are laid on the PAGE, from the sections themselves:
 * in from the left edge where the hero's light leaves, then down one side of each section, hugging
 * the edge of its boxes, crossing to the other side through the gap after it — a loose S. Tall
 * sections get one point a little further in, so the ribbon dips behind their boxes. x, y pairs
 * from the top of the flow area.
 */
function routeOf(wrap: HTMLElement, wr: DOMRect): number[] {
  const w = wrap.clientWidth;
  const probe = wrap.querySelector<HTMLElement>(".mx-auto");
  const contentLeft = probe ? probe.getBoundingClientRect().left - wr.left + parseFloat(getComputedStyle(probe).paddingLeft) : 20;
  const gx = Math.max(8, Math.min(contentLeft * 0.55, 64));
  const left = gx;
  const right = w - gx;
  const pts: number[] = [-60, 0];
  let side = left;
  let i = 0;
  Array.from(wrap.children).forEach((el) => {
    if (el.tagName !== "SECTION") return;
    const r = el.getBoundingClientRect();
    const top = r.top - wr.top;
    const h = r.height;
    const inward = side === left ? 1 : -1;
    pts.push(side, top + h * 0.3);
    if (h > 700) pts.push(side + inward * w * 0.1, top + h * 0.68);
    // through the gap after this section, a little off centre, to the other side
    pts.push(w * (0.5 + (i % 2 ? 0.14 : -0.12)), r.bottom - wr.top);
    side = side === left ? right : left;
    i++;
  });
  pts.push(side, wrap.scrollHeight + 200);
  return pts;
}

export function HomeFlow() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = stage?.parentElement;
    if (!stage || !wrap) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";

    // fresh canvases per mount: an OffscreenCanvas transfer can happen only once per element
    const canvases = Array.from({ length: TILES }, () => {
      const c = document.createElement("canvas");
      c.className = "okh-flow-canvas";
      stage.append(c);
      return c;
    });
    // one large-viewport height (100lvh): stays put while a phone's address bar slides in and out
    const probe = document.createElement("div");
    probe.className = "okh-flow-probe";
    stage.append(probe);

    let ribbons: RibbonDriver | null = null;
    let visible = false;
    let disposed = false;
    let top = 0;
    let tileH = 0;
    let lastY = 0;
    let raf = 0;
    /** which tile each canvas shows (-1 = parked above the area, not drawn) */
    const tileOf = canvases.map(() => -1);
    const run = () => ribbons?.run(visible && !document.hidden, still);

    // the tile the screen starts in and the next one, plus one more in the direction of travel; a canvas
    // is only ever moved while off screen, so the light never jumps
    const place = (force = false) => {
      if (!ribbons || !tileH) return;
      const y = window.scrollY - top;
      const last = Math.max(0, Math.ceil(wrap.scrollHeight / tileH) - 1);
      const k = Math.min(last, Math.max(0, Math.floor(y / tileH)));
      const want = [k, k + 1, y >= lastY ? k + 2 : k - 1].filter((t, i, all) => t >= 0 && t <= last && all.indexOf(t) === i);
      lastY = y;
      const kept = new Set<number>();
      const free: number[] = [];
      tileOf.forEach((t, i) => {
        if (want.includes(t) && !kept.has(t)) kept.add(t);
        else free.push(i);
      });
      let changed = force;
      for (const t of want) {
        if (kept.has(t)) continue;
        const i = free.shift();
        if (i === undefined) break;
        tileOf[i] = t;
        kept.add(t);
        changed = true;
      }
      // a canvas left over (the ends of the area) parks above it, so no two canvases ever overlap
      for (const i of free) {
        if (tileOf[i] !== -1) {
          tileOf[i] = -1;
          changed = true;
        }
      }
      if (!changed) return;
      const tops = tileOf.map((t) => (t < 0 ? -2 * tileH : t * tileH));
      canvases.forEach((c, i) => (c.style.transform = `translate3d(0, ${tops[i]}px, 0)`));
      ribbons.tiles(tops);
      if (still) run();
    };
    const sync = () => {
      if (!ribbons) return;
      const phone = window.innerWidth < 1024;
      tileH = Math.round(probe.getBoundingClientRect().height) || window.innerHeight;
      canvases.forEach((c) => (c.style.height = `${tileH}px`));
      // phones: 1.25 device px per CSS px — the flow light is soft and sits behind boxes (the hero keeps 1.5)
      ribbons.size(stage.clientWidth, tileH, Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 2), phone);
      const wr = wrap.getBoundingClientRect();
      top = wr.top + window.scrollY;
      ribbons.holes(textBlocks(wrap, wr), wrap.scrollHeight, routeOf(wrap, wr), phone ? boxRects(wrap, wr) : []);
      ribbons.scroll(window.scrollY - top);
      place(true);
    };
    const onScroll = () => {
      if (!ribbons) return;
      ribbons.scroll(window.scrollY - top);
      place();
    };
    // a product rail swiped sideways moves its boxes: measure again, once per frame
    const onInnerScroll = (e: Event) => {
      if (e.target === document || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };

    const begin = () => {
      if (disposed) return;
      const viaWorker = workerDriver(
        canvases,
        () => {
          if (!disposed) canvases.forEach((c) => (c.dataset.on = "1"));
        },
        "flow",
      );
      ribbons = viaWorker ?? mainThreadDriver(canvases, "flow");
      if (!ribbons) return;
      if (!viaWorker) canvases.forEach((c) => (c.dataset.on = "1"));
      // reduced motion / Save-Data: the whole line, still (no laying, no glow)
      ribbons.style(FLOW_DRAW_ON_SCROLL && !still, FLOW_GLOW_ON_SCROLL && !still);
      sync();
      run();
      window.addEventListener("scroll", onScroll, { passive: true });
      wrap.addEventListener("scroll", onInnerScroll, { passive: true, capture: true });
    };
    const idle = () =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(begin, { timeout: 2000 }) : setTimeout(begin, 400);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    const ro = new ResizeObserver(() => {
      sync();
      run();
    });
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(wrap);
    document.addEventListener("visibilitychange", run);
    return () => {
      disposed = true;
      window.removeEventListener("load", idle);
      window.removeEventListener("scroll", onScroll);
      wrap.removeEventListener("scroll", onInnerScroll, { capture: true });
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
      ribbons?.destroy();
      canvases.forEach((c) => c.remove());
      probe.remove();
    };
  }, []);

  return <div ref={stageRef} className="okh-flow-stage" aria-hidden />;
}
