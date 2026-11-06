"use client";

import { useActionState } from "react";
import { previewCostsAction, saveCostsAction, type CostPreview } from "@/app/staff/owner/actions";

const IDLE: CostPreview = { state: "idle" };
const baht = (satang: number | null) => (satang === null ? "ใหม่" : `฿${(satang / 100).toLocaleString("th-TH")}`);
const BUTTON = "inline-flex min-h-11 w-fit items-center rounded-full bg-ember px-5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50";

/** Pick the owner's cost Excel → read what would change → save. The file stays in memory on the server, only its costs are kept. */
export function CostUpload() {
  const [preview, previewAction, previewing] = useActionState(previewCostsAction, IDLE);
  const [saved, saveAction, saving] = useActionState(saveCostsAction, IDLE);
  const showPreview = preview.state === "preview" && saved.state !== "saved";

  return (
    <div className="flex flex-col gap-4">
      <form action={previewAction} className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4">
        <label className="flex flex-col gap-1.5 text-sm text-foreground-muted">
          ไฟล์ทุน (.xlsx)
          <input name="file" type="file" accept=".xlsx" required className="min-h-11 text-sm text-foreground" />
        </label>
        <button type="submit" disabled={previewing} className={BUTTON}>
          {previewing ? "กำลังอ่าน…" : "อ่านไฟล์"}
        </button>
      </form>

      {preview.state === "error" && <p className="text-sm text-danger">{preview.message}</p>}
      {saved.state === "error" && <p className="text-sm text-danger">{saved.message}</p>}
      {saved.state === "saved" && <p className="text-sm text-verified">บันทึกแล้ว {saved.count} รายการ</p>}

      {preview.state === "preview" && showPreview && (
        <section className="flex flex-col gap-3">
          <p className="text-sm text-foreground-muted">
            อ่านได้ {preview.total} รายการ · เปลี่ยน {preview.changes.length} รายการ
            {preview.noNumber.length > 0 && <span className="text-unverified"> · ไม่มีตัวเลขทุน {preview.noNumber.length} รายการ ข้ามไป</span>}
          </p>
          {preview.changes.length > 0 ? (
            <>
              <ul className="flex max-h-96 flex-col divide-y divide-surface-border-soft overflow-y-auto rounded-xl border border-surface-border-soft bg-surface-1 text-sm">
                {preview.changes.map((c) => (
                  <li key={c.code} className="flex items-baseline justify-between gap-3 px-4 py-2 tabular-nums">
                    <span className="text-foreground">{c.code}</span>
                    <span className="text-foreground-muted">
                      {baht(c.fromSatang)} → <span className="text-foreground">{baht(c.toSatang)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <form action={saveAction}>
                <input type="hidden" name="payload" value={preview.payload} />
                <input type="hidden" name="fileName" value={preview.fileName} />
                <button type="submit" disabled={saving} className={BUTTON}>
                  {saving ? "กำลังบันทึก…" : `บันทึก ${preview.changes.length} รายการ`}
                </button>
              </form>
            </>
          ) : (
            <p className="text-sm text-foreground-muted">ไฟล์นี้ตรงกับทุนในระบบทุกรายการ</p>
          )}
        </section>
      )}
    </div>
  );
}
