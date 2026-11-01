import type { Metadata } from "next";
import { flavorFamilies } from "@/data/flavors";
import { Container } from "@/components/ui/Container";
import { ELiquidPageHeader, ELiquidDisclaimer, ELiquidNicotineTypes } from "@/components/content/ELiquidPageHeader";
import { FlavorFamilyGrid } from "@/components/content/FlavorFamilyGrid";
import { canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  // Round 9 B4 (thai-copy row 2, seo-auditor #1 "land now"): three owner keys that had no title on the
  // site — "น้ำยาบุหรี่ไฟฟ้า" (0/99 pages), "salt nic", "freebase" — in the question a seller asks
  // ("เอารสไหน salt nic หรือ freebase"). The "น้ำยา" head-copy exception for this page = round 7 close.
  // Round SEO rankings back (02/11): "น้ำยาบุหรี่ไฟฟ้า" moved to /products/e-liquid (the page that lists the bottles — Google's
  // page 1 for it = shop grids); this hub keeps the flavour-family words and stops competing (thai-copy 02/11).
  title: "กลิ่นน้ำยามีอะไรบ้าง แบ่งรสชาติเป็น 5 กลุ่ม",
  // Round 7 "SEO ค" B2: the old tail pointed at the E-Liquid category, which the share-deadend round
  // hid because it is empty — a search snippet must not send people to a listing that does not
  // exist. Wording = thai-copy row E (2026-09-23).
  // Round 8 B4 (owner 2026-09-23): "salt nic" / "freebase" enter the description (the page now has
  // that section); "แต่ละกลุ่มให้รสแบบไหน เหมาะกับใคร" gave way to keep it under 160 characters —
  // writer #2's proposal, listed for the owner in the round report (13.4 #6).
  // thai-copy #1: "…และยาสูบ salt nic…" read as one flavour; this order keeps the 5 families, the
  // "ให้รสแบบไหน" promise, the two new keys and the owner's own "ยังไม่มีขายหน้าร้าน" (159 chars).
  // Round SEO ฉ batch 6b (owner 13/10, item 50): the question "salt nic กับ freebase ต่างกันยังไง" now belongs to
  // /guides/salt-nic-vs-freebase — this line keeps the bare words only (seo-auditor's wording).
  // Round p63 (18/10): Marbo Saltnic (/products/eliquid-1) is on sale, so the owner's "ยังไม่มีขายหน้าร้าน" is no longer true
  // (#582 fixed the on-page line). Only that clause changes — the measured words (SEO_BASELINE: "กลุ่มรสชาติ", "salt nic",
  // "freebase") and the title/H1 stay as they are for the 01/11 read; 157 characters.
  description: "รสชาติน้ำยามี 5 กลุ่ม ผลไม้ เมนทอลและความเย็น ของหวาน เครื่องดื่ม และยาสูบ หน้านี้เล่าว่าแต่ละกลุ่มให้รสแบบไหน ส่วนกลิ่นและราคาของแต่ละรุ่นอยู่ในหน้าหมวดน้ำยา",
  ...canonicalFor("/e-liquid"),
};

export default function ELiquidPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/e-liquid")) }} />
      <ELiquidPageHeader />
      <Container className="py-12 lg:py-16">
        <FlavorFamilyGrid families={flavorFamilies} />
        <ELiquidNicotineTypes />
        <ELiquidDisclaimer />
      </Container>
    </>
  );
}
