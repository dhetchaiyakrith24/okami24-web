# Plan: make the weekly money check exact and easy (from orders-audit 09–10/11) — for Friday to fold into HANDOFF §16 / a round

Owner asked 10/11: "จดบันทึกไว้ว่าจะพัฒนาการตรวจบัญชีให้แม่นและง่ายขึ้น ต้องเริ่มจากอะไร". Ordered by money at stake. Each is a
separate batch; 1 and 4 touch the database = owner OK first (13.3 #9); all are money = full checker set (13.5 #3).

| # | what | why (what went wrong this week) | done when |
|---|---|---|---|
| 1 | "คืนเงินแล้ว" mark on a checked LINE slip (+ amount, partial allowed) in /staff/slip; it leaves LINE sales and LINE round profit | 8 refunds (5,340) stayed counted as sales; one was a half refund of a 2,600 order | marking a slip changes the day total and the round profit on /staff/owner; contract test covers partial refunds |
| 2 | Costs page accepts the warehouse rate file (รหัสสินค้า · ราคาเทียบ) as the cost file | cost table has 0 products, every web profit shows "—"; the rate file already covers about half the missing codes | owner drops the rate file, the "ไม่มีทุน" count drops; the rest listed by code |
| 3 | Bill page: flag a warehouse order number that is already in an earlier stored round | one order was billed in both the paid bill and the new one | uploading a bill that repeats a stored order lists it with its amount |
| 4 | Bill page: record "paid · amount · credit carried" per round, and show "owed now" = bill − doubles − shipping over 35 − credit | the 210 credit and the overcharges were worked out by hand | the page prints the one figure to pay and the lines behind it |
| 5 | Bill page: check each LINE row — shipping ≠ 35, bill − shipping not makeable from `qty` rates, look-alike consecutive rows | 2 impossible rows and 2 look-alike pairs found only by script | each shows under "ที่ต่างกัน" |
| 6 | Weekly routine (Sat after 13:00): admin sends bill + rate file → owner drops both → page answers "pay X" + a ready message to the warehouse | today it took a long chat and hand checks | one upload, one figure, one message |

Start with 1 (largest, every week) and 2 (no database change, unlocks web profit at once). 3–5 extend the existing bill page
(`src/lib/owner/bill-rules.ts`). Customer names never enter any of this; slips stay as reference + amount + time.
