import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A reading column inside a wide Container, centred on wide screens (owner 13/11 "อะไรที่เป็นแบบนี้และไม่อยู่ตรงกลาง
 * จัดให้อยู่ตรงกลางหน่อยนะครับ"): a section narrower than the page — a review clip, an article body, an FAQ list — sat
 * against the Container's left edge with an empty band on its right (~630px at 2000px wide). From `lg` the column sits
 * centred with its heading inside it, so heading and body read as one block. Below `lg` it adds nothing: phones and
 * tablets keep their layout to the pixel (`className` carries the block's own layout at every width).
 */
export const MEASURE_CLASS = {
  "2xl": "lg:mx-auto lg:w-full lg:max-w-2xl",
  "3xl": "lg:mx-auto lg:w-full lg:max-w-3xl",
} as const;

export type MeasureSize = keyof typeof MEASURE_CLASS;

export function Measure({ size = "3xl", className, children }: { size?: MeasureSize; className?: string; children: ReactNode }) {
  return <div className={cn(MEASURE_CLASS[size], className)}>{children}</div>;
}
