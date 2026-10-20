import type { Brand } from "@/types/catalog";

export const brands: Brand[] = [
  {
    id: "uwell",
    slug: "uwell",
    name: "UWELL",
    fullName: "Uwell",
    tagline: "Engineering flavor, one pod at a time.",
    description:
      "A device manufacturer best known for the Caliburn open-system pod family — compact, refillable pod devices built around interchangeable coil pods, adjustable airflow, and increasingly capable onboard displays across successive generations.",
    descriptionTh:
      "UWELL ผู้ผลิตพอตซิสเต็มตระกูล Caliburn ที่ร้านมีทั้งตัวเครื่อง พร้อมหัวพอตและคอยล์แท้ของ Caliburn สำหรับเปลี่ยน",
    referenceUrl: "https://www.myuwell.com/",
  },
  {
    id: "voopoo",
    slug: "voopoo",
    name: "VOOPOO",
    fullName: "VOOPOO",
    tagline: "Spark your life.",
    description:
      "A device manufacturer spanning four current product series — ARGUS, DRAG, VINCI, and V — ranging from compact beginner pod kits to high-output, chip-driven pod mods with GENE-series firmware and swappable resistance pod platforms.",
    descriptionTh:
      "VOOPOO เป็นผู้ผลิตพอตซิสเต็มตระกูล ARGUS DRAG VINCI และ VMATE มีตั้งแต่รุ่นเล็กสำหรับมือใหม่ไปจนถึง DRAG 6 ที่ปรับได้สูงสุด 220 วัตต์ ที่ร้านมีทั้งตัวเครื่อง หัวพอต และคอยล์แท้",
    referenceUrl: "https://www.voopoo.com/",
  },
  {
    id: "salthub",
    slug: "salthub",
    name: "SALTHUB",
    fullName: "Salt Hub / M Bar",
    tagline: "The M Bar and M Switch ecosystem.",
    description:
      "A disposable- and switch-pod-focused brand built around the M Bar disposable line and the M Switch / Zero reusable cartridge platforms, emphasizing high puff counts, multi-mode airflow, and cartridge-based refill systems. If you have seen the name Marbo at other shops, this is the same line — salthub.com's own footer carries the Marbo logo too.",
    descriptionTh:
      // Round 6 "about3lang" B2 (owner เคาะ 2026-09-23): the clause that used to end this lede,
      // "มีครบทั้งเครื่องและหัวพอต", read as a stock-completeness claim wider than the catalog shows
      // (the rule on "ทุก/ครบ" wording = docs/THAI_STYLE.md §3, owner 2026-09-23 round 9; option ข-1
      // itself is permanent). "ที่ร้านมีทั้งตัวเครื่องและหัวพอต" states only what the catalog shows
      // (3 pod-kits + 3 pods-cartridges in src/data/products/salthub.ts) and puts the subject back
      // in: the old clause had none, so it read as if Zero, not the shop, was the complete thing.
      // Wording by writer + thai-copy; option ข-1 of three.
      // Round 8 B2 (owner ruling 2026-09-23 "both Marbo and M Bar must rank"): the closing
      // sentence says only what the evidence supports — other shops use the name Marbo, and
      // salthub.com's footer shows the Marbo logo (_incoming/round8/researcher-1-result.md rows
      // 1 and 3a). It never says who makes or distributes what: no source for that (row 3c).
      // Batch 3f (06/10): the 15K left "disposable" (owner 06/10 — pod kits); only that clause changed.
      // Round SEO D batch 5 (owner 07/10): "มาโบ" — the Thai name people type (Google autocomplete 07/10) — one mention,
      // the exception to THAI_STYLE layer 1; "ใส" left the 15K clause (BSOT 06/10: black pods only).
      "SALTHUB เจ้าของ M Bar พอตใช้แล้วทิ้งรุ่น 9K และ 10K กับเครื่องระบบสวิตช์ M Switch และ Zero ที่เปลี่ยนแค่หัวพอต ไม่ต้องเติมน้ำยา ส่วน M Bar 15K เป็นตัวเครื่อง M Switch คู่หัวพอต ที่ร้านมีทั้งตัวเครื่องและหัวพอต ถ้าเคยเห็นชื่อ Marbo ตามร้านอื่น หรือได้ยินคนเรียกว่ามาโบ ก็คือของตระกูลเดียวกันนี้ เว็บทางการ salthub.com มีโลโก้ Marbo อยู่ที่ท้ายเว็บ",
    referenceUrl: "https://www.salthub.com/",
  },
  {
    id: "rincoe",
    slug: "rincoe",
    name: "RINCOE",
    fullName: "Rincoe",
    tagline: "Pod systems and vape hardware.",
    taglineTh: "พอตซิสเต็มและอุปกรณ์พอต",
    description:
      "A vape hardware manufacturer best known for the Jellybox pod-system line, offering interchangeable mesh-coil pods across multiple device generations (Jellybox V, Jellybox Nano, and related kits).",
    descriptionTh:
      "RINCOE ผู้ผลิตพอตตระกูล Jellybox ที่ร้านมีหัวพอตแท้สำหรับ Jellybox V",
    referenceUrl: "https://rincoe-store.com/",
  },
  {
    id: "dotmod",
    slug: "dotmod",
    name: "DOTMOD",
    fullName: "dotmod",
    tagline: "Power Meets Portability.",
    description:
      "A vaping device manufacturer, active since 2013, known for the dotAIO all-in-one pod line and its dotCoils replacement-coil platform, alongside dotPod systems and both regulated and mechanical box mods.",
    descriptionTh:
      "DOTMOD ผู้ผลิต dotAIO และคอยล์ dotCoils ที่ร้านมีคอยล์แท้สำหรับ dotAIO V2",
    founded: "2013",
    referenceUrl: "https://dotmod.com/",
  },
  {
    id: "esko-bar",
    slug: "esko-bar",
    name: "ESKO BAR",
    fullName: "Esko Bar",
    tagline: "Enjoy the vibe.",
    description:
      "A disposable-vape brand offering both single-use ESKO BAR Disposable devices and the ESKO BAR SWITCH reusable pod system.",
    descriptionTh:
      // Round SEO D batch 5 (owner 07/10): the Thai name people type ("เอสโคบาร์", autocomplete 07/10), one mention.
      "ESKO BAR หรือที่หลายคนเรียกว่าเอสโคบาร์ เป็นแบรนด์พอตใช้แล้วทิ้งและเครื่องระบบสวิตช์ ที่ร้านมี ESKO BAR 20000 พอตใช้แล้วทิ้งที่มีให้เลือก 22 กลิ่น กับ Esko Bar Switch 20K ตัวเครื่องที่ใช้ซ้ำได้ เปลี่ยนแค่หัวพอตบรรจุสำเร็จ และมีหัวพอตแยกให้เลือก 20 กลิ่น",
    referenceUrl: "https://eskobarvape.com/",
  },
  {
    id: "ske",
    slug: "ske",
    name: "SKE",
    fullName: "SKE (Speed Skier Extreme)",
    tagline: "Embrace Challenges, Keep Original Intention.",
    taglineTh: "พอตใช้แล้วทิ้งตระกูล Crystal Bar",
    // Round list19 (18/10): first SKE product on the site — skevape.com's own line-up (Crystal Bar collection page, SKE Bar 6K / 15K).
    descriptionTh:
      "SKE เป็นแบรนด์บุหรี่ไฟฟ้าที่รู้จักจากพอตใช้แล้วทิ้งตระกูล Crystal Bar",
    description:
      "An e-cigarette brand best known for the Crystal Bar disposable line, alongside the SKE Bar and other high-puff-count disposable series.",
    referenceUrl: "https://www.skevape.com/",
  },
  {
    id: "kardinal-stick",
    slug: "kardinal-stick",
    name: "KS",
    fullName: "Kardinal Stick",
    tagline: "Engineering the Future of Alternative Tobacco.",
    taglineTh: "พอตจาก Kardinal ประเทศมาเลเซีย",
    // Round list19 (18/10): first KS product on the site (Quikpro cartridge) — kardinal.com/about "Established in 2017 in the
    // historic city of Malacca, Malaysia".
    descriptionTh:
      "KS (Kardinal Stick) เป็นผู้ผลิตบุหรี่ไฟฟ้าจากเมืองมะละกา ประเทศมาเลเซีย ก่อตั้งปี 2017 ทำพอตระบบปิดและตระกูล Quik / Quikpro ทั้งแบบใช้แล้วทิ้งและแบบเปลี่ยนหัว",
    description:
      "A Southeast Asian e-cigarette manufacturer, founded in 2017 in Malacca, Malaysia, known for its closed-pod systems and the Quik/Quikpro disposable and hybrid-cartridge line.",
    founded: "2017",
    referenceUrl: "https://www.kardinal.com/",
  },
  {
    id: "instabar",
    slug: "instabar",
    name: "INSTABAR",
    fullName: "Instabar",
    tagline: "Best disposable and prefilled vape brand.",
    description: "A disposable- and prefilled-vape manufacturer offering a tiered range of high-puff-count devices.",
    referenceUrl: "https://www.instabar.net/",
  },
  {
    id: "nevoks",
    slug: "nevoks",
    name: "NEVOKS",
    fullName: "Shenzhen Nevoks Technology Co., Ltd",
    tagline: "Enjoy This Moment.",
    description:
      "A vaping device manufacturer known for the FEELIN pod-system series (Feelin Mini, Feelin C1, and related kits) alongside disposables and platform accessories.",
    descriptionTh:
      "NEVOKS ผู้ผลิตพอตซิสเต็มตระกูล FEELIN ที่ร้านมีหัวพอตเปล่าสำหรับ Feelin Mini",
    referenceUrl: "https://nevoks.com/",
  },
  {
    id: "infy",
    slug: "infy",
    name: "INFY",
    fullName: "INFY",
    tagline: "Vape pod systems, cartridges, and disposables.",
    description:
      "A vape brand (This Is Salts) whose INFY 20K disposable is sold on the Thai market; INFY's own sites do not list the 20K yet.",
    // 2026-09-30 (round "image-sitewide"): the brand went live with INFY 20K — its line shows on /about and /brands/infy.
    descriptionTh:
      // Round SEO D batch 5 (owner 07/10): the Thai name people type ("อินฟี่", autocomplete 07/10), one mention.
      "INFY หรือที่หลายคนเรียกว่าอินฟี่ เป็นแบรนด์ที่ร้านมีรุ่น INFY 20K พอตใช้แล้วทิ้ง",
    referenceUrl: "https://www.infy.my/",
  },
  {
    id: "wotofo",
    slug: "wotofo",
    name: "WOTOFO",
    fullName: "Wotofo",
    tagline: "Made by Vapers.",
    description:
      "A vape hardware manufacturer known for its atomizer lineup (RDAs/RTAs/RDTAs) and, more recently, the nexBAR disposable-vape series spanning multiple puff-count tiers.",
    descriptionTh:
      "WOTOFO แบรนด์ฮาร์ดแวร์ที่ขยายมาทำพอตใช้แล้วทิ้งตระกูล nexBAR",
    referenceUrl: "https://www.wotofo.com/",
  },
  {
    id: "moood",
    slug: "moood",
    name: "MOOOD",
    fullName: "MOOOD",
    tagline: "Disposable vapes.",
    taglineTh: "พอตใช้แล้วทิ้ง",
    description:
      // Batch 5f (06/10, owner: off "Unbranded"): MOOOD's own site (mooodvapes.com) is offline; its pages survive on the
      // Wayback Machine (_incoming/sitewide-template/5/facts-mood-monster-14k.md) — the reference link points at that copy.
      "A disposable-vape brand whose Monster 14K pairs Duo Mesh coils with a digital screen.",
    descriptionTh:
      "MOOOD แบรนด์พอตใช้แล้วทิ้ง รุ่น Monster 14K คือรุ่นที่ร้านมี",
    referenceUrl: "https://web.archive.org/web/20241008232414/https://mooodvapes.com/",
  },
  // Deliberately NOT adding a "NEXT" Brand record for Pod-173 ("Next Pro 2 Beyond") — no official
  // first-party site found (Thai retailer + one review-site convergence only), same evidentiary
  // bar that already excludes Muro/BAAM/Dooze/Pepo/Dundu/Reswa/Foli/Vape City below. See the
  // catalog mission report for the citation trail; do not fabricate a referenceUrl to admit it.

  // Full-catalog mission — heated-tobacco brands. Owner has settled the business/legal-scope
  // question for this category; these are processed with the same evidence discipline as every
  // other brand above. No health/safety claims in tagline/description — factual only.
  {
    id: "iqos",
    slug: "iqos",
    name: "IQOS",
    fullName: "IQOS (Philip Morris International)",
    tagline: "Heat-not-burn tobacco system.",
    taglineTh: "เครื่องอุ่นยาสูบ",
    description:
      "Philip Morris International's heated-tobacco device brand — the ILUMA device family (Prime/i/i ONE/ONE) paired with TEREA tobacco sticks, using induction heating.",
    descriptionTh:
      // Round SEO D batch 5 (owner 07/10): the Thai name people type ("ไอคอส", autocomplete 07/10), one mention.
      "IQOS ของ Philip Morris International หรือที่คนไทยเรียกกันว่าไอคอส เป็นเครื่องอุ่นยาสูบด้วยความร้อน ใช้ได้กับก้าน TEREA เท่านั้น ที่ร้านมี ILUMA i · ILUMA i PRIME และ ILUMA i ONE",
    referenceUrl: "https://www.iqos.com/",
  },
  // Tier-1 disposable growth mission (2026-09-03) — owner-named business-priority brands.
  {
    id: "relx",
    slug: "relx",
    name: "RELX",
    fullName: "RELX (Shenzhen RELX Technology Co., Ltd)",
    tagline: "A global closed-pod and disposable vape brand.",
    taglineTh: "พอตใช้แล้วทิ้งและพอตเปลี่ยนหัว",
    description:
      "A major international vape brand (relxnow.com). The shop carries the Smash Go 12K and LUMI 18K disposables, and two switch-pod devices: the Infinity 2 Plus, which takes the RELX Pod family, and the RELX Creator, which takes RELX Creator Pods.",
    descriptionTh:
      "RELX แบรนด์พอตรายใหญ่ระดับสากล ที่ร้านมีพอตใช้แล้วทิ้ง Smash Go 12K และ LUMI 18K ให้เลือกหลายกลิ่น ส่วนเครื่องระบบสวิตช์มี Infinity 2 Plus ที่ใช้กับหัวพอตตระกูล RELX Pod และ RELX Creator ที่ใช้กับหัวพอต RELX Creator Pod",
    referenceUrl: "https://www.relxnow.com/",
  },
  {
    id: "joiway",
    slug: "joiway",
    name: "JOIWAY",
    fullName: "Joiway",
    tagline: "Disposable vapes and vaping accessories.",
    taglineTh: "พอตใช้แล้วทิ้งและอุปกรณ์เสริม",
    description:
      "A vape device manufacturer (myjoiway.com) selling disposables under an \"X Series\" naming pattern, including the F-series disposable line, alongside e-juice and accessories.",
    descriptionTh:
      // Round SEO D batch 5 (owner 07/10): the Thai name people type ("จอยเวย์", autocomplete 07/10), one mention; F3 is
      // the single-flavour model — the old line read as if both switched two.
      "JOIWAY หรือที่หลายคนเรียกว่าจอยเวย์ เป็นผู้ผลิตพอตใช้แล้วทิ้ง ที่ร้านมี F3 รุ่นกลิ่นเดียว และ F4 ที่สลับได้สองกลิ่นในเครื่องเดียว ซึ่ง OKami24 รีวิวใช้จริงไว้บน YouTube",
    referenceUrl: "https://myjoiway.com/",
  },
  {
    id: "tfit",
    slug: "tfit",
    name: "TFIT",
    fullName: "TFIT (Thinkvape)",
    tagline: "Pod systems and disposables.",
    taglineTh: "พอตซิสเต็มและพอตใช้แล้วทิ้ง",
    description:
      // Batch 4g (05/10): from TFIT's own site (About text + product list, 4/facts-tfit-m-power-20k.md) — the M Power 20K is TFIT's own.
      "A vape brand under THINKVAPE (tfitvape.com), founded in 2015 — maker of the NOVA and NOVA MAX pod systems and the M Power 20K disposable.",
    descriptionTh:
      "TFIT แบรนด์บุหรี่ไฟฟ้าในเครือ THINKVAPE ก่อตั้งเมื่อปี 2015 ทำพอตซิสเต็มตระกูล NOVA ด้วย ส่วนที่ร้านมีคือพอตใช้แล้วทิ้ง M Power 20K",
    referenceUrl: "https://www.tfitvape.com/",
  },
  {
    id: "lambda",
    slug: "lambda",
    name: "LAMBDA",
    fullName: "LAMBDA",
    tagline: "Smart Induction Heating System.",
    taglineTh: "เครื่องอุ่นยาสูบระบบเหนี่ยวนำ",
    // Round list19 (17/10): first LAMBDA product on the site (i8) — the brand page shows from now on.
    descriptionTh:
      "LAMBDA เป็นผู้ผลิตเครื่องอุ่นยาสูบจากเซินเจิ้น คนละบริษัทกับ Philip Morris International เจ้าของ IQOS และ LAMBDA ระบุว่าเครื่องของตนใช้กับก้าน TEREA และ SENTIA ได้",
    description:
      "A Shenzhen-based heat-not-burn device manufacturer, not affiliated with Philip Morris International — its devices (e.g. the i8) are third-party heaters marketed as compatible with TEREA and SENTIA Smartcore sticks, not official IQOS hardware.",
    referenceUrl: "https://www.lambdasmoke.com/",
  },
];

export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id || b.slug === id);
}
