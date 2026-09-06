import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";

/**
 * Service-page copy (how-to-order, shipping, contact, privacy, claims draft) in the three site
 * languages — owner instruction 2026-09-06 (ง): "แปล en/zh ทั้ง 5 หน้าหลังข้อความไทยนิ่ง".
 *
 * Shape: every page has ONE typed copy object per locale (`Record<Locale, …>`), so a missing
 * language fails `tsc` instead of silently showing Thai to an English reader. Thai is the source
 * text (owner-approved facts, BSOT §3/§8–§12); en/zh were written by the writer agent from that
 * Thai on 2026-09-06 and must not add facts the Thai does not have.
 *
 * Inline emphasis lives here as small helpers so the copy files stay readable.
 */
export type ServiceCopy<T> = Record<Locale, T>;

/** bold, normal colour — a phrase the eye should land on */
export function B({ children }: { children: ReactNode }) {
  return <strong className="text-foreground">{children}</strong>;
}

/** bold, ember — the one warning per page that must not be missed (designer 2026-09-06) */
export function E({ children }: { children: ReactNode }) {
  return <strong className="text-ember">{children}</strong>;
}
