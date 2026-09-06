import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { canonicalFor } from "@/lib/seo";
import { AgeNote, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt } from "@/components/content/ServicePage";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md). Facts from
// docs/BUSINESS_SOURCE_OF_TRUTH.md §10 — fee/threshold plus the owner's 2026-09-06 answers
// (15:00 cut-off after payment is reported, 1–3 days, Mon–Sat, EMS + Flash, Thailand only).
export const metadata: Metadata = {
  title: "การจัดส่ง",
  description: "ค่าส่ง OKami24 60 บาททั่วประเทศ ยอด 500 บาทขึ้นไปส่งฟรี · โอนก่อน 15:00 ส่งวันเดียวกัน ถึงใน 1–3 วัน · ไปรษณีย์ไทย EMS และ Flash Express มีเลขพัสดุทุกคำสั่งซื้อ",
  ...canonicalFor("/shipping"),
};

export default function ShippingPage() {
  return (
    <>
      <PageHeader
        eyebrow="ค่าส่งและเวลา"
        title="การจัดส่ง"
        description="ค่าส่งเท่าไหร่ ส่งยังไง ตามพัสดุที่ไหน — บอกไว้ตรงนี้หมด ไม่มีค่าใช้จ่ายแอบซ่อน"
        meta={
          <SummaryCards
            items={[
              { label: "ค่าส่ง", value: "60 บาท", note: "อัตราเดียวทั่วประเทศ · ฟรีเมื่อ 500 บาทขึ้นไป" },
              { label: "ถึงมือใน", value: "1–3 วัน", note: "โอนก่อน 15:00 ส่งวันเดียวกัน" },
              { label: "ติดตามพัสดุ", value: "มีเลขพัสดุทุกคำสั่งซื้อ", note: "ดูได้ในหน้าสถานะคำสั่งซื้อ" },
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
            <p>
              <strong className="text-foreground">โอนและกดแจ้งชำระเงินก่อน 15:00 เราจัดส่งให้ในวันเดียวกัน</strong> หลัง 15:00 ส่งวันทำการถัดไป
            </p>
            <p>ส่งจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ สั่งวันอาทิตย์ของจะออกวันจันทร์</p>
            <p>
              ส่งออกแล้ว <strong className="text-foreground">ถึงมือภายใน 1–3 วัน</strong>
            </p>
          </ServiceSection>

          <ServiceSection title="ติดตามพัสดุ">
            <p>พอ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ขึ้นสถานะ “จัดส่งแล้ว” คุณจะเห็นเลขพัสดุในหน้าสถานะคำสั่งซื้อ ใช้เลขนี้ตามของได้เอง</p>
            <p>ลิงก์หน้าสถานะคือลิงก์เฉพาะของ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์คุณ เปิดดูได้ทุกเมื่อ ไม่ต้องรอถามแอดมิน</p>
            <p>
              เราส่งด้วย <strong className="text-foreground">ไปรษณีย์ไทย (EMS)</strong> และ <strong className="text-foreground">Flash Express</strong> เลือกให้ตามพื้นที่ปลายทาง เลขพัสดุที่ได้จะระบุไว้ว่าเป็นของเจ้าไหน ใช้ตามของในเว็บหรือแอปของขนส่งเจ้านั้นได้เลย
            </p>
          </ServiceSection>

          <ServiceSection title="ส่งต่างประเทศ">
            <p>
              <strong className="text-foreground">ตอนนี้ส่งเฉพาะในประเทศไทย</strong> ยังไม่รับส่งต่างประเทศ
            </p>
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
