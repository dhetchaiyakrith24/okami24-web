"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's ribbons carried down the homepage as one thin orange line (round "หน้าแรก hero",
 * owner 20/10: "strong in the hero, then thin lines leading the eye through each section, never
 * over products"). It runs in the side gutter and only crosses to the other side in the empty band
 * between two sections; it draws itself as the visitor scrolls, with a small glowing head.
 *
 * It lives inside a `relative` wrapper around the sections below the hero (page.tsx) and measures
 * that wrapper's children: a section's "content" is the span from its first to its last heading,
 * text, link, image or button, and a crossing happens only where the band between one section's
 * content and the next is tall enough. Everything is re-measured on resize; scrolling only moves
 * the dash offset. Reduced motion / Save-Data: the whole line, drawn, still.
 */
const CONTENT = "h2, h3, p, a, img, button, li";
const MIN_BAND = 56;

export function HomeLeadLine() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const wrap = svg?.parentElement;
    if (!svg || !wrap) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    const head = svg.querySelector<SVGGElement>("g[data-head]");
    let len = 0;
    let top = 0;
    let height = 0;

    let raf = 0;
    const update = () => {
      raf = 0;
      if (!len) return;
      const p = still ? 1 : Math.min(1, Math.max(0, (window.scrollY + window.innerHeight * 0.75 - top) / height));
      paths.forEach((path) => {
        path.style.strokeDashoffset = `${len * (1 - p)}`;
      });
      if (head) {
        const pt = paths[0].getPointAtLength(len * p);
        head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        head.style.opacity = !still && p > 0.002 && p < 0.998 ? "1" : "0";
      }
    };

    const build = () => {
      const w = wrap.clientWidth;
      const wr = wrap.getBoundingClientRect();
      top = wr.top + window.scrollY;
      height = wrap.scrollHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${height}`);
      svg.style.height = `${height}px`;

      // gutter = the space left of the page's content column, read from the first section's container
      const probe = wrap.querySelector<HTMLElement>(".mx-auto");
      const contentLeft = probe ? probe.getBoundingClientRect().left - wr.left + parseFloat(getComputedStyle(probe).paddingLeft) : 20;
      const gx = Math.max(6, Math.min(contentLeft / 2, 60));
      const left = gx;
      const right = w - gx;

      // the free band between consecutive sections' content
      const kids = Array.from(wrap.children).filter((el) => el !== svg) as HTMLElement[];
      const spans = kids.map((el) => {
        let a = Infinity;
        let b = -Infinity;
        el.querySelectorAll<HTMLElement>(CONTENT).forEach((n) => {
          const r = n.getBoundingClientRect();
          if (!r.height) return;
          a = Math.min(a, r.top);
          b = Math.max(b, r.bottom);
        });
        const r = el.getBoundingClientRect();
        return { top: (a === Infinity ? r.top : a) - wr.top, bottom: (b === -Infinity ? r.bottom : b) - wr.top };
      });
      const crossings: number[] = [];
      for (let i = 1; i < spans.length; i++) {
        const band = spans[i].top - spans[i - 1].bottom;
        if (band >= MIN_BAND) crossings.push((spans[i].top + spans[i - 1].bottom) / 2);
      }

      // start where the hero's ribbons fade out (right side), then down the gutter
      let side = right;
      let d = `M ${w * 0.82} 0 C ${w * 0.9} 24, ${right} 24, ${right} 90`;
      let y = 90;
      for (const c of crossings) {
        if (c - 60 <= y) continue;
        const other = side === right ? left : right;
        const half = Math.min(36, (c - y) / 2);
        d += ` L ${side} ${c - half} C ${side} ${c}, ${other} ${c}, ${other} ${c + half}`;
        side = other;
        y = c + half;
      }
      d += ` L ${side} ${height}`;
      paths.forEach((p) => p.setAttribute("d", d));
      len = paths[0].getTotalLength();
      paths.forEach((p) => {
        p.style.strokeDasharray = `${len}`;
      });
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
          <stop offset="0" stopColor="#ff8347" />
          <stop offset="1" stopColor="#ff6a2c" stopOpacity="0.6" />
        </linearGradient>
        <filter id="okh-lead-blur" x="-50%" y="-5%" width="200%" height="110%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path fill="none" stroke="url(#okh-lead-g)" strokeWidth="4" opacity="0.3" filter="url(#okh-lead-blur)" />
      <path className="okh-lead-line" fill="none" stroke="url(#okh-lead-g)" strokeWidth="1" />
      <g data-head style={{ opacity: 0 }}>
        <circle r="2.6" fill="#ffb27f" filter="url(#okh-lead-blur)" />
        <circle r="1.4" fill="#fff1e6" />
      </g>
    </svg>
  );
}
