"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** Same limits as the server route (src/lib/staff/easyslip.ts: 4 MB, JPEG/PNG/GIF/WebP). */
const MAX_BYTES = 4_194_304;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

/** Re-encode only when the server would refuse the file as-is (too big, or HEIC from an iPhone) — same as the customer's
 *  slip form and the staff slip checker. */
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

const ERRORS: Record<string, string> = {
  "not-refunded": "บันทึกว่าคืนเงินแล้วก่อน แล้วค่อยแนบสลิป",
  "too-large": "รูปใหญ่เกินไป — ลองแคปหน้าจอสลิปแทน",
  unreadable: "เปิดรูปนี้ไม่ได้ — ลองรูปอื่น (JPG หรือ PNG)",
  "no-image": "ยังไม่ได้เลือกรูป",
};

/**
 * "แนบสลิปโอนคืน" on the staff order page (owner 26/10 evening, queue B4): after the refund is recorded with its bank
 * reference, staff attach the bank app's slip; the customer's order page then shows it under "คืนเงินแล้ว". POSTs to
 * /staff/orders/<n>/refund-slip, then reloads the page's server data. `hasSlip` = one is attached (this replaces it).
 */
export function RefundSlipUpload({ orderNumber, hasSlip }: { orderNumber: string; hasSlip: boolean }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || pending) return;
    setPending(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("image", await prepareImage(file), file.name || "refund-slip.jpg");
      const res = await fetch(`/staff/orders/${encodeURIComponent(orderNumber)}/refund-slip`, { method: "POST", body });
      const data = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null;
      if (!data?.ok) {
        setError(ERRORS[data?.error ?? ""] ?? "แนบไม่สำเร็จ ลองอีกครั้ง");
        setPending(false);
        return;
      }
      setFile(null);
      setPreview(null);
      setPending(false);
      router.refresh();
    } catch {
      setError("แนบไม่สำเร็จ ลองอีกครั้ง");
      setPending(false);
    }
  }

  const inputId = `refund-slip-${orderNumber}`;
  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-center text-sm font-semibold transition-colors ${
          hasSlip ? "border-surface-border text-foreground-muted hover:text-foreground" : "border-ember/60 bg-ember/[0.06] text-foreground hover:border-ember"
        }`}
      >
        {preview ? (
          // A local preview of the chosen file (blob: URL) — nothing is uploaded until the button is pressed.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="สลิปที่เลือก" className="max-h-48 w-auto rounded-md object-contain" />
        ) : hasSlip ? (
          "เปลี่ยนรูปสลิปโอนคืน"
        ) : (
          "เลือกรูปสลิปโอนคืนจากแอปธนาคาร"
        )}
        <input
          id={inputId}
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
      {error && <p className="text-sm text-danger">{error}</p>}
      {file && (
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong disabled:opacity-50"
        >
          {pending ? "กำลังแนบ…" : "แนบสลิปให้ลูกค้าเห็น"}
        </button>
      )}
    </form>
  );
}
