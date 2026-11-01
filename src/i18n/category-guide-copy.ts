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
  table: { heading: string; note: string; model: string; battery: string; power: string; capacity: string; externalCell: string };
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
};
