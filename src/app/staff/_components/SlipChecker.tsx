"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ReceiverStatus } from "@/lib/staff/receiver-match";
import type { PartyView, QuotaView, SlipCheckResponse, SlipUsedResponse } from "@/lib/staff/slip-check-types";
import type { SlipCheckRecord } from "@/lib/staff/slip-checks";
import { formatBaht, formatCount, formatDateTime } from "@/app/staff/_components/format";

/** EasySlip limits (document.easyslip.com /en/v2/verify/bank/image): 4 MB; JPEG, PNG, GIF, WebP. */
const MAX_BYTES = 4_194_304;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];
/** Warn on the page from this share of the month's quota (round file: "ใกล้หมด เช่น 900"). */
const QUOTA_WARN_SHARE = 0.9;

type OkResult = Extract<SlipCheckResponse, { ok: true }>;

/** Loan words the browser's Thai segmenter splits inside ("ออเด | อร์", seen at 390 on 07/10). Kept whole on
 *  this page only — the site-wide list in src/lib/thai-typography.ts is owner-curated and not touched here. */
const KEEP_WHOLE = /(ออเดอร์|โควตา|สลิป|EasySlip)/;

function keep(text: string): ReactNode {
  const parts = text.split(KEEP_WHOLE);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {p}
      </span>
    ) : (
      p
    )
  );
}

const SETUP_CODES = new Set([
  "NOT_CONFIGURED",
  "MISSING_API_KEY",
  "INVALID_API_KEY",
  "IP_NOT_ALLOWED",
  "BRANCH_INACTIVE",
  "SERVICE_BANNED",
  "SERVICE_DELETED",
  "SERVICE_EXPIRED",
  "USER_BANNED",
]);
const DOWN_CODES = new Set(["TIMEOUT", "NETWORK", "API_SERVER_ERROR", "INTERNAL_SERVER_ERROR", "BAD_RESPONSE"]);

function errorText(code: string, retryAfterSeconds?: number): string {
  if (code === "FORBIDDEN") return "เว็บไม่รับคำขอตรวจจากหน้านี้ (รหัส 403) กรุณาโหลดหน้าใหม่แล้วลองอีกครั้ง ถ้ายังไม่ได้ แจ้งเจ้าของร้าน";
  if (code === "SESSION") return "หมดเวลาเข้าสู่ระบบแล้ว กรุณาโหลดหน้านี้ใหม่แล้วใส่รหัสทีมงานอีกครั้ง";
  if (SETUP_CODES.has(code)) return `ระบบตรวจสลิปยังตั้งค่าไม่เรียบร้อย กรุณาแจ้งเจ้าของร้าน (รหัส ${code})`;
  if (code === "QUOTA_EXCEEDED")
    return "โควตาตรวจสลิปของเดือนนี้หมดแล้ว กรุณาแจ้งเจ้าของร้าน ระหว่างนี้ให้ดูยอดเข้าในแอปธนาคารของร้านแทน";
  if (code === "SLIP_NOT_FOUND")
    return "ตรวจสลิปนี้ไม่ได้ อาจเป็นเพราะรูปไม่ชัดจนอ่าน QR ไม่ได้ ให้ลองรูปที่ชัดกว่าและเห็น QR ครบ ถ้ายังไม่ได้ อาจเป็นสลิปปลอม หรือสลิปที่เก่าเกินกว่าธนาคารจะตรวจได้ (ส่วนใหญ่ 7–30 วัน)";
  if (code === "SLIP_PENDING") return "สลิปธนาคารกรุงเทพที่เพิ่งโอนไม่ถึง 5 นาที ธนาคารยังไม่ยืนยัน กรุณารอสักครู่แล้วตรวจใหม่";
  if (code === "IMAGE_SIZE_TOO_LARGE") return "รูปใหญ่เกิน 4 MB ลองแคปหน้าจอสลิปแทนการถ่ายรูป";
  if (code === "INVALID_IMAGE_FORMAT" || code === "INVALID_IMAGE_TYPE" || code === "NO_IMAGE" || code === "PREPARE_FAILED")
    return "เปิดไฟล์นี้เป็นรูปไม่ได้ กรุณาเลือกรูปสลิป (JPG หรือ PNG)";
  if (code === "RATE_LIMIT_EXCEEDED") return `ส่งตรวจถี่เกินไป กรุณารอ ${retryAfterSeconds ?? 5} วินาทีแล้วลองใหม่`;
  if (DOWN_CODES.has(code))
    return "ระบบ EasySlip ไม่ตอบในตอนนี้ ลองกดตรวจอีกครั้ง ถ้ายังไม่ได้ ให้ดูยอดเข้าในแอปธนาคารของร้านแทน";
  return `ตรวจไม่สำเร็จ ลองใหม่อีกครั้ง (รหัส ${code})`;
}

/** Re-encode only when EasySlip would refuse the file as-is (too big, or a type like HEIC). */
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

const RECEIVER_CHIP: Record<ReceiverStatus, { label: string; className: string }> = {
  match: { label: "บัญชีร้าน", className: "border-verified/40 bg-verified/10 text-verified" },
  mismatch: { label: "ไม่ใช่บัญชีร้าน", className: "border-danger/50 bg-danger/10 text-danger" },
  unclear: { label: "ต้องดูเอง", className: "border-unverified/50 bg-unverified/10 text-unverified" },
};

/** "info" = worth knowing, not a warning — it never takes the headline (a re-check of the same slip read as an
 *  alarm on 08/10 and sent staff checking again). */
type Flag = { tone: "bad" | "warn" | "info"; title: string; detail?: string };

function flagsFor(r: OkResult): Flag[] {
  const flags: Flag[] = [];
  if (r.duplicate?.by === "log" && r.duplicate.usedAt)
    flags.push({
      tone: "bad",
      title: "❌ สลิปนี้ใช้กับออเดอร์ไปแล้ว",
      detail: `ทีมงานบันทึกว่าใช้แล้วเมื่อ ${formatDateTime(r.duplicate.usedAt)} · อย่าใช้ยืนยันออเดอร์อื่น ถ้านี่คือออเดอร์เดิมที่ยืนยันไปแล้ว ไม่ต้องทำอะไรเพิ่ม`,
    });
  if (r.slip.receiverStatus === "mismatch")
    flags.push({ tone: "bad", title: "❌ เงินเข้าบัญชีอื่น ไม่ใช่บัญชีของร้าน", detail: "อย่าเพิ่งยืนยันออเดอร์ ให้สอบถามลูกค้าก่อน" });
  if (r.amountCheck && !r.amountCheck.matches)
    flags.push({
      tone: "bad",
      title: "❌ ยอดในสลิปไม่ตรงกับยอดออเดอร์",
      detail: `สลิป ${formatBaht(r.slip.amount)} · ออเดอร์ ${formatBaht(r.amountCheck.expected)}`,
    });
  if (r.duplicate?.by === "easyslip")
    flags.push({
      tone: "warn",
      title: "⚠️ สลิปนี้เคยถูกตรวจจากที่อื่นมาก่อน",
      detail: "ไม่ได้ตรวจจากหน้านี้ จึงไม่รู้ว่าใช้กับออเดอร์ไหนแล้วหรือยัง ดูให้แน่ใจก่อนยืนยันออเดอร์นี้",
    });
  if (r.slip.receiverStatus === "unclear")
    flags.push({
      tone: "warn",
      title: "⚠️ ธนาคารยืนยันสลิปแล้ว แต่ระบบบอกไม่ได้ว่าเงินเข้าบัญชีร้านหรือไม่",
      detail: "ให้เปิดแอปธนาคารของร้านดูยอดเข้าอีกครั้ง",
    });
  if (r.duplicate?.by === "log" && !r.duplicate.usedAt)
    flags.push({
      tone: "info",
      title: `ตรวจสลิปใบนี้ไปแล้วเมื่อ ${formatDateTime(r.duplicate.firstCheckedAt)} (รวม ${formatCount(r.duplicate.previousChecks + 1)} ครั้ง)`,
      detail: "ยังไม่มีใครบันทึกว่าใช้กับออเดอร์ ถ้าเป็นการตรวจซ้ำของออเดอร์เดิม ใช้ผลนี้ได้ตามปกติ",
    });
  return flags;
}

const FLAG_TONE: Record<Flag["tone"], string> = {
  bad: "border-danger/60 bg-danger/10 text-danger",
  warn: "border-unverified/60 bg-unverified/10 text-unverified",
  info: "border-surface-border bg-surface-2 text-foreground",
};

/** After the order is confirmed: one tap so the next check of this transfer says "already used". Undo = a mis-tap. */
function UsedMark({
  transRef,
  initialUsedAt,
  onChange,
}: {
  transRef: string;
  initialUsedAt: string | null;
  onChange: (usedAt: string | null) => void;
}) {
  const router = useRouter();
  const [usedAt, setUsedAt] = useState<string | null>(initialUsedAt);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(used: boolean) {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/staff/api/used", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transRef, used }),
      });
      if (res.status === 404) return setError(errorText("SESSION"));
      if (res.status === 403) return setError(errorText("FORBIDDEN"));
      const data = (await res.json().catch(() => null)) as SlipUsedResponse | null;
      if (!data || !data.ok) return setError("บันทึกไม่สำเร็จ ลองกดอีกครั้ง");
      setUsedAt(data.usedAt);
      onChange(data.usedAt);
      router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ ลองกดอีกครั้ง");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-surface-border-soft bg-surface-2 px-4 py-3">
      {usedAt ? (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-semibold text-verified">✓ บันทึกว่าใช้กับออเดอร์แล้ว {formatDateTime(usedAt)}</p>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={pending}
            className="text-sm text-foreground-dim underline underline-offset-4 hover:text-foreground disabled:opacity-50"
          >
            ยกเลิก (กดผิด)
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong disabled:opacity-50"
          >
            {pending ? "กำลังบันทึก…" : "บันทึกว่าใช้สลิปนี้กับออเดอร์แล้ว"}
          </button>
          <p className="text-xs leading-relaxed text-foreground-dim">
            {keep("กดหลังยืนยันออเดอร์ ถ้ามีคนส่งสลิปนี้มาตรวจอีก ระบบจะเตือนว่าใช้ไปแล้ว")}
          </p>
        </>
      )}
      {error && <p className="text-sm text-danger">{keep(error)}</p>}
    </div>
  );
}

function Party({ label, party, chip }: { label: string; party: PartyView | null; chip?: ReceiverStatus }) {
  return (
    <div className="flex flex-col gap-1 border-t border-surface-border-soft py-3">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-xs text-foreground-dim">{label}</dt>
        {chip && (
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RECEIVER_CHIP[chip].className}`}>
            {RECEIVER_CHIP[chip].label}
          </span>
        )}
      </div>
      <dd className="text-sm leading-relaxed text-foreground">
        {party ? (
          <>
            <span className="block">{party.name ?? "ไม่มีชื่อในสลิป"}</span>
            <span className="block text-foreground-muted">{[party.bank, party.account].filter(Boolean).join(" · ") || "—"}</span>
          </>
        ) : (
          // Only the sender can be missing (a slip answered from our log): the log keeps no customer names.
          <span className="text-foreground-muted">{keep("ระบบไม่เก็บชื่อลูกค้าไว้ ดูชื่อผู้โอนได้จากรูปสลิป")}</span>
        )}
      </dd>
    </div>
  );
}

function Result({ result, onNext }: { result: OkResult; onNext: () => void }) {
  // "Undo (mis-tap)" on a slip that arrived already marked: the red "already used" headline goes with the mark
  // (checker #383). Marking a slip here never turns its own headline red — that warning is for the NEXT check.
  const [unmarked, setUnmarked] = useState(false);
  const shown: OkResult =
    unmarked && result.duplicate?.by === "log" ? { ...result, duplicate: { ...result.duplicate, usedAt: null } } : result;
  const all = flagsFor(shown);
  const flags = all.filter((f) => f.tone !== "info");
  const notes = all.filter((f) => f.tone === "info");
  const bad = flags.some((f) => f.tone === "bad");
  const usedAt = result.duplicate?.by === "log" ? result.duplicate.usedAt : null;
  // A green ✅ with no order total entered must still say the amount was not compared — a rushed reader takes
  // green for "paid in full" (designer, round close 08/10).
  const headline: Flag = flags[0] ?? {
    tone: "warn",
    title: "✅ ธนาคารยืนยันสลิปนี้ และเงินเข้าบัญชีของร้าน",
    detail: result.amountCheck ? undefined : "ยังไม่ได้เทียบกับยอดออเดอร์ ดูยอดเงินด้านล่างเองว่าตรงหรือไม่",
  };
  const ok = flags.length === 0;
  const tone = ok
    ? "border-verified/50 bg-verified/10 text-verified"
    : bad
      ? "border-danger/60 bg-danger/10 text-danger"
      : "border-unverified/60 bg-unverified/10 text-unverified";

  return (
    <section aria-live="polite" className="flex flex-col gap-4 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
      <div className={`flex flex-col gap-1 rounded-lg border px-4 py-3 ${tone}`}>
        <p className="text-xl font-bold leading-snug">{keep(headline.title)}</p>
        {headline.detail && <p className="text-sm leading-relaxed text-foreground">{keep(headline.detail)}</p>}
      </div>
      {[...flags.slice(1), ...notes].map((f) => (
        <div key={f.title} className={`flex flex-col gap-1 rounded-lg border px-4 py-3 ${FLAG_TONE[f.tone]}`}>
          <p className="text-sm font-semibold leading-snug">{keep(f.title)}</p>
          {f.detail && <p className="text-sm leading-relaxed text-foreground">{keep(f.detail)}</p>}
        </div>
      ))}

      <dl className="flex flex-col">
        <div className="flex flex-col gap-1 pb-3">
          <dt className="text-xs text-foreground-dim">ยอดเงิน</dt>
          <dd className="font-display text-4xl font-bold tracking-tight text-foreground">{formatBaht(result.slip.amount)}</dd>
          {result.amountCheck?.matches && (
            <dd className="text-sm text-verified">ตรงกับยอดออเดอร์ {formatBaht(result.amountCheck.expected)}</dd>
          )}
          {!result.amountCheck && <dd className="text-sm text-foreground-dim">{keep("ไม่ได้ใส่ยอดออเดอร์ จึงยังไม่ได้เทียบยอด")}</dd>}
        </div>
        <div className="flex flex-col gap-1 border-t border-surface-border-soft py-3">
          <dt className="text-xs text-foreground-dim">วันเวลาที่โอน</dt>
          <dd className="text-sm text-foreground">{formatDateTime(result.slip.transferredAt)}</dd>
        </div>
        <Party label="ผู้รับ" party={result.slip.receiver} chip={result.slip.receiverStatus} />
        <Party label="ผู้โอน" party={result.slip.sender} />
        <div className="flex flex-col gap-1 border-t border-surface-border-soft py-3">
          <dt className="text-xs text-foreground-dim">เลขอ้างอิงรายการ</dt>
          <dd className="break-all font-mono text-sm text-foreground">{result.slip.transRef}</dd>
        </div>
      </dl>

      {(result.slip.receiverStatus !== "mismatch" || usedAt) && (
        <UsedMark
          key={result.slip.transRef}
          transRef={result.slip.transRef}
          initialUsedAt={usedAt}
          onChange={(next) => setUnmarked(next === null)}
        />
      )}

      <div className="flex flex-col gap-1 text-xs leading-relaxed text-foreground-dim">
        {result.source === "image-cache" && <p>{keep("รูปนี้เคยตรวจแล้ว จึงตอบจากบันทึกของร้าน ไม่ได้ส่งไปตรวจซ้ำ และไม่เสียโควตา")}</p>}
        <p>{keep("หน้านี้ช่วยตรวจสลิปเท่านั้น การยืนยันออเดอร์ยังทำเองตามปกติ")}</p>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center rounded-full border border-surface-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground-dim hover:bg-surface-2"
      >
        ตรวจสลิปใบถัดไป
      </button>
    </section>
  );
}

function Quota({ quota, configured }: { quota: QuotaView | null; configured: boolean }) {
  if (!configured)
    return (
      <p role="alert" className="rounded-xl border border-unverified/60 bg-unverified/10 p-4 text-sm leading-relaxed text-unverified">
        ยังไม่ได้ใส่ key ของ EasySlip ในระบบ จึงยังตรวจสลิปไม่ได้ กรุณาแจ้งเจ้าของร้าน
      </p>
    );
  if (!quota)
    return <p className="text-sm text-foreground-dim">อ่านจำนวนโควตาจาก EasySlip ไม่ได้ในตอนนี้ (ยังตรวจสลิปได้ตามปกติ)</p>;

  const max = quota.max;
  const share = max ? quota.used / max : 0;
  const remaining = quota.remaining ?? (max !== null ? Math.max(0, max - quota.used) : null);
  const empty = remaining !== null && remaining <= 0;
  const warn = !empty && max !== null && share >= QUOTA_WARN_SHARE;
  const bar = empty || warn ? "bg-unverified" : "bg-steel";

  return (
    <section className="flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">โควตาเดือนนี้</h2>
        <p className="text-sm text-foreground-muted">
          ใช้ไป <span className="font-semibold text-foreground">{formatCount(quota.used)}</span>
          {max !== null ? ` / ${formatCount(max)} ใบ` : " ใบ (ไม่จำกัด)"}
        </p>
      </div>
      {max !== null && (
        <div className="h-2 overflow-hidden rounded-full bg-surface-3" aria-hidden>
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.min(100, share * 100)}%` }} />
        </div>
      )}
      {empty && <p className="text-sm font-semibold text-danger">{keep("โควตาเดือนนี้หมดแล้ว กรุณาแจ้งเจ้าของร้าน")}</p>}
      {warn && remaining !== null && (
        <p className="text-sm font-semibold text-unverified">ใกล้หมดแล้ว เหลืออีก {formatCount(remaining)} ใบ กรุณาแจ้งเจ้าของร้าน</p>
      )}
      <p className="text-xs text-foreground-dim">{keep("สลิปใบเดิมที่ตรวจซ้ำไม่นับโควตา")}</p>
    </section>
  );
}

/** Ten rows first — the full list (up to 30) pushed the logout button ~7,000 px down at 390 (designer 08/10). */
const RECENT_FIRST = 10;

function RecentLog({ recent }: { recent: SlipCheckRecord[] }) {
  const [all, setAll] = useState(false);
  if (recent.length === 0) return null;
  const shown = all ? recent : recent.slice(0, RECENT_FIRST);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground">ตรวจล่าสุด</h2>
      <ul className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
        {shown.map((r) => (
          <li key={r.transRef} className="flex flex-col gap-1 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-foreground">{formatBaht(r.amountSatang / 100)}</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RECEIVER_CHIP[r.receiverStatus].className}`}>
                {RECEIVER_CHIP[r.receiverStatus].label}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground-muted">
              โอน {formatDateTime(r.transferredAt)} · ตรวจล่าสุด {formatDateTime(r.lastCheckedAt)}
              {r.checkCount > 1 ? ` · ตรวจ ${formatCount(r.checkCount)} ครั้ง` : ""}
              {r.usedAt ? " · ใช้กับออเดอร์แล้ว" : ""}
            </p>
            <p className="break-all font-mono text-xs text-foreground-dim">{r.transRef}</p>
          </li>
        ))}
      </ul>
      {!all && recent.length > RECENT_FIRST && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="inline-flex items-center justify-center rounded-full border border-surface-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground-dim hover:bg-surface-2"
        >
          ดูเพิ่มอีก {formatCount(recent.length - RECENT_FIRST)} รายการ
        </button>
      )}
    </section>
  );
}

export function SlipChecker({
  configured,
  initialQuota,
  recent,
}: {
  configured: boolean;
  initialQuota: QuotaView | null;
  recent: SlipCheckRecord[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [expected, setExpected] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<OkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaView | null>(initialQuota);

  // Free the last preview's blob: URL when the page goes away.
  const previewRef = useRef<string | null>(null);
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  function choose(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setPreview(previewRef.current);
    setFile(next);
  }

  function reset() {
    choose(null);
    setExpected("");
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || pending) return;
    setPending(true);
    setError(null);
    setResult(null);
    try {
      let image: Blob;
      try {
        image = await prepareImage(file);
      } catch {
        setError(errorText("PREPARE_FAILED"));
        return;
      }
      const body = new FormData();
      body.append("image", image, file.name || "slip.jpg");
      if (expected.trim()) body.append("expected", expected.trim());
      let res: Response;
      try {
        res = await fetch("/staff/api/verify", { method: "POST", body });
      } catch {
        setError(errorText("NETWORK"));
        return;
      }
      if (res.status === 404) {
        setError(errorText("SESSION"));
        return;
      }
      if (res.status === 403) {
        setError(errorText("FORBIDDEN"));
        return;
      }
      let data: SlipCheckResponse;
      try {
        data = (await res.json()) as SlipCheckResponse;
      } catch {
        setError(errorText("BAD_RESPONSE"));
        return;
      }
      if (!data.ok) {
        setError(errorText(data.error, data.retryAfterSeconds));
        // Keep the quota box honest: EasySlip just said the month is used up.
        if (data.error === "QUOTA_EXCEEDED") setQuota((q) => (q ? { ...q, used: q.max ?? q.used, remaining: 0 } : q));
        return;
      }
      setResult(data);
      if (data.quota) setQuota(data.quota);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* While a verdict is on screen it comes first; the quota card (with its own yellow warning) moves under it. */}
      {!result && <Quota quota={quota} configured={configured} />}

      {configured && !result && (
        <form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-surface-border-soft bg-surface-1 p-5">
          <label
            htmlFor="slip-image"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-surface-border bg-surface-2 px-4 py-6 text-center transition-colors hover:border-foreground-dim"
          >
            {preview ? (
              // A local preview of the chosen file (blob: URL) — nothing is uploaded until "ตรวจสลิปนี้".
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="รูปสลิปที่เลือก" className="max-h-72 w-auto rounded-md object-contain" />
            ) : (
              <span className="text-4xl" aria-hidden>
                🧾
              </span>
            )}
            <span className="text-sm font-semibold text-foreground">
              {preview ? "แตะเพื่อเปลี่ยนรูป" : "แตะเพื่อถ่ายรูป หรือเลือกรูปสลิป"}
            </span>
            <span className="text-xs text-foreground-dim">รูปแคปหน้าจอจากแอปธนาคารชัดที่สุด</span>
            <input
              ref={inputRef}
              id="slip-image"
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                choose(e.target.files?.[0] ?? null);
                setError(null);
              }}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="slip-expected">
            ยอดที่ลูกค้าต้องโอน (บาท) — ไม่ใส่ก็ได้
            <input
              id="slip-expected"
              name="expected"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="เช่น 1,290"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              className="rounded-md border border-surface-border bg-surface-2 px-3 py-3 text-base text-foreground"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-lg border border-danger/60 bg-danger/10 px-4 py-3 text-sm leading-relaxed text-foreground">
              {keep(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={!file || pending}
            className="inline-flex items-center justify-center rounded-full bg-ember px-6 py-3 text-base font-semibold text-[#181008] transition-colors hover:bg-ember-strong disabled:opacity-50"
          >
            {pending ? "กำลังตรวจกับธนาคาร…" : "ตรวจสลิปนี้"}
          </button>
        </form>
      )}

      {result && <Result result={result} onNext={reset} />}
      {result && <Quota quota={quota} configured={configured} />}

      <RecentLog recent={recent} />
    </div>
  );
}
