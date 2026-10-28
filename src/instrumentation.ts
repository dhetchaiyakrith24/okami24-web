/**
 * Next.js instrumentation hook — `register()` runs once per server instance, before it serves
 * requests. Node.js runtime only; never during `next build`.
 *
 * Five things happen here. The middle two are about the data that is not in git (see
 * src/lib/paths.ts); the first is temporary, and dated:
 *   1. the native libraries are exercised in a child process and the result logged
 *      (src/lib/db/startup-check.ts) — added 2026-09-06 to locate a segfault that kills this server
 *      on "add to cart". Remove it once that is understood.
 *   2. the shop's PromptPay QR is written to the data disk if it isn't there yet and the owner
 *      pasted one into the host's dashboard (src/lib/promptpay-qr-install.ts), and
 *   3. the automatic backup schedule starts (src/lib/backup/), and
 *   4. the unpaid-order sweep starts (src/lib/commerce/unpaid-expiry.ts — owner 24/10), and
 *   5. the 90-day slip-picture sweep starts (src/lib/commerce/slip-images.ts — owner 26/10), and
 *   6. the Shipnity stock watch starts (src/lib/woo/watch.ts — owner 28/10).
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

  // Every outcome prints a `[qr]` line — including the two quiet ones. The first live deploy
  // (2026-09-06) ran a whole day with no QR on the disk and nobody knew, because "nothing to install
  // from" and "already there" used to print nothing. One line per boot is cheap; a day of customers
  // paying without a QR is not.
  try {
    const { installPromptpayQrIfMissing } = await import("./lib/promptpay-qr-install");
    const qr = installPromptpayQrIfMissing();
    const fallback = "order pages show the bank account without a QR until this is fixed";
    switch (qr.status) {
      case "installed":
        console.log(`[qr] OK — installed from ${qr.from}, written and read back: ${qr.path} (${qr.bytes} bytes)`);
        break;
      case "already-present":
        console.log(`[qr] OK — already on disk, not overwritten: ${qr.path} (${qr.bytes} bytes)`);
        break;
      case "no-source":
        console.warn(
          `[qr] MISSING — no file at ${qr.path}, and nothing to install it from: OKAMI24_PROMPTPAY_QR_BASE64 is not set and there is no promptpay-qr.b64 secret file. ` +
            `${fallback}. How to paste it: docs/DEPLOY-RENDER.md §5`
        );
        break;
      case "rejected":
        console.error(`[qr] NOT installed — the pasted value (${qr.from}) was rejected: ${qr.reason}. ${fallback}`);
        break;
      case "write-failed":
        console.error(`[qr] NOT installed — could not write ${qr.path} (from ${qr.from}): ${qr.reason}. ${fallback}`);
        break;
    }
  } catch (err) {
    console.error(`[qr] install step failed — ${err instanceof Error ? err.message : String(err)}`);
  }

  const { startBackupScheduler } = await import("./lib/backup/scheduler");
  startBackupScheduler();

  // 4. Unpaid orders cancel themselves after 24 hours (owner 24/10 proposal ②) — src/lib/commerce/unpaid-expiry.ts.
  const { startUnpaidExpiryScheduler } = await import("./lib/commerce/unpaid-expiry");
  startUnpaidExpiryScheduler();

  // 5. Slip pictures are deleted after 90 days (owner 26/10, queue B2 (c)) — src/lib/commerce/slip-images.ts.
  const { startSlipImagePurge } = await import("./lib/commerce/slip-images");
  startSlipImagePurge();

  // 6. The Shipnity stock light + LINE alert when the stock push stops (owner 28/10) — src/lib/woo/watch.ts.
  const { startStockWatch } = await import("./lib/woo/watch");
  startStockWatch();
}
