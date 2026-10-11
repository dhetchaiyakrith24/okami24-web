import type { ReactNode } from "react";
import type { Step, StepImage } from "@/components/content/ServicePage";
import { ScreenMock, type MockRow } from "@/components/content/ScreenMock";
import { B, type ServiceCopy } from "./service-pages/shared";

/**
 * Copy of the "can't open the website" DNS help page — v2 (owner 11/10: mobile first, grouped as "in Settings, no app" ·
 * "1.1.1.1 app" · "computer"; more inviting; Chrome dropped). Rendered by DnsGuideContent. Every step, menu label and
 * network line comes from docs/cloud-results/dns-guide-sources.md: official help pages, or the owner's own iPhone
 * screenshots (Thai iOS, 11/10) and his 4G test of the 1.1.1.1 app. Bold = an on-screen label. Drawn screens
 * (ScreenMock) only use labels from those pages; anything unconfirmed is a grey bar, never invented text. Wording:
 * thai-copy 11/10 (th first; en/zh add nothing the Thai does not say; zh keeps English UI labels in quotes because
 * Chinese UI labels are unverified). Title + dek live in guides-copy.ts / guides.ts.
 */

/** A value the reader types — mono, full colour. */
function V({ children }: { children: ReactNode }) {
  return <span className="font-mono text-foreground">{children}</span>;
}

/** Words that must stay on one line at 390 / 1440 (scripts/wordbreak-scan.js + a read of the shots) — a span, not an
 *  invisible character (raw U+00A0 / U+2060 in source fails scripts/thai-raw-chars-check.js). */
function N({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

type Device = "iPhone" | "Android" | "Mac" | "Windows";

export interface DnsMethodCopy {
  /** Anchor of the method; `alias` keeps v1 links (#iphone, #android, #computer…) landing on the right block. */
  id: string;
  alias?: string;
  device: Device;
  title: string;
  /** `everywhere` = confirmed for mobile data AND Wi-Fi (green dot); otherwise a scope line (steel dot). */
  network: { everywhere: boolean; text: string };
  /** A pointer to the better way for some readers (e.g. iPhone on mobile data → the app). */
  cross?: { label: string; href: string };
  /** "Illustration" line for methods drawn with ScreenMock. */
  caption?: string;
  intro?: ReactNode;
  steps: Step[];
  note?: ReactNode;
  undo?: ReactNode;
  undoImage?: StepImage;
  sources: { label: string; href: string }[];
}

export interface DnsGroupCopy {
  id: string;
  chip: string;
  chipSub: string;
  title: string;
  lead: string;
  methods: DnsMethodCopy[];
}

export interface DnsGuideCopy {
  lead: ReactNode;
  intro: ReactNode;
  jumpLabel: string;
  backToChoice: string;
  sourceLabel: string;
  groups: DnsGroupCopy[];
  afterTitle: string;
  afterBody: string;
  lineCta: string;
}

const SRC = {
  androidTh: { label: "Android Help", href: "https://support.google.com/android/answer/9654714?hl=th" },
  android: { label: "Android Help", href: "https://support.google.com/android/answer/9654714" },
  googleDns: { label: "Google Public DNS", href: "https://developers.google.com/speed/public-dns/docs/using" },
  cloudflareAndroid: { label: "Cloudflare", href: "https://developers.cloudflare.com/1.1.1.1/setup/android/" },
  cloudflareIos: { label: "Cloudflare", href: "https://developers.cloudflare.com/1.1.1.1/setup/ios/" },
  appleTh: { label: "Apple Support", href: "https://support.apple.com/th-th/guide/mac-help/mh14127/mac" },
  apple: { label: "Apple Support", href: "https://support.apple.com/guide/mac-help/change-dns-settings-on-mac-mh14127/mac" },
  microsoftTh: { label: "Microsoft Support", href: "https://support.microsoft.com/th-th/windows/essential-network-settings-and-tasks-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9" },
  microsoft: { label: "Microsoft Support", href: "https://support.microsoft.com/en-us/windows/essential-network-settings-and-tasks-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9" },
};

/** The app's official site (verified source, and the 2nd Google result on the owner's phone 11/10 — linked directly
 *  instead of "pick the 2nd result", which moves). */
function Ext() {
  return (
    <a href="https://one.one.one.one/" target="_blank" rel="noopener noreferrer nofollow" className="whitespace-nowrap font-medium text-foreground underline decoration-foreground-dim underline-offset-4 transition-colors hover:text-ember hover:decoration-ember">
      one.one.one.one
    </a>
  );
}

/** The owner's own iPhone screenshots (Thai iOS, 11/10; originals in _incoming/dns-shots/), cropped by
 *  _incoming/dns-round/crop-*.js to the strip that is tapped — no status bar, no name or photo, no neighbours' Wi-Fi,
 *  no IP addresses, home Wi-Fi name blurred. One set for every language; only the alt text is translated. */
type Alt = Record<"th" | "en" | "zh", string>;
const shot = (file: string, height: number, alt: Alt) => {
  const base = { src: `/assets/guides/dns/${file}`, width: 560, height };
  return { th: { ...base, alt: alt.th }, en: { ...base, alt: alt.en }, zh: { ...base, alt: alt.zh } };
};
const SHOT = {
  site: shot("iphone-1-site-v3.webp", 398, { th: "หน้าเว็บ one.one.one.one ที่มีปุ่ม App Store", en: "The one.one.one.one website with its App Store button", zh: "one.one.one.one 网站及其 App Store 按钮" }),
  get: shot("iphone-2-get-v2.webp", 195, { th: "แอป 1.1.1.1: Faster Internet ใน App Store กับปุ่มรับ", en: "1.1.1.1: Faster Internet in the App Store with the Get button", zh: "App Store 中的 1.1.1.1: Faster Internet 与获取按钮" }),
  accept: shot("iphone-3-accept-v3.webp", 216, { th: "ปุ่ม Accept ในแอป 1.1.1.1", en: "The Accept button in the 1.1.1.1 app", zh: "1.1.1.1 应用中的 Accept 按钮" }),
  switch: shot("iphone-4-switch-v2.webp", 249, { th: "สวิตช์ WARP สีส้มในแอป 1.1.1.1", en: "The orange WARP switch in the 1.1.1.1 app", zh: "1.1.1.1 应用中的橙色 WARP 开关" }),
  disable: shot("iphone-undo-disable-v2.webp", 388, { th: "เมนูปิด 1.1.1.1 ที่มีปุ่ม Disable", en: "The 1.1.1.1 turn-off menu with the Disable button", zh: "1.1.1.1 的关闭菜单与 Disable 按钮" }),
  wifi1: shot("iphone-wifi-1-settings.webp", 210, { th: "หน้าการตั้งค่าของ iPhone ที่มีแถว Wi-Fi", en: "iPhone Settings with the Wi-Fi row", zh: "iPhone 设置中的 Wi-Fi 一栏" }),
  wifi2: shot("iphone-wifi-2-info.webp", 82, { th: "Wi-Fi ที่ต่ออยู่กับปุ่ม ⓘ", en: "The connected Wi-Fi with its ⓘ button", zh: "已连接的 Wi-Fi 及其 ⓘ 按钮" }),
  wifi3: shot("iphone-wifi-3-dns.webp", 118, { th: "แถวกำหนดค่า DNS", en: "The Configure DNS row", zh: "配置 DNS 一栏" }),
  wifi4: shot("iphone-wifi-4-manual-v2.webp", 480, { th: "หน้ากำหนดค่า DNS ที่เลือกกำหนดเอง มีเซิร์ฟเวอร์ 8.8.8.8 และ 8.8.4.4", en: "Configure DNS set to Manual with servers 8.8.8.8 and 8.8.4.4", zh: "配置 DNS 设为手动，服务器为 8.8.8.8 和 8.8.4.4" }),
};

/** Drawn screens — labels exactly as the official pages give them (sources doc). th = Thai UI; en/zh = English UI. */
type UiLang = "th" | "en";
const UI = {
  th: { settings: "การตั้งค่า", network: "เครือข่ายและอินเทอร์เน็ต", privateDns: "DNS ส่วนตัว", off: "ปิด", auto: "อัตโนมัติ", hostname: <>ชื่อโฮสต์ของผู้ให้บริการ <N>DNS ส่วนตัว</N></>, save: "บันทึก", sysSettings: "การตั้งค่าระบบ", macNetwork: "เครือข่าย", details: "รายละเอียด", dnsServers: "เซิร์ฟเวอร์ DNS", winNetwork: "เครือข่าย & อินเทอร์เน็ต", preferred: "DNS ที่ต้องการ", alternate: "DNS สำรอง", doh: "DNS ผ่าน HTTPS", dohOn: "เปิด (เทมเพลตอัตโนมัติ)" },
  en: { settings: "Settings", network: "Network & internet", privateDns: "Private DNS", off: "Off", auto: "Automatic", hostname: "Private DNS provider hostname", save: "Save", sysSettings: "System Settings", macNetwork: "Network", details: "Details", dnsServers: "DNS Servers", winNetwork: "Network & internet", preferred: "Preferred DNS", alternate: "Alternate DNS", doh: "DNS over HTTPS", dohOn: "On (automatic template)" },
} as const;

const mocks = (l: UiLang, alt: (k: string) => string) => {
  const u = UI[l];
  const lang = l === "en" ? "en" : undefined;
  const m = (title: string, rows: MockRow[], key: string, kind: "phone" | "window" = "phone") => <ScreenMock title={title} rows={rows} ariaLabel={alt(key)} kind={kind} lang={lang} />;
  return {
    and1: m(u.settings, [{ kind: "bar" }, { kind: "nav", label: u.network, hi: true }, { kind: "bar" }], "and1"),
    and2: m(u.network, [{ kind: "bar" }, { kind: "bar" }, { kind: "nav", label: u.privateDns, hi: true }], "and2"),
    and3: m(u.privateDns, [{ kind: "radio", label: u.off }, { kind: "radio", label: u.auto }, { kind: "radio", label: u.hostname, on: true }, { kind: "input", value: "dns.google", hi: true }, { kind: "button", label: u.save }], "and3"),
    warp: m("1.1.1.1", [{ kind: "switch", label: "WARP", sub: "Connected", on: true, hi: true }], "warp"),
    mac1: m(u.sysSettings, [{ kind: "bar" }, { kind: "nav", label: u.macNetwork, hi: true }, { kind: "bar" }], "mac1", "window"),
    mac2: m(u.macNetwork, [{ kind: "nav", label: "Wi-Fi" }, { kind: "button", label: u.details, hi: true }], "mac2", "window"),
    mac4: m("DNS", [{ kind: "list", label: u.dnsServers, items: ["8.8.8.8", "8.8.4.4"], plus: true, hi: true }], "mac4", "window"),
    win1: m(u.settings, [{ kind: "bar" }, { kind: "nav", label: u.winNetwork, hi: true }, { kind: "bar" }], "win1", "window"),
    win4: m("Wi-Fi", [{ kind: "switch", label: "IPv4", on: true }, { kind: "input", label: u.preferred, value: "8.8.8.8", hi: true }, { kind: "input", label: u.alternate, value: "8.8.4.4" }, { kind: "nav", label: u.doh, value: u.dohOn }, { kind: "button", label: u.save }], "win4", "window"),
  };
};

const MOCK_ALT: Record<"th" | "en" | "zh", Record<string, string>> = {
  th: {
    and1: "ภาพประกอบ หน้าการตั้งค่าของ Android แตะเครือข่ายและอินเทอร์เน็ต",
    and2: "ภาพประกอบ แตะ DNS ส่วนตัว",
    and3: "ภาพประกอบ เลือกชื่อโฮสต์ของผู้ให้บริการ DNS ส่วนตัว แล้วพิมพ์ dns.google",
    warp: "ภาพประกอบ สวิตช์ WARP เปิดอยู่ ขึ้นว่า Connected",
    mac1: "ภาพประกอบ หน้าต่างการตั้งค่าระบบของ Mac คลิกเครือข่าย",
    mac2: "ภาพประกอบ คลิกปุ่มรายละเอียดของ Wi-Fi",
    mac4: "ภาพประกอบ รายการเซิร์ฟเวอร์ DNS มี 8.8.8.8 และ 8.8.4.4 กับปุ่มบวก",
    win1: "ภาพประกอบ หน้าการตั้งค่าของ Windows คลิกเครือข่าย & อินเทอร์เน็ต",
    win4: "ภาพประกอบ ช่อง DNS ที่ต้องการ 8.8.8.8 และ DNS สำรอง 8.8.4.4",
  },
  en: {
    and1: "Illustration: Android Settings, tap Network & internet",
    and2: "Illustration: tap Private DNS",
    and3: "Illustration: choose Private DNS provider hostname and type dns.google",
    warp: "Illustration: the WARP switch on, showing Connected",
    mac1: "Illustration: Mac System Settings, click Network",
    mac2: "Illustration: click Details for Wi-Fi",
    mac4: "Illustration: the DNS Servers list with 8.8.8.8 and 8.8.4.4 and the plus button",
    win1: "Illustration: Windows Settings, click Network & internet",
    win4: "Illustration: Preferred DNS 8.8.8.8 and Alternate DNS 8.8.4.4",
  },
  zh: {
    and1: "示意图：Android 设置，点 Network & internet",
    and2: "示意图：点 Private DNS",
    and3: "示意图：选择 Private DNS provider hostname 并输入 dns.google",
    warp: "示意图：WARP 开关已打开，显示 Connected",
    mac1: "示意图：Mac 的 System Settings，点 Network",
    mac2: "示意图：点 Wi-Fi 的 Details",
    mac4: "示意图：DNS Servers 列表中有 8.8.8.8 和 8.8.4.4 以及加号按钮",
    win1: "示意图：Windows 设置，点 Network & internet",
    win4: "示意图：Preferred DNS 8.8.8.8 与 Alternate DNS 8.8.4.4",
  },
};

const M = { th: mocks("th", (k) => MOCK_ALT.th[k]), en: mocks("en", (k) => MOCK_ALT.en[k]), zh: mocks("en", (k) => MOCK_ALT.zh[k]) };

export const DNS_GUIDE: ServiceCopy<DnsGuideCopy> = {
  th: {
    lead: "ถ้าวันไหนเปิด okami24.store ไม่ขึ้น ลองเปลี่ยน DNS ในมือถือดูก่อน ตั้งครั้งเดียวก็มีผลกับทุกเว็บ ไม่ใช่แค่เว็บของเรา",
    intro: <>DNS คือสมุดที่อยู่ที่มือถือใช้หาว่าแต่ละเว็บอยู่ที่ไหน เว็บอื่นที่เคยเปิดไม่ขึ้นก็ลองเปิดอีกครั้งได้ และอยากเปลี่ยนกลับเมื่อไหร่ก็ทำได้ เลือกวิธีที่สะดวกด้านล่าง แนะนำให้แคปหน้าจอขั้นตอนของมือถือตัวเองเก็บไว้ด้วย ถ้าทำแล้ว<N>ยังเปิดไม่ขึ้น</N> ทักไลน์ @okm24 <N>แอดมิน</N>ช่วยดูให้ได้</>,
    jumpLabel: "เลือกวิธีที่สะดวก",
    backToChoice: "↑ เลือกวิธีอื่น",
    sourceLabel: "ที่มา:",
    groups: [
      {
        id: "app-free",
        chip: "ไม่ต้องลงแอป",
        chipSub: "iPhone · Android",
        title: "ตั้งค่าในมือถือ ไม่ต้องลงแอป",
        lead: "ตั้งได้จากเมนูในมือถือเลย ไม่ต้องติดตั้งอะไรเพิ่ม บน Android มีผลทั้งเน็ตมือถือและ Wi-Fi ส่วน iPhone มีผลเฉพาะ Wi-Fi ที่ตั้งไว้",
        methods: [
          {
            id: "iphone-wifi",
            device: "iPhone",
            title: "ตั้ง DNS ใน Wi-Fi บน iPhone",
            network: { everywhere: false, text: "มีผลเฉพาะ Wi-Fi ที่ตั้งค่าไว้ ไม่รวมเน็ตมือถือ" },
            cross: { label: "ใช้เน็ตมือถืออยู่? ใช้แอป 1.1.1.1 แทน →", href: "#iphone-app" },
            steps: [
              { title: "เปิดการตั้งค่า Wi-Fi", body: <>เปิด <B>การตั้งค่า</B> แล้วแตะ <B>Wi-Fi</B></>, image: SHOT.wifi1.th },
              { title: "เข้าหน้าตั้งค่า DNS", body: <>แตะ <B>ⓘ</B> ข้างชื่อ Wi-Fi ที่ต่ออยู่ แล้วแตะ <N><B>กำหนดค่า DNS</B></N></>, image: SHOT.wifi2.th },
              { title: "เปลี่ยนเป็นกำหนดเอง", body: <>แตะ <B>กำหนดเอง</B> ถ้ามีเซิร์ฟเวอร์เดิมอยู่ในรายการ แตะปุ่ม <B>−</B> สีแดงหน้าเซิร์ฟเวอร์นั้นเพื่อลบออก</>, image: SHOT.wifi3.th },
              { title: "ใส่ที่อยู่ของ Google", body: <>แตะ <N><B>เพิ่มเซิร์ฟเวอร์</B></N> <N>แล้วพิมพ์ <V>8.8.8.8</V></N> จากนั้นแตะ <N><B>เพิ่มเซิร์ฟเวอร์</B></N> <N>อีกครั้งแล้วพิมพ์ <V>8.8.4.4</V></N></>, image: SHOT.wifi4.th },
              { title: "บันทึกแล้วเปิดเว็บอีกครั้ง", body: <>แตะ <B>บันทึก</B> ที่มุมขวาบน แล้วลองเปิด okami24.store <N>อีกครั้ง</N></> },
            ],
            note: "วิธีนี้มีผลเฉพาะ Wi-Fi ที่ตั้งไว้ ถ้าต่อ Wi-Fi อื่นต้องตั้งใหม่อีกครั้ง ถ้าอยากให้มีผลทั้งเครื่อง ใช้แอป 1.1.1.1 ในหัวข้อถัดไปได้",
            undo: <>อยากเปลี่ยนกลับ เข้า <B>กำหนดค่า DNS</B> ของ Wi-Fi นี้อีกครั้ง เลือก <B>อัตโนมัติ</B> แล้วแตะ <B>บันทึก</B></>,
            sources: [SRC.googleDns],
          },
          {
            id: "android-dns",
            alias: "android",
            device: "Android",
            title: "ตั้งค่า DNS ส่วนตัวบน Android",
            network: { everywhere: true, text: "ใช้ได้ทั้งเน็ตมือถือและ Wi-Fi" },
            caption: "ภาพประกอบ หน้าจอแต่ละยี่ห้ออาจต่างกัน",
            intro: "ใช้ได้กับ Android 9 ขึ้นไป",
            steps: [
              { title: "เปิดการตั้งค่า", body: <>เปิดแอป <B>การตั้งค่า</B> แล้วแตะ <N><B>เครือข่ายและอินเทอร์เน็ต</B></N></>, mock: M.th.and1 },
              { title: "หาเมนู DNS ส่วนตัว", body: <>แตะ <B>DNS ส่วนตัว</B> ถ้าหาไม่เจอ <N>ลองพิมพ์ “DNS ส่วนตัว”</N> ในช่องค้นหาของหน้าการตั้งค่า</>, mock: M.th.and2 },
              { title: "พิมพ์ dns.google", body: <>เลือก <B>ชื่อโฮสต์ของผู้ให้บริการ DNS ส่วนตัว</B> <N>แล้วพิมพ์ <V>dns.google</V></N></>, mock: M.th.and3 },
              { title: "บันทึกแล้วเปิดเว็บอีกครั้ง", body: <>แตะ <B>บันทึก</B> แล้วลองเปิด okami24.store <N>อีกครั้ง</N></> },
            ],
            note: "ชื่อและตำแหน่งของเมนูอาจต่างกันไปตามยี่ห้อมือถือ ถ้าหาไม่เจอ ใช้ช่องค้นหาตามขั้นที่ 2 ได้เลย ถ้าเปิดแอป VPN หรือแอปที่เปลี่ยน DNS อยู่ การตั้งค่านี้จะยังไม่มีผล จึงเลือกใช้วิธีเดียวก็พอ",
            undo: <>อยากเปลี่ยนกลับ เข้าหน้าเดิมแล้วเลือก <B>อัตโนมัติ</B> หรือ <B>ปิด</B> จากนั้นแตะ <B>บันทึก</B></>,
            sources: [SRC.androidTh, SRC.googleDns, SRC.cloudflareAndroid],
          },
        ],
      },
      {
        id: "app",
        chip: "ใช้แอป 1.1.1.1",
        chipSub: "iPhone · Android",
        title: "ใช้แอป 1.1.1.1 บนมือถือ",
        lead: "ใช้แอปฟรีของ Cloudflare เปิดสวิตช์ในแอปครั้งเดียวก็มีผลกับทั้งเครื่อง สะดวกเมื่อหาเมนูในเครื่องไม่เจอ",
        methods: [
          {
            id: "iphone-app",
            alias: "iphone",
            device: "iPhone",
            title: "ใช้แอป 1.1.1.1 บน iPhone",
            network: { everywhere: true, text: "ใช้ได้ทั้งเน็ตมือถือและ Wi-Fi" },
            steps: [
              { title: "เปิดเว็บของแอป 1.1.1.1", body: <>เปิด <Ext /> แล้วแตะ <B>App Store</B> ถ้าค้นหาใน Google ให้เลือกผลที่เป็นเว็บ <N>one.one.one.one</N></>, image: SHOT.site.th },
              { title: "ติดตั้งแอป", body: <>แอปชื่อ “1.1.1.1: Faster Internet” <N>ของ Cloudflare</N> <N>แตะ <B>รับ</B></N> เพื่อติดตั้ง แล้วแตะ <B>เปิด</B></>, image: SHOT.get.th },
              { title: "ยอมรับเงื่อนไข", body: <>แตะ <B>Next</B> แล้วแตะ <B>Accept</B> ถ้า iPhone ถามว่าให้เพิ่มการตั้งค่า VPN ไหม ให้ยืนยัน<N>เพื่อไปต่อ</N></>, image: SHOT.accept.th },
              { title: "เปิดสวิตช์ WARP", body: <>แตะสวิตช์ให้เป็นสีส้ม รอจนขึ้นว่า “Connected” แล้วลองเปิด okami24.store <N>อีกครั้ง</N></>, image: SHOT.switch.th },
            ],
            undo: <>อยากปิด แตะสวิตช์อีกครั้ง แล้วเลือก <B>Disable</B></>,
            undoImage: SHOT.disable.th,
            sources: [SRC.cloudflareIos],
          },
          {
            id: "android-app",
            device: "Android",
            title: "ใช้แอป 1.1.1.1 บน Android",
            network: { everywhere: true, text: "ใช้ได้ทั้งเน็ตมือถือและ Wi-Fi" },
            caption: "ภาพประกอบ",
            steps: [
              { title: "ติดตั้งแอปจาก Google Play", body: <>ค้นหา “1.1.1.1: Faster Internet” <N>ของ Cloudflare</N> ใน Google Play เป็น<N>แอปฟรี</N> ติดตั้ง<N>แล้วเปิดแอป</N></> },
              { title: "ยอมรับเงื่อนไข", body: "ดูหน้าแนะนำของแอปไปตามลำดับ แล้วกดยอมรับเงื่อนไขการใช้งาน" },
              { title: "เปิดสวิตช์ WARP", body: "แตะสวิตช์เพื่อเปิด WARP ถ้ามือถือถามว่าให้แอปตั้งค่า VPN ไหม ให้ยืนยันเพื่อไปต่อ" },
              { title: "รอให้ขึ้น Connected", body: <>รอจนแอปขึ้นว่า “Connected” แล้วลองเปิด okami24.store <N>อีกครั้ง</N></>, mock: M.th.warp },
            ],
            undo: "อยากเลิกใช้ ลบแอป 1.1.1.1 ออกจากเครื่องได้ตามปกติ",
            sources: [SRC.cloudflareAndroid],
          },
        ],
      },
      {
        id: "computer",
        chip: "คอม",
        chipSub: "Mac · Windows",
        title: "ตั้งค่าบนคอม",
        lead: "ถ้าเปิดเว็บจากคอม ตั้งค่าในเครื่องได้ตามขั้นด้านล่าง มีผลเฉพาะคอมเครื่องนั้นและการเชื่อมต่อที่ตั้งไว้",
        methods: [
          {
            id: "mac",
            device: "Mac",
            title: "ตั้งค่า DNS บน Mac",
            network: { everywhere: false, text: "มีผลเฉพาะ Mac เครื่องนี้ และเฉพาะการเชื่อมต่อที่ตั้งค่าไว้" },
            caption: "ภาพประกอบ หน้าจออาจต่างกันตามรุ่น",
            steps: [
              { title: "เปิดการตั้งค่าเครือข่าย", body: <>คลิกเมนู Apple แล้วเลือก <N><B>การตั้งค่าระบบ</B></N> จากนั้นคลิก <B>เครือข่าย</B> <N>ที่แถบด้านข้าง</N></>, mock: M.th.mac1 },
              { title: "เลือกการเชื่อมต่อที่ใช้อยู่", body: <>คลิกการเชื่อมต่อที่ใช้อยู่ เช่น Wi-Fi <N>แล้วคลิก <B>รายละเอียด</B></N></>, mock: M.th.mac2 },
              { title: "เปิดหน้า DNS", body: <>คลิก <B>DNS</B> ถ้ายังไม่เห็น ให้เลื่อนลงอีกนิด</> },
              { title: "ใส่ที่อยู่ของ Google", body: <>คลิก <B>+</B> ใต้รายการ <B>เซิร์ฟเวอร์ DNS</B> <N>แล้วพิมพ์ <V>8.8.8.8</V></N> จากนั้นคลิก <B>+</B> <N>อีกครั้งแล้วพิมพ์ <V>8.8.4.4</V></N></>, mock: M.th.mac4 },
              { title: "บันทึกแล้วเปิดเว็บอีกครั้ง", body: <>กดยืนยันเพื่อบันทึก แล้วลองเปิด okami24.store <N>อีกครั้ง</N></> },
            ],
            undo: <>อยากเปลี่ยนกลับ เข้าหน้าเดิม เลือกที่อยู่ที่เพิ่มไว้<N>แล้วคลิก <B>−</B></N> จากนั้นกดยืนยันเพื่อบันทึก</>,
            sources: [SRC.appleTh, SRC.googleDns],
          },
          {
            id: "windows",
            device: "Windows",
            title: "ตั้งค่า DNS บนคอม Windows 11",
            network: { everywhere: false, text: "มีผลเฉพาะคอมเครื่องนี้ และเฉพาะเครือข่ายที่ตั้งค่าไว้" },
            caption: "ภาพประกอบ หน้าจออาจต่างกันตามรุ่น",
            steps: [
              { title: "เปิดการตั้งค่าเครือข่าย", body: <>เปิด <B>การตั้งค่า</B> คลิก <B>เครือข่าย & อินเทอร์เน็ต</B> <N>แล้วคลิก <B>Wi-Fi</B></N></>, mock: M.th.win1 },
              { title: "เลือกเครือข่ายที่ใช้อยู่", body: <>คลิก <B>จัดการเครือข่ายที่รู้จัก</B> แล้วเลือก<N>เครือข่ายที่ใช้อยู่</N> ถ้าต่อสายแลน ให้เลือก <B>Ethernet</B> แทน</> },
              { title: "แก้ไขการตั้งค่า DNS", body: <>คลิก <B>แก้ไข</B> ที่การตั้งค่า IP เลือก <B>ด้วยตนเอง</B> <N>แล้วเปิด <B>IPv4</B></N></> },
              { title: "ใส่ที่อยู่ของ Google", body: <>ช่อง <B>DNS ที่ต้องการ</B> ใส่ <V>8.8.8.8</V> <N>ช่อง <B>DNS สำรอง</B></N> ใส่ <V>8.8.4.4</V> และตั้ง <N><B>DNS ผ่าน HTTPS</B></N> เป็น <N><B>เปิด (เทมเพลตอัตโนมัติ)</B></N></>, mock: M.th.win4 },
              { title: "บันทึกแล้วเปิดเว็บอีกครั้ง", body: <>คลิก <B>บันทึก</B> แล้วลองเปิด okami24.store <N>อีกครั้ง</N></> },
            ],
            note: <>อยากตั้งค่าที่เราเตอร์ในบ้าน ดูวิธีได้ในคู่มือ <N>Google Public DNS</N> ที่ลิงก์ไว้ด้านล่าง</>,
            undo: <>อยากเปลี่ยนกลับ เข้าหน้าเดิมแล้วเลือก <N><B>อัตโนมัติ (DHCP)</B></N></>,
            sources: [SRC.microsoftTh, SRC.googleDns],
          },
        ],
      },
    ],
    afterTitle: "ทำแล้วยังเปิดไม่ขึ้น?",
    afterBody: "ทักไลน์ @okm24 มาได้เลย แอดมินจะช่วยดูให้ในแชท และระหว่างนี้ก็สั่งสินค้าทางไลน์ได้ตามปกติ",
    lineCta: "ทักไลน์ @okm24",
  },
  en: {
    lead: "If okami24.store ever won't open, try changing the DNS on your phone. Set it once and it applies to every site, not only ours.",
    intro: "DNS is the address book your phone uses to find each website, so any other site that wouldn't open is worth another try, and you can switch it back whenever you like. Pick the way that suits you below; it's a good idea to screenshot the steps for your phone. If the site still won't open, message us on LINE @okm24 and an admin will help.",
    jumpLabel: "Choose a way",
    backToChoice: "↑ Choose another way",
    sourceLabel: "Source:",
    groups: [
      {
        id: "app-free",
        chip: "No app",
        chipSub: "iPhone · Android",
        title: "On your phone, no app needed",
        lead: "Set it from your phone's own Settings, with nothing to install. On Android it covers mobile data and Wi-Fi; on iPhone it covers only the Wi-Fi you set it on.",
        methods: [
          {
            id: "iphone-wifi",
            device: "iPhone",
            title: "Set DNS for your Wi-Fi on iPhone",
            network: { everywhere: false, text: "Only on the Wi-Fi you set it for, not on mobile data" },
            cross: { label: "On mobile data? Use the 1.1.1.1 app instead →", href: "#iphone-app" },
            steps: [
              { title: "Open Wi-Fi settings", body: <>Open <B>Settings</B> and tap <B>Wi-Fi</B>.</>, image: SHOT.wifi1.en },
              { title: "Go to the DNS setting", body: <>Tap <B>ⓘ</B> next to the Wi-Fi you&apos;re connected to, then tap <B>Configure DNS</B>.</>, image: SHOT.wifi2.en },
              { title: "Switch to Manual", body: <>Tap <B>Manual</B>. If there are servers already in the list, tap the red <B>−</B> next to each one to remove it.</>, image: SHOT.wifi3.en },
              { title: "Enter Google's addresses", body: <>Tap <B>Add Server</B> and type <V>8.8.8.8</V>, then tap <B>Add Server</B> again and type <V>8.8.4.4</V>.</>, image: SHOT.wifi4.en },
              { title: "Save and try again", body: <>Tap <B>Save</B> in the top right, then open okami24.store again.</> },
            ],
            note: "This only applies to the Wi-Fi you set it on; on another Wi-Fi you'd set it again. To cover the whole phone, use the 1.1.1.1 app in the next section.",
            undo: <>To switch back, open <B>Configure DNS</B> for this Wi-Fi again, choose <B>Automatic</B> and tap <B>Save</B>.</>,
            sources: [SRC.googleDns],
          },
          {
            id: "android-dns",
            alias: "android",
            device: "Android",
            title: "Set up Private DNS on Android",
            network: { everywhere: true, text: "Works on mobile data and Wi-Fi" },
            caption: "Illustration — screens vary by phone brand.",
            intro: "For Android 9 and later.",
            steps: [
              { title: "Open Settings", body: <>Open the <B>Settings</B> app and tap <B>Network & internet</B>.</>, mock: M.en.and1 },
              { title: "Find Private DNS", body: <>Tap <B>Private DNS</B>. If you can&apos;t find it, search for “Private DNS” in Settings.</>, mock: M.en.and2 },
              { title: "Enter dns.google", body: <>Choose <B>Private DNS provider hostname</B> and type <V>dns.google</V>.</>, mock: M.en.and3 },
              { title: "Save and try again", body: <>Tap <B>Save</B>, then open okami24.store again.</> },
            ],
            note: "Menu names and locations vary by phone brand. If you can't find it, the search in step 2 will take you there. This setting has no effect while a VPN or another DNS-changing app is on, so one way is enough.",
            undo: <>To switch back, open the same screen, choose <B>Automatic</B> or <B>Off</B>, and tap <B>Save</B>.</>,
            sources: [SRC.android, SRC.googleDns, SRC.cloudflareAndroid],
          },
        ],
      },
      {
        id: "app",
        chip: "1.1.1.1 app",
        chipSub: "iPhone · Android",
        title: "On your phone, with the 1.1.1.1 app",
        lead: "A free app from Cloudflare. Turn on one switch and it applies to the whole phone. Handy if you can't find the setting.",
        methods: [
          {
            id: "iphone-app",
            alias: "iphone",
            device: "iPhone",
            title: "Use the 1.1.1.1 app on iPhone",
            network: { everywhere: true, text: "Works on mobile data and Wi-Fi" },
            steps: [
              { title: "Open the 1.1.1.1 website", body: <>Open <Ext /> and tap <B>App Store</B>. If you search on Google, pick the result for one.one.one.one.</>, image: SHOT.site.en },
              { title: "Install the app", body: <>The app is “1.1.1.1: Faster Internet” by Cloudflare. Tap <B>Get</B> to install it, then <B>Open</B>.</>, image: SHOT.get.en },
              { title: "Accept the terms", body: <>Tap <B>Next</B>, then <B>Accept</B>. If your iPhone asks whether to add the VPN configuration, confirm to continue.</>, image: SHOT.accept.en },
              { title: "Turn on WARP", body: "Tap the switch so it turns orange, wait until it shows “Connected”, then open okami24.store again.", image: SHOT.switch.en },
            ],
            undo: <>To turn it off, tap the switch again and choose <B>Disable</B>.</>,
            undoImage: SHOT.disable.en,
            sources: [SRC.cloudflareIos],
          },
          {
            id: "android-app",
            device: "Android",
            title: "Use the 1.1.1.1 app on Android",
            network: { everywhere: true, text: "Works on mobile data and Wi-Fi" },
            caption: "Illustration.",
            steps: [
              { title: "Install the app", body: "Search Google Play for “1.1.1.1: Faster Internet” by Cloudflare. It's free. Install it, then open it." },
              { title: "Accept the terms", body: "Go through the welcome screens and accept the app's Terms of Service." },
              { title: "Turn on WARP", body: "Tap the switch to turn on WARP. If your phone asks to set up a VPN connection, confirm to continue." },
              { title: "Wait for Connected", body: "When the app shows “Connected”, open okami24.store again.", mock: M.en.warp },
            ],
            undo: "To stop using it, simply delete the 1.1.1.1 app.",
            sources: [SRC.cloudflareAndroid],
          },
        ],
      },
      {
        id: "computer",
        chip: "Computer",
        chipSub: "Mac · Windows",
        title: "On a computer",
        lead: "If you use a computer, set it on the computer itself. It applies only to that computer, on the connection you set it for.",
        methods: [
          {
            id: "mac",
            device: "Mac",
            title: "Set up DNS on a Mac",
            network: { everywhere: false, text: "Only affects this Mac, on the connection you set it for" },
            caption: "Illustration — screens may differ by version.",
            steps: [
              { title: "Open Network settings", body: <>Open the Apple menu, choose <B>System Settings</B>, then click <B>Network</B> in the sidebar.</>, mock: M.en.mac1 },
              { title: "Choose your connection", body: <>Click the connection you&apos;re using, such as Wi-Fi, then click <B>Details</B>.</>, mock: M.en.mac2 },
              { title: "Open DNS", body: <>Click <B>DNS</B>. If you don&apos;t see it, scroll down a little.</> },
              { title: "Enter Google's addresses", body: <>Click <B>+</B> under the <B>DNS Servers</B> list and type <V>8.8.8.8</V>, then click <B>+</B> again and type <V>8.8.4.4</V>.</>, mock: M.en.mac4 },
              { title: "Save and try again", body: "Confirm to save, then open okami24.store again." },
            ],
            undo: <>To switch back, open the same screen, select the addresses you added, click <B>−</B> and confirm to save.</>,
            sources: [SRC.apple, SRC.googleDns],
          },
          {
            id: "windows",
            device: "Windows",
            title: "Set up DNS on a Windows 11 PC",
            network: { everywhere: false, text: "Only affects this computer, on the network you set it for" },
            caption: "Illustration — screens may differ by version.",
            steps: [
              { title: "Open network settings", body: <>Open <B>Settings</B>, select <B>Network & internet</B>, then <B>Wi-Fi</B>.</>, mock: M.en.win1 },
              { title: "Choose your network", body: <>Select <B>Manage known networks</B> and choose the network you&apos;re using. If you&apos;re on a cable, choose <B>Ethernet</B> instead.</> },
              { title: "Edit the DNS settings", body: <>Select <B>Edit</B> next to the IP settings, choose <B>Manual</B>, and turn on <B>IPv4</B>.</> },
              { title: "Enter Google's addresses", body: <>Set <B>Preferred DNS</B> to <V>8.8.8.8</V> and <B>Alternate DNS</B> to <V>8.8.4.4</V>, and set <B>DNS over HTTPS</B> to <B>On (automatic template)</B>.</>, mock: M.en.win4 },
              { title: "Save and try again", body: <>Select <B>Save</B>, then open okami24.store again.</> },
            ],
            note: "If you'd like to set it on your home router, see the Google Public DNS guide linked below.",
            undo: <>To switch back, open the same screen and choose <B>Automatic (DHCP)</B>.</>,
            sources: [SRC.microsoft, SRC.googleDns],
          },
        ],
      },
    ],
    afterTitle: "Still not opening?",
    afterBody: "Message us on LINE @okm24 and an admin will help you in the chat. You can keep ordering on LINE as usual in the meantime.",
    lineCta: "Message us on LINE",
  },
  zh: {
    lead: "如果哪天 okami24.store 打不开，可以先试着更改手机的 DNS。设置一次就对所有网站生效，不只是我们的网站。",
    intro: "DNS 就像手机用来查找网站位置的通讯录；以前打不开的其他网站，也可以再试一次，想改回来随时都可以。请在下方选择方便的方法，建议把自己手机的步骤截图保存。以下菜单名称以英文界面为准，中文界面的设备请找对应选项。照做后仍然打不开，欢迎通过 LINE @okm24 联系客服协助。",
    jumpLabel: "选择适合你的方法",
    backToChoice: "↑ 选择其他方法",
    sourceLabel: "来源：",
    groups: [
      {
        id: "app-free",
        chip: "无需应用",
        chipSub: "iPhone · Android",
        title: "在手机设置里改，无需安装应用",
        lead: "直接在手机设置中更改，无需安装任何东西。Android 对移动数据和 Wi-Fi 都有效；iPhone 只对设置过的那个 Wi-Fi 有效。",
        methods: [
          {
            id: "iphone-wifi",
            device: "iPhone",
            title: "在 iPhone 的 Wi-Fi 中设置 DNS",
            network: { everywhere: false, text: "只对设置过的 Wi-Fi 有效，不包括移动数据" },
            cross: { label: "在用移动数据？改用 1.1.1.1 应用 →", href: "#iphone-app" },
            steps: [
              { title: "打开 Wi-Fi 设置", body: <>打开 <B>“Settings”</B>，点 <B>“Wi-Fi”</B>。</>, image: SHOT.wifi1.zh },
              { title: "进入 DNS 设置", body: <>点已连接 Wi-Fi 名称旁的 <B>ⓘ</B>，再点 <B>“Configure DNS”</B>。</>, image: SHOT.wifi2.zh },
              { title: "改为手动", body: <>点 <B>“Manual”</B>。列表中如有原来的服务器，点它前面的红色 <B>−</B> 删除。</>, image: SHOT.wifi3.zh },
              { title: "填入 Google 的地址", body: <>点 <B>“Add Server”</B>，输入 <V>8.8.8.8</V>；再点一次 <B>“Add Server”</B>，输入 <V>8.8.4.4</V>。</>, image: SHOT.wifi4.zh },
              { title: "保存后重新打开", body: <>点右上角的 <B>“Save”</B>，然后重新打开 okami24.store。</> },
            ],
            note: "这个方法只对设置过的 Wi-Fi 有效，连接其他 Wi-Fi 时需要重新设置。想对整部手机生效，可以使用下一部分的 1.1.1.1 应用。",
            undo: <>想改回来：回到这个 Wi-Fi 的 <B>“Configure DNS”</B>，选择 <B>“Automatic”</B>，再点 <B>“Save”</B>。</>,
            sources: [SRC.googleDns],
          },
          {
            id: "android-dns",
            alias: "android",
            device: "Android",
            title: "在 Android 上设置私人 DNS",
            network: { everywhere: true, text: "移动数据和 Wi-Fi 都适用" },
            caption: "示意图——不同品牌手机的画面可能不同。",
            intro: "适用于 Android 9 及以上版本。",
            steps: [
              { title: "打开设置", body: <>打开 <B>“Settings”</B>，点 <B>“Network & internet”</B>。</>, mock: M.zh.and1 },
              { title: "找到私人 DNS", body: <>点 <B>“Private DNS”</B>。找不到的话，在设置里搜索 “Private DNS”。</>, mock: M.zh.and2 },
              { title: "输入 dns.google", body: <>选择 <B>“Private DNS provider hostname”</B>，输入 <V>dns.google</V>。</>, mock: M.zh.and3 },
              { title: "保存后重新打开", body: <>点 <B>“Save”</B>，然后重新打开 okami24.store。</> },
            ],
            note: "不同品牌的手机，菜单名称和位置可能不同，找不到时用第 2 步的搜索即可。开着 VPN 或其他会更改 DNS 的应用时，这项设置不会生效，所以选一种方法就够了。",
            undo: <>想改回来：回到同一页面，选择 <B>“Automatic”</B> 或 <B>“Off”</B>，再点 <B>“Save”</B>。</>,
            sources: [SRC.android, SRC.googleDns, SRC.cloudflareAndroid],
          },
        ],
      },
      {
        id: "app",
        chip: "1.1.1.1 应用",
        chipSub: "iPhone · Android",
        title: "在手机上使用 1.1.1.1 应用",
        lead: "Cloudflare 的免费应用，在应用里打开开关一次，就对整部手机生效。找不到设置菜单时可以用这个方法。",
        methods: [
          {
            id: "iphone-app",
            alias: "iphone",
            device: "iPhone",
            title: "在 iPhone 上使用 1.1.1.1 应用",
            network: { everywhere: true, text: "移动数据和 Wi-Fi 都适用" },
            steps: [
              { title: "打开 1.1.1.1 官网", body: <>打开 <Ext />，点 <B>“App Store”</B>。如果用 Google 搜索，请选择 one.one.one.one 的结果。</>, image: SHOT.site.zh },
              { title: "安装应用", body: <>应用名为 Cloudflare 的 “1.1.1.1: Faster Internet”。点 <B>“Get”</B> 安装，再点 <B>“Open”</B>。</>, image: SHOT.get.zh },
              { title: "同意条款", body: <>点 <B>“Next”</B>，再点 <B>“Accept”</B>。如果 iPhone 询问是否添加 VPN 配置，确认即可继续。</>, image: SHOT.accept.zh },
              { title: "打开 WARP", body: "点开关使其变成橙色，等到显示 “Connected”，然后重新打开 okami24.store。", image: SHOT.switch.zh },
            ],
            undo: <>想关闭时：再点一次开关，选择 <B>“Disable”</B>。</>,
            undoImage: SHOT.disable.zh,
            sources: [SRC.cloudflareIos],
          },
          {
            id: "android-app",
            device: "Android",
            title: "在 Android 上使用 1.1.1.1 应用",
            network: { everywhere: true, text: "移动数据和 Wi-Fi 都适用" },
            caption: "示意图。",
            steps: [
              { title: "安装应用", body: "在 Google Play 搜索 Cloudflare 的 “1.1.1.1: Faster Internet”，这是免费应用。安装后打开。" },
              { title: "同意条款", body: "看完应用的介绍页面后，同意服务条款。" },
              { title: "打开 WARP", body: "点开关打开 WARP。如果手机询问是否设置 VPN 连接，确认即可继续。" },
              { title: "等待显示 Connected", body: "等应用显示 “Connected” 后，重新打开 okami24.store。", mock: M.zh.warp },
            ],
            undo: "不想再用时，直接删除 1.1.1.1 应用即可。",
            sources: [SRC.cloudflareAndroid],
          },
        ],
      },
      {
        id: "computer",
        chip: "电脑",
        chipSub: "Mac · Windows",
        title: "在电脑上",
        lead: "用电脑的话，可以按下面的步骤在电脑上设置，只对这台电脑、在所设置的连接上有效。",
        methods: [
          {
            id: "mac",
            device: "Mac",
            title: "在 Mac 上设置 DNS",
            network: { everywhere: false, text: "只对这台 Mac、在所设置的连接上有效" },
            caption: "示意图——画面可能因版本而异。",
            steps: [
              { title: "打开网络设置", body: <>点左上角的苹果菜单，选择 <B>“System Settings”</B>，再点边栏中的 <B>“Network”</B>。</>, mock: M.zh.mac1 },
              { title: "选择正在使用的连接", body: <>点你正在使用的连接，例如 Wi-Fi，再点 <B>“Details”</B>。</>, mock: M.zh.mac2 },
              { title: "打开 DNS", body: <>点 <B>“DNS”</B>，看不到的话往下滚动一点。</> },
              { title: "填入 Google 的地址", body: <>点 <B>“DNS Servers”</B> 列表下方的 <B>+</B>，输入 <V>8.8.8.8</V>；再点一次 <B>+</B>，输入 <V>8.8.4.4</V>。</>, mock: M.zh.mac4 },
              { title: "保存后重新打开", body: "确认保存，然后重新打开 okami24.store。" },
            ],
            undo: <>想改回来：回到同一页面，选中你添加的地址，点 <B>−</B>，再确认保存。</>,
            sources: [SRC.apple, SRC.googleDns],
          },
          {
            id: "windows",
            device: "Windows",
            title: "在 Windows 11 电脑上设置 DNS",
            network: { everywhere: false, text: "只对这台电脑、在所设置的网络上有效" },
            caption: "示意图——画面可能因版本而异。",
            steps: [
              { title: "打开网络设置", body: <>打开 <B>“Settings”</B>，点 <B>“Network & internet”</B>，再点 <B>“Wi-Fi”</B>。</>, mock: M.zh.win1 },
              { title: "选择正在使用的网络", body: <>点 <B>“Manage known networks”</B>，选择你正在使用的网络。用网线连接的话，改选 <B>“Ethernet”</B>。</> },
              { title: "编辑 DNS 设置", body: <>在 IP 设置旁点 <B>“Edit”</B>，选择 <B>“Manual”</B>，并打开 <B>“IPv4”</B>。</> },
              { title: "填入 Google 的地址", body: <><B>“Preferred DNS”</B> 填 <V>8.8.8.8</V>，<B>“Alternate DNS”</B> 填 <V>8.8.4.4</V>，<B>“DNS over HTTPS”</B> 设为 <B>“On (automatic template)”</B>。</>, mock: M.zh.win4 },
              { title: "保存后重新打开", body: <>点 <B>“Save”</B>，然后重新打开 okami24.store。</> },
            ],
            note: "想在家里的路由器上设置，请参考下方链接的 Google Public DNS 指南。",
            undo: <>想改回来：回到同一页面，选择 <B>“Automatic (DHCP)”</B>。</>,
            sources: [SRC.microsoft, SRC.googleDns],
          },
        ],
      },
    ],
    afterTitle: "照做后还是打不开？",
    afterBody: "请通过 LINE @okm24 联系我们，客服会在聊天中协助你。这段时间也照常可以通过 LINE 下单。",
    lineCta: "通过 LINE 联系我们",
  },
};
