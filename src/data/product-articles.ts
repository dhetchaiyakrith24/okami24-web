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
            "G4 Pro ทรงเพรียว จอใหญ่กว่าที่ 2.51 นิ้ว หนักประมาณ 78 กรัม",
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
            "The G4 Pro is the slim one, with the bigger 2.51-inch screen, at about 78g.",
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
            "G4 Pro 是纤长款，屏幕更大，2.51 英寸，约 78g。",
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
};

/** The active locale's article for a product, falling back to English; undefined when the product has none. */
export function productArticle(slug: string, locale: Locale): ProductArticleCopy | undefined {
  const rec = PRODUCT_ARTICLES[slug];
  return rec?.[locale] ?? rec?.en;
}
