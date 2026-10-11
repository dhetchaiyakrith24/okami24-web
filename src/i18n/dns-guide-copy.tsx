import type { ReactNode } from "react";
import type { Step } from "@/components/content/ServicePage";
import { B, type ServiceCopy } from "./service-pages/shared";

/**
 * Copy of the "can't open the website" DNS help page (round "site unreachable", owner 11/10) — rendered by
 * DnsGuideContent. Every step, menu label and network line comes from docs/cloud-results/dns-guide-sources.md (official
 * pages only, checked 2026-10-11); bold = an official on-screen label. Unconfirmed items are left out on purpose: the
 * Chrome provider list is not named, iPhone gets no network line and no iOS button labels, Samsung's Thai labels are
 * replaced by the Settings search tip. Wording: thai-copy 11/10 (th first; en/zh add nothing the Thai does not say —
 * zh keeps the English UI labels in quotes because Chinese UI labels are unverified). Title + dek live in guides-copy.ts.
 */

/** A value the reader types — mono, full colour. */
function V({ children }: { children: ReactNode }) {
  return <span className="font-mono text-foreground">{children}</span>;
}

export interface DnsMethodCopy {
  id: "android" | "iphone" | "chrome" | "computer";
  chip: string;
  title: string;
  /** `everywhere` = confirmed for mobile data AND Wi-Fi (green dot); otherwise a scope line (steel dot). */
  network: { everywhere: boolean; text: string };
  intro?: ReactNode;
  steps: Step[];
  note?: ReactNode;
  undo?: ReactNode;
  sources: { label: string; href: string }[];
}

export interface DnsGuideCopy {
  intro: ReactNode[];
  jumpLabel: string;
  sourceLabel: string;
  methods: DnsMethodCopy[];
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
  chromeTh: { label: "Chrome Help", href: "https://support.google.com/chrome/answer/10468685?hl=th" },
  chrome: { label: "Chrome Help", href: "https://support.google.com/chrome/answer/10468685" },
  microsoftTh: { label: "Microsoft Support", href: "https://support.microsoft.com/th-th/windows/essential-network-settings-and-tasks-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9" },
  microsoft: { label: "Microsoft Support", href: "https://support.microsoft.com/en-us/windows/essential-network-settings-and-tasks-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9" },
};

export const DNS_GUIDE: ServiceCopy<DnsGuideCopy> = {
  th: {
    intro: [
      "ถ้าวันไหนเปิด okami24.store ไม่ขึ้น ลองเปลี่ยน DNS ของเครื่องดูก่อน DNS คือสมุดที่อยู่ที่มือถือหรือคอมใช้หาว่าเว็บแต่ละเว็บอยู่ที่ไหน เปลี่ยนได้เองจากในเครื่อง และเปลี่ยนกลับได้เสมอ",
      "เลือกวิธีตามเครื่องที่ใช้ด้านล่างได้เลย ถ้าทำแล้วยังเปิดไม่ขึ้น ทักไลน์ @okm24 แอดมินช่วยดูให้ได้",
    ],
    jumpLabel: "เลือกวิธีตามเครื่องที่ใช้",
    sourceLabel: "ที่มา:",
    methods: [
      {
        id: "android",
        chip: "Android",
        title: "ตั้งค่า DNS ส่วนตัวบน Android",
        network: { everywhere: true, text: "ใช้ได้ทั้งเน็ตมือถือและ Wi-Fi" },
        intro: "ใช้ได้กับ Android 9 ขึ้นไป",
        steps: [
          { title: "เปิดการตั้งค่า", body: <>เปิดแอป <B>การตั้งค่า</B> แล้วแตะ <B>เครือข่ายและอินเทอร์เน็ต</B></> },
          { title: "หาเมนู DNS ส่วนตัว", body: <>แตะ <B>DNS ส่วนตัว</B> ถ้าหาไม่เจอ ลองพิมพ์ “DNS ส่วนตัว” ในช่องค้นหาของหน้าการตั้งค่า</> },
          { title: "พิมพ์ dns.google", body: <>เลือก <B>ชื่อโฮสต์ของผู้ให้บริการ DNS ส่วนตัว</B> แล้วพิมพ์ <V>dns.google</V></> },
          { title: "บันทึกแล้วเปิดเว็บอีกครั้ง", body: <>แตะ <B>บันทึก</B> แล้วลองเปิด okami24.store อีกครั้ง</> },
        ],
        note: "ชื่อและตำแหน่งของเมนูอาจต่างกันไปตามยี่ห้อมือถือ ถ้าหาไม่เจอ ใช้ช่องค้นหาตามขั้นที่ 2 ได้เลย และถ้าเปิดแอป VPN หรือแอปที่เปลี่ยน DNS อยู่ การตั้งค่านี้จะยังไม่มีผล",
        undo: <>อยากเปลี่ยนกลับ เข้าหน้าเดิมแล้วเลือก <B>อัตโนมัติ</B> หรือ <B>ปิด</B> จากนั้นแตะ <B>บันทึก</B></>,
        sources: [SRC.androidTh, SRC.googleDns, SRC.cloudflareAndroid],
      },
      {
        id: "iphone",
        chip: "iPhone",
        title: "ใช้แอป 1.1.1.1 บน iPhone",
        network: { everywhere: false, text: "ใช้แอปฟรีของ Cloudflare" },
        steps: [
          { title: "ดาวน์โหลดแอป", body: "ค้นหา “1.1.1.1: Faster Internet” ใน App Store แล้วติดตั้ง" },
          { title: "เปิดแอปและยอมรับข้อตกลง", body: "เปิดแอปขึ้นมา แล้วยอมรับข้อตกลงการใช้งานที่แอปแสดง" },
          { title: "ติดตั้งโปรไฟล์ VPN", body: "แอปจะขอติดตั้งโปรไฟล์ VPN และ iPhone จะถามว่าให้เพิ่มการตั้งค่า VPN ไหม ให้ยืนยันเพื่อไปต่อ" },
          { title: "เปิด WARP", body: "เปิดสวิตช์ WARP จนขึ้นว่า “Connected” แล้วลองเปิด okami24.store อีกครั้ง" },
        ],
        undo: "อยากเลิกใช้ ลบแอป 1.1.1.1 ออกจากเครื่องได้ตามปกติ",
        sources: [SRC.cloudflareIos],
      },
      {
        id: "chrome",
        chip: "Chrome",
        title: "ตั้งค่า DNS ใน Chrome",
        network: { everywhere: false, text: "มีผลเฉพาะเว็บที่เปิดใน Chrome" },
        intro: "ใช้ได้กับ Chrome บนมือถือ Android และบนคอม",
        steps: [
          { title: "เปิดเมนูของ Chrome", body: <>กด <B>เพิ่มเติม</B> ที่มุมขวาบน แล้วกด <B>การตั้งค่า</B></> },
          { title: "ไปที่ความเป็นส่วนตัว", body: <>กด <B>ความเป็นส่วนตัวและความปลอดภัย</B></> },
          { title: "เปิด DNS ที่ปลอดภัย", body: <>ในส่วน <B>ความปลอดภัย</B> ให้เปิด <B>ใช้ DNS ที่ปลอดภัย</B> ถ้าใช้คอม ให้กดเปิดส่วน <B>ขั้นสูง</B> ก่อน แล้วจะเห็นตัวเลือกนี้</> },
          { title: "เลือกผู้ให้บริการ", body: "เลือกผู้ให้บริการรายอื่นจากรายการที่ Chrome มีให้ แล้วลองเปิด okami24.store อีกครั้ง" },
        ],
        note: "ถ้าเป็นเครื่องของที่ทำงาน หรือเครื่องที่ตั้งการควบคุมโดยผู้ปกครองไว้ อาจใช้ตัวเลือกนี้ไม่ได้",
        undo: <>อยากเปลี่ยนกลับ ปิด <B>ใช้ DNS ที่ปลอดภัย</B> ในหน้าเดิม</>,
        sources: [SRC.chromeTh],
      },
      {
        id: "computer",
        chip: "คอม Windows",
        title: "ตั้งค่า DNS บนคอม Windows 11",
        network: { everywhere: false, text: "มีผลเฉพาะคอมเครื่องนี้ และเฉพาะเครือข่ายที่ตั้งค่าไว้" },
        steps: [
          { title: "เปิดการตั้งค่าเครือข่าย", body: <>เปิด <B>การตั้งค่า</B> คลิก <B>เครือข่าย & อินเทอร์เน็ต</B> แล้วคลิก <B>Wi-Fi</B></> },
          { title: "เลือกเครือข่ายที่ใช้อยู่", body: <>คลิก <B>จัดการเครือข่ายที่รู้จัก</B> แล้วเลือกเครือข่ายที่ใช้อยู่ ถ้าต่อสายแลน ให้เลือก <B>Ethernet</B> แทน</> },
          { title: "แก้ไขการตั้งค่า DNS", body: <>คลิก <B>แก้ไข</B> ที่การตั้งค่า IP เลือก <B>ด้วยตนเอง</B> แล้วเปิด <B>IPv4</B></> },
          { title: "ใส่ที่อยู่ของ Google", body: <>ช่อง <B>DNS ที่ต้องการ</B> ใส่ <V>8.8.8.8</V> ช่อง <B>DNS สำรอง</B> ใส่ <V>8.8.4.4</V> และตั้ง <B>DNS ผ่าน HTTPS</B> เป็น <B>เปิด (เทมเพลตอัตโนมัติ)</B></> },
          { title: "บันทึกแล้วเปิดเว็บอีกครั้ง", body: <>คลิก <B>บันทึก</B> แล้วลองเปิด okami24.store อีกครั้ง</> },
        ],
        note: "ใช้ Mac หรืออยากตั้งค่าที่เราเตอร์ในบ้าน ดูวิธีได้ในคู่มือ Google Public DNS ที่ลิงก์ไว้ด้านล่าง",
        undo: <>อยากเปลี่ยนกลับ เข้าหน้าเดิมแล้วเลือก <B>อัตโนมัติ (DHCP)</B></>,
        sources: [SRC.microsoftTh, SRC.googleDns],
      },
    ],
    afterTitle: "ทำแล้วยังเปิดไม่ขึ้น?",
    afterBody: "ทักไลน์ @okm24 ได้เลย แอดมินช่วยดูให้ในแชท และระหว่างนี้ก็สั่งสินค้าทางไลน์ได้ตามปกติ",
    lineCta: "ทักไลน์ @okm24",
  },
  en: {
    intro: [
      "If okami24.store ever won't open for you, try changing your device's DNS first. DNS is the address book your phone or computer uses to find each website. You can change it yourself, and switch it back at any time.",
      "Choose your device below. If the site still won't open, message us on LINE @okm24 and an admin will help.",
    ],
    jumpLabel: "Choose your device",
    sourceLabel: "Source:",
    methods: [
      {
        id: "android",
        chip: "Android",
        title: "Set up Private DNS on Android",
        network: { everywhere: true, text: "Works on mobile data and Wi-Fi" },
        intro: "For Android 9 and later.",
        steps: [
          { title: "Open Settings", body: <>Open the <B>Settings</B> app and tap <B>Network & internet</B>.</> },
          { title: "Find Private DNS", body: <>Tap <B>Private DNS</B>. If you can&apos;t find it, search for “Private DNS” in Settings.</> },
          { title: "Enter dns.google", body: <>Choose <B>Private DNS provider hostname</B> and type <V>dns.google</V>.</> },
          { title: "Save and try again", body: <>Tap <B>Save</B>, then open okami24.store again.</> },
        ],
        note: "Menu names and locations vary by phone brand. If you can't find it, the search in step 2 will take you there. This setting has no effect while a VPN or another DNS-changing app is on.",
        undo: <>To switch back, open the same screen, choose <B>Automatic</B> or <B>Off</B>, and tap <B>Save</B>.</>,
        sources: [SRC.android, SRC.googleDns, SRC.cloudflareAndroid],
      },
      {
        id: "iphone",
        chip: "iPhone",
        title: "Use the 1.1.1.1 app on iPhone",
        network: { everywhere: false, text: "Uses a free app from Cloudflare" },
        steps: [
          { title: "Download the app", body: "Search for “1.1.1.1: Faster Internet” on the App Store and install it." },
          { title: "Open it and accept the terms", body: "Open the app and accept the terms it shows you." },
          { title: "Install the VPN profile", body: "The app asks to install a VPN profile, and your iPhone asks whether to add the VPN configuration. Confirm to continue." },
          { title: "Turn on WARP", body: "Switch WARP on until it shows “Connected”, then open okami24.store again." },
        ],
        undo: "To stop using it, simply delete the 1.1.1.1 app.",
        sources: [SRC.cloudflareIos],
      },
      {
        id: "chrome",
        chip: "Chrome",
        title: "Set up secure DNS in Chrome",
        network: { everywhere: false, text: "Only affects websites you open in Chrome" },
        intro: "For Chrome on Android phones and on computers.",
        steps: [
          { title: "Open Chrome's menu", body: <>Tap or click <B>More</B> in the top right, then <B>Settings</B>.</> },
          { title: "Go to Privacy and security", body: <>Select <B>Privacy and security</B>.</> },
          { title: "Turn on secure DNS", body: <>Under <B>Security</B>, turn on <B>Use secure DNS</B>. On a computer, open <B>Advanced</B> first to see this option.</> },
          { title: "Choose a provider", body: "Pick a different provider from the list Chrome offers, then open okami24.store again." },
        ],
        note: "On a work device, or one with parental controls, this option may not be available.",
        undo: <>To switch back, turn off <B>Use secure DNS</B> in the same place.</>,
        sources: [SRC.chrome],
      },
      {
        id: "computer",
        chip: "Windows PC",
        title: "Set up DNS on a Windows 11 PC",
        network: { everywhere: false, text: "Only affects this computer, on the network you set it for" },
        steps: [
          { title: "Open network settings", body: <>Open <B>Settings</B>, select <B>Network & internet</B>, then <B>Wi-Fi</B>.</> },
          { title: "Choose your network", body: <>Select <B>Manage known networks</B> and choose the network you&apos;re using. If you&apos;re on a cable, choose <B>Ethernet</B> instead.</> },
          { title: "Edit the DNS settings", body: <>Select <B>Edit</B> next to the IP settings, choose <B>Manual</B>, and turn on <B>IPv4</B>.</> },
          { title: "Enter Google's addresses", body: <>Set <B>Preferred DNS</B> to <V>8.8.8.8</V> and <B>Alternate DNS</B> to <V>8.8.4.4</V>, and set <B>DNS over HTTPS</B> to <B>On (automatic template)</B>.</> },
          { title: "Save and try again", body: <>Select <B>Save</B>, then open okami24.store again.</> },
        ],
        note: "On a Mac, or if you'd like to set it on your home router, see the Google Public DNS guide linked below.",
        undo: <>To switch back, open the same screen and choose <B>Automatic (DHCP)</B>.</>,
        sources: [SRC.microsoft, SRC.googleDns],
      },
    ],
    afterTitle: "Still not opening?",
    afterBody: "Message us on LINE @okm24 and an admin will help you in the chat. You can keep ordering on LINE as usual in the meantime.",
    lineCta: "Message us on LINE",
  },
  zh: {
    intro: [
      "如果哪天 okami24.store 打不开，可以先试着更改设备的 DNS。DNS 就像手机和电脑用来查找网站位置的通讯录。你可以自己更改，也随时可以改回来。",
      "请在下方选择你使用的设备。以下菜单名称以英文界面为准，中文界面的设备请找对应选项。照做后仍然打不开，欢迎通过 LINE @okm24 联系客服协助。",
    ],
    jumpLabel: "选择你的设备",
    sourceLabel: "来源：",
    methods: [
      {
        id: "android",
        chip: "Android",
        title: "在 Android 上设置私人 DNS",
        network: { everywhere: true, text: "移动数据和 Wi-Fi 都适用" },
        intro: "适用于 Android 9 及以上版本。",
        steps: [
          { title: "打开设置", body: <>打开 <B>“Settings”</B>，点 <B>“Network & internet”</B>。</> },
          { title: "找到私人 DNS", body: <>点 <B>“Private DNS”</B>。找不到的话，在设置里搜索 “Private DNS”。</> },
          { title: "输入 dns.google", body: <>选择 <B>“Private DNS provider hostname”</B>，输入 <V>dns.google</V>。</> },
          { title: "保存后重新打开", body: <>点 <B>“Save”</B>，然后重新打开 okami24.store。</> },
        ],
        note: "不同品牌的手机，菜单名称和位置可能不同，找不到时用第 2 步的搜索即可。开着 VPN 或其他会更改 DNS 的应用时，这项设置不会生效。",
        undo: <>想改回来：回到同一页面，选择 <B>“Automatic”</B> 或 <B>“Off”</B>，再点 <B>“Save”</B>。</>,
        sources: [SRC.android, SRC.googleDns, SRC.cloudflareAndroid],
      },
      {
        id: "iphone",
        chip: "iPhone",
        title: "在 iPhone 上使用 1.1.1.1 应用",
        network: { everywhere: false, text: "使用 Cloudflare 的免费应用" },
        steps: [
          { title: "下载应用", body: "在 App Store 搜索 “1.1.1.1: Faster Internet” 并安装。" },
          { title: "打开并同意条款", body: "打开应用，同意应用显示的使用条款。" },
          { title: "安装 VPN 描述文件", body: "应用会请求安装 VPN 描述文件，iPhone 会询问是否添加 VPN 配置，确认即可继续。" },
          { title: "打开 WARP", body: "打开 WARP 开关，直到显示 “Connected”，然后重新打开 okami24.store。" },
        ],
        undo: "不想再用时，直接删除 1.1.1.1 应用即可。",
        sources: [SRC.cloudflareIos],
      },
      {
        id: "chrome",
        chip: "Chrome",
        title: "在 Chrome 中设置安全 DNS",
        network: { everywhere: false, text: "只对在 Chrome 中打开的网站有效" },
        intro: "适用于 Android 手机和电脑上的 Chrome。",
        steps: [
          { title: "打开 Chrome 菜单", body: <>点右上角的 <B>“More”</B>，再点 <B>“Settings”</B>。</> },
          { title: "进入隐私和安全", body: <>点 <B>“Privacy and security”</B>。</> },
          { title: "打开安全 DNS", body: <>在 <B>“Security”</B> 中打开 <B>“Use secure DNS”</B>。用电脑时，先展开 <B>“Advanced”</B> 才能看到这个选项。</> },
          { title: "选择服务商", body: "从 Chrome 提供的列表中选择其他服务商，然后重新打开 okami24.store。" },
        ],
        note: "公司设备或开启了家长控制的设备，可能无法使用这个选项。",
        undo: <>想改回来：在同一位置关闭 <B>“Use secure DNS”</B>。</>,
        sources: [SRC.chrome],
      },
      {
        id: "computer",
        chip: "Windows 电脑",
        title: "在 Windows 11 电脑上设置 DNS",
        network: { everywhere: false, text: "只对这台电脑、在所设置的网络上有效" },
        steps: [
          { title: "打开网络设置", body: <>打开 <B>“Settings”</B>，点 <B>“Network & internet”</B>，再点 <B>“Wi-Fi”</B>。</> },
          { title: "选择正在使用的网络", body: <>点 <B>“Manage known networks”</B>，选择你正在使用的网络。用网线连接的话，改选 <B>“Ethernet”</B>。</> },
          { title: "编辑 DNS 设置", body: <>在 IP 设置旁点 <B>“Edit”</B>，选择 <B>“Manual”</B>，并打开 <B>“IPv4”</B>。</> },
          { title: "填入 Google 的地址", body: <><B>“Preferred DNS”</B> 填 <V>8.8.8.8</V>，<B>“Alternate DNS”</B> 填 <V>8.8.4.4</V>，<B>“DNS over HTTPS”</B> 设为 <B>“On (automatic template)”</B>。</> },
          { title: "保存后重新打开", body: <>点 <B>“Save”</B>，然后重新打开 okami24.store。</> },
        ],
        note: "使用 Mac，或想在家里的路由器上设置，请参考下方链接的 Google Public DNS 指南。",
        undo: <>想改回来：回到同一页面，选择 <B>“Automatic (DHCP)”</B>。</>,
        sources: [SRC.microsoft, SRC.googleDns],
      },
    ],
    afterTitle: "照做后还是打不开？",
    afterBody: "请通过 LINE @okm24 联系我们，客服会在聊天中协助你。这段时间也照常可以通过 LINE 下单。",
    lineCta: "通过 LINE 联系我们",
  },
};
