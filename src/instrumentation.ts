/**
 * Next.js instrumentation hook — `register()` runs once per server instance, before it serves
 * requests. Used here for exactly one thing: starting the automatic local backup of `.data/`
 * (see src/lib/backup/). Node.js runtime only; never during `next build`.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { startBackupScheduler } = await import("./lib/backup/scheduler");
  startBackupScheduler();
}
