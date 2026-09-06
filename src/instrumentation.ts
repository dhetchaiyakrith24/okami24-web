/**
 * Next.js instrumentation hook — `register()` runs once per server instance, before it serves
 * requests. Node.js runtime only; never during `next build`.
 *
 * Three things happen here. The last two are about the data that is not in git (see
 * src/lib/paths.ts); the first is temporary, and dated:
 *   1. the native libraries are exercised in a child process and the result logged
 *      (src/lib/db/startup-check.ts) — added 2026-09-06 to locate a segfault that kills this server
 *      on "add to cart". Remove it once that is understood.
 *   2. the shop's PromptPay QR is written to the data disk if it isn't there yet and the owner
 *      pasted one into the host's dashboard (src/lib/promptpay-qr-install.ts), and
 *   3. the automatic backup schedule starts (src/lib/backup/).
 * None of them can stop the server: the probe runs in a child process and only reports how it died,
 * the QR install returns a result instead of throwing, and a failed backup is logged and ignored.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  // First, before anything else can crash: prove the native SQLite addon and the mounted disk work.
  // Added 2026-09-06 after the first live deploy segfaulted (exit 139) on the first "add to cart" —
  // a segfault leaves no exception and no stack, so the dangerous work is done here, at boot, with a
  // breadcrumb written before each step. See src/lib/db/startup-check.ts.
  const { runStartupCheck } = await import("./lib/db/startup-check");
  await runStartupCheck();

  try {
    const { installPromptpayQrIfMissing } = await import("./lib/promptpay-qr-install");
    const qr = installPromptpayQrIfMissing();
    if (qr.status === "installed") console.log(`[qr] installed from ${qr.from}: ${qr.path} (${qr.bytes} bytes)`);
    else if (qr.status === "rejected") console.error(`[qr] NOT installed — ${qr.reason} (source: ${qr.from})`);
  } catch (err) {
    console.error(`[qr] install step failed — ${err instanceof Error ? err.message : String(err)}`);
  }

  const { startBackupScheduler } = await import("./lib/backup/scheduler");
  startBackupScheduler();
}
