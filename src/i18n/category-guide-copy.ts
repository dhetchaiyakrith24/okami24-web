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
  faqHeading: string;
  faq: { question: string; answer: string }[];
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
        "พอตซิสเต็มทั้งสามกลุ่มในหน้านี้ ต่างกันหลัก ๆ ที่หัวพอตหรือคอยล์ที่ใช้ และวัตต์สูงสุดที่เครื่องจ่ายได้ ด้านล่างนี้สรุปแต่ละกลุ่มไว้สั้น ๆ พร้อมตารางสเปกจากผู้ผลิตให้เทียบกันได้ในที่เดียว ถ้าเพิ่งเริ่ม อ่าน [Pod System คืออะไร](/guides/what-is-a-pod-system) ก่อนได้",
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
        "หน้านี้รวมน้ำยาแบบขวดสำหรับพอตซิสเต็มที่เติมน้ำยาเอง นิโคตินในน้ำยาแบ่งเป็นสองชนิด คือ salt nic กับ freebase สองชนิดนี้เข้ากับเครื่องต่างกัน จึงควรดูเครื่องที่ใช้อยู่ก่อน แล้วค่อยเลือกกลิ่นที่ชอบ ด้านล่างนี้สรุปทั้งสองชนิดไว้สั้น ๆ พร้อมรายชื่อน้ำยาแต่ละชนิดบนหน้านี้ ถ้าอยากอ่านละเอียดกว่านี้ ดูได้ที่บทความ [salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
      families: [
        {
          heading: "น้ำยา salt nic สำหรับพอตตัวเล็ก",
          body:
            "salt nic คือนิโคตินที่ผู้ผลิตผสมกรดลงไป ผู้ผลิตพอตหลายรายแนะนำให้ใช้กับพอตตัวเล็กที่ใช้วัตต์ต่ำ และสูบแบบ MTL คือดูดเข้าปากก่อน แล้วค่อยสูดลงปอด งานวิจัยก็พบว่าที่ความเข้มข้นเท่ากัน salt nic ให้ความรู้สึกนุ่มกว่า freebase น้ำยา salt nic บนหน้านี้มี [Marbo Saltnic](/products/eliquid-1) ของ SALTHUB ขวดขนาด 30ml มี 10 กลิ่น · [Super Cool Salt Nic](/products/super-cool-saltnic) 10 กลิ่น · [Muro Salt Nic](/products/muro-salt-nic) 6 กลิ่น · [Double Mint Salt Nic](/products/eliquid-64) 6 กลิ่น · [Pepo Salt Nic](/products/eliquid-72) 5 กลิ่น และ [Dundu Salt Nic](/products/eliquid-73) ที่มีกลิ่นเดียว",
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
            "Salt nic is nicotine that the maker has blended with an acid. Several pod makers recommend it for small, low-wattage pods and an MTL draw, where you draw into your mouth first and then inhale. Research has also found that, at the same strength, salt nic feels smoother than freebase. Salt nic on this page: SALTHUB's [Marbo Saltnic](/products/eliquid-1) in a 30ml bottle, 10 flavors · [Super Cool Salt Nic](/products/super-cool-saltnic), 10 · [Muro Salt Nic](/products/muro-salt-nic), 6 · [Double Mint Salt Nic](/products/eliquid-64), 6 · [Pepo Salt Nic](/products/eliquid-72), 5 · and [Dundu Salt Nic](/products/eliquid-73), in a single flavor.",
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
            "salt nic 是厂商在尼古丁中加入酸调配而成。多家烟弹设备厂商建议搭配低功率的小烟弹设备和 MTL 吸法，也就是先吸入口腔，再吸进肺部。研究也发现，在相同浓度下，salt nic 的口感比 freebase 更顺。本页的 salt nic 烟油有：SALTHUB 的 [Marbo Saltnic](/products/eliquid-1)，30ml 瓶装，10 种口味；[Super Cool Salt Nic](/products/super-cool-saltnic)，10 种；[Muro Salt Nic](/products/muro-salt-nic)，6 种；[Double Mint Salt Nic](/products/eliquid-64)，6 种；[Pepo Salt Nic](/products/eliquid-72)，5 种；以及只有一种口味的 [Dundu Salt Nic](/products/eliquid-73)。",
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
        "พอตเปลี่ยนหัวบนหน้านี้ใช้หลักเดียวกันทุกรุ่น คือเก็บตัวเครื่องไว้ใช้ต่อ ส่วนหัวพอตบรรจุสำเร็จใช้จนหมดแล้วก็เปลี่ยนหัวใหม่ สิ่งที่ต่างกันจึงอยู่ที่หัวพอตของแต่ละตระกูล ว่าหัวละกี่พัฟและใส่กับเครื่องไหนได้ รวมถึงตัวเครื่องว่ามีจอ มีโหมด และแบตเท่าไหร่ ด้านล่างนี้สรุปสามตระกูลหลักไว้สั้น ๆ ถ้าอยากเลือกตามสิ่งที่ต้องการทีละเรื่อง อ่านต่อได้ที่ [พอตเปลี่ยนหัว รุ่นไหนดี](/guides/choosing-a-switch-pod)",
      families: [
        {
          heading: "M Switch และ Zero จาก SALTHUB",
          body:
            "[M Switch Kit](/products/m-switch-kit) คือชุดตัวเครื่องพร้อมหัวพอตที่ร้านเราเรียกว่า M Bar 15K หรือ Marbo 15K ตัวเครื่องใช้คู่กับหัว [M Switch Pod](/products/m-switch-pod) ที่ SALTHUB ระบุไว้หัวละสูงสุด 15,000 พัฟ ใช้คอยล์ cotton mesh มีหน้าจอดิจิทัลบอกระดับแบต มีปุ่มเลื่อนปรับลม และชาร์จผ่าน USB-C ส่วนตระกูล Zero ใช้หัว [Zero Cartridge](/products/zero-cartridge) ขนาด 2.2mL หัวเดียวกันใส่ได้ทั้ง [Zero Pro](/products/zero-pro) และ [Zero Nano](/products/zero-nano) Zero Pro มี 3 โหมดให้สลับแรงสูบได้ แบต 380mAh และ Zero Nano ที่เป็นรุ่นตัวเล็กของตระกูล มีแบต 500mAh ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [SALTHUB](/brands/salthub)",
        },
        {
          heading: "Creator และ Infinity จาก RELX",
          body:
            "[RELX Creator](/products/relx-creator) ขายเฉพาะตัวเครื่อง หัวพอตเลือกซื้อแยกได้ ตัวเครื่องแบต 800mAh ชาร์จผ่าน USB-C มีจอพิกเซลที่โชว์หน้าอีโมจิ ปรับช่องลมได้ และกดปุ่มสองครั้งติดกันเพื่อสลับระหว่างโหมด Normal 15 วัตต์ กับ Boost 25 วัตต์ เครื่องนี้ใส่ได้ทั้งหัว [RELX Creator Pod](/products/relx-creator-pod-20k) และหัว [Muro Connector 20K](/products/muro-connector-20k) ทั้งสองหัวนี้ร้านยืนยันจากของจริงที่มีอยู่ ส่วน [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) แบต 440mAh มี 3 โหมด คือ Eco 6.5 วัตต์ · Smooth 8 วัตต์ · Boost 10 วัตต์ และ RELX ระบุว่าชาร์จผ่าน USB-C ได้ 80% ใน 15 นาที เครื่องนี้ใส่ได้ทั้งหัว RELX Pod · RELX Pod Pro และ RELX Pod Pro 2 หัว Pod Pro 2 ดูกลิ่นได้ที่หน้า [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) อีกรุ่นของ RELX ในหน้านี้คือตัวเครื่อง [RELX Essential 2](/products/relx-essential-2)",
        },
        {
          heading: "ESKO BAR SWITCH · INFY และ KS",
          body:
            "[Esko Bar Switch 20K](/products/pod-159) ใช้[หัวพอต Esko Bar Switch](/products/esko-bar-switch-pod) ที่ ESKO BAR ระบุไว้หัวละสูงสุด 20,000 พัฟ จุน้ำยา 18mL และมีคอยล์สองตัวที่ทำงานพร้อมกัน ตัวเครื่องแบต 850mAh กดปุ่มเดียวก็สลับโหมด High กับ Low ได้ และหมุนที่ก้นพอตเพื่อปรับช่องลมได้ 3 ระดับ ส่วน [INFY POD](/products/infy-pod) แบต 400mAh ชาร์จผ่าน USB-C มีไฟ LED หลายสีบอกสถานะ และใช้หัว [INFY PLUS](/products/pod-169) ขนาด 2.5mL ที่มีคอยล์ในตัว ซึ่ง INFY ระบุว่าใส่กับตัวเครื่องของ INFY ได้ ฝั่ง KS มีชุด [KS Quikpro 15K Kit](/products/ks-quikpro-kit) แบต 600mAh ชาร์จผ่าน USB-C ราว 30 นาที และใช้[หัว KS Quikpro](/products/pod-150) ขนาด 15mL ที่ KS ระบุไว้หัวละสูงสุด 15,000 พัฟ หัวนี้ใช้จนหมดแล้วก็เปลี่ยนหัวใหม่ ดูรุ่นอื่นของแต่ละแบรนด์ได้ที่หน้า [ESKO BAR](/brands/esko-bar) · [INFY](/brands/infy) และ [KS](/brands/kardinal-stick)",
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
            "หัวพอตแต่ละรุ่นใส่ได้กับเครื่องที่ผู้ผลิตระบุไว้ค่ะ เช่น M Switch Pod ใช้กับ M Switch Kit และหัว KS Quikpro ใช้กับเครื่อง KS Quikpro บางรุ่นก็ใช้หัวร่วมกันได้ อย่าง Zero Cartridge ที่ใส่ได้ทั้ง Zero Pro และ Zero Nano หรือ RELX Infinity 2 Plus ที่ใส่ได้ทั้งหัว RELX Pod · Pod Pro และ Pod Pro 2 ส่วน RELX Creator ร้านยืนยันแล้วว่าใส่ได้ทั้ง RELX Creator Pod และ Muro Connector 20K และ [nexPOD 15K Pro Kit](/products/nexpod-15k) ของ WOTOFO ใส่ได้ทั้งหัวพอตบรรจุสำเร็จ และหัวแบบเติมน้ำยาเองที่ WOTOFO ขายแยก ก่อนซื้อหัวพอต เช็คชื่อรุ่นเครื่องในหน้าสินค้าอีกครั้งนะคะ",
        },
        {
          question: "พอตเปลี่ยนหัว ชาร์จได้ไหม",
          answer:
            "ตัวเครื่องที่ผู้ผลิตบอกเรื่องการชาร์จไว้ ชาร์จได้ค่ะ M Switch Kit · Zero Pro · RELX Creator · RELX Infinity 2 Plus · INFY POD และ KS Quikpro 15K Kit ชาร์จผ่าน USB-C ส่วน Esko Bar Switch 20K ผู้ผลิตระบุการชาร์จไว้ที่ 5V 0.85A และ nexPOD 15K Pro Kit รองรับการชาร์จเร็ว รุ่นอื่นดูได้ในตารางสเปกของรุ่นนั้นค่ะ",
        },
        {
          question: "หัวพอตหนึ่งหัวใช้ได้กี่พัฟ",
          answer:
            "ดูได้จากจำนวนพัฟที่ระบุไว้ในหน้าสินค้าค่ะ เช่น หัว Esko Bar Switch หัวละสูงสุด 20,000 พัฟ หัว Nexswitch 16K หัวละสูงสุด 16,000 พัฟ ส่วน M Switch Pod หัว KS Quikpro และหัวของ nexPOD 15K ระบุไว้หัวละ 15,000 พัฟ ตัวเลขพัฟเป็นจำนวนที่ระบุไว้ จะสูบได้ใกล้แค่ไหนขึ้นกับว่าแต่ละคนสูบถี่และดูดยาวแค่ไหนค่ะ",
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
            "The [M Switch Kit](/products/m-switch-kit) is a device with a pod, the set we sell as the M Bar 15K, or Marbo 15K. It takes the [M Switch Pod](/products/m-switch-pod), rated by SALTHUB at up to 15,000 puffs per pod, with a cotton mesh coil. The device has a digital battery display and an airflow slider, and charges over USB-C. The Zero family shares one pod: the 2.2mL [Zero Cartridge](/products/zero-cartridge) fits both the [Zero Pro](/products/zero-pro) and the [Zero Nano](/products/zero-nano). The Zero Pro has three power modes and a 380mAh battery; the Zero Nano is the compact one, with 500mAh. More from the brand is on the [SALTHUB](/brands/salthub) page.",
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
            "Each pod fits the devices its maker names: the M Switch Pod fits the M Switch Kit, and the KS Quikpro pod fits the KS Quikpro. Some pods are shared. The Zero Cartridge fits both the Zero Pro and the Zero Nano, the RELX Infinity 2 Plus takes RELX Pod, Pod Pro and Pod Pro 2, and the RELX Creator takes both RELX Creator Pods and Muro Connector 20K, as we have confirmed in store. WOTOFO's [nexPOD 15K Pro Kit](/products/nexpod-15k) takes its prefilled pod as well as the refillable pod WOTOFO sells separately. Before you buy a pod, check the device name on the product page.",
        },
        {
          question: "Can a switch pod device be recharged?",
          answer:
            "Yes, on every model whose maker covers charging. The M Switch Kit, Zero Pro, RELX Creator, RELX Infinity 2 Plus, INFY POD and KS Quikpro 15K Kit all charge over USB-C. ESKO BAR rates the Esko Bar Switch 20K's charging at 5V 0.85A, and the nexPOD 15K Pro Kit supports fast charging. For other models, see the spec table on the product page.",
        },
        {
          question: "How many puffs does one pod give?",
          answer:
            "Look for the puff count on the product page. The Esko Bar Switch pod is rated at up to 20,000 puffs, the Nexswitch 16K pod at up to 16,000, and the M Switch Pod, KS Quikpro pod and nexPOD 15K pod at 15,000 each. These are stated figures; how close you get depends on how often and how long you draw.",
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
            "[M Switch Kit](/products/m-switch-kit) 是主机加烟弹的套装，本店称之为 M Bar 15K，也叫 Marbo 15K。它搭配 [M Switch Pod](/products/m-switch-pod) 烟弹，SALTHUB 标称每颗最高 15,000 口，采用 cotton mesh 雾化芯；主机配有数字电量屏和进气滑块，USB-C 充电。Zero 系列共用一款烟弹：2.2mL 的 [Zero Cartridge](/products/zero-cartridge) 同时适配 [Zero Pro](/products/zero-pro) 和 [Zero Nano](/products/zero-nano)。Zero Pro 有三种功率模式，电池 380mAh；Zero Nano 是系列中的小巧款，电池 500mAh。更多产品见 [SALTHUB](/brands/salthub) 品牌页。",
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
            "各款烟弹适配厂商标明的主机，例如 M Switch Pod 适配 M Switch Kit，KS Quikpro 烟弹适配 KS Quikpro 主机。部分烟弹可以共用：Zero Cartridge 同时适配 Zero Pro 与 Zero Nano；RELX Infinity 2 Plus 可用 RELX Pod、Pod Pro 和 Pod Pro 2；RELX Creator 可用 RELX Creator Pod 与 Muro Connector 20K，已经本店确认。WOTOFO 的 [nexPOD 15K Pro Kit](/products/nexpod-15k) 既可用预注油烟弹，也可用 WOTOFO 另售的可注油烟弹。购买烟弹前，请在产品页面再核对一次主机型号。",
        },
        {
          question: "换弹式设备可以充电吗？",
          answer:
            "厂商有说明充电的型号都可以充电。M Switch Kit、Zero Pro、RELX Creator、RELX Infinity 2 Plus、INFY POD 和 KS Quikpro 15K Kit 均为 USB-C 充电；ESKO BAR 标明 Esko Bar Switch 20K 的充电规格为 5V 0.85A，nexPOD 15K Pro Kit 支持快充。其他型号请查看产品页面的规格表。",
        },
        {
          question: "一颗烟弹能抽多少口？",
          answer:
            "请看产品页面标明的口数。Esko Bar Switch 烟弹每颗最高 20,000 口，Nexswitch 16K 烟弹每颗最高 16,000 口，M Switch Pod、KS Quikpro 烟弹和 nexPOD 15K 烟弹每颗 15,000 口。这些都是标称数字，实际能抽到多少，取决于每个人抽吸的频率和时长。",
        },
      ],
    },
  },
  disposables: {
    th: {
      heading: "พอตใช้แล้วทิ้งแต่ละยี่ห้อบนหน้านี้ ต่างกันตรงไหน",
      intro:
        "พอตใช้แล้วทิ้งทุกรุ่นบนหน้านี้มีน้ำยามาในเครื่องแล้ว ใช้ไปจนน้ำยาหมดแล้วก็เปลี่ยนเครื่องใหม่ สิ่งที่ต่างกันจึงอยู่ที่จำนวนพัฟ ความจุน้ำยา คอยล์ และแบตว่าชาร์จซ้ำได้ไหม ด้านล่างนี้สรุปรุ่นหลักไว้เป็นสามกลุ่ม ถ้าอยากเลือกตามสิ่งที่ต้องการทีละเรื่อง อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง ยี่ห้อไหนดี](/guides/choosing-a-disposable)",
      families: [
        {
          heading: "M Bar จาก SALTHUB",
          body:
            "[M Bar 10K](/products/m-bar-10k) กับ [M Bar 9K](/products/m-bar-9k) เป็นพอตใช้แล้วทิ้งของ SALTHUB ในตระกูลที่หลายร้านเรียกว่า Marbo ทั้งสองรุ่นแบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C และปรับช่องลมได้ M Bar 10K รองรับสูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh มี 3 โหมด Eco · Soft · Boost กดสองครั้งติดกันเพื่อสลับ และมีไฟ LED บอกระดับแบต ส่วน M Bar 9K สูงสุด 9,000 พัฟ ใช้ salt nic 30mg และมีกลิ่นให้เลือกมากกว่า ถ้ากำลังหา M Bar 15K ชุดนี้คือ [M Switch Kit](/products/m-switch-kit) ที่เก็บตัวเครื่องไว้แล้วเปลี่ยนแค่หัวพอต จึงอยู่ในหมวด[พอตเปลี่ยนหัว](/products/switch-pods)",
        },
        {
          heading: "ESKO BAR · TFIT และ WOTOFO",
          body:
            "[ESKO BAR 20000](/products/esko-bar-20k) ผู้ผลิตระบุไว้สูงสุด 20,000 พัฟ น้ำยา 18mL ใช้คอยล์ mesh สองตัว 1.0 โอห์ม แบต 600mAh ชาร์จได้ และความเข้มข้นนิโคติน 3% [TFIT M Power 20K](/products/tfit-m-power-20k) ก็รองรับสูงสุด 20,000 พัฟเช่นกัน น้ำยา 18mL ใช้คอยล์ mesh สองตัว 0.8 โอห์ม แบต 600mAh ชาร์จผ่าน USB-C และปรับช่องลมได้ ส่วน [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) สูงสุด 18,000 พัฟ น้ำยา 21mL แบต 750mAh มีโหมด NORM 16 วัตต์ กับ TURBO 19 วัตต์ และมีจอ LED ที่บอกทั้งแบต น้ำยาที่เหลือ และโหมดที่ใช้อยู่ อีกรุ่นที่ชื่อคล้ายกันคือ [nexBar CLEAR 18K](/products/pod-180) ตัวใส ซึ่งเป็นคนละรุ่นกับของ WOTOFO ระบุไว้สูงสุด 18,000 พัฟ น้ำยา 18mL แบต 650mAh และมีโหมด Normal กับ Turbo",
        },
        {
          heading: "RELX · INFY และ JOIWAY",
          body:
            "[RELX Smash Go 12K](/products/relx-smash-go-12k) รองรับสูงสุด 12,000 พัฟ น้ำยา 20mL ใช้คอยล์ MEGA MESH แบต 400mAh ชาร์จผ่าน USB-C และมีความเข้มข้นให้เลือก 3% หรือ 5% ส่วน [RELX LUMI 18K](/products/relx-lumi-18k) ชื่อรุ่นระบุ 18,000 พัฟ [INFY 20K](/products/infy-20k) ร้านยืนยันความจุน้ำยาไว้ที่ 20mL และยืนยันว่าปรับช่องลมได้ ฝั่ง JOIWAY มี [Joiway F4](/products/joiway-f4) ที่มีถังน้ำยาสองถัง ถังละหนึ่งกลิ่น หมุนปากดูดเพื่อสลับกลิ่น ระบุไว้สูงสุด 20,000 พัฟ แบ่งเป็นฝั่งละ 10,000 พัฟ แบต 650mAh และมีจอ LED ส่วน [Joiway F3](/products/joiway-f3) เป็นรุ่นกลิ่นเดียว ระบุไว้ 12,000 พัฟขึ้นไป ใช้นาโนคอยล์ และชาร์จผ่าน USB-C",
        },
      ],
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
            "ดูได้จากจำนวนพัฟที่ระบุไว้ในหน้าสินค้าค่ะ บางรุ่นผู้ผลิตระบุไว้เอง เช่น TFIT M Power 20K สูงสุด 20,000 พัฟ บางรุ่นอย่าง SKE Crystal B20000 กับ SUP ZERO 22K ตัวเลขมาจากชื่อรุ่น ตัวเลขพัฟเป็นจำนวนสูงสุด จะสูบได้ใกล้แค่ไหนขึ้นกับวิธีสูบของแต่ละคน จึงควรดูความจุน้ำยาที่บอกเป็น mL ประกอบด้วย อ่านเพิ่มได้ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts) ค่ะ",
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
            "The [RELX Smash Go 12K](/products/relx-smash-go-12k) is rated at up to 12,000 puffs, with 20mL, a MEGA MESH coil, a 400mAh battery that charges over USB-C, and a choice of 3% or 5% nicotine. The [RELX LUMI 18K](/products/relx-lumi-18k) carries 18,000 puffs in its model name. For the [INFY 20K](/products/infy-20k), we have confirmed a 20mL capacity and adjustable airflow ourselves. From JOIWAY, the [Joiway F4](/products/joiway-f4) has two tanks with one flavor each; turn the mouthpiece to switch. It is rated at up to 20,000 puffs, 10,000 per side, with a 650mAh battery and an LED display. The [Joiway F3](/products/joiway-f3) is the single-flavor model, rated at 12,000+ puffs, with a nano coil and USB-C charging.",
        },
      ],
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
            "Check the puff count on the product page. Some figures come from the maker, such as up to 20,000 for the TFIT M Power 20K; for others, like the SKE Crystal B20000 and SUP ZERO 22K, the number comes from the model name. Puff counts are maximums, and how close you get depends on how you vape, so it is worth looking at the e-liquid capacity in mL as well.",
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
            "[RELX Smash Go 12K](/products/relx-smash-go-12k) 标称最高 12,000 口，烟油 20mL，MEGA MESH 雾化芯，400mAh 电池 USB-C 充电，尼古丁浓度可选 3% 或 5%。[RELX LUMI 18K](/products/relx-lumi-18k) 的型号名标明 18,000 口。[INFY 20K](/products/infy-20k) 经本店确认容量 20mL，进气可调。JOIWAY 的 [Joiway F4](/products/joiway-f4) 内有两个油仓，各装一种口味，转动烟嘴即可切换，标称最高 20,000 口，每侧 10,000 口，电池 650mAh，配 LED 屏；[Joiway F3](/products/joiway-f3) 是单一口味款，标称 12,000 口以上，采用 nano 雾化芯，USB-C 充电。",
        },
      ],
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
            "请看产品页面标明的口数。有些是厂商标称，例如 TFIT M Power 20K 最高 20,000 口；有些如 SKE Crystal B20000、SUP ZERO 22K，数字来自型号名称。口数都是最高值，实际能抽多少取决于个人抽法，所以建议同时参考以 mL 标示的烟油容量。",
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
};
