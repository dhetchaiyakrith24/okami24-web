import type { Metadata } from "next";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { assertPreviewAllowedInThisEnvironment } from "@/app/preview/product-master/_components/preview-guard";
import {
  AgeNote,
  InfoCard,
  LineLink,
  NumberedSteps,
  PendingFact,
  SERVICE_PAGES_UPDATED,
  ServiceSection,
  SummaryCards,
  UpdatedAt,
} from "@/components/content/ServicePage";

/**
 * CLAIMS POLICY — DRAFT, NOT PUBLISHED (owner instruction 2026-09-06; BSOT §12 says the exact
 * wording must be reviewed before it goes live so the site never promises more than the shop
 * actually does). Lives under /preview/ on purpose: production build → notFound(), robots
 * disallow /preview/, no link from any navigation, not in the sitemap. The owner reads it on the
 * dev server, answers the open questions, then it moves to /claims-policy.
 *
 * Confirmed facts (only two): 7-day claim window · unboxing video required. Everything else is a
 * PendingFact the owner has to decide.
 */
export const metadata: Metadata = {
  title: "นโยบายเคลม (ร่าง)",
  description: "ร่างนโยบายเคลมสินค้า OKami24 — ยังไม่เผยแพร่ รอเจ้าของอนุมัติ",
  robots: { index: false, follow: false },
};

export default function ClaimsPolicyDraftPage() {
  assertPreviewAllowedInThisEnvironment();
  return (
    <>
      <div className="border-b border-unverified/30 bg-unverified/10">
        <Container className="flex flex-wrap items-center gap-3 py-3 text-sm text-unverified">
          <Badge tone="unverified">DRAFT</Badge>
          <span>ร่าง — ยังไม่เผยแพร่ รอเจ้าของอ่านอนุมัติ · หน้านี้เปิดได้เฉพาะเครื่องพัฒนา ไม่มีลิงก์จากหน้าอื่น ไม่อยู่ใน sitemap</span>
        </Container>
      </div>
      <PageHeader
        eyebrow="Draft · Warranty"
        title="นโยบายเคลม"
        description="ของมีปัญหาเคลมได้ภายใน 7 วัน ต้องมีคลิปตอนแกะกล่อง — อ่านเงื่อนไขให้ครบก่อนสั่ง"
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <SummaryCards
            items={[
              { label: "เคลมได้ภายใน", value: "7 วัน", note: "นับจากวันที่ได้รับของ" },
              { label: "ต้องมี", value: "คลิปตอนแกะกล่อง", note: "ไม่มีคลิป พิจารณาให้ไม่ได้" },
              { label: "ส่งเรื่องทาง", value: `LINE ${CONTACT.lineId}`, note: "พร้อมเลขคำสั่งซื้อ" },
            ]}
          />

          <ServiceSection title="เคลมได้ภายใน 7 วัน">
            <p>
              ถ้าสินค้าที่ได้รับมีปัญหา แจ้งเราภายใน <strong className="text-foreground">7 วันนับจากวันที่ได้รับของ</strong> เกินจากนี้เราพิจารณาให้ไม่ได้
            </p>
          </ServiceSection>

          <ServiceSection title="ต้องมีคลิปตอนแกะกล่อง">
            <p>
              <strong className="text-foreground">ถ่ายคลิปตั้งแต่ยังไม่แกะจนแกะเสร็จ ให้เห็นกล่องและตัวสินค้าต่อเนื่องในคลิปเดียว</strong> ไม่มีคลิป เราพิจารณาเคลมให้ไม่ได้ — ข้อนี้ไม่มีข้อยกเว้น
            </p>
            <p>
              เหตุผลตรง ๆ คือ ของเล็ก ของแตกง่าย และเราไม่ได้อยู่ตรงนั้นตอนคุณเปิดกล่อง คลิปคือสิ่งเดียวที่บอกได้ว่าปัญหาเกิดก่อนหรือหลังของถึงมือ เป็นนิสัยติดตัวไว้เลย ใช้เวลา 30 วินาที แต่ช่วยคุณได้ทั้ง​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์
            </p>
          </ServiceSection>

          <ServiceSection title="แบบไหนเคลมได้ แบบไหนไม่ได้">
            <PendingFact always question="อาการแบบไหนที่รับเคลม และแบบไหนที่ไม่รับ — ขีดเลือกจากรายการด้านล่าง" />
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard title="ตัวอย่างที่ร้านทั่วไปมัก “รับ”">
                <p>ของผิดรุ่น ผิดสี ผิดกลิ่น จากที่สั่ง → รับ / ไม่รับ</p>
                <p>เครื่องเสียตั้งแต่แกะ กดไม่ติด ชาร์จไม่เข้า → รับ / ไม่รับ</p>
                <p>น้ำยารั่ว ซึม ในสภาพยังไม่ได้ใช้ → รับ / ไม่รับ</p>
              </InfoCard>
              <InfoCard title="ตัวอย่างที่ร้านทั่วไปมัก “ไม่รับ”">
                <p>กล่องบุบ แต่ของใช้ได้ปกติ → รับ / ไม่รับ</p>
                <p>ตกหล่น โดนน้ำ ใช้งานผิดวิธี → รับ / ไม่รับ</p>
                <p>ใช้ไปแล้วสักพักแล้วเสีย → รับ / ไม่รับ (ถ้ารับ กี่วัน)</p>
                <p>ไม่ชอบ เปลี่ยนใจ อยากเปลี่ยนกลิ่น → รับ / ไม่รับ</p>
              </InfoCard>
            </div>
          </ServiceSection>

          <ServiceSection title="เคลมแล้วได้อะไร">
            <PendingFact always question="เลือกอย่างเดียว หรือแล้วแต่กรณี — (ก) ส่งตัวใหม่ไปให้ · (ข) คืนเงิน · (ค) เปลี่ยนเป็นสินค้าตัวอื่นมูลค่าเท่ากัน · (ง) แล้วแต่กรณี ให้แอดมินคุยกับลูกค้า" />
          </ServiceSection>

          <ServiceSection title="ขั้นตอนเคลม">
            <NumberedSteps
              steps={[
                { title: "ทักไลน์ภายใน 7 วันหลังได้รับของ", body: <>ทักไลน์ <LineLink /> ระบุว่าต้องการเคลม</> },
                { title: "ส่งหลักฐาน", body: "เลขคำสั่งซื้อ + คลิปตอนแกะกล่อง + รูปหรือคลิปอาการที่เป็น" },
                { title: "รอแอดมินพิจารณา", body: <PendingFact always question="ใช้เวลาพิจารณากี่วัน" /> },
                { title: "ถ้าอนุมัติ ส่งของกลับ (ถ้าต้อง)", body: <PendingFact always question="ที่อยู่ส่งคืน ต้องแพ็กยังไง ต้องส่งกลับไหม หรือบางเคสไม่ต้องส่งกลับ" /> },
                { title: "ค่าส่งคืนใครออก", body: <PendingFact always question="ร้านออก / ลูกค้าออก / ร้านออกเฉพาะกรณีของผิดหรือของเสียจากโรงงาน" /> },
              ]}
            />
          </ServiceSection>

          <ServiceSection title="เราจะไม่สัญญาเกินที่ทำได้">
            <p>เราไม่รับเคลมทุกกรณีแบบไม่มีเงื่อนไข และไม่บอกว่า “รับประกันตลอดชีพ”</p>
            <p>สิ่งที่เรารับปากได้คือ ถ้าของมีปัญหาจริงและคุณมีคลิปแกะกล่อง เราจะดูให้และตอบคุณตรง ๆ ว่าทำอะไรให้ได้บ้าง</p>
            <PendingFact always question="สินค้าบางแบรนด์มีประกันจากโรงงานด้วยไหม ถ้ามี ต้องบอกลูกค้าว่าเคลมกับใคร" />
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
