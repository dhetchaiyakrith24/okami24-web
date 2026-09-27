# Round 10B — owner decision 1 fixes (2026-09-24): every sentence cut or changed

File: `src/data/guides.ts` (Thai-only articles; en/zh show the Thai-only notice, no copy to change there).

| # | Fix | Article | Before | After |
|---|---|---|---|---|
| 1 | A | disposable-vs-switch-pod, section "Marbo M Switch ดีไหม" | หัว M Switch Pod บรรจุสำเร็จ 2.2mL หัวหนึ่งสูงสุด 15,000 พัฟ ส่วน M Bar 10K สูงสุด 10,000 พัฟ และ M Bar 9K สูงสุด 9,000 พัฟต่อเครื่อง | M Switch Pod หัวละสูงสุด 15,000 พัฟ ส่วน M Bar 10K สูงสุด 10,000 พัฟ และ M Bar 9K สูงสุด 9,000 พัฟต่อเครื่อง |
| 2 | A | disposable-vs-switch-pod, FAQ "พอตเปลี่ยนหัว ต้องเติมน้ำยาเองไหม" | ไม่ต้อง หัวพอตอย่าง M Switch Pod บรรจุสำเร็จ 2.2mL หมดก็ถอดเปลี่ยนหัวใหม่ ตัวเครื่องใช้ตัวเดิม | ไม่ต้อง หัวพอตอย่าง M Switch Pod บรรจุสำเร็จ หมดก็ถอดเปลี่ยนหัวใหม่ ตัวเครื่องใช้ตัวเดิม |
| 3 | A | esko-bar-switch-vs-m-switch, source line | …กับ [เว็บ SALTHUB](…) ยกเว้นความจุหัว M Switch Pod ที่มาจากสเปกที่ยืนยันแล้วบนเว็บเรา ข้อไหนผู้ผลิตไม่ได้เขียนไว้… | …กับ [เว็บ SALTHUB](…) ข้อไหนผู้ผลิตไม่ได้เขียนไว้… |
| 4 | A | esko-bar-switch-vs-m-switch, "ความจุน้ำยา" | Esko เขียนว่าความจุ 18mL ส่วนเว็บ SALTHUB ไม่ได้เขียนความจุของหัว M Switch Pod สเปกที่ยืนยันแล้วบนเว็บเราระบุว่าหัว M Switch Pod บรรจุสำเร็จ 2.2mL | Esko เขียนว่าความจุ 18mL ส่วนเว็บ SALTHUB ไม่ได้เขียนความจุของหัว M Switch Pod เราเลยไม่ใส่ตัวเลข |
| 5 | B | fixing-no-draw-and-blinking-light, "Caliburn G4 Mini ดูจากสีไฟ" ¶2 | …คือหัวพอตถูกถอด ส่วนตอนชาร์จ ไฟเขียวคือแบตเกิน 60% น้ำเงินคือ 30–60% แดงคือต่ำกว่า 30% | …คือหัวพอตถูกถอด (battery sentence moved to the new ¶3) |
| 6 | B | same section, new ¶3 | (none) | ตอนสูบ สีไฟบอกระดับแบต เขียวคือเกิน 60% น้ำเงินคือ 30–60% แดงคือต่ำกว่า 30% ส่วนตอนชาร์จ ไฟจะกะพริบ แดงคือต่ำ น้ำเงินคือกลาง เขียวคือเพียงพอ ชาร์จเต็มแล้วไฟเขียวจะติดค้าง |
| 7 | C | fixing-no-draw-and-blinking-light, sub-heading | Caliburn G4 · G4 Pro และ G5 ดูจากจอ | Caliburn G4 และ G5 ดูจากจอ |
| 8 | C | same section ¶2 | [Caliburn G4 Pro](/products/caliburn-g4-pro) ขึ้นเป็นไอคอน Atomizer Short · Battery Low · Over-puff · No Atomizer ส่วน Caliburn G5 ขึ้นข้อความ ATOMIZER SHORT · BATTERY LOW · OVER 6S (ดูดค้างเกิน 6 วินาที) · NO ATOMIZER | ส่วน Caliburn G5 ขึ้นข้อความ ATOMIZER SHORT · BATTERY LOW · OVER 6S (ดูดค้างเกิน 6 วินาที) · NO ATOMIZER |
| 9 | C | how-long-a-disposable-lasts, "ทำไมแต่ละคนหมดไม่เท่ากัน" ¶2 | อีกเรื่องคือบางรุ่นปรับได้ M Bar 9K ปรับช่องลมได้ ตั้งแต่แน่นแบบ MTL (สูบแบบดูดเข้าปากก่อน) ไปจนโล่งแบบ DTL (สูบแบบดูดลงปอดตรง ๆ) ส่วน M Bar 10K มี 3 โหมด Eco · Soft · Boost กดสองครั้งติดกันเพื่อสลับ | อีกเรื่องคือบางรุ่นตั้งค่าได้ M Bar 9K ปรับช่องลมได้ ส่วน M Bar 10K มี 3 โหมด Eco · Soft · Boost กดสองครั้งติดกันเพื่อสลับ |

Wording of rows 1, 5, 6, 8, 9 = thai-copy's picks (recommended option each): "หัวละ" is the locked word (THAI_STYLE §3,
round 8); "ถูกถอด ระหว่างสูบ" could read as "removed while vaping"; the "respectively" order made the reader pair colours
and levels; "ส่วน" joins the G5 line to the G4 paragraph; "ปรับได้ … ปรับช่องลมได้" repeated.

Kept (source found, real browser 2026-09-24):
- M Bar 9K 600mAh — https://www.salthub.com/ product box "M BAR 9K · Battery Capacity: 600mAh"
- M Bar 10K 600mAh — https://img.salthub.com/mbar10k/MBar10K_01.webp ("600 MAH" icon row) on https://www.salthub.com/mbar-10k/
- M Bar 10K Eco/Soft/Boost — MBar10K_03.webp ("ECO MODE · SOFT MODE · BOOST MODE"); double click — MBar10K_04.webp
  ("DOUBLE CLICK BOTTOM BUTTON, SWITCH 3 MODES (ECO/SOFT/BOOST) FREELY")
- Zapple + Kyoho Grape "NEW" — https://www.salthub.com/wp-content/uploads/2025/08/m_bar_9k_06.webp (red "NEW" tags, "NEW FLAVOR")
- G4 Mini lights (fix B) — https://manuals.plus/caliburn/kpn025-g4-mini-kit-manual, "Battery level indication" + "Charging"

Cut (no allowed source):
- M Bar 9K "MTL to DTL" — SALTHUB says "Adjustable Airflow" only; the range appears on reseller pages only
- Caliburn G4 Pro icon list — retailer-hosted PDF only; manuals.plus copy is the G4 Pro KOKO manual (separate product
  on this site; it shows text "ATOMIZER SHORT-CIRCUIT · LOW BATTERY · OVER 6S · NO ATOMIZER", not icons)

Typography (fix D, `src/lib/thai-typography.ts` MODEL_NAMES): + "Esko Bar Switch" · + "No Atomizer". Not bound (owner):
"ไฟกะพริบ" · "พอตใช้แล้วทิ้ง". Notice line on en/zh (`ThaiOnlyGuideGate.tsx`): <p> → <h1>, same classes.
