"use client";

import { useEffect, useRef } from "react";
import { mainThreadDriver, type RibbonDriver } from "@/lib/hero-ribbons";
import { workerDriver } from "./ribbon-driver";

/**
 * The hero's light carried down the whole homepage (round "หน้าแรก hero"; owner 20/10 ~05:00, from
 * his reference: thick and soft like the hero's ribbons, smooth, passing BEHIND the boxes — which
 * blur it, so the eye stays on the box — and brightness that swells and dims along it).
 *
 * The same ribbon engine as the hero, in "flow" mode: the ribbons stand upright and sweep from side
 * to side as the visitor scrolls, starting on the left where the hero's light leaves. They are drawn
 * on one screen-sized canvas in a sticky stage that sits BEHIND every section of the wrapper
 * (`.okh-flow` in page.tsx): the sections are see-through there, and their boxes are frosted glass
 * (globals.css), so the light shows through them blurred and never sits on a product or a word.
 *
 * Like the hero: it starts after load + idle, runs in a worker when the browser can, stops when the
 * flow area is off screen or the tab is hidden; reduced motion / Save-Data draw one still frame
 * (redrawn when the page scrolls).
 */
export function HomeFlow() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = stage?.parentElement;
    if (!stage || !wrap) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";

    // a fresh canvas per mount: an OffscreenCanvas transfer can happen only once per element
    const canvas = document.createElement("canvas");
    canvas.className = "okh-flow-canvas";
    stage.append(canvas);

    let ribbons: RibbonDriver | null = null;
    let visible = false;
    let disposed = false;
    let top = 0;
    let raf = 0;
    const sync = () => {
      if (!ribbons) return;
      const phone = window.innerWidth < 1024;
      ribbons.size(stage.clientWidth, stage.clientHeight, Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2), phone);
      top = wrap.getBoundingClientRect().top + window.scrollY;
      ribbons.scroll(window.scrollY - top);
    };
    const run = () => ribbons?.run(visible && !document.hidden, still);
    const onScroll = () => {
      if (!ribbons) return;
      ribbons.scroll(window.scrollY - top);
      // still mode has no loop: redraw the one frame for the new scroll position, once per frame
      if (still && !raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          run();
        });
      }
    };

    const begin = () => {
      if (disposed) return;
      const viaWorker = workerDriver(
        canvas,
        () => {
          if (!disposed) canvas.dataset.on = "1";
        },
        "flow",
      );
      ribbons = viaWorker ?? mainThreadDriver(canvas, "flow");
      if (!ribbons) return;
      if (!viaWorker) canvas.dataset.on = "1";
      sync();
      run();
      window.addEventListener("scroll", onScroll, { passive: true });
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
    ro.observe(wrap);
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
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
      ribbons?.destroy();
      canvas.remove();
    };
  }, []);

  return <div ref={stageRef} className="okh-flow-stage" aria-hidden />;
}
