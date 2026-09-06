/**
 * Next.js instrumentation hook — `register()` runs once per server instance, before it serves
 * requests. Node.js runtime only; never during `next build`.
 *
 * Two things happen here, both about the data that is not in git (see src/lib/paths.ts):
 *   1. the shop's PromptPay QR is written to the data disk if it isn't there yet and the owner
 *      pasted one into the host's dashboard (src/lib/promptpay-qr-install.ts), and
 *   2. the automatic backup schedule starts (src/lib/backup/).
 * Neither can stop the server: the QR install returns a result instead of throwing, and a failed
 * backup is logged and ignored.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

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
