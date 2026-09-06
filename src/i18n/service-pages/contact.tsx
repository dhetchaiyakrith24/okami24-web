import type { ReactNode } from "react";
import { CONTACT } from "@/data/contact";
import { B, type ServiceCopy } from "./shared";

export interface ContactCopy {
  eyebrow: string;
  title: string;
  description: string;
  lineCta: string;
  youtubeCta: string;
  channelsTitle: string;
  lineCardTitle: string;
  lineCard1: string;
  lineCardHours: ReactNode;
  emailCardTitle: string;
  emailCard1: string;
  emailCard2: string;
  youtubeCardTitle: string;
  youtubeCard1: string;
  orderCardTitle: string;
  orderCard1: string;
  orderCard2: string;
  orderCardLink: string;
  prepareTitle: string;
  prepareIntro: ReactNode;
  prepareItems: string[];
  prepareOutro: string;
  sellerTitle: string;
  seller: { shop: string; officialLabel: string; quickLabel: string };
}

const line = CONTACT.lineId;

export const CONTACT_PAGE: ServiceCopy<ContactCopy> = {
  th: {
    eyebrow: "ช่องทางติดต่อ",
    title: "ติดต่อเรา",
    description: "มีเรื่องอยากถาม อยากให้ช่วยเลือกรุ่น หรือตามคำสั่งซื้อ ทักมาได้เลย แอดมินตอบเอง",
    lineCta: `ทักไลน์ ${line}`,
    youtubeCta: "YouTube @OKMYARZ",
    channelsTitle: "ช่องทางของเรา",
    lineCardTitle: `LINE ${line} — ช่องทางหลัก`,
    lineCard1: "สอบถามสินค้า เช็คสต๊อก ให้ช่วยเลือกรุ่น ติดตามคำสั่งซื้อ ส่งสลิป แจ้งปัญหา คุยได้หมดทางนี้",
    lineCardHours: <><B>ทักได้ทุกวัน ตลอด 24 ชั่วโมง</B> ไม่มีวันหยุด — คนตอบ ไม่ใช่บอท ดึก ๆ อาจช้าหน่อยแต่ได้คำตอบแน่นอน</>,
    emailCardTitle: "อีเมล — เรื่องเอกสารและข้อมูลส่วนบุคคล",
    emailCard1: "ช่องทางเป็นทางการของร้าน ใช้สำหรับเรื่องเอกสาร เรื่องข้อมูลส่วนบุคคล และเรื่องที่ต้องมีหลักฐานเป็นลายลักษณ์อักษร",
    emailCard2: "เรื่องสั่งของ ตามของ ส่งสลิป ทักไลน์เร็วกว่า",
    youtubeCardTitle: "YouTube @OKMYARZ — ดูของจริงก่อนตัดสินใจ",
    youtubeCard1: "รีวิวสินค้าจากเราเอง อยากเห็นตัวจริงก่อนสั่ง เข้าไปดูได้",
    orderCardTitle: "สั่งซื้อ — เว็บเป็นทางหลัก ไลน์เป็นทางสำรอง",
    orderCard1: "เลือกสินค้าใส่ตะกร้าแล้วกดสั่งได้เลย ไม่ต้องทักมาก่อน ระบบออกเลขคำสั่งซื้อและหน้าสถานะให้ติดตามเอง",
    orderCard2: "ไม่ถนัดสั่งบนเว็บ ทักสั่งทางไลน์ได้ แอดมินเปิดคำสั่งซื้อให้แล้วส่งลิงก์หน้าสถานะกลับไป",
    orderCardLink: "ดูวิธีสั่งซื้อทีละขั้น →",
    prepareTitle: "ก่อนทักมา เตรียมอะไร",
    prepareIntro: <>ถ้าเป็นเรื่องคำสั่งซื้อที่สั่งไว้แล้ว <B>ส่งเลขคำสั่งซื้อมาด้วย</B> จะเช็คให้ได้เร็วที่สุด</>,
    prepareItems: ["ตามของ / ถามสถานะ → เลขคำสั่งซื้อ", "ส่งสลิป → เลขคำสั่งซื้อ + รูปสลิป", "แจ้งของมีปัญหา → เลขคำสั่งซื้อ + คลิปตอนแกะกล่อง"],
    prepareOutro: "ถ้าเป็นเรื่องถามสินค้าเฉย ๆ ทักมาได้เลย ไม่ต้องเตรียมอะไร",
    sellerTitle: "ข้อมูลผู้ขาย",
    seller: { shop: "ร้าน OKami24", officialLabel: "ช่องทางเป็นทางการ อีเมล", quickLabel: "ช่องทางคุยเร็ว LINE" },
  },
  en: {
    eyebrow: "Get in touch",
    title: "Contact",
    description: "Got a question, want help picking a model, or chasing an order? Message us — an admin answers personally.",
    lineCta: `Message us on LINE ${line}`,
    youtubeCta: "YouTube @OKMYARZ",
    channelsTitle: "How to reach us",
    lineCardTitle: `LINE ${line} — our main channel`,
    lineCard1: "Product questions, stock checks, help choosing a model, order updates, sending a slip, reporting a problem — all of it works here.",
    lineCardHours: <><B>Message us any day, 24 hours,</B> with no days off — a real person replies, not a bot. Late at night it may take a little longer, but you’ll get an answer.</>,
    emailCardTitle: "Email — paperwork and personal data",
    emailCard1: "The shop’s official channel, for paperwork, personal-data matters, and anything that needs a written record.",
    emailCard2: "For orders, tracking and sending slips, LINE is faster.",
    youtubeCardTitle: "YouTube @OKMYARZ — see the real thing before you decide",
    youtubeCard1: "Our own product reviews. If you want to see a product for real before ordering, take a look.",
    orderCardTitle: "Ordering — the site is the main way, LINE is the backup",
    orderCard1: "Add what you want to the cart and place the order — no need to message us first. You get an order number and a status page to follow it yourself.",
    orderCard2: "If ordering on the site isn’t for you, order on LINE instead — an admin creates the order and sends back the link to your status page.",
    orderCardLink: "See how to order, step by step →",
    prepareTitle: "What to have ready before you message",
    prepareIntro: <>If it’s about an order you’ve already placed, <B>send your order number</B> — that’s the fastest way for us to check it.</>,
    prepareItems: ["Tracking or status question → your order number", "Sending a payment slip → your order number + a photo of the slip", "Reporting a faulty item → your order number + your unboxing video"],
    prepareOutro: "If you just want to ask about a product, message us — nothing to prepare.",
    sellerTitle: "Seller details",
    seller: { shop: "OKami24", officialLabel: "official channel: email", quickLabel: "quickest channel: LINE" },
  },
  zh: {
    eyebrow: "联系方式",
    title: "联系我们",
    description: "有问题想问、想让我们帮忙选型号，或者要跟进订单，随时联系我们，由管理员本人回复。",
    lineCta: `LINE 联系我们 ${line}`,
    youtubeCta: "YouTube @OKMYARZ",
    channelsTitle: "我们的渠道",
    lineCardTitle: `LINE ${line} —— 主要渠道`,
    lineCard1: "咨询商品、查库存、帮您选型号、跟进订单、发送转账凭证、反映问题 —— 这些都可以在这里沟通。",
    lineCardHours: <><B>每天 24 小时都可以联系我们</B>，全年无休 —— 回复的是真人，不是机器人。深夜可能稍慢一些，但一定会有回复。</>,
    emailCardTitle: "邮箱 —— 文件与个人资料事宜",
    emailCard1: "店铺的官方渠道，用于文件、个人资料相关事宜，以及需要书面记录的事情。",
    emailCard2: "下单、查件、发送转账凭证，用 LINE 更快。",
    youtubeCardTitle: "YouTube @OKMYARZ —— 下单前先看看实物",
    youtubeCard1: "我们自己拍的商品评测。想在下单前看看实物，可以去看看。",
    orderCardTitle: "下单 —— 网站是主要渠道，LINE 是备用渠道",
    orderCard1: "选好商品加入购物车直接下单，不用先联系我们。系统会生成订单编号和状态页，方便您自行跟踪。",
    orderCard2: "如果不习惯在网站下单，也可以通过 LINE 下单 —— 管理员会为您建立订单，并把状态页链接发回给您。",
    orderCardLink: "查看详细下单步骤 →",
    prepareTitle: "联系前请准备什么",
    prepareIntro: <>如果是已下单的订单相关问题，<B>请附上订单编号</B>，我们查起来最快。</>,
    prepareItems: ["查件 / 询问状态 → 订单编号", "发送转账凭证 → 订单编号 + 凭证截图", "反映商品有问题 → 订单编号 + 开箱视频"],
    prepareOutro: "如果只是想咨询商品，直接联系我们即可，不用准备什么。",
    sellerTitle: "卖家信息",
    seller: { shop: "OKami24 店铺", officialLabel: "官方渠道：邮箱", quickLabel: "快速沟通渠道：LINE" },
  },
};
