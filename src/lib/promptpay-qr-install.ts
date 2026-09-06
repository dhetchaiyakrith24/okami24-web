import fs from "node:fs";
import path from "node:path";
import { privateDataDir, promptpayQrPath } from "./paths";

/**
 * OKami24 — putting the shop's PromptPay QR onto a host's disk (2026-09-06, Render deploy).
 *
 * The QR is deliberately not in git and not under `public/` (BSOT §9): it is served only by the
 * order page's access-checked route. That leaves a real problem when the site moves to a host —
 * the file has to reach a disk the owner cannot drag-and-drop onto, and the owner does not use a
 * terminal. So the dashboard becomes the delivery route: the image is pasted ONCE as base64 text,
 * either as
 *
 *   - a Render Secret File named `promptpay-qr.b64` (it lands in the project root), or
 *   - the environment variable `OKAMI24_PROMPTPAY_QR_BASE64` (declared `sync: false` in render.yaml
 *     so the owner's pasted value survives every Blueprint sync),
 *
 * and the server writes it to the data disk the first time it starts. `scripts/qr-upload-text.ts`
 * produces the text to paste. docs/DEPLOY-RENDER.md has the click-by-click version.
 *
 * Guard rails, because this runs on every server start:
 *   - It NEVER overwrites an existing QR. A file already on the disk always wins over the pasted
 *     copy, so re-deploying can't revert a QR the owner replaced later.
 *   - It refuses anything that isn't a real PNG, rather than writing a broken file that would
 *     show customers a broken image at the moment they are trying to pay.
 *   - "Installed" means READ BACK from the disk byte-for-byte, not that a write call returned.
 *   - Nothing here can stop the server: every outcome — including a disk that cannot be written —
 *     is a return value, and the caller logs it.
 * A missing QR is not an outage — the order page shows the account number without it.
 *
 * Every outcome carries enough to log a line a person can act on. The first live deploy
 * (2026-09-06) ran for a day with no QR on the disk and nobody knew, because the two quiet outcomes
 * ("nothing to install from", "already there") printed nothing. src/instrumentation.ts now prints
 * all of them.
 */

/** A Render Secret File with this name arrives in the project root at build and run time. */
export const QR_SECRET_FILE_NAME = "promptpay-qr.b64";

export type QrSource = "env" | "secret-file";

export type QrInstallResult =
  /** the disk already has a QR; nothing was read from env/secret file */
  | { status: "already-present"; path: string; bytes: number }
  /** no QR on the disk, and neither the env var nor the secret file has anything to install */
  | { status: "no-source"; path: string }
  /** written, then read back and compared — the bytes on the disk are the pasted image */
  | { status: "installed"; path: string; bytes: number; from: QrSource }
  /** the pasted text is not a PNG (or not base64 at all); nothing was written */
  | { status: "rejected"; reason: string; from: QrSource }
  /** a real PNG was pasted but the disk would not take it (folder, permission, read-back) */
  | { status: "write-failed"; reason: string; path: string; from: QrSource };

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readSource(projectRoot: string): { text: string; from: QrSource } | null {
  const fromEnv = process.env.OKAMI24_PROMPTPAY_QR_BASE64?.trim();
  if (fromEnv) return { text: fromEnv, from: "env" };
  const secretFile = path.join(projectRoot, QR_SECRET_FILE_NAME);
  if (fs.existsSync(secretFile)) {
    const text = fs.readFileSync(secretFile, "utf8").trim();
    if (text.length > 0) return { text, from: "secret-file" };
  }
  return null;
}

/** `ENOENT — no such file or directory, mkdir '/var/data/private'` — the code first, because the
 *  code is what a search engine or a Render support ticket wants. */
function describeError(err: unknown): string {
  const e = err as NodeJS.ErrnoException | undefined;
  if (e && typeof e === "object" && "message" in e) return e.code ? `${e.code} — ${e.message}` : e.message;
  return String(err);
}

export function installPromptpayQrIfMissing(projectRoot: string = process.cwd()): QrInstallResult {
  const target = promptpayQrPath(projectRoot);
  if (fs.existsSync(target)) {
    let bytes = 0;
    try {
      bytes = fs.statSync(target).size;
    } catch {
      // exists but cannot be stat'ed — still "present": the route handler decides at request time
    }
    return { status: "already-present", path: target, bytes };
  }

  const source = readSource(projectRoot);
  if (!source) return { status: "no-source", path: target };

  // Tolerates the two things a paste picks up: line breaks, and a `data:image/png;base64,` prefix
  // copied from a browser.
  const cleaned = source.text.replace(/^data:image\/png;base64,/, "").replace(/\s+/g, "");
  let bytes: Buffer;
  try {
    bytes = Buffer.from(cleaned, "base64");
  } catch {
    return { status: "rejected", reason: "not valid base64 text", from: source.from };
  }
  if (bytes.length === 0) return { status: "rejected", reason: "decoded to an empty file", from: source.from };
  if (!bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    return { status: "rejected", reason: "decoded bytes are not a PNG image", from: source.from };
  }

  try {
    fs.mkdirSync(privateDataDir(projectRoot), { recursive: true });
    fs.writeFileSync(target, bytes);
  } catch (err) {
    return { status: "write-failed", reason: describeError(err), path: target, from: source.from };
  }

  // Read it back. A write that "returned" is not the same as bytes a customer's browser will get.
  let onDisk: Buffer;
  try {
    onDisk = fs.readFileSync(target);
  } catch (err) {
    return { status: "write-failed", reason: `written but cannot be read back: ${describeError(err)}`, path: target, from: source.from };
  }
  if (!onDisk.equals(bytes)) {
    return {
      status: "write-failed",
      reason: `read-back mismatch — wrote ${bytes.length} bytes, the disk holds ${onDisk.length}`,
      path: target,
      from: source.from,
    };
  }
  return { status: "installed", path: target, bytes: bytes.length, from: source.from };
}
