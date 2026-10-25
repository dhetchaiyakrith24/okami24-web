import type { ReactNode } from "react";
import { EmailLink, LineLink } from "@/components/content/ServicePage";
import { B, type ServiceCopy } from "./shared";

export interface PrivacyCopy {
  eyebrow: string;
  title: string;
  description: string;
  summary: { label: string; value: string; note: string }[];
  intro: string;
  s1: { title: string; intro: string; items: string[]; outro: string };
  s2: { title: string; items: ReactNode[]; outro: ReactNode };
  s3: { title: string; intro: string; items: string[]; outro: string };
  s4: { title: string; items: ReactNode[]; outro: ReactNode };
  s5: { title: string; p1: ReactNode; p2: ReactNode };
  s6: { title: string; intro: string; rights: string[]; how: ReactNode; details: ReactNode[] };
  s7: { title: string; body: string };
  s8: { title: string; body: string };
}

export const PRIVACY: ServiceCopy<PrivacyCopy> = {
  th: {
    eyebrow: "ข้อมูลของคุณ",
    title: "ความเป็นส่วนตัว",
    description: "เราเก็บข้อมูลอะไรของคุณบ้าง เอาไปทำอะไร และคุณขอให้ลบได้ยังไง — เขียนไว้ตรง ๆ ไม่ใช่ภาษากฎหมายให้งง",
    summary: [
      { label: "เก็บอะไร", value: "เบอร์ ชื่อผู้รับ ที่อยู่ รายการสั่งซื้อ", note: "เท่าที่จำเป็นต่อการส่งของ" },
      { label: "ใช้ทำอะไร", value: "ยืนยันตัวตน จัดส่ง ติดต่อกลับ", note: "แค่ 3 อย่างนี้" },
      { label: "ขายข้อมูลไหม", value: "ไม่ขาย ไม่แลกกับใคร", note: "ไม่มีพิกเซลโฆษณาในเว็บ" },
    ],
    intro: "หน้านี้บอกว่าเว็บ OKami24 เก็บข้อมูลอะไรของคุณจริง ๆ เอาไปทำอะไร และคุณมีสิทธิ์อะไรบ้าง เราเขียนตามที่ระบบทำจริง ไม่ได้ก๊อปนโยบายมาตรฐานมาแปะ",
    s1: {
      title: "1. ข้อมูลที่เราเก็บ",
      intro: "ตอนคุณสั่งซื้อ เราเก็บเท่าที่จำเป็นต่อการส่งของ",
      items: [
        "เบอร์มือถือที่ใช้ยืนยันตัวตน (รหัส OTP เก็บแบบเข้ารหัสทางเดียว — แม้แต่เราก็อ่านย้อนกลับไม่ได้)",
        "ชื่อผู้รับ และเบอร์ติดต่อผู้รับ",
        "ที่อยู่จัดส่ง",
        "รายการสินค้าและยอดเงินในคำสั่งซื้อ",
        "หมายเหตุการโอนที่คุณกรอกเอง (ถ้ากรอก)",
      ],
      outro: "เราไม่เก็บข้อมูลบัตรเครดิต เพราะเราไม่รับบัตรตั้งแต่แรก",
    },
    s2: {
      title: "2. คุกกี้และข้อมูลในเบราว์เซอร์",
      items: [
        <><B>คุกกี้เซสชัน</B> — จำว่าคุณล็อกอินอยู่ ตะกร้าใบไหนของใคร ไม่มีอันนี้เว็บทำงานไม่ได้</>,
        <><B>คุกกี้ภาษา</B> (okami24_locale) — จำว่าคุณเลือกภาษาไหน</>,
        <><B>ค่าจำว่ายืนยันอายุแล้ว</B> — เก็บในเครื่องคุณ จะได้ไม่ต้องกดยืนยันอายุซ้ำทุกครั้ง</>,
        <><B>รายการโปรดและรายการเปรียบเทียบ</B> — เก็บในเครื่องคุณ ไม่ได้ส่งขึ้นเซิร์ฟเวอร์</>,
      ],
      outro: <>ตอนนี้เว็บเรา <B>ไม่มี Google Analytics และไม่มีพิกเซลติดตามโฆษณา</B> เราไม่ได้ตามดูว่าคุณไปไหนต่อ</>,
    },
    s3: {
      title: "3. เอาข้อมูลไปทำอะไร",
      intro: "ใช้ 3 อย่างเท่านั้น",
      items: ["ยืนยันว่าคนสั่งเป็นคุณจริง", "จัดส่งสินค้าไปให้ถูกที่", "ติดต่อกลับเรื่องคำสั่งซื้อของคุณ"],
      outro: "ไม่ได้เอาไปทำอย่างอื่น ไม่ส่งโฆษณาไล่ตามคุณ",
    },
    s4: {
      title: "4. เราส่งข้อมูลให้ใครบ้าง",
      items: [
        <><B>บริษัทขนส่ง</B> — ชื่อผู้รับ ที่อยู่ และเบอร์ติดต่อ เพราะไม่ส่งให้เขาก็ส่งของไม่ได้</>,
        <><B>ระบบจัดการสต๊อกและคำสั่งซื้อของร้าน</B> — ใช้เตรียมของและตามสถานะ</>,
      ],
      outro: <>นอกจากนี้ไม่มี <B>เราไม่ขายข้อมูลของคุณ และไม่แลกกับใคร</B></>,
    },
    s5: {
      title: "5. เก็บไว้นานแค่ไหน",
      p1: <>เราเก็บข้อมูลคำสั่งซื้อและที่อยู่จัดส่งไว้ <B>1 ปี</B> นับจากวันที่คำสั่งซื้อเสร็จสิ้น ครบแล้วลบทิ้ง</>,
      p2: <>อยากให้ลบก่อนครบ 1 ปี ทักไลน์ <LineLink /> หรืออีเมล <EmailLink /> ได้ทุกเมื่อค่ะ</>,
    },
    s6: {
      title: "6. สิทธิ์ของคุณ",
      intro: "ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) คุณมีสิทธิ์",
      rights: ["ขอดูข้อมูลที่เรามีเกี่ยวกับคุณ", "ขอให้แก้ไขถ้าข้อมูลไม่ถูกต้อง", "ขอให้ลบข้อมูล", "ขอให้หยุดใช้ข้อมูล"],
      how: <>ใช้สิทธิ์ได้โดยส่งอีเมลมาที่ <EmailLink /> หรือทักไลน์ <LineLink /> บอกว่าต้องการอะไร แล้วแจ้งเบอร์ที่ใช้สั่งซื้อเพื่อยืนยันตัวตนค่ะ</>,
      details: [
        <><B>ผู้ควบคุมข้อมูลส่วนบุคคล</B> — ร้าน OKami24</>,
        <><B>ช่องทางเป็นทางการ</B> — อีเมล <EmailLink /> (จะทักไลน์ <LineLink /> ก่อนก็ได้ แต่เรื่องที่ต้องมีหลักฐาน ส่งอีเมลมาดีกว่า)</>,
        <><B>ไม่มีเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)</B> — ติดต่อตามช่องทางข้างบนได้เลยค่ะ</>,
      ],
    },
    s7: { title: "7. อายุผู้ใช้", body: "เว็บไซต์นี้จัดทำสำหรับผู้มีอายุ 21 ปีขึ้นไป เราไม่ตั้งใจเก็บข้อมูลของผู้ที่อายุน้อยกว่านั้น ถ้าพบว่ามีข้อมูลแบบนั้นเข้ามา เราจะลบทิ้ง" },
    s8: { title: "8. ถ้าหน้านี้มีการแก้ไข", body: "เราจะอัปเดตวันที่ท้ายหน้าทุกครั้งที่แก้ ถ้าเป็นการเปลี่ยนที่มีผลกับคุณจริง ๆ เราจะแจ้งให้ทราบค่ะ" },
  },
  en: {
    eyebrow: "Your data",
    title: "Privacy",
    description: "What we collect about you, what we do with it, and how to ask us to delete it — written plainly, not in legalese.",
    summary: [
      { label: "What we collect", value: "Phone number, recipient name, address, order details", note: "Only what’s needed to ship your order" },
      { label: "What it’s for", value: "Verifying you, shipping, getting back to you", note: "Those three things only" },
      { label: "Do we sell it?", value: "No — we don’t sell or trade it", note: "No ad pixels on this site" },
    ],
    intro: "This page sets out what the OKami24 site actually collects about you, what we do with it, and what rights you have. It’s written from what the system really does, not copied from a template policy.",
    s1: {
      title: "1. What we collect",
      intro: "When you place an order, we collect only what’s needed to get it to you.",
      items: [
        "The mobile number used to verify you (the OTP code is stored one-way hashed — not even we can read it back)",
        "The recipient’s name and contact number",
        "The shipping address",
        "The items and amounts in your order",
        "Any transfer note you type in yourself (if you add one)",
      ],
      outro: "We don’t store card details, because we don’t accept cards in the first place.",
    },
    s2: {
      title: "2. Cookies and browser storage",
      items: [
        <><B>Session cookie</B> — remembers that you’re signed in and whose cart is whose. The site can’t work without it.</>,
        <><B>Language cookie</B> (okami24_locale) — remembers which language you chose.</>,
        <><B>Age-confirmation flag</B> — stored on your own device, so you don’t have to confirm your age every time.</>,
        <><B>Favourites and comparison list</B> — stored on your own device, never sent to our server.</>,
      ],
      outro: <>Right now this site has <B>no Google Analytics and no advertising tracking pixels.</B> We’re not following where you go next.</>,
    },
    s3: {
      title: "3. What we use it for",
      intro: "Three things only.",
      items: ["Confirming that the order really is from you", "Delivering your order to the right place", "Getting back to you about your order"],
      outro: "Nothing else. We don’t chase you around with ads.",
    },
    s4: {
      title: "4. Who we share it with",
      items: [
        <><B>The courier</B> — recipient name, address and contact number, because without them the parcel can’t be delivered.</>,
        <><B>The shop’s stock and order system</B> — used to prepare your order and track its status.</>,
      ],
      outro: <>Nobody else. <B>We don’t sell your data, and we don’t trade it with anyone.</B></>,
    },
    s5: {
      title: "5. How long we keep it",
      p1: <>We keep order records and shipping addresses for <B>1 year</B> from the date the order is completed, then delete them.</>,
      p2: <>Want it deleted before the year is up? Message us on LINE <LineLink /> or email <EmailLink /> any time.</>,
    },
    s6: {
      title: "6. Your rights",
      intro: "Under Thailand’s Personal Data Protection Act (PDPA), you have the right to:",
      rights: ["Ask to see the data we hold about you", "Ask us to correct it if it’s wrong", "Ask us to delete it", "Ask us to stop using it"],
      how: <>To exercise any of these, email <EmailLink /> or message us on LINE <LineLink />, tell us what you want, and give the phone number you ordered with so we can verify it’s you.</>,
      details: [
        <><B>Data controller</B> — the OKami24 shop</>,
        <><B>Official channel</B> — email <EmailLink /> (you’re welcome to message LINE <LineLink /> first, but for anything that needs a record, email is better)</>,
        <><B>We have no Data Protection Officer (DPO)</B> — please use the channels above.</>,
      ],
    },
    s7: { title: "7. Age of users", body: "This site is intended for people aged 21 and over. We don’t set out to collect data from anyone younger, and if we find that we have, we delete it." },
    s8: { title: "8. If this page changes", body: "We update the date at the bottom of the page every time we change it. If a change actually affects you, we’ll let you know." },
  },
  zh: {
    eyebrow: "您的数据",
    title: "隐私",
    description: "我们收集您的哪些资料、拿来做什么，以及您如何要求删除 —— 直白说明，不用绕口的法律用语。",
    summary: [
      { label: "收集什么", value: "手机号、收件人姓名、地址、订单内容", note: "仅限发货所需" },
      { label: "用来做什么", value: "验证身份、发货、与您联系", note: "仅此三项" },
      { label: "会出售资料吗", value: "不出售，也不与任何人交换", note: "网站上没有广告追踪像素" },
    ],
    intro: "本页说明 OKami24 网站实际收集您的哪些资料、我们如何使用，以及您享有哪些权利。内容依据系统的真实做法撰写，不是套用模板政策。",
    s1: {
      title: "1. 我们收集的资料",
      intro: "您下单时，我们只收集发货所需的资料。",
      items: [
        "用于验证身份的手机号码（验证码以单向加密方式存储 —— 连我们自己也无法还原读取）",
        "收件人姓名和联系电话",
        "收货地址",
        "订单中的商品和金额",
        "您自行填写的转账备注（如有填写）",
      ],
      outro: "我们不存储信用卡资料，因为我们本来就不接受刷卡。",
    },
    s2: {
      title: "2. Cookie 与浏览器存储",
      items: [
        <><B>会话 Cookie</B> —— 记住您已登录的状态和购物车归属。没有它网站无法运作。</>,
        <><B>语言 Cookie</B>（okami24_locale）—— 记住您选择的语言。</>,
        <><B>年龄确认标记</B> —— 存储在您自己的设备上，这样就不必每次都重新确认年龄。</>,
        <><B>收藏与对比清单</B> —— 存储在您自己的设备上，不会上传到我们的服务器。</>,
      ],
      outro: <>目前本网站 <B>没有 Google Analytics，也没有广告追踪像素。</B>我们不会追踪您之后去了哪里。</>,
    },
    s3: {
      title: "3. 资料的用途",
      intro: "仅有三项用途。",
      items: ["确认下单的确实是您本人", "将商品准确送达", "就您的订单与您联系"],
      outro: "没有其他用途。我们不会用广告追着您跑。",
    },
    s4: {
      title: "4. 我们会把资料提供给谁",
      items: [
        <><B>快递公司</B> —— 收件人姓名、地址和联系电话，不提供的话就无法送货。</>,
        <><B>店铺的库存与订单系统</B> —— 用于备货和跟踪订单状态。</>,
      ],
      outro: <>除此之外没有其他方。<B>我们不出售您的资料，也不与任何人交换。</B></>,
    },
    s5: {
      title: "5. 保存多久",
      p1: <>订单记录和收货地址自订单完成之日起保存 <B>1 年</B>，到期后删除。</>,
      p2: <>想在一年期满前删除？随时通过 LINE <LineLink /> 或邮箱 <EmailLink /> 联系我们。</>,
    },
    s6: {
      title: "6. 您的权利",
      intro: "根据泰国《个人资料保护法》(PDPA)，您有权：",
      rights: ["要求查看我们持有的您的资料", "要求更正不正确的资料", "要求删除资料", "要求停止使用资料"],
      how: <>如需行使上述权利，请发邮件至 <EmailLink /> 或通过 LINE <LineLink /> 联系我们，说明您的需求，并提供下单时使用的手机号码以便核实身份。</>,
      details: [
        <><B>个人资料控制者</B> —— OKami24 店铺</>,
        <><B>官方渠道</B> —— 邮箱 <EmailLink />（也可以先通过 LINE <LineLink /> 联系，但需要留存凭证的事情，建议发邮件）</>,
        <><B>我们没有设置个人资料保护主任（DPO）</B> —— 请直接使用上述渠道联系。</>,
      ],
    },
    s7: { title: "7. 用户年龄", body: "本网站面向 21 岁及以上人士。我们无意收集未满该年龄者的资料，若发现有此类资料，我们会予以删除。" },
    s8: { title: "8. 本页如有修改", body: "每次修改我们都会更新页面底部的日期。如果某项修改确实会影响到您，我们会另行告知。" },
  },
};
