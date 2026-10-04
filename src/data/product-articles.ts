import type { ArticleSubsection } from "@/types/catalog";
import type { Locale } from "@/i18n/config";

/**
 * Article round (owner 30/09 + 02/10: every product page carries an article in its "more details" section, written to
 * answer what a buyer asks — docs/rounds/รอบบทความ-รายละเอียดเพิ่มเติม.txt). One record per product slug, one copy
 * per locale; a locale without a copy falls back to `en`, then shows nothing.
 *
 * - `lede` (optional): one or two sentences under the section heading, before the posters — a reason to scroll, never a
 *   list of the facts the posters tell nor a re-statement of the source line (G5: cut 03/10, back by the owner the same day).
 * - `sections`: the article itself, after the all-options grid — H3 blocks whose headings are buyer questions.
 *   Paragraphs may carry inline links `[text](/path)` (ArticleBody's syntax), at most three per article.
 *
 * Every product fact here must come from the maker (THAI_STYLE §5 "แหล่งอ้างอิง" — maker pages, posters, manuals);
 * the source per sentence lives in the batch's source table (docs/cloud-results/รอบบทความ-รายละเอียดเพิ่มเติม.md).
 * Never repeat a spec-sheet number on its own, never answer a question the product's own `faqs` already answer, and
 * never re-tell a story poster: one fact at most twice on the page outside the spec table (owner 03/10, HANDOFF §18).
 * This text does not reach <title>/meta/JSON-LD (they read head-copy / shortDescription only).
 */
export interface ProductArticleCopy {
  lede?: string;
  sections: ArticleSubsection[];
}

export const PRODUCT_ARTICLES: Record<string, Partial<Record<Locale, ProductArticleCopy>>> = {
  // Batch 1 (02/10): written from UWELL's G5 page, its spec sheet and the G5 Lite page (sources per sentence:
  // docs/cloud-results/รอบบทความ-รายละเอียดเพิ่มเติม.md §5). Owner format A. G5 template round 03/10: the sections that
  // re-told a story poster (triple tap · 7 colours · airflow) were removed and repeated facts trimmed (thai-copy).
  "caliburn-g5": {
    th: {
      lede: "Caliburn G5 มีจอสี แตะสามครั้งเพื่อสลับโหมด ตัวเครื่องเป็นอะลูมิเนียม และในกล่องมีหัวพอตมาให้สามหัว ด้านล่างคือรายละเอียดทีละข้อจาก UWELL",
      sections: [
        {
          heading: "Caliburn G5 ต่างจาก G5 Lite ยังไง",
          paragraphs: [
            "สองรุ่นนี้ความจุแบตและวัตต์สูงสุดเท่ากัน ที่ต่างคือวิธีดูสถานะเครื่อง G5 มีจอสี บอกแบต วัตต์ และโหมดไว้ในหน้าเดียว ส่วน G5 Lite บอกระดับแบตด้วยไฟ LED บนตัวเครื่อง",
            "อยากเห็นตัวเลขบนจอ เลือก G5 อยากได้เครื่องที่ใช้ง่าย ไม่ต้องดูจอ เลือก [Caliburn G5 Lite](/products/caliburn-g5-lite)",
            "ส่วนใครกำลังเทียบกับ G4 หรือ Caliburn รุ่นอื่น ตารางเทียบสเปกทีละคู่อยู่ที่ [Caliburn G5 vs G4 ต่างกันยังไง](/guides/comparing-caliburn-models)"
          ]
        },
        {
          heading: "GPP Alpha ต่างจากหัว GPP ปกติยังไง",
          paragraphs: [
            "UWELL บอกว่าหัว GPP Alpha ใช้ AlphaCore ทำให้คอยล์ใช้ได้นานขึ้น และรสชาติคงที่ตั้งแต่พัฟแรกถึงพัฟสุดท้าย อีกสองหัวในกล่องเป็นหัว GPP ปกติ โอห์มและแบบเติมน้ำยาต่างกันตามเวอร์ชันที่วางขายในแต่ละประเทศ",
            "ส่วนปากดูด UWELL ใส่แบบเดียวกับหัว Alpha ให้หัว GPP ปกติด้วย"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G5 has a colour screen, a triple tap to switch modes, an aluminium body and three pods in the box. Below, each point in detail from UWELL.",
      sections: [
        {
          heading: "How is the Caliburn G5 different from the G5 Lite?",
          paragraphs: [
            "Both have the same battery capacity and maximum wattage. The difference is how you read the device: the G5 has a colour screen showing battery, wattage and mode on one view; the G5 Lite shows battery level with LED lights on the body.",
            "Want numbers on a screen? Pick the G5. Want something simpler with no screen to read? Pick the [Caliburn G5 Lite](/products/caliburn-g5-lite)."
          ]
        },
        {
          heading: "How is GPP Alpha different from a standard GPP pod?",
          paragraphs: [
            "UWELL says the GPP Alpha uses AlphaCore for a longer coil life and steady flavour from the first puff to the last. The other two pods in the box are standard GPP pods; their resistance and refill style depend on the market version.",
            "As for the mouthpiece, UWELL fits the same one as the Alpha's to its standard GPP pods too."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G5 配备彩色屏幕、三击切换模式、铝合金机身，盒内附 3 颗烟弹。下面按 UWELL 资料逐项介绍。",
      sections: [
        {
          heading: "Caliburn G5 和 G5 Lite 有什么不同？",
          paragraphs: [
            "两款的电池容量和最高功率相同。不同在于查看方式：G5 有彩色屏幕，一屏显示电量、功率和模式；G5 Lite 则用机身上的 LED 灯显示电量。",
            "想在屏幕上看到数字，选 G5；想要更简单、不用看屏幕的机器，选 [Caliburn G5 Lite](/products/caliburn-g5-lite)。"
          ]
        },
        {
          heading: "GPP Alpha 和普通 GPP 烟弹有什么不同？",
          paragraphs: [
            "UWELL 表示 GPP Alpha 采用 AlphaCore，线圈寿命更长，从第一口到最后一口口味稳定。盒内另外 2 颗是普通 GPP 烟弹，阻值和注油方式因销售版本而异。",
            "烟嘴方面，UWELL 也给普通 GPP 烟弹配了和 Alpha 一样的烟嘴。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1a (03/10): UWELL's G5 Lite / Lite SE page (_incoming/sitewide-template/1a/page.txt); buyer
  // questions the posters and the FAQ do not answer. Thai = thai-copy 03/10.
  "caliburn-g5-lite": {
    th: {
      lede: "Caliburn G5 Lite ตัวเครื่องเบา จับถนัดมือ หยิบแล้วไปได้เลย",
      sections: [
        {
          heading: "G5 Lite กับ G5 Lite SE เลือกตัวไหนดี",
          paragraphs: [
            "แบต วัตต์ และระบบลมของสองรุ่นนี้เหมือนกัน ที่ต่างคือผิวตัวเครื่อง G5 Lite เป็นเปลือกโปร่งแสงหุ้มแกนด้านใน ส่วน [G5 Lite SE](/products/caliburn-g5-lite-se) เป็นหนังคู่กับผิวลายริ้ว",
            "ชอบผิวแบบไหนเลือกตัวนั้น"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง",
          paragraphs: [
            "หัวพอต GPP ใส่ได้ทุกหัว ทั้งหัวที่เติมน้ำยาด้านข้างและด้านบน หัวชุดเดียวกันนี้ใช้กับ Caliburn สาย G5 G4 และ G3 ได้ด้วย ใครมีเครื่องสายนี้อยู่แล้ว ใช้หัวสลับกันได้เลย",
            "ดู[หัวพอต GPP ที่ใช้กับ G5 Lite](/products/coil-94)"
          ]
        },
        {
          heading: "ไฟ 4 ขีดแต่ละสีบอกอะไร",
          paragraphs: [
            "ไฟ 4 ขีดบอกว่าแบตเหลือเท่าไหร่ และเปลี่ยนสีตามระดับแบต 4 ขีดสีเขียว แบตเหลือ 75–100% · 3 ขีดสีฟ้า 50–74% · 2 ขีดสีเหลือง 25–49% · 1 ขีดสีแดง 0–24%"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G5 Lite is light, sits well in the hand and is made to grab and go.",
      sections: [
        {
          heading: "G5 Lite or G5 Lite SE — which one?",
          paragraphs: [
            "Battery, power and airflow are the same on both. The difference is the body: the G5 Lite has an inner core under a translucent shell, the [G5 Lite SE](/products/caliburn-g5-lite-se) is leather paired with a striped texture.",
            "Pick the finish you like."
          ]
        },
        {
          heading: "Which pods fit?",
          paragraphs: [
            "Every GPP pod fits, side-refill and top-refill alike — and the same pods work across the Caliburn G5, G4 and G3 series, so if you already own one, you can swap pods between them.",
            "See the [GPP pods for the G5 Lite](/products/coil-94)."
          ]
        },
        {
          heading: "What do the 4-bar light colours mean?",
          paragraphs: [
            "The 4-bar light shows how much battery is left and changes colour with it: 4 green bars 75–100% · 3 blue 50–74% · 2 yellow 25–49% · 1 red 0–24%."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G5 Lite 机身轻巧，握感顺手，拿起就走。",
      sections: [
        {
          heading: "G5 Lite 和 G5 Lite SE 怎么选？",
          paragraphs: [
            "两款的电池、功率和气流系统相同，区别在机身：G5 Lite 是半透明外壳包裹内芯，[G5 Lite SE](/products/caliburn-g5-lite-se) 则是皮革搭配条纹质感。",
            "喜欢哪种质感就选哪款。"
          ]
        },
        {
          heading: "能用哪些烟弹？",
          paragraphs: [
            "所有 GPP 烟弹都能用，侧注油和顶注油都可以；同一批烟弹也适用于 Caliburn G5、G4 和 G3 系列，已有这些机器的话烟弹可以互换。",
            "查看[适用于 G5 Lite 的 GPP 烟弹](/products/coil-94)。"
          ]
        },
        {
          heading: "4 格指示灯的颜色代表什么？",
          paragraphs: [
            "4 格指示灯显示剩余电量，并随电量变色：4 格绿色 75–100% · 3 格蓝色 50–74% · 2 格黄色 25–49% · 1 格红色 0–24%。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1a (03/10): UWELL's G5 Lite / Lite SE page (_incoming/sitewide-template/1a/page.txt); buyer
  // questions the posters and the FAQ do not answer. Thai = thai-copy 03/10.
  "caliburn-g5-lite-se": {
    th: {
      lede: "Caliburn G5 Lite SE ตัวเครื่องเบา จับถนัดมือ หยิบแล้วไปได้เลย",
      sections: [
        {
          heading: "G5 Lite SE ต่างจาก G5 Lite ตรงไหน",
          paragraphs: [
            "ต่างกันที่ผิวตัวเครื่อง G5 Lite SE เป็นหนังคู่กับผิวลายริ้ว ส่วน [G5 Lite](/products/caliburn-g5-lite) เป็นเปลือกโปร่งแสงหุ้มแกนด้านใน แบต วัตต์ และระบบลมเหมือนกัน",
            "ชอบผิวแบบไหนเลือกตัวนั้น"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง",
          paragraphs: [
            "หัวพอต GPP ใส่ได้ทุกหัว ทั้งหัวที่เติมน้ำยาด้านข้างและด้านบน หัวชุดเดียวกันนี้ใช้กับ Caliburn สาย G5 G4 และ G3 ได้ด้วย ใครมีเครื่องสายนี้อยู่แล้ว ใช้หัวสลับกันได้เลย",
            "ดู[หัวพอต GPP ที่ใช้กับ G5 Lite SE](/products/coil-94)"
          ]
        },
        {
          heading: "ไฟ 4 ขีดแต่ละสีบอกอะไร",
          paragraphs: [
            "ไฟ 4 ขีดบอกว่าแบตเหลือเท่าไหร่ และเปลี่ยนสีตามระดับแบต 4 ขีดสีเขียว แบตเหลือ 75–100% · 3 ขีดสีฟ้า 50–74% · 2 ขีดสีเหลือง 25–49% · 1 ขีดสีแดง 0–24%"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G5 Lite SE is light, sits well in the hand and is made to grab and go.",
      sections: [
        {
          heading: "G5 Lite SE vs G5 Lite — what's different?",
          paragraphs: [
            "The body: the G5 Lite SE is leather paired with a striped texture, the [G5 Lite](/products/caliburn-g5-lite) an inner core under a translucent shell. Battery, power and airflow are the same.",
            "Pick the finish you like."
          ]
        },
        {
          heading: "Which pods fit?",
          paragraphs: [
            "Every GPP pod fits, side-refill and top-refill alike — and the same pods work across the Caliburn G5, G4 and G3 series, so if you already own one, you can swap pods between them.",
            "See the [GPP pods for the G5 Lite SE](/products/coil-94)."
          ]
        },
        {
          heading: "What do the 4-bar light colours mean?",
          paragraphs: [
            "The 4-bar light shows how much battery is left and changes colour with it: 4 green bars 75–100% · 3 blue 50–74% · 2 yellow 25–49% · 1 red 0–24%."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G5 Lite SE 机身轻巧，握感顺手，拿起就走。",
      sections: [
        {
          heading: "G5 Lite SE 和 G5 Lite 有什么不同？",
          paragraphs: [
            "区别在机身：G5 Lite SE 是皮革搭配条纹质感，[G5 Lite](/products/caliburn-g5-lite) 是半透明外壳包裹内芯。电池、功率和气流系统相同。",
            "喜欢哪种质感就选哪款。"
          ]
        },
        {
          heading: "能用哪些烟弹？",
          paragraphs: [
            "所有 GPP 烟弹都能用，侧注油和顶注油都可以；同一批烟弹也适用于 Caliburn G5、G4 和 G3 系列，已有这些机器的话烟弹可以互换。",
            "查看[适用于 G5 Lite SE 的 GPP 烟弹](/products/coil-94)。"
          ]
        },
        {
          heading: "4 格指示灯的颜色代表什么？",
          paragraphs: [
            "4 格指示灯显示剩余电量，并随电量变色：4 格绿色 75–100% · 3 格蓝色 50–74% · 2 格黄色 25–49% · 1 格红色 0–24%。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1b (03/10): UWELL's G4 / G4 mini / G4 Classic pages; buyer questions the posters do not
  // answer (which one of the family). Thai = thai-copy 03/10.
  "caliburn-g4": {
    th: {
      lede: "Caliburn G4 ตั้งต้นที่รสชาติ แล้วให้เลือกเองว่าจะสูบแรงหรือสูบนุ่ม",
      sections: [
        {
          heading: "G4 กับ G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "G4 มีจอสีและปุ่ม ส่วน [G4 mini](/products/caliburn-g4-mini) ไม่มีจอ",
            "แบต G4 1300mAh ตัว mini 1100mAh แต่ mini เบากว่า ประมาณ 46 กรัม เทียบกับ 54.7 กรัมของ G4"
          ]
        },
        {
          heading: "G4 ต่างจาก G4 Classic ยังไง",
          paragraphs: [
            "[G4 Classic](/products/caliburn-g4-classic) เป็นตัวเครื่องคนละแบบ ทำจากอะลูมิเนียม ไม่มีจอ มีไฟ RGB 14 ดวง และแบต 1400mAh ส่วนหัวพอตใช้ GPP เหมือนกัน"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G4 starts with flavour, then lets you choose a hard hit or a smooth one.",
      sections: [
        {
          heading: "G4 or G4 mini?",
          paragraphs: [
            "The G4 has a colour screen and a button; the [G4 mini](/products/caliburn-g4-mini) has no screen.",
            "The G4 holds 1300mAh, the mini 1100mAh — and the mini weighs about 46 g against the G4's 54.7 g."
          ]
        },
        {
          heading: "How is the G4 different from the G4 Classic?",
          paragraphs: [
            "The [G4 Classic](/products/caliburn-g4-classic) is a different body: aluminium, no screen, 14 RGB LEDs and a 1400mAh battery. Both take GPP pods."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G4 以口味为起点，再让你选择猛烈还是柔和。",
      sections: [
        {
          heading: "G4 还是 G4 mini？",
          paragraphs: [
            "G4 有彩屏和按键；[G4 mini](/products/caliburn-g4-mini) 没有屏幕。",
            "G4 电池 1300mAh，mini 是 1100mAh；mini 约 46 克，G4 约 54.7 克。"
          ]
        },
        {
          heading: "G4 和 G4 Classic 有什么不同？",
          paragraphs: [
            "[G4 Classic](/products/caliburn-g4-classic) 是另一种机身：铝合金、没有屏幕、14 颗 RGB LED，电池 1400mAh。两款都用 GPP 烟弹。"
          ]
        }
      ]
    }
  },
  "caliburn-g4-mini": {
    th: {
      lede: "G4 mini ตัวเล็กกว่า G4 แต่ระบบปรับรสชาติเป็นตัวเดียวกัน",
      sections: [
        {
          heading: "G4 mini กับ G4 เลือกตัวไหนดี",
          paragraphs: [
            "G4 mini ไม่มีจอ สูบได้เลยโดยไม่ต้องกดปุ่ม ส่วน [G4](/products/caliburn-g4) มีจอสีและปุ่ม",
            "แบต mini 1100mAh น้อยกว่า G4 ที่ 1300mAh แต่ตัวเบากว่า ประมาณ 46 กรัม เทียบกับ 54.7 กรัม"
          ]
        },
        {
          heading: "G4 mini ต่างจาก G5 Lite ตรงไหน",
          paragraphs: [
            "สองรุ่นนี้ไม่มีจอทั้งคู่ ต่างกันที่แบต [G5 Lite](/products/caliburn-g5-lite) จุมากกว่าที่ 1600mAh และมีไฟ 4 ขีดบอกระดับแบต"
          ]
        }
      ]
    },
    en: {
      lede: "The G4 mini is smaller than the G4, with the same flavour system.",
      sections: [
        {
          heading: "G4 mini or G4?",
          paragraphs: [
            "The mini has no screen and fires when you draw; the [G4](/products/caliburn-g4) adds a colour screen, two modes and a button.",
            "The mini holds 1100mAh and weighs about 46 g; the G4 holds 1300mAh and weighs 54.7 g."
          ]
        },
        {
          heading: "G4 mini or G5 Lite?",
          paragraphs: [
            "Neither has a screen. The difference is the battery: the [G5 Lite](/products/caliburn-g5-lite) holds more, 1600mAh, with a 4-bar battery light."
          ]
        }
      ]
    },
    zh: {
      lede: "G4 mini 比 G4 更小，口感技术却是同一套。",
      sections: [
        {
          heading: "G4 mini 还是 G4？",
          paragraphs: [
            "mini 没有屏幕，吸一下就出烟；[G4](/products/caliburn-g4) 多了彩屏、两种模式和按键。",
            "mini 电池 1100mAh、约 46 克；G4 电池 1300mAh、约 54.7 克。"
          ]
        },
        {
          heading: "G4 mini 还是 G5 Lite？",
          paragraphs: [
            "两款都没有屏幕，差别在电池：[G5 Lite](/products/caliburn-g5-lite) 电池更大（1600mAh），配 4 格电量灯。"
          ]
        }
      ]
    }
  },
  "caliburn-g4-classic": {
    th: {
      lede: "Caliburn รุ่นฉลองครบ 10 ปีของ UWELL ตัวเครื่องอะลูมิเนียม มีไฟสีเรืองตอนสูบ",
      sections: [
        {
          heading: "G4 Classic กับ G4 เลือกตัวไหนดี",
          paragraphs: [
            "[G4](/products/caliburn-g4) มีจอสีกับสองโหมดให้เลือก ส่วน G4 Classic ไม่มีจอ บอกระดับแบตด้วยสีไฟ",
            "แบต Classic 1400mAh มากกว่า G4 ที่ 1300mAh และใช้หัวพอต GPP เหมือนกัน"
          ]
        },
        {
          heading: "G4 Classic ต่างจาก G5 Lite ตรงไหน",
          paragraphs: [
            "สองรุ่นนี้ไม่มีจอทั้งคู่ [G5 Lite](/products/caliburn-g5-lite) แบต 1600mAh ตัวเครื่องเป็นเปลือกโปร่งแสงหุ้มแกนด้านใน ส่วน G4 Classic มีไฟ RGB 14 ดวงกับเซ็นเซอร์คู่"
          ]
        }
      ]
    },
    en: {
      lede: "UWELL's tenth-anniversary Caliburn: an aluminium body with colour light that glows as you puff.",
      sections: [
        {
          heading: "G4 Classic or G4?",
          paragraphs: [
            "The [G4](/products/caliburn-g4) has a colour screen and two modes; the G4 Classic has no screen and shows the battery in light.",
            "The Classic holds 1400mAh against the G4's 1300mAh, and both take GPP pods."
          ]
        },
        {
          heading: "G4 Classic or G5 Lite?",
          paragraphs: [
            "Neither has a screen. The [G5 Lite](/products/caliburn-g5-lite) has a 1600mAh battery and an inner core under a translucent shell; the G4 Classic has 14 RGB LEDs and twin sensors."
          ]
        }
      ]
    },
    zh: {
      lede: "UWELL 十周年纪念款 Caliburn：铝合金机身，吸烟时灯光随之亮起。",
      sections: [
        {
          heading: "G4 Classic 还是 G4？",
          paragraphs: [
            "[G4](/products/caliburn-g4) 有彩屏和两种模式；G4 Classic 没有屏幕，用灯光颜色显示电量。",
            "Classic 电池 1400mAh，G4 是 1300mAh，两款都用 GPP 烟弹。"
          ]
        },
        {
          heading: "G4 Classic 还是 G5 Lite？",
          paragraphs: [
            "两款都没有屏幕。[G5 Lite](/products/caliburn-g5-lite) 电池 1600mAh，半透明外壳包覆内芯；G4 Classic 有 14 颗 RGB LED 和双传感器。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1c (03/10): from UWELL's G4 Pro / KOKO pages and spec sheets; Thai = thai-copy 03/10.
  "caliburn-g4-pro": {
    th: {
      lede: "Caliburn G4 Pro สั่งงานด้วยจอทัช ด้านล่างไล่ให้ดูทีละอย่างว่าแตะแล้วทำอะไรได้บ้าง",
      sections: [
        {
          heading: "G4 Pro กับ G4 Pro KOKO เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้มีจอทัช สูงสุด 35 วัตต์ และใช้หัวพอต GPP เหมือนกัน",
            "G4 Pro ทรงเพรียว จอใหญ่กว่า หนักประมาณ 78 กรัม",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) ทรงกล่อง แบตใหญ่กว่าที่ 2000mAh หนักประมาณ 93 กรัม และมีธีมหน้าจอแบบสุ่ม 5 แบบ",
            "ชอบทรงไหนเลือกตัวนั้น"
          ]
        },
        {
          heading: "G4 Pro ต่างจาก G4 ยังไง",
          paragraphs: [
            "[G4](/products/caliburn-g4) มีจอสี 0.85 นิ้ว ใช้ปุ่มเดียวสั่งงาน และมี 2 โหมด",
            "G4 Pro สั่งงานด้วยจอทัช เพิ่มโหมด Custom และแบตใหญ่กว่า"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G4 Pro runs on a touchscreen. Below, one by one, what a tap can do.",
      sections: [
        {
          heading: "G4 Pro or G4 Pro KOKO?",
          paragraphs: [
            "Both have a touchscreen, up to 35W and GPP pods.",
            "The G4 Pro is the slim one, with the bigger screen, at about 78g.",
            "The [G4 Pro KOKO](/products/caliburn-g4-pro-koko) is the box-shaped one, with a bigger 2000mAh battery, about 93g, and five blind-draw screen themes.",
            "Pick the shape you like."
          ]
        },
        {
          heading: "How is the G4 Pro different from the G4?",
          paragraphs: [
            "The [G4](/products/caliburn-g4) has a 0.85-inch colour screen, one button to run it and two modes.",
            "The G4 Pro runs on a touchscreen, adds the Custom mode and has a bigger battery."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G4 Pro 用触屏操作。下面逐项看看轻点一下能做什么。",
      sections: [
        {
          heading: "G4 Pro 还是 G4 Pro KOKO？",
          paragraphs: [
            "两款都有触屏、最高 35W，都用 GPP 烟弹。",
            "G4 Pro 是纤长款，屏幕更大，约 78g。",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) 是方盒款，电池更大，2000mAh，约 93g，还有 5 款盲抽屏幕主题。",
            "喜欢哪种造型就选哪款。"
          ]
        },
        {
          heading: "G4 Pro 和 G4 有什么不同？",
          paragraphs: [
            "[G4](/products/caliburn-g4) 是 0.85 英寸彩屏，一个按键操作，有两种模式。",
            "G4 Pro 用触屏操作，多了 Custom 模式，电池也更大。"
          ]
        }
      ]
    },
  },
  "caliburn-g4-pro-koko": {
    th: {
      lede: "G4 Pro KOKO ตัวเครื่องทรงกล่อง สั่งงานด้วยจอทัช และมีธีมหน้าจอให้สุ่มสะสม",
      sections: [
        {
          heading: "G4 Pro KOKO กับ G4 Pro เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้มีจอทัช สูงสุด 35 วัตต์ และใช้หัวพอต GPP เหมือนกัน",
            "KOKO ทรงกล่อง แบตใหญ่กว่า หนักประมาณ 93 กรัม",
            "[G4 Pro](/products/caliburn-g4-pro) ทรงเพรียว จอ 2.51 นิ้ว แบต 1800mAh หนักประมาณ 78 กรัม",
            "ชอบทรงไหนเลือกตัวนั้น"
          ]
        }
      ]
    },
    en: {
      lede: "The G4 Pro KOKO is a box-shaped device run from a touchscreen, with screen themes to collect.",
      sections: [
        {
          heading: "G4 Pro KOKO or G4 Pro?",
          paragraphs: [
            "Both have a touchscreen, up to 35W and GPP pods.",
            "The KOKO is the box-shaped one, with the bigger battery, at about 93g.",
            "The [G4 Pro](/products/caliburn-g4-pro) is the slim one: a 2.51-inch screen, 1800mAh, about 78g.",
            "Pick the shape you like."
          ]
        }
      ]
    },
    zh: {
      lede: "G4 Pro KOKO 是方盒机身，用触屏操作，还有屏幕主题可以收集。",
      sections: [
        {
          heading: "G4 Pro KOKO 还是 G4 Pro？",
          paragraphs: [
            "两款都有触屏、最高 35W，都用 GPP 烟弹。",
            "KOKO 是方盒款，电池更大，约 93g。",
            "[G4 Pro](/products/caliburn-g4-pro) 是纤长款：2.51 英寸屏，1800mAh，约 78g。",
            "喜欢哪种造型就选哪款。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 1d (04/10): from UWELL's G3 Pro / KOKO pages, spec sheet and user manual; Thai = thai-copy 04/10.
  "caliburn-g3-pro": {
    th: {
      lede: "จอ ช่องลม และหัวพอตที่ใช้ได้ ไล่ดูทีละเรื่องด้านล่าง",
      sections: [
        {
          heading: "G3 Pro กับ G3 Pro KOKO เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้ใช้หัวพอต G3 เหมือนกัน",
            "G3 Pro ทรงเพรียว แบต 1000mAh หนักประมาณ 92 กรัม",
            "[G3 Pro KOKO](/products/caliburn-g3-pro-koko) ทรงกล่อง จอสี 1.8 นิ้ว เปลี่ยนธีมหน้าจอได้ และแบตใหญ่กว่าที่ 1250mAh"
          ]
        },
        {
          heading: "เลือกหัวพอตแบบไหนดี",
          paragraphs: [
            "ตารางหัวพอตของ UWELL ไล่จาก RDL ที่โอห์มต่ำ ไปถึง MTL (สูบแบบดูดเข้าปากก่อน) ที่โอห์มสูง",
            "หัวโอห์มต่ำลมโล่งกว่าและตั้งวัตต์ได้สูงกว่า ส่วนหัวโอห์มสูงลมแน่น เข้าทางคนสูบแบบ MTL",
            "ในกล่องมีมาให้ทั้งสองหัว ลองดูก่อนแล้วค่อยซื้อหัวที่ชอบเพิ่ม"
          ]
        }
      ]
    },
    en: {
      lede: "Below, one thing at a time: the screen, the airflow and the pods it takes.",
      sections: [
        {
          heading: "G3 Pro or G3 Pro KOKO?",
          paragraphs: [
            "Both take the same G3 pods.",
            "The G3 Pro is the slim one, with a 1000mAh battery, at about 92g.",
            "The [G3 Pro KOKO](/products/caliburn-g3-pro-koko) is the box-shaped one, with a 1.8-inch colour screen, screen themes and a 1250mAh battery."
          ]
        },
        {
          heading: "Which pod?",
          paragraphs: [
            "UWELL's pod chart runs from RDL at the low-ohm end to MTL at the high-ohm end.",
            "A lower-ohm pod gives a looser RDL draw at higher wattage; a higher-ohm pod a tighter MTL draw.",
            "Both come in the box, so you can try each before buying more."
          ]
        }
      ]
    },
    zh: {
      lede: "下面逐项来看：屏幕、气流，以及适用的烟弹。",
      sections: [
        {
          heading: "G3 Pro 还是 G3 Pro KOKO？",
          paragraphs: [
            "两款都用同样的 G3 烟弹。",
            "G3 Pro 是纤长款，1000mAh 电池，约 92 克。",
            "[G3 Pro KOKO](/products/caliburn-g3-pro-koko) 是方盒款，1.8 英寸彩屏，可换屏幕主题，1250mAh 电池。"
          ]
        },
        {
          heading: "选哪种烟弹？",
          paragraphs: [
            "UWELL 的烟弹图从低阻值的 RDL 排到高阻值的 MTL。",
            "低阻值烟弹是较松的 RDL 吸感、功率更高；高阻值烟弹是较紧的 MTL 吸感。",
            "两种都在盒内，可以都试过再决定要买哪种。"
          ]
        }
      ]
    },
  },
  "caliburn-g3-pro-koko": {
    th: {
      lede: "จอ ธีม แบต และหัวพอตที่ใช้ได้ ไล่ดูทีละเรื่องด้านล่าง",
      sections: [
        {
          heading: "G3 Pro KOKO กับ G3 Pro เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้ใช้หัวพอต G3 เหมือนกัน",
            "KOKO ทรงกล่อง แบตใหญ่กว่า หนักประมาณ 91 กรัม",
            "[G3 Pro](/products/caliburn-g3-pro) ทรงเพรียว แบต 1000mAh หนักพอ ๆ กันที่ประมาณ 92 กรัม"
          ]
        },
        {
          heading: "G3 Pro KOKO กับ G4 Pro KOKO ต่างกันยังไง",
          paragraphs: [
            "สองรุ่นนี้อยู่ในตระกูล KOKO และมีจอสีเหมือนกัน",
            "G3 Pro KOKO สั่งงานด้วยปุ่ม",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) ใช้จอทัช 2.0 นิ้ว แบต 2000mAh และเลือกได้ 3 โหมด"
          ]
        }
      ]
    },
    en: {
      lede: "Below, one thing at a time: the screen, the themes, the battery and the pods it takes.",
      sections: [
        {
          heading: "G3 Pro KOKO or G3 Pro?",
          paragraphs: [
            "Both take the same G3 pods.",
            "The KOKO is the box-shaped one, with the bigger battery, at about 91g.",
            "The [G3 Pro](/products/caliburn-g3-pro) is the slim one, with a 1000mAh battery, at much the same weight, about 92g."
          ]
        },
        {
          heading: "G3 Pro KOKO or G4 Pro KOKO?",
          paragraphs: [
            "Both are in the KOKO family and both have a colour screen.",
            "The G3 Pro KOKO is run by its button.",
            "The [G4 Pro KOKO](/products/caliburn-g4-pro-koko) has a 2.0-inch touchscreen, a 2000mAh battery and three output modes."
          ]
        }
      ]
    },
    zh: {
      lede: "下面逐项来看：屏幕、主题、电池，以及适用的烟弹。",
      sections: [
        {
          heading: "G3 Pro KOKO 还是 G3 Pro？",
          paragraphs: [
            "两款都用同样的 G3 烟弹。",
            "KOKO 是方盒款，电池更大，约 91 克。",
            "[G3 Pro](/products/caliburn-g3-pro) 是纤长款，1000mAh 电池，重量差不多，约 92 克。"
          ]
        },
        {
          heading: "G3 Pro KOKO 还是 G4 Pro KOKO？",
          paragraphs: [
            "两款都属于 KOKO 系列，都有彩屏。",
            "G3 Pro KOKO 用按键操作。",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) 是 2.0 英寸触屏，2000mAh 电池，三种输出模式。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 2c (04/10): from VOOPOO's DRAG 6 page and posters; Thai = thai-copy 04/10.
  "drag-6": {
    th: {
      lede: "DRAG 6 คือ DRAG ที่ VOOPOO ออกแบบใหม่ โดยยึดเรื่องการควบคุมเป็นหลัก ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "DRAG 6 ต่างจาก DRAG 5 ยังไง",
          paragraphs: [
            "VOOPOO ปรับใหม่เกือบทุกส่วน ทั้งชิป แบต จอ ถังน้ำยา และปุ่มยิง",
            "DRAG 5 ตั้งวัตต์สูงสุดได้น้อยกว่า ใช้ชิป GENE.TT 2.0 และถัง UFORCE-X Tank รุ่นก่อน",
            "แบตของ DRAG 5 เป็นถ่าน 18650 สองก้อนแบบถอดเปลี่ยนได้ จอเล็กกว่า และปุ่มยิงเป็นปุ่มกดธรรมดา"
          ]
        },
        {
          heading: "DRAG 6 กับ X3 และ S3 เลือกตัวไหนดี",
          paragraphs: [
            "[DRAG X3](/products/drag-x3) ไม่มีแบตในตัว ใช้ถ่าน 18650 หรือ 21700 หนึ่งก้อนซึ่งต้องซื้อแยก ตั้งได้ 5–80 วัตต์ และใช้จอทัชขนาดเท่ากับ DRAG 6",
            "[DRAG S3](/products/drag-s3) มีแบตในตัว 3000mAh ตั้งได้ 5–60 วัตต์ และใช้จอ TFT 0.96 นิ้ว",
            "ถ้าชอบเปลี่ยนถ่านเอง DRAG X3 จะตรงกว่า ถ้าอยากได้แบตในตัวโดยไม่ต้องใช้วัตต์สูง DRAG S3 ก็เพียงพอ ส่วนช่วงวัตต์ที่กว้างที่สุดในสามรุ่นนี้อยู่ที่ DRAG 6"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง DRAG 6 ถังน้ำยา และคอยล์สองตัว คือ PnP X 0.15 โอห์มกับ 0.3 โอห์ม",
            "นอกจากนั้นยังมี PnP X Platform Card หลอดแก้วสำรอง ชุดยางซิลิโคน สาย USB-C และคู่มือ"
          ]
        }
      ]
    },
    en: {
      lede: "The DRAG 6 is the DRAG that VOOPOO rebuilt with control at its centre. Below, one thing at a time.",
      sections: [
        {
          heading: "What changed from the DRAG 5?",
          paragraphs: [
            "VOOPOO reworked almost every part: the chip, the battery, the screen, the tank and the fire button.",
            "The DRAG 5 had a lower wattage ceiling, the GENE.TT 2.0 chip and the earlier UFORCE-X Tank.",
            "It ran on two removable 18650 cells, with a smaller screen and a plain press button."
          ]
        },
        {
          heading: "DRAG 6, DRAG X3 or DRAG S3?",
          paragraphs: [
            "The [DRAG X3](/products/drag-x3) has no built-in battery: it runs on one 18650 or 21700 cell, sold separately, goes from 5 to 80W, and has a touchscreen the same size as the DRAG 6's.",
            "The [DRAG S3](/products/drag-s3) has a 3000mAh battery built in, runs 5–60W and has a 0.96-inch TFT screen.",
            "If you like swapping cells, the X3 suits you better. If you want a built-in battery and don't need high wattage, the S3 is enough. The widest wattage range of the three is on the DRAG 6."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The DRAG 6 itself, the tank, and two PnP X coils: 0.15Ω and 0.3Ω.",
            "Plus a PnP X Platform Card, a spare glass tube, a pack of silicone rubber parts, a USB-C cable and the user manual."
          ]
        }
      ]
    },
    zh: {
      lede: "DRAG 6 是 VOOPOO 以操控为核心重新打造的 DRAG。下面逐项来看。",
      sections: [
        {
          heading: "DRAG 6 和 DRAG 5 有什么不同？",
          paragraphs: [
            "VOOPOO 几乎把每个部分都重新做了：芯片、电池、屏幕、烟仓和火键。",
            "DRAG 5 的功率上限更低，用的是 GENE.TT 2.0 芯片，以及上一代 UFORCE-X Tank 烟仓。",
            "它使用两颗可拆换的 18650 电池，屏幕更小，火键是普通按键。"
          ]
        },
        {
          heading: "DRAG 6、DRAG X3 还是 DRAG S3？",
          paragraphs: [
            "[DRAG X3](/products/drag-x3) 没有内置电池，使用一颗需另购的 18650 或 21700 电池，功率 5–80W，触屏尺寸与 DRAG 6 相同。",
            "[DRAG S3](/products/drag-s3) 内置 3000mAh 电池，功率 5–60W，0.96 英寸 TFT 屏。",
            "喜欢自己换电池，选 X3 更合适；想要内置电池又不需要高功率，S3 就够了；三款中功率范围最宽的是 DRAG 6。"
          ]
        },
        {
          heading: "包装内有什么？",
          paragraphs: [
            "DRAG 6 主机、烟仓，以及两颗 PnP X 线圈：0.15Ω 和 0.3Ω。",
            "另有 PnP X Platform Card、备用玻璃管、硅胶配件包、USB-C 数据线和使用说明书。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 2d (04/10): from VOOPOO's DRAG S3 / X3 pages and posters; Thai = thai-copy 04/10.
  "drag-s3": {
    th: {
      lede: "DRAG S3 เป็น DRAG รุ่นที่ VOOPOO ตั้งใจทำให้ใช้ง่าย และหยิบติดตัวไปได้ทุกวัน ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "DRAG S3 กับ DRAG X3 เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นใช้หัวพอตและคอยล์ PnP X ชุดเดียวกัน ที่ต่างกันคือแบต วัตต์ และจอ",
            "[DRAG X3](/products/drag-x3) ไม่มีแบตในตัว ใช้ถ่าน 18650 หรือ 21700 ที่ถอดเปลี่ยนได้ ตั้งได้ถึง 80 วัตต์ และใช้จอทัชขนาด 1.66 นิ้ว",
            "VOOPOO วาง DRAG X3 ไว้สำหรับคนสูบ DTL ที่ชอบปรับแต่งเครื่องเอง ถ้าไม่ได้ต้องการวัตต์สูงขนาดนั้น DRAG S3 ก็เพียงพอ"
          ]
        },
        {
          heading: "DRAG S3 กับ DRAG 6 ต่างกันยังไง",
          paragraphs: [
            "[DRAG 6](/products/drag-6) มีแบตในตัว 4400mAh ตั้งได้ถึง 220 วัตต์ ใช้ชิป GENE.TT 3.0 และตัวเครื่องใหญ่กว่า",
            "ถังน้ำยา UFORCE-X Tank II ของ DRAG 6 ก็ใช้คอยล์ PnP X ได้เหมือนกัน ถ้าเน้นวัตต์สูงเป็นหลัก DRAG 6 จะเหมาะกว่า ส่วนถ้าอยากได้เครื่องที่เล็กกว่า DRAG S3 จะตรงกว่า"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง DRAG S3 หัวพอตแบบ DTL และคอยล์ PnP X มาให้สองตัว คือ 0.6 โอห์มกับ 0.8 โอห์ม พร้อมสายชาร์จและคู่มือการใช้งาน"
          ]
        }
      ]
    },
    en: {
      lede: "The DRAG S3 is the DRAG VOOPOO made to be simple and easy to carry every day. Below, one thing at a time.",
      sections: [
        {
          heading: "DRAG S3 or DRAG X3?",
          paragraphs: [
            "Both take the same PnP X cartridges and coils. Where they differ is the battery, the wattage and the screen.",
            "The [DRAG X3](/products/drag-x3) has no built-in battery: it runs on a removable 18650 or 21700 cell, goes up to 80W and has a 1.66-inch touchscreen.",
            "VOOPOO pitches the X3 at DTL vapers who like to tune their device. If you don't need that much wattage, the S3 is enough."
          ]
        },
        {
          heading: "DRAG S3 or DRAG 6?",
          paragraphs: [
            "The [DRAG 6](/products/drag-6) has a 4400mAh built-in battery, goes up to 220W and runs on the GENE.TT 3.0 chip, in a larger body than the S3.",
            "Its UFORCE-X Tank II takes PnP X coils too. If you want high wattage and size doesn't matter, the DRAG 6 fits better; if you want something smaller, the S3 does."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The DRAG S3, a PnP X Cartridge DTL and two PnP X coils, 0.6Ω and 0.8Ω, plus a charging cable and the user manual."
          ]
        }
      ]
    },
    zh: {
      lede: "DRAG S3 是 VOOPOO 为了简单好用、每天随身而做的 DRAG。下面逐项来看。",
      sections: [
        {
          heading: "DRAG S3 还是 DRAG X3？",
          paragraphs: [
            "两款用的是同一套 PnP X 烟弹和线圈，不同在电池、功率和屏幕。",
            "[DRAG X3](/products/drag-x3) 没有内置电池，使用可拆换的 18650 或 21700 电池，功率最高 80W，配 1.66 英寸触摸屏。",
            "VOOPOO 把 X3 定位给喜欢自己调校的 DTL 用户；如果用不到那么高的功率，S3 就够了。"
          ]
        },
        {
          heading: "DRAG S3 还是 DRAG 6？",
          paragraphs: [
            "[DRAG 6](/products/drag-6) 内置 4400mAh 电池，功率最高 220W，搭载 GENE.TT 3.0 芯片，机身也比 S3 更大。",
            "它的 UFORCE-X Tank II 同样兼容 PnP X 线圈。想要高功率、不在意体积，选 DRAG 6；想要更小巧的，选 S3。"
          ]
        },
        {
          heading: "包装内有什么？",
          paragraphs: [
            "DRAG S3 主机、一个 PnP X Cartridge DTL 烟弹，以及两颗 PnP X 线圈：0.6Ω 和 0.8Ω；另有充电线和使用说明书。"
          ]
        }
      ]
    },
  },
  "drag-x3": {
    th: {
      lede: "DRAG X3 เป็น DRAG รุ่นที่ VOOPOO ทำมาให้คนที่ชอบเลือกและปรับแต่งเครื่องเอง ตั้งแต่ถ่านที่ใส่ไปจนถึงวิธีปลดล็อก ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ใส่ถ่าน 18650 หรือ 21700 ดี",
          paragraphs: [
            "VOOPOO บอกว่าถ่าน 21700 ให้วัตต์สูงสุดได้มากกว่าและใช้ได้นานกว่า ส่วนถ่าน 18650 ทำให้เครื่องเบาลงและพกใส่กระเป๋าได้ง่ายกว่า",
            "จึงขึ้นอยู่กับว่าให้ความสำคัญกับเวลาใช้งานหรือน้ำหนักมากกว่ากัน"
          ]
        },
        {
          heading: "DRAG X3 กับ DRAG S3 เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นใช้หัวพอตและคอยล์ PnP X ชุดเดียวกัน และใช้ชิป GENE.TT 2.0 เหมือนกัน",
            "[DRAG S3](/products/drag-s3) มีแบต 3000mAh อยู่ในตัว ตั้งได้ถึง 60 วัตต์ และใช้จอ TFT 0.96 นิ้ว ตัวเครื่องเล็กกว่า DRAG X3 เล็กน้อย",
            "ถ้าอยากได้เครื่องที่เสียบสายชาร์จได้เลยโดยไม่ต้องดูแลเรื่องถ่าน DRAG S3 จะเหมาะกว่า ถ้าชอบเลือกถ่านเอง และอยากได้วัตต์ที่สูงกว่ากับจอที่ใหญ่กว่า DRAG X3 จะตรงกว่า"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง DRAG X3 หัวพอตแบบ DTL คอยล์ PnP X สองตัว ปากดูดหนึ่งอัน การ์ด PnP X สายชาร์จ และคู่มือการใช้งาน"
          ]
        }
      ]
    },
    en: {
      lede: "The DRAG X3 is the DRAG VOOPOO made for people who like to choose and set things up themselves — from the cell inside to the way it unlocks. Below, one thing at a time.",
      sections: [
        {
          heading: "18650 or 21700?",
          paragraphs: [
            "VOOPOO says a 21700 gives a higher maximum power and a longer runtime, while an 18650 makes the device lighter and easier to pocket.",
            "So it comes down to whether runtime or weight matters more to you."
          ]
        },
        {
          heading: "DRAG X3 or DRAG S3?",
          paragraphs: [
            "Both take the same PnP X cartridges and coils, and both run on the GENE.TT 2.0 chip.",
            "The [DRAG S3](/products/drag-s3) has a 3000mAh battery built in, goes up to 60W and has a 0.96-inch TFT screen, in a slightly smaller body.",
            "If you want to charge by plugging in a cable and never think about cells, the S3 suits you better. If you like choosing your own cell and want more wattage and a bigger screen, go with the X3."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The DRAG X3, a PnP X Cartridge DTL, two PnP X coils, a drip tip, a PnP X Platform Card, a charging cable and the user manual."
          ]
        }
      ]
    },
    zh: {
      lede: "DRAG X3 是 VOOPOO 为喜欢自己挑选、自己调校的人做的 DRAG——从装哪颗电池，到用哪种方式解锁。下面逐项来看。",
      sections: [
        {
          heading: "18650 还是 21700？",
          paragraphs: [
            "VOOPOO 表示，21700 能提供更高的最大功率和更长的续航；18650 则让机身更轻、更方便放进口袋。",
            "所以就看你更看重续航，还是更看重重量。"
          ]
        },
        {
          heading: "DRAG X3 还是 DRAG S3？",
          paragraphs: [
            "两款用的是同一套 PnP X 烟弹和线圈，芯片也都是 GENE.TT 2.0。",
            "[DRAG S3](/products/drag-s3) 内置 3000mAh 电池，功率最高 60W，配 0.96 英寸 TFT 屏，机身略小一些。",
            "想插线就能充、不用操心电池，选 S3 更合适；喜欢自己挑电池，又想要更高功率和更大屏幕，选 X3。"
          ]
        },
        {
          heading: "包装内有什么？",
          paragraphs: [
            "DRAG X3 主机、一个 PnP X Cartridge DTL 烟弹、两颗 PnP X 线圈、一个烟嘴、PnP X Platform Card、充电线和使用说明书。"
          ]
        }
      ]
    },
  },
};

/** The active locale's article for a product, falling back to English; undefined when the product has none. */
export function productArticle(slug: string, locale: Locale): ProductArticleCopy | undefined {
  const rec = PRODUCT_ARTICLES[slug];
  return rec?.[locale] ?? rec?.en;
}
