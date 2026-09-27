# Google Trends raw — round 10C (main agent, built-in browser, signed out, geo=TH, "today 12-m", hl=th)

Method: open trends.google.com home first (a cold deep link returned 429 once), then the explore URL; read the
page's own `widgetdata/multiline` response (weekly, 53 weeks 21–27 ก.ย. 2568 .. 20–26 ก.ย. 2569) and compute
avg / first-26-weeks / last-27-weeks / max week in page JS. Values are Trends' 0–100 index, relative inside each set.

## Set 1 (2026-09-25) — พอต · pod · pod system · พอตไฟฟ้า · บุหรี่ไฟฟ้า
| term | avg | 1st half | 2nd half | max (week) | weeks with data |
|---|---|---|---|---|---|
| พอต | 81 | 76.8 | 85.4 | 100 (23–29 ส.ค. 2569) | 53 |
| pod | 11 | 10.8 | 10.4 | 13 | 53 |
| pod system | 0 | 0 | 0 | 1 | 3 of 53 → too little data |
| พอตไฟฟ้า | 1 (1.5) | 1.2 | 1.8 | 3 | 53 |
| บุหรี่ไฟฟ้า | 18 | 17.4 | 18.3 | 29 (24–30 พ.ค. 2569 — week of World No Tobacco Day 31 May) | 53 |

**Anchor problem found:** "พอต" related TOP queries = mostly Harry Potter ("แฮรี่ พอตเตอร์" 36, "พอตเตอร์" 37), "แอร์พอต",
"ฮอตพอต" — Trends' BROAD match counts every query containing the token พอต. Vape-meaning queries in its TOP list:
"ร้านพอต" 3 · "พอตเค" 3 · "หัวพอต" 3 · "ดูดพอต" 2. RISING: "พอต 10k" +800%, "พอตเค (คือ)" +160%.
→ "พอต" is kept in set 1 as the owner asked, but its level is NOT a vape-only level. Sets 2+ use "บุหรี่ไฟฟ้า" as the anchor
(clean: its TOP list is all vape/cigarette) — deviation from the instruction, reason above.

"บุหรี่ไฟฟ้า" related TOP: บุหรี่ 100 · ร้านบุหรี่ไฟฟ้า 7 · สูบบุหรี่ไฟฟ้า 7 · บุหรี่ไฟฟ้า ขาย 6 · โทษ 5 · พอตไฟฟ้า 5 · พอต 5 ·
พอตบุหรี่ไฟฟ้า 5 · กฎหมาย 4 · ใกล้ฉัน 4 · น้ำยาบุหรี่ไฟฟ้า 4 · ร้านขายบุหรี่ไฟฟ้า 3 · ร้านบุหรี่ไฟฟ้าใกล้ฉัน 3 · จับ 3 · คือ 3 ·
เครื่องบุหรี่ไฟฟ้า 3 · ปรับ 3 · อันตราย 2 · ซื้อ 2.
RISING: วันงดสูบบุหรี่โลก 2569 (breakout) · ระเบิด +550% · พอตเค +190% · น้ำยาบุหรี่ไฟฟ้า ซอลนิค +180% · ดูดไม่ขึ้น +150% ·
ค่าปรับ +150% · โดนจับ +150% · คดี +130% · เว็บขายบุหรี่ไฟฟ้า +120% · พก +100%.

## Set 2 (2026-09-25) — anchor บุหรี่ไฟฟ้า · disposable pod · พอตใช้แล้วทิ้ง · คอยล์ · อุปกรณ์บุหรี่ไฟฟ้า
| term | avg | 1st half | 2nd half | max (week) | weeks with data |
|---|---|---|---|---|---|
| บุหรี่ไฟฟ้า | 54 | 52.8 | 56 | 89 (24–30 พ.ค. 2569) | 53 |
| disposable pod | 0 | 0 | 0 | 0 | 1 → too little data |
| พอตใช้แล้วทิ้ง | 2 | 2.5 | 2.3 | 4 (12–18 ต.ค. 2568) | 52 |
| คอยล์ | 69 | 60.2 | 76.9 | 100 (5–11 เม.ย. 2569 — hot season) | 53 |
| อุปกรณ์บุหรี่ไฟฟ้า | 0 | 0 | 0 | 0 | 1 → too little data |

"คอยล์" related TOP = air-conditioner/car-ignition coils (แอร์ 100 · คอยล์แอร์ 97 · คอยล์เย็น 91 · คอยล์ร้อน 88 · คอยล์จุดระเบิด 36 …)
— no vape query in its top 20 → "คอยล์" level is NOT a vape level; treat vape-coil demand as [ยังไม่มีข้อมูล] from Trends.
"พอตใช้แล้วทิ้ง" related TOP: พอต 99 · พอตไฟฟ้า 9 · หัวพอต 6 · บุหรี่ไฟฟ้า 6 · พอตใช้แล้วทิ้งใกล้ฉัน 4 · ขายพอต 3 · RISING หัวพอต +60%.
"disposable pod": no related data.

## Set 3 (2026-09-25) — anchor บุหรี่ไฟฟ้า · พอด · น้ำยาบุหรี่ไฟฟ้า · saltnic · freebase
| term | avg | 1st half | 2nd half | max (week) | weeks with data |
|---|---|---|---|---|---|
| บุหรี่ไฟฟ้า | 61 | 58.9 | 62.5 | 100 (24–30 พ.ค. 2569) | 53 |
| พอด | 62 | 57.8 | 66 | 89 (13–19 ก.ย. 2569) | 53 |
| น้ำยาบุหรี่ไฟฟ้า | 2 | 1.9 | 2.5 | 4 (23–29 พ.ย. 2568) | 44 |
| saltnic | 0 | 0 | 0 | 0 | 2 → too little data |
| freebase | 0 | 0 | 0 | 0 | 2 → too little data |

"พอด" related TOP = podcasts / football "พบ" / song chords / AirPods (พอส 24 · พอดแคส 9 · ไอพอด 8 · แอร์พอด 6 · พอคอร์ด 6 …);
vape-meaning entries: พอต 15 · พอดเค 3 → "พอด" level is NOT a vape level.
"saltnic" related TOP (small base): น้ำยา saltnic 100 · marbo saltnic 68 · vgod saltnic 13 · RISING น้ำยา saltnic +50%.
"น้ำยาบุหรี่ไฟฟ้า" related TOP: น้ำยาบุหรี่ 99 · น้ำยาบุหรี่ไฟฟ้า องุ่น 3 · น้ำยาบุหรี่ไฟฟ้า pod 2 · น้ำยาบุหรี่ไฟฟ้า ฟรีเบส 2.
"freebase": no related data.

## Set 4 (2026-09-25) — anchor บุหรี่ไฟฟ้า · uwell · voopoo · marbo · relx
| term | avg | 1st half | 2nd half | max (week) | weeks with data |
|---|---|---|---|---|---|
| บุหรี่ไฟฟ้า | 61 | 58.9 | 62.5 | 100 (24–30 พ.ค. 2569) | 53 |
| uwell | 0 | 0.2 | 0 | 2 | 4 → too little data |
| voopoo | 1 | 1.6 | 0.9 | 4 (14–20 มิ.ย. 2569) | 28 |
| marbo | 10 | 10.3 | 9.6 | 14 (21–27 ก.ย. 2568) | 53 |
| relx | 16 | 15.5 | 17 | 21 (5–11 ก.ค. 2569) | 53 |

"marbo" related TOP: 9k 100 · marbo 10k 46 · 10k 45 · marbo switch 29 · พอต 24 · พอต marbo 24 · หัว marbo 22 · marbo 9000 22 ·
marbo bar 20 · marbo m switch 17 · marbo zero 15 · บุหรี่ไฟฟ้า 13 · relx 11 · pod 10 · หัวพอต 8 · salthub 7 · infy 6 · zapple 5.
RISING: marbo 10k (breakout) · zapple +900% · 9k +60%.
"voopoo" related TOP: voopoo drag 100 · voopoo argus 77 · บุหรี่ไฟฟ้า voopoo 75 · voopoo pod 47 · voopoo vmate 36 · คอยล์บุหรี่ไฟฟ้า voopoo 19 ·
voopoo drag x 17 · vinci 15 · drag 5 13 · drag 6 7. RISING: voopoo drag 6 (breakout).
"uwell" related TOP: uwell caliburn 100 · uwell caliburn g3 45.

## Set 5 (2026-09-25) — anchor บุหรี่ไฟฟ้า · m bar · salthub · drag 6 · caliburn
| term | avg | 1st half | 2nd half | max (week) | weeks with data |
|---|---|---|---|---|---|
| บุหรี่ไฟฟ้า | 61 | 58.9 | 62.5 | 100 (24–30 พ.ค. 2569) | 53 |
| m bar | 2 | 1.9 | 2.4 | 4 (4–10 ม.ค. 2569) | 41 |
| salthub | 1 | 1.2 | 0.6 | 4 (8–14 มี.ค. 2569) | 22 |
| drag 6 | 0 | 0.1 | 0.1 | 2 | 4 → too little data |
| caliburn | 0 | 0.3 | 0.2 | 3 | 7 → too little data |

"m bar" related TOP: "bartom" 100 (not vape) · m bar 10k 78 · RISING m bar 10k +900%.
"drag 6" related TOP: canada drag race season 6 100 (not vape) · voopoo drag 6 54.
"caliburn" related TOP: caliburn g3 100 · uwell caliburn 75 · g4 40 · g3 pro 33 · koko 33 · g4 pro 21 · g2 17 · a2 14 · a3s 10 · g5 6 ·
RISING caliburn g5 (breakout) · caliburn gz2 (breakout) · g4 pro +1,200% · g4 +300% (also a Cyberpunk 2077 car "Rayfield Caliburn" — small).

## Set 6 (2026-09-25) — second-level anchor **marbo** (= 10 on the บุหรี่ไฟฟ้า=61 scale, set 4) · relx creator · infy · tfit · esko bar
Reason: against บุหรี่ไฟฟ้า these model keys round to 0; chaining through marbo keeps them readable. Converted = avg × 10/68.
| term | avg | 1st half | 2nd half | max (week) | weeks with data | ≈ on บุหรี่ไฟฟ้า scale |
|---|---|---|---|---|---|---|
| marbo | 68 | 70.7 | 66.3 | 100 (19–25 ต.ค. 2568) | 53 | 10 |
| relx creator | 17 | 16.6 | 17.3 | 43 (21–27 ก.ย. 2568) | 45 | ≈2.5 |
| infy | 26 | 25 | 27.2 | 43 (30 ส.ค.–5 ก.ย. 2569) | 52 | ≈3.8 (small share from Infosys stock "infy share price/adr") |
| tfit | 1 | 1 | 0.1 | 14 (15–21 มี.ค. 2569) | 4 | too little data (top related = "tfit concealer", cosmetics) |
| esko bar | 22 | 20.8 | 22.7 | 43 (30 พ.ย.–6 ธ.ค. 2568) | 50 | ≈3.2 |

"infy" related TOP: infy 20k 100 · พอต 63 · หัว infy 59 · relx 36 · relx infy 35 · หัวพอต 31 · infy 12000 30 · หัวพอต infy 30 · infy pod 24 ·
เครื่อง infy 21 · infy 12k 21 · บุหรี่ไฟฟ้า infy 11 · เครื่องพอต infy 7. RISING infy 20k +900% · เครื่องพอต infy +130%.
"relx creator" related: only "relx lego" (odd, small base). "esko bar": no related data.

## Set 7 (2026-09-25) — second-level anchor marbo · หัวพอต · ร้านพอต · พอตเปลี่ยนหัว · พอตดูดไม่ขึ้น (converted = avg × 10/65)
| term | avg | 1st half | 2nd half | max (week) | weeks with data | ≈ on บุหรี่ไฟฟ้า scale |
|---|---|---|---|---|---|---|
| marbo | 65 | 66.8 | 62.6 | 95 (19–25 ต.ค. 2568) | 53 | 10 |
| หัวพอต | 58 | 52.9 | 62.5 | 90 (19–25 ก.ค. 2569) | 53 | ≈9 |
| ร้านพอต | 65 | 57.4 | 73.2 | 100 (28 ธ.ค. 2568–3 ม.ค. 2569 — New Year week) | 53 | ≈10 |
| พอตเปลี่ยนหัว | 8 | 5 | 10.1 | 28 (8–14 มี.ค. 2569) | 27 | ≈1.2 (rising: 2nd half ×2) |
| พอตดูดไม่ขึ้น | 1 | 1.5 | 0.4 | 13 | 6 | too little data |

"หัวพอต" related TOP (all vape): พอต 93 · พอตเปลี่ยนหัว 20 · หัวพอต relx 7 · หัว relx 7 · พอตเค 5 · หัวพอตใกล้ฉัน 5 · พอตไฟฟ้า 4 ·
ร้านขายหัวพอต 3 · หัวพอต infy 3 · น้ำยาพอต 2 · พอตแบบเปลี่ยนหัว 2 · พอตใช้แล้วทิ้ง 2. RISING พอตเค +350% · พอตแบบเปลี่ยนหัว +120%.
"ร้านพอต" related TOP: พอต 95 · ร้านพอตใกล้ฉัน 34 · ร้านขายพอต 30 · ร้านขายพอตใกล้ฉัน 12 · พอตไฟฟ้า 11 · ร้านบุหรี่ไฟฟ้า 10 ·
บุหรี่ไฟฟ้าใกล้ฉัน 5 · ร้านขายบุหรี่ไฟฟ้า 5 · ร้านขายหัวพอต 3. RISING พอตเค +2,100% (a drug-slang term — NOT a key for us, excluded).

## Not run (by decision)
Long-tail keys (pod system ตัวไหนดี · pod system แนะนำ · marbo กลิ่นไหนดี · พอตใช้แล้วทิ้ง ใช้ได้กี่วัน · อุปกรณ์ pod · esko bar switch 20k ·
infy 20k · tfit m power) — sets 2–7 show that even 2-word category keys ("disposable pod", "อุปกรณ์บุหรี่ไฟฟ้า", "saltnic") return
"too little data"; question-phrase keys sit far below that. → [ยังไม่มีข้อมูล] from Trends; demand evidence for them = autocomplete / 10A / GSC.

## Summary on one scale (บุหรี่ไฟฟ้า = 61 avg, clean vape anchor)
Clean vape keys: บุหรี่ไฟฟ้า 61 · relx 16 · marbo 10 · ร้านพอต ≈10 · หัวพอต ≈9 · infy ≈3.8 · esko bar ≈3.2 · relx creator ≈2.5 ·
พอตไฟฟ้า ≈5 (set 1: 1.5/17.8 × 61, rough — bottom of a set whose top term peaks at 100) · m bar 2 · น้ำยาบุหรี่ไฟฟ้า 2 ·
พอตใช้แล้วทิ้ง 2 · พอตเปลี่ยนหัว ≈1.2 · voopoo 1 · salthub 1.
Contaminated (level not usable): พอต (Harry Potter/AirPods/hotpot) · พอด (podcast/football) · คอยล์ (air-con) · pod (unchecked mix) · drag 6 · tfit.
Too little data: pod system · disposable pod · อุปกรณ์บุหรี่ไฟฟ้า · saltnic · freebase · uwell · caliburn · drag 6 · tfit · พอตดูดไม่ขึ้น.
