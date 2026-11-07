"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isOwner, ownerLogout } from "@/lib/owner/auth";
import { bangkokInstant, checkRound, readBill, readRates, weekProfit } from "@/lib/owner/bill-rules";
import { saveRound, webOrdersForBill } from "@/lib/owner/bills";
import { lineSalesBetween } from "@/lib/staff/daily-sales";
import { WAREHOUSE_SHIPPING_FEE_THB } from "@/lib/woo/order-json";
import { CODE_PATTERN, costChanges, readCostFile, type CostChange, type CostRow } from "@/lib/owner/cost-rules";
import { currentCosts, saveCosts } from "@/lib/owner/costs";
import { readXlsx } from "@/lib/owner/xlsx-read";

export async function ownerLogoutAction(): Promise<void> {
  await ownerLogout();
  redirect("/staff/owner");
}

/** Server Actions take 1 MB by default; both Excel files are far below that, and anything above is not one of them. */
const MAX_UPLOAD = 900 * 1024;

async function uploadedSheets(form: FormData, field: string) {
  const file = form.get(field);
  if (!(file instanceof Blob) || file.size === 0) throw new Error("ยังไม่ได้เลือกไฟล์");
  if (file.size > MAX_UPLOAD) throw new Error("ไฟล์ใหญ่เกินไป");
  return readXlsx(Buffer.from(await file.arrayBuffer()));
}

export type CostPreview =
  | { state: "idle" }
  | { state: "error"; message: string }
  | { state: "saved"; count: number }
  | { state: "preview"; fileName: string; total: number; changes: CostChange[]; noNumber: string[]; payload: string };

/** Step 1: read the file in memory and show what would change. Nothing is stored. */
export async function previewCostsAction(_prev: CostPreview, form: FormData): Promise<CostPreview> {
  if (!(await isOwner())) return { state: "error", message: "กรุณาเข้าสู่ระบบใหม่" };
  try {
    const file = readCostFile(await uploadedSheets(form, "file"));
    const changes = costChanges(currentCosts(), file.rows);
    const name = form.get("file");
    return {
      state: "preview",
      fileName: name instanceof File ? name.name.slice(0, 100) : "",
      total: file.rows.length,
      changes,
      noNumber: file.noNumber,
      payload: JSON.stringify(changes.map((c) => ({ code: c.code, satang: c.toSatang }))),
    };
  } catch (e) {
    return { state: "error", message: e instanceof Error ? e.message : "อ่านไฟล์ไม่ได้" };
  }
}

export type BillCheckState = { error: string | null };

const LOCAL_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** The week's check: read both files in memory, compare, keep what the check found, show it. */
export async function checkBillAction(_prev: BillCheckState, form: FormData): Promise<BillCheckState> {
  if (!(await isOwner())) return { error: "กรุณาเข้าสู่ระบบใหม่" };
  const from = String(form.get("from") ?? "");
  const to = String(form.get("to") ?? "");
  if (!LOCAL_TIME.test(from) || !LOCAL_TIME.test(to) || from >= to) return { error: "ช่วงเวลาของรอบไม่ถูกต้อง" };
  let id: number;
  try {
    const bill = readBill(await uploadedSheets(form, "bill"));
    const rates = readRates(await uploadedSheets(form, "rates"));
    const cost = new Map([...currentCosts()].map(([code, satang]) => [code, satang / 100]));
    const result = checkRound({ bill, rates, cost, orders: webOrdersForBill(bangkokInstant(from)), from, to, shippingBaht: WAREHOUSE_SHIPPING_FEE_THB });
    id = saveRound({
      from,
      to,
      totals: result.totals,
      week: weekProfit(result.totals, lineSalesBetween(bangkokInstant(from), bangkokInstant(to))),
      diffs: result.diffs,
      orders: result.inRound.map((o) => ({ run: o.run || o.id, no: o.bill?.no ?? null, at: o.at, qty: o.qty, paid: o.total, rateTotal: o.rateTotal, ship: o.bill?.ship ?? null, billed: o.bill?.shop ?? null })),
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "อ่านไฟล์ไม่ได้" };
  }
  revalidatePath("/staff/owner");
  redirect(`/staff/owner/bill?round=${id}`);
}

/** Step 2: store the changes the owner just read. */
export async function saveCostsAction(_prev: CostPreview, form: FormData): Promise<CostPreview> {
  if (!(await isOwner())) return { state: "error", message: "กรุณาเข้าสู่ระบบใหม่" };
  let rows: CostRow[];
  try {
    const parsed: unknown = JSON.parse(String(form.get("payload") ?? ""));
    if (!Array.isArray(parsed)) throw new Error("shape");
    rows = parsed.map((r: CostRow) => {
      if (typeof r.code !== "string" || !CODE_PATTERN.test(r.code) || !Number.isInteger(r.satang) || r.satang <= 0) throw new Error("shape");
      return { code: r.code, satang: r.satang };
    });
  } catch {
    return { state: "error", message: "ข้อมูลไม่ครบ ลองเลือกไฟล์ใหม่" };
  }
  const count = saveCosts(rows, String(form.get("fileName") ?? ""));
  revalidatePath("/staff/owner");
  return { state: "saved", count };
}
