import type { ReactNode } from "react";
import { CONTACT } from "@/data/contact";
import { LineLink, type Step } from "@/components/content/ServicePage";
import { B, type ServiceCopy } from "./shared";

/**
 * Claims policy — still a DRAFT under /preview (owner has not ticked item 12, the accepted /
 * rejected symptom list). The "→ รับ / ไม่รับ" placeholders inside the symptom cards are the
 * owner's tick boxes and stay Thai in every language on purpose; they are replaced with real
 * wording (Covered / Not covered · 受理 / 不受理) when the owner answers.
 */
export interface ClaimsCopy {
  draftBar: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: { label: string; value: string; note: string }[];
  window: { title: string; body: ReactNode };
  video: { title: string; p1: ReactNode; p2: string };
  symptoms: { title: string; acceptTitle: string; acceptItems: string[]; declineTitle: string; declineItems: string[] };
  outcome: { title: string; p1: ReactNode; p2: string; p3: ReactNode };
  steps: { title: string; items: Step[] };
  honest: { title: string; p1: string; p2: string; p3: ReactNode };
}

const line = CONTACT.lineId;

export const CLAIMS: ServiceCopy<ClaimsCopy> = {
  th: {
    draftBar: "ร่าง — ยังไม่เผยแพร่ รอเจ้าของอ่านอนุมัติ · หน้านี้เปิดได้เฉพาะเครื่องพัฒนา ไม่มีลิงก์จากหน้าอื่น ไม่อยู่ใน sitemap",
    eyebrow: "ร่าง · ของมีปัญหา",
    title: "นโยบายเคลม",
    description: "ของมีปัญหาเคลมได้ภายใน 7 วัน ต้องมีคลิปตอนแกะกล่อง — อ่านเงื่อนไขให้ครบก่อนสั่ง",
    summary: [
      { label: "เคลมได้ภายใน", value: "7 วัน", note: `นับจากวันที่ได้รับของ · ส่งเรื่องทาง LINE ${line}` },
      { label: "ต้องมี", value: "คลิปตอนแกะกล่อง", note: "ไม่มีคลิป พิจารณาให้ไม่ได้" },
      { label: "เคลมผ่านได้", value: "ของใหม่ตัวเดิม", note: "ไม่คืนเป็นเงินสด · ตอบใน 3 วันทำการ" },
    ],
    window: { title: "เคลมได้ภายใน 7 วัน", body: <>ถ้าสินค้าที่ได้รับมีปัญหา แจ้งเราภายใน <B>7 วันนับจากวันที่ได้รับของ</B> เกินจากนี้เราพิจารณาให้ไม่ได้</> },
    video: {
      title: "ต้องมีคลิปตอนแกะกล่อง",
      p1: <><B>ถ่ายคลิปตั้งแต่ยังไม่แกะจนแกะเสร็จ ให้เห็นกล่องและตัวสินค้าต่อเนื่องในคลิปเดียว</B> ไม่มีคลิป เราพิจารณาเคลมให้ไม่ได้ — ข้อนี้ไม่มีข้อยกเว้น</>,
      p2: "เหตุผลตรง ๆ คือ ของเล็ก ของแตกง่าย และเราไม่ได้อยู่ตรงนั้นตอนคุณเปิดกล่อง คลิปคือสิ่งเดียวที่บอกได้ว่าปัญหาเกิดก่อนหรือหลังของถึงมือ เป็นนิสัยติดตัวไว้เลย ใช้เวลา 30 วินาที แต่ช่วยคุณได้ทั้งคำสั่งซื้อ",
    },
    symptoms: {
      title: "แบบไหนเคลมได้ แบบไหนไม่ได้",
      acceptTitle: "ตัวอย่างที่ร้านทั่วไปมัก “รับ”",
      acceptItems: ["ของผิดรุ่น ผิดสี ผิดกลิ่น จากที่สั่ง → รับ / ไม่รับ", "เครื่องเสียตั้งแต่แกะ กดไม่ติด ชาร์จไม่เข้า → รับ / ไม่รับ", "น้ำยารั่ว ซึม ในสภาพยังไม่ได้ใช้ → รับ / ไม่รับ"],
      declineTitle: "ตัวอย่างที่ร้านทั่วไปมัก “ไม่รับ”",
      declineItems: ["กล่องบุบ แต่ของใช้ได้ปกติ → รับ / ไม่รับ", "ตกหล่น โดนน้ำ ใช้งานผิดวิธี → รับ / ไม่รับ", "ใช้ไปแล้วสักพักแล้วเสีย → รับ / ไม่รับ (ถ้ารับ กี่วัน)", "ไม่ชอบ เปลี่ยนใจ อยากเปลี่ยนกลิ่น → รับ / ไม่รับ"],
    },
    outcome: {
      title: "เคลมแล้วได้อะไร",
      p1: <B>เคลมผ่าน เราส่งของใหม่ตัวเดิมไปให้</B>,
      p2: "ถ้าตัวนั้นหมดสต๊อกพอดี เปลี่ยนเป็นตัวอื่นราคาเท่ากันให้เลือก",
      p3: <><B>เราไม่คืนเป็นเงินสด ทุกกรณี</B> — บอกไว้ตรงนี้ตั้งแต่แรก จะได้ไม่ต้องมาเถียงกันทีหลัง</>,
    },
    steps: {
      title: "ขั้นตอนเคลม",
      items: [
        { title: "ทักไลน์ภายใน 7 วันหลังได้รับของ", body: <>ทักไลน์ <LineLink /> ระบุว่าต้องการเคลม</> },
        { title: "ส่งหลักฐาน", body: "เลขคำสั่งซื้อ + คลิปตอนแกะกล่อง + รูปหรือคลิปอาการที่เป็น" },
        { title: "รอแอดมินพิจารณา ไม่เกิน 3 วันทำการ", body: "ได้คำตอบทางไลน์ว่าเคลมผ่านหรือไม่ผ่าน และเพราะอะไร" },
        { title: "เคลมผ่าน ส่งของกลับมาให้เรา", body: "ต้องส่งของกลับทุกกรณี แอดมินแจ้งที่อยู่ให้ทางไลน์ตอนที่เคลมผ่านแล้ว ไม่ต้องส่งไปก่อน แพ็กให้แน่นเหมือนตอนที่ได้รับ" },
        { title: "ค่าส่ง — ขากลับคุณออก ขาไปใหม่เราออก", body: "ค่าส่งของกลับมาหาเรา ลูกค้าออกเอง ส่วนของใหม่ที่เราส่งไปให้ เราออกค่าส่งเอง ไม่คิดเพิ่ม" },
      ],
    },
    honest: {
      title: "เราจะไม่สัญญาเกินที่ทำได้",
      p1: "เราไม่รับเคลมทุกกรณีแบบไม่มีเงื่อนไข และไม่บอกว่า “รับประกันตลอดชีพ”",
      p2: "สิ่งที่เรารับปากได้คือ ถ้าของมีปัญหาจริงและคุณมีคลิปแกะกล่อง เราจะดูให้และตอบคุณตรง ๆ ว่าทำอะไรให้ได้บ้าง",
      p3: <><B>สินค้าที่เราขายไม่มีประกันจากโรงงาน</B> เคลมได้กับร้านเราตามเงื่อนไขหน้านี้เท่านั้น</>,
    },
  },
  en: {
    draftBar: "Draft — not published, awaiting the owner’s review and approval · this page only opens on a development machine, is not linked from anywhere, and is not in the sitemap",
    eyebrow: "Draft · Faulty items",
    title: "Claims policy",
    description: "Faulty items can be claimed within 7 days, and an unboxing video is required — read the conditions in full before you order.",
    summary: [
      { label: "Claim window", value: "7 days", note: `From the day you receive it · submit on LINE ${line}` },
      { label: "Required", value: "An unboxing video", note: "Without it we can’t consider the claim" },
      { label: "If approved", value: "A new unit of the same item", note: "No cash refunds · answer within 3 working days" },
    ],
    window: { title: "Claim within 7 days", body: <>If there’s a problem with what you received, tell us within <B>7 days of the date you received it.</B> After that we can’t consider the claim.</> },
    video: {
      title: "An unboxing video is required",
      p1: <><B>Film from before you open the parcel until it’s fully unpacked, showing the box and the product continuously in one single video.</B> Without that video we can’t consider a claim — there are no exceptions to this.</>,
      p2: "The plain reason: these items are small and break easily, and we’re not there when you open the box. The video is the only thing that can show whether the problem happened before or after the parcel reached you. Make it a habit — it takes 30 seconds and it can save your whole order.",
    },
    symptoms: {
      title: "What’s covered and what isn’t",
      acceptTitle: "Examples most shops usually “accept”",
      acceptItems: ["Wrong model, wrong colour or wrong flavour from what you ordered → รับ / ไม่รับ", "Dead on arrival — won’t switch on, won’t charge → รับ / ไม่รับ", "E-liquid leaking or seeping while still unused → รับ / ไม่รับ"],
      declineTitle: "Examples most shops usually “decline”",
      declineItems: ["Dented box, but the product works fine → รับ / ไม่รับ", "Dropped, water damage, or misuse → รับ / ไม่รับ", "Breaks after you’ve been using it for a while → รับ / ไม่รับ (ถ้ารับ กี่วัน)", "Don’t like it, changed your mind, want a different flavour → รับ / ไม่รับ"],
    },
    outcome: {
      title: "What you get if a claim is approved",
      p1: <B>If the claim is approved, we send you a new unit of the same item.</B>,
      p2: "If that item happens to be out of stock, you can pick something else at the same price.",
      p3: <><B>We don’t give cash refunds, in any case</B> — we say so up front so there’s nothing to argue about later.</>,
    },
    steps: {
      title: "How to make a claim",
      items: [
        { title: "Message us on LINE within 7 days of receiving it", body: <>Message LINE <LineLink /> and say you want to make a claim.</> },
        { title: "Send your evidence", body: "Your order number + the unboxing video + a photo or video of the fault." },
        { title: "An admin reviews it, within 3 working days", body: "You get an answer on LINE saying whether the claim is approved or not, and why." },
        { title: "If approved, send the item back to us", body: "The item always has to come back. An admin sends you the address on LINE once the claim is approved — don’t send it before that. Pack it as securely as it arrived." },
        { title: "Shipping — you pay to send it back, we pay to send the replacement", body: "You cover the cost of sending the item back to us. We cover the shipping on the replacement we send you, at no extra charge." },
      ],
    },
    honest: {
      title: "We won’t promise more than we can do",
      p1: "We don’t accept every claim unconditionally, and we don’t claim to offer a “lifetime warranty”.",
      p2: "What we can promise: if the item genuinely has a problem and you have the unboxing video, we’ll look into it and tell you straight what we can do.",
      p3: <><B>The products we sell come with no manufacturer’s warranty.</B> Claims are made with our shop only, under the conditions on this page.</>,
    },
  },
  zh: {
    draftBar: "草稿 —— 尚未发布，等待店主阅读并批准 · 本页仅在开发环境可打开，没有任何页面链接到它，也不在 sitemap 中",
    eyebrow: "草稿 · 商品有问题",
    title: "售后政策",
    description: "商品有问题可在 7 天内申请售后，必须提供开箱视频 —— 下单前请完整阅读条件。",
    summary: [
      { label: "售后期限", value: "7 天", note: `自收货当日起算 · 通过 LINE ${line} 提交` },
      { label: "必须提供", value: "开箱视频", note: "没有视频我们无法受理" },
      { label: "审核通过后", value: "同款商品新品", note: "不退现金 · 3 个工作日内答复" },
    ],
    window: { title: "请在 7 天内申请售后", body: <>如果收到的商品有问题，请在 <B>收货之日起 7 天内</B> 告知我们。超过期限我们无法受理。</> },
    video: {
      title: "必须有开箱视频",
      p1: <><B>从还没拆封一直拍到拆完，在同一段视频里连续拍到包装盒和商品。</B>没有视频我们无法受理售后 —— 这一条没有例外。</>,
      p2: "原因很直接：商品体积小、容易损坏，而您开箱时我们不在场。视频是唯一能说明问题发生在收货之前还是之后的凭证。请养成习惯，只要 30 秒，却能保住您整笔订单。",
    },
    symptoms: {
      title: "哪些情况受理，哪些不受理",
      acceptTitle: "一般店铺通常「受理」的例子",
      acceptItems: ["型号、颜色或口味与所下订单不符 → รับ / ไม่รับ", "拆封即故障 —— 无法开机、无法充电 → รับ / ไม่รับ", "未使用状态下出现漏油、渗液 → รับ / ไม่รับ"],
      declineTitle: "一般店铺通常「不受理」的例子",
      declineItems: ["包装盒有凹陷，但商品使用正常 → รับ / ไม่รับ", "摔落、进水、使用方式不当 → รับ / ไม่รับ", "使用一段时间后损坏 → รับ / ไม่รับ (ถ้ารับ กี่วัน)", "不喜欢、改变主意、想换口味 → รับ / ไม่รับ"],
    },
    outcome: {
      title: "售后通过后能得到什么",
      p1: <B>售后通过，我们会寄一件同款新品给您。</B>,
      p2: "如果该商品刚好缺货，可以另选一件同价位的商品。",
      p3: <><B>任何情况下我们都不退现金</B> —— 事先在这里说清楚，免得日后争执。</>,
    },
    steps: {
      title: "售后流程",
      items: [
        { title: "收货后 7 天内通过 LINE 联系我们", body: <>通过 LINE <LineLink /> 联系我们，说明要申请售后。</> },
        { title: "提交凭证", body: "订单编号 + 开箱视频 + 故障情况的照片或视频。" },
        { title: "管理员审核，不超过 3 个工作日", body: "我们会在 LINE 上答复售后是否通过，以及原因。" },
        { title: "通过后，把商品寄回给我们", body: "任何情况下都需要寄回商品。售后通过后，管理员会在 LINE 上告知地址 —— 请不要提前寄出。请像收到时那样包装牢固。" },
        { title: "运费 —— 寄回由您承担，新品寄出由我们承担", body: "把商品寄回给我们的运费由客户自付；我们寄出的新品运费由我们承担，不另收费。" },
      ],
    },
    honest: {
      title: "我们不会承诺做不到的事",
      p1: "我们不会无条件受理所有售后，也不会宣称提供「终身保修」。",
      p2: "我们能承诺的是：如果商品确实有问题，而您有开箱视频，我们会认真查看，并直接告诉您我们能做什么。",
      p3: <><B>我们销售的商品没有原厂保修。</B>售后仅能依据本页条件向本店申请。</>,
    },
  },
};
