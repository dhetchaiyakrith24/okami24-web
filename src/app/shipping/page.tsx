import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { canonicalFor } from "@/lib/seo";
import { AgeNote, LineLink, PendingFact, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt } from "@/components/content/ServicePage";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md). The only shipping facts in
// docs/BUSINESS_SOURCE_OF_TRUTH.md §10 are the 60 THB fee, the 500 THB free threshold and
// "tracking provided" — delivery time, carrier and cut-off are owner questions (PendingFact).
export const metadata: Metadata = {
  title: "การจัดส่ง",
  description: "ค่าจัดส่ง OKami24 — 60 บาททั่วประเทศ ยอด 500 บาทขึ้นไปส่งฟรี ทุก​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์มีเลขพัสดุให้ติดตามหลังจัดส่ง",
  ...canonicalFor("/shipping"),
};

export default function ShippingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shipping"
        title="การจัดส่ง"
        description="ค่าส่งเท่าไหร่ ส่งยังไง ตามพัสดุที่ไหน — บอกไว้ตรงนี้หมด ไม่มีค่าใช้จ่ายแอบซ่อน"
        meta={
          <SummaryCards
            items={[
              { label: "ค่าส่ง", value: "60 บาท", note: "อัตราเดียวทั่วประเทศ" },
              { label: "ส่งฟรี", value: "500 บาทขึ้นไป", note: "ระบบตัดค่าส่งให้เองในตะกร้า" },
              { label: "ติดตามพัสดุ", value: "มีเลขพัสดุทุก​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์", note: "ดูได้ในหน้าสถานะคำสั่งซื้อ" },
            ]}
          />
        }
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <ServiceSection title="ค่าจัดส่ง">
            <div className="overflow-x-auto rounded-xl border border-surface-border-soft bg-surface-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-mono text-xs text-foreground-dim">
                    <th className="px-4 py-3 text-left font-normal">ยอดสั่งซื้อ</th>
                    <th className="px-4 py-3 text-left font-normal">ค่าจัดส่ง</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  <tr className="border-t border-surface-border-soft">
                    <td className="px-4 py-3">ต่ำกว่า 500 บาท</td>
                    <td className="px-4 py-3 font-semibold">60 บาท</td>
                  </tr>
                  <tr className="border-t border-surface-border-soft">
                    <td className="px-4 py-3">500 บาทขึ้นไป</td>
                    <td className="px-4 py-3 font-semibold text-verified">ฟรี</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>ค่าส่งอัตราเดียวทั่วประเทศ ระบบคิดให้อัตโนมัติในหน้าตะกร้า คุณเห็นยอดรวมทั้งหมดก่อนกดยืนยันเสมอ</p>
          </ServiceSection>

          <ServiceSection title="ส่งเมื่อไหร่">
            <p>
              เราจะจัดส่งหลังแอดมินตรวจยอดโอนและอนุมัติ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์แล้ว ก่อนหน้านั้น​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์จะค้างที่สถานะ “<span className="whitespace-nowrap">รอตรวจสอบโดยแอดมิน</span>”
            </p>
            <PendingFact
              question="ตัดรอบส่งกี่โมง สั่งวันนี้ส่งวันไหน ใช้เวลาถึงมือกี่วัน เสาร์อาทิตย์ส่งไหม"
              fallback={<>อยากรู้ว่าสั่งวันนี้จะได้ของวันไหน ทักไลน์ <LineLink /> ถามก่อนสั่งได้เลย แอดมินบอกรอบส่งล่าสุดให้</>}
            />
          </ServiceSection>

          <ServiceSection title="ติดตามพัสดุ">
            <p>พอ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ขึ้นสถานะ “จัดส่งแล้ว” คุณจะเห็นเลขพัสดุในหน้าสถานะคำสั่งซื้อ ใช้เลขนี้ตามของได้เอง</p>
            <p>ลิงก์หน้าสถานะคือลิงก์เฉพาะของ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์คุณ เปิดดูได้ทุกเมื่อ ไม่ต้องรอถามแอดมิน</p>
            <PendingFact question="ใช้ขนส่งเจ้าไหน (ไปรษณีย์ไทย / Flash / Kerry / J&T หรือหลายเจ้า)" />
          </ServiceSection>

          <ServiceSection title="ส่งต่างประเทศ">
            <PendingFact
              question="รับส่งต่างประเทศไหม ถ้าไม่รับให้เขียนว่า “ตอนนี้ส่งเฉพาะในประเทศไทย”"
              fallback={<>เรื่องส่งต่างประเทศ ทักไลน์ <LineLink /> ถามก่อนสั่ง</>}
            />
          </ServiceSection>

          <ServiceSection title="ของมีปัญหาตอนได้รับ">
            <p>
              <strong className="text-foreground">ถ่ายคลิปตอนแกะกล่องไว้ทุกครั้ง</strong> ถ้าสินค้ามีปัญหา เคลมได้ภายใน 7 วันหลังได้รับของ และคลิปแกะกล่องคือหลักฐานที่เราต้องใช้พิจารณา
            </p>
            <p className="text-sm">
              อ่านต่อ: <Link href="/how-to-order" className="text-foreground hover:text-red">วิธีสั่งซื้อ</Link> · <Link href="/contact" className="text-foreground hover:text-red">ติดต่อเรา</Link>
            </p>
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
