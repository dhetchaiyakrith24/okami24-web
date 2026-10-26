/**
 * The slip-image rules that need no disk or database (owner 26/10, queue B2 (c)) — pure, so
 * slip-image-rules-contract-test.ts can hold them: how long a picture is kept, and the exact shapes of the stored file
 * name and of the LINE fetch token (anything else is refused before it gets near the file system).
 * The I/O side = slip-images.ts.
 */

/** Owner 26/10: keep the slip picture 90 days, then delete it automatically (the verdict stays on the order). */
export const SLIP_IMAGE_DAYS = 90;

/** Pictures submitted before this moment are past their 90 days. */
export function slipImageCutoff(now: Date): string {
  return new Date(now.getTime() - SLIP_IMAGE_DAYS * 86_400_000).toISOString();
}

/** `<submission id>-<16 hex>.jpg` — the only names slip-images.ts ever writes, and the only ones it will read. */
export function isSlipFileName(name: string): boolean {
  return /^\d{1,12}-[0-9a-f]{16}\.jpg$/.test(name);
}

/** `r<order id>-<16 hex>.jpg` — the refund slip staff attach to an order (owner 26/10 evening, queue B4). */
export function isRefundSlipFileName(name: string): boolean {
  return /^r\d{1,12}-[0-9a-f]{16}\.jpg$/.test(name);
}

/** Any file the slip sweep may delete by age: a payment slip, its preview, or a refund slip. */
export function isSweepableSlipFile(name: string): boolean {
  return /^r?\d{1,12}-[0-9a-f]{16}(-p)?\.jpg$/.test(name);
}

/** The preview LINE shows in the chat sits beside the full picture: `<base>-p.jpg`. */
export function previewFileName(name: string): string {
  return name.replace(/\.jpg$/, "-p.jpg");
}

/** 24 random bytes as base64url = 32 characters of [A-Za-z0-9_-]. */
export function isSlipImageToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{32}$/.test(token);
}
