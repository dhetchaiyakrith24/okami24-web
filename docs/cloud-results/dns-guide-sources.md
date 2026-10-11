# DNS guide — official-source facts (round "site unreachable", batch 1)

Checked 2026-10-11 by the `researcher` agent, official pages only. `[verified]` = an official page states it (URL given) ·
`[not confirmed]` = no official page states it → **not written on the site**. Several facts were read through a page-reading
tool, not raw text: open the page before quoting exact wording on the site.

## 1. Android — Private DNS (works on mobile data AND Wi-Fi)

- Steps [verified https://support.google.com/android/answer/9654714]: Settings → Network & internet → Private DNS (search
  "Private DNS" if not found) → choose Off / Automatic / Private DNS provider hostname → Save.
- Thai labels [verified https://support.google.com/android/answer/9654714?hl=th]: เครือข่ายและอินเทอร์เน็ต · DNS ส่วนตัว · ปิด ·
  อัตโนมัติ · ชื่อโฮสต์ของผู้ให้บริการ DNS ส่วนตัว · บันทึก
- Hostname: `dns.google` [verified https://developers.google.com/speed/public-dns/docs/using ·
  https://developers.google.com/speed/public-dns/docs/dns-over-tls] · Cloudflare alternative `one.one.one.one`
  [verified https://developers.cloudflare.com/1.1.1.1/setup/android/]
- Google's page writes the path with "Advanced" (Network & Internet → Advanced → Private DNS); Android Help without it.
- Version: Android 9+ [verified Google Public DNS "using" page + Cloudflare Android page].
- Samsung: Settings → Connections → More connection settings → Private DNS → Save [verified (US page)
  https://www.samsung.com/us/support/answer/ANS10002546/] · Samsung Thai labels [not confirmed].
- Networks: all networks including cellular [verified Cloudflare Android page].
- Limit: no effect while a VPN or a DNS-changing app is on [verified Google Public DNS docs].
- Undo: same screen → Automatic (or Off) → Save [verified: the modes; "go back to Automatic" is not a written step].

## 2. iPhone — Cloudflare "1.1.1.1: Faster Internet" app

- Steps [verified https://developers.cloudflare.com/1.1.1.1/setup/ios/]: install from the App Store → open, accept the terms →
  install the VPN profile → switch WARP to Connected.
- The app offers encrypted-DNS-only or WARP (default WARP) [verified same page]; exact iOS menu name of the DNS-only mode,
  iOS minimum version, the iOS permission prompt wording, mobile data vs Wi-Fi for the app [not confirmed].
- Undo (switch WARP off / delete the app) [not confirmed].
- No app: Settings → Wi-Fi → ⓘ → Configure DNS → Manual → add Google's addresses — **that Wi-Fi only**; undo = Configure DNS
  → Automatic [verified https://developers.google.com/speed/public-dns/docs/using].
- A `.mobileconfig` DNS profile for ordinary customers from Apple/Google/Cloudflare [not confirmed] — Apple's DNS Settings
  payload is for MDM-managed devices. → not on the page.

## 3. Chrome — "Use secure DNS"

- Android [verified https://support.google.com/chrome/answer/10468685]: More → Settings → Privacy and security → Security →
  Use secure DNS → choose provider.
- Windows / Mac [verified https://support.google.com/chrome/answer/10468685?hl=en&co=GENIE.Platform%3DDesktop]: More →
  Settings → Privacy and security → Security → Advanced → Use secure DNS → current provider or a custom one from the list.
  Google / Cloudflare named in that list [not confirmed].
- Default = automatic, falls back to unencrypted; a chosen custom provider does not fall back. Managed devices / parental
  controls cannot use it [verified same page].
- Chrome on iPhone: the iOS help variant has no "Use secure DNS" section [not confirmed] → not on the page.
- Undo: switch it off in the same place [verified].

## 4. Computer / home Wi-Fi — 8.8.8.8 / 8.8.4.4 (that network only)

- Addresses 8.8.8.8 · 8.8.4.4 (IPv6 2001:4860:4860::8888 · ::8844) [verified
  https://learn.microsoft.com/en-us/windows-server/networking/dns/doh-client-support ·
  https://developers.google.com/speed/public-dns/docs/using]
- Windows 10: Control Panel → Network and Internet → Network and Sharing Center → Change adapter settings → right-click the
  connection → Properties → IPv4 → Properties → "Use the following DNS server addresses" [verified Google "using" page].
- macOS (10.15 example): System Preferences → Network → Advanced → DNS → + → OK → Apply [verified same page].
- Router: admin page (e.g. 192.168.0.1 / 192.168.1.1) → replace DNS; some ISPs lock it [verified same page].
- Windows 11 (DNS over HTTPS): Network & internet → Wi-Fi → Manage known networks → network (or Ethernet) → IP assignment /
  DNS server assignment → Edit → Manual → IPv4 on → Preferred / Alternate DNS → DNS over HTTPS On (automatic template) →
  Save. Not in Windows 10 [verified (tool summary)
  https://support.microsoft.com/en-us/windows/essential-network-settings-and-tasks-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9].
- Undo: "obtain DNS server address automatically" / remove the addresses [verified Google "using" page].

## 5. Plain vs encrypted DNS

- [verified] plain DNS can be read and changed on the way, including DNS-based filtering
  (https://developers.google.com/speed/public-dns/docs/dns-over-tls); DoT stops anyone between device and resolver reading
  or changing queries (https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-tls/).
- [not confirmed] that an ISP answers a typed 8.8.8.8 itself. → The page must NOT claim it.
- [verified] DoT uses port 853, which a network can block (Google DoT page).
- Site consequence: order = methods that work on every network first (Android Private DNS · iPhone 1.1.1.1 app · Chrome),
  Wi-Fi-only manual DNS last — reason on the page = "works on mobile data too", not interception.

## 6. Official Thai labels (follow-up, 2026-10-11 — re-open the page before quoting exact wording)

- Chrome Android [verified https://support.google.com/chrome/answer/10468685?hl=th&co=GENIE.Platform%3DAndroid]: เพิ่มเติม
  (มุมขวาบน) → การตั้งค่า → ความเป็นส่วนตัวและความปลอดภัย → ส่วน "ความปลอดภัย" → ใช้ DNS ที่ปลอดภัย → "เลือกผู้ให้บริการปัจจุบัน
  หรือผู้ให้บริการรายอื่น". Computer [verified …&co=GENIE.Platform%3DDesktop]: same + ส่วน "ขั้นสูง". Neither the Thai nor the
  English page names Google / Cloudflare in the provider list [not confirmed] → the page does not name list items.
- Samsung Thai labels: no official samsung.com/th page found [not confirmed] → English labels (US page) or the search tip.
- iPhone Wi-Fi manual DNS: Google's Thai page (AI-translated, says so) uses "Configure DNS" + "กำหนดเอง"; Apple's own Thai labels
  [not confirmed] → not on the page until the owner's screenshots show the real labels.
- Windows 11 [verified https://support.microsoft.com/th-th/windows/essential-network-settings-and-tasks-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9]:
  เครือข่าย & อินเทอร์เน็ต → Wi-Fi → จัดการเครือข่ายที่รู้จัก (หรือ Ethernet) → แก้ไข (การกำหนดค่า IP) → อัตโนมัติ (DHCP) / ด้วยตนเอง →
  IPv4 → "DNS ที่ต้องการ" / "DNS สำรอง" → "DNS ผ่าน HTTPS": ปิด / เปิด (เทมเพลตอัตโนมัติ) / เปิด (เทมเพลตด้วยตนเอง) → บันทึก.
- 1.1.1.1 app is free [verified https://one.one.one.one/ · https://developers.cloudflare.com/warp-client/get-started/ios/]; undo
  = delete the app (Remove App → Delete App) [verified same]; "switch WARP off" and cellular coverage on iOS [not confirmed].
- iPhone flow seen on the owner's own iPhone (Thai iOS, 4G, 2026-10-11 21:55, 9 screenshots in `_incoming/dns-shots/iphone/`)
  [ตรวจแล้ว — first-hand]: Google "1.1.1.1" → 2nd result = one.one.one.one → "App Store" button → App Store "รับ" → "เปิด" →
  app "What is WARP?" → **Next** → "Our Commitment to Privacy" (explains it adds a VPN configuration) → **Accept** → switch
  "Disconnected" → tap → orange, "Connecting" · undo = tap the switch again → menu "Pause for 15 minutes / Pause for 1 hour /
  Switch to DNS only mode / **Disable**". The iOS "Add VPN configuration" prompt itself was not in the set (kept conditional).
  This replaces the unconfirmed "switch off" note above: undo = switch → Disable.
  Owner confirmed in chat 11/10: on 4G the switch reached "Connected" and okami24.store opened → iPhone app = works on mobile
  data too [ตรวจแล้ว — owner first-hand] (with Cloudflare's Android-page "any network" statement).
- iPhone Wi-Fi manual DNS seen on the owner's own iPhone (Thai iOS, 2026-10-11 23:35, 4 screenshots in
  `_incoming/dns-shots/iphone-wifi/`) [ตรวจแล้ว — first-hand]: **การตั้งค่า** → **Wi-Fi** → ⓘ next to the connected network →
  section "DNS" → **กำหนดค่า DNS** → **กำหนดเอง** (NOT "ด้วยตนเอง"; Google's AI-translated Thai page also says กำหนดเอง) →
  under "เซิร์ฟเวอร์ DNS": red minus removes a server, **เพิ่มเซิร์ฟเวอร์** adds one → **บันทึก** (top right) · undo =
  **อัตโนมัติ**. Only that Wi-Fi network [verified Google "using" page]. Crops: `_incoming/dns-round/crop-wifi.js` (name/photo,
  neighbour networks and IPs cut; home Wi-Fi name blurred).
- Mac [verified — Friday read the Thai page text 2026-10-11 https://support.apple.com/th-th/guide/mac-help/mh14127/mac · EN
  https://support.apple.com/guide/mac-help/change-dns-settings-on-mac-mh14127/mac; the page lists macOS 27 back to High
  Sierra]: เลือกเมนู Apple > **การตั้งค่าระบบ** แล้วคลิก **เครือข่าย** ในแถบด้านข้าง คลิกบริการเครือข่าย คลิก **รายละเอียด** จากนั้นคลิก
  **DNS** (อาจต้องเลื่อนลง) · add: click + (icon, no text label) at the bottom of the **เซิร์ฟเวอร์ DNS** list, enter an IPv4 or IPv6
  address · remove: select the server, click − (icon). [not confirmed]: the closing OK button's Thai label, and that the
  setting is per network service (the path goes through one service — likely, not stated).
- Android 1.1.1.1 app [verified — Friday read https://developers.cloudflare.com/1.1.1.1/setup/android/ 2026-10-11]: "Download
  1.1.1.1: Faster Internet from Google Play for free" → "Launch … and accept the Terms of Service" → "Toggle the WARP button to
  Connected" → "Install the VPN profile…"; the app "automatically configures your phone to use 1.1.1.1 on any network you connect
  to". Android manual Wi-Fi DNS (older versions) = static IP via Modify network → may break captive-portal Wi-Fi → NOT on the
  page; Android's no-app way = Private DNS (all networks).
- Private DNS on mobile data: only Cloudflare states it ("all networks, including cellular"); Google's pages do not [not confirmed
  Google-side] → cite Cloudflare for the network line.
