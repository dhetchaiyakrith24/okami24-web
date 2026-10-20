/**
 * Worker side of the homepage hero's ribbons (hero-ribbons.ts): receives its OffscreenCanvas(es) once,
 * then one message per engine call. Its own animation loop runs here, so the page's main thread
 * draws nothing and never has to produce a frame for it. Replies "ready" or "fail" after init.
 */
import { RibbonEngine, applyRibbonMessage, type RibbonMessage } from "./hero-ribbons";

const scope = self as unknown as { onmessage: ((e: MessageEvent<RibbonMessage>) => void) | null; postMessage: (m: unknown) => void };
let engine: RibbonEngine | null = null;

scope.onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") {
    engine = RibbonEngine.create(m.canvases, m.mode);
    scope.postMessage(engine ? "ready" : "fail");
    return;
  }
  if (engine) applyRibbonMessage(engine, m);
};
