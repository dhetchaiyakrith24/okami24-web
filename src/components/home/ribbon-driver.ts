import type { RibbonDriver, RibbonMessage, RibbonMode } from "@/lib/hero-ribbons";

/**
 * The ribbon engine in a worker on an OffscreenCanvas — shared by the hero (HeroShowcase) and the
 * flow layer below it (HomeFlow). Null when the browser cannot (the caller then draws on the main
 * thread — mainThreadDriver). A worker that cannot get WebGL answers "fail": no ribbons.
 */
export function workerDriver(canvas: HTMLCanvasElement, onReady: () => void, mode: RibbonMode = "hero"): RibbonDriver | null {
  if (typeof Worker === "undefined" || typeof canvas.transferControlToOffscreen !== "function") return null;
  let worker: Worker;
  try {
    worker = new Worker(new URL("../../lib/hero-ribbons.worker.ts", import.meta.url));
  } catch {
    return null;
  }
  let off: OffscreenCanvas;
  try {
    off = canvas.transferControlToOffscreen();
  } catch {
    worker.terminate();
    return null;
  }
  worker.onmessage = (e: MessageEvent) => {
    if (e.data === "ready") onReady();
    else worker.terminate();
  };
  const post = (m: RibbonMessage, transfer: Transferable[] = []) => worker.postMessage(m, transfer);
  post({ type: "init", canvas: off, mode }, [off]);
  return {
    size: (w, h, dpr, phone) => post({ type: "size", w, h, dpr, phone }),
    focus: (x, y) => post({ type: "focus", x, y }),
    scroll: (y) => post({ type: "scroll", y }),
    surge: () => post({ type: "surge" }),
    holes: (rects, areaH, route) => post({ type: "holes", rects, areaH, route }),
    run: (on, still) => post({ type: "run", on, still }),
    destroy: () => worker.terminate(),
  };
}
