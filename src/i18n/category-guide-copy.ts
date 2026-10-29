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
            "เครื่องกลุ่มนี้ใช้หัวพอตแบบเติมด้านบน จ่ายได้สูงสุด 30–40 วัตต์แล้วแต่รุ่น ARGUS G4 · ARGUS G4 mini และ VMATE i3 มีปุ่มเลื่อนปรับลม ตั้งแต่ MTL ที่ลมแน่น ไปจนถึง RDL ที่ลมโล่งขึ้น ตัวเครื่อง ARGUS ใส่หัวพอตตระกูล ARGUS ได้ทุกหัว ส่วน [VMATE i3](/products/vmate-i3) ใส่หัวพอต VMATE ได้ทุกหัว ในช่วง 0.4–1.2 โอห์ม อยากเปลี่ยนแนวการสูบก็เปลี่ยนไปใช้หัวพอตค่าโอห์มอื่นได้ ส่วนหัวพอต Multi-Ohm ของ [ARGUS G4](/products/argus-g4) แค่กลับด้านหัวพอต ค่าโอห์มก็เปลี่ยนจาก 0.7 เป็น 1.0 โอห์ม",
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
            "ได้ ถ้าอยู่ในระบบหัวพอตเดียวกันค่ะ เช่น หัวพอต GPP ของ UWELL ใช้ได้ทั้ง G4 และ G5 ของ Caliburn เครื่อง ARGUS ใส่หัวพอตตระกูล ARGUS ได้ทุกหัว และ VMATE i3 ใส่หัวพอต VMATE ได้ทุกหัว ก่อนซื้อ เช็คแถวหัวพอตที่ใช้ได้ บนหน้าสินค้าของเครื่องอีกครั้งนะคะ แล้วเลือกหัวพอตได้ที่หน้า [หัวพอต](/products/pods-cartridges) ส่วนคอยล์ดูได้ที่หน้า [คอยล์และอุปกรณ์เสริม](/products/coils-accessories) ค่ะ",
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
            "These devices take top-fill pods and deliver up to 30–40W, depending on the model. The ARGUS G4, ARGUS G4 mini and VMATE i3 have an airflow slider that runs from a tight MTL draw to a looser RDL draw. ARGUS devices take every ARGUS-family cartridge, and the [VMATE i3](/products/vmate-i3) takes every VMATE cartridge from 0.4 to 1.2Ω, so a different pod gives you a different draw. With the Multi-Ohm cartridge on the [ARGUS G4](/products/argus-g4), just turn the cartridge around and the resistance changes from 0.7Ω to 1.0Ω.",
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
            "Yes, within the same pod system. The Caliburn G4 and G5 both use UWELL's GPP pods, ARGUS devices take every ARGUS-family cartridge, and the VMATE i3 takes every VMATE cartridge. Before you buy, check the “Pod platform” row on the device's page, then pick your pods on the [Pods & Cartridges](/products/pods-cartridges) page. Coils are on the [Coils & Accessories](/products/coils-accessories) page.",
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
            "这一类采用顶部注油的烟弹，最高输出 30–40W，视型号而定。ARGUS G4、ARGUS G4 mini 和 VMATE i3 配有进气滑块，从偏紧的 MTL 到更通透的 RDL 都能调。ARGUS 主机兼容整个 ARGUS 烟弹家族，[VMATE i3](/products/vmate-i3) 兼容全部 VMATE 烟弹，阻值 0.4–1.2Ω，换一颗烟弹就能换一种吸感。[ARGUS G4](/products/argus-g4) 搭配 Multi-Ohm 烟弹时，把烟弹调转方向插入，阻值就从 0.7Ω 变为 1.0Ω。",
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
            "同一烟弹系统内可以通用。例如 Caliburn G4 与 G5 都使用 UWELL 的 GPP 烟弹，ARGUS 主机兼容整个 ARGUS 烟弹家族，VMATE i3 兼容全部 VMATE 烟弹。购买前请再核对设备页面规格表中的烟弹兼容一栏，然后到 [烟弹](/products/pods-cartridges) 页面选购；雾化芯请见 [雾化芯与配件](/products/coils-accessories)。",
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
};
