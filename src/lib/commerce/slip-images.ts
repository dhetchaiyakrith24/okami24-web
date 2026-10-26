import "server-only";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getDb } from "@/lib/db/client";
import { privateDataDir } from "@/lib/paths";
import {
  isRefundSlipFileName,
  isSlipFileName,
  isSlipImageToken,
  isSweepableSlipFile,
  previewFileName,
  SLIP_IMAGE_DAYS,
  slipImageCutoff,
} from "./slip-image-rules";

/**
 * The slip picture a customer attaches on the order page (owner 26/10 in chat, queue B2 (c) — BSOT §9 updated the same
 * day): kept SLIP_IMAGE_DAYS days on the data disk, then deleted automatically; the verdict, amount and bank reference
 * stay on the order (migration 0008). Before 26/10 no slip image was ever stored.
 *
 * Where: `<data dir>/private/slips/` — never under public/, never in a backup (backups copy the database only).
 * Who sees it: staff on /staff/orders/<number> (staff session), and LINE — the bot posts it into the "OKM Webside order"
 * group, and a LINE image message must name an HTTPS address LINE can fetch. That address carries a 32-character random
 * token (192 bits, one per picture), served by /api/line/slip/<token>; it stops working when the picture is deleted.
 *
 * Every picture is re-encoded to JPEG (LINE takes only JPEG/PNG; a phone's WebP/GIF slip would be refused) with the
 * EXIF data dropped, plus a small preview (LINE's chat preview must stay under 1 MB). Nothing here ever throws into the
 * customer's request: a picture that cannot be saved is logged, and the order goes on without it.
 */

const FULL_EDGE = 2000;
const PREVIEW_EDGE = 480;
/** A slip is a phone screenshot (a few megapixels). The limit keeps a hostile, highly-compressed huge PNG (≤ 4 MB on the
 *  wire) from decoding into gigabytes on the 512 MB server — sharp's default is 268 MP (checker #873). */
const MAX_INPUT_PIXELS = 40_000_000;

function slipDir(): string {
  return path.join(privateDataDir(), "slips");
}

async function toJpeg(bytes: Buffer, edge: number, quality: number): Promise<Buffer> {
  return sharp(bytes, { failOn: "none", limitInputPixels: MAX_INPUT_PIXELS })
    .rotate()
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}

/** Writes the picture of payment submission `submissionId` and returns its LINE token; null when it could not be kept. */
export async function saveSlipImage(submissionId: number, bytes: Buffer): Promise<string | null> {
  try {
    const [full, preview] = await Promise.all([toJpeg(bytes, FULL_EDGE, 85), toJpeg(bytes, PREVIEW_EDGE, 75)]);
    const name = `${submissionId}-${crypto.randomBytes(8).toString("hex")}.jpg`;
    const dir = slipDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), full, { mode: 0o600 });
    fs.writeFileSync(path.join(dir, previewFileName(name)), preview, { mode: 0o600 });
    const token = crypto.randomBytes(24).toString("base64url");
    const saved = getDb()
      .prepare("UPDATE order_payment_submissions SET proof_image_path = ?, slip_image_token = ? WHERE id = ? AND proof_image_path IS NULL")
      .run(name, token, submissionId);
    if (saved.changes === 0) {
      removeFiles(name);
      return null;
    }
    return token;
  } catch (err) {
    console.error(`[slip-image] submission ${submissionId}: not saved — ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

function readFile(name: string | null, preview: boolean): Buffer | null {
  if (!name || !isSlipFileName(name)) return null;
  try {
    return fs.readFileSync(path.join(slipDir(), preview ? previewFileName(name) : name));
  } catch {
    return null;
  }
}

/** The newest kept slip picture of an order — for the staff order page (the caller has checked the staff session). */
export function slipImageForOrder(orderId: number): Buffer | null {
  const row = getDb()
    .prepare("SELECT proof_image_path FROM order_payment_submissions WHERE order_id = ? AND proof_image_path IS NOT NULL ORDER BY id DESC LIMIT 1")
    .get(orderId) as { proof_image_path: string } | undefined;
  return readFile(row?.proof_image_path ?? null, false);
}

/** The picture behind a LINE token — for LINE's fetch only. Unknown, malformed or deleted = null (the route says 404). */
export function slipImageByToken(token: string, preview: boolean): Buffer | null {
  if (!isSlipImageToken(token)) return null;
  const row = getDb()
    .prepare("SELECT proof_image_path FROM order_payment_submissions WHERE slip_image_token = ? AND proof_image_path IS NOT NULL")
    .get(token) as { proof_image_path: string } | undefined;
  return readFile(row?.proof_image_path ?? null, preview);
}

// ---------------------------------------------------------------------------------------------------------------------
// The refund slip (owner 26/10 evening, queue B4): after staff transfer a refund in the bank app they attach the bank's
// slip to the order, and the customer's order page shows it under "คืนเงินแล้ว". One picture per order (a new one
// replaces the old), same folder, same 90 days (counted from when it was attached), no LINE token — it is only served
// to staff and to the order's own viewer (the logged-in owner or the view token).

export type RefundSlipResult = { ok: true } | { ok: false; error: "not-refunded" | "unreadable" };

/** Keeps the refund slip of order `orderId`. Only an issue already recorded as refunded takes one (the bank reference
 *  first — markRefunded in stock-issues.ts — then the picture). */
export async function saveRefundSlip(orderId: number, bytes: Buffer): Promise<RefundSlipResult> {
  const db = getDb();
  const row = db.prepare("SELECT resolution, refund_slip_path FROM order_stock_issues WHERE order_id = ?").get(orderId) as
    | { resolution: string | null; refund_slip_path: string | null }
    | undefined;
  if (row?.resolution !== "refunded") return { ok: false, error: "not-refunded" };
  let full: Buffer;
  try {
    full = await toJpeg(bytes, FULL_EDGE, 85);
  } catch (err) {
    console.error(`[slip-image] refund slip of order ${orderId}: unreadable — ${err instanceof Error ? err.message : String(err)}`);
    return { ok: false, error: "unreadable" };
  }
  const name = `r${orderId}-${crypto.randomBytes(8).toString("hex")}.jpg`;
  const dir = slipDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), full, { mode: 0o600 });
  db.transaction(() => {
    db.prepare("UPDATE order_stock_issues SET refund_slip_path = ?, refund_slip_at = ?, refund_slip_deleted_at = NULL WHERE order_id = ?").run(
      name,
      new Date().toISOString(),
      orderId
    );
    const status = (db.prepare("SELECT status FROM orders WHERE id = ?").get(orderId) as { status: string }).status;
    db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(
      orderId,
      status,
      // "Stock: …" like the other out-of-stock rows (historyNoteTh maps them) — a "Staff: <action>" note would read as an
      // unknown staff action.
      row.refund_slip_path ? "Stock: refund slip replaced" : "Stock: refund slip attached"
    );
  })();
  if (row.refund_slip_path) {
    try {
      removeRefundFile(row.refund_slip_path);
    } catch (err) {
      // The row already points at the new picture; the old file is past any row, so the orphan sweep removes it at 90 days.
      console.error(`[slip-image] old refund slip of order ${orderId}: not deleted — ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { ok: true };
}

/** The refund slip of an order, or null (none attached, or deleted after its 90 days). The caller has checked who asks:
 *  the staff session, or the order page's own viewer. */
export function refundSlipForOrder(orderId: number): Buffer | null {
  const row = getDb().prepare("SELECT refund_slip_path FROM order_stock_issues WHERE order_id = ?").get(orderId) as
    | { refund_slip_path: string | null }
    | undefined;
  const name = row?.refund_slip_path ?? null;
  if (!name || !isRefundSlipFileName(name)) return null;
  try {
    return fs.readFileSync(path.join(slipDir(), name));
  } catch {
    return null;
  }
}

function removeRefundFile(name: string): void {
  if (!isRefundSlipFileName(name)) return;
  try {
    fs.unlinkSync(path.join(slipDir(), name));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}

/** Refund slips past their 90 days (counted from when staff attached them); the bank reference stays on the issue. */
function purgeOldRefundSlips(now: Date): number {
  const db = getDb();
  const rows = db
    .prepare("SELECT order_id, refund_slip_path FROM order_stock_issues WHERE refund_slip_path IS NOT NULL AND refund_slip_at < ?")
    .all(slipImageCutoff(now)) as { order_id: number; refund_slip_path: string }[];
  const clear = db.prepare("UPDATE order_stock_issues SET refund_slip_path = NULL, refund_slip_deleted_at = ? WHERE order_id = ?");
  let done = 0;
  for (const r of rows) {
    try {
      removeRefundFile(r.refund_slip_path);
    } catch (err) {
      console.error(`[slip-image] refund slip of order ${r.order_id}: could not delete — ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    clear.run(now.toISOString(), r.order_id);
    done++;
  }
  return done;
}

function removeFiles(name: string): void {
  if (!isSlipFileName(name)) return;
  for (const f of [name, previewFileName(name)]) {
    try {
      fs.unlinkSync(path.join(slipDir(), f));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }
}

/** Deletes every slip picture past its SLIP_IMAGE_DAYS days; returns how many. Safe to run any time. A file that cannot
 *  be removed keeps its row, so the next sweep tries again. */
export function purgeOldSlipImages(now: Date = new Date()): number {
  const db = getDb();
  const rows = db
    .prepare("SELECT id, proof_image_path FROM order_payment_submissions WHERE proof_image_path IS NOT NULL AND submitted_at < ?")
    .all(slipImageCutoff(now)) as { id: number; proof_image_path: string }[];
  const clear = db.prepare(
    "UPDATE order_payment_submissions SET proof_image_path = NULL, slip_image_token = NULL, slip_image_deleted_at = ? WHERE id = ?"
  );
  let done = 0;
  for (const r of rows) {
    try {
      removeFiles(r.proof_image_path);
    } catch (err) {
      console.error(`[slip-image] submission ${r.id}: could not delete — ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    clear.run(now.toISOString(), r.id);
    done++;
  }
  return done + purgeOldRefundSlips(now) + purgeOrphanFiles(now);
}

/** A file no row points at (the server stopped between writing it and saving its name, or the save lost a race) would
 *  never be reached by the row sweep above — and the privacy page promises 90 days. So the folder itself is swept too:
 *  any slip file older than SLIP_IMAGE_DAYS by its modified time goes (checker #873). Never throws. */
function purgeOrphanFiles(now: Date): number {
  const cutoff = Date.parse(slipImageCutoff(now));
  let names: string[];
  try {
    names = fs.readdirSync(slipDir());
  } catch {
    return 0;
  }
  let done = 0;
  for (const name of names) {
    if (!isSweepableSlipFile(name)) continue;
    const file = path.join(slipDir(), name);
    try {
      if (fs.statSync(file).mtimeMs >= cutoff) continue;
      fs.unlinkSync(file);
      if (!name.endsWith("-p.jpg")) done++;
    } catch (err) {
      console.error(`[slip-image] ${name}: could not delete — ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return done;
}

declare global {
  var __okami24SlipPurgeTimer: NodeJS.Timeout | undefined;
}

const PURGE_MS = 6 * 3_600_000;

function sweep(reason: string): void {
  try {
    const n = purgeOldSlipImages();
    if (n > 0) console.log(`[slip-image] ${reason}: deleted ${n} slip picture(s) older than ${SLIP_IMAGE_DAYS} days`);
  } catch (err) {
    console.error(`[slip-image] ${reason}: FAILED — ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Started once per server process from src/instrumentation.ts: a sweep a minute after boot, then every 6 hours. */
export function startSlipImagePurge(): void {
  if (globalThis.__okami24SlipPurgeTimer) return;
  const first = setTimeout(() => sweep("startup"), 60_000);
  first.unref();
  const timer = setInterval(() => sweep("interval"), PURGE_MS);
  timer.unref();
  globalThis.__okami24SlipPurgeTimer = timer;
  console.log(`[slip-image] scheduled: slip pictures are deleted after ${SLIP_IMAGE_DAYS} days (sweep every ${PURGE_MS / 3_600_000} h)`);
}
