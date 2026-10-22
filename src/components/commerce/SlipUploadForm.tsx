"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Same limits as the server (src/lib/staff/easyslip.ts — EasySlip's own: 4 MB, JPEG/PNG/GIF/WebP). */
const MAX_BYTES = 4_194_304;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

/** Re-encode only when the server would refuse the file as-is (too big, or a type like HEIC from an iPhone camera).
 *  Same approach as the staff slip checker. */
async function prepareImage(file: File): Promise<Blob> {
  if (ACCEPTED.includes(file.type) && file.size <= MAX_BYTES) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob || blob.size > MAX_BYTES) throw new Error("still too large");
  return blob;
}

type ErrorKey =
  | "slipErrorUnreadable"
  | "slipErrorPending"
  | "slipErrorTooLarge"
  | "slipErrorUsed"
  | "slipErrorBusy"
  | "slipErrorGeneric";

function errorKey(code: string): ErrorKey {
  if (code === "SLIP_NOT_FOUND" || code === "INVALID_IMAGE_FORMAT" || code === "INVALID_IMAGE_TYPE" || code === "PREPARE_FAILED" || code === "NO_IMAGE")
    return "slipErrorUnreadable";
  if (code === "SLIP_PENDING") return "slipErrorPending";
  if (code === "IMAGE_SIZE_TOO_LARGE") return "slipErrorTooLarge";
  if (code === "SLIP_USED") return "slipErrorUsed";
  if (code === "RATE_LIMIT_EXCEEDED") return "slipErrorBusy";
  return "slipErrorGeneric";
}

/**
 * "Pay at once" (cart round 22/10): the customer attaches the transfer slip right on the order page. It goes to
 * POST /orders/<n>/slip, which checks it with the bank (EasySlip) and moves the order to "payment submitted"; the page
 * then reloads its server data and shows the new status. A slip the bank cannot read is answered here so the customer
 * can try another picture straight away.
 */
export function SlipUploadForm({ orderNumber, token }: { orderNumber: string; token: string | null }) {
  const { dict } = useLocale();
  const t = dict.orderStatus;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ErrorKey | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || pending) return;
    setPending(true);
    setError(null);
    try {
      const image = await prepareImage(file);
      const body = new FormData();
      body.append("image", image, file.name || "slip.jpg");
      if (token) body.append("token", token);
      const res = await fetch(`/orders/${encodeURIComponent(orderNumber)}/slip`, { method: "POST", body });
      const data = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null;
      if (!data || !data.ok) {
        setError(errorKey(data?.error ?? ""));
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("slipErrorGeneric");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-foreground">{t.slipUploadTitle}</p>
      <label
        htmlFor="slip-image"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-surface-border bg-surface-2 px-4 py-6 text-center transition-colors hover:border-foreground-dim"
      >
        {preview ? (
          // A local preview of the chosen file (blob: URL) — nothing is uploaded until the button is pressed.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={t.slipPreviewAlt} className="max-h-72 w-auto rounded-md object-contain" />
        ) : (
          <span className="text-4xl" aria-hidden>
            🧾
          </span>
        )}
        <span className="text-sm font-semibold text-foreground">{preview ? t.slipUploadChange : t.slipUploadPick}</span>
        <span className="text-xs text-foreground-dim">{t.slipUploadHint}</span>
        <input
          ref={inputRef}
          id="slip-image"
          name="image"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const chosen = e.target.files?.[0] ?? null;
            setFile(chosen);
            setPreview(chosen ? URL.createObjectURL(chosen) : null);
            setError(null);
          }}
        />
      </label>
      {error && (
        <p role="alert" className="rounded-lg border border-danger/60 bg-danger/10 px-4 py-3 text-sm leading-relaxed text-foreground">
          {t[error]}
        </p>
      )}
      <button
        type="submit"
        disabled={!file || pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold tracking-tight text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember disabled:opacity-50"
      >
        {pending ? t.slipUploadPending : t.slipUploadCta}
      </button>
    </form>
  );
}
