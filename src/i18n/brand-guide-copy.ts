/**
 * Round SEO full batch 3 (07/11): the text block under a brand page's grid, in the shape and through the component of the
 * category pages (CategoryGuide). A brand without an entry shows nothing new. Thai = what Google reads and the FAQPage JSON-LD.
 * Brand words live here, model words stay on the product pages (SEO_LANDSCAPE section 0). Facts = verified spec rows and the
 * site's guides; wording thai-copy 07/11.
 */
import type { CategoryGuideCopy } from "@/i18n/category-guide-copy";

export const BRAND_GUIDE_COPY: Record<string, Partial<Record<"th" | "en" | "zh", CategoryGuideCopy>>> = {
  salthub: {
    th: {
      heading: "M Bar · M Switch และ Zero ของ SALTHUB ต่างกันตรงไหน",
      intro:
        "SALTHUB หรือ Salt Hub คือแบรนด์เจ้าของ M Bar · M Switch และ Zero ส่วนพอต Marbo ที่หลายร้านเรียกกัน ก็คือ M Bar กับ M Switch ของแบรนด์นี้\n\nสินค้าของแบรนด์แบ่งได้เป็นสองแบบ แบบแรกคือพอตใช้แล้วทิ้ง ใช้จนน้ำยาหมดแล้วก็เปลี่ยนใหม่ทั้งเครื่อง แบบที่สองคือพอตเปลี่ยนหัว เก็บตัวเครื่องไว้ใช้ต่อ แล้วเปลี่ยนเฉพาะหัวพอตบรรจุสำเร็จ ทั้งสองแบบมีน้ำยามาให้พร้อมสูบเหมือนกัน\n\nตัวเลขด้านล่างเป็นตัวเลขที่ SALTHUB ระบุไว้ ถ้ากำลังเลือกระหว่างสองแบบนี้ อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) และถ้ากำลังเลือกกลิ่น ดูได้ที่ [Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor)",
      families: [
        {
          heading: "M Bar แบบใช้แล้วทิ้ง",
          body:
            "M Bar คือตระกูลพอตใช้แล้วทิ้งของ SALTHUB ทั้งสองรุ่นบนหน้านี้มีแบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C และปรับช่องลมได้ [M Bar 9K](/products/m-bar-9k) ระบุไว้สูงสุด 9,000 พัฟ ใช้นิโคติน salt nic 30mg และคอยล์ 1.0 โอห์ม ส่วน [M Bar 10K](/products/m-bar-10k) ระบุไว้สูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh และกดสองครั้งติดกันเพื่อสลับโหมด Eco · Soft · Boost ได้ โดยมีไฟ RGB บอกโหมดที่ใช้อยู่ และไฟ LED บอกระดับแบตทีละ 25%",
        },
        {
          heading: "M Switch ตัวเครื่องคู่หัวพอต",
          body:
            "ชุด [M Bar 15K](/products/m-switch-kit) หรือ M Switch Kit คือตัวเครื่องที่เก็บไว้ใช้ต่อ คู่กับหัวพอตที่มีน้ำยามาในตัว ตัวเครื่องมีจอดิจิทัลบอกระดับแบต มีปุ่มเลื่อนปรับลม และชาร์จผ่าน USB-C ส่วนหัว [M Switch Pod](/products/m-switch-pod) ที่ SALTHUB ระบุไว้หัวละสูงสุด 15,000 พัฟ ใช้คอยล์ cotton mesh 1.0 โอห์ม และนิโคติน salt nic 30mg พอหัวพอตหมดก็ถอดออกแล้วใส่หัวใหม่ได้เลย จะเปลี่ยนเป็นกลิ่นอื่นก็เปลี่ยนแค่หัว",
        },
        {
          heading: "Zero ใช้หัวพอตร่วมกัน",
          body:
            "ตระกูล Zero มีตัวเครื่องสองรุ่นที่ใช้หัว [Zero Cartridge](/products/zero-cartridge) ขนาด 2.2mL เหมือนกัน [Zero Pro](/products/zero-pro) มี 3 โหมดให้สลับแรงสูบได้ แบต 380mAh ในตัว มีช่องลมเข้าด้านข้าง ชาร์จผ่าน USB-C และโปสเตอร์ของ SALTHUB ระบุไว้ 5,000 พัฟ ส่วน [Zero Nano](/products/zero-nano) เป็นรุ่นตัวเล็กของตระกูล แบต 500mAh ถ้ามีทั้งสองเครื่องก็ใช้หัวพอตร่วมกันได้",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "Marbo คืออะไร",
          answer:
            "คือชื่อที่หลายคนใช้เรียก M Bar ของ SALTHUB ค่ะ บางคนก็เรียกว่าเอ็มบาร์ ส่วนตามร้านอื่นมักเห็นชื่อ Marbo ทั้งหมดนี้คือของตระกูลเดียวกัน และเว็บทางการ salthub.com ก็มีโลโก้ Marbo อยู่ที่ท้ายเว็บค่ะ",
        },
        {
          question: "M Bar กับ M Switch ต่างกันยังไง",
          answer:
            "ต่างกันตอนน้ำยาหมดค่ะ M Bar เป็นพอตใช้แล้วทิ้ง ใช้จนหมดแล้วก็เปลี่ยนใหม่ทั้งเครื่อง ส่วน M Switch เก็บตัวเครื่องไว้ แล้วเปลี่ยนแค่หัวพอตบรรจุสำเร็จ หัวพอตหนึ่งหัวคือหนึ่งกลิ่น อยากเปลี่ยนกลิ่นก็เปลี่ยนแค่หัวค่ะ",
        },
        {
          question: "หัว M Switch กับหัว Zero ใช้แทนกันได้ไหม",
          answer:
            "หัวพอตของสองตระกูลนี้ใช้กับตัวเครื่องคนละชุดค่ะ [M Switch Pod](/products/m-switch-pod) ใช้กับ M Switch Kit ส่วน [Zero Cartridge](/products/zero-cartridge) ใช้กับ Zero Pro และ Zero Nano ก่อนซื้อหัวพอต เช็คชื่อรุ่นเครื่องในหน้าสินค้าอีกครั้งนะคะ",
        },
        {
          question: "M Bar ต้องซื้อน้ำยามาเติมไหม",
          answer:
            "ไม่ต้องค่ะ พอตใช้แล้วทิ้งและหัวพอตบรรจุสำเร็จมีน้ำยามาในตัวแล้ว ส่วน [Marbo Saltnic](/products/eliquid-1) ขวด 30ml และ [Marbo Freebase](/products/eliquid-109) เป็นน้ำยาแบบขวด สำหรับพอตซิสเต็มที่เติมน้ำยาเองค่ะ",
        },
        {
          question: "Marbo ของแท้ เช็คยังไง",
          answer:
            "เช็คได้ที่หน้า salthub.com/authenticate ของ SALTHUB เองค่ะ หน้านี้ใช้การถ่ายรูปแทนการกรอกรหัส ให้ถ่ายฉลากรับรองตัวจริงบนกล่องให้ชัดและซูมให้พอดี พอภาพชัดพอ ระบบจะถ่ายให้เอง ร้านแนะนำให้เช็คทันทีที่ได้รับของ และเก็บกล่องไว้จนเช็คเสร็จ ดูขั้นตอนเพิ่มเติมได้ที่ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) ค่ะ",
        },
        {
          question: "Marbo ราคาเท่าไหร่ สั่งแล้วกี่วันถึง",
          answer:
            "ราคา SALTHUB ของแต่ละรุ่นดูได้ที่หน้าสินค้าของรุ่นนั้น และขั้นตอนการสั่งอยู่ที่ [วิธีสั่งซื้อ](/how-to-order) ค่ะ โอนและส่งสลิปก่อน 12:30 เราจัดส่งให้วันเดียวกัน ถ้าหลัง 12:30 จะส่งในวันทำการถัดไปค่ะ เราส่งวันจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ ของออกจากร้านแล้วถึงมือภายใน 1–3 วัน พร้อมเลขพัสดุให้ติดตามค่ะ",
        },
      ],
    },
    en: {
      heading: "SALTHUB's M Bar, M Switch and Zero, and how they differ",
      intro:
        "SALTHUB, also written Salt Hub, is the brand behind M Bar, M Switch and Zero. The Marbo pods many shops talk about are this brand's M Bar and M Switch.\n\nThe range comes in two formats. A disposable is used until the e-liquid runs out, then replaced as a whole. A switch pod keeps the device and changes only the prefilled pod. Both come filled and ready to use.\n\nThe figures below are the ones SALTHUB states.",
      families: [
        {
          heading: "M Bar disposables",
          body:
            "M Bar is SALTHUB's disposable line. Both models here have a 600mAh battery, recharge over USB-C and offer adjustable airflow. The [M Bar 9K](/products/m-bar-9k) is rated at up to 9,000 puffs, with 30mg salt nic and a 1.0Ω coil. The [M Bar 10K](/products/m-bar-10k) is rated at up to 10,000 puffs and uses a cotton mesh coil. Double-click to switch between Eco, Soft and Boost; an RGB light shows the active mode, and an LED shows the battery in 25% steps.",
        },
        {
          heading: "M Switch device and pods",
          body:
            "The [M Bar 15K](/products/m-switch-kit) set, also called the M Switch Kit, pairs a device you keep with a prefilled pod. The device has a digital battery display and an airflow slider, and charges over USB-C. The [M Switch Pod](/products/m-switch-pod) is rated by SALTHUB at up to 15,000 puffs per pod, with a 1.0Ω cotton mesh coil and 30mg salt nic. When a pod runs out, fit a new one. A different pod also gives you a different flavor.",
        },
        {
          heading: "Zero, one shared pod",
          body:
            "The Zero family has two devices that take the same 2.2mL [Zero Cartridge](/products/zero-cartridge). The [Zero Pro](/products/zero-pro) has three modes, a built-in 380mAh battery, side air intake and USB-C charging, and SALTHUB's poster rates it at 5,000 puffs. The [Zero Nano](/products/zero-nano) is the compact one, with a 500mAh battery. If you own both, they can share pods.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "What is Marbo?",
          answer:
            "Marbo is the name many shops use for SALTHUB's M Bar and M Switch. It is the same line, and SALTHUB's official site, salthub.com, carries the Marbo logo in its footer.",
        },
        {
          question: "How is M Bar different from M Switch?",
          answer:
            "The difference shows when the e-liquid runs out. An M Bar is a disposable, so you replace the whole device. With M Switch you keep the device and change only the prefilled pod. Each pod is one flavor, so a new pod can also mean a new flavor.",
        },
        {
          question: "Can M Switch and Zero pods be swapped?",
          answer:
            "They are made for different devices. The [M Switch Pod](/products/m-switch-pod) fits the M Switch Kit, and the [Zero Cartridge](/products/zero-cartridge) fits the Zero Pro and Zero Nano. Check the device name on the product page before you buy a pod.",
        },
        {
          question: "Do I need to buy e-liquid for an M Bar?",
          answer:
            "No. Disposables and prefilled pods already contain e-liquid. [Marbo Saltnic](/products/eliquid-1), in a 30ml bottle, and [Marbo Freebase](/products/eliquid-109) are bottled e-liquids for Pod Systems you fill yourself.",
        },
        {
          question: "How do I check that a Marbo is genuine?",
          answer:
            "Use SALTHUB's own check page, salthub.com/authenticate. It works from a photo rather than a code: photograph the real label on the box, sharp and well zoomed, and the system takes the shot once the image is clear enough. We suggest checking as soon as your order arrives, and keeping the box until you have.",
        },
        {
          question: "How much does Marbo cost, and how soon will it arrive?",
          answer:
            "Each model's price is on its product page, and the steps are on [How to order](/how-to-order). Transfer and send your slip before 12:30 and we ship the same day; after 12:30 it goes out the next working day. We ship Monday to Saturday, not on Sundays or public holidays. Once it's out, it arrives within 1–3 days, with a tracking number you can follow.",
        },
      ],
    },
    zh: {
      heading: "SALTHUB 的 M Bar、M Switch 与 Zero，有什么不同",
      intro:
        "SALTHUB 也写作 Salt Hub，是 M Bar、M Switch 和 Zero 的品牌方。很多店铺所说的 Marbo，就是这个品牌的 M Bar 和 M Switch。\n\n产品分为两种形式：一次性电子烟用到烟油耗尽后整支更换；换弹式设备保留主机，只更换预注油烟弹。两者出厂都已装好烟油，拿到即可使用。\n\n下文数据均为 SALTHUB 标称。",
      families: [
        {
          heading: "M Bar 一次性系列",
          body:
            "M Bar 是 SALTHUB 的一次性系列。本页两款都采用 600mAh 电池，可通过 USB-C 充电，进气可调。[M Bar 9K](/products/m-bar-9k) 标称最高 9,000 口，使用 30mg salt nic，雾化芯 1.0Ω。[M Bar 10K](/products/m-bar-10k) 标称最高 10,000 口，采用 cotton mesh 雾化芯，双击可切换 Eco、Soft、Boost 三种模式，RGB 灯显示当前模式，LED 以 25% 为单位显示电量。",
        },
        {
          heading: "M Switch 主机与烟弹",
          body:
            "[M Bar 15K](/products/m-switch-kit) 套装也叫 M Switch Kit，由可长期使用的主机和预注油烟弹组成。主机配有数字电量屏和进气滑块，USB-C 充电。[M Switch Pod](/products/m-switch-pod) 烟弹由 SALTHUB 标称每颗最高 15,000 口，采用 1.0Ω cotton mesh 雾化芯，使用 30mg salt nic。烟弹用完换一颗新的即可，想换口味也只需换烟弹。",
        },
        {
          heading: "Zero 共用烟弹",
          body:
            "Zero 系列有两款主机，共用 2.2mL 的 [Zero Cartridge](/products/zero-cartridge) 烟弹。[Zero Pro](/products/zero-pro) 有三种模式，内置 380mAh 电池，侧面进气，USB-C 充电，SALTHUB 海报标称 5,000 口。[Zero Nano](/products/zero-nano) 是系列中的小巧款，电池 500mAh。两台主机可以共用烟弹。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "Marbo 是什么？",
          answer:
            "Marbo 是很多店铺对 SALTHUB 的 M Bar 和 M Switch 的称呼，指的是同一系列。SALTHUB 官网 salthub.com 的页脚也有 Marbo 标志。",
        },
        {
          question: "M Bar 和 M Switch 有什么不同？",
          answer:
            "区别在烟油用完之后。M Bar 是一次性电子烟，需要整支更换；M Switch 保留主机，只换预注油烟弹。一颗烟弹对应一种口味，换烟弹也就换了口味。",
        },
        {
          question: "M Switch 烟弹和 Zero 烟弹可以互换吗？",
          answer:
            "两者适配的主机不同。[M Switch Pod](/products/m-switch-pod) 用于 M Switch Kit，[Zero Cartridge](/products/zero-cartridge) 用于 Zero Pro 和 Zero Nano。购买烟弹前，请再核对产品页上的主机型号。",
        },
        {
          question: "M Bar 需要另外买烟油吗？",
          answer:
            "不需要。一次性电子烟和预注油烟弹都已装好烟油。[Marbo Saltnic](/products/eliquid-1)（30ml 瓶装）和 [Marbo Freebase](/products/eliquid-109) 是瓶装烟油，适用于自行注油的 Pod System。",
        },
        {
          question: "如何查验 Marbo 真伪？",
          answer:
            "请使用 SALTHUB 官方验证页 salthub.com/authenticate。该页面通过拍照验证，而非输入代码：对准包装盒上的实物认证标签，拍清楚并调整好距离，画面足够清晰时系统会自动拍摄。建议收到货后尽快查验，并在查验完成前保留包装盒。",
        },
        {
          question: "Marbo 多少钱？下单后多久能到？",
          answer:
            "各型号价格见对应产品页，下单步骤见 [下单方式](/how-to-order)。12:30 前转账并提交转账凭证，当天发货；12:30 之后则在下一个工作日发货。我们周一至周六发货，周日和法定节假日不发货。寄出后 1–3 天内送达，并附快递单号供查询。",
        },
      ],
    },
  },
  relx: {
    th: {
      heading: "พอต RELX แต่ละแบบต่างกันตรงไหน และใช้หัวพอตอะไร",
      intro:
        "RELX เป็นแบรนด์พอตระดับสากล เว็บทางการคือ relxnow.com พอต RELX บนหน้านี้แบ่งได้เป็นสองแบบ แบบแรกคือ RELX ใช้แล้วทิ้ง มีน้ำยามาในตัว ใช้จนหมดแล้วก็เปลี่ยนใหม่ทั้งเครื่อง แบบที่สองคือเครื่องพอต RELX ที่เก็บตัวเครื่องไว้ใช้ต่อ แล้วเปลี่ยนเฉพาะหัวพอตบรรจุสำเร็จ\n\nถ้าเลือกแบบเปลี่ยนหัว เรื่องแรกที่ควรดูคือตัวเครื่องกับหัวพอตต้องเข้ากัน ด้านล่างนี้จึงจัดกลุ่มตามหัวพอตที่ใช้ เพื่อให้เห็นว่าเครื่อง RELX แต่ละรุ่นใช้กับหัว RELX แบบไหน ตัวเลขทั้งหมดมาจากสเปกบนหน้าสินค้าของแต่ละรุ่น",
      families: [
        {
          heading: "RELX ใช้แล้วทิ้ง",
          body:
            "[RELX Smash Go 12K](/products/relx-smash-go-12k) ระบุไว้สูงสุด 12,000 พัฟ ใช้คอยล์ MEGA MESH แบต 400mAh ชาร์จซ้ำได้ผ่าน USB-C และมีนิโคติน salt nic ให้เลือกทั้ง 3% และ 5% ส่วน [RELX LUMI 18K](/products/relx-lumi-18k) ระบุไว้สูงสุด 18,000 พัฟ แบต 670mAh ความเข้มข้น 3% และหน้าสินค้ารวมไว้ 16 กลิ่น",
        },
        {
          heading: "หัว RELX Pod และเครื่องที่ใช้คู่กัน",
          body:
            "[RELX Infinity 2 Plus](/products/relx-infinity-2-plus) แบต 440mAh มี 3 โหมด คือ Eco 6.5 วัตต์ · Smooth 8 วัตต์ · Boost 10 วัตต์ มีไฟบอกระดับแบต 4 ขั้น และ RELX ระบุว่าชาร์จผ่าน USB-C ได้ 80% ใน 15 นาที เครื่องนี้ใส่ได้ทั้งหัว RELX Pod · RELX Pod Pro และ RELX Pod Pro 2 ซึ่ง RELX ระบุไว้ว่าจุ 1.9mL หัวละสูงสุด 600 พัฟ ส่วนตัวเครื่อง [RELX Essential 2](/products/relx-essential-2) แบต 380mAh ชาร์จผ่าน USB-C และใช้กับหัว RELX Pod กับ RELX Pod Pro กลิ่นของหัว Pod Pro 2 ดูได้ที่ [RELX Infinity Pro 2 Pod](/products/relx-infinity-pro-2-pod) ซึ่งหน้าสินค้ารวมไว้ 49 กลิ่น",
        },
        {
          heading: "เครื่องจอพิกเซลและหัว Creator Pod",
          body:
            "[RELX Creator](/products/relx-creator) ขายเฉพาะตัวเครื่อง หัวพอตเลือกซื้อแยก ตัวเครื่องแบต 800mAh ชาร์จผ่าน USB-C มีจอพิกเซลที่โชว์หน้าอีโมจิ ปรับช่องลมได้ และกดสองครั้งติดกันเพื่อสลับระหว่าง Normal 15 วัตต์ กับ Boost 25 วัตต์ เครื่องนี้ใส่ได้ทั้งหัว [RELX Creator Pod](/products/relx-creator-pod-20k) ที่หน้าสินค้ารวมไว้ 31 กลิ่น และหัว Muro Connector ทั้งสองหัวนี้ร้านยืนยันจากของจริงที่มีอยู่",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "หัวพอต RELX ใส่กับเครื่องรุ่นไหนได้บ้าง",
          answer:
            "ดูตามชื่อหัวพอตค่ะ หัว RELX Pod กับ RELX Pod Pro ใส่ได้ทั้ง [RELX Essential 2](/products/relx-essential-2) และ [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) หัว RELX Pod Pro 2 ใส่กับ Infinity 2 Plus ส่วน [RELX Creator](/products/relx-creator) ใช้หัว RELX Creator Pod ก่อนซื้อ เช็คชื่อรุ่นเครื่องในหน้าสินค้าอีกครั้งนะคะ",
        },
        {
          question: "หัวพอต RELX เติมน้ำยาเองได้ไหม",
          answer:
            "ไม่ควรเติมค่ะ หัวพอตของ RELX เป็นแบบบรรจุสำเร็จ ใช้จนหมดแล้วก็เปลี่ยนหัวใหม่ และ RELX ระบุไว้ในหน้าคำถามที่พบบ่อยของตัวเองว่าหัวพอตของแบรนด์ออกแบบมาให้ใช้รอบเดียว รวมถึงให้เลี่ยงการแกะเปิดหัวด้วยค่ะ",
        },
        {
          question: "RELX ใช้แล้วทิ้ง ต่างจากเครื่อง RELX ยังไง",
          answer:
            "ต่างกันตอนน้ำยาหมดค่ะ แบบใช้แล้วทิ้งเปลี่ยนใหม่ทั้งเครื่อง ส่วนเครื่อง RELX เก็บตัวเครื่องไว้ แล้วเปลี่ยนแค่หัวพอต ทั้งสองแบบมีน้ำยามาให้พร้อมสูบเหมือนกัน อ่านการเทียบสองแบบได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) ค่ะ",
        },
        {
          question: "RELX เช็คของแท้ยังไง",
          answer:
            "พิมพ์รหัส 14 หลักที่ข้างกล่องลงในหน้า relxnow.com/pages/verify แล้วกด Verify ค่ะ หรือจะสแกน QR code บนพอตค้างไว้ประมาณ 3–5 วินาทีก็ได้ เว็บของ RELX ที่ทำพอตคือ relxnow.com ส่วน relx.com เป็นเว็บของบริษัทอื่นที่ชื่อเหมือนกัน ดูขั้นตอนเพิ่มเติมได้ที่ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) ค่ะ",
        },
        {
          question: "พอต RELX ราคาเท่าไหร่ สั่งแล้วกี่วันถึง",
          answer:
            "ราคาของแต่ละรุ่นดูได้ที่หน้าสินค้าของรุ่นนั้น และขั้นตอนการสั่งอยู่ที่ [วิธีสั่งซื้อ](/how-to-order) ค่ะ โอนและส่งสลิปก่อน 12:30 เราจัดส่งให้วันเดียวกัน ถ้าหลัง 12:30 จะส่งในวันทำการถัดไปค่ะ เราส่งวันจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ ของออกจากร้านแล้วถึงมือภายใน 1–3 วัน พร้อมเลขพัสดุให้ติดตามค่ะ",
        },
      ],
    },
    en: {
      heading: "RELX devices and pods: how they differ and what fits what",
      intro:
        "RELX is an international pod brand, and its official site is relxnow.com. The RELX products here come in two formats. A RELX disposable arrives filled and is replaced as a whole once it runs out. A RELX device stays with you, and you change only the prefilled pod.\n\nIf you choose a device, start by making sure it matches the pod you want. The guide below is grouped by pod for that reason. All figures come from the spec rows on each product page.",
      families: [
        {
          heading: "RELX disposables",
          body:
            "The [RELX Smash Go 12K](/products/relx-smash-go-12k) is rated at up to 12,000 puffs, with a MEGA MESH coil, a 400mAh battery that recharges over USB-C, and salt nic in 3% or 5%. The [RELX LUMI 18K](/products/relx-lumi-18k) is rated at up to 18,000 puffs, with a 670mAh battery and 3% nicotine, and its product page lists 16 flavors.",
        },
        {
          heading: "RELX Pod and matching devices",
          body:
            "The [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) has a 440mAh battery, three modes (Eco 6.5W, Smooth 8W and Boost 10W) and a 4-stage battery indicator, and RELX says it reaches 80% in 15 minutes over USB-C. It takes RELX Pod, RELX Pod Pro and RELX Pod Pro 2, which RELX rates at 1.9mL and up to 600 puffs. The [RELX Essential 2](/products/relx-essential-2) has a 380mAh battery with USB-C charging and takes RELX Pod and RELX Pod Pro. Pod Pro 2 flavors are on the [RELX Infinity Pro 2 Pod](/products/relx-infinity-pro-2-pod) page, which lists 49.",
        },
        {
          heading: "Pixel-screen device and Creator Pods",
          body:
            "The [RELX Creator](/products/relx-creator) is sold as the device alone, with pods bought separately. It has an 800mAh battery with USB-C charging, a pixel screen with emoji faces and adjustable airflow. Double-click to switch between Normal at 15W and Boost at 25W. It takes [RELX Creator Pods](/products/relx-creator-pod-20k), with 31 flavors listed, as well as Muro Connector pods. We have confirmed both with our own stock.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "Which devices do RELX pods fit?",
          answer:
            "Go by the pod name. RELX Pod and RELX Pod Pro fit both the [RELX Essential 2](/products/relx-essential-2) and the [RELX Infinity 2 Plus](/products/relx-infinity-2-plus). RELX Pod Pro 2 fits the Infinity 2 Plus, and the [RELX Creator](/products/relx-creator) takes RELX Creator Pods. Check the device name on the product page before you buy.",
        },
        {
          question: "Can I refill a RELX pod?",
          answer:
            "We advise against it. RELX pods are prefilled, so you fit a new one when it runs out. RELX's own FAQ says its pods are designed for single use and should stay sealed.",
        },
        {
          question: "How is a RELX disposable different from a RELX device?",
          answer:
            "The difference shows when the e-liquid runs out. A disposable is replaced as a whole, while a device stays with you and only the pod changes. Both come ready filled.",
        },
        {
          question: "How do I check that RELX is genuine?",
          answer:
            "Type the 14-digit code from the side of the box into relxnow.com/pages/verify and press Verify, or scan the QR code on the pod and hold for about 3–5 seconds. The RELX that makes pods is at relxnow.com; relx.com belongs to another company with the same name.",
        },
        {
          question: "How much is RELX, and how soon will it arrive?",
          answer:
            "Each model's price is on its product page, and the steps are on [How to order](/how-to-order). Transfer and send your slip before 12:30 and we ship the same day; after 12:30 it goes out the next working day. We ship Monday to Saturday, not on Sundays or public holidays. Once it's out, it arrives within 1–3 days, with a tracking number you can follow.",
        },
      ],
    },
    zh: {
      heading: "RELX 主机与烟弹：有何不同，如何搭配",
      intro:
        "RELX 是国际电子烟品牌，官网为 relxnow.com。本页的 RELX 产品分为两种：一次性款出厂已装好烟油，用完整支更换；主机款保留主机，只更换预注油烟弹。\n\n选择主机款时，首先要确认主机与烟弹匹配，因此下文按烟弹分组说明。所有数据均来自各产品页的规格信息。",
      families: [
        {
          heading: "RELX 一次性系列",
          body:
            "[RELX Smash Go 12K](/products/relx-smash-go-12k) 标称最高 12,000 口，采用 MEGA MESH 雾化芯，400mAh 电池可通过 USB-C 充电，salt nic 有 3% 和 5% 两种浓度。[RELX LUMI 18K](/products/relx-lumi-18k) 标称最高 18,000 口，电池 670mAh，浓度 3%，产品页列有 16 种口味。",
        },
        {
          heading: "RELX Pod 与适配主机",
          body:
            "[RELX Infinity 2 Plus](/products/relx-infinity-2-plus) 电池 440mAh，有 Eco 6.5W、Smooth 8W、Boost 10W 三种模式，配 4 段电量指示，RELX 标称 USB-C 充电 15 分钟可达 80%。它适配 RELX Pod、RELX Pod Pro 和 RELX Pod Pro 2，RELX 标称容量 1.9mL，每颗最高 600 口。[RELX Essential 2](/products/relx-essential-2) 电池 380mAh，USB-C 充电，适配 RELX Pod 和 RELX Pod Pro。Pod Pro 2 的口味见 [RELX Infinity Pro 2 Pod](/products/relx-infinity-pro-2-pod) 页面，共列出 49 种。",
        },
        {
          heading: "像素屏主机与 Creator Pod",
          body:
            "[RELX Creator](/products/relx-creator) 只售主机，烟弹另购。主机电池 800mAh，USB-C 充电，配像素屏，可显示表情，进气可调，双击即可在 Normal 15W 与 Boost 25W 之间切换。它可使用 [RELX Creator Pod](/products/relx-creator-pod-20k) 烟弹（产品页列有 31 种口味）和 Muro Connector 烟弹，两者均经本店以实物确认。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "RELX 烟弹适配哪些主机？",
          answer:
            "请按烟弹名称判断。RELX Pod 和 RELX Pod Pro 适配 [RELX Essential 2](/products/relx-essential-2) 与 [RELX Infinity 2 Plus](/products/relx-infinity-2-plus)，RELX Pod Pro 2 适配 Infinity 2 Plus，[RELX Creator](/products/relx-creator) 使用 RELX Creator Pod。购买前请再核对产品页上的主机型号。",
        },
        {
          question: "RELX 烟弹可以自己加油吗？",
          answer:
            "不建议这样做。RELX 烟弹为预注油烟弹，用完换新即可。RELX 在官方常见问题中说明，其烟弹按一次性使用设计，也不应拆开。",
        },
        {
          question: "RELX 一次性款和主机款有什么不同？",
          answer:
            "区别在烟油用完之后。一次性款整支更换，主机款保留主机，只换烟弹。两者出厂都已装好烟油。",
        },
        {
          question: "如何查验 RELX 真伪？",
          answer:
            "将包装盒侧面的 14 位代码输入 relxnow.com/pages/verify，再点击 Verify；也可以扫描设备上的二维码，保持约 3–5 秒。生产电子烟的 RELX 官网是 relxnow.com，relx.com 属于另一家同名公司。",
        },
        {
          question: "RELX 多少钱？下单后多久能到？",
          answer:
            "各型号价格见对应产品页，下单步骤见 [下单方式](/how-to-order)。12:30 前转账并提交转账凭证，当天发货；12:30 之后则在下一个工作日发货。我们周一至周六发货，周日和法定节假日不发货。寄出后 1–3 天内送达，并附快递单号供查询。",
        },
      ],
    },
  },
  voopoo: {
    th: {
      heading: "VOOPOO ARGUS DRAG VINCI และ VMATE ต่างกันตรงไหน",
      intro:
        "VOOPOO เป็นผู้ผลิตพอตซิสเต็มหลายตระกูล พอต VOOPOO ทุกรุ่นบนหน้านี้เก็บตัวเครื่องไว้ใช้ต่อ และเติมน้ำยาเอง สิ่งที่ต่างกันจึงอยู่ที่ขนาดเครื่อง วัตต์สูงสุด และหัวพอตหรือคอยล์ที่ใช้\n\nARGUS กับ VMATE เป็นเครื่องขนาดเล็กที่จ่ายได้สูงสุด 30–35 วัตต์ VINCI อยู่ตรงกลางที่ 40 วัตต์ ส่วน DRAG เป็นตระกูลวัตต์สูง จ่ายได้สูงสุดตั้งแต่ 60 ถึง 220 วัตต์แล้วแต่รุ่น ตัวเลขด้านล่างมาจากสเปกของ VOOPOO ถ้าเพิ่งเริ่มใช้พอตเป็นเครื่องแรก อ่าน [เลือก Pod System เครื่องแรก](/guides/choosing-your-first-pod-system) ก่อนได้",
      families: [
        {
          heading: "VOOPOO ARGUS",
          body:
            "[ARGUS G4](/products/argus-g4) แบต 1650mAh มีจอ HD 0.85 นิ้ว และปรับได้ 5–35 วัตต์ ส่วน [ARGUS G4 mini](/products/argus-g4-mini) แบตเท่ากันในตัวเครื่องที่เล็กลง ปรับได้ 5–30 วัตต์ และใช้ไฟ Energy Bar บอกสถานะแทนจอ [ARGUS P3](/products/argus-p3) แบต 1500mAh มีจอทัชเต็มจอ 2.01 นิ้ว ปรับได้ 5–30 วัตต์ และ [ARGUS G3 mini](/products/argus-g3-mini) แบต 1350mAh หนัก 40.85 กรัม ไม่มีปุ่ม สูบได้เลย เครื่องจะปรับวัตต์ให้เองตามหัวพอต สูงสุด 30 วัตต์ เปรียบเทียบทีละคู่ได้ที่ [เทียบ ARGUS สี่รุ่น](/guides/comparing-voopoo-argus-models)",
        },
        {
          heading: "VOOPOO DRAG",
          body:
            "DRAG เป็นตระกูลวัตต์สูงที่แยกคอยล์ออกมาเป็นอีกชิ้น พอคอยล์เสื่อมก็เปลี่ยนแค่คอยล์ [DRAG 6](/products/drag-6) แบตในตัว 4400mAh ปรับได้ 5–220 วัตต์ มีล้อหมุนไว้ปรับค่า และมากับถังน้ำยา 5mL เติมด้านบน [DRAG S3](/products/drag-s3) แบตในตัว 3000mAh ปรับได้ 5–60 วัตต์ ใช้หัวพอต 5mL เติมด้านข้าง ส่วน [DRAG X3](/products/drag-x3) กับ [DRAG X](/products/drag-x) ใช้ถ่านที่ต้องซื้อแยก และปรับได้ 5–80 วัตต์ รุ่น X3 ใส่ถ่านได้ทั้ง 18650 และ 21700 พร้อมจอทัช 1.66 นิ้ว ส่วนรุ่น X ใช้ถ่าน 18650 เทียบรายละเอียดได้ที่ [เทียบ DRAG ทีละเรื่อง](/guides/comparing-voopoo-drag-models)",
        },
        {
          heading: "VINCI และ VMATE",
          body:
            "[VINCI S](/products/vinci-s) แบต 2000mAh ปรับได้ 5–40 วัตต์ ใช้หัวพอตแบบเติมด้านบน จุ 4.5mL ไม่มีปุ่ม สูบได้เลย และใช้ได้ทั้งหัว VINCI S · VINCI E และหัว PnP X ที่ใช้คอยล์ 0.3 โอห์มขึ้นไป ฝั่ง VMATE เน้นตัวเครื่องบาง [VMATE i3](/products/vmate-i3) ยาว 103mm หนัก 49.8 กรัม แบต 1500mAh ปรับได้ 5–30 วัตต์ และมีแถบไฟเปลี่ยนสีตามระดับแบต ส่วน [Vmate Pro 2](/products/vmate-pro-2) แบต 1500mAh เท่ากัน กดปุ่มเดียวสลับโหมด ECO กับ POWER ได้ และในกล่องมีหัวพอต 0.4 กับ 0.7 โอห์มมาให้",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "DRAG กับ ARGUS ต่างกันยังไง",
          answer:
            "ต่างกันหลัก ๆ ที่วัตต์และขนาดเครื่องค่ะ ARGUS เป็นเครื่องขนาดเล็ก จ่ายได้สูงสุด 30–35 วัตต์ ใช้หัวพอตที่เติมจากด้านบน ส่วน DRAG เป็นเครื่องวัตต์สูงที่ตัวใหญ่กว่า ใช้คอยล์ตระกูล PnP ซึ่งแยกเป็นอีกชิ้น ถ้าลังเลว่าตัวเองสูบแนวไหน อ่าน [MTL กับ DTL](/guides/understanding-mtl-vs-dtl) ก่อนได้ค่ะ",
        },
        {
          question: "หัวพอต ARGUS ใช้ข้ามรุ่นได้ไหม",
          answer:
            "ได้ในตระกูลเดียวกันค่ะ [ARGUS G4](/products/argus-g4) · [ARGUS G4 mini](/products/argus-g4-mini) และ [ARGUS P3](/products/argus-p3) ใส่หัวพอตตระกูล ARGUS ได้ทุกหัว ทั้ง Multi-Ohm · Snap และ Top Fill Cartridge V2 ส่วน [ARGUS G3 mini](/products/argus-g3-mini) ใช้หัว Top Fill Cartridge V2 ก่อนเลือก [หัวพอต ARGUS](/products/coil-21) เช็คค่าโอห์มกับวัตต์ให้ตรงกับเครื่องอีกครั้งนะคะ",
        },
        {
          question: "คอยล์ DRAG ใช้ร่วมกันได้ไหม",
          answer:
            "ได้ค่ะ [DRAG 6](/products/drag-6) · [DRAG S3](/products/drag-s3) และ [DRAG X3](/products/drag-x3) ใช้ [คอยล์ PnP X](/products/coil-92) ได้ทุกตัว ซึ่งมีตั้งแต่ 0.15 ถึง 1.0 โอห์ม ส่วน [DRAG X](/products/drag-x) ใช้คอยล์ตระกูล PnP รวมถึง PnP-RBA ก่อนซื้อ เช็คชื่อคอยล์ในหน้าสินค้าของเครื่องอีกครั้งนะคะ",
        },
        {
          question: "DRAG ต้องซื้อถ่านเพิ่มไหม",
          answer:
            "ขึ้นอยู่กับรุ่นค่ะ [DRAG 6](/products/drag-6) กับ [DRAG S3](/products/drag-s3) มีแบตในตัว ชาร์จผ่าน USB-C ได้เลย ส่วน [DRAG X](/products/drag-x) กับ [DRAG X3](/products/drag-x3) ต้องซื้อถ่านแยก เพราะถ่านไม่ได้มาในกล่อง วิธีชาร์จและดูแลถ่านอ่านได้ที่ [ชาร์จพอตและดูแลแบต](/guides/battery-care-and-charging) ค่ะ",
        },
        {
          question: "VOOPOO เช็คของแท้ยังไง",
          answer:
            "สินค้าของ VOOPOO มีสติกเกอร์รหัสกันปลอมค่ะ VOOPOO บอกไว้ว่าสติกเกอร์นี้มีสองแบบ ซึ่งเป็นของแท้ทั้งสองแบบ และรหัสนี้เช็คได้ที่เว็บของ VOOPOO ดูขั้นตอนของแต่ละแบรนด์ได้ที่ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) ค่ะ",
        },
        {
          question: "สั่ง VOOPOO แล้วกี่วันถึง",
          answer:
            "โอนและส่งสลิปก่อน 12:30 เราจัดส่งให้วันเดียวกัน ถ้าหลัง 12:30 จะส่งในวันทำการถัดไปค่ะ เราส่งวันจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ ของออกจากร้านแล้วถึงมือภายใน 1–3 วัน พร้อมเลขพัสดุให้ติดตามค่ะ",
        },
      ],
    },
    en: {
      heading: "VOOPOO ARGUS, DRAG, VINCI and VMATE, and how they differ",
      intro:
        "VOOPOO makes Pod Systems across several families. Every VOOPOO device on this page is one you keep and fill yourself, so the differences come down to size, top output, and the pods or coils each one takes.\n\nARGUS and VMATE are compact devices with a top output of 30–35W. VINCI sits in the middle at 40W, and DRAG is the high-power family, topping out between 60W and 220W depending on the model. Figures come from VOOPOO's specs. If this is your first device, start with [choosing your first Pod System](/guides/choosing-your-first-pod-system).",
      families: [
        {
          heading: "VOOPOO ARGUS",
          body:
            "The [ARGUS G4](/products/argus-g4) has a 1650mAh battery, a 0.85-inch HD screen and 5–35W. The [ARGUS G4 mini](/products/argus-g4-mini) keeps that battery in a smaller body, runs at 5–30W and uses an Energy Bar light in place of a screen. The [ARGUS P3](/products/argus-p3) has a 1500mAh battery, a 2.01-inch full touchscreen and 5–30W. The [ARGUS G3 mini](/products/argus-g3-mini) has a 1350mAh battery and weighs 40.85g. It fires on the draw, with no buttons, and sets its own wattage from the pod, up to 30W.",
        },
        {
          heading: "VOOPOO DRAG",
          body:
            "DRAG is the high-power family, with the coil as a separate part that you replace on its own. The [DRAG 6](/products/drag-6) has a built-in 4400mAh battery, 5–220W, a control wheel and a 5mL top-fill tank. The [DRAG S3](/products/drag-s3) has a built-in 3000mAh battery, 5–60W and a 5mL side-fill pod. The [DRAG X3](/products/drag-x3) and [DRAG X](/products/drag-x) run at 5–80W on a cell you buy separately. The X3 takes an 18650 or 21700 and has a 1.66-inch touchscreen; the X takes an 18650.",
        },
        {
          heading: "VINCI and VMATE",
          body:
            "The [VINCI S](/products/vinci-s) has a 2000mAh battery, 5–40W and a 4.5mL top-fill pod. It fires on the draw, with no button, and takes VINCI S and VINCI E cartridges as well as PnP X pods with coils of 0.3Ω and up. VMATE is the slim family. The [VMATE i3](/products/vmate-i3) measures 103mm long, weighs 49.8g, has a 1500mAh battery and 5–30W, and its light strip changes color with the battery level. The [Vmate Pro 2](/products/vmate-pro-2) has the same battery size, one button to switch between ECO and POWER, and 0.4Ω and 0.7Ω pods in the box.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "How is DRAG different from ARGUS?",
          answer:
            "Mainly in power and size. ARGUS devices are compact, top out at 30–35W and use top-fill pods. DRAG devices are larger, high-power machines that use separate PnP-family coils. If you're not sure how you like to draw, read [MTL vs. DTL](/guides/understanding-mtl-vs-dtl) first.",
        },
        {
          question: "Do ARGUS pods fit across models?",
          answer:
            "Yes, within the family. The [ARGUS G4](/products/argus-g4), [ARGUS G4 mini](/products/argus-g4-mini) and [ARGUS P3](/products/argus-p3) take every ARGUS-family cartridge, including Multi-Ohm, Snap and Top Fill Cartridge V2. The [ARGUS G3 mini](/products/argus-g3-mini) takes Top Fill Cartridge V2. Before you choose [ARGUS pods](/products/coil-21), check the resistance and output against your device.",
        },
        {
          question: "Can DRAG coils be shared?",
          answer:
            "Yes. The [DRAG 6](/products/drag-6), [DRAG S3](/products/drag-s3) and [DRAG X3](/products/drag-x3) take every [PnP X coil](/products/coil-92), from 0.15Ω to 1.0Ω. The [DRAG X](/products/drag-x) takes PnP-family coils, including the PnP-RBA. Check the coil name on your device's product page before you buy.",
        },
        {
          question: "Do DRAG devices need a separate cell?",
          answer:
            "It depends on the model. The [DRAG 6](/products/drag-6) and [DRAG S3](/products/drag-s3) have built-in batteries and charge over USB-C. The [DRAG X](/products/drag-x) and [DRAG X3](/products/drag-x3) need a cell, which isn't in the box. For charging and cell care, see [battery care and charging](/guides/battery-care-and-charging).",
        },
        {
          question: "How do I check that VOOPOO is genuine?",
          answer:
            "VOOPOO products carry an anti-counterfeit code sticker. VOOPOO says the sticker comes in two versions, both genuine, and the code can be checked on VOOPOO's website.",
        },
        {
          question: "How soon will my VOOPOO order arrive?",
          answer:
            "Transfer and send your slip before 12:30 and we ship the same day; after 12:30 it goes out the next working day. We ship Monday to Saturday, not on Sundays or public holidays. Once it's out, it arrives within 1–3 days, with a tracking number you can follow.",
        },
      ],
    },
    zh: {
      heading: "VOOPOO ARGUS、DRAG、VINCI 与 VMATE，有什么不同",
      intro:
        "VOOPOO 生产多个系列的 Pod System。本页的 VOOPOO 设备都是主机留用、自行注油，区别主要在于机身大小、最高输出，以及所用的烟弹或雾化芯。\n\nARGUS 和 VMATE 是小巧机型，最高输出 30–35W；VINCI 居中，最高 40W；DRAG 是高功率系列，最高输出视型号从 60W 到 220W 不等。数据来自 VOOPOO 的规格信息。如果是第一台设备，可先看 [选购第一台 Pod System](/guides/choosing-your-first-pod-system)。",
      families: [
        {
          heading: "VOOPOO ARGUS",
          body:
            "[ARGUS G4](/products/argus-g4) 电池 1650mAh，配 0.85 英寸 HD 屏，功率 5–35W。[ARGUS G4 mini](/products/argus-g4-mini) 电池容量相同，机身更小，功率 5–30W，以 Energy Bar 灯代替屏幕。[ARGUS P3](/products/argus-p3) 电池 1500mAh，配 2.01 英寸全触控屏，功率 5–30W。[ARGUS G3 mini](/products/argus-g3-mini) 电池 1350mAh，重 40.85 克，无按键，吸气即用，并根据烟弹自动设定功率，最高 30W。",
        },
        {
          heading: "VOOPOO DRAG",
          body:
            "DRAG 是高功率系列，雾化芯为独立部件，可单独更换。[DRAG 6](/products/drag-6) 内置 4400mAh 电池，功率 5–220W，配调节滚轮和 5mL 顶部注油油仓。[DRAG S3](/products/drag-s3) 内置 3000mAh 电池，功率 5–60W，使用 5mL 侧注油烟弹。[DRAG X3](/products/drag-x3) 和 [DRAG X](/products/drag-x) 功率 5–80W，电芯需另购；X3 可用 18650 或 21700，配 1.66 英寸触控屏，X 使用 18650。",
        },
        {
          heading: "VINCI 与 VMATE",
          body:
            "[VINCI S](/products/vinci-s) 电池 2000mAh，功率 5–40W，使用 4.5mL 顶部注油烟弹，无按键，吸气即用；可搭配 VINCI S、VINCI E 烟弹，以及使用 0.3Ω 及以上雾化芯的 PnP X 烟弹。VMATE 主打纤薄机身：[VMATE i3](/products/vmate-i3) 长 103mm，重 49.8 克，电池 1500mAh，功率 5–30W，灯带随电量变色。[Vmate Pro 2](/products/vmate-pro-2) 电池同为 1500mAh，一键切换 ECO 与 POWER，盒内附 0.4Ω 和 0.7Ω 烟弹。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "DRAG 和 ARGUS 有什么不同？",
          answer:
            "主要区别在功率和机身大小。ARGUS 机身小巧，最高输出 30–35W，使用顶部注油烟弹；DRAG 是机身更大的高功率设备，使用独立的 PnP 系列雾化芯。如果还不确定自己的吸法，可先看 [MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
        },
        {
          question: "ARGUS 烟弹可以跨型号通用吗？",
          answer:
            "同系列内可以。[ARGUS G4](/products/argus-g4)、[ARGUS G4 mini](/products/argus-g4-mini) 和 [ARGUS P3](/products/argus-p3) 兼容全部 ARGUS 烟弹，包括 Multi-Ohm、Snap 和 Top Fill Cartridge V2；[ARGUS G3 mini](/products/argus-g3-mini) 使用 Top Fill Cartridge V2。选购 [ARGUS 烟弹](/products/coil-21) 前，请核对阻值和功率是否适合设备。",
        },
        {
          question: "DRAG 雾化芯可以通用吗？",
          answer:
            "可以。[DRAG 6](/products/drag-6)、[DRAG S3](/products/drag-s3) 和 [DRAG X3](/products/drag-x3) 兼容全部 [PnP X 雾化芯](/products/coil-92)，阻值 0.15Ω 至 1.0Ω。[DRAG X](/products/drag-x) 使用 PnP 系列雾化芯，包括 PnP-RBA。购买前请再核对设备产品页上的雾化芯名称。",
        },
        {
          question: "DRAG 需要另购电芯吗？",
          answer:
            "视型号而定。[DRAG 6](/products/drag-6) 和 [DRAG S3](/products/drag-s3) 内置电池，USB-C 充电；[DRAG X](/products/drag-x) 和 [DRAG X3](/products/drag-x3) 需要另购电芯，盒内不附带。充电与电芯保养见 [电池保养与充电](/guides/battery-care-and-charging)。",
        },
        {
          question: "如何查验 VOOPOO 真伪？",
          answer:
            "VOOPOO 产品贴有防伪码贴纸。VOOPOO 说明这种贴纸有两种样式，均为正品，防伪码可在 VOOPOO 官网查验。",
        },
        {
          question: "VOOPOO 下单后多久能到？",
          answer:
            "12:30 前转账并提交转账凭证，当天发货；12:30 之后则在下一个工作日发货。我们周一至周六发货，周日和法定节假日不发货。寄出后 1–3 天内送达，并附快递单号供查询。",
        },
      ],
    },
  },
  infy: {
    th: {
      heading: "INFY บนหน้านี้มีแบบไหนบ้าง",
      intro:
        "พอต INFY บนหน้านี้มีสองแบบ แบบแรกคือตัวเครื่องที่เก็บไว้ใช้ต่อ แล้วเปลี่ยนเฉพาะหัวพอตบรรจุสำเร็จ แบบที่สองคือพอตใช้แล้วทิ้ง ที่ใช้จนหมดแล้วเปลี่ยนใหม่ทั้งเครื่อง ทั้งสองแบบมีน้ำยามาให้พร้อมสูบ จึงต่างกันหลัก ๆ ตอนน้ำยาหมด\n\nตัวเลขด้านล่างมาจากสเปกบนหน้าสินค้า ส่วนจุดที่บอกว่าร้านยืนยัน คือข้อมูลที่ร้านเช็คเอง ถ้ายังลังเลว่าจะเลือกแบบไหน อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
      families: [
        {
          heading: "ตัวเครื่องกับหัวพอตของแบรนด์",
          body:
            "[INFY POD](/products/infy-pod) มีแบต 400mAh ชาร์จผ่าน USB-C และมีไฟ LED หลายสีบอกสถานะ ในกล่องมีตัวเครื่อง สาย USB-C และคู่มือ ส่วนหัวพอตเลือกแยกต่างหาก หัว [INFY PLUS](/products/pod-169) ขนาด 2.5mL เป็นหัวพอตบรรจุสำเร็จที่มีคอยล์ในตัว น้ำยาหมดแล้วก็เปลี่ยนหัวใหม่ INFY ระบุว่าใช้กับ INFY Device และ INFY Cube Box ได้ และหน้าสินค้ารวมไว้ 28 กลิ่น",
        },
        {
          heading: "INFY แบบใช้แล้วทิ้ง",
          body:
            "[INFY 20K](/products/infy-20k) เป็นพอตใช้แล้วทิ้งรุ่นพัฟเยอะของ INFY มีน้ำยามาในตัว ใช้จนหมดแล้วก็เปลี่ยนทั้งเครื่อง ร้านยืนยันความจุ 20mL และช่องลมที่ปรับได้",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "INFY เปลี่ยนหัวได้ไหม",
          answer:
            "ขึ้นอยู่กับรุ่นค่ะ [INFY POD](/products/infy-pod) เปลี่ยนหัวได้ โดยใช้หัว [INFY PLUS](/products/pod-169) ขนาด 2.5mL ส่วน [INFY 20K](/products/infy-20k) เป็นพอตใช้แล้วทิ้ง ใช้จนหมดแล้วเปลี่ยนทั้งเครื่องค่ะ",
        },
        {
          question: "หัวพอตของ INFY เติมน้ำยาเองได้ไหม",
          answer:
            "หัว [INFY PLUS](/products/pod-169) เป็นระบบปิด มีน้ำยาและคอยล์มาในหัวแล้ว ใช้หมดก็เปลี่ยนหัวใหม่ค่ะ",
        },
        {
          question: "หัวของ INFY ใส่กับเครื่องอื่นได้ไหม",
          answer:
            "INFY ระบุว่าหัว [INFY PLUS](/products/pod-169) ใช้กับ INFY Device และ INFY Cube Box ได้ค่ะ ถ้าเครื่องที่มีอยู่ใช้ชื่ออื่น ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
        {
          question: "INFY เช็คของแท้ยังไง",
          answer:
            "INFY ติดสติกเกอร์ซีเรียลไว้ที่กล่องค่ะ ขูดออกแล้วจะเจอ QR code ให้สแกน แล้วกรอกรหัสบนหน้า infy.my/authentication INFY บอกไว้ว่าสินค้าแต่ละชิ้นมีรหัสเฉพาะของตัวเอง ดูขั้นตอนเพิ่มเติมได้ที่ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) ค่ะ",
        },
      ],
    },
    en: {
      heading: "INFY on this page: what's available",
      intro:
        "The INFY products here come in two formats. One is a device you keep, changing only the prefilled pod. The other is a disposable, replaced as a whole once it runs out. Both come ready filled, so the main difference shows when the e-liquid runs out.\n\nFigures come from the spec rows on each product page. Where a line says we've confirmed something, we checked it ourselves.",
      families: [
        {
          heading: "INFY device and pods",
          body:
            "The [INFY POD](/products/infy-pod) has a 400mAh battery, USB-C charging and a multi-colored status LED. The box holds the device, a USB-C cable and a manual, and pods are chosen separately. The 2.5mL [INFY PLUS](/products/pod-169) is a prefilled pod with a built-in coil, replaced once it runs out. INFY lists it for the INFY Device and INFY Cube Box, and its product page lists 28 flavors.",
        },
        {
          heading: "INFY disposable",
          body:
            "The [INFY 20K](/products/infy-20k) is INFY's high-puff disposable. It comes filled and is replaced as a whole once it runs out. We have confirmed its 20mL capacity and adjustable airflow.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "Can INFY pods be changed?",
          answer:
            "It depends on the model. The [INFY POD](/products/infy-pod) takes the 2.5mL [INFY PLUS](/products/pod-169) pod. The [INFY 20K](/products/infy-20k) is a disposable, replaced as a whole.",
        },
        {
          question: "Can I refill an INFY pod?",
          answer:
            "The [INFY PLUS](/products/pod-169) is a closed pod, with the e-liquid and coil already inside. Fit a new one when it runs out.",
        },
        {
          question: "Do INFY pods fit other devices?",
          answer:
            "INFY lists the [INFY PLUS](/products/pod-169) for the INFY Device and INFY Cube Box. If your device has another name, message us on LINE @okm24.",
        },
        {
          question: "How do I check that INFY is genuine?",
          answer:
            "INFY puts a serial sticker on the box. Scratch it off to reveal a QR code, scan it, then enter the code at infy.my/authentication. INFY says each item has its own unique code.",
        },
      ],
    },
    zh: {
      heading: "本页 INFY 产品一览",
      intro:
        "本页的 INFY 产品分为两种：一种保留主机，只更换预注油烟弹；另一种是一次性电子烟，用完整支更换。两者出厂都已装好烟油，主要区别在烟油用完之后。\n\n数据来自各产品页的规格信息；标明“本店确认”的内容由本店自行核实。",
      families: [
        {
          heading: "INFY 主机与烟弹",
          body:
            "[INFY POD](/products/infy-pod) 电池 400mAh，USB-C 充电，配多色 LED 状态灯。盒内有主机、USB-C 线和说明书，烟弹需另选。2.5mL 的 [INFY PLUS](/products/pod-169) 是内置雾化芯的预注油烟弹，用完换新。INFY 标明可用于 INFY Device 和 INFY Cube Box，产品页列有 28 种口味。",
        },
        {
          heading: "INFY 一次性款",
          body:
            "[INFY 20K](/products/infy-20k) 是 INFY 的高口数一次性电子烟，出厂已装好烟油，用完整支更换。本店确认其容量为 20mL，进气可调。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "INFY 可以换烟弹吗？",
          answer:
            "视型号而定。[INFY POD](/products/infy-pod) 使用 2.5mL 的 [INFY PLUS](/products/pod-169) 烟弹；[INFY 20K](/products/infy-20k) 是一次性电子烟，需整支更换。",
        },
        {
          question: "INFY 烟弹可以自己加油吗？",
          answer:
            "[INFY PLUS](/products/pod-169) 是封闭式烟弹，烟油和雾化芯都已装好，用完换新即可。",
        },
        {
          question: "INFY 烟弹能用在其他主机上吗？",
          answer:
            "INFY 标明 [INFY PLUS](/products/pod-169) 可用于 INFY Device 和 INFY Cube Box。如果您的主机是其他名称，欢迎通过 LINE @okm24 咨询。",
        },
        {
          question: "如何查验 INFY 真伪？",
          answer:
            "INFY 在包装盒上贴有序列号贴纸。刮开后可看到二维码，扫描后在 infy.my/authentication 输入代码。INFY 说明每件产品都有专属代码。",
        },
      ],
    },
  },
  "esko-bar": {
    th: {
      heading: "ESKO BAR มีแบบไหนบ้าง และต่างกันตรงไหน",
      intro:
        "ESKO BAR ที่หลายคนเรียกสั้น ๆ ว่า Esko หรือพิมพ์ติดกันว่า Eskobar มีทั้งแบบใช้แล้วทิ้ง และพอตเปลี่ยนหัวที่เปลี่ยนแค่หัวพอต\n\nพอต ESKO BAR ทั้งสองแบบบนหน้านี้ระบุไว้สูงสุด 20,000 พัฟ และจุน้ำยา 18mL เท่ากัน จุดที่ต่างกันจึงอยู่ตอนน้ำยาหมด แบบแรกเปลี่ยนใหม่ทั้งเครื่อง ส่วนแบบที่สองเก็บตัวเครื่องไว้ แล้วเปลี่ยนแค่หัวพอต ตัวเลขด้านล่างเป็นตัวเลขที่ ESKO BAR ระบุไว้",
      families: [
        {
          heading: "ESKO BAR แบบใช้แล้วทิ้ง",
          body:
            "[ESKO BAR 20000](/products/esko-bar-20k) มีน้ำยามาในตัว 18mL ระบุไว้สูงสุด 20,000 พัฟ ใช้คอยล์ Dual Mesh 1.0 โอห์ม ความเข้มข้นนิโคติน 3% และแบต 600mAh ที่ชาร์จได้ ตัวเครื่องขนาด 126 × 30 × 30 mm และหน้าสินค้ารวมไว้ 22 กลิ่น",
        },
        {
          heading: "เครื่องระบบสวิตช์ของ ESKO BAR",
          body:
            "[Esko Bar Switch 20K](/products/pod-159) เก็บตัวเครื่องไว้ใช้ต่อ ตัวเครื่องแบต 850mAh กดปุ่มเดียวสลับโหมด High กับ Low ได้ และหมุนที่ก้นตัวเครื่องเพื่อปรับช่องลมได้ 3 ระดับ ส่วน [หัวพอต Esko Bar Switch](/products/esko-bar-switch-pod) ระบุไว้หัวละสูงสุด 20,000 พัฟ จุน้ำยา 18mL มีคอยล์สองตัวที่ทำงานพร้อมกัน และหน้าสินค้ารวมไว้ 20 กลิ่น",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "ESKO BAR เปลี่ยนหัวได้ไหม",
          answer:
            "ได้เฉพาะรุ่นเปลี่ยนหัวค่ะ [Esko Bar Switch 20K](/products/pod-159) ผู้ผลิตเขียนไว้ว่าเป็นหัวพอตแบบถอดเปลี่ยนได้ ตัวแบตกับถังน้ำยาแยกจากกัน อยากเปลี่ยนกลิ่นก็เปลี่ยนแค่หัว ส่วน [ESKO BAR 20000](/products/esko-bar-20k) เป็นพอตใช้แล้วทิ้ง ใช้จนหมดแล้วเปลี่ยนทั้งเครื่องค่ะ",
        },
        {
          question: "ESKO BAR กับ M Bar เป็นแบรนด์เดียวกันไหม",
          answer:
            "เป็นคนละแบรนด์ค่ะ M Bar เป็นของ SALTHUB ส่วน ESKO BAR เป็นอีกแบรนด์หนึ่ง ถ้าเทียบรุ่นเปลี่ยนหัวด้วยกัน อ่านได้ที่ [เทียบกับ M Switch](/guides/esko-bar-switch-vs-m-switch) ค่ะ",
        },
        {
          question: "พอต Esko Bar ชาร์จได้ไหม",
          answer:
            "ชาร์จได้ทั้งสองแบบค่ะ [ESKO BAR 20000](/products/esko-bar-20k) มีแบต 600mAh ที่ชาร์จได้ ส่วน [Esko Bar Switch 20K](/products/pod-159) มีแบต 850mAh ชาร์จผ่าน USB-C ที่ 5V 0.85A ค่ะ",
        },
        {
          question: "ESKO BAR เช็คของแท้ยังไง",
          answer:
            "เช็คได้ที่หน้า eskobarvape.com/verify ค่ะ ESKO BAR ใช้ระบบถ่ายรูปตัวเดียวกับ SALTHUB เปิดหน้านี้แล้วทำตามขั้นที่ขึ้นบนหน้าได้เลย ดูขั้นตอนเพิ่มเติมได้ที่ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) ค่ะ",
        },
        {
          question: "ไม่แน่ใจว่าควรเลือกแบบไหน ถามใครได้บ้าง",
          answer:
            "ถ้าอยากเก็บตัวเครื่องไว้และเปลี่ยนกลิ่นได้ง่าย รุ่นเปลี่ยนหัวจะตรงกว่า ถ้าอยากแกะแล้วใช้ได้เลย หมดแล้วเปลี่ยนใหม่ แบบใช้แล้วทิ้งจะตรงกว่าค่ะ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
      ],
    },
    en: {
      heading: "ESKO BAR formats, and how they differ",
      intro:
        "ESKO BAR, often shortened to Esko or typed as Eskobar, comes both as a disposable and as a switch-style device that changes only the pod.\n\nBoth formats here are rated at up to 20,000 puffs and hold 18mL of e-liquid, so the real difference shows when the e-liquid runs out: you replace the whole disposable, or keep the device and change the pod. The figures below are the ones ESKO BAR states.",
      families: [
        {
          heading: "ESKO BAR disposable",
          body:
            "The [ESKO BAR 20000](/products/esko-bar-20k) comes filled with 18mL of e-liquid and is rated at up to 20,000 puffs. It has a Dual Mesh 1.0Ω coil, 3% nicotine and a rechargeable 600mAh battery. It measures 126 × 30 × 30 mm, and its product page lists 22 flavors.",
        },
        {
          heading: "ESKO BAR switch device",
          body:
            "The [Esko Bar Switch 20K](/products/pod-159) is a device you keep, with an 850mAh battery, one button to switch between High and Low, and three airflow settings you turn at the base. The [Esko Bar Switch pod](/products/esko-bar-switch-pod) is rated at up to 20,000 puffs each and holds 18mL, with two coils that work together. Its product page lists 20 flavors.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "Can ESKO BAR pods be changed?",
          answer:
            "Only on the switch device. The maker describes the [Esko Bar Switch 20K](/products/pod-159) pod as replaceable, with the battery and tank separate, so a new flavor needs only a new pod. The [ESKO BAR 20000](/products/esko-bar-20k) is a disposable, replaced as a whole.",
        },
        {
          question: "Are ESKO BAR and M Bar the same brand?",
          answer:
            "They are separate brands. M Bar belongs to SALTHUB, and ESKO BAR is a brand of its own.",
        },
        {
          question: "Can ESKO BAR devices be recharged?",
          answer:
            "Yes, both formats. The [ESKO BAR 20000](/products/esko-bar-20k) has a rechargeable 600mAh battery, and the [Esko Bar Switch 20K](/products/pod-159) has an 850mAh battery that charges over USB-C at 5V 0.85A.",
        },
        {
          question: "How do I check that ESKO BAR is genuine?",
          answer:
            "Use the check page at eskobarvape.com/verify. ESKO BAR uses the same photo-check system as SALTHUB, so open the page and follow the steps shown there.",
        },
        {
          question: "Not sure which format to choose?",
          answer:
            "If you'd like to keep a device and change flavors easily, the switch device is the closer fit. If you'd rather open it, use it and replace it when it's done, the disposable is. If you're still unsure, message us on LINE @okm24.",
        },
      ],
    },
    zh: {
      heading: "ESKO BAR 有哪些形式，区别在哪里",
      intro:
        "ESKO BAR 常被简称为 Esko，也有人连写成 Eskobar，既有一次性款，也有只换烟弹的换弹式主机。\n\n本页两种形式都标称最高 20,000 口，容量同为 18mL，区别主要在烟油用完之后：一次性款整支更换，换弹式保留主机，只换烟弹。下文数据均为 ESKO BAR 标称。",
      families: [
        {
          heading: "ESKO BAR 一次性款",
          body:
            "[ESKO BAR 20000](/products/esko-bar-20k) 出厂已装好 18mL 烟油，标称最高 20,000 口，采用 Dual Mesh 1.0Ω 雾化芯，尼古丁浓度 3%，电池 600mAh，可充电。尺寸为 126 × 30 × 30 mm，产品页列有 22 种口味。",
        },
        {
          heading: "ESKO BAR 换弹式主机",
          body:
            "[Esko Bar Switch 20K](/products/pod-159) 主机留用，电池 850mAh，一键切换 High 与 Low，旋转底部可调三档进气。[Esko Bar Switch 烟弹](/products/esko-bar-switch-pod) 标称每颗最高 20,000 口，容量 18mL，内置双雾化芯同时工作，产品页列有 20 种口味。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "ESKO BAR 可以换烟弹吗？",
          answer:
            "仅限换弹式主机。厂商说明 [Esko Bar Switch 20K](/products/pod-159) 的烟弹可更换，电池与油仓相互独立，换口味只需换烟弹。[ESKO BAR 20000](/products/esko-bar-20k) 是一次性电子烟，需整支更换。",
        },
        {
          question: "ESKO BAR 和 M Bar 是同一品牌吗？",
          answer:
            "不是。M Bar 属于 SALTHUB，ESKO BAR 是另一个品牌。",
        },
        {
          question: "ESKO BAR 可以充电吗？",
          answer:
            "两种形式都可以。[ESKO BAR 20000](/products/esko-bar-20k) 采用 600mAh 可充电电池，[Esko Bar Switch 20K](/products/pod-159) 电池 850mAh，通过 USB-C 以 5V 0.85A 充电。",
        },
        {
          question: "如何查验 ESKO BAR 真伪？",
          answer:
            "请使用 eskobarvape.com/verify 验证页。ESKO BAR 采用与 SALTHUB 相同的拍照验证系统，打开页面后按提示操作即可。",
        },
        {
          question: "不确定该选哪一种？",
          answer:
            "如果想保留主机、方便换口味，换弹式更合适；如果想拆开即用、用完换新，一次性款更合适。仍不确定的话，欢迎通过 LINE @okm24 咨询。",
        },
      ],
    },
  },
  joiway: {
    th: {
      heading: "JOIWAY สองแบบบนหน้านี้ ต่างกันตรงไหน",
      intro:
        "JOIWAY หรือ Joi Way เป็นผู้ผลิตพอตใช้แล้วทิ้ง พอต JOIWAY บนหน้านี้มีสองแบบ คือรุ่นกลิ่นเดียว และรุ่นคู่กลิ่นที่มีสองกลิ่นในเครื่องเดียว ทั้งสองแบบมีน้ำยามาให้พร้อมสูบ และชาร์จซ้ำได้ผ่าน USB-C\n\nตัวเลขด้านล่างเป็นตัวเลขที่ JOIWAY ระบุไว้ และทั้งสองรุ่นมีคลิปรีวิวจาก OKami24 บน YouTube ด้วย",
      families: [
        {
          heading: "รุ่นกลิ่นเดียว",
          body:
            "[Joiway F3](/products/joiway-f3) ระบุไว้ 12,000 พัฟขึ้นไป ใช้ Nano coil ปรับช่องลมได้ และมีถังน้ำยาใสอยู่ด้านบนใต้ปากดูด จึงมองเห็นน้ำยาที่เหลือได้จากข้างนอก หน้าสินค้ารวมไว้ 31 กลิ่น",
        },
        {
          heading: "รุ่นคู่กลิ่น",
          body:
            "[Joiway F4](/products/joiway-f4) มีถังน้ำยาสองถัง ถังละ 10mL และคอยล์ mesh สองชุด หมุนปากดูดไปที่ถังไหนก็สูบกลิ่นนั้น JOIWAY ระบุไว้สูงสุด 20,000 พัฟ แบ่งเป็นฝั่งละ 10,000 พัฟ แบต 650mAh และมีจอ LED หน้าสินค้ารวมไว้ 16 คู่กลิ่น",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "JOIWAY หมุนปากดูดเปลี่ยนกลิ่นได้ทุกรุ่นไหม",
          answer:
            "ได้เฉพาะรุ่นคู่กลิ่นค่ะ [Joiway F4](/products/joiway-f4) มีสองถังในเครื่องเดียว หมุนปากดูดเพื่อสลับกลิ่นได้ ส่วน [Joiway F3](/products/joiway-f3) เป็นรุ่นกลิ่นเดียวค่ะ",
        },
        {
          question: "พอต JOIWAY เปลี่ยนหัวได้ไหม",
          answer:
            "ทั้งสองรุ่นเป็นพอตใช้แล้วทิ้งค่ะ มีน้ำยามาในตัว ใช้จนหมดแล้วเปลี่ยนใหม่ทั้งเครื่อง ถ้ากำลังมองหาเครื่องที่เปลี่ยนหัวได้ ดูได้ที่หมวด [พอตเปลี่ยนหัว](/products/switch-pods) ค่ะ",
        },
        {
          question: "พอต JOIWAY ใช้ได้นานแค่ไหน",
          answer:
            "ตัวเลขบนกล่องคือจำนวนพัฟที่ผู้ผลิตระบุค่ะ จะสูบได้ใกล้ตัวเลขนั้นแค่ไหน ขึ้นกับว่าแต่ละคนสูบถี่และดูดยาวแค่ไหน อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts) ค่ะ",
        },
        {
          question: "JOIWAY เช็คของแท้ยังไง",
          answer:
            "บทความ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) รวมหน้าเช็คของหกแบรนด์ไว้ค่ะ ส่วน JOIWAY ถามร้านได้ว่าเช็คทางไหน ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
        {
          question: "JOIWAY ราคาเท่าไหร่ สั่งซื้อยังไง",
          answer:
            "ราคาของแต่ละรุ่นดูได้ที่หน้าสินค้าของรุ่นนั้นค่ะ ส่วนขั้นตอนการสั่งอยู่ที่ [วิธีสั่งซื้อ](/how-to-order) ค่ะ",
        },
      ],
    },
    en: {
      heading: "The two JOIWAY formats here, and how they differ",
      intro:
        "JOIWAY, also written Joi Way, makes disposables. The two models here are a single-flavor device and a dual-flavor device that holds two flavors in one body. Both come ready filled and recharge over USB-C.\n\nThe figures below are the ones JOIWAY states, and OKami24 has a review clip of each on YouTube.",
      families: [
        {
          heading: "Single flavor",
          body:
            "The [Joiway F3](/products/joiway-f3) is rated at 12,000+ puffs, with a Nano coil and adjustable airflow. A clear tank sits at the top under the mouthpiece, so you can see how much e-liquid is left. Its product page lists 31 flavors.",
        },
        {
          heading: "Dual flavor",
          body:
            "The [Joiway F4](/products/joiway-f4) has two 10mL tanks and two sets of mesh coils. Turn the mouthpiece to a tank and you vape that flavor. JOIWAY rates it at up to 20,000 puffs, or 10,000 per side, with a 650mAh battery and an LED display. Its product page lists 16 flavor pairs.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "Can every JOIWAY switch flavors with the mouthpiece?",
          answer:
            "Only the dual-flavor model. The [Joiway F4](/products/joiway-f4) has two tanks in one device, and you turn the mouthpiece to switch. The [Joiway F3](/products/joiway-f3) is a single-flavor model.",
        },
        {
          question: "Can JOIWAY pods be changed?",
          answer:
            "Both models are disposables. They come filled and are replaced as a whole once they run out. Devices that take new pods are on the [Switch Pods](/products/switch-pods) page.",
        },
        {
          question: "How long does a JOIWAY last?",
          answer:
            "The number on the box is the puff count the maker states. How close you get depends on how often and how long you draw.",
        },
        {
          question: "How do I check that JOIWAY is genuine?",
          answer:
            "Ask us how to check it. Message us on LINE @okm24.",
        },
        {
          question: "How much is JOIWAY, and how do I order?",
          answer:
            "Each model's price is on its product page, and the steps are on [How to order](/how-to-order).",
        },
      ],
    },
    zh: {
      heading: "本页两款 JOIWAY，有什么不同",
      intro:
        "JOIWAY 也写作 Joi Way，生产一次性电子烟。本页两款分别是单口味款和一机双味的双口味款，出厂都已装好烟油，可通过 USB-C 充电。\n\n下文数据均为 JOIWAY 标称，两款在 YouTube 上都有 OKami24 的评测视频。",
      families: [
        {
          heading: "单口味款",
          body:
            "[Joiway F3](/products/joiway-f3) 标称 12,000 口以上，采用 Nano coil，进气可调。透明油仓位于顶部、吸嘴下方，可以直接看到剩余烟油。产品页列有 31 种口味。",
        },
        {
          heading: "双口味款",
          body:
            "[Joiway F4](/products/joiway-f4) 有两个 10mL 油仓和两组 mesh 雾化芯，吸嘴转到哪个油仓，就抽哪种口味。JOIWAY 标称最高 20,000 口，每侧 10,000 口，电池 650mAh，配 LED 显示屏。产品页列有 16 组双口味组合。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "所有 JOIWAY 都能转动吸嘴换口味吗？",
          answer:
            "只有双口味款可以。[Joiway F4](/products/joiway-f4) 一机两仓，转动吸嘴即可切换；[Joiway F3](/products/joiway-f3) 是单口味款。",
        },
        {
          question: "JOIWAY 可以换烟弹吗？",
          answer:
            "两款都是一次性电子烟，出厂已装好烟油，用完整支更换。可换烟弹的设备见 [换弹式设备](/products/switch-pods) 页面。",
        },
        {
          question: "JOIWAY 能用多久？",
          answer:
            "包装上的数字是厂商标称口数，实际能接近多少，取决于每个人抽吸的频率和时长。",
        },
        {
          question: "如何查验 JOIWAY 真伪？",
          answer:
            "可以向本店询问查验方式，欢迎通过 LINE @okm24 咨询。",
        },
        {
          question: "JOIWAY 多少钱？怎么下单？",
          answer:
            "各型号价格见对应产品页，下单步骤见 [下单方式](/how-to-order)。",
        },
      ],
    },
  },
  uwell: {
    th: {
      heading: "UWELL Caliburn แต่ละกลุ่มต่างกันตรงไหน",
      intro:
        "UWELL เป็นผู้ผลิตพอตซิสเต็มตระกูล Caliburn เครื่องตระกูลนี้เก็บตัวเครื่องไว้ใช้ต่อ เติมน้ำยาเอง และใช้หัวพอตที่มีคอยล์ในตัว พอคอยล์เสื่อมก็ใส่หัวพอตใหม่แทนทั้งหัว\n\nCaliburn บนหน้านี้จ่ายได้สูงสุด 35 วัตต์ ยกเว้น [Caliburn G3](/products/caliburn-g3) ที่สูงสุด 25 วัตต์ สิ่งที่ต่างกันจึงอยู่ที่จอกับการควบคุม ขนาดแบต การปรับช่องลม และหัวพอตที่ใช้ได้ ด้านล่างนี้จัดกลุ่มตามหน้าจอ ตัวเลขมาจากสเปกของ UWELL ถ้าอยากเทียบทีละคู่ อ่านต่อได้ที่ [เทียบ Caliburn ทีละรุ่น](/guides/comparing-caliburn-models)",
      families: [
        {
          heading: "Caliburn จอสีและจอทัช",
          body:
            "[Caliburn G5](/products/caliburn-g5) แบต 1600mAh จอสี 0.85 นิ้ว ปรับได้ 5–35 วัตต์ และแตะตัวเครื่องสามครั้งเพื่อสลับโหมด [Caliburn G4](/products/caliburn-g4) แบต 1300mAh จอสีขนาดเท่ากัน มีปุ่มเดียวไว้สั่งงาน และสูบได้ทั้งแบบดูดและกดปุ่ม [Caliburn G4 Pro](/products/caliburn-g4-pro) แบต 1800mAh จอทัช 2.51 นิ้ว ส่วน [Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko) แบต 2000mAh จอทัช 2.0 นิ้ว และ [Caliburn G3 Pro KOKO](/products/caliburn-g3-pro-koko) เป็นรุ่นทรงกล่อง แบต 1250mAh จอสี 1.8 นิ้ว",
        },
        {
          heading: "Caliburn ที่ใช้ไฟบอกแบต",
          body:
            "[Caliburn G5 Lite](/products/caliburn-g5-lite) แบต 1600mAh ใช้ไฟ LED 4 ขีดบอกระดับแบต และปรับช่องลมได้ทั้งการกลับด้านหัวพอตกับการปรับแบบไม่มีขั้น [Caliburn G5 Lite SE](/products/caliburn-g5-lite-se) คือตัวเครื่องเดิมในชุดสีหนังทูโทนผิวลายริ้ว [Caliburn G4 Classic](/products/caliburn-g4-classic) แบต 1400mAh ใช้ไฟ RGB 14 ดวงบอกแบตเป็นสีเขียว น้ำเงิน และแดง ส่วน [Caliburn G4 Mini](/products/caliburn-g4-mini) แบต 1100mAh หนักราว 46 กรัม เป็นเวอร์ชันย่อส่วนของ G4 ที่สูบด้วยการดูด",
        },
        {
          heading: "Caliburn ทรงเพรียว",
          body:
            "[Caliburn G3](/products/caliburn-g3) แบต 900mAh มีจอ OLED บอกวัตต์และจำนวนพัฟ ใช้หัวพอตของรุ่นตัวเองที่มีคอยล์ในตัว 0.6 · 0.9 และ 1.2 โอห์ม ส่วน [Caliburn G3 Pro](/products/caliburn-g3-pro) แบต 1000mAh มีจอ LCD เต็มหน้าเครื่อง นับพัฟได้ถึง 999 และปรับได้สูงสุด 35 วัตต์เมื่อใช้หัว 0.4 โอห์ม สูงสุด 25 วัตต์เมื่อใช้หัว 0.6 โอห์ม และสูงสุด 15 วัตต์เมื่อใช้หัว 0.9 โอห์ม",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "หัวพอต Caliburn ใช้ข้ามรุ่นได้ไหม",
          answer:
            "ได้ถ้าอยู่ในระบบหัวพอตเดียวกันค่ะ [หัวพอต GPP](/products/coil-94) มีคอยล์ในตัว 0.4 · 0.6 · 0.9 และ 1.2 โอห์ม ใช้ได้กับเครื่องซีรีส์ Caliburn G5 · G4 และ G3 ส่วน [Caliburn G3](/products/caliburn-g3) มีหัวพอตของรุ่นตัวเอง ก่อนซื้อ เช็คในหน้าสินค้าของเครื่องอีกครั้งนะคะ",
        },
        {
          question: "Caliburn รุ่นก่อนใช้หัวพอตและคอยล์แบบไหน",
          answer:
            "รุ่นก่อนแยกคอยล์ออกจากหัวพอตค่ะ [คอยล์ Caliburn G2](/products/coil-53) มี 0.8 · 1.0 และ 1.2 โอห์ม ใช้กับ GK2 · G2 และ X ส่วนหัวพอตเปล่า [Caliburn G2](/products/coil-55) จุ 2mL เติมด้านบน และหัวพอตเปล่า [Caliburn X](/products/coil-74) จุ 3mL ทั้งสองหัวใช้คู่กับคอยล์ Caliburn G และ G2 ได้ค่ะ",
        },
        {
          question: "Caliburn เติมน้ำยายังไง",
          answer:
            "หัวพอตของ Caliburn เติมน้ำยาเองได้ค่ะ รุ่นในซีรีส์ G4 เติมได้ทั้งที่หัวพอตยังเสียบอยู่กับเครื่อง วิธีเติมทีละขั้นอ่านได้ที่ [เติมพอตยังไง](/guides/refilling-a-pod) ค่ะ",
        },
        {
          question: "Caliburn เลือกแบบไหนดี",
          answer:
            "ขึ้นอยู่กับการใช้งานค่ะ ถ้าชอบแตะสลับโหมด ดู [Caliburn G5](/products/caliburn-g5) ถ้าชอบเครื่องที่มีปุ่มและเบากว่า ดู [Caliburn G4](/products/caliburn-g4) ถ้าอยากได้จอใหญ่ ดู [Caliburn G4 Pro](/products/caliburn-g4-pro) และถ้าอยากได้เครื่องที่เบาและเรียบง่าย ดู [Caliburn G4 Mini](/products/caliburn-g4-mini) ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
        {
          question: "UWELL เช็คของแท้ยังไง",
          answer:
            "เช็คได้ที่หน้า myuwell.com/verify ของ UWELL เองค่ะ ทางแรกคือพิมพ์รหัสลงในช่องติดกันทั้งชุด ตัดช่องว่างและขีดออก แล้วกด Submit ทางที่สองคือขูดแถบเคลือบออก แล้วสแกน QR code ที่อยู่ข้างใต้ ถ้าเป็นของแท้ หน้าเว็บจะขึ้นข้อความยืนยัน ดูขั้นตอนเพิ่มเติมได้ที่ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) ค่ะ",
        },
      ],
    },
    en: {
      heading: "UWELL Caliburn, group by group",
      intro:
        "UWELL makes the Caliburn family of Pod Systems. You keep the device, fill it yourself and use pods with a built-in coil, so when the coil wears you simply fit a fresh pod.\n\nCaliburn devices here deliver up to 35W, except the [Caliburn G3](/products/caliburn-g3) at 25W. The real differences are in the screen and controls, battery size, airflow and the pods each one takes. The guide below is grouped by display, and the figures come from UWELL's specs.",
      families: [
        {
          heading: "Color and touch screens",
          body:
            "The [Caliburn G5](/products/caliburn-g5) has a 1600mAh battery, a 0.85-inch color screen and 5–35W, and you tap the body three times to change mode. The [Caliburn G4](/products/caliburn-g4) has a 1300mAh battery, the same size of color screen and one multi-function button, and fires on the draw or the button. The [Caliburn G4 Pro](/products/caliburn-g4-pro) has 1800mAh and a 2.51-inch touchscreen, the [Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko) has 2000mAh and a 2.0-inch touchscreen, and the box-shaped [Caliburn G3 Pro KOKO](/products/caliburn-g3-pro-koko) has 1250mAh and a 1.8-inch color screen.",
        },
        {
          heading: "Battery lights",
          body:
            "The [Caliburn G5 Lite](/products/caliburn-g5-lite) has a 1600mAh battery, a 4-bar LED battery indicator, and airflow you adjust by turning the pod or with stepless control. The [Caliburn G5 Lite SE](/products/caliburn-g5-lite-se) is the same device in a dual-tone striped leather finish. The [Caliburn G4 Classic](/products/caliburn-g4-classic) has 1400mAh and 14 RGB LEDs that show the battery in green, blue and red. The [Caliburn G4 Mini](/products/caliburn-g4-mini) has 1100mAh, weighs about 46g and is a smaller G4 that fires on the draw.",
        },
        {
          heading: "Slim bodies",
          body:
            "The [Caliburn G3](/products/caliburn-g3) has a 900mAh battery and an OLED screen that shows wattage and puff count. It uses its own pods with built-in coils in 0.6, 0.9 and 1.2Ω. The [Caliburn G3 Pro](/products/caliburn-g3-pro) has 1000mAh and a full-face LCD with a puff counter up to 999. It reaches 35W with a 0.4Ω pod, 25W with 0.6Ω and 15W with 0.9Ω.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "Do Caliburn pods fit across models?",
          answer:
            "Yes, within the same pod system. [GPP pods](/products/coil-94) have built-in coils in 0.4, 0.6, 0.9 and 1.2Ω and work with the Caliburn G5, G4 and G3 series. The [Caliburn G3](/products/caliburn-g3) has its own pods as well. Check your device's product page before you buy.",
        },
        {
          question: "Which pods and coils did earlier Caliburn models use?",
          answer:
            "Earlier models keep the coil separate from the pod. [Caliburn G2 coils](/products/coil-53) come in 0.8, 1.0 and 1.2Ω and fit the GK2, G2 and X. The empty [Caliburn G2 pod](/products/coil-55) holds 2mL and fills from the top, the empty [Caliburn X pod](/products/coil-74) holds 3mL, and both work with Caliburn G and G2 coils.",
        },
        {
          question: "How do I refill a Caliburn?",
          answer:
            "Caliburn pods are made to be filled by hand. Models in the G4 series can be refilled while the pod stays in the device.",
        },
        {
          question: "Which Caliburn should I choose?",
          answer:
            "It depends on how you'll use it. If you like tap controls, look at the [Caliburn G5](/products/caliburn-g5). For a button and less weight, try the [Caliburn G4](/products/caliburn-g4). For a large screen, see the [Caliburn G4 Pro](/products/caliburn-g4-pro), and for something light and simple, the [Caliburn G4 Mini](/products/caliburn-g4-mini). If you're still unsure, message us on LINE @okm24.",
        },
        {
          question: "How do I check that UWELL is genuine?",
          answer:
            "Use UWELL's own page, myuwell.com/verify. You can type the code in one unbroken string, leaving out spaces and dashes, then press Submit. Or scratch off the coating and scan the QR code beneath it. A genuine code brings up a confirmation on the page.",
        },
      ],
    },
    zh: {
      heading: "UWELL Caliburn 分组说明",
      intro:
        "UWELL 生产 Caliburn 系列 Pod System。主机留用，烟油自行加注，烟弹内置雾化芯，雾化芯用旧了直接换一颗新烟弹。\n\n本页 Caliburn 最高输出 35W，只有 [Caliburn G3](/products/caliburn-g3) 为 25W。主要区别在于屏幕与操作、电池容量、进气调节和可用烟弹。下文按显示方式分组，数据来自 UWELL 规格信息。",
      families: [
        {
          heading: "彩屏与触控屏",
          body:
            "[Caliburn G5](/products/caliburn-g5) 电池 1600mAh，配 0.85 英寸彩屏，功率 5–35W，轻敲机身三下切换模式。[Caliburn G4](/products/caliburn-g4) 电池 1300mAh，彩屏尺寸相同，配一颗多功能按键，吸气或按键均可启动。[Caliburn G4 Pro](/products/caliburn-g4-pro) 电池 1800mAh，配 2.51 英寸触控屏；[Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko) 电池 2000mAh，配 2.0 英寸触控屏；方盒造型的 [Caliburn G3 Pro KOKO](/products/caliburn-g3-pro-koko) 电池 1250mAh，配 1.8 英寸彩屏。",
        },
        {
          heading: "灯光显示电量",
          body:
            "[Caliburn G5 Lite](/products/caliburn-g5-lite) 电池 1600mAh，以 4 格 LED 显示电量，可通过调转烟弹或无级调节控制进气。[Caliburn G5 Lite SE](/products/caliburn-g5-lite-se) 为同款机身，采用双色条纹皮革外观。[Caliburn G4 Classic](/products/caliburn-g4-classic) 电池 1400mAh，14 颗 RGB 灯以绿、蓝、红显示电量。[Caliburn G4 Mini](/products/caliburn-g4-mini) 电池 1100mAh，重约 46 克，是 G4 的小型版本，吸气即可使用。",
        },
        {
          heading: "纤细机身",
          body:
            "[Caliburn G3](/products/caliburn-g3) 电池 900mAh，OLED 屏显示功率和抽吸口数，使用专属烟弹，内置 0.6、0.9、1.2Ω 雾化芯。[Caliburn G3 Pro](/products/caliburn-g3-pro) 电池 1000mAh，配全面 LCD 屏，口数最高计至 999；使用 0.4Ω 烟弹最高 35W，0.6Ω 最高 25W，0.9Ω 最高 15W。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "Caliburn 烟弹可以跨型号通用吗？",
          answer:
            "同一烟弹系统内可以。[GPP 烟弹](/products/coil-94) 内置 0.4、0.6、0.9、1.2Ω 雾化芯，适用于 Caliburn G5、G4 和 G3 系列。[Caliburn G3](/products/caliburn-g3) 另有专属烟弹。购买前请再核对设备的产品页。",
        },
        {
          question: "早期 Caliburn 使用什么烟弹和雾化芯？",
          answer:
            "早期型号的雾化芯与烟弹分开。[Caliburn G2 雾化芯](/products/coil-53) 有 0.8、1.0、1.2Ω，适用于 GK2、G2 和 X。[Caliburn G2 空烟弹](/products/coil-55) 容量 2mL，顶部注油；[Caliburn X 空烟弹](/products/coil-74) 容量 3mL。两者都可搭配 Caliburn G 与 G2 雾化芯。",
        },
        {
          question: "Caliburn 怎么注油？",
          answer:
            "Caliburn 烟弹可自行注油。G4 系列无需取下烟弹，插在主机上即可注油。",
        },
        {
          question: "Caliburn 选哪一款？",
          answer:
            "取决于使用习惯。喜欢轻敲切换模式，可看 [Caliburn G5](/products/caliburn-g5)；想要按键且更轻，可看 [Caliburn G4](/products/caliburn-g4)；想要大屏幕，可看 [Caliburn G4 Pro](/products/caliburn-g4-pro)；想要轻巧简单，可看 [Caliburn G4 Mini](/products/caliburn-g4-mini)。仍不确定的话，欢迎通过 LINE @okm24 咨询。",
        },
        {
          question: "如何查验 UWELL 真伪？",
          answer:
            "请使用 UWELL 官方页面 myuwell.com/verify。可以连续输入完整代码，去掉空格和横线后点击 Submit；也可以刮开涂层，扫描下方的二维码。若为正品，页面会显示确认信息。",
        },
      ],
    },
  },
  iqos: {
    th: {
      heading: "ILUMA i แต่ละรุ่นต่างกันตรงไหน",
      intro:
        "IQOS เป็นแบรนด์เครื่องจ่ายความร้อนของ Philip Morris International เครื่องตระกูล ILUMA ใช้ระบบเหนี่ยวนำ SMARTCORE อุ่นยาสูบ แทนการใช้ใบมีดให้ความร้อน และใช้ได้กับบุหรี่ TEREA เท่านั้น\n\nบนหน้านี้มีตัวเครื่องสามรุ่น ซึ่งต่างกันหลัก ๆ สามเรื่อง คือจำนวนชิ้น การสูบต่อเนื่อง และจอทัชกับโหมดหยุดพัก ด้านล่างนี้สรุปไว้สั้น ๆ จากข้อมูลของ IQOS",
      families: [
        {
          heading: "แบบสองชิ้น มีจอทัช",
          body:
            "[ILUMA i](/products/iqosheet-18) และ [ILUMA i PRIME](/products/iqosheet-16) มีสองชิ้น คือ Holder ที่ใช้สูบ แบต 300mAh และ Pocket Charger แบต 2700mAh ที่ชาร์จเต็มในราว 135 นาที ทั้งสองรุ่นมีจอทัช โหมดหยุดพัก FlexPuff และ FlexBattery เหมือนกัน ส่วนที่ต่างคือ ILUMA i PRIME มีดีไซน์ที่พรีเมียมกว่า และจอแสดงข้อมูลได้ละเอียดกว่า",
        },
        {
          heading: "แบบชิ้นเดียว",
          body:
            "[ILUMA i ONE](/products/iqosheet-17) รวมทุกอย่างไว้ในเครื่องเดียว ผิวอะลูมิเนียม พกใส่กระเป๋าได้ แบต 1728mAh สูบต่อกันได้สูงสุด 20 มวน และชาร์จเต็มในราว 90 นาที เสียบบุหรี่แล้วเครื่องจะเริ่มอุ่นและหยุดเองโดยอัตโนมัติ มี FlexPuff ที่เพิ่มได้สูงสุด 4 พัฟเมื่อยาสูบในมวนยังเหลือ",
        },
        {
          heading: "บุหรี่ TEREA",
          body:
            "[TEREA](/products/iqosheet-15) มาเป็นซอง ซองละ 20 มวน และใช้ได้กับเครื่องตระกูล ILUMA เท่านั้น IQOS แบ่งกลิ่นไว้สี่กลุ่ม คือ ยาสูบคลาสสิก เมนทอล กานพลู และแคปซูล หน้าสินค้ารวมไว้ 23 กลิ่น และอ่านความต่างของแต่ละกลุ่มได้ที่ [TEREA กลิ่นไหนดี](/guides/choosing-a-terea-flavor)",
        },
      ],
      faqHeading: "คำถามที่พบบ่อย",
      faq: [
        {
          question: "IQOS คืออะไร",
          answer:
            "คือชื่อที่คนไทยใช้เรียก IQOS ของ Philip Morris International ค่ะ เป็นเครื่องจ่ายความร้อนที่อุ่นยาสูบในบุหรี่ TEREA ตัวเครื่องบนหน้านี้คือ [ILUMA i](/products/iqosheet-18) · [ILUMA i PRIME](/products/iqosheet-16) และ [ILUMA i ONE](/products/iqosheet-17) ค่ะ",
        },
        {
          question: "IQOS ILUMA ใช้บุหรี่อะไร",
          answer:
            "ILUMA i · ILUMA i PRIME และ ILUMA i ONE ใช้ได้กับบุหรี่ [TEREA](/products/iqosheet-15) เท่านั้นค่ะ ก่อนซื้อ เช็คชื่อรุ่นเครื่องให้ตรงอีกครั้งนะคะ",
        },
        {
          question: "เครื่องชิ้นเดียวกับเครื่องสองชิ้น เลือกแบบไหนดี",
          answer:
            "ถ้าอยากพกชิ้นเดียว และสูบต่อกันได้หลายมวนโดยวางชาร์จน้อยครั้ง เครื่องชิ้นเดียวจะตรงกว่าค่ะ ถ้าอยากเห็นข้อมูลบนจอและหยุดพักระหว่างสูบได้ เครื่องสองชิ้นจะตรงกว่า เทียบทีละเรื่องได้ที่ [เทียบ ILUMA สามรุ่น](/guides/iqos-iluma-i-one-vs-iluma-i) ค่ะ",
        },
        {
          question: "ชาร์จเต็มหนึ่งครั้ง สูบได้กี่มวน",
          answer:
            "[ILUMA i ONE](/products/iqosheet-17) สูบต่อกันได้สูงสุด 20 มวน ส่วน [ILUMA i](/products/iqosheet-18) กับ [ILUMA i PRIME](/products/iqosheet-16) ชาร์จเต็มหนึ่งครั้งใช้ได้สูงสุด 20 มวนค่ะ วิธีชาร์จและรีเซ็ตอ่านได้ที่ [IQOS ILUMA i รีเซ็ตยังไง](/guides/iqos-iluma-i-reset-and-charging) ค่ะ",
        },
        {
          question: "IQOS ราคาเท่าไหร่ สั่งซื้อยังไง",
          answer:
            "ราคาของแต่ละรุ่นดูได้ที่หน้าสินค้าของรุ่นนั้นค่ะ ส่วนขั้นตอนการสั่งอยู่ที่ [วิธีสั่งซื้อ](/how-to-order) ค่ะ",
        },
        {
          question: "IQOS เช็คของแท้ยังไง",
          answer:
            "บทความ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) รวมหน้าเช็คของแบรนด์พอตหกแบรนด์ไว้ค่ะ ส่วน IQOS ถามร้านได้ว่าเช็คทางไหน ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
        },
      ],
    },
    en: {
      heading: "IQOS ILUMA i models, and how they differ",
      intro:
        "IQOS is Philip Morris International's heated tobacco device brand. ILUMA devices use the SMARTCORE induction system to heat tobacco in place of a heating blade, and they work with TEREA sticks only.\n\nThe three devices here differ mainly in three ways: how many pieces they have, how long you can use them in a row, and whether they have a touchscreen and Pause Mode. This short guide is based on IQOS's information.",
      families: [
        {
          heading: "Two-piece, with touchscreen",
          body:
            "The [ILUMA i](/products/iqosheet-18) and [ILUMA i PRIME](/products/iqosheet-16) have two pieces: a 300mAh Holder you use, and a 2700mAh Pocket Charger that fully charges in about 135 minutes. Both have a touchscreen, Pause Mode, FlexPuff and FlexBattery. The ILUMA i PRIME differs in its more premium design and a screen that shows finer detail.",
        },
        {
          heading: "One-piece",
          body:
            "The [ILUMA i ONE](/products/iqosheet-17) puts everything in a single aluminum body that fits a pocket. It has a 1728mAh battery, offers up to 20 sticks in a row and fully charges in about 90 minutes. Insert a stick and it starts heating and stops on its own. FlexPuff adds up to 4 puffs when tobacco remains in the stick.",
        },
        {
          heading: "TEREA sticks",
          body:
            "[TEREA](/products/iqosheet-15) comes in packs of 20 and works with ILUMA devices only. IQOS sorts its flavors into four groups: classic tobacco, menthol, clove and capsule. The product page lists 23 flavors.",
        },
      ],
      faqHeading: "Common questions",
      faq: [
        {
          question: "What is IQOS?",
          answer:
            "IQOS is Philip Morris International's heated tobacco device brand, made to heat the tobacco in TEREA sticks. The devices on this page are the [ILUMA i](/products/iqosheet-18), [ILUMA i PRIME](/products/iqosheet-16) and [ILUMA i ONE](/products/iqosheet-17).",
        },
        {
          question: "Which sticks do IQOS ILUMA devices use?",
          answer:
            "The ILUMA i, ILUMA i PRIME and ILUMA i ONE work with [TEREA](/products/iqosheet-15) sticks only. Check your device name before you buy.",
        },
        {
          question: "One-piece or two-piece: which should I choose?",
          answer:
            "If you'd like one thing to carry and several sticks in a row with less time on the charger, the one-piece is the closer fit. If you'd like information on a screen and the option to pause, the two-piece is.",
        },
        {
          question: "How many sticks does one full charge give?",
          answer:
            "The [ILUMA i ONE](/products/iqosheet-17) offers up to 20 in a row, and the [ILUMA i](/products/iqosheet-18) and [ILUMA i PRIME](/products/iqosheet-16) support up to 20 on a full charge.",
        },
        {
          question: "How much is IQOS, and how do I order?",
          answer:
            "Each model's price is on its product page, and the steps are on [How to order](/how-to-order).",
        },
        {
          question: "How do I check that IQOS is genuine?",
          answer:
            "Ask us how to check it. Message us on LINE @okm24.",
        },
      ],
    },
    zh: {
      heading: "IQOS ILUMA i 各型号有什么不同",
      intro:
        "IQOS 是 Philip Morris International 旗下的加热烟草设备品牌。ILUMA 系列采用 SMARTCORE 感应系统加热烟草，无需加热片，并且只能搭配 TEREA 烟支使用。\n\n本页三款设备主要有三点不同：组成件数、连续使用次数，以及是否配备触控屏和暂停模式。以下内容依据 IQOS 提供的信息整理。",
      families: [
        {
          heading: "两件式，配触控屏",
          body:
            "[ILUMA i](/products/iqosheet-18) 和 [ILUMA i PRIME](/products/iqosheet-16) 由两部分组成：用于抽吸的 Holder（300mAh）和 Pocket Charger（2700mAh），后者充满约需 135 分钟。两款都配备触控屏、暂停模式、FlexPuff 和 FlexBattery。不同之处在于 ILUMA i PRIME 设计更高级，屏幕显示的信息也更细致。",
        },
        {
          heading: "一体式",
          body:
            "[ILUMA i ONE](/products/iqosheet-17) 将所有功能集于一机，铝质外壳，可放入口袋。电池 1728mAh，最多可连续使用 20 支，充满约需 90 分钟。插入烟支后设备自动开始加热，也会自动停止；FlexPuff 可在烟支内烟草尚有余量时增加最多 4 口。",
        },
        {
          heading: "TEREA 烟支",
          body:
            "[TEREA](/products/iqosheet-15) 每盒 20 支，只能搭配 ILUMA 系列设备使用。IQOS 将口味分为四组：经典烟草、薄荷、丁香和爆珠。产品页列有 23 种口味。",
        },
      ],
      faqHeading: "常见问题",
      faq: [
        {
          question: "IQOS 是什么？",
          answer:
            "IQOS 是 Philip Morris International 旗下的加热烟草设备品牌，用于加热 TEREA 烟支中的烟草。本页设备为 [ILUMA i](/products/iqosheet-18)、[ILUMA i PRIME](/products/iqosheet-16) 和 [ILUMA i ONE](/products/iqosheet-17)。",
        },
        {
          question: "IQOS ILUMA 使用什么烟支？",
          answer:
            "ILUMA i、ILUMA i PRIME 和 ILUMA i ONE 只能使用 [TEREA](/products/iqosheet-15) 烟支。购买前请再核对设备型号。",
        },
        {
          question: "一体式和两件式怎么选？",
          answer:
            "如果想只带一件设备，并减少连续使用时的充电次数，一体式更合适；如果想在屏幕上查看信息，并可在抽吸中途暂停，两件式更合适。",
        },
        {
          question: "充满一次电能抽多少支？",
          answer:
            "[ILUMA i ONE](/products/iqosheet-17) 最多可连续使用 20 支；[ILUMA i](/products/iqosheet-18) 和 [ILUMA i PRIME](/products/iqosheet-16) 充满一次最多支持 20 支。",
        },
        {
          question: "IQOS 多少钱？怎么下单？",
          answer:
            "各型号价格见对应产品页，下单步骤见 [下单方式](/how-to-order)。",
        },
        {
          question: "如何查验 IQOS 真伪？",
          answer:
            "可以向本店询问查验方式，欢迎通过 LINE @okm24 咨询。",
        },
      ],
    },
  },
};
