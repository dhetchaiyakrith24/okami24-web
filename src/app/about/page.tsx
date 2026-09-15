import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { canonicalFor } from "@/lib/seo";
import { brandsWithProducts } from "@/lib/brand-visibility";
import { thaiTypography } from "@/lib/thai-typography";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description: "OKami24 คือใคร ทำไมของแท้ ราคาตรง และบริการจริงถึงเป็นหัวใจของร้าน พร้อมนโยบายเคลมสินค้าและช่องทางติดต่อ",
  ...canonicalFor("/about"),
};

export default function AboutPage() {
  // Only feature brands with a real, currently-catalogued product — see brand-visibility.ts.
  const brands = brandsWithProducts();
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="ของแท้ ราคาตรง บริการจริง"
        description="การบริการที่ดี คือสิ่งที่ OKami24 มีให้คุณ — ร้านพอตซิสเต็ม พอตใช้แล้วทิ้ง และน้ำยาของแท้ จากคนขายที่รู้จักสินค้าจริง"
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">OKami24 คือใคร</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              OKami24 (ย่อว่า OKM) ขายพอตซิสเต็ม พอตใช้แล้วทิ้ง และน้ำยาของแท้จากแบรนด์ที่เรามั่นใจ ตั้งราคาตรง ๆ ไม่ปั่นราคา
              ทักมาแล้วแอดมินตอบเอง ไม่ใช่บอท
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">สินค้าที่เราคัดสรร</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              เว็บนี้รวมพอตซิสเต็ม พอตคิท พอตใช้แล้วทิ้ง หัวพอต คอยล์ และ IQOS จาก {brands.length} แบรนด์ที่เราคัดมา เช่น UWELL VOOPOO SALTHUB
              มีหน้าเปรียบเทียบและตัวช่วยเลือกสินค้าไว้ช่วยหารุ่นที่เหมาะกับคุณ สเปกอ้างอิงจากเว็บทางการของแบรนด์เป็นหลัก
              รุ่นไหนเข้าหน้าทางการไม่ได้ ก็เช็คไขว้กับร้านค้าและรีวิวแทน ทุกค่าติดป้ายว่า <span className="text-verified">ยืนยันแล้ว</span> หรือ{" "}
              <span className="text-unverified">ยังไม่ยืนยัน</span> กำกับไว้ ค่าที่ยืนยันไม่ได้เราบอกตรง ๆ ไม่เดา
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">บริการหลังการขาย</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              ของมีปัญหาเคลมได้ภายใน 7 วันนับจากวันที่ได้รับของ ต้องมีคลิปตอนแกะกล่อง ไม่มีคลิป พิจารณาให้ไม่ได้
              เงื่อนไขทั้งหมดอยู่ที่หน้านโยบายเคลม
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">ติดต่อเรา</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              ดูสินค้าและราคาได้ครบทั้งเว็บ ส่วนการสั่งซื้อ ตอนนี้สั่งทางไลน์ทางเดียว ทักมาบอกรุ่น สี หรือกลิ่นที่อยากได้
              แอดมินสรุปยอดรวมค่าส่งและวิธีโอนให้ในแชท โอนแล้วแอดมินตรวจยอดก่อนจัดส่ง พร้อมเลขพัสดุให้ติดตาม ทักไลน์ OA{" "}
              <Link href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-red">
                {CONTACT.lineId}
              </Link>{" "}
              ได้เลย แอดมินช่วยเช็คสต๊อกและแนะนำสินค้าที่เหมาะกับคุณ
            </p>
            <p className="mt-3 text-sm text-foreground-muted">
              อ่านต่อ:{" "}
              <Link href="/how-to-order" className="text-foreground hover:text-red">
                วิธีสั่งซื้อ
              </Link>{" "}
              ·{" "}
              <Link href="/shipping" className="text-foreground hover:text-red">
                การจัดส่ง
              </Link>{" "}
              ·{" "}
              <Link href="/contact" className="text-foreground hover:text-red">
                ติดต่อเรา
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">รูปสินค้า</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              รูปสินค้าในเว็บนี้เป็นรูปจริงของรุ่นนั้น รุ่นเรือธงบางรุ่นมีแกลเลอรีภาพจากแบรนด์เพิ่ม พร้อมระบุแหล่งที่มาไว้ใต้ภาพ
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground">Compliance</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground-muted">
              {/* THAI_STYLE §5 group ก text — wording untouchable; thaiTypography() only adds the owner's
                  render-time joiner inside "กล่าวอ้าง" (round 30.4ค closing, 2026-09-16). */}
              {thaiTypography("เว็บไซต์นี้จัดทำขึ้นสำหรับผู้มีอายุครบ 21 ปีบริบูรณ์ขึ้นไปในเขตพื้นที่ที่การซื้อขายถูกกฎหมาย ไม่มีการกล่าวอ้างด้านสุขภาพ ความปลอดภัย หรือการเลิกบุหรี่ใดๆ นิโคตินเป็นสารเสพติด")}
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
                  {/* Round 30.4 wiring ข1: the Thai lede approved in 30.3ข (every brand on the storefront
                      has one); `description` is the English fallback. This page is Thai prose throughout. */}
                  <p className="mt-1 text-sm text-foreground-muted">{thaiTypography(b.descriptionTh ?? b.description)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}
