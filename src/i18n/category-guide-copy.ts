/**
 * Round SEO pod (30/10, owner "จัดเต็มกว่านี้ได้เลยเรื่อง SEO"): the text block under a category grid (CategoryGuide) —
 * families on the page, line-up table labels, shopping FAQ. Keyed by category id; a category without an entry shows
 * nothing new. Thai = what Google reads (and the FAQPage JSON-LD); en/zh carry the same meaning. The page head stays
 * as it was (owner lock 09/10). Product facts = the verified spec rows on the site; links follow the article rule
 * (`[label](/path)`, label ≤ 4 words). Wording: thai-copy 30/10.
 */
export interface CategoryGuideCopy {
  heading: string;
  intro: string;
  families: { heading: string; body: string }[];
  /** Omitted = no line-up table on that page (its products have no battery / wattage / capacity trio, e.g. disposables). */
  table?: { heading: string; note: string; model: string; battery: string; power: string; capacity: string; externalCell: string };
  /** Disposables only (round "disposable pod", 05/11): the brand table under the families. Figures are read from the catalog. */
  brandTable?: { heading: string; lede: string; brand: string; models: string; from: string; topPuffs: string; bestSeller: string; note: string };
  /** Disposables only: the puffs + budget chooser (DisposableChooser). {min} · {n} · {a} · {b} · {p} are filled by code. */
  chooser?: ChooserCopy;
  /** Disposables only: the table of every model on the page. */
  compareTable?: CompareTableCopy;
  faqHeading: string;
  faq: { question: string; answer: string }[];
}

export interface CompareTableCopy {
  heading: string;
  model: string;
  puffs: string;
  ml: string;
  mah: string;
  price: string;
  note: string;
  unconfirmed: string;
}

export interface ChooserCopy {
  /** The link at the chooser's foot, to the table of every model. */
  jump: string;
  /** The link above the product grid, down to the chooser (a customer walk missed it five screens below the grid). */
  topJump: string;
  heading: string;
  lede: string;
  puffPanelTitle: string;
  budgetPanelTitle: string;
  puffsUpFrom: string;
  puffsRange: string;
  puffsUpTo: string;
  puffsExact: string;
  priceUpTo: string;
  priceRange: string;
  priceUpFrom: string;
  modelCount: string;
  modelCountOne: string;
  note: string;
}

// Facts re-checked against the verified rows 30/10: airflow slider = ARGUS G4 · G4 mini · VMATE i3 only (G3 mini fixed,
// VINCI S no row) · VOOPOO pod-kit tops 30–40W, no common minimum · DRAG X takes PnP (not PnP X) coils → "ตระกูล PnP".
// Table labels: แบตเตอรี่ · ความจุ = the spec-sheet words; the top-wattage column says วัตต์ (THAI_STYLE §3 locked word —
// the spec-label exception of group ก names only the dictionary keys). Wording tuned 30/10 with scripts/wordbreak-scan.js
// at 390 + 1440 on a dev server (LESSONS 33) until no new flag against main.
export const CATEGORY_GUIDE_COPY: Record<string, Partial<Record<"th" | "en" | "zh", CategoryGuideCopy>>> = {
  "pod-systems": {
    th: {
      heading: "Pod System สามกลุ่มบนหน้านี้ ต่างกันตรงไหน",
      intro:
        "พอตซิสเต็มทั้งสามกลุ่มในหน้านี้ ต่างกันหลัก ๆ ที่หัวพอตหรือคอยล์ที่ใช้ และวัตต์สูงสุดที่เครื่องจ่ายได้\n\nด้านล่างนี้สรุปแต่ละกลุ่มไว้สั้น ๆ พร้อมตารางสเปกจากผู้ผลิตให้เทียบกันได้ในที่เดียว ถ้าเพิ่งเริ่ม อ่าน [Pod System คืออะไร](/guides/what-is-a-pod-system) ก่อนได้",
      families: [
        {
          heading: "Caliburn จาก UWELL",
          body:
            "Caliburn ใช้หัวพอตที่มีคอยล์อยู่ในตัว เมื่อคอยล์เสื่อมก็ใส่หัวพอตใหม่แทนทั้งหัว ไม่ต้องถอดคอยล์ออกมาเปลี่ยนเอง หัวพอตจุน้ำยา 2.5–3mL และเครื่องจ่ายได้สูงสุด 35 วัตต์ ยกเว้น G3 ที่สูงสุด 25 วัตต์ รุ่น G4 กับ [G5](/products/caliburn-g5) ใช้ระบบหัวพอต GPP ของ UWELL และ G4 เติมน้ำยาได้ทั้งที่หัวพอตยังเสียบอยู่กับเครื่อง ส่วน G3 มีหัวพอตของรุ่นตัวเองให้เลือก 0.6 · 0.9 และ 1.2 โอห์ม ดูรุ่นอื่นและหัวพอตของแบรนด์ได้ที่หน้า [UWELL](/brands/uwell)",
        },
        {
          heading: "ARGUS VMATE และ VINCI จาก VOOPOO",
          body:
            "เครื่องกลุ่มนี้ใช้หัวพอตแบบเติมด้านบน จ่ายได้สูงสุด 30–40 วัตต์แล้วแต่รุ่น ARGUS G4 · ARGUS G4 mini และ VMATE i3 มีปุ่มเลื่อนปรับลม ตั้งแต่ MTL ที่ลมแน่น ไปจนถึง RDL ที่ลมโล่งขึ้น ARGUS G4 · G4 mini และ P3 ใส่หัวพอตตระกูล ARGUS ได้ทุกหัว ส่วน [VMATE i3](/products/vmate-i3) ใส่หัวพอต VMATE ได้ทุกหัว ในช่วง 0.4–1.2 โอห์ม จะสูบแน่นขึ้นหรือโล่งขึ้น ก็เปลี่ยนไปใช้หัวพอตค่าโอห์มอื่นได้ ส่วน [ARGUS G4](/products/argus-g4) ใช้หัวพอต Multi-Ohm ได้ แค่กลับด้านหัวพอต ค่าโอห์มก็เปลี่ยนจาก 0.7 เป็น 1.0 โอห์ม",
        },
        {
          heading: "DRAG จาก VOOPOO",
          body:
            "DRAG แยกคอยล์ออกมาเป็นอีกชิ้น ใช้คอยล์ตระกูล PnP พอคอยล์เสื่อมก็เปลี่ยนแค่คอยล์ ชุด [DRAG 6](/products/drag-6) มาพร้อมคอยล์ PnP X 0.15 และ 0.3 โอห์ม ส่วนชุด [DRAG S3](/products/drag-s3) มาพร้อมคอยล์ 0.6 และ 0.8 โอห์ม กลุ่มนี้จ่ายวัตต์ได้สูงกว่าสองกลุ่มแรก DRAG 6 สูงสุด 220 วัตต์ พร้อมถังน้ำยา 5mL รุ่น X กับ X3 สูงสุด 80 วัตต์ และรุ่น S3 สูงสุด 60 วัตต์ รุ่น DRAG 6 กับ X3 สูบได้ทั้ง DTL และ MTL ส่วน DRAG X และ X3 ไม่มีแบตในตัว ใช้ถ่าน 18650 ที่ต้องซื้อแยก และ X3 ใส่ถ่าน 21700 ได้ด้วย",
        },
      ],
      table: {
        heading: "สเปกหลักของแต่ละรุ่น",
        note: "ตัวเลขในตารางมาจากข้อมูลของผู้ผลิต ช่องที่ขึ้น “—” คือค่าที่ยังไม่ยืนยัน",
        model: "รุ่น",
        battery: "แบตเตอรี่",
        power: "วัตต์สูงสุด",
        capacity: "ความจุ",
        externalCell: "ใช้ถ่าน ซื้อแยก",
      },
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "Pod System ต่างจากพอตใช้แล้วทิ้งยังไง",
          answer:
            "พอตซิสเต็มเป็นพอตไฟฟ้าที่เก็บตัวเครื่องไว้ใช้ต่อ เติมน้ำยาเอง คอยล์เสื่อมก็เปลี่ยนแค่หัวพอตหรือคอยล์ ส่วนพอตใช้แล้วทิ้งมีน้ำยามาในตัว ไม่ต้องเติม ใช้จนน้ำยาหมดแล้วก็เปลี่ยนเครื่องใหม่ ดูการเทียบสองแบบอย่างละเอียดได้ที่ [คู่มือเทียบสองแบบ](/guides/open-system-vs-disposable) และถ้ากำลังดูพอตเปลี่ยนหัวด้วย อ่าน [พอตเปลี่ยนหัว หรือใช้แล้วทิ้ง](/guides/disposable-vs-switch-pod)",
        },
        {
          question: "ยังไม่แน่ใจว่าจะเริ่มจากเครื่องไหน ควรดูอะไรก่อน",
          answer:
            "แนะนำให้อ่านคู่มือ [เลือก Pod System เครื่องแรก](/guides/choosing-your-first-pod-system) ก่อนค่ะ ในนั้นเรียงเรื่องที่ควรดูไว้ทีละขั้น ตั้งแต่สูบแบบไหน นิโคตินเท่าไหร่ ไปจนถึงความคุ้มในระยะยาว ถ้าอ่านแล้วยังตัดสินใจไม่ได้ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
        {
          question: "หัวพอตใช้ข้ามรุ่นได้ไหม",
          answer:
            "ได้ ถ้าอยู่ในระบบหัวพอตเดียวกันค่ะ เช่น หัวพอต GPP ของ UWELL ใช้ได้ทั้ง G4 และ G5 ของ Caliburn ส่วน ARGUS G4 · G4 mini และ P3 ใส่หัวพอตตระกูล ARGUS ได้ทุกหัว และ VMATE i3 ใส่หัวพอต VMATE ได้ทุกหัว ก่อนซื้อ เช็คในหน้าสินค้าของเครื่องอีกครั้งนะคะ ว่าใส่หัวพอตรุ่นไหนได้ แล้วเลือกหัวพอตได้ที่หน้า [หัวพอต](/products/pods-cartridges) ส่วนคอยล์ดูได้ที่หน้า [คอยล์และอุปกรณ์เสริม](/products/coils-accessories) ค่ะ",
        },
        {
          question: "สั่งแล้วกี่วันถึง",
          answer:
            "โอนและส่งสลิปก่อน 12:30 เราจัดส่งให้วันเดียวกัน ถ้าหลัง 12:30 จะส่งในวันทำการถัดไปค่ะ เราส่งวันจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ ของออกจากร้านแล้วถึงมือภายใน 1–3 วัน พร้อมเลขพัสดุให้ติดตามค่ะ",
        },
        {
          question: "ซื้อเครื่องแล้ว ต้องมีอะไรเพิ่ม",
          answer:
            "ต้องมีน้ำยาไว้เติม และควรมีหัวพอตหรือคอยล์สำรองไว้เปลี่ยนตอนคอยล์เสื่อมด้วยค่ะ ถ้าเลือก DRAG X หรือ DRAG X3 ต้องมีถ่านเพิ่มด้วย เพราะถ่านไม่ได้มาในกล่องนะคะ",
        },
      ],
    },
    en: {
      heading: "Three kinds of Pod System, and how they differ",
      intro:
        "The Pod Systems on this page differ mainly in the pods or coils they take and how much power they deliver. Below is a short guide to each group, with the makers' specs in one table so you can compare them side by side. New to them? Start with [what a Pod System is](/guides/what-is-a-pod-system).",
      families: [
        {
          heading: "UWELL Caliburn",
          body:
            "Caliburn pods have the coil built in, so when the coil wears you simply fit a fresh pod. There is no coil to take out. Pods hold 2.5–3mL, and the devices deliver up to 35W, or 25W on the G3. The G4 and [G5](/products/caliburn-g5) use UWELL's GPP pod system, and the G4 refills without taking the pod out. The G3 has its own pods, in 0.6, 0.9 and 1.2Ω. More from the brand is on the [UWELL](/brands/uwell) page.",
        },
        {
          heading: "VOOPOO ARGUS, VMATE and VINCI",
          body:
            "These devices take top-fill pods and deliver up to 30–40W, depending on the model. The ARGUS G4, ARGUS G4 mini and VMATE i3 have an airflow slider that runs from a tight MTL draw to a looser RDL draw. The ARGUS G4, G4 mini and P3 take every ARGUS-family cartridge, and the [VMATE i3](/products/vmate-i3) takes every VMATE cartridge from 0.4 to 1.2Ω, so a different pod gives you a different draw. With the Multi-Ohm cartridge on the [ARGUS G4](/products/argus-g4), just turn the cartridge around and the resistance changes from 0.7Ω to 1.0Ω.",
        },
        {
          heading: "VOOPOO DRAG",
          body:
            "DRAG keeps the coil as a separate part: a PnP-family coil that you replace on its own when it wears. The [DRAG 6](/products/drag-6) comes with 0.15Ω and 0.3Ω coils, and the [DRAG S3](/products/drag-s3) with 0.6Ω and 0.8Ω. This group delivers more power than the other two: up to 60W on the DRAG S3, 80W on the DRAG X and X3, and 220W on the DRAG 6, which also has a 5mL tank. The DRAG 6 and X3 work for both DTL and MTL. The DRAG X and X3 have no built-in battery. They run on an 18650 cell, sold separately, and the X3 also takes a 21700.",
        },
      ],
      table: {
        heading: "Key specs by model",
        note: "All figures come from the makers. A dash (—) means there is no verified number yet.",
        model: "Model",
        battery: "Battery",
        power: "Max output",
        capacity: "Capacity",
        externalCell: "External cell, sold separately",
      },
      faqHeading: "Common questions",
      faq: [
        {
          question: "How is a Pod System different from a disposable?",
          answer:
            "With a Pod System you keep the device, fill it yourself, and replace only the pod or coil when it wears. A disposable comes filled, needs no refilling, and is replaced once the e-liquid runs out. Our [Pod System vs. disposable guide](/guides/open-system-vs-disposable) compares the two in detail.",
        },
        {
          question: "Not sure which device to start with?",
          answer:
            "Start with our guide to [choosing your first Pod System](/guides/choosing-your-first-pod-system). It takes you through what to consider step by step, from draw style and nicotine strength to running costs over time. If you're still unsure after that, message us on LINE @okm24.",
        },
        {
          question: "Do pods fit across models?",
          answer:
            "Yes, within the same pod system. The Caliburn G4 and G5 both use UWELL's GPP pods, the ARGUS G4, G4 mini and P3 take every ARGUS-family cartridge, and the VMATE i3 takes every VMATE cartridge. Before you buy, check the “Pod platform” row on the device's page, then pick your pods on the [Pods & Cartridges](/products/pods-cartridges) page. Coils are on the [Coils & Accessories](/products/coils-accessories) page.",
        },
        {
          question: "How soon will my order arrive?",
          answer:
            "Transfer and send your slip before 12:30 and we ship the same day; after 12:30 it goes out the next working day. We ship Monday to Saturday, not on Sundays or public holidays. Once it's out, it arrives within 1–3 days, with a tracking number you can follow.",
        },
        {
          question: "What else will I need with the device?",
          answer:
            "E-liquid to fill it, and a spare pod or coil is worth keeping for when the coil wears. The DRAG X and DRAG X3 also need a cell, which isn't in the box.",
        },
      ],
    },
    zh: {
      heading: "三类烟弹系统，区别在哪里",
      intro:
        "本页的烟弹系统分为三类，主要区别在于所用的烟弹或雾化芯，以及设备的最高输出功率。下面逐一简要说明，并附上厂商规格表，方便对照。还不了解 Pod System？可先看 [什么是 Pod System](/guides/what-is-a-pod-system)。",
      families: [
        {
          heading: "UWELL Caliburn",
          body:
            "Caliburn 的烟弹内置雾化芯，雾化芯用旧了直接换一颗新烟弹，不用单独拆换雾化芯。烟弹容量 2.5–3mL，设备最高输出 35W，G3 为 25W。G4 和 [G5](/products/caliburn-g5) 使用 UWELL 的 GPP 烟弹系统，G4 不用取下烟弹就能注油；G3 则有专属烟弹，提供 0.6、0.9 和 1.2Ω 三种阻值。更多产品见 [UWELL](/brands/uwell) 品牌页。",
        },
        {
          heading: "VOOPOO ARGUS、VMATE 与 VINCI",
          body:
            "这一类采用顶部注油的烟弹，最高输出 30–40W，视型号而定。ARGUS G4、ARGUS G4 mini 和 VMATE i3 配有进气滑块，从偏紧的 MTL 到更通透的 RDL 都能调。ARGUS G4、G4 mini 和 P3 兼容整个 ARGUS 烟弹家族，[VMATE i3](/products/vmate-i3) 兼容全部 VMATE 烟弹，阻值 0.4–1.2Ω，换一颗烟弹就能换一种吸感。[ARGUS G4](/products/argus-g4) 搭配 Multi-Ohm 烟弹时，把烟弹调转方向插入，阻值就从 0.7Ω 变为 1.0Ω。",
        },
        {
          heading: "VOOPOO DRAG",
          body:
            "DRAG 的雾化芯是独立部件，使用 PnP 系列雾化芯，用旧了只换雾化芯即可。[DRAG 6](/products/drag-6) 套装附 0.15Ω 和 0.3Ω 雾化芯，[DRAG S3](/products/drag-s3) 附 0.6Ω 和 0.8Ω。这一类功率高于前两类：DRAG S3 最高 60W，DRAG X 和 X3 最高 80W，DRAG 6 最高 220W，并配 5mL 油仓。DRAG 6 和 X3 支持 DTL 与 MTL。DRAG X 和 X3 没有内置电池，使用 18650 电芯，X3 也可用 21700，电芯需另购。",
        },
      ],
      table: {
        heading: "各型号主要规格",
        note: "表中数据均来自厂商；显示“—”表示暂无已核实的数据。",
        model: "型号",
        battery: "电池容量",
        power: "最大功率",
        capacity: "容量",
        externalCell: "外置电芯，需另购",
      },
      faqHeading: "常见问题",
      faq: [
        {
          question: "Pod System 和一次性电子烟有什么不同？",
          answer:
            "Pod System 的主机留着继续用，烟油自己加，雾化芯用旧了只换烟弹或雾化芯；一次性电子烟出厂已注好烟油，无需加注，烟油用完就换一支新的。详细对比见 [Pod System 与一次性电子烟对比](/guides/open-system-vs-disposable)。",
        },
        {
          question: "还不确定从哪一台开始？",
          answer:
            "建议先看 [选购第一台 Pod System 指南](/guides/choosing-your-first-pod-system)，里面按步骤列出需要考虑的事项，从吸法、尼古丁浓度到长期使用成本。看完仍不确定，欢迎通过 LINE @okm24 咨询。",
        },
        {
          question: "烟弹可以跨型号通用吗？",
          answer:
            "同一烟弹系统内可以通用。例如 Caliburn G4 与 G5 都使用 UWELL 的 GPP 烟弹，ARGUS G4、G4 mini 和 P3 兼容整个 ARGUS 烟弹家族，VMATE i3 兼容全部 VMATE 烟弹。购买前请再核对设备页面规格表中的烟弹兼容一栏，然后到 [烟弹](/products/pods-cartridges) 页面选购；雾化芯请见 [雾化芯与配件](/products/coils-accessories)。",
        },
        {
          question: "下单后多久能到？",
          answer:
            "12:30 前转账并提交转账凭证，当天发货；12:30 之后则在下一个工作日发货。我们周一至周六发货，周日和法定节假日不发货。寄出后 1–3 天内送达，并附快递单号供查询。",
        },
        {
          question: "买了设备还需要准备什么？",
          answer:
            "需要烟油来加注，也建议备一颗烟弹或雾化芯，雾化芯用旧时可以直接换上。若选 DRAG X 或 DRAG X3，还需另购电芯，盒内不附带。",
        },
      ],
    },
  },
  // Round SEO rankings back (02/11, owner: "ตรวจสิเนื้อหาไหนสินค้าไหน ที่ยังขาดอะไรในการขึ้นไปสู้หน้า 1 ก็จัดการได้เลย"): the key
  // "น้ำยาบุหรี่ไฟฟ้า" moves to this category page, the one that lists the bottles (Google's page 1 for it = shop grids).
  // Facts = each product's verified nicotine-type row + flavour count on the site, Marbo Saltnic's 30ml bottle row; the
  // salt nic / freebase / PG-VG lines repeat only what the two guides already say. The table stays hidden (no device rows).
  // en/zh skip the two Thai-only guides. Wording: thai-copy 02/11.
  "e-liquid": {
    th: {
      heading: "น้ำยาบุหรี่ไฟฟ้าบนหน้านี้ เลือกแบบไหนให้เข้ากับเครื่อง",
      intro:
        "หน้านี้รวมน้ำยาแบบขวดสำหรับพอตซิสเต็มที่เติมน้ำยาเอง นิโคตินในน้ำยาแบ่งเป็นสองชนิด คือ salt nic กับ freebase สองชนิดนี้เข้ากับเครื่องต่างกัน จึงควรดูเครื่องที่ใช้อยู่ก่อน แล้วค่อยเลือกกลิ่นที่ชอบ\n\nด้านล่างนี้สรุปทั้งสองชนิดไว้สั้น ๆ พร้อมรายชื่อน้ำยาแต่ละชนิดบนหน้านี้ ถ้าอยากอ่านละเอียดกว่านี้ ดูได้ที่บทความ [salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
      families: [
        {
          heading: "น้ำยา salt nic สำหรับพอตตัวเล็ก",
          body:
            "salt nic คือนิโคตินที่ผู้ผลิตผสมกรดลงไป ผู้ผลิตพอตหลายรายแนะนำให้ใช้กับพอตตัวเล็กที่ใช้วัตต์ต่ำ และสูบแบบ MTL คือดูดเข้าปากก่อน แล้วค่อยสูดลงปอด งานวิจัยก็พบว่าที่ความเข้มข้นเท่ากัน salt nic ให้ความรู้สึกนุ่มกว่า freebase น้ำยา salt nic บนหน้านี้มี [Marbo Saltnic](/products/eliquid-1) ของ SALTHUB ขวดขนาด 30ml มี 9 กลิ่น · [Super Cool Salt Nic](/products/super-cool-saltnic) 10 กลิ่น · [Muro Salt Nic](/products/muro-salt-nic) 6 กลิ่น · [Double Mint Salt Nic](/products/eliquid-64) 6 กลิ่น · [Pepo Salt Nic](/products/eliquid-72) 5 กลิ่น และ [Dundu Salt Nic](/products/eliquid-73) ที่มีกลิ่นเดียว",
        },
        {
          heading: "น้ำยา freebase สำหรับเครื่องวัตต์สูง",
          body:
            "freebase คือนิโคตินในรูปเดิม ผู้ผลิตแนะนำให้ใช้กับเครื่องวัตต์สูงที่ใช้คอยล์โอห์มต่ำ จากที่ร้านเห็น คนที่เลือก freebase มักชอบรสชาติที่ชัด และควันที่ได้จากเครื่องวัตต์สูง ซึ่งเป็นการสูบอีกแนวหนึ่ง ไม่ได้แปลว่าแบบไหนดีกว่ากัน น้ำยา freebase บนหน้านี้มี [Muro Freebase](/products/muro-freebase) 6 กลิ่น · [Marbo Freebase](/products/eliquid-109) ของ SALTHUB 4 กลิ่น และ [Graple Freebase](/products/graple-freebase) ที่มีกลิ่นเดียว",
        },
        {
          heading: "เลือกกลิ่น แล้วดู PG กับ VG ข้างขวด",
          body:
            "พอได้ชนิดนิโคตินที่เข้ากับเครื่องแล้ว ก็เลือกกลิ่นที่ชอบได้เลย เราแบ่งรสน้ำยาไว้ 5 กลุ่ม คือ ผลไม้ เมนทอลและความเย็น ของหวาน เครื่องดื่ม และสไตล์ยาสูบ แต่ละกลุ่มให้รสแบบไหน ดูได้ที่หน้า [กลุ่มรสชาติน้ำยา](/e-liquid) ข้างขวดน้ำยามักบอกสัดส่วน PG กับ VG ไว้ด้วย Aspire อธิบายว่า PG พารสได้ชัดและให้ความรู้สึกแรงถึงคอ ส่วน VG ให้ควันหนาและนุ่มกว่า สัดส่วนนี้ควรเลือกให้เข้ากับคอยล์ของเครื่อง และตัวเลขอย่าง 70/30 แต่ละแบรนด์ก็เรียงลำดับไม่เหมือนกัน วิธีอ่านดูได้ที่ [PG VG คืออะไร](/guides/pg-vg-in-e-liquid)",
        },
      ],
      table: {
        heading: "สเปกหลักของแต่ละรุ่น",
        note: "ตัวเลขในตารางมาจากข้อมูลของผู้ผลิต ช่องที่ขึ้น “—” คือค่าที่ยังไม่ยืนยัน",
        model: "รุ่น",
        battery: "แบตเตอรี่",
        power: "วัตต์สูงสุด",
        capacity: "ความจุ",
        externalCell: "ใช้ถ่าน ซื้อแยก",
      },
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "พอตใช้แล้วทิ้ง ต้องซื้อน้ำยามาเติมไหม",
          answer:
            "ไม่ต้องค่ะ พอตใช้แล้วทิ้งและหัวพอตบรรจุสำเร็จมีน้ำยามาในเครื่องแล้ว น้ำยาแบบขวดในหน้านี้ใช้กับพอตซิสเต็มที่เติมน้ำยาเอง ดูเครื่องแบบนี้ได้ที่หน้า [พอตซิสเต็ม](/products/pod-systems) ค่ะ",
        },
        {
          question: "ไม่แน่ใจว่าเครื่องที่ใช้อยู่เข้ากับน้ำยาแบบไหน ดูยังไงดี",
          answer:
            "ดูวัตต์และคอยล์ของเครื่องก่อนค่ะ ถ้าเป็นพอตตัวเล็กที่ใช้วัตต์ต่ำ ผู้ผลิตมักแนะนำ salt nic ส่วนเครื่องวัตต์สูงที่ใช้คอยล์โอห์มต่ำจะเข้ากับ freebase มากกว่า ถ้าดูแล้วยังไม่แน่ใจ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
        {
          question: "ซื้อน้ำยาแล้ว ควรมีอะไรเพิ่มไหม",
          answer:
            "ถ้าใช้พอตซิสเต็ม ควรมีหัวพอตหรือคอยล์สำรองไว้ด้วย พอคอยล์เสื่อมจะได้เปลี่ยนทันที หัวพอตดูได้ที่หน้า [หัวพอต](/products/pods-cartridges) ส่วนคอยล์อยู่ที่หน้า [คอยล์และอุปกรณ์เสริม](/products/coils-accessories) ก่อนซื้อเช็คให้ตรงกับรุ่นเครื่องอีกครั้งนะคะ",
        },
      ],
    },
    en: {
      heading: "E-liquid on this page, and which kind suits your device",
      intro:
        "The e-liquids here come in bottles, for Pod Systems you fill yourself. Nicotine in e-liquid comes in two types, salt nic and freebase, and the two suit different devices, so start with the device you use and then pick a flavor you like. Below is a short guide to each type, with the e-liquids of each type on this page.",
      families: [
        {
          heading: "Salt nic, for small pods",
          body:
            "Salt nic is nicotine that the maker has blended with an acid. Several pod makers recommend it for small, low-wattage pods and an MTL draw, where you draw into your mouth first and then inhale. Research has also found that, at the same strength, salt nic feels smoother than freebase. Salt nic on this page: SALTHUB's [Marbo Saltnic](/products/eliquid-1) in a 30ml bottle, 9 flavors · [Super Cool Salt Nic](/products/super-cool-saltnic), 10 · [Muro Salt Nic](/products/muro-salt-nic), 6 · [Double Mint Salt Nic](/products/eliquid-64), 6 · [Pepo Salt Nic](/products/eliquid-72), 5 · and [Dundu Salt Nic](/products/eliquid-73), in a single flavor.",
        },
        {
          heading: "Freebase, for higher-wattage devices",
          body:
            "Freebase is nicotine in its original form. Makers recommend it for higher-wattage devices with low-ohm coils. In our experience, people who choose freebase tend to like a clear flavor and the vapor a high-wattage device gives. It's a different way to vape, not a better one. Freebase on this page: [Muro Freebase](/products/muro-freebase), 6 flavors · SALTHUB's [Marbo Freebase](/products/eliquid-109), 4 · and [Graple Freebase](/products/graple-freebase), in a single flavor.",
        },
        {
          heading: "Flavor, and the PG/VG on the label",
          body:
            "Once the nicotine type suits your device, choose a flavor you enjoy. We group flavors into five families: fruit, menthol and cooling, dessert, beverage, and tobacco-style. What each one tastes like is on the [flavor families](/e-liquid) page. The label usually shows a PG/VG ratio too. Aspire explains that PG carries flavor clearly and gives more throat hit, while VG gives thicker, smoother vapor. Choose the ratio to suit your coil, and read the letters beside the numbers: brands order a figure like 70/30 differently.",
        },
      ],
      table: {
        heading: "Key specs by model",
        note: "All figures come from the makers. A dash (—) means there is no verified number yet.",
        model: "Model",
        battery: "Battery",
        power: "Max output",
        capacity: "Capacity",
        externalCell: "External cell, sold separately",
      },
      faqHeading: "Common questions",
      faq: [
        {
          question: "Does a disposable need refilling with e-liquid?",
          answer:
            "No. Disposables and prefilled pods come with the e-liquid already inside. The bottles on this page are for Pod Systems you fill yourself, which you'll find on the [Pod Systems](/products/pod-systems) page.",
        },
        {
          question: "Not sure which type suits your device?",
          answer:
            "Start with its wattage and coil. Makers usually recommend salt nic for small, low-wattage pods, while higher-wattage devices with low-ohm coils suit freebase. If you're still unsure, message us on LINE @okm24.",
        },
        {
          question: "Anything else I should have with the e-liquid?",
          answer:
            "If you use a Pod System, keep a spare pod or coil for when the coil wears, so you can change it straight away. Pods are on the [Pods & Cartridges](/products/pods-cartridges) page and coils on the [Coils & Accessories](/products/coils-accessories) page. Check that they match your device model before you buy.",
        },
      ],
    },
    zh: {
      heading: "本页烟油，哪一种适合你的设备",
      intro:
        "本页的烟油均为瓶装，适用于自行注油的 Pod System。烟油中的尼古丁分为两种：salt nic 和 freebase。两者适合的设备不同，建议先看手上的设备，再挑喜欢的口味。下面简要介绍两种类型，并列出本页各类型对应的烟油。",
      families: [
        {
          heading: "salt nic：适合小烟弹设备",
          body:
            "salt nic 是厂商在尼古丁中加入酸调配而成。多家烟弹设备厂商建议搭配低功率的小烟弹设备和 MTL 吸法，也就是先吸入口腔，再吸进肺部。研究也发现，在相同浓度下，salt nic 的口感比 freebase 更顺。本页的 salt nic 烟油有：SALTHUB 的 [Marbo Saltnic](/products/eliquid-1)，30ml 瓶装，9 种口味；[Super Cool Salt Nic](/products/super-cool-saltnic)，10 种；[Muro Salt Nic](/products/muro-salt-nic)，6 种；[Double Mint Salt Nic](/products/eliquid-64)，6 种；[Pepo Salt Nic](/products/eliquid-72)，5 种；以及只有一种口味的 [Dundu Salt Nic](/products/eliquid-73)。",
        },
        {
          heading: "freebase：适合高功率设备",
          body:
            "freebase 是原本形态的尼古丁，厂商建议搭配使用低阻值雾化芯的高功率设备。就店里的观察，选择 freebase 的人多半偏好清晰的口味，以及高功率设备带来的烟雾。这是另一种抽法，并没有哪种更好。本页的 freebase 烟油有：[Muro Freebase](/products/muro-freebase)，6 种口味；SALTHUB 的 [Marbo Freebase](/products/eliquid-109)，4 种；以及只有一种口味的 [Graple Freebase](/products/graple-freebase)。",
        },
        {
          heading: "选口味，再看瓶身的 PG/VG",
          body:
            "尼古丁类型和设备对上之后，就可以挑喜欢的口味了。我们把烟油口味分为五个系列：水果、薄荷与清凉、甜品、饮品和烟草风格，各系列的特点见 [烟油风味系列](/e-liquid) 页面。瓶身通常还会标注 PG 与 VG 的比例。Aspire 的说明是，PG 能让味道更清楚，喉感也更明显；VG 烟雾更浓、口感更柔和。比例应配合设备的雾化芯来选；像 70/30 这样的数字，各品牌的排列顺序并不相同，请留意数字旁边的字母。",
        },
      ],
      table: {
        heading: "各型号主要规格",
        note: "表中数据均来自厂商；显示“—”表示暂无已核实的数据。",
        model: "型号",
        battery: "电池容量",
        power: "最大功率",
        capacity: "容量",
        externalCell: "外置电芯，需另购",
      },
      faqHeading: "常见问题",
      faq: [
        {
          question: "一次性电子烟需要另外加烟油吗？",
          answer:
            "不需要。一次性电子烟和预注油烟弹出厂时已装好烟油。本页的瓶装烟油适用于自行注油的 Pod System，可在 [Pod System](/products/pod-systems) 页面查看。",
        },
        {
          question: "不确定自己的设备适合哪一种烟油？",
          answer:
            "先看设备的功率和雾化芯。低功率的小烟弹设备，厂商通常建议使用 salt nic；使用低阻值雾化芯的高功率设备，则更适合 freebase。看完仍不确定，欢迎通过 LINE @okm24 咨询。",
        },
        {
          question: "买了烟油，还需要准备什么？",
          answer:
            "如果使用 Pod System，建议备一颗烟弹或雾化芯，雾化芯用旧时可以直接换上。烟弹见 [烟弹](/products/pods-cartridges) 页面，雾化芯见 [雾化芯与配件](/products/coils-accessories)。购买前请再核对是否与设备型号对应。",
        },
      ],
    },
  },
  // Round SEO rankings back (02/11, owner: "…ที่ยังขาดอะไรในการขึ้นไปสู้หน้า 1 ก็จัดการได้เลย รวมถึง คีย์หลักคีย์รอง เอาหมด"): the two
  // main-key categories ("พอตเปลี่ยนหัว" · "พอตใช้แล้วทิ้ง") had one intro line and nothing under the grid (content audit
  // 02/11), while Google's page 1 carries an explainer + FAQ there (SEO_LANDSCAPE §10). Facts = verified spec rows
  // (products/*.ts · VERIFIED_SPECIFICATIONS) and catalog-relationships.ts pairs; puff wording = each product's head copy.
  // Muro / Foli numbers left out (their source is a retailer page — THAI_STYLE §5). No table (no device trio on these
  // pages); en/zh skip the Thai-only guides. Wording: thai-copy 02/11.
  "switch-pods": {
    th: {
      heading: "พอตเปลี่ยนหัวแต่ละตระกูลบนหน้านี้ ต่างกันตรงไหน",
      intro:
        "พอตเปลี่ยนหัวบนหน้านี้ใช้หลักเดียวกันทุกรุ่น คือเก็บตัวเครื่องไว้ใช้ต่อ ส่วนหัวพอตบรรจุสำเร็จใช้จนหมดแล้วก็เปลี่ยนหัวใหม่ สิ่งที่ต่างกันจึงอยู่ที่หัวพอตของแต่ละตระกูล ว่าหัวละกี่พัฟและใส่กับเครื่องไหนได้ รวมถึงตัวเครื่องว่ามีจอ มีโหมด และแบตเท่าไหร่\n\nด้านล่างนี้สรุปสามตระกูลหลักไว้สั้น ๆ ถ้าอยากเลือกตามสิ่งที่ต้องการทีละเรื่อง อ่านต่อได้ที่ [พอตเปลี่ยนหัว รุ่นไหนดี](/guides/choosing-a-switch-pod)",
      families: [
        {
          heading: "M Switch และ Zero จาก SALTHUB",
          body:
            "[M Switch Kit](/products/m-switch-kit) คือชุดตัวเครื่องพร้อมหัวพอตที่ร้านเราเรียกว่า M Bar 15K หรือ Marbo 15K ตัวเครื่องใช้คู่กับหัว [M Switch Pod](/products/m-switch-pod) ที่ SALTHUB ระบุไว้หัวละสูงสุด 15,000 พัฟ ใช้คอยล์ cotton mesh มีหน้าจอดิจิทัลบอกระดับแบต มีปุ่มเลื่อนปรับลม และชาร์จผ่าน USB-C ส่วนตระกูล Zero มีหัว [Zero Cartridge](/products/zero-cartridge) ขนาด 2.2mL ตัวเครื่อง [Zero Pro](/products/zero-pro) มี 3 โหมดให้สลับแรงสูบได้ แบต 380mAh และ [Zero Nano](/products/zero-nano) ที่เป็นรุ่นตัวเล็กของตระกูล มีแบต 500mAh ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [SALTHUB](/brands/salthub)",
        },
        {
          heading: "Creator และ Infinity จาก RELX",
          body:
            "[RELX Creator](/products/relx-creator) ขายเฉพาะตัวเครื่อง หัวพอตเลือกซื้อแยกได้ ตัวเครื่องแบต 800mAh ชาร์จผ่าน USB-C มีจอพิกเซลที่โชว์หน้าอีโมจิ ปรับช่องลมได้ และกดปุ่มสองครั้งติดกันเพื่อสลับระหว่างโหมด Normal 15 วัตต์ กับ Boost 25 วัตต์ เครื่องนี้ใส่ได้ทั้งหัว [RELX Creator Pod](/products/relx-creator-pod-20k) และหัว [Muro Connector 20K](/products/muro-connector-20k) ทั้งสองหัวนี้ร้านยืนยันจากของจริงที่มีอยู่ ส่วน [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) แบต 440mAh มี 3 โหมด คือ Eco 6.5 วัตต์ · Smooth 8 วัตต์ · Boost 10 วัตต์ และ RELX ระบุว่าชาร์จผ่าน USB-C ได้ 80% ใน 15 นาที เครื่องนี้ใส่ได้ทั้งหัว RELX Pod · RELX Pod Pro และ RELX Pod Pro 2 หัว Pod Pro 2 ดูกลิ่นได้ที่หน้า [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) อีกรุ่นของ RELX ในหน้านี้คือตัวเครื่อง [RELX Essential 2](/products/relx-essential-2)",
        },
        {
          heading: "ESKO BAR SWITCH · INFY และ KS",
          body:
            "[Esko Bar Switch 20K](/products/pod-159) ใช้[หัวพอต Esko Bar Switch](/products/esko-bar-switch-pod) ที่ ESKO BAR ระบุไว้หัวละสูงสุด 20,000 พัฟ จุน้ำยา 18mL และมีคอยล์สองตัวที่ทำงานพร้อมกัน ตัวเครื่องแบต 850mAh กดปุ่มเดียวก็สลับโหมด High กับ Low ได้ และหมุนที่ก้นตัวเครื่องเพื่อปรับช่องลมได้ 3 ระดับ ส่วน [INFY POD](/products/infy-pod) แบต 400mAh ชาร์จผ่าน USB-C มีไฟ LED หลายสีบอกสถานะ และใช้หัว [INFY PLUS](/products/pod-169) ขนาด 2.5mL ที่มีคอยล์ในตัว ซึ่ง INFY ระบุว่าใส่กับตัวเครื่องของ INFY ได้ ฝั่ง KS มีชุด [KS Quikpro 15K Kit](/products/ks-quikpro-kit) แบต 600mAh ชาร์จผ่าน USB-C ราว 30 นาที และใช้[หัว KS Quikpro](/products/pod-150) ขนาด 15mL ที่ KS ระบุไว้หัวละสูงสุด 15,000 พัฟ หัวนี้ใช้จนหมดแล้วก็เปลี่ยนหัวใหม่ ดูรุ่นอื่นของแต่ละแบรนด์ได้ที่หน้า [ESKO BAR](/brands/esko-bar) · [INFY](/brands/infy) และ [KS](/brands/kardinal-stick)",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "พอตเปลี่ยนหัวต่างจากพอตใช้แล้วทิ้งยังไง",
          answer:
            "ต่างกันตอนน้ำยาหมดค่ะ พอตเปลี่ยนหัวเก็บตัวเครื่องไว้ แล้วเปลี่ยนแค่หัวพอตบรรจุสำเร็จ ส่วนพอตใช้แล้วทิ้งเปลี่ยนใหม่ทั้งเครื่อง ทั้งสองแบบมีน้ำยามาให้พร้อมใช้เหมือนกัน หัวพอตหนึ่งหัวก็คือหนึ่งกลิ่น อยากเปลี่ยนกลิ่นก็เปลี่ยนแค่หัว อ่านการเทียบสองแบบได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) และดูรุ่นใช้แล้วทิ้งได้ที่หมวด [พอตใช้แล้วทิ้ง](/products/disposables) ค่ะ",
        },
        {
          question: "หัวพอตใส่กับเครื่องรุ่นไหนได้บ้าง",
          answer:
            "หัวพอตแต่ละรุ่นใส่ได้กับเครื่องที่ผู้ผลิตระบุไว้ค่ะ เช่น M Switch Pod ใช้กับ M Switch Kit และหัว KS Quikpro ใช้กับเครื่อง KS Quikpro บางรุ่นก็ใช้หัวร่วมกันได้ อย่าง RELX Infinity 2 Plus ที่ใส่ได้ทั้งหัว RELX Pod · Pod Pro และ Pod Pro 2 ส่วน RELX Creator ร้านยืนยันแล้วว่าใส่ได้ทั้ง RELX Creator Pod และ Muro Connector 20K และ [nexPOD 15K Pro Kit](/products/nexpod-15k) ของ WOTOFO ใส่ได้ทั้งหัวพอตบรรจุสำเร็จ และหัวแบบเติมน้ำยาเองที่ WOTOFO ขายแยก ก่อนซื้อหัวพอต เช็คชื่อรุ่นเครื่องในหน้าสินค้าอีกครั้งนะคะ",
        },
        {
          question: "พอตเปลี่ยนหัว ชาร์จได้ไหม",
          answer:
            "ตัวเครื่องที่ผู้ผลิตบอกเรื่องการชาร์จไว้ ชาร์จได้ค่ะ M Switch Kit · Zero Pro · RELX Creator · RELX Infinity 2 Plus · INFY POD และ KS Quikpro 15K Kit ชาร์จผ่าน USB-C ส่วน Esko Bar Switch 20K ผู้ผลิตระบุการชาร์จไว้ที่ 5V 0.85A และ nexPOD 15K Pro Kit รองรับการชาร์จเร็ว รุ่นอื่นดูได้ในตารางสเปกของรุ่นนั้นค่ะ",
        },
        {
          question: "หัวพอตหนึ่งหัวใช้ได้กี่พัฟ",
          answer:
            "ดูได้จากจำนวนพัฟที่ระบุไว้ในหน้าสินค้าค่ะ เช่น หัว Esko Bar Switch หัวละสูงสุด 20,000 พัฟ หัว Nexswitch 16K หัวละสูงสุด 16,000 พัฟ ส่วน M Switch Pod กับหัว KS Quikpro ระบุไว้หัวละสูงสุด 15,000 พัฟ และหัวของ nexPOD 15K ระบุไว้หัวละ 15,000 พัฟ ตัวเลขพัฟเป็นจำนวนที่ระบุไว้ จะสูบได้ใกล้แค่ไหนขึ้นกับว่าแต่ละคนสูบถี่และดูดยาวแค่ไหนค่ะ",
        },
      ],
    },
    en: {
      heading: "Switch pods on this page, and how they differ",
      intro:
        "Every switch pod here works the same way: you keep the device, and when a prefilled pod runs out, you fit a new one. What sets them apart is the pod each family takes, how many puffs it is rated for and which devices it fits, and what the device itself offers in screen, modes and battery. Below is a short guide to the three main families.",
      families: [
        {
          heading: "SALTHUB M Switch and Zero",
          body:
            "The [M Switch Kit](/products/m-switch-kit) is a device with a pod, the set we sell as the M Bar 15K, or Marbo 15K. It takes the [M Switch Pod](/products/m-switch-pod), rated by SALTHUB at up to 15,000 puffs per pod, with a cotton mesh coil. The device has a digital battery display and an airflow slider, and charges over USB-C. The Zero family has the 2.2mL [Zero Cartridge](/products/zero-cartridge) pod; the [Zero Pro](/products/zero-pro) device has three power modes and a 380mAh battery, and the [Zero Nano](/products/zero-nano) is the compact one, with 500mAh. More from the brand is on the [SALTHUB](/brands/salthub) page.",
        },
        {
          heading: "RELX Creator and Infinity",
          body:
            "The [RELX Creator](/products/relx-creator) is sold as the device alone, with pods bought separately. It has an 800mAh battery with USB-C charging, a pixel screen with emoji faces and adjustable airflow; double-click to switch between Normal at 15W and Boost at 25W. It takes both [RELX Creator Pods](/products/relx-creator-pod-20k) and [Muro Connector 20K](/products/muro-connector-20k) pods, and we have confirmed both with our own stock. The [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) has a 440mAh battery and three modes, Eco 6.5W, Smooth 8W and Boost 10W, and RELX says it charges to 80% in 15 minutes over USB-C. It takes RELX Pod, RELX Pod Pro and RELX Pod Pro 2; Pod Pro 2 flavors are on the [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) page. The [RELX Essential 2](/products/relx-essential-2) device is here too.",
        },
        {
          heading: "ESKO BAR SWITCH, INFY and KS",
          body:
            "The [Esko Bar Switch 20K](/products/pod-159) takes [Esko Bar Switch pods](/products/esko-bar-switch-pod), rated by ESKO BAR at up to 20,000 puffs each, with 18mL of e-liquid and two coils that heat together. The device has an 850mAh battery, one button to switch between High and Low, and three airflow settings you turn at the base. The [INFY POD](/products/infy-pod) has a 400mAh battery, USB-C charging and a multi-colored LED that shows its status. It takes the 2.5mL [INFY PLUS](/products/pod-169) pod with a built-in coil, which INFY lists for its own device. The [KS Quikpro 15K Kit](/products/ks-quikpro-kit) has a 600mAh battery that charges over USB-C in about 30 minutes, and takes the 15mL [KS Quikpro pod](/products/pod-150), rated by KS at up to 15,000 puffs: use it until it is empty, then fit a new one. More from each brand is on the [ESKO BAR](/brands/esko-bar), [INFY](/brands/infy) and [KS](/brands/kardinal-stick) pages.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "How is a switch pod different from a disposable?",
          answer:
            "The difference shows when the e-liquid runs out. With a switch pod you keep the device and change only the prefilled pod; a disposable is replaced as a whole. Both come ready filled, and each pod is one flavor, so a new pod means a new flavor. Disposables are on the [Disposables](/products/disposables) page.",
        },
        {
          question: "Which devices does each pod fit?",
          answer:
            "Each pod fits the devices its maker names: the M Switch Pod fits the M Switch Kit, and the KS Quikpro pod fits the KS Quikpro. Some pods are shared. The RELX Infinity 2 Plus takes RELX Pod, Pod Pro and Pod Pro 2, and the RELX Creator takes both RELX Creator Pods and Muro Connector 20K, as we have confirmed in store. WOTOFO's [nexPOD 15K Pro Kit](/products/nexpod-15k) takes its prefilled pod as well as the refillable pod WOTOFO sells separately. Before you buy a pod, check the device name on the product page.",
        },
        {
          question: "Can a switch pod device be recharged?",
          answer:
            "Yes, on every model whose maker covers charging. The M Switch Kit, Zero Pro, RELX Creator, RELX Infinity 2 Plus, INFY POD and KS Quikpro 15K Kit all charge over USB-C. ESKO BAR rates the Esko Bar Switch 20K's charging at 5V 0.85A, and the nexPOD 15K Pro Kit supports fast charging. For other models, see the spec table on the product page.",
        },
        {
          question: "How many puffs does one pod give?",
          answer:
            "Look for the puff count on the product page. The Esko Bar Switch pod is rated at up to 20,000 puffs, the Nexswitch 16K pod at up to 16,000, the M Switch Pod and KS Quikpro pod at up to 15,000 each, and the nexPOD 15K pod at 15,000. These are stated figures; how close you get depends on how often and how long you draw.",
        },
      ],
    },
    zh: {
      heading: "本页换弹式设备，各系列有什么不同",
      intro:
        "本页的换弹式设备原理相同：主机留着继续用，预注油烟弹用完后换一颗新的。区别在于各系列所用的烟弹，每颗标称多少口、适配哪些主机，以及主机本身的屏幕、模式和电池。下面简要介绍三个主要系列。",
      families: [
        {
          heading: "SALTHUB M Switch 与 Zero",
          body:
            "[M Switch Kit](/products/m-switch-kit) 是主机加烟弹的套装，本店称之为 M Bar 15K，也叫 Marbo 15K。它搭配 [M Switch Pod](/products/m-switch-pod) 烟弹，SALTHUB 标称每颗最高 15,000 口，采用 cotton mesh 雾化芯；主机配有数字电量屏和进气滑块，USB-C 充电。Zero 系列有 2.2mL 的 [Zero Cartridge](/products/zero-cartridge) 烟弹；[Zero Pro](/products/zero-pro) 主机有三种功率模式，电池 380mAh，[Zero Nano](/products/zero-nano) 是系列中的小巧款，电池 500mAh。更多产品见 [SALTHUB](/brands/salthub) 品牌页。",
        },
        {
          heading: "RELX Creator 与 Infinity",
          body:
            "[RELX Creator](/products/relx-creator) 只售主机，烟弹另购。主机电池 800mAh，USB-C 充电，配像素屏，可显示表情，进气可调；双击即可在 Normal 15W 与 Boost 25W 之间切换。它可使用 [RELX Creator Pod](/products/relx-creator-pod-20k) 和 [Muro Connector 20K](/products/muro-connector-20k) 烟弹，两者均经本店以实物确认。[RELX Infinity 2 Plus](/products/relx-infinity-2-plus) 电池 440mAh，有 Eco 6.5W、Smooth 8W、Boost 10W 三种模式，RELX 标称 USB-C 充电 15 分钟可达 80%；适配 RELX Pod、RELX Pod Pro 和 RELX Pod Pro 2，Pod Pro 2 的口味见 [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) 页面。本页另有 [RELX Essential 2](/products/relx-essential-2) 主机。",
        },
        {
          heading: "ESKO BAR SWITCH、INFY 与 KS",
          body:
            "[Esko Bar Switch 20K](/products/pod-159) 搭配 [Esko Bar Switch 烟弹](/products/esko-bar-switch-pod)，ESKO BAR 标称每颗最高 20,000 口，容量 18mL，内置双雾化芯同时加热。主机电池 850mAh，一键切换 High 与 Low 模式，旋转底部可调三档进气。[INFY POD](/products/infy-pod) 电池 400mAh，USB-C 充电，多色 LED 显示状态；搭配内置雾化芯的 2.5mL [INFY PLUS](/products/pod-169) 烟弹，INFY 标明可用于其自家主机。[KS Quikpro 15K Kit](/products/ks-quikpro-kit) 电池 600mAh，USB-C 充电约 30 分钟，搭配 15mL 的 [KS Quikpro 烟弹](/products/pod-150)，KS 标称每颗最高 15,000 口，用完即换新。各品牌更多产品见 [ESKO BAR](/brands/esko-bar)、[INFY](/brands/infy) 与 [KS](/brands/kardinal-stick) 品牌页。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "换弹式设备和一次性电子烟有什么不同？",
          answer:
            "区别在烟油用完的时候：换弹式设备保留主机，只换预注油烟弹；一次性电子烟则整支更换。两者都已预先注好烟油，一颗烟弹就是一种口味，换烟弹即可换口味。一次性电子烟见 [一次性电子烟](/products/disposables) 页面。",
        },
        {
          question: "每款烟弹适配哪些主机？",
          answer:
            "各款烟弹适配厂商标明的主机，例如 M Switch Pod 适配 M Switch Kit，KS Quikpro 烟弹适配 KS Quikpro 主机。部分烟弹可以共用：RELX Infinity 2 Plus 可用 RELX Pod、Pod Pro 和 Pod Pro 2；RELX Creator 可用 RELX Creator Pod 与 Muro Connector 20K，已经本店确认。WOTOFO 的 [nexPOD 15K Pro Kit](/products/nexpod-15k) 既可用预注油烟弹，也可用 WOTOFO 另售的可注油烟弹。购买烟弹前，请在产品页面再核对一次主机型号。",
        },
        {
          question: "换弹式设备可以充电吗？",
          answer:
            "厂商有说明充电的型号都可以充电。M Switch Kit、Zero Pro、RELX Creator、RELX Infinity 2 Plus、INFY POD 和 KS Quikpro 15K Kit 均为 USB-C 充电；ESKO BAR 标明 Esko Bar Switch 20K 的充电规格为 5V 0.85A，nexPOD 15K Pro Kit 支持快充。其他型号请查看产品页面的规格表。",
        },
        {
          question: "一颗烟弹能抽多少口？",
          answer:
            "请看产品页面标明的口数。Esko Bar Switch 烟弹每颗最高 20,000 口，Nexswitch 16K 烟弹每颗最高 16,000 口，M Switch Pod 与 KS Quikpro 烟弹每颗最高 15,000 口，nexPOD 15K 烟弹每颗 15,000 口。这些都是标称数字，实际能抽到多少，取决于每个人抽吸的频率和时长。",
        },
      ],
    },
  },
  disposables: {
    th: {
      heading: "พอตใช้แล้วทิ้งแต่ละยี่ห้อบนหน้านี้ ต่างกันตรงไหน",
      intro:
        "พอตใช้แล้วทิ้งทุกรุ่นบนหน้านี้มีน้ำยามาในเครื่องแล้ว ใช้ไปจนน้ำยาหมดแล้วก็เปลี่ยนเครื่องใหม่ สิ่งที่ต่างกันจึงอยู่ที่จำนวนพัฟ ความจุน้ำยา คอยล์ และแบตว่าชาร์จซ้ำได้ไหม\n\nด้านล่างนี้สรุปรุ่นหลักไว้เป็นสามกลุ่ม ถ้าอยากเลือกตามสิ่งที่ต้องการทีละเรื่อง อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง ยี่ห้อไหนดี](/guides/choosing-a-disposable)",
      families: [
        {
          heading: "M Bar จาก SALTHUB",
          body:
            "[M Bar 10K](/products/m-bar-10k) กับ [M Bar 9K](/products/m-bar-9k) เป็นพอตใช้แล้วทิ้งของ SALTHUB ในตระกูลที่หลายร้านเรียกว่า Marbo ทั้งสองรุ่นแบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C และปรับช่องลมได้ M Bar 10K รองรับสูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh มี 3 โหมด Eco · Soft · Boost กดสองครั้งติดกันเพื่อสลับ และมีไฟ LED บอกระดับแบต ส่วน M Bar 9K สูงสุด 9,000 พัฟ ใช้ salt nic 30mg และมีกลิ่นให้เลือกมากกว่า ถ้ากำลังหา M Bar 15K ชุดนี้คือ [M Switch Kit](/products/m-switch-kit) ที่เก็บตัวเครื่องไว้แล้วเปลี่ยนแค่หัวพอต จึงอยู่ในหมวด[พอตเปลี่ยนหัว](/products/switch-pods)",
        },
        {
          heading: "ESKO BAR · TFIT และ WOTOFO",
          body:
            "[ESKO BAR 20000](/products/esko-bar-20k) ผู้ผลิตระบุไว้สูงสุด 20,000 พัฟ น้ำยา 18mL ใช้คอยล์ mesh สองตัว 1.0 โอห์ม แบต 600mAh ชาร์จได้ และความเข้มข้นนิโคติน 3% [TFIT M Power 20K](/products/tfit-m-power-20k) ก็รองรับสูงสุด 20,000 พัฟเช่นกัน น้ำยา 18mL ใช้คอยล์ mesh สองตัว 0.8 โอห์ม แบต 600mAh ชาร์จผ่าน USB-C และปรับช่องลมได้ ส่วน [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) สูงสุด 18,000 พัฟ น้ำยา 21mL แบต 750mAh มีโหมด NORM 16 วัตต์ กับ TURBO 19 วัตต์ และมีจอ LED ที่บอกทั้งแบต น้ำยาที่เหลือ และโหมดที่ใช้อยู่ อีกรุ่นที่ชื่อคล้ายกันคือ [nexBar CLEAR 18K](/products/pod-180) ตัวใส ซึ่งเป็นคนละรุ่นกับของ WOTOFO รุ่นนี้ระบุไว้สูงสุด 18,000 พัฟ น้ำยา 18mL แบต 650mAh และมีโหมด Normal กับ Turbo",
        },
        {
          heading: "RELX · INFY และ JOIWAY",
          body:
            "[RELX Smash Go 12K](/products/relx-smash-go-12k) รองรับสูงสุด 12,000 พัฟ แบต 400mAh ชาร์จผ่าน USB-C ใช้คอยล์ MEGA MESH และมีความเข้มข้นให้เลือก 3% หรือ 5% ส่วน [RELX LUMI 18K](/products/relx-lumi-18k) พิมพ์ 18,000 พัฟไว้บนซอง [INFY 20K](/products/infy-20k) ร้านยืนยันความจุน้ำยาไว้ที่ 20mL และยืนยันว่าปรับช่องลมได้ ฝั่ง JOIWAY มี [Joiway F4](/products/joiway-f4) ที่มีถังน้ำยาสองถัง ถังละหนึ่งกลิ่น หมุนปากดูดเพื่อสลับกลิ่น ระบุไว้สูงสุด 20,000 พัฟ แบ่งเป็นฝั่งละ 10,000 พัฟ แบต 650mAh และมีจอ LED ส่วน [Joiway F3](/products/joiway-f3) เป็นรุ่นกลิ่นเดียว ระบุไว้ 12,000 พัฟขึ้นไป ใช้นาโนคอยล์ และชาร์จผ่าน USB-C",
        },
      ],
      brandTable: {
        heading: "เทียบแต่ละยี่ห้อจากจำนวนรุ่น ราคา และพัฟ",
        lede: "ตารางนี้สรุปแต่ละยี่ห้อจากรุ่นที่ร้านลงไว้บนหน้านี้ ให้เทียบกันได้ในที่เดียว ส่วนถ้าอยากเลือกจากจอ ช่องลม หรือสองกลิ่นในเครื่องเดียว ร้านเล่าไว้ที่ [พอตใช้แล้วทิ้ง ยี่ห้อไหนดี](/guides/choosing-a-disposable)",
        brand: "ยี่ห้อ",
        models: "รุ่น",
        from: "ราคาเริ่ม",
        topPuffs: "พัฟสูงสุด",
        bestSeller: "ขายดี",
        note: "ช่องที่ขึ้น “—” คือค่าที่ยังไม่ยืนยัน ป้าย “ขายดี” คือยี่ห้อที่มีรุ่นขายดีของร้าน ส่วนรุ่นอื่นบนหน้านี้ไม่ได้ระบุยี่ห้อ จึงไม่อยู่ในตารางนี้",
      },
      chooser: {
        jump: "ดูตารางเทียบทุกรุ่น",
        topJump: "เลือกตามจำนวนพัฟหรืองบ",
        heading: "เลือกพอตใช้แล้วทิ้งตามพัฟหรืองบ",
        lede: "ราคาบนหน้านี้เริ่มที่ {min} ถ้ามีจำนวนพัฟหรืองบในใจอยู่แล้ว ก็ดูรุ่นที่ตรงกันได้ด้านล่างนี้",
        puffPanelTitle: "จำนวนพัฟที่อยากได้",
        budgetPanelTitle: "งบที่ตั้งไว้",
        puffsUpFrom: "{n} พัฟขึ้นไป",
        puffsRange: "{a}–{b} พัฟ",
        puffsUpTo: "ไม่เกิน {n} พัฟ",
        puffsExact: "{n} พัฟ",
        priceUpTo: "ไม่เกิน {p}",
        priceRange: "{a}–{b}",
        priceUpFrom: "{p} ขึ้นไป",
        modelCount: "{n} รุ่น",
        modelCountOne: "{n} รุ่น",
        note: "ตัวเลขพัฟคือจำนวนสูงสุดที่ผู้ผลิตระบุ หรือตัวเลขในชื่อรุ่น ส่วนรุ่นที่ยังไม่ยืนยันจำนวนพัฟจะอยู่เฉพาะในรายการตามงบ",
      },
      compareTable: {
        heading: "สเปกหลักของทุกรุ่นบนหน้านี้",
        model: "รุ่น",
        puffs: "พัฟ",
        ml: "mL",
        mah: "mAh",
        price: "ราคา",
        note: "เรียงตามจำนวนพัฟจากมากไปน้อย ตัวเลขสเปกมาจากผู้ผลิต ชื่อรุ่น หรือค่าที่ร้านยืนยันเอง ช่องที่ขึ้น “—” คือค่าที่ยังไม่ยืนยัน",
        unconfirmed: "ยังไม่ยืนยัน",
      },
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "พอตใช้แล้วทิ้ง ชาร์จได้ไหม",
          answer:
            "แล้วแต่รุ่นค่ะ รุ่นที่ผู้ผลิตระบุว่าชาร์จซ้ำได้ผ่าน USB-C มี M Bar 9K · M Bar 10K · RELX Smash Go 12K · Joiway F3 · Joiway F4 · TFIT M Power 20K · WOTOFO nexBAR 18K และ nexBar CLEAR 18K ส่วน ESKO BAR 20000 ผู้ผลิตระบุว่าแบต 600mAh ชาร์จได้ ถ้าแบตหมดก่อนน้ำยา ก็ชาร์จแล้วสูบต่อได้ รุ่นอื่นดูได้ในตารางสเปกของรุ่นนั้นค่ะ",
        },
        {
          question: "พอตใช้แล้วทิ้งใช้ได้กี่พัฟ ดูจากตรงไหน",
          answer:
            "ดูได้จากจำนวนพัฟที่ระบุไว้ในหน้าสินค้าค่ะ บางรุ่นผู้ผลิตระบุไว้เอง เช่น TFIT M Power 20K สูงสุด 20,000 พัฟ และ SUP ZERO 22K ที่พิมพ์ 22,000 พัฟไว้บนซอง บางรุ่นอย่าง SKE Crystal B20000 ตัวเลขมาจากชื่อรุ่น ตัวเลขพัฟเป็นจำนวนสูงสุด จะสูบได้ใกล้แค่ไหนขึ้นกับวิธีสูบของแต่ละคน จึงควรดูความจุน้ำยาที่บอกเป็น mL ประกอบด้วย อ่านเพิ่มได้ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts) ค่ะ",
        },
        {
          question: "พอตใช้แล้วทิ้ง กับพอตเปลี่ยนหัว ต่างกันยังไง",
          answer:
            "พอตใช้แล้วทิ้งแกะแล้วใช้ได้ทันที พอน้ำยาหมดก็เปลี่ยนใหม่ทั้งเครื่อง ส่วนพอตเปลี่ยนหัวเก็บตัวเครื่องไว้ใช้ต่อ แล้วเปลี่ยนแค่หัวพอตบรรจุสำเร็จ ดูรุ่นแบบนี้ได้ที่หมวด [พอตเปลี่ยนหัว](/products/switch-pods) ถ้ายังเลือกไม่ถูก อ่าน [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) และถ้าอยากเติมน้ำยาเอง ดูหมวด [Pod System](/products/pod-systems) ได้ค่ะ",
        },
        {
          question: "ถ้ารสเพี้ยน ดูดไม่ขึ้น หรือไฟกะพริบ ทำยังไงดี",
          answer:
            "ถ้าเริ่มมีกลิ่นไหม้หรือรสไม่มา อ่านสาเหตุและวิธีกันไว้ได้ที่ [พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod) ส่วนถ้าดูดไม่ขึ้นหรือไฟกะพริบ ไล่เช็คทีละข้อได้ที่ [พอตดูดไม่ขึ้น](/guides/fixing-no-draw-and-blinking-light) ถ้าอ่านแล้วยังแก้ไม่ได้ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
      ],
    },
    en: {
      heading: "Disposables on this page, and how they differ",
      intro:
        "Every disposable here comes filled with e-liquid. Use it until the e-liquid runs out, then replace the whole device. What sets them apart is the puff count, e-liquid capacity, coil, and whether the battery recharges. Below is a short guide to three main groups.",
      families: [
        {
          heading: "SALTHUB M Bar",
          body:
            "The [M Bar 10K](/products/m-bar-10k) and [M Bar 9K](/products/m-bar-9k) are SALTHUB disposables from the line many Thai shops call Marbo. Both have a 600mAh battery that recharges over USB-C, and adjustable airflow. The M Bar 10K is rated at up to 10,000 puffs and uses a cotton mesh coil, with three modes, Eco, Soft and Boost, switched by a double-click, and an LED battery indicator. The M Bar 9K is rated at up to 9,000 puffs, uses 30mg salt nic and comes in more flavors. Looking for the M Bar 15K? That set is the [M Switch Kit](/products/m-switch-kit): you keep the device and change only the pod, so it sits under [Switch Pods](/products/switch-pods).",
        },
        {
          heading: "ESKO BAR, TFIT and WOTOFO",
          body:
            "The [ESKO BAR 20000](/products/esko-bar-20k) is rated by its maker at up to 20,000 puffs, with 18mL of e-liquid, two 1.0Ω mesh coils, a rechargeable 600mAh battery and 3% nicotine. The [TFIT M Power 20K](/products/tfit-m-power-20k) is also rated at up to 20,000 puffs, with 18mL, two 0.8Ω mesh coils, a 600mAh battery that charges over USB-C, and adjustable airflow. The [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) is rated at up to 18,000 puffs, with 21mL, a 750mAh battery, NORM 16W and TURBO 19W modes, and an LED screen that shows battery, e-liquid left and mode. The clear-bodied [nexBar CLEAR 18K](/products/pod-180) has a similar name but is a different model from WOTOFO's: up to 18,000 puffs, 18mL and 650mAh, with Normal and Turbo modes.",
        },
        {
          heading: "RELX, INFY and JOIWAY",
          body:
            "The [RELX Smash Go 12K](/products/relx-smash-go-12k) is rated at up to 12,000 puffs, with a MEGA MESH coil, a 400mAh battery that charges over USB-C, and a choice of 3% or 5% nicotine. The [RELX LUMI 18K](/products/relx-lumi-18k) prints 18,000 puffs on its pack. For the [INFY 20K](/products/infy-20k), we have confirmed a 20mL capacity and adjustable airflow ourselves. From JOIWAY, the [Joiway F4](/products/joiway-f4) has two tanks with one flavor each; turn the mouthpiece to switch. It is rated at up to 20,000 puffs, 10,000 per side, with a 650mAh battery and an LED display. The [Joiway F3](/products/joiway-f3) is the single-flavor model, rated at 12,000+ puffs, with a nano coil and USB-C charging.",
        },
      ],
      brandTable: {
        heading: "Brands compared by models, price and puffs",
        lede: "This table sums up each brand from the models we list on this page, so you can compare them in one place. Screen, airflow and dual-tank details are on each product page.",
        brand: "Brand",
        models: "Models",
        from: "From",
        topPuffs: "Max puffs",
        bestSeller: "Best seller",
        note: "A dash (—) means there is no verified number yet. The “Best seller” tag marks a brand with one of our best-selling models. Other models on this page list no brand, so they are not in this table.",
      },
      chooser: {
        jump: "See the full table",
        topJump: "Choose by puffs or budget",
        heading: "Choose by puffs or budget",
        lede: "Prices on this page start at {min}, and the models below are grouped by puff count and by budget.",
        puffPanelTitle: "By puff count",
        budgetPanelTitle: "By budget",
        puffsUpFrom: "{n} puffs and up",
        puffsRange: "{a}–{b} puffs",
        puffsUpTo: "Up to {n} puffs",
        puffsExact: "{n} puffs",
        priceUpTo: "Up to {p}",
        priceRange: "{a}–{b}",
        priceUpFrom: "{p} and up",
        modelCount: "{n} models",
        modelCountOne: "{n} model",
        note: "Puff figures are the top number the maker gives, or the number in the model name. Models with no verified puff figure appear only in the budget list.",
      },
      compareTable: {
        heading: "Key specs for every model on this page",
        model: "Model",
        puffs: "Puffs",
        ml: "mL",
        mah: "mAh",
        price: "Price",
        note: "Sorted by puffs, highest first. Spec figures come from the maker, the model name or our own confirmation. A dash (—) means there is no verified number yet.",
        unconfirmed: "Not verified yet",
      },
      faqHeading: "Common questions",
      faq: [
        {
          question: "Can a disposable be recharged?",
          answer:
            "It depends on the model. The makers of the M Bar 9K, M Bar 10K, RELX Smash Go 12K, Joiway F3, Joiway F4, TFIT M Power 20K, WOTOFO nexBAR 18K and nexBar CLEAR 18K state USB-C recharging, and ESKO BAR says the ESKO BAR 20000's 600mAh battery is rechargeable. If the battery runs flat before the e-liquid, charge it and carry on. For other models, see the spec table on the product page.",
        },
        {
          question: "How many puffs will I get, and how do I read the number?",
          answer:
            "Check the puff count on the product page. Some figures come from the maker, such as up to 20,000 for the TFIT M Power 20K and the 22,000 printed on the SUP ZERO 22K pack; for others, like the SKE Crystal B20000, the number comes from the model name. Puff counts are maximums, and how close you get depends on how you vape, so it is worth looking at the e-liquid capacity in mL as well.",
        },
        {
          question: "How is a disposable different from a switch pod?",
          answer:
            "A disposable is ready to use straight away and is replaced as a whole when the e-liquid runs out. With a switch pod you keep the device and change only the prefilled pod; those are on the [Switch Pods](/products/switch-pods) page. If you would rather fill your own, see our [Pod Systems](/products/pod-systems) and the [Pod System vs. disposable guide](/guides/open-system-vs-disposable).",
        },
        {
          question: "Burnt taste, no draw or a blinking light?",
          answer:
            "If the taste turns burnt, the device will not draw, or the light blinks, message us on LINE @okm24 and tell us the model and what is happening.",
        },
      ],
    },
    zh: {
      heading: "本页一次性电子烟，各品牌有什么不同",
      intro:
        "本页的一次性电子烟都已注好烟油，用到烟油耗尽后整支更换。区别在于口数、烟油容量、雾化芯，以及电池能否充电。下面按三组简要介绍。",
      families: [
        {
          heading: "SALTHUB M Bar",
          body:
            "[M Bar 10K](/products/m-bar-10k) 和 [M Bar 9K](/products/m-bar-9k) 是 SALTHUB 的一次性电子烟，泰国不少店家称这个系列为 Marbo。两款电池均为 600mAh，可通过 USB-C 充电，进气可调。M Bar 10K 标称最高 10,000 口，采用 cotton mesh 雾化芯，有 Eco、Soft、Boost 三种模式，双击切换，并有 LED 电量指示；M Bar 9K 标称最高 9,000 口，使用 30mg salt nic，口味选择更多。如果在找 M Bar 15K，这套就是 [M Switch Kit](/products/m-switch-kit)：保留主机、只换烟弹，所以归在 [换弹式设备](/products/switch-pods)。",
        },
        {
          heading: "ESKO BAR、TFIT 与 WOTOFO",
          body:
            "[ESKO BAR 20000](/products/esko-bar-20k) 厂商标称最高 20,000 口，烟油 18mL，双 mesh 雾化芯 1.0Ω，600mAh 可充电电池，尼古丁浓度 3%。[TFIT M Power 20K](/products/tfit-m-power-20k) 同样标称最高 20,000 口，烟油 18mL，双 mesh 雾化芯 0.8Ω，600mAh 电池 USB-C 充电，进气可调。[WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) 标称最高 18,000 口，烟油 21mL，电池 750mAh，有 NORM 16W 和 TURBO 19W 两种模式，LED 屏可显示电量、剩余烟油和当前模式。名字相近的 [nexBar CLEAR 18K](/products/pod-180) 是透明机身，与 WOTOFO 的型号不同：最高 18,000 口，烟油 18mL，电池 650mAh，有 Normal 与 Turbo 两种模式。",
        },
        {
          heading: "RELX、INFY 与 JOIWAY",
          body:
            "[RELX Smash Go 12K](/products/relx-smash-go-12k) 标称最高 12,000 口，MEGA MESH 雾化芯，400mAh 电池 USB-C 充电，尼古丁浓度可选 3% 或 5%。[RELX LUMI 18K](/products/relx-lumi-18k) 的包装印有 18,000 口。[INFY 20K](/products/infy-20k) 经本店确认容量 20mL，进气可调。JOIWAY 的 [Joiway F4](/products/joiway-f4) 内有两个油仓，各装一种口味，转动烟嘴即可切换，标称最高 20,000 口，每侧 10,000 口，电池 650mAh，配 LED 屏；[Joiway F3](/products/joiway-f3) 是单一口味款，标称 12,000 口以上，采用 nano 雾化芯，USB-C 充电。",
        },
      ],
      brandTable: {
        heading: "按款数、价格和口数对比各品牌",
        lede: "本表汇总本页所列型号，方便在同一处对比各品牌。屏幕、进气调节和双油仓等信息，请查看各产品页面。",
        brand: "品牌",
        models: "款数",
        from: "起价",
        topPuffs: "最高口数",
        bestSeller: "热销",
        note: "显示“—”表示暂无已核实的数据。“热销”标签表示该品牌有本店热销型号。本页其余型号未标注品牌，因此未列入此表。",
      },
      chooser: {
        jump: "查看完整对比表",
        topJump: "按口数或预算挑选",
        heading: "按口数或预算挑选",
        lede: "本页价格 {min} 起，下方已按口数和预算分好组，可直接查看符合需求的型号。",
        puffPanelTitle: "按口数",
        budgetPanelTitle: "按预算",
        puffsUpFrom: "{n} 口及以上",
        puffsRange: "{a}–{b} 口",
        puffsUpTo: "{n} 口以内",
        puffsExact: "{n} 口",
        priceUpTo: "{p} 以内",
        priceRange: "{a}–{b}",
        priceUpFrom: "{p} 及以上",
        modelCount: "{n} 款",
        modelCountOne: "{n} 款",
        note: "口数取厂商标称的最高数值或型号名称中的数字；暂无已核实口数的型号仅列在“按预算”一栏。",
      },
      compareTable: {
        heading: "本页各型号主要规格",
        model: "型号",
        puffs: "口数",
        ml: "mL",
        mah: "mAh",
        price: "价格",
        note: "按口数从高到低排列。规格数据来自厂商、型号名称或本店确认；显示“—”表示暂无已核实的数据。",
        unconfirmed: "未核实",
      },
      faqHeading: "常见问题",
      faq: [
        {
          question: "一次性电子烟可以充电吗？",
          answer:
            "视型号而定。M Bar 9K、M Bar 10K、RELX Smash Go 12K、Joiway F3、Joiway F4、TFIT M Power 20K、WOTOFO nexBAR 18K 和 nexBar CLEAR 18K 的厂商均标明可通过 USB-C 充电；ESKO BAR 标明 ESKO BAR 20000 的 600mAh 电池可充电。电池比烟油先用完时，充电后即可继续使用。其他型号请查看产品页面的规格表。",
        },
        {
          question: "能抽多少口？口数怎么看？",
          answer:
            "请看产品页面标明的口数。有些是厂商标称，例如 TFIT M Power 20K 最高 20,000 口，SUP ZERO 22K 的包装印有 22,000 口；有些如 SKE Crystal B20000，数字来自型号名称。口数都是最高值，实际能抽多少取决于个人抽法，所以建议同时参考以 mL 标示的烟油容量。",
        },
        {
          question: "一次性电子烟和换弹式设备有什么不同？",
          answer:
            "一次性电子烟拆开即可使用，烟油用完整支更换；换弹式设备保留主机，只换预注油烟弹，可在 [换弹式设备](/products/switch-pods) 页面查看。如果想自己加烟油，可看 [Pod System](/products/pod-systems) 页面与 [Pod System 与一次性电子烟对比](/guides/open-system-vs-disposable)。",
        },
        {
          question: "出现焦味、抽不出烟或指示灯闪烁怎么办？",
          answer:
            "如果出现焦味、抽不出烟或指示灯闪烁，请通过 LINE @okm24 联系我们，告诉我们型号和具体情况。",
        },
      ],
    },
  },
  "pods-cartridges": {
    th: {
      heading: "หัวพอตเปล่ากับหัวพอตที่มีคอยล์ในตัว ต่างกันตรงไหน",
      intro:
        "หัวพอตทุกรุ่นบนหน้านี้เป็นแบบเติมน้ำยาเอง หรือที่หลายคนเรียกว่าหัวพอตรีฟิล และแบ่งได้เป็นสองแบบ หัวพอตที่มีคอยล์ในตัว พอคอยล์หมดสภาพก็เปลี่ยนทั้งหัว ส่วนหัวพอตเปล่าใส่คอยล์แยกเอง พอคอยล์หมดสภาพก็เปลี่ยนแค่คอยล์ ตัวหัวพอตยังใช้ต่อได้\n\nก่อนเลือก ควรเช็คชื่อรุ่นเครื่องให้ตรง เพราะหัวพอตแต่ละแบบใช้ได้เฉพาะกับเครื่องที่ระบุไว้ในหน้าสินค้า ด้านล่างนี้สรุปแต่ละตระกูลไว้สั้น ๆ ส่วนหัวพอตที่มีน้ำยามาในตัวอยู่ที่หน้า [พอตเปลี่ยนหัว](/products/switch-pods)",
      families: [
        {
          heading: "หัวพอต Caliburn จาก UWELL",
          body:
            "[หัวพอต GPP](/products/coil-94) มีคอยล์ mesh ในตัว เลือกได้ 0.4 · 0.6 · 0.9 และ 1.2 โอห์ม จุน้ำยา 2.0–3.0mL แล้วแต่ชนิดหัว และ UWELL ระบุว่าใช้ได้กับเครื่องซีรีส์ Caliburn G5 · G4 · G3 ส่วน Caliburn G2 กับ Caliburn X ใช้หัวพอตเปล่า โดย[หัวพอต Caliburn G2](/products/coil-55) จุ 2mL เติมด้านบน และ[หัวพอต Caliburn X](/products/coil-74) จุ 3mL ทั้งสองหัวใช้คู่กับ [คอยล์ Caliburn G](/products/coil-53) ได้ คือ G 0.8 โอห์ม · G 1.0 โอห์ม และ G2 1.2 โอห์ม ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [UWELL](/brands/uwell)",
        },
        {
          heading: "หัวพอต ARGUS และ VMATE จาก VOOPOO",
          body:
            "[หัวพอต ARGUS](/products/coil-21) มีสองแบบ แบบเติมด้านข้างจุ 2mL มีคอยล์ในตัว 0.7 หรือ 1.2 โอห์ม กล่องละ 3 หัว ส่วนแบบ Top Fill เติมด้านบนมี 0.4 · 0.7 และ 1.0 โอห์ม VOOPOO ระบุว่า ARGUS G4 · G4 mini และ P3 ใส่หัวพอตตระกูล ARGUS ได้ทุกหัว และ ARGUS G3 mini ใช้แบบ Top Fill ทั้งสามค่านี้ [หัวพอต VMATE](/products/coil-72) จุ 3mL มีคอยล์ในตัวเช่นกัน แบบ V2 เติมด้านข้างมี 0.7 และ 1.2 โอห์ม แบบ Top Fill เติมด้านบนมี 0.4 · 0.7 และ 1.0 โอห์ม และ VMATE i3 ใส่หัวพอต VMATE ได้ทุกหัว ส่วน[หัวพอต Argus P1](/products/coil-83) เป็นหัวพอตเปล่า จุ 2.0mL กล่องละ 2 หัว ใช้กับ Argus Pod · P1 · Z · G · A และต้องซื้อคอยล์ ITO แยก ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [VOOPOO](/brands/voopoo)",
        },
        {
          heading: "หัวพอตสำหรับ DRAG · Feelin และ Jellybox",
          body:
            "บนหน้านี้มีหัวพอตเปล่าสำหรับเครื่อง DRAG สามแบบ และแต่ละแบบใช้กับเครื่องคนละรุ่น [หัวพอต PnP X](/products/coil-56) จุ 5mL เติมด้านข้าง กล่องละ 2 หัว ใช้กับ DRAG S2 และ DRAG X2 คู่กับคอยล์ PnP X ส่วน [TPP Pod](/products/coil-87) จุ 5.5mL ใช้กับ DRAG 3 Kit และ DRAG X Plus Kit คู่กับคอยล์ตระกูล TPP และ[หัวพอต ITO-X](/products/coil-68) จุ 3.5mL เติมด้านบน ใช้กับ DRAG Q Pod Kit คู่กับคอยล์ ITO ฝั่ง NEVOKS มี[หัวพอต Feelin Mini](/products/coil-54) เป็นหัวพอตเปล่าจุ 2mL ใช้กับเครื่อง Feelin Mini คู่กับคอยล์ SPL10 และ RINCOE มี[หัวพอต Jellybox V](/products/coil-89) จุ 3.0mL เติมด้านข้าง เลือกได้ 0.8 หรือ 1.0 โอห์ม ใช้กับ Jellybox V1 · V2 และ V3 ดูรุ่นอื่นได้ที่หน้า [NEVOKS](/brands/nevoks) และ [RINCOE](/brands/rincoe)",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "หัวพอตเปล่าต้องซื้ออะไรเพิ่ม",
          answer:
            "ต้องมีคอยล์ที่ตรงกับหัวนั้นค่ะ เพราะหัวพอตเปล่ามาแค่ตัวหัว หัว Caliburn G2 กับ Caliburn X ใช้คอยล์ Caliburn G และ G2 · หัว PnP X ใช้คอยล์ PnP X · TPP Pod ใช้คอยล์ตระกูล TPP ซึ่งเลือกได้ที่หน้า [คอยล์และอุปกรณ์เสริม](/products/coils-accessories) ส่วนหัว ITO-X กับ Argus P1 ใช้คอยล์ ITO และ Feelin Mini ใช้คอยล์ SPL10 ค่ะ",
        },
        {
          question: "หัวพอตรีฟิลคืออะไร",
          answer:
            "คือหัวพอตที่เติมน้ำยาเองได้ค่ะ ซึ่งก็คือหัวพอตทุกรุ่นบนหน้านี้ มีทั้งแบบเติมด้านบนและแบบเติมด้านข้าง เลือกน้ำยาที่ชอบมาเติม แล้วใช้ไปจนถึงรอบเปลี่ยนหัวพอตหรือคอยล์",
        },
        {
          question: "รู้ได้ยังไงว่าหัวพอตไหนใส่กับเครื่องของเราได้",
          answer:
            "เริ่มจากชื่อรุ่นเครื่องค่ะ ในหน้าหัวพอตดูแถว “ใช้ได้กับ” หรือ “เป็นหัวพอตของ” ส่วนในหน้าเครื่องดูแถว “หัวพอตที่ใช้ได้” ถ้าชื่อเครื่องของคุณอยู่ในรายการก็เลือกหัวนั้นได้เลย ถ้ายังไม่แน่ใจ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
        {
          question: "หัวพอตจากอีกระบบ ใส่แทนกันได้ไหม",
          answer:
            "ใส่ได้เฉพาะในระบบเดียวกันค่ะ หัวพอตแต่ละระบบทำมาให้ใช้กับเครื่องในระบบนั้น ชื่อที่คล้ายกันจึงยังต้องเช็คก่อน อย่างหัวพอตของ Caliburn G2 กับหัวพอต GPP ที่เป็นคนละระบบกัน แม้จะชื่อ Caliburn เหมือนกัน ดูว่าเครื่องแต่ละกลุ่มใช้หัวพอตระบบไหนได้ที่หน้า [พอตซิสเต็ม](/products/pod-systems) ค่ะ",
        },
        {
          question: "หัวพอตกี่โอห์มดี เลือกยังไง",
          answer:
            "เลือกตามแนวการสูบที่ชอบค่ะ โอห์มต่ำสูบโล่งและใช้วัตต์สูง ส่วนโอห์มสูงสูบแน่นแบบ MTL และใช้วัตต์ต่ำ อย่างบน Caliburn G3 Pro หัว 0.4 โอห์มใช้ได้ 5–35 วัตต์ ส่วนหัว 0.9 โอห์มใช้ได้ 5–15 วัตต์ ก่อนเลือกโอห์มต่ำควรเช็คเครื่องด้วย เช่น หัว VMATE 0.4 โอห์มต้องใช้กับเครื่องที่จ่ายไฟได้ตั้งแต่ 30 วัตต์ อ่านต่อได้ที่ [เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
        },
        {
          question: "หัวพอตควรเปลี่ยนเมื่อไหร่",
          answer:
            "เมื่อรสเริ่มบาดคอหรือมีรสไหม้ ควันน้อยลง หรือมีเสียงน้ำยาดังจ๊อก ๆ ตอนสูบค่ะ สามอย่างนี้บอกว่าสำลีในคอยล์หมดสภาพแล้ว หัวพอตที่มีคอยล์ในตัวก็เปลี่ยนทั้งหัว ส่วนหัวพอตเปล่าเปลี่ยนแค่คอยล์ จากที่ร้านใช้เอง หัวพอตที่มีคอยล์ในตัวมักอยู่ได้ราว 1–3 สัปดาห์ แล้วแต่วิธีสูบและน้ำยาที่ใช้ อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
        },
      ],
    },
    en: {
      heading: "Empty pods and built-in coil pods, and how they differ",
      intro:
        "Every pod on this page is refillable: you fill it with the e-liquid you choose. A pod with a built-in coil is replaced whole when the coil wears out. An empty pod takes a separate coil, so you change only the coil and keep the pod.\n\nBefore you choose, check your device model, as each pod fits only the devices listed on its product page. Below is a short guide to each family. Prefilled pods are on the [Switch Pods](/products/switch-pods) page.",
      families: [
        {
          heading: "UWELL Caliburn pods",
          body:
            "The [GPP pod](/products/coil-94) has a built-in mesh coil in 0.4, 0.6, 0.9 or 1.2Ω and holds 2.0–3.0mL, depending on the type. UWELL lists it for the Caliburn G5, G4 and G3 series. The Caliburn G2 and Caliburn X use empty pods: the [Caliburn G2 pod](/products/coil-55) holds 2mL and fills from the top, and the [Caliburn X pod](/products/coil-74) holds 3mL. Both work with [Caliburn G coils](/products/coil-53): G 0.8Ω, G 1.0Ω and G2 1.2Ω. More from the brand is on the [UWELL](/brands/uwell) page.",
        },
        {
          heading: "VOOPOO ARGUS and VMATE pods",
          body:
            "The [ARGUS pod](/products/coil-21) comes in two types. The side-fill pod holds 2mL, has a built-in 0.7Ω or 1.2Ω coil and comes in boxes of 3. The Top Fill comes in 0.4, 0.7 and 1.0Ω. VOOPOO states that the ARGUS G4, G4 mini and P3 take every ARGUS-family cartridge, and that the ARGUS G3 mini takes these three Top Fill options. The [VMATE pod](/products/coil-72) holds 3mL and also has a built-in coil: 0.7Ω or 1.2Ω in the side-fill V2, and 0.4, 0.7 or 1.0Ω in the Top Fill. The VMATE i3 takes every VMATE cartridge. The [Argus P1 pod](/products/coil-83) is an empty pod that holds 2.0mL, comes in boxes of 2 and fits the Argus Pod, P1, Z, G and A, with ITO coils bought separately. More from the brand is on the [VOOPOO](/brands/voopoo) page.",
        },
        {
          heading: "Pods for DRAG, Feelin and Jellybox",
          body:
            "This page has three empty pods for DRAG devices, each for different models. The [PnP X pod](/products/coil-56) holds 5mL, fills from the side and comes in boxes of 2; it fits the DRAG S2 and DRAG X2 and takes PnP X coils. The [TPP Pod](/products/coil-87) holds 5.5mL, fits the DRAG 3 Kit and DRAG X Plus Kit and takes TPP-family coils. The [ITO-X pod](/products/coil-68) holds 3.5mL, fills from the top, fits the DRAG Q Pod Kit and takes ITO coils. From NEVOKS, the [Feelin Mini pod](/products/coil-54) is an empty 2mL pod for the Feelin Mini that takes SPL10 coils. From RINCOE, the [Jellybox V pod](/products/coil-89) holds 3.0mL, fills from the side, comes in 0.8Ω or 1.0Ω and fits the Jellybox V1, V2 and V3. More is on the [NEVOKS](/brands/nevoks) and [RINCOE](/brands/rincoe) pages.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "What else do I need with an empty pod?",
          answer:
            "A coil that matches it, since an empty pod comes without one. The Caliburn G2 and Caliburn X pods take Caliburn G and G2 coils, the PnP X pod takes PnP X coils, and the TPP Pod takes TPP-family coils; you'll find these on the [Coils & Accessories](/products/coils-accessories) page. The ITO-X and Argus P1 pods take ITO coils, and the Feelin Mini pod takes SPL10 coils.",
        },
        {
          question: "What is a refill pod?",
          answer:
            "A pod you fill yourself, which is every pod on this page. Some fill from the top and others from the side. Choose the e-liquid you like and use the pod until it is time to change the pod or coil.",
        },
        {
          question: "How do I know which pod fits my device?",
          answer:
            "Start with your device model. On a pod's page, look for the “Compatible devices” or “Pod of” row; on a device's page, look for the “Pod platform” row. If your device is listed, that pod is the one to choose. If you're still unsure, message us on LINE @okm24.",
        },
        {
          question: "Will a pod from another system fit?",
          answer:
            "Pods fit only within their own system, because each system is made for its own devices. Similar names still need checking: the Caliburn G2 pod and the GPP pod are separate systems, even though both belong to Caliburn devices. The [Pod Systems](/products/pod-systems) page shows which pods each group of devices uses.",
        },
        {
          question: "Which resistance should I choose?",
          answer:
            "Choose by the draw you like. Lower ohms give an airier draw and use more watts, while higher ohms give a tighter MTL draw and use fewer. On the Caliburn G3 Pro, for example, the 0.4Ω pod runs at 5–35W and the 0.9Ω pod at 5–15W. Check your device before choosing a low-ohm pod: the VMATE 0.4Ω pod needs a device that delivers at least 30W. There's more in [Choosing Wattage & Airflow](/guides/choosing-wattage-and-airflow).",
        },
        {
          question: "When should I change a pod?",
          answer:
            "When the taste turns harsh or burnt, vapor drops, or you hear gurgling on the draw. These are the usual signs that the wicking material in the coil is worn out. Replace a built-in coil pod whole; with an empty pod, change only the coil. In our own use, a pod with a built-in coil usually lasts about 1–3 weeks, depending on how you vape and the e-liquid you use. See [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
        },
      ],
    },
    zh: {
      heading: "空烟弹与内置雾化芯烟弹，区别在哪里",
      intro:
        "本页的烟弹都可以自行注油。内置雾化芯的烟弹，雾化芯用旧后整颗更换；空烟弹需要另装雾化芯，用旧后只换雾化芯，烟弹本身可以继续使用。\n\n选购前请先核对设备型号，每款烟弹只适配产品页面列出的设备。下面按系列简要说明。预注油烟弹请见 [换弹式设备](/products/switch-pods) 页面。",
      families: [
        {
          heading: "UWELL Caliburn 烟弹",
          body:
            "[GPP 烟弹](/products/coil-94) 内置网状雾化芯，有 0.4、0.6、0.9 和 1.2Ω 可选，容量 2.0–3.0mL，视烟弹类型而定。UWELL 标明它适配 Caliburn G5、G4 和 G3 系列设备。Caliburn G2 和 Caliburn X 使用空烟弹：[Caliburn G2 烟弹](/products/coil-55) 容量 2mL，顶部注油；[Caliburn X 烟弹](/products/coil-74) 容量 3mL。两者都可搭配 [Caliburn G 雾化芯](/products/coil-53)，包括 G 0.8Ω、G 1.0Ω 和 G2 1.2Ω。更多产品见 [UWELL](/brands/uwell) 品牌页。",
        },
        {
          heading: "VOOPOO ARGUS 与 VMATE 烟弹",
          body:
            "[ARGUS 烟弹](/products/coil-21) 分两种：侧注款容量 2mL，内置 0.7Ω 或 1.2Ω 雾化芯，每盒 3 颗；Top Fill 顶部注油款有 0.4、0.7 和 1.0Ω。VOOPOO 标明 ARGUS G4、G4 mini 和 P3 兼容整个 ARGUS 烟弹家族，ARGUS G3 mini 可用这三种 Top Fill 烟弹。[VMATE 烟弹](/products/coil-72) 容量 3mL，同样内置雾化芯：V2 侧注款有 0.7 和 1.2Ω，Top Fill 顶部注油款有 0.4、0.7 和 1.0Ω。VMATE i3 兼容全部 VMATE 烟弹。[Argus P1 烟弹](/products/coil-83) 是空烟弹，容量 2.0mL，每盒 2 颗，适配 Argus Pod、P1、Z、G 和 A，ITO 雾化芯需另购。更多产品见 [VOOPOO](/brands/voopoo) 品牌页。",
        },
        {
          heading: "DRAG、Feelin 与 Jellybox 烟弹",
          body:
            "本页有三款适用于 DRAG 设备的空烟弹，分别对应不同型号。[PnP X 烟弹](/products/coil-56) 容量 5mL，侧面注油，每盒 2 颗，适配 DRAG S2 和 DRAG X2，搭配 PnP X 雾化芯。[TPP Pod](/products/coil-87) 容量 5.5mL，适配 DRAG 3 Kit 和 DRAG X Plus Kit，搭配 TPP 系列雾化芯。[ITO-X 烟弹](/products/coil-68) 容量 3.5mL，顶部注油，适配 DRAG Q Pod Kit，搭配 ITO 雾化芯。NEVOKS 的 [Feelin Mini 烟弹](/products/coil-54) 是 2mL 空烟弹，用于 Feelin Mini，搭配 SPL10 雾化芯。RINCOE 的 [Jellybox V 烟弹](/products/coil-89) 容量 3.0mL，侧面注油，有 0.8Ω 和 1.0Ω 可选，适配 Jellybox V1、V2 和 V3。更多产品见 [NEVOKS](/brands/nevoks) 与 [RINCOE](/brands/rincoe) 品牌页。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "空烟弹还需要另外买什么？",
          answer:
            "需要与之匹配的雾化芯，因为空烟弹不带雾化芯。Caliburn G2 和 Caliburn X 烟弹使用 Caliburn G 与 G2 雾化芯，PnP X 烟弹使用 PnP X 雾化芯，TPP Pod 使用 TPP 系列雾化芯，这些都可以在 [雾化芯与配件](/products/coils-accessories) 页面选购。ITO-X 和 Argus P1 烟弹使用 ITO 雾化芯，Feelin Mini 烟弹使用 SPL10 雾化芯。",
        },
        {
          question: "什么是可注油烟弹？",
          answer:
            "就是可以自己加注烟油的烟弹，本页所有烟弹都属于这一类，有顶部注油和侧面注油两种。选好喜欢的烟油注入，用到该换烟弹或雾化芯的时候再更换。",
        },
        {
          question: "怎么知道哪款烟弹适配我的设备？",
          answer:
            "先确认设备型号。烟弹页面和设备页面的规格表里，都写明了可以互相搭配的型号；只要你的设备在列表中，就可以选这款烟弹。看完仍不确定，欢迎通过 LINE @okm24 咨询。",
        },
        {
          question: "其他系统的烟弹能通用吗？",
          answer:
            "烟弹只能在同一系统内通用，因为每个系统都是为对应的设备设计的。名字相近也要核对：Caliburn G2 烟弹和 GPP 烟弹是两个不同的系统，虽然都用于 Caliburn 设备。各类设备使用哪种烟弹系统，可在 [Pod System](/products/pod-systems) 页面查看。",
        },
        {
          question: "阻值怎么选？",
          answer:
            "按喜欢的吸法来选。阻值低，吸感更通透，功率也更高；阻值高，吸感偏紧，适合 MTL，功率也更低。以 Caliburn G3 Pro 为例，0.4Ω 烟弹的功率范围是 5–35W，0.9Ω 烟弹是 5–15W。选低阻值前也要看设备：VMATE 0.4Ω 烟弹需要搭配输出 30W 及以上的设备。详见 [如何选择功率与进气量](/guides/choosing-wattage-and-airflow)。",
        },
        {
          question: "烟弹什么时候该换？",
          answer:
            "口感变得粗糙或有焦味、烟雾变少，或吸的时候听到咕噜声，都是雾化芯导油棉已经损耗的常见信号。内置雾化芯的烟弹整颗更换，空烟弹只换雾化芯。根据本店自己的使用经验，内置雾化芯的烟弹通常能用约 1–3 周，具体取决于吸法和所用烟油。详见 [雾化芯与烟弹保养](/guides/coil-and-pod-maintenance)。",
        },
      ],
    },
  },
  "coils-accessories": {
    th: {
      heading: "คอยล์พอตแต่ละแบรนด์ เลือกยังไงให้ตรงกับเครื่อง",
      intro:
        "คอยล์คือชิ้นที่ร้อนขึ้นแล้วทำให้น้ำยากลายเป็นไอ และเป็นของสิ้นเปลืองที่ต้องเปลี่ยนเมื่อหมดสภาพ คอยล์พอตแต่ละตระกูลทำมาให้ใช้กับหัวพอตหรือถังน้ำยาของตระกูลนั้น จึงควรเลือกจากรุ่นเครื่องก่อน แล้วค่อยเลือกโอห์มตามแนวการสูบ โอห์มต่ำสูบโล่ง โอห์มสูงสูบแน่น\n\nด้านล่างนี้สรุปคอยล์ของแต่ละแบรนด์ไว้สั้น ๆ ถ้าเครื่องของคุณใช้หัวพอตที่มีคอยล์ในตัว ซึ่งเปลี่ยนทั้งหัว ดูได้ที่หน้า [หัวพอต](/products/pods-cartridges)",
      families: [
        {
          heading: "คอยล์ VOOPOO PnP X · Vinci และ TPP",
          body:
            "[คอยล์ PnP X](/products/coil-92) มีให้เลือก 7 ค่า ตั้งแต่ 0.15 ถึง 1.0 โอห์ม ตัว 0.15 โอห์มแนะนำไว้ที่ 60–80 วัตต์ ส่วนตัว 1.0 โอห์มอยู่ที่ 10–13 วัตต์ ใช้กับเครื่อง DRAG X2 · S2 · X3 · S3 และ ARGUS Pro 2 ส่วน [คอยล์ Vinci](/products/coil-1) มีให้เลือกตั้งแต่ 0.15 ถึง 1.2 โอห์ม ใช้กับ VINCI Pod · VINCI X Pod และ DRAG Baby Trio และ [คอยล์ TPP](/products/coil-38) มี 0.15 · 0.2 และ 0.3 โอห์ม ตัว 0.2 โอห์มแนะนำไว้ที่ 40–60 วัตต์ ตัว 0.3 โอห์มอยู่ที่ 32–40 วัตต์ ใช้คู่กับ [TPP Pod](/products/coil-87) ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [VOOPOO](/brands/voopoo)",
        },
        {
          heading: "คอยล์ Caliburn G และ G2 จาก UWELL",
          body:
            "[คอยล์ Caliburn G](/products/coil-53) มีให้เลือกสามค่า คือ G 0.8 โอห์ม · G 1.0 โอห์ม และ G2 1.2 โอห์ม ทุกค่าใช้ได้กับเครื่อง Caliburn GK2 · G2 และ X ถ้ากำลังหาหัวพอตเปล่าที่ใช้คู่กับคอยล์ตระกูลนี้ เลือกได้ทั้ง[หัวพอต Caliburn G2](/products/coil-55) และ[หัวพอต Caliburn X](/products/coil-74) คอยล์ตระกูลนี้เป็นคนละระบบกับหัวพอต GPP ของซีรีส์ Caliburn G5 · G4 · G3 ซึ่งมีคอยล์ในตัวและเปลี่ยนทั้งหัว ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [UWELL](/brands/uwell)",
        },
        {
          heading: "คอยล์ dotAIO V2 จาก DOTMOD",
          body:
            "[คอยล์ dotAIO V2](/products/coil-70) มีให้เลือก 0.15 · 0.3 · 0.6 และ 0.7 โอห์ม หนึ่งกล่องมี 5 หัว แยกซองทุกหัว ตัวเรือนเป็นทองเหลือง และใช้คอยล์ mesh เดี่ยว ตัว 0.7 โอห์มแนะนำไว้ที่ 14–20 วัตต์ ใช้ได้กับ dotAIO V2 · dotAIO V2 Lite · dotStick Revo · dotPod Max และ dotTank 25mm ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [DOTMOD](/brands/dotmod)",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "คอยล์พอตควรเปลี่ยนเมื่อไหร่",
          answer:
            "ควรเปลี่ยนเมื่อรสเริ่มบาดคอหรือมีรสไหม้ ควันน้อยลง หรือมีเสียงน้ำยาดังจ๊อก ๆ ตอนสูบค่ะ สามอย่างนี้เป็นสัญญาณว่าสำลีในคอยล์หมดสภาพแล้ว ส่วนจะใช้ได้กี่วันขึ้นกับคนใช้ Vaporesso บอกไว้ราว 1–2 สัปดาห์สำหรับคนสูบปานกลาง และสั้นลงถ้าสูบหนัก ใช้น้ำยาหวาน หรือตั้งวัตต์สูง อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
        },
        {
          question: "คอยล์โอห์มต่ำกับโอห์มสูงต่างกันยังไง",
          answer:
            "โอห์มต่ำสูบโล่งและใช้วัตต์สูง ส่วนโอห์มสูงสูบแน่นแบบ MTL และใช้วัตต์ต่ำค่ะ ดูได้จากคอยล์ PnP X ที่ตัว 0.15 โอห์มแนะนำไว้ที่ 60–80 วัตต์ ส่วนตัว 1.0 โอห์มแนะนำไว้ที่ 10–13 วัตต์ ก่อนเลือกโอห์มต่ำควรเช็ควัตต์สูงสุดของเครื่องด้วย และตอนตั้งวัตต์ ร้านเราเริ่มที่ค่าต่ำสุดของช่วงก่อน แล้วค่อยขยับขึ้นทีละนิดจนได้รสและควันที่ชอบ อ่านต่อได้ที่ [เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
        },
        {
          question: "ทำไมคอยล์ต้องตรงตระกูลกับหัวพอตหรือถังน้ำยา",
          answer:
            "เพราะคอยล์แต่ละตระกูลทำมาให้ใช้กับหัวพอตหรือถังน้ำยาของตระกูลนั้นค่ะ อย่าง TPP Pod ที่ใส่คอยล์แบบกดล็อกก็รองรับคอยล์ตระกูล TPP แม้เป็นแบรนด์เดียวกัน คอยล์แต่ละตระกูลก็ใช้กับเครื่องคนละชุด อย่างคอยล์ PnP X กับคอยล์ TPP ของ VOOPOO จึงควรเช็คตระกูลก่อนซื้อทุกครั้งนะคะ",
        },
        {
          question: "คอยล์ VOOPOO ตัวไหนใช้กับเครื่องอะไร",
          answer:
            "คอยล์ PnP X ใช้กับ DRAG X2 · S2 · X3 · S3 และ ARGUS Pro 2 รวมถึง DRAG 6 ที่ VOOPOO ระบุว่าถังน้ำยาของชุดใส่คอยล์ PnP X ได้ทุกตัวค่ะ คอยล์ Vinci ใช้กับ VINCI Pod · VINCI X Pod และ DRAG Baby Trio ส่วนคอยล์ TPP ใช้กับ TPP Pod · DRAG 3 Kit และ DRAG X Plus Kit ก่อนซื้อ เช็คแถว “ใช้ได้กับ” ในหน้าคอยล์ให้ตรงกับเครื่องอีกครั้งนะคะ",
        },
        {
          question: "ใส่คอยล์ใหม่แล้ว ต้องรอก่อนสูบไหม",
          answer:
            "ควรรอให้สำลีในคอยล์ซึมน้ำยาให้ทั่วก่อนค่ะ แต่ละแบรนด์บอกเวลาไว้ต่างกัน ถ้าเป็น Caliburn ทาง UWELL แนะนำให้ตั้งเครื่องทิ้งไว้ 10 นาทีหลังใส่หัวพอตหรือคอยล์ใหม่ ส่วนรุ่นของแบรนด์อื่นให้ดูเวลาตามคู่มือของรุ่นนั้น พอถึงพัฟแรก ๆ ก็สูบสั้น ๆ เบา ๆ ไปก่อนนะคะ",
        },
        {
          question: "คอยล์ไหม้แล้ว ต้องทำยังไง",
          answer:
            "ถ้ารสขม ฝาด บาดคอ หรือมีกลิ่นไหม้ติดปลายลิ้น ทางแก้คือเปลี่ยนคอยล์ตัวใหม่ค่ะ ถ้าถังน้ำยาถอดล้างได้ ล้างให้สะอาดแล้วปล่อยให้แห้งสนิทก่อนใส่คอยล์ใหม่ เพราะน้ำยาเก่าที่ติดขอบถังจะพากลิ่นไหม้ตามมาด้วย สาเหตุและวิธีกันอ่านได้ที่ [พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod)",
        },
      ],
    },
    en: {
      heading: "Pod coils by brand, and how to match yours",
      intro:
        "A coil is the part that heats up and turns e-liquid into vapor, and it is a consumable you replace once it wears out. Coils in each family are made for that family's pods or tanks, so start with your device model, then choose the ohms by how you vape: lower is airier, higher is tighter.\n\nBelow is a short guide to the coils from each brand. If your device uses a pod with a built-in coil, which is replaced whole, see the [Pods & Cartridges](/products/pods-cartridges) page.",
      families: [
        {
          heading: "VOOPOO PnP X, Vinci and TPP coils",
          body:
            "[PnP X coils](/products/coil-92) come in seven values from 0.15Ω to 1.0Ω. The 0.15Ω coil is rated at 60–80W and the 1.0Ω at 10–13W. They fit the DRAG X2, S2, X3, S3 and ARGUS Pro 2. [Vinci coils](/products/coil-1) run from 0.15Ω to 1.2Ω and fit the VINCI Pod, VINCI X Pod and DRAG Baby Trio. [TPP coils](/products/coil-38) come in 0.15, 0.2 and 0.3Ω; the 0.2Ω is rated at 40–60W and the 0.3Ω at 32–40W, and they go with the [TPP Pod](/products/coil-87). More from the brand is on the [VOOPOO](/brands/voopoo) page.",
        },
        {
          heading: "UWELL Caliburn G and G2 coils",
          body:
            "[Caliburn G coils](/products/coil-53) come in three values: G 0.8Ω, G 1.0Ω and G2 1.2Ω. All three fit the Caliburn GK2, G2 and X. If you need an empty pod for them, choose the [Caliburn G2 pod](/products/coil-55) or the [Caliburn X pod](/products/coil-74). This family is a separate system from the GPP pods of the Caliburn G5, G4 and G3 series, which have a built-in coil and are replaced whole. More from the brand is on the [UWELL](/brands/uwell) page.",
        },
        {
          heading: "DOTMOD dotAIO V2 coils",
          body:
            "[dotAIO V2 coils](/products/coil-70) come in 0.15, 0.3, 0.6 and 0.7Ω, in boxes of 5, each individually packed. They have a brass housing and a single mesh coil, and the 0.7Ω is rated at 14–20W. They fit the dotAIO V2, dotAIO V2 Lite, dotStick Revo, dotPod Max and dotTank 25mm. More from the brand is on the [DOTMOD](/brands/dotmod) page.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "When should I change a coil?",
          answer:
            "When the taste turns harsh or burnt, vapor drops, or you hear gurgling on the draw. These are the signs that the wicking material is worn out. How long that takes depends on you: Vaporesso says about 1–2 weeks for moderate use, and less with heavy use, sweet e-liquids or high wattage. See [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
        },
        {
          question: "What do low-ohm and high-ohm coils change?",
          answer:
            "Low-ohm coils give an airier draw and use more watts; high-ohm coils give a tighter MTL draw and use fewer. PnP X coils show the range: the 0.15Ω is rated at 60–80W and the 1.0Ω at 10–13W. Before choosing a low-ohm coil, check your device's maximum wattage. When setting the wattage, we start at the bottom of the range and move up a little at a time until the flavor and vapor feel right. There's more in [Choosing Wattage & Airflow](/guides/choosing-wattage-and-airflow).",
        },
        {
          question: "Why must a coil match the pod or tank family?",
          answer:
            "Each coil family is made for the pods or tanks of that family. The TPP Pod, for example, uses a press-fit coil and takes TPP-family coils. Even within one brand, coil families fit different devices, as VOOPOO's PnP X and TPP coils do, so check the family before you buy.",
        },
        {
          question: "Which VOOPOO coil fits which device?",
          answer:
            "PnP X coils fit the DRAG X2, S2, X3, S3 and ARGUS Pro 2, and VOOPOO states that the DRAG 6 kit's tank takes every PnP X coil. Vinci coils fit the VINCI Pod, VINCI X Pod and DRAG Baby Trio. TPP coils fit the TPP Pod, DRAG 3 Kit and DRAG X Plus Kit. Before you buy, check the “Compatible devices” row on the coil's page.",
        },
        {
          question: "Should I wait before vaping on a new coil?",
          answer:
            "Yes, give the wicking material time to soak through. Brands suggest different times. For Caliburn, UWELL recommends leaving the device for 10 minutes after fitting a new pod or coil; for other brands, follow the manual for your model. Keep the first few puffs short and gentle.",
        },
        {
          question: "What should I do when a coil burns?",
          answer:
            "If the taste turns bitter, dry or harsh, or leaves a burnt note on your tongue, fit a new coil. If the tank can be taken apart for washing, clean it and let it dry fully before the new coil goes in, because old e-liquid left on the tank wall carries the burnt taste over.",
        },
      ],
    },
    zh: {
      heading: "各品牌雾化芯，如何选对设备",
      intro:
        "雾化芯是通电发热、把烟油变成烟雾的部件，属于耗材，用旧后需要更换。每个系列的雾化芯都是为同系列的烟弹或油仓设计的，因此请先看设备型号，再按吸法选阻值：阻值低吸感通透，阻值高吸感偏紧。\n\n下面按品牌简要说明。如果你的设备使用内置雾化芯的烟弹，需要整颗更换，请见 [烟弹](/products/pods-cartridges) 页面。",
      families: [
        {
          heading: "VOOPOO PnP X、Vinci 与 TPP 雾化芯",
          body:
            "[PnP X 雾化芯](/products/coil-92) 有 7 种阻值，从 0.15Ω 到 1.0Ω，其中 0.15Ω 的建议功率为 60–80W，1.0Ω 为 10–13W，适配 DRAG X2、S2、X3、S3 和 ARGUS Pro 2。[Vinci 雾化芯](/products/coil-1) 阻值从 0.15Ω 到 1.2Ω，适配 VINCI Pod、VINCI X Pod 和 DRAG Baby Trio。[TPP 雾化芯](/products/coil-38) 有 0.15、0.2 和 0.3Ω，其中 0.2Ω 的建议功率为 40–60W，0.3Ω 为 32–40W，搭配 [TPP Pod](/products/coil-87) 使用。更多产品见 [VOOPOO](/brands/voopoo) 品牌页。",
        },
        {
          heading: "UWELL Caliburn G 与 G2 雾化芯",
          body:
            "[Caliburn G 雾化芯](/products/coil-53) 有三种：G 0.8Ω、G 1.0Ω 和 G2 1.2Ω，都适配 Caliburn GK2、G2 和 X。如需搭配空烟弹，可选 [Caliburn G2 烟弹](/products/coil-55) 或 [Caliburn X 烟弹](/products/coil-74)。这个系列与 Caliburn G5、G4、G3 系列所用的 GPP 烟弹是两个不同的系统，GPP 烟弹内置雾化芯，需要整颗更换。更多产品见 [UWELL](/brands/uwell) 品牌页。",
        },
        {
          heading: "DOTMOD dotAIO V2 雾化芯",
          body:
            "[dotAIO V2 雾化芯](/products/coil-70) 有 0.15、0.3、0.6 和 0.7Ω 可选，每盒 5 颗，独立包装，黄铜外壳，采用单网状雾化芯，其中 0.7Ω 的建议功率为 14–20W。适配 dotAIO V2、dotAIO V2 Lite、dotStick Revo、dotPod Max 和 dotTank 25mm。更多产品见 [DOTMOD](/brands/dotmod) 品牌页。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "雾化芯什么时候该换？",
          answer:
            "口感变得粗糙或有焦味、烟雾变少，或吸的时候听到咕噜声，都说明导油棉已经损耗。能用多久因人而异：Vaporesso 的说法是中度使用约 1–2 周，抽得多、用偏甜的烟油或功率设得高时会更短。详见 [雾化芯与烟弹保养](/guides/coil-and-pod-maintenance)。",
        },
        {
          question: "低阻值和高阻值雾化芯有什么不同？",
          answer:
            "低阻值吸感通透，功率较高；高阻值吸感偏紧，适合 MTL，功率较低。以 PnP X 雾化芯为例，0.15Ω 的建议功率为 60–80W，1.0Ω 为 10–13W。选低阻值前请先确认设备的最高功率。设置功率时，我们会从建议范围的下限开始，再一点点调高，直到口感和烟雾合适。详见 [如何选择功率与进气量](/guides/choosing-wattage-and-airflow)。",
        },
        {
          question: "为什么雾化芯要和烟弹或油仓同系列？",
          answer:
            "因为每个系列的雾化芯都是为同系列的烟弹或油仓设计的。例如 TPP Pod 采用按压式安装，支持 TPP 系列雾化芯。即使是同一品牌，不同系列适配的设备也不一样，比如 VOOPOO 的 PnP X 和 TPP 雾化芯，所以购买前请先核对系列。",
        },
        {
          question: "VOOPOO 哪款雾化芯适配哪些设备？",
          answer:
            "PnP X 雾化芯适配 DRAG X2、S2、X3、S3 和 ARGUS Pro 2，VOOPOO 也标明 DRAG 6 套装的油仓支持全部 PnP X 雾化芯。Vinci 雾化芯适配 VINCI Pod、VINCI X Pod 和 DRAG Baby Trio。TPP 雾化芯适配 TPP Pod、DRAG 3 Kit 和 DRAG X Plus Kit。购买前请再核对雾化芯页面规格表中列出的设备。",
        },
        {
          question: "换上新雾化芯后要等一会儿再抽吗？",
          answer:
            "要，先让导油棉充分吸满烟油。各品牌建议的时间不同：Caliburn 方面，UWELL 建议装上新烟弹或雾化芯后静置 10 分钟；其他品牌请按该型号的说明书操作。前几口请抽得短一些、轻一些。",
        },
        {
          question: "雾化芯烧焦了怎么办？",
          answer:
            "如果味道发苦、发涩、刮喉，或舌尖留有焦味，就需要换新的雾化芯。油仓可以拆洗的话，先洗干净并彻底晾干再装新雾化芯，否则残留在仓壁上的旧烟油会把焦味带过来。",
        },
      ],
    },
  },
  "heated-tobacco-devices": {
    th: {
      heading: "เครื่องจ่ายความร้อนบนหน้านี้ มี ILUMA สามรุ่นกับ LAMBDA i8",
      intro:
        "ตัวเครื่องบนหน้านี้มาจากสองแบรนด์ IQOS ILUMA ทั้งสามรุ่นใช้บุหรี่ TEREA เท่านั้น ส่วน LAMBDA i8 ทาง LAMBDA ระบุว่าใช้ได้ทั้ง TEREA และ SENTIA ถ้ากำลังเลือกเครื่อง ลองเริ่มจากบุหรี่ที่จะใช้ก่อน แล้วค่อยดูว่าอยากพกกี่ชิ้นและอยากสูบต่อกันได้กี่มวน",
      families: [
        {
          heading: "ILUMA i และ ILUMA i PRIME แบบสองชิ้น",
          body:
            "[ILUMA i](/products/iqosheet-18) และ [ILUMA i PRIME](/products/iqosheet-16) ใช้ตัวสูบคู่กับกล่องชาร์จพกพา สูบต่อกันได้สูงสุด 3 มวนแล้ววางตัวสูบกลับลงกล่องเพื่อชาร์จ และกล่องชาร์จที่เต็มแล้วรองรับได้สูงสุด 20 มวน ทั้งสองรุ่นมีจอทัช ส่วน PRIME ใช้อะลูมิเนียมทั้งตัวสูบและกล่องชาร์จ",
        },
        {
          heading: "ILUMA i ONE แบบชิ้นเดียว",
          body:
            "[ILUMA i ONE](/products/iqosheet-17) เป็นเครื่องชิ้นเดียวที่พกใส่กระเป๋าได้ แบต 1728mAh สูบต่อกันได้สูงสุด 20 มวนโดยไม่ต้องมีกล่องชาร์จ ส่วนจอทัชกับการพักการสูบมีเฉพาะสองรุ่นด้านบน",
        },
        {
          heading: "LAMBDA i8 อีกแบรนด์หนึ่ง",
          body:
            "[LAMBDA i8](/products/iqosheet-14) เป็นเครื่องของ LAMBDA ซึ่งเป็นคนละบริษัทกับ Philip Morris International เจ้าของ IQOS แบต 3200mAh สูบได้ 35–40 มวนต่อการชาร์จ ปรับอุณหภูมิได้ 200–300°C และปรับเวลาสูบต่อมวนได้ 3–6 นาที ตัวเครื่องใช้ระบบเหนี่ยวนำและมีจอ LED",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "เครื่องจ่ายความร้อนต่างจากพอตยังไง",
          answer:
            "เครื่องจ่ายความร้อนอุ่นยาสูบในบุหรี่อย่าง TEREA ส่วนพอตใช้น้ำยาค่ะ ของที่ต้องใช้คู่กับเครื่องจึงต่างกันด้วย คือบุหรี่สำหรับเครื่องจ่ายความร้อน และน้ำยาหรือหัวพอตสำหรับพอตค่ะ",
        },
        {
          question: "ILUMA i ONE ต่างจาก ILUMA i PRIME ยังไง",
          answer:
            "ต่างกันที่จำนวนชิ้นเป็นหลักค่ะ ILUMA i ONE เป็นเครื่องชิ้นเดียว สูบต่อกันได้สูงสุด 20 มวน ส่วน [ILUMA i PRIME](/products/iqosheet-16) ใช้ตัวสูบคู่กล่องชาร์จ สูบต่อกันได้สูงสุด 3 มวน และมีจอทัชด้วยค่ะ",
        },
        {
          question: "LAMBDA i8 เป็นเครื่อง IQOS ไหม",
          answer:
            "ไม่ใช่ค่ะ [LAMBDA i8](/products/iqosheet-14) เป็นเครื่องของ LAMBDA เอง ทาง LAMBDA ระบุว่าใช้กับ TEREA และ SENTIA ได้ ส่วน IQOS ระบุว่า TEREA ใช้กับตระกูล ILUMA เท่านั้น ก่อนเลือกจึงควรดูข้อมูลของทั้งสองฝั่งนะคะ",
        },
      ],
    },
    en: {
      heading: "This page holds three IQOS ILUMA models and the LAMBDA i8",
      intro:
        "The heated tobacco devices here come from two brands. All three IQOS ILUMA models take TEREA sticks only, while LAMBDA says its i8 works with both TEREA and SENTIA. If you're choosing, start with the stick you plan to use, then decide how many pieces you want to carry and how many sticks you'd like in a row.",
      families: [
        {
          heading: "ILUMA i and ILUMA i PRIME: two pieces",
          body:
            "The [ILUMA i](/products/iqosheet-18) and [ILUMA i PRIME](/products/iqosheet-16) pair a Holder with a Pocket Charger. You get up to 3 sticks in a row before the Holder goes back to charge, and a full Pocket Charger supports up to 20. Both have a touchscreen, and the PRIME uses aluminum on the charger as well as the Holder.",
        },
        {
          heading: "ILUMA i ONE: one piece",
          body:
            "The [ILUMA i ONE](/products/iqosheet-17) is a single pocket-sized device with no separate charger. Its 1728mAh battery gives up to 20 sticks in a row. The touchscreen and pause belong to the two models above.",
        },
        {
          heading: "LAMBDA i8: a separate brand",
          body:
            "The [LAMBDA i8](/products/iqosheet-14) comes from LAMBDA, a separate company from Philip Morris International, which owns IQOS. Its 3200mAh battery gives 35–40 sticks per charge, and you can set the temperature from 200–300°C and the session time from 3–6 minutes. It uses induction heating and has an LED display.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "How does a heated tobacco device differ from a pod?",
          answer:
            "A heated tobacco device heats the tobacco in a stick such as TEREA, while a pod runs on e-liquid. So what goes with each differs too: sticks for the heated tobacco device, and e-liquid or replacement pods for the pod.",
        },
        {
          question: "How do the ILUMA i ONE and ILUMA i PRIME differ?",
          answer:
            "Mainly in the number of pieces. The ILUMA i ONE is one piece and offers up to 20 sticks in a row. The [ILUMA i PRIME](/products/iqosheet-16) pairs a Holder with a Pocket Charger, offers up to 3 in a row and adds a touchscreen.",
        },
        {
          question: "Is the LAMBDA i8 an IQOS device?",
          answer:
            "No. The [LAMBDA i8](/products/iqosheet-14) is LAMBDA's own device. LAMBDA says it works with TEREA and SENTIA, while IQOS says TEREA is for the ILUMA family only, so it's worth reading both before you choose.",
        },
      ],
    },
    zh: {
      heading: "本页有三款 IQOS ILUMA 和一款 LAMBDA i8",
      intro:
        "本页的加热烟草设备来自两个品牌。三款 IQOS ILUMA 只能使用 TEREA 烟支；LAMBDA 则表示 i8 可搭配 TEREA 和 SENTIA。选购时可以先确定要用的烟支，再考虑想带几件设备、希望连续抽几支。",
      families: [
        {
          heading: "ILUMA i 与 ILUMA i PRIME：两件式",
          body:
            "[ILUMA i](/products/iqosheet-18) 和 [ILUMA i PRIME](/products/iqosheet-16) 由 Holder 和 Pocket Charger 组成。Holder 最多连续使用 3 支，之后放回充电；Pocket Charger 充满后最多支持 20 支。两款都有触控屏，PRIME 的 Holder 和 Pocket Charger 都采用铝材。",
        },
        {
          heading: "ILUMA i ONE：一体式",
          body:
            "[ILUMA i ONE](/products/iqosheet-17) 是一件式设备，可放入口袋，无需另带 Pocket Charger。电池 1728mAh，最多可连续使用 20 支。触控屏和暂停功能为上面两款所有。",
        },
        {
          heading: "LAMBDA i8：另一品牌",
          body:
            "[LAMBDA i8](/products/iqosheet-14) 来自 LAMBDA，与拥有 IQOS 的 Philip Morris International 是不同的公司。电池 3200mAh，每次充电可用 35–40 支，温度可在 200–300°C 之间调节，单支时长可在 3–6 分钟之间调节，采用感应加热，配 LED 显示屏。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "加热烟草设备和电子烟有什么不同？",
          answer:
            "加热烟草设备加热的是 TEREA 这类烟支中的烟草，电子烟使用的是烟油。因此配套耗材也不同：前者用烟支，后者用烟油或烟弹。",
        },
        {
          question: "ILUMA i ONE 和 ILUMA i PRIME 有什么不同？",
          answer:
            "主要区别在件数。ILUMA i ONE 是一体式，最多可连续使用 20 支；[ILUMA i PRIME](/products/iqosheet-16) 是两件式，最多连续 3 支，并配有触控屏。",
        },
        {
          question: "LAMBDA i8 是 IQOS 设备吗？",
          answer:
            "不是。[LAMBDA i8](/products/iqosheet-14) 是 LAMBDA 自家的设备。LAMBDA 表示它可搭配 TEREA 和 SENTIA，而 IQOS 表示 TEREA 仅用于 ILUMA 系列，选购前建议两边的说明都看一下。",
        },
      ],
    },
  },
  "heated-tobacco-consumables": {
    th: {
      heading: "TEREA คือบุหรี่สำหรับเครื่อง IQOS ILUMA มีกลิ่นให้เลือกสี่กลุ่ม",
      intro:
        "หมวดนี้มีบุหรี่ TEREA ของ IQOS หนึ่งซองมี 20 มวน และหน้าสินค้ารวมไว้ 23 กลิ่น วิธีเลือกที่ง่ายคือเริ่มจากกลุ่มรสที่ชอบก่อน แล้วค่อยดูชื่อกลิ่นในกลุ่มนั้น",
      families: [
        {
          heading: "ยาสูบคลาสสิกและเมนทอล",
          body:
            "ถ้าชอบรสยาสูบเป็นหลัก กลุ่มคลาสสิกมีกลิ่นอย่าง Bronze · Sienna และ Dimensions Apricity ส่วนคนที่ชอบความเย็น กลุ่มเมนทอลมีกลิ่นอย่าง Blue · Green · Bright Wave · Black Green · Purple Wave และ Black Ruby",
        },
        {
          heading: "กานพลู",
          body:
            "กลุ่มนี้มีกานพลูอยู่ในรสยาสูบ อย่าง Golden Edition กับ Auburn Edition และถ้าอยากได้ความเย็นเพิ่มด้วย ก็มี Berrine Edition กับ Mulint Edition ที่ผสมเมนทอลเย็นมาให้",
        },
        {
          heading: "แคปซูล Pearl",
          body:
            "Oasis Pearl · Sun Pearl · Passion Fruit Pearl และ Strawberry Pearl มีแคปซูลอยู่ในก้นกรอง พอบีบจนแคปซูลแตก กลิ่นในแคปซูลก็จะออกมา รายละเอียดของแต่ละกลิ่นอ่านต่อได้ที่ [TEREA กลิ่นไหนดี](/guides/choosing-a-terea-flavor)",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "ซื้อ TEREA แล้วต้องมีเครื่องอะไร",
          answer:
            "IQOS ระบุให้ใช้ TEREA กับเครื่องตระกูล ILUMA ค่ะ ส่วน LAMBDA ระบุว่า LAMBDA i8 ของตนใช้ TEREA ได้ด้วย ตัวเครื่องดูได้ที่หน้า [เครื่องจ่ายความร้อน](/products/heated-tobacco-devices) ค่ะ",
        },
      ],
    },
    en: {
      heading: "TEREA is the stick for IQOS ILUMA devices, in four flavor groups",
      intro:
        "This category holds TEREA sticks from IQOS. Each pack has 20 sticks and the product page lists 23 flavors. The easy way to choose is to start with the taste group you like, then look through the names in that group.",
      families: [
        {
          heading: "Classic tobacco and menthol",
          body:
            "If tobacco is what you're after, the classic group includes Bronze, Sienna and Dimensions Apricity. If you like it cool, the menthol group includes Blue, Green, Bright Wave, Black Green, Purple Wave and Black Ruby.",
        },
        {
          heading: "Clove",
          body:
            "This group has clove in the tobacco taste, as in Golden Edition and Auburn Edition. Berrine Edition and Mulint Edition add cool menthol as well.",
        },
        {
          heading: "Pearl capsules",
          body:
            "Oasis Pearl, Sun Pearl, Passion Fruit Pearl and Strawberry Pearl have a capsule in the filter. Squeeze the filter until the capsule breaks and its flavor comes through.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "What device do I need for TEREA?",
          answer:
            "IQOS says TEREA is for the ILUMA family, and LAMBDA says its LAMBDA i8 takes TEREA too. You'll find the devices on the [Heated Tobacco Devices](/products/heated-tobacco-devices) page.",
        },
      ],
    },
    zh: {
      heading: "TEREA 是 IQOS ILUMA 设备使用的烟支，口味分四组",
      intro:
        "本分类是 IQOS 的 TEREA 烟支，每盒 20 支，产品页列有 23 种口味。选购时先从喜欢的口味分组入手，再看组内的具体名称，会更容易。",
      families: [
        {
          heading: "经典烟草与薄荷",
          body:
            "喜欢烟草味，经典组有 Bronze、Sienna、Dimensions Apricity 等；喜欢清凉感，薄荷组有 Blue、Green、Bright Wave、Black Green、Purple Wave、Black Ruby 等。",
        },
        {
          heading: "丁香",
          body:
            "这一组的烟草味中带有丁香，例如 Golden Edition 和 Auburn Edition；Berrine Edition 和 Mulint Edition 则再加入了清凉的薄荷。",
        },
        {
          heading: "Pearl 爆珠",
          body:
            "Oasis Pearl、Sun Pearl、Passion Fruit Pearl 和 Strawberry Pearl 的滤嘴内有爆珠，捏破后，爆珠中的味道就会释放出来。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "买 TEREA 需要什么设备？",
          answer:
            "IQOS 表示 TEREA 用于 ILUMA 系列，LAMBDA 也表示自家的 LAMBDA i8 可以使用 TEREA。设备见 [加热烟草设备](/products/heated-tobacco-devices) 页面。",
        },
      ],
    },
  },
};
