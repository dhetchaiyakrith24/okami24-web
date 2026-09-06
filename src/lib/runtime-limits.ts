/**
 * OKami24 — how much memory this process is really allowed, in one place.
 *
 * `os.totalmem()` inside a container usually reports the HOST's memory, so Node sizes its heap for a
 * machine it does not have. `process.constrainedMemory()` (Node 20+) reads the cgroup limit instead
 * and returns 0 when there is no limit, which is the number that actually matters on a 512MB
 * instance.
 *
 * The image pipeline's thread count is NOT set here — that belongs to Next, which owns the image
 * optimizer and has its own knob for it (`experimental.imgOptConcurrency` in next.config.ts). An
 * earlier version of this file called `sharp.concurrency()` directly and its comment was wrong about
 * the result: Next halves the concurrency again for the first resize of an image
 * (`node_modules/next/dist/server/image-optimizer.js`), so setting 2 here produced 1 in practice,
 * and Next already reduces libvips' default of 32 to 16 on its own. Configuring the same thing in
 * two places, with one of them silently modifying the other, is how a setting ends up meaning
 * something nobody intended.
 */

/** The container's memory ceiling in bytes, or null when this process is not memory-constrained. */
export function containerMemoryLimitBytes(): number | null {
  const constrained = typeof process.constrainedMemory === "function" ? process.constrainedMemory() : 0;
  return constrained && constrained > 0 ? constrained : null;
}

/** A one-line description for the startup log — no side effects. */
export function describeMemory(): string {
  const mb = (bytes: number) => `${Math.round(bytes / 1024 / 1024)}MB`;
  const limit = containerMemoryLimitBytes();
  const available =
    typeof process.availableMemory === "function" ? `, available ${mb(process.availableMemory())}` : "";
  return `container limit ${limit === null ? "none (not memory-constrained)" : mb(limit)}${available} · rss now ${mb(process.memoryUsage().rss)}`;
}
