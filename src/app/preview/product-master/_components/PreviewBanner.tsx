import { Container } from "@/components/ui/Container";

/**
 * Makes the pre-publication nature of this data impossible to miss — every field on these
 * pages comes from an unpublished ProductMaster draft (Phase 2.6/2.7), never the live catalog.
 */
export function PreviewBanner() {
  return (
    <div className="border-b border-ember/30 bg-ember-soft/20">
      <Container className="flex flex-wrap items-center gap-2 py-3 text-xs">
        <span className="label-mono font-semibold text-ember">PREVIEW · INTERNAL ONLY</span>
        <span className="text-foreground-muted">
          ข้อมูลจาก ProductMaster draft ที่ยัง <strong>unpublished</strong> — ไม่ใช่หน้าร้านจริง
          ไม่มีการ index และไม่เชื่อมกับ catalog ที่ลูกค้าเห็น ราคาที่แสดงเป็นค่าอ้างอิงจากระบบปฏิบัติการ (Shipnity)
          เท่านั้น ยังไม่ใช่ราคาขายที่ยืนยันแล้ว
        </span>
      </Container>
    </div>
  );
}
