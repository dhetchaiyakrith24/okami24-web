import "server-only";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getDb } from "@/lib/db/client";
import { privateDataDir } from "@/lib/paths";
import { isSlipFileName, isSlipImageToken, previewFileName, SLIP_IMAGE_DAYS, slipImageCutoff } from "./slip-image-rules";

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
  return done + purgeOrphanFiles(now);
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
    if (!/^\d{1,12}-[0-9a-f]{16}(-p)?\.jpg$/.test(name)) continue;
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
