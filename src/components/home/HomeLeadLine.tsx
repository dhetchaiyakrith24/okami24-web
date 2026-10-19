"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's ribbons carried down the homepage as one thin orange-red line (round "หน้าแรก hero",
 * owner 20/10: "strong in the hero, then thin lines leading the eye through each section, never
 * over products"; owner 20/10 ~03:40 + 04:30: smooth and flowing like his reference, passing BEHIND
 * the boxes with depth, and it must pick up where the hero's light leaves — top left, not right).
 *
 * The line enters from the left edge just above this wrapper (where the hero's ribbons run off the
 * screen), then sweeps in one smooth curve from side to side, touching the side gutter in the middle
 * of each section. Wherever it crosses a section it goes BEHIND that section's content: every
 * heading, text, link, card, image and button is cut out of an SVG mask, so the line is only seen
 * in the gaps between boxes — never over a product or a word. Two fainter strands twist around the
 * main one (a small ribbon), which is what gives it depth. It draws itself as the visitor scrolls,
 * with a small glowing head; the piece that joins the hero is always drawn.
 *
 * It lives inside a `relative` wrapper around the sections below the hero (page.tsx) and measures
 * that wrapper's children. Everything is re-measured on resize; scrolling only moves dash offsets.
 * Reduced motion / Save-Data: the whole line, drawn, still.
 */
const BOX = "a, button, img, svg, h2, h3, p, li, input, [data-lead-box]";
const PAD = 10;
/** how far above the wrapper the line starts (inside the hero's bottom, at its left edge) */
const ENTRY = 170;
/** the two twisting strands: offset from the main line (px) and wavelength along it (px) */
const TWIST = { amp: 9, wave: 520 };

type Rect = { x: number; y: number; w: number; h: number };

/** smooth curve through the points (Catmull-Rom as cubic Béziers) */
function spline(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function HomeLeadLine() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const wrap = svg?.parentElement;
    if (!svg || !wrap) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";
    const main = svg.querySelector<SVGPathElement>("path[data-main]")!;
    const glow = svg.querySelector<SVGPathElement>("path[data-glow]")!;
    const strands = Array.from(svg.querySelectorAll<SVGPathElement>("path[data-strand]"));
    const head = svg.querySelector<SVGGElement>("g[data-head]");
    const holes = svg.querySelector<SVGGElement>("g[data-holes]")!;
    const maskBase = svg.querySelector<SVGRectElement>("rect[data-base]")!;
    const mask = svg.querySelector<SVGMaskElement>("mask")!;

    let len = 0;
    let strandLens: number[] = [];
    let top = 0;
    let minY = 0;
    // length along the main line at which it first reaches each y (sampled), for scroll → length
    let byY: { y: number; l: number }[] = [];

    const lengthAtY = (y: number) => {
      if (!byY.length) return 0;
      if (y <= byY[0].y) return byY[0].l;
      let lo = 0;
      let hi = byY.length - 1;
      if (y >= byY[hi].y) return len;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (byY[mid].y <= y) lo = mid;
        else hi = mid;
      }
      const a = byY[lo];
      const b = byY[hi];
      return a.l + ((b.l - a.l) * (y - a.y)) / Math.max(1, b.y - a.y);
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      if (!len) return;
      const y = still ? Infinity : Math.max(minY, window.scrollY + window.innerHeight * 0.8 - top);
      const l = still ? len : lengthAtY(y);
      const f = l / len;
      main.style.strokeDashoffset = `${len - l}`;
      glow.style.strokeDashoffset = `${len - l}`;
      strands.forEach((s, i) => {
        s.style.strokeDashoffset = `${strandLens[i] * (1 - f)}`;
      });
      if (head) {
        const pt = main.getPointAtLength(l);
        head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        head.style.opacity = !still && f > 0.002 && f < 0.998 ? "1" : "0";
      }
    };

    const build = () => {
      // measured without the line itself: an absolute child this tall would count in scrollHeight
      svg.style.height = "0px";
      const w = wrap.clientWidth;
      const wr = wrap.getBoundingClientRect();
      top = wr.top + window.scrollY;
      const height = wrap.scrollHeight;
      svg.setAttribute("viewBox", `0 ${-ENTRY} ${w} ${height + ENTRY}`);
      svg.style.top = `${-ENTRY}px`;
      svg.style.height = `${height + ENTRY}px`;
      maskBase.setAttribute("y", `${-ENTRY}`);
      maskBase.setAttribute("width", `${w}`);
      maskBase.setAttribute("height", `${height + ENTRY}`);
      mask.setAttribute("y", `${-ENTRY}`);
      mask.setAttribute("width", `${w}`);
      mask.setAttribute("height", `${height + ENTRY}`);

      // gutter = the space left of the page's content column, read from the first section's container
      const probe = wrap.querySelector<HTMLElement>(".mx-auto");
      const contentLeft = probe ? probe.getBoundingClientRect().left - wr.left + parseFloat(getComputedStyle(probe).paddingLeft) : 20;
      const gx = Math.max(7, Math.min(contentLeft / 2, 64));
      const left = gx;
      const right = w - gx;

      const kids = Array.from(wrap.children).filter((el) => el !== svg) as HTMLElement[];

      // the holes: every box the line passes behind (a box inside another box is skipped)
      const boxes: Rect[] = [];
      kids.forEach((kid, i) => {
        // the thin brand strip is one box: the line goes behind the whole strip
        if (i === 0 && kid.offsetHeight < 160) {
          const r = kid.getBoundingClientRect();
          boxes.push({ x: 0, y: r.top - wr.top, w, h: r.height });
          return;
        }
        kid.querySelectorAll<Element>(BOX).forEach((n) => {
          if (n.closest("[data-lead-skip]")) return;
          const r = n.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return;
          boxes.push({ x: r.left - wr.left - PAD, y: r.top - wr.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 });
        });
      });
      // boxes that touch once padded become one block: the line disappears behind a whole list or
      // text column instead of showing as slivers between its rows
      const touch = (a: Rect, b: Rect) => a.x <= b.x + b.w && b.x <= a.x + a.w && a.y <= b.y + b.h && b.y <= a.y + a.h;
      let kept = boxes;
      for (let merged = true; merged; ) {
        merged = false;
        const out: Rect[] = [];
        for (const r of kept) {
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
        kept = out;
      }
      holes.replaceChildren(
        ...kept.map((b) => {
          const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          r.setAttribute("x", `${b.x}`);
          r.setAttribute("y", `${b.y}`);
          r.setAttribute("width", `${b.w}`);
          r.setAttribute("height", `${b.h}`);
          r.setAttribute("rx", "14");
          return r;
        }),
      );

      // the route: in from the hero's left edge, down the left gutter past the brand strip, then one
      // point per section on alternating gutters (the curve between two of them crosses behind content)
      const first = kids[0];
      const y0 = first && first.offsetHeight < 160 ? first.getBoundingClientRect().bottom - wr.top : 0;
      const pts: [number, number][] = [
        [-30, -ENTRY],
        [left, y0 + 40],
      ];
      let side = right;
      kids.forEach((kid, i) => {
        if (i === 0 && y0) return;
        const r = kid.getBoundingClientRect();
        const mid = r.top - wr.top + r.height / 2;
        if (mid - pts[pts.length - 1][1] < 140) return;
        pts.push([side, mid]);
        side = side === right ? left : right;
      });
      const lastX = pts[pts.length - 1][0];
      pts.push([lastX, height]);
      const d = spline(pts);
      main.setAttribute("d", d);
      glow.setAttribute("d", d);
      len = main.getTotalLength();

      // the strands: points along the main line pushed sideways along its normal by a slow sine
      const step = 10;
      byY = [];
      const strandPts: string[][] = strands.map(() => []);
      let lastY = -Infinity;
      for (let l = 0; l <= len; l += step) {
        const p = main.getPointAtLength(l);
        const q = main.getPointAtLength(Math.min(len, l + 1));
        let nx = -(q.y - p.y);
        let ny = q.x - p.x;
        const nl = Math.hypot(nx, ny) || 1;
        nx /= nl;
        ny /= nl;
        // twist fades in after the entry so the join with the hero stays a single line
        const amp = TWIST.amp * Math.min(1, l / 300);
        strands.forEach((_, i) => {
          const o = amp * Math.sin((l / TWIST.wave) * Math.PI * 2 + i * Math.PI);
          strandPts[i].push(`${(p.x + nx * o).toFixed(1)} ${(p.y + ny * o).toFixed(1)}`);
        });
        if (p.y > lastY) {
          byY.push({ y: p.y, l });
          lastY = p.y;
        }
      }
      strands.forEach((s, i) => s.setAttribute("d", `M ${strandPts[i].join(" L ")}`));
      strandLens = strands.map((s) => s.getTotalLength());
      [main, glow].forEach((p) => {
        p.style.strokeDasharray = `${len}`;
      });
      strands.forEach((s, i) => {
        s.style.strokeDasharray = `${strandLens[i]}`;
      });
      // the joining piece (hero edge → under the brand strip) is always drawn
      minY = y0 + 40;
      update();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // first measure once the page has loaded and the browser is idle (it reads every section's layout —
    // kept out of the load path); after that, any size change (lazy images, fonts) re-measures
    let ready = false;
    const ro = new ResizeObserver(() => {
      if (ready) build();
    });
    ro.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    const begin = () => {
      ready = true;
      build();
      svg.dataset.on = "1";
    };
    const idle = () =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(begin, { timeout: 2000 }) : setTimeout(begin, 400);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={svgRef} aria-hidden className="okh-lead" preserveAspectRatio="none">
      <defs>
        <linearGradient id="okh-lead-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6436" />
          <stop offset="1" stopColor="#f0432c" stopOpacity="0.65" />
        </linearGradient>
        <radialGradient id="okh-lead-h">
          <stop offset="0" stopColor="#fff1e6" />
          <stop offset="0.35" stopColor="#ff9a74" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff5a32" stopOpacity="0" />
        </radialGradient>
        <mask id="okh-lead-m" maskUnits="userSpaceOnUse" x="0" y="0" width="0" height="0">
          <rect data-base x="0" y="0" width="0" height="0" fill="#fff" />
          <g data-holes fill="#000" />
        </mask>
      </defs>
      <g mask="url(#okh-lead-m)">
        <path data-glow fill="none" stroke="url(#okh-lead-g)" strokeWidth="7" strokeLinecap="round" opacity="0.14" />
        <path data-strand fill="none" stroke="url(#okh-lead-g)" strokeWidth="0.8" className="okh-lead-strand" />
        <path data-strand fill="none" stroke="url(#okh-lead-g)" strokeWidth="0.8" className="okh-lead-strand" />
        <path data-main className="okh-lead-line" fill="none" stroke="url(#okh-lead-g)" strokeWidth="1.25" strokeLinecap="round" />
        <g data-head style={{ opacity: 0 }}>
          <circle r="7" fill="url(#okh-lead-h)" />
          <circle r="1.5" fill="#fff1e6" />
        </g>
      </g>
    </svg>
  );
}
