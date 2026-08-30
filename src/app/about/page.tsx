import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/data/brands";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description: "OKami24 คือใคร ทำไมของแท้ ราคาตรง และบริการจริงถึงเป็นหัวใจของร้าน พร้อมนโยบายเคลมสินค้าและช่องทางติดต่อ",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="ของแท้ ราคาตรง บริการจริง"
        description="การบริการที่ดี คือสิ่งที่ OKami24 มีให้คุณ — ร้านอุปกรณ์พอดซิสเต็ม ดิสโพส และน้ำยา คัดสรรจากคนที่เข้าใจสินค้าจริง"
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">OKami24 คือใคร</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              OKami24 (ชื่อย่อ OKM) คัดสรรอุปกรณ์พอดซิสเต็ม ดิสโพส และน้ำยาของแท้จากแบรนด์ที่เรามั่นใจ พร้อมตั้งราคาให้ตรงไปตรงมา
              ไม่ปั่นราคา และดูแลลูกค้าด้วยบริการที่ตอบกลับจริง ไม่ใช่แค่ระบบอัตโนมัติ
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">สินค้าที่เราคัดสรร</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              เว็บไซต์นี้รวบรวมอุปกรณ์พอดซิสเต็ม พอดคิท ดิสโพส และคาร์ทริดจ์จากสามแบรนด์หลัก — UWELL, VOOPOO และ SALTHUB
              พร้อมเครื่องมือเปรียบเทียบและ Product Finder ที่ช่วยหาสินค้าที่เหมาะกับคุณ ทุกสเปกถูกวิจัยจากหน้าทางการของแบรนด์
              และติดป้าย <span className="text-verified">verified</span> หรือ{" "}
              <span className="text-unverified">unverified</span> กำกับไว้เสมอ — ข้อมูลที่ยืนยันไม่ได้จะถูกระบุไว้ตรงๆ
              แทนการเดา
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">บริการหลังการขาย</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              หากสินค้ามีปัญหา OKami24 เปิดให้เคลมได้ภายใน 7 วันหลังได้รับสินค้า โดยต้องมีคลิปวิดีโอตอนแกะกล่องเป็นหลักฐาน
              ประกอบการพิจารณา
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">ติดต่อเรา</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              ช่องทางหลักในการสอบถามและสั่งซื้อคือ LINE OA{" "}
              <Link href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-red">
                {CONTACT.lineId}
              </Link>{" "}
              แอดมินพร้อมช่วยตรวจสอบสต๊อกและแนะนำสินค้าที่เหมาะกับคุณ
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">แนวทางการออกแบบ</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              ภาพประกอบสินค้าแต่ละชิ้นในเว็บไซต์นี้เป็นภาพเวกเตอร์ต้นฉบับที่สร้างจากข้อมูลสเปกจริงของสินค้านั้นๆ
              (รูปทรง ประเภทหน้าจอ สถานะแฟล็กชิป) ใช้เป็นภาพสำรองเมื่อยังไม่มีภาพถ่ายทางการ ส่วนสินค้าแฟล็กชิปบางรายการ
              มีแกลเลอรีภาพถ่ายทางการประกอบ ระบุแหล่งที่มาไว้อย่างชัดเจน
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">Compliance</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              เว็บไซต์นี้จัดทำขึ้นสำหรับผู้มีอายุครบ 21 ปีบริบูรณ์ขึ้นไปในเขตพื้นที่ที่การซื้อขายถูกกฎหมาย
              ไม่มีการกล่าวอ้างด้านสุขภาพ ความปลอดภัย หรือการเลิกบุหรี่ใดๆ นิโคตินเป็นสารเสพติด
            </p>
          </section>

          <section>
            <span className="label-mono text-xs text-foreground-dim">แบรนด์ที่เราจำหน่าย</span>
            <ul className="mt-4 flex flex-col gap-3">
              {brands.map((b) => (
                <li key={b.id} className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
                  <Link href={`/brands/${b.slug}`} className="font-semibold text-foreground hover:text-ember">
                    {b.name}
                  </Link>
                  <p className="mt-1 text-sm text-foreground-muted">{b.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
