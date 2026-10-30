import type { ArticleFAQItem, ArticleSubsection } from "@/types/catalog";
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
  /** Warehouse-listed (Shipnity seed) pages only — they have no `Product.faqs`; PilotProductDetail shows these under the
   *  article and the server page builds FAQPage JSON-LD from the Thai copy (the M Bar 9K editorial pattern). */
  faq?: ArticleFAQItem[];
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
            "UWELL บอกว่าหัว GPP Alpha ใช้ AlphaCore ทำให้คอยล์ใช้ได้นานขึ้น และรสชาติคงที่ตั้งแต่พัฟแรกถึงพัฟสุดท้าย อีกสองหัวในกล่องเป็นหัว GPP ปกติ เติมน้ำยาด้านข้าง",
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
            "UWELL says the GPP Alpha uses AlphaCore for a longer coil life and steady flavour from the first puff to the last. The other two pods in the box are standard GPP pods, filled from the side.",
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
            "UWELL 表示 GPP Alpha 采用 AlphaCore，线圈寿命更长，从第一口到最后一口口味稳定。盒内另外 2 颗是普通 GPP 烟弹，侧面注油。",
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
  // Product-article round (27/10, side chat seo-push-2710): standard Caliburn G3 (not G3 Pro). Facts only from the verified spec
  // rows of `caliburn-g3` and `caliburn-g3-pro` in src/data/products/uwell.ts (UWELL's own pages / manual / pod chart); thai-copy 27/10.
  "caliburn-g3": {
    th: {
      lede: "Caliburn G3 คือรุ่นมาตรฐานของตระกูล G3 ตัวเครื่องเล็กและเบา ด้านล่างรวมเรื่องที่ควรรู้ก่อนเลือก ทั้งความต่างจาก G3 Pro การเลือกโอห์มของหัวพอต และแบบเติมน้ำยา",
      sections: [
        {
          heading: "Caliburn G3 กับ G3 Pro ต่างกันยังไง",
          paragraphs: [
            "G3 ตัวเครื่องเป็นอะลูมิเนียม หนักประมาณ 47 กรัม ส่วน G3 Pro หนักประมาณ 92 กรัม น้ำหนักของ G3 จึงราวครึ่งหนึ่งของ G3 Pro",
            "[G3 Pro](/products/caliburn-g3-pro) แบตใหญ่กว่าที่ 1000mAh ปรับได้สูงสุด 35 วัตต์ มีจอเต็มหน้าเครื่อง และมีวาล์วสำหรับปรับลมแบบละเอียด",
            "G3 Pro ใช้หัวพอต G3 ได้ทุกค่า ทั้ง 0.6 0.9 และ 1.2 โอห์ม วันหนึ่งถ้าเปลี่ยนเครื่อง หัวพอตเดิมก็ยังใช้ต่อได้",
            "G3 เหมาะกับคนที่เน้นเครื่องเบาและพกง่าย ส่วนรุ่น Pro เหมาะกับคนที่อยากเห็นข้อมูลบนจอใหญ่และอยากปรับลมเอง",
          ],
        },
        {
          heading: "เลือกหัวพอตกี่โอห์มดี",
          paragraphs: [
            "หัวพอต G3 มีสามค่า คือ 0.6 0.9 และ 1.2 โอห์ม โอห์มยิ่งต่ำลมยิ่งโล่งและใช้วัตต์สูงขึ้น โอห์มยิ่งสูงลมก็ยิ่งแน่น",
            "ตามตารางหัวพอตของ UWELL ฝั่งโอห์มต่ำเหมาะกับการสูบแบบ RDL ส่วนฝั่งโอห์มสูงเหมาะกับการสูบแบบ MTL คือดูดเข้าปากก่อน",
            "ในกล่องมีหัว 0.6 และ 0.9 โอห์มมาให้ ลองทั้งสองหัวก่อนก็ได้ ถ้ายังรู้สึกว่าลมโล่งไป หัว 1.2 โอห์มจะให้ลมแน่นขึ้นอีก",
          ],
        },
        {
          heading: "เติมด้านข้างกับเติมด้านบนต่างกันยังไง",
          paragraphs: [
            "หัวพอต G3 มีสองแบบ ต่างกันที่ตำแหน่งช่องเติมน้ำยา แบบหนึ่งอยู่ด้านข้าง อีกแบบอยู่ด้านบน",
            "เครื่องแต่ละชุดให้หัวพอตมาแบบเดียว ถ้าจะซื้อหัวพอตเพิ่ม ให้ดูแบบเติมจากหัวที่ได้มาในกล่อง",
          ],
        },
      ],
    },
    en: {
      lede: "The Caliburn G3 is the standard model in the G3 line, small and light. Below: how it differs from the G3 Pro, which pod resistance to pick, and the two ways to fill.",
      sections: [
        {
          heading: "How is the Caliburn G3 different from the G3 Pro?",
          paragraphs: [
            "The G3 has an aluminium body and weighs about 47g; the G3 Pro is about 92g, so the G3 is close to half the weight.",
            "The [G3 Pro](/products/caliburn-g3-pro) has the bigger battery at 1000mAh, goes up to 35W, has a full-front screen and a valve to fine-tune the airflow.",
            "The G3 Pro takes every G3 pod — 0.6Ω, 0.9Ω and 1.2Ω — so your pods carry over if you change devices.",
            "The G3 suits you if light and easy to carry matters most; the G3 Pro suits you if you want a big screen and airflow you tune yourself.",
          ],
        },
        {
          heading: "Which pod resistance?",
          paragraphs: [
            "G3 pods come in 0.6Ω, 0.9Ω and 1.2Ω. The lower the resistance, the looser the draw and the higher the wattage; the higher it is, the tighter the draw.",
            "On UWELL's pod chart, the low end suits an RDL draw and the high end an MTL draw.",
            "The box has a 0.6Ω and a 0.9Ω pod, so try both first. If the draw still feels too loose, a 1.2Ω pod tightens it further.",
          ],
        },
        {
          heading: "Side fill or top fill?",
          paragraphs: [
            "G3 pods come in two versions that differ in where the fill port sits: one on the side, one on the top.",
            "Each kit comes with one type. When you buy more pods, check the fill type of the pod that came in your box.",
          ],
        },
      ],
    },
    zh: {
      lede: "Caliburn G3 是 G3 系列的标准款，机身小巧轻便。下面是选购前值得了解的几点：和 G3 Pro 的区别、烟弹阻值怎么选，以及两种注油方式。",
      sections: [
        {
          heading: "Caliburn G3 和 G3 Pro 有什么不同？",
          paragraphs: [
            "G3 采用铝合金机身，约 47 克；G3 Pro 约 92 克，G3 轻了将近一半。",
            "[G3 Pro](/products/caliburn-g3-pro) 电池更大，1000mAh，最高 35W，正面整块屏幕，还有可微调的进气阀。",
            "0.6Ω、0.9Ω 和 1.2Ω 的 G3 烟弹在 G3 Pro 上也能用，以后换机，烟弹可以继续用。",
            "更看重轻巧好携带，G3 就够了；想在大屏上看清各项数据、自己调气流，就选 G3 Pro。",
          ],
        },
        {
          heading: "烟弹选哪个阻值？",
          paragraphs: [
            "G3 烟弹有 0.6Ω、0.9Ω 和 1.2Ω 三种。阻值越低，吸感越松、功率越高；阻值越高，吸感越紧。",
            "在 UWELL 的烟弹图里，低阻值一端适合 RDL，高阻值一端适合 MTL。",
            "盒内附 0.6Ω 和 0.9Ω 两颗烟弹，可以先都试试。如果还是觉得太松，1.2Ω 会更紧一些。",
          ],
        },
        {
          heading: "侧注油还是顶注油？",
          paragraphs: [
            "G3 烟弹有两种版本，区别在注油口的位置：一种在侧面，一种在顶部。",
            "每套只附其中一种。再买烟弹时，先看看盒里那颗是哪种注油方式。",
          ],
        },
      ],
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
            "ถ้าชอบเปลี่ยนถ่านเอง DRAG X3 จะตรงกว่า ถ้าอยากได้แบตในตัวโดยไม่ต้องใช้วัตต์สูง DRAG S3 ก็เพียงพอ ส่วนช่วงวัตต์ที่กว้างที่สุดในสามรุ่นนี้อยู่ที่ DRAG 6",
            "ทั้งสามรุ่นในตระกูล DRAG เทียบกันทีละเรื่องไว้ที่ [DRAG 6 กับ DRAG S3 ต่างกันยังไง](/guides/comparing-voopoo-drag-models)"
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
            "ถังน้ำยา UFORCE-X Tank II ของ DRAG 6 ก็ใช้คอยล์ PnP X ได้เหมือนกัน ถ้าเน้นวัตต์สูงเป็นหลัก DRAG 6 จะเหมาะกว่า ส่วนถ้าอยากได้เครื่องที่เล็กกว่า DRAG S3 จะตรงกว่า",
            "ทั้งสามรุ่นในตระกูล DRAG เทียบกันทีละเรื่องไว้ที่ [DRAG 6 กับ DRAG S3 ต่างกันยังไง](/guides/comparing-voopoo-drag-models)"
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
            "ถ้าอยากได้เครื่องที่เสียบสายชาร์จได้เลยโดยไม่ต้องดูแลเรื่องถ่าน DRAG S3 จะเหมาะกว่า ถ้าชอบเลือกถ่านเอง และอยากได้วัตต์ที่สูงกว่ากับจอที่ใหญ่กว่า DRAG X3 จะตรงกว่า",
            "ทั้งสามรุ่นในตระกูล DRAG เทียบกันทีละเรื่องไว้ที่ [DRAG 6 กับ DRAG S3 ต่างกันยังไง](/guides/comparing-voopoo-drag-models)"
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
  // Site-wide template round batch 2e (04/10): from VOOPOO's ARGUS G4 mini / G3 mini pages and posters; Thai = thai-copy 04/10.
  "argus-g4-mini": {
    th: {
      lede: "ARGUS G4 mini เป็นรุ่นที่ VOOPOO ออกแบบให้หัวพอตหัวเดียวใช้ได้สองค่าโอห์ม ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS G4 mini กับ ARGUS G4 เลือกตัวไหนดี",
          paragraphs: [
            "[ARGUS G4](/products/argus-g4) มีจอ 0.85 นิ้วที่แสดงแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ ตั้งวัตต์ได้สูงกว่า และชาร์จผ่าน USB-C 5V/2A ส่วนตัวเครื่องทำจากซิงค์อัลลอย หนัง และอะลูมิเนียมอัลลอย",
            "ถ้าดูสถานะจากไฟก็เพียงพอแล้ว G4 mini จะเหมาะกว่า"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "VOOPOO ระบุว่าใช้ได้ทั้ง Multi-Ohm Cartridge กับ Snap Cartridge และ Top Fill Cartridge V2 ทั้งขนาด 2mL และ 3mL รวมถึงหัวพอต ARGUS รุ่นอื่น ๆ ซึ่งนับรุ่น CRC ไว้ด้วย",
            "ร้านเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือกหลายค่าโอห์ม และใช้กับ ARGUS G4 mini ได้ตามที่ VOOPOO ระบุไว้ข้างต้น"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS G4 mini หัวพอต ARGUS Multi-Ohm Cartridge สองหัว สายชาร์จ USB-C คู่มือการใช้งาน และการ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "VOOPOO built the ARGUS G4 mini around one idea: a single cartridge with two resistances. Below, one part at a time.",
      sections: [
        {
          heading: "ARGUS G4 mini or ARGUS G4?",
          paragraphs: [
            "The [ARGUS G4](/products/argus-g4) adds a 0.85-inch screen that shows battery, wattage, resistance, lock state and puff count, a higher power ceiling and 5V/2A charging, in a body of zinc alloy, leather and aluminium alloy.",
            "If the light tells you enough, the G4 mini is the one."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "VOOPOO lists the Multi-Ohm Cartridge, the Snap Cartridge, the Top Fill Cartridge V2 (2mL and 3mL) and other ARGUS cartridges, CRC versions included.",
            "We carry [VOOPOO Argus Pod cartridges](/products/coil-21) in several resistances, and VOOPOO's list above covers them for the G4 mini."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS G4 mini, two Multi-Ohm Cartridges, a USB-C cable, the user manual and VOOPOO's ARGUS pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "VOOPOO 围绕一个想法打造了 ARGUS G4 mini：一颗烟弹，两种阻值。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS G4 mini 还是 ARGUS G4？",
          paragraphs: [
            "[ARGUS G4](/products/argus-g4) 多了一块 0.85 英寸屏幕，显示电量、功率、阻值、锁定状态和口数，功率上限更高，支持 5V/2A 充电，机身用锌合金、皮革和铝合金。",
            "如果看指示灯就够了，就选 G4 mini。"
          ]
        },
        {
          heading: "能用哪些烟弹，去哪里买？",
          paragraphs: [
            "VOOPOO 列出的有 Multi-Ohm Cartridge、Snap Cartridge、Top Fill Cartridge V2（2mL 和 3mL），以及其他 ARGUS 烟弹，包括 CRC 版本。",
            "本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)，有多种阻值可选；按上面 VOOPOO 的说明，可用于 ARGUS G4 mini。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS G4 mini 主机、两颗 Multi-Ohm Cartridge、USB-C 数据线、使用说明书，以及 VOOPOO 的 ARGUS 烟弹家族兼容指南。"
          ]
        }
      ]
    },
  },
  "argus-g3-mini": {
    th: {
      lede: "ARGUS G3 mini เป็นรุ่นที่ VOOPOO ทำมาให้ใช้ง่าย และตัวเล็กจนกำไว้ในมือได้มิด ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS G3 mini กับ ARGUS G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) มีแบตใหญ่กว่าที่ 1650mAh ใช้หัวพอตที่กลับด้านเพื่อเปลี่ยนโอห์มได้ และมีปุ่มเลื่อนปรับลม",
            "ถ้าเน้นเครื่องที่เบากว่า ใช้ง่ายกว่า และพอใจกับช่องลมแบบคงที่ G3 mini ก็เพียงพอแล้ว"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "VOOPOO ระบุว่าหัวพอต ARGUS Top Fill Cartridge V2 ใช้ได้กับเครื่องในตระกูล ARGUS ทั้งหมด และแนะนำให้เช็คค่าโอห์มกับวัตต์ของแต่ละเครื่องก่อนใช้",
            "หน้า [หัวพอต VOOPOO Argus Pod](/products/coil-21) บนเว็บเรามีตัวเลือกหัวเติมด้านบน 0.4 และ 0.7 โอห์ม อยู่ในช่วง 0.4–1.0 โอห์มที่ VOOPOO ระบุไว้สำหรับ G3 mini ส่วนตัวเลือก 1.2 โอห์มเป็นหัวเติมด้านข้าง อยู่นอกช่วงของรุ่นนี้"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS G3 mini หัวพอต ARGUS Top Fill Cartridge V2 หนึ่งหัว สายชาร์จ USB-C คู่มือการใช้งาน และการ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "The ARGUS G3 mini is the small one: simple to use, and small enough to fit in the palm of your hand. Below, one thing at a time.",
      sections: [
        {
          heading: "ARGUS G3 mini or ARGUS G4 mini?",
          paragraphs: [
            "The [ARGUS G4 mini](/products/argus-g4-mini) has a bigger 1650mAh battery, a cartridge you flip to change resistance and an airflow slider.",
            "If you want a lighter, simpler device and are happy with fixed airflow, the G3 mini is enough."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "The ARGUS Top Fill Cartridge V2 fits the whole ARGUS pod family; VOOPOO asks you to check the resistance and output against the device.",
            "Our [VOOPOO Argus Pod cartridges](/products/coil-21) listing includes Top Fill cartridges at 0.4 and 0.7Ω, inside the 0.4–1.0Ω range VOOPOO gives for the G3 mini; its 1.2Ω option is a side-fill pod, outside that range."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS G3 mini, one ARGUS Top Fill Cartridge V2, a USB-C cable, the user manual and VOOPOO's ARGUS pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "ARGUS G3 mini 是小巧的那一款：用起来简单，握在掌心刚刚好。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS G3 mini 还是 ARGUS G4 mini？",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) 电池更大（1650mAh），烟弹翻转即可切换阻值，还有进气滑块。",
            "如果你想要更轻、更简单的机器，固定进气也合你意，G3 mini 就够了。"
          ]
        },
        {
          heading: "能用哪些烟弹，去哪里买？",
          paragraphs: [
            "ARGUS Top Fill Cartridge V2 兼容整个 ARGUS 烟弹家族；VOOPOO 提醒按阻值和功率确认是否适配。",
            "本店的 [VOOPOO Argus Pod 烟弹](/products/coil-21) 有 0.4 和 0.7 欧姆的 Top Fill 选项，在 VOOPOO 为 G3 mini 标注的 0.4–1.0 欧姆范围内；1.2 欧姆选项是侧注式烟弹，不在这一范围内。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS G3 mini 主机、一颗 ARGUS Top Fill Cartridge V2、USB-C 数据线、使用说明书，以及 VOOPOO 的 ARGUS 烟弹家族兼容指南。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 2f (05/10): from VOOPOO's ARGUS P3 / VMATE i3 pages and posters; Thai = thai-copy 05/10.
  "argus-p3": {
    th: {
      lede: "ARGUS P3 เป็นรุ่นที่ VOOPOO ใส่ความสามารถไว้หลายอย่างในตัวเครื่องเดียว ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS P3 กับ ARGUS G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) ไม่มีจอ ใช้วิธีกลับด้านหัวพอตเพื่อเปลี่ยนโอห์ม และเบากว่าที่ 56 กรัม",
            "ถ้าอยากมีจอไว้ดูข้อมูลการสูบของตัวเอง P3 จะเหมาะกว่า โดยตัวเครื่องหนัก 82 กรัม"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "VOOPOO ระบุว่าใช้ได้ทั้ง Snap Cartridge และ Top Fill Cartridge V2 รวมถึง Top Fill Cartridge และหัวพอตรุ่น CRC",
            "ร้านเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือกหลายค่าโอห์ม ก่อนสั่ง แนะนำให้เทียบค่าโอห์มกับวัตต์ของ P3 ตามที่ VOOPOO ระบุไว้อีกครั้ง"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS P3 หัวพอต ARGUS Snap Cartridge สองหัว คือ 0.4 โอห์มและ 0.7 โอห์ม สายชาร์จ USB-C คู่มือการใช้งาน คู่มือเริ่มใช้งานฉบับย่อ และการ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "The ARGUS P3 is VOOPOO's do-a-lot device in one small body. Below, one part at a time.",
      sections: [
        {
          heading: "ARGUS P3 or ARGUS G4 mini?",
          paragraphs: [
            "The [ARGUS G4 mini](/products/argus-g4-mini) has no screen at all: you flip its cartridge to change resistance, and it is lighter at 56g.",
            "If you want a screen that shows your vaping data, the P3 is the one; it weighs 82g."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "VOOPOO lists the Snap Cartridge, the Top Fill Cartridge V2, the Top Fill Cartridge and their CRC versions.",
            "We carry [VOOPOO Argus Pod cartridges](/products/coil-21) in several resistances. Before you order, check the resistance and output against the P3, as VOOPOO advises."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS P3, two ARGUS Snap Cartridges (0.4Ω and 0.7Ω), a USB-C cable, the user manual, a quick start guide and VOOPOO's ARGUS pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "ARGUS P3 是 VOOPOO 一款功能很多的机型。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS P3 还是 ARGUS G4 mini？",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) 完全没有屏幕：翻转烟弹即可切换阻值，重量也更轻，只有 56g。",
            "如果想要一块能看抽吸数据的屏幕，就选 P3；它重 82g。"
          ]
        },
        {
          heading: "能用哪些烟弹？去哪里买？",
          paragraphs: [
            "VOOPOO 列出的有 Snap 烟弹、Top Fill Cartridge V2、Top Fill Cartridge 以及它们的 CRC 版本。",
            "本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)，有多种阻值可选。下单前请按 VOOPOO 的提示，对照 P3 核对阻值和功率。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS P3 主机、两颗 ARGUS Snap 烟弹（0.4Ω 和 0.7Ω）、一条 USB-C 数据线、使用说明书、快速入门指南，以及 VOOPOO 的 ARGUS 烟弹兼容指南。"
          ]
        }
      ]
    },
  },
  "vmate-i3": {
    th: {
      lede: "VMATE i3 เป็นรุ่นที่ VOOPOO ทำมาให้หยิบใช้ได้ง่ายในทุกวัน ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "VMATE i3 กับ ARGUS G3 mini เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นไม่มีปุ่ม สูบได้เลยเหมือนกัน ส่วน [ARGUS G3 mini](/products/argus-g3-mini) ตัวเล็กกว่า เบากว่าที่ 40.85 กรัม ใช้แบต 1350mAh และช่องลมเป็นแบบคงที่",
            "ถ้าอยากปรับช่องลมได้เอง VMATE i3 จะเหมาะกว่า โดยเครื่องนี้ใช้หัวพอตตระกูล VMATE แทนหัวพอต ARGUS"
          ]
        },
        {
          heading: "หาซื้อหัวพอต VMATE ได้ที่ไหน",
          paragraphs: [
            "ร้านเรามี [หัวพอต VOOPOO VMATE](/products/coil-72) ขายอยู่ ก่อนสั่ง แนะนำให้เทียบค่าโอห์มกับตารางด้านบนอีกครั้ง"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง VMATE i3 หัวพอต VMATE Top Fill Cartridge 0.7 โอห์ม หนึ่งหัว สายชาร์จ USB-C คู่มือการใช้งาน และการ์ดรายชื่อหัวพอตตระกูล VMATE ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "The VMATE i3 is VOOPOO's easy, everyday pod kit. Below, one part at a time.",
      sections: [
        {
          heading: "VMATE i3 or ARGUS G3 mini?",
          paragraphs: [
            "Both fire when you draw. The [ARGUS G3 mini](/products/argus-g3-mini) is smaller and lighter at 40.85g, with a 1350mAh battery and fixed airflow.",
            "The VMATE i3 is the one to pick if you want to open or close the airflow yourself, and it takes VMATE pods instead of ARGUS ones."
          ]
        },
        {
          heading: "Where do I get VMATE pods?",
          paragraphs: [
            "We carry [VOOPOO VMATE pods](/products/coil-72). Check the resistance against the table above before you order."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The VMATE i3, one VMATE Top Fill Cartridge 0.7Ω, a USB-C cable, the user manual and VOOPOO's VMATE pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "VMATE i3 是 VOOPOO 一款日常用起来很省心的主机。下面逐项来看。",
      sections: [
        {
          heading: "VMATE i3 还是 ARGUS G3 mini？",
          paragraphs: [
            "两款都是吸气启动。[ARGUS G3 mini](/products/argus-g3-mini) 更小更轻，40.85g，电池 1350mAh，进气量固定。",
            "如果你想自己调节进气大小，就选 VMATE i3；它用的是 VMATE 烟弹，而不是 ARGUS 烟弹。"
          ]
        },
        {
          heading: "去哪里买 VMATE 烟弹？",
          paragraphs: [
            "本店有售 [VOOPOO VMATE 烟弹](/products/coil-72)。下单前请对照上面的表格核对阻值。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "VMATE i3 主机、一颗 VMATE Top Fill Cartridge 0.7Ω、一条 USB-C 数据线、使用说明书，以及 VOOPOO 的 VMATE 烟弹兼容指南。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 2g (05/10): from VOOPOO's ARGUS G4 page and posters; Thai = thai-copy 05/10.
  "argus-g4": {
    th: {
      lede: "ARGUS G4 เป็นรุ่นที่ VOOPOO ใส่จอและปุ่ม ให้ตั้งค่าเครื่องได้เอง ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS G4 กับ ARGUS G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นใช้หัวพอต Multi-Ohm เหมือนกัน ส่วน [ARGUS G4 mini](/products/argus-g4-mini) ไม่มีจอ เปลี่ยนโอห์มได้สองค่าด้วยการกลับด้านหัวพอต และหนัก 56 กรัม",
            "ถ้าอยากดูสถานะเครื่องบนจอ และอยากได้ค่าโอห์มที่สามจากการกดปุ่ม G4 จะเหมาะกว่า"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "หัวพอต ARGUS ที่ไล่ไว้ด้านบนใช้กับเครื่องนี้ได้ทุกหัว และร้านเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือกหลายค่าโอห์ม"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS G4 หัวพอต ARGUS Multi-Ohm Cartridge สองหัว สายชาร์จ USB-C คู่มือการใช้งาน การ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้ และสายคล้องคอ"
          ]
        }
      ]
    },
    en: {
      lede: "On the ARGUS G4, VOOPOO adds a screen and a button so you can set the device up yourself. Below, one part at a time.",
      sections: [
        {
          heading: "ARGUS G4 or ARGUS G4 mini?",
          paragraphs: [
            "Both take the Multi-Ohm cartridge. The [ARGUS G4 mini](/products/argus-g4-mini) has no screen and switches between two resistances by flipping the pod; it weighs 56g.",
            "If you want to see the device's status on a screen and get a third resistance at the press of the button, the G4 is the one."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "Every ARGUS pod in the block above fits, and we carry [VOOPOO Argus Pod cartridges](/products/coil-21) in several resistances."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS G4, two ARGUS Multi-Ohm Cartridges, a USB-C cable, the user manual, VOOPOO's ARGUS pod-family compatibility guide and a lanyard."
          ]
        }
      ]
    },
    zh: {
      lede: "ARGUS G4 是 VOOPOO 加了屏幕和按键、可以自己设置的机型。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS G4 还是 ARGUS G4 mini？",
          paragraphs: [
            "两款都用 Multi-Ohm 烟弹。[ARGUS G4 mini](/products/argus-g4-mini) 没有屏幕，靠翻转烟弹在两种阻值之间切换，重 56g。",
            "想在屏幕上看机器状态，还想按键切出第三种阻值，就选 G4。"
          ]
        },
        {
          heading: "能用哪些烟弹？去哪里买？",
          paragraphs: [
            "上面列出的 ARGUS 烟弹都能用。本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)，有多种阻值可选。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS G4 主机、两颗 ARGUS Multi-Ohm 烟弹、一条 USB-C 数据线、使用说明书、VOOPOO 的 ARGUS 烟弹兼容指南，以及一条挂绳。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 3a (05/10): from SALTHUB's Zero Pro page and posters; Thai = thai-copy 05/10.
  "zero-pro": {
    th: {
      lede: "Zero Pro เป็นเครื่องในตระกูล Zero ของ SALTHUB ตัวเครื่องกะทัดรัด ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ใช้กับหัวพอตอะไร",
          paragraphs: [
            "Zero Pro ใช้หัวพอต Zero ซึ่งบนเว็บของ SALTHUB จัดไว้ในหมวดกลิ่นของ Zero Pro ส่วนตัวเลข 5,000 พัฟ มาจากโปสเตอร์ของ Zero Pro ที่ SALTHUB ทำไว้ ดูรายละเอียดหัวพอตได้ที่ [หน้าหัวพอต Zero](/products/zero-cartridge)"
          ]
        },
        {
          heading: "ชื่อสีของ SALTHUB กับชื่อบนเว็บเรา",
          paragraphs: [
            "SALTHUB เรียกชื่อสีบางสีต่างจากเรา ส่วน Red กับ Black ใช้ชื่อเดียวกัน",
            "Flesh Pink คือสี Pink บนเว็บเรา",
            "Black and Red Gradient คือสี Charcoal Red บนเว็บเรา",
            "Blue-Purple Gradient คือสี Blue Purple บนเว็บเรา",
            "Silver-Grey คือสี Gunmetal บนเว็บเรา",
            "Light Blue คือสี Teal บนเว็บเรา",
            "Yellow and Black Gradient คือสี Golden Fade บนเว็บเรา"
          ]
        }
      ]
    },
    en: {
      lede: "The Zero Pro is a compact device in SALTHUB's Zero line. Below, one part at a time.",
      sections: [
        {
          heading: "Which cartridge does it take?",
          paragraphs: [
            "The Zero Pro takes the Zero pods, which SALTHUB's site lists among the Zero Pro's flavours. The 5,000-puff figure is the one SALTHUB prints on its Zero Pro poster. See the pods on our [Zero pod page](/products/zero-cartridge)."
          ]
        },
        {
          heading: "SALTHUB's colour names and ours",
          paragraphs: [
            "SALTHUB names some colours differently from us; Red and Black are the same on both.",
            "Flesh Pink is our Pink.",
            "Black and Red Gradient is our Charcoal Red.",
            "Blue-Purple Gradient is our Blue Purple.",
            "Silver-Grey is our Gunmetal.",
            "Light Blue is our Teal.",
            "Yellow and Black Gradient is our Golden Fade."
          ]
        }
      ]
    },
    zh: {
      lede: "Zero Pro 是 SALTHUB Zero 系列里一款小巧的机型。下面逐项来看。",
      sections: [
        {
          heading: "用哪种烟弹？",
          paragraphs: [
            "Zero Pro 用的是 Zero 烟弹，SALTHUB 官网把它们归在 Zero Pro 的口味里。5,000 口这个数字来自 SALTHUB 的 Zero Pro 海报。烟弹详情见 [Zero 烟弹页面](/products/zero-cartridge)。"
          ]
        },
        {
          heading: "SALTHUB 的颜色名与本站对照",
          paragraphs: [
            "SALTHUB 有几种颜色的叫法和我们不同，Red 和 Black 两边一样。",
            "Flesh Pink 即本站的 Pink。",
            "Black and Red Gradient 即本站的 Charcoal Red。",
            "Blue-Purple Gradient 即本站的 Blue Purple。",
            "Silver-Grey 即本站的 Gunmetal。",
            "Light Blue 即本站的 Teal。",
            "Yellow and Black Gradient 即本站的 Golden Fade。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 3b (05/10): from SALTHUB's M Switch Kit page and posters; Thai = thai-copy 05/10.
  "m-switch-kit": {
    th: {
      lede: "ด้านล่างไล่ดู M Switch Kit ทีละส่วนจากโปสเตอร์ของ SALTHUB เอง พร้อมบอกว่าแต่ละส่วนช่วยอะไรในการใช้งาน",
      sections: [
        {
          heading: "เลือกกลิ่นแล้ว ในชุดจะได้อะไรบ้าง",
          paragraphs: [
            "แต่ละกลิ่นมาเป็นชุด มีตัวเครื่องคู่กับหัวพอตกลิ่นนั้นหนึ่งหัว ถ้าอยากได้หัวพอตเพิ่มหรืออยากลองกลิ่นอื่น ดูได้ที่[หน้าหัวพอต](/products/m-switch-pod)"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the M Switch Kit one part at a time, from SALTHUB's own posters.",
      sections: [
        {
          heading: "What comes with each flavour?",
          paragraphs: [
            "Each flavour comes as the device with one pod of that flavour. Spare pods and other flavours are on the [pod page](/products/m-switch-pod)."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 SALTHUB 自己的海报，逐项来看 M Switch Kit。",
      sections: [
        {
          heading: "每个口味的套装里有什么？",
          paragraphs: [
            "每个口味都是主机加一颗该口味的烟弹。备用烟弹见[烟弹页面](/products/m-switch-pod)。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 4a (06/10): from JOIWAY's own F3 posters; Thai = thai-copy 06/10.
  "joiway-f3": {
    th: {
      lede: "ด้านล่างไล่ดู JOIWAY F3 ทีละส่วนจากโปสเตอร์ของ JOIWAY เอง พร้อมบอกว่าแต่ละส่วนช่วยอะไรในการใช้งาน",
      sections: [
        {
          heading: "สูบได้กี่พัฟ และมีกลิ่นอะไรให้เลือกบ้าง",
          paragraphs: [
            "ตามโปสเตอร์หลักของ JOIWAY สูบได้ 12,000+ พัฟ ส่วนกลิ่นที่ JOIWAY มีให้เลือก เรารวมไว้ในตารางกลิ่นด้านบนแล้ว"
          ]
        }
      ]
    },
    en: {
      lede: "Below, a look at the JOIWAY F3 one part at a time, taken from JOIWAY's own posters.",
      sections: [
        {
          heading: "How many puffs, and which flavours?",
          paragraphs: [
            "JOIWAY's main poster gives 12,000+ puffs. The flavours JOIWAY offers are in the grid above."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 JOIWAY 自己的海报，逐项来看 JOIWAY F3。",
      sections: [
        {
          heading: "多少口？有哪些口味？",
          paragraphs: [
            "JOIWAY 主海报标注 12,000+ 口。JOIWAY 提供的口味都在上方的口味表里。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 4c (06/10): from RELX's own Smash Go 12K page; Thai = thai-copy 06/10.
  "relx-smash-go-12k": {
    th: {
      lede: "ด้านล่างไล่ดู RELX Smash Go 12K ทีละส่วนจากภาพของ RELX เอง",
      sections: [
        {
          heading: "ความเข้มข้นมีให้เลือกสองแบบ",
          paragraphs: [
            "RELX ทำ Smash Go 12K ไว้สองแบบ คือ salt nic 3% และ 5% ในตารางกลิ่นด้านบน กลิ่นที่ชื่อลงท้ายด้วย 5% คือแบบ 5%"
          ]
        }
      ]
    },
    en: {
      lede: "Below, a look at the RELX Smash Go 12K one part at a time, taken from RELX's own pictures.",
      sections: [
        {
          heading: "Two strengths to choose from",
          paragraphs: [
            "RELX makes the Smash Go 12K in two nicotine salt strengths, 3% and 5%. In the flavour grid above, the names ending in 5% are the 5% version."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 RELX 自己的图片，逐项来看 RELX Smash Go 12K。",
      sections: [
        {
          heading: "两种浓度可选",
          paragraphs: [
            "RELX 的 Smash Go 12K 有 3% 和 5% 两种盐尼古丁浓度。上方口味表里名称带 5% 的，就是 5% 浓度的版本。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 4d (06/10): from RELX's own Creator Pro Device + Creator Pod pages; Thai = thai-copy 06/10.
  "relx-creator": {
    th: {
      lede: "ด้านล่างไล่ดู RELX Creator ทีละส่วนจากภาพของ RELX เอง",
      sections: [
        {
          heading: "หัวพอตที่ทำมาคู่กัน",
          paragraphs: [
            "หัวพอต RELX Creator Pod มีความจุน้ำยา 2+8mL และใช้คอยล์ Dual Mesh ตามที่ RELX ระบุไว้"
          ]
        },
        {
          heading: "บนจอมีอะไรให้ดูบ้าง",
          paragraphs: [
            "นอกจากแบตกับโหมดที่ใช้อยู่ RELX บอกว่าจอพิกเซลของเครื่องนี้มีหน้าอีโมจิ 100+ แบบ ซึ่งปลดล็อกได้เรื่อย ๆ ระหว่างที่สูบ"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the RELX Creator one part at a time, from RELX's own pictures.",
      sections: [
        {
          heading: "The pod made for it",
          paragraphs: [
            "The RELX Creator Pod holds 2+8mL of e-liquid and uses a Dual Mesh coil, according to RELX."
          ]
        },
        {
          heading: "What's on the screen",
          paragraphs: [
            "Besides the battery and the mode you're in, RELX says the pixel screen has 100+ emoji faces that unlock as you puff."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 RELX 自己的图片，逐项来看 RELX Creator。",
      sections: [
        {
          heading: "与它配套的烟弹",
          paragraphs: [
            "据 RELX 标注，RELX Creator Pod 容量为 2+8mL，采用 Dual Mesh 线圈。"
          ]
        },
        {
          heading: "屏幕会显示什么",
          paragraphs: [
            "除了电量和当前模式，RELX 表示像素屏上有 100+ 个表情，会随着抽吸逐步解锁。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 5a (06/10): from WOTOFO's own nexBAR 18K pages (20mg + 50mg); Thai = thai-copy 06/10.
  "wotofo-nexbar-18k": {
    th: {
      lede: "ด้านล่างไล่ดู WOTOFO nexBAR 18K ทีละส่วนจากภาพของ WOTOFO เอง",
      sections: [
        {
          heading: "ความเข้มข้นที่มีให้เลือก",
          paragraphs: [
            "WOTOFO ทำ nexBAR 18K ออกมาสองความเข้มข้น คือ 20mg และ 50mg และแต่ละความเข้มข้นก็มีกลิ่นให้เลือกแยกกัน เลื่อนขึ้นไปดูรายชื่อกลิ่นได้"
          ]
        },
        {
          heading: "โหมด NORM กับ TURBO ต่างกันตรงไหน",
          paragraphs: [
            "WOTOFO บอกว่าโหมด NORM ให้วัตต์แบบสมดุล เหมาะกับการสูบในชีวิตประจำวัน ส่วนโหมด TURBO จะเพิ่มวัตต์ขึ้น และลมจะมีแรงต้านมากขึ้น ดูดแน่นขึ้น การสลับโหมดทำได้จากปุ่มเปิด-ปิดที่ก้นพอต ระหว่างที่จอติดอยู่ กดปุ่มหนึ่งครั้งก็สลับระหว่าง NORM กับ TURBO ได้ ส่วนการเปิดหรือปิดเครื่อง ให้กดปุ่มเดียวกันค้างไว้ 3 วินาที"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the WOTOFO nexBAR 18K one part at a time, from WOTOFO's own pictures.",
      sections: [
        {
          heading: "Which strength?",
          paragraphs: [
            "WOTOFO makes the nexBAR 18K in two nicotine strengths, 20mg and 50mg, and each comes with its own set of flavours. The flavour list above shows them."
          ]
        },
        {
          heading: "NORM or TURBO: what's the difference?",
          paragraphs: [
            "WOTOFO describes NORM as balanced power for everyday vaping. TURBO raises the power and adds airflow resistance for a tighter draw. To switch between them, press the power button on the base once while the screen is on. To turn the device on or off, hold the same button for 3 seconds."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 WOTOFO 自己的图片，逐项来看 WOTOFO nexBAR 18K。",
      sections: [
        {
          heading: "选哪种浓度？",
          paragraphs: [
            "WOTOFO 的 nexBAR 18K 有 20mg 和 50mg 两种尼古丁浓度，每种都有各自的口味。上方的口味列表都列出来了。"
          ]
        },
        {
          heading: "NORM 和 TURBO 有什么不同？",
          paragraphs: [
            "按照 WOTOFO 的说法，NORM 模式输出均衡，适合日常使用；TURBO 模式会提高功率，同时增加进气阻力，吸感更紧。屏幕亮着时，按一下底部的开关键，就能在 NORM 和 TURBO 之间切换。开关机则是长按同一个按键 3 秒。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 3c (06/10): from SALTHUB's M Bar 10K posters; Thai = thai-copy 05–06/10.
  // Owner 06/10 pm: its only section ("nicotine — not on the posters, ask LINE") went → lede only, no buyer-question block.
  "m-bar-10k": {
    th: {
      lede: "ด้านล่างไล่ดู M Bar 10K ทีละส่วนจากโปสเตอร์ของ SALTHUB เอง พร้อมบอกว่าแต่ละส่วนช่วยอะไรในการใช้งาน",
      sections: []
    },
    en: {
      lede: "Below, the M Bar 10K one part at a time, from SALTHUB's own posters.",
      sections: []
    },
    zh: {
      lede: "下面根据 SALTHUB 自己的海报，逐项来看 M Bar 10K。",
      sections: []
    },
  },
  // Site-wide template round batch 4e (06/10): from JOIWAY's own F4 TWINS posters; Thai = thai-copy 06/10.
  "joiway-f4": {
    th: {
      lede: "ด้านล่างไล่ดู F4 TWINS ทีละส่วน จากโปสเตอร์ของ JOIWAY เอง",
      sections: [
        {
          heading: "สูบได้กี่พัฟ",
          paragraphs: [
            "โปสเตอร์หน้าแรกของ JOIWAY ระบุไว้ที่ 20,000 พัฟต่อเครื่อง แบ่งเป็นฝั่งละ 10,000 พัฟ"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the F4 TWINS one part at a time, from JOIWAY's own posters.",
      sections: [
        {
          heading: "How many puffs?",
          paragraphs: [
            "JOIWAY's cover poster gives 20,000 puffs for the device: 10,000 on each side."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 JOIWAY 自己的海报，逐项来看 F4 TWINS。",
      sections: [
        {
          heading: "能抽多少口？",
          paragraphs: [
            "JOIWAY 的封面海报写的是整机 20,000 口：每边 10,000 口。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 4g (05/10): from TFIT's own M Power 20K posters + site; Thai = thai-copy 05/10.
  "tfit-m-power-20k": {
    th: {
      lede: "ด้านล่างไล่ดู M Power 20K ทีละส่วน จากโปสเตอร์ของ TFIT เอง",
      sections: [
        {
          heading: "สูบได้กี่พัฟ",
          paragraphs: [
            "TFIT ระบุไว้ว่าสูบได้สูงสุด 20,000 พัฟ ส่วนใช้จริงจะได้ใกล้ตัวเลขนี้แค่ไหน ขึ้นอยู่กับว่าสูบบ่อยและดูดแต่ละครั้งนานเท่าไหร่"
          ]
        },
        {
          heading: "มีน้ำยาเท่าไหร่ และนิโคตินเข้มข้นแค่ไหน",
          paragraphs: [
            "ตามสเปกของ TFIT ตัวเครื่องมีน้ำยาบรรจุมาให้แล้ว 18mL และความเข้มข้นของนิโคตินอยู่ที่ 30mg"
          ]
        },
        {
          heading: "รุ่นนี้เป็นของแบรนด์ไหน",
          paragraphs: [
            "M Power 20K เป็นรุ่นของ TFIT แบรนด์บุหรี่ไฟฟ้าในเครือ THINKVAPE ซึ่งก่อตั้งขึ้นในปี 2015 และบนตัวเครื่องก็มีคำว่า DESIGNED BY TFIT พิมพ์ไว้"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the M Power 20K one part at a time, from TFIT's own posters.",
      sections: [
        {
          heading: "How many puffs?",
          paragraphs: [
            "TFIT rates the M Power 20K at up to 20,000 puffs. How close you get depends on how often you draw and for how long."
          ]
        },
        {
          heading: "How much e-liquid, and how strong?",
          paragraphs: [
            "It comes prefilled with 18mL, at 30mg nicotine, per TFIT's spec card."
          ]
        },
        {
          heading: "Who makes it?",
          paragraphs: [
            "TFIT, a vape brand under THINKVAPE, founded in 2015. \"Designed by TFIT\" is printed on the device itself."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 TFIT 自己的海报，逐项来看 M Power 20K。",
      sections: [
        {
          heading: "能抽多少口？",
          paragraphs: [
            "TFIT 给出的数字是最多 20,000 口。实际能抽多少，取决于抽的频率和每口的长短。"
          ]
        },
        {
          heading: "烟油有多少？浓度多少？",
          paragraphs: [
            "按 TFIT 的规格卡，出厂预装 18mL，尼古丁 30mg。"
          ]
        },
        {
          heading: "是哪家做的？",
          paragraphs: [
            "TFIT，THINKVAPE 旗下的电子烟品牌，创立于 2015 年。机身上就印着 \"Designed by TFIT\"。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 3f (06/10): from SALTHUB's own M Bar 15K + M Switch Kit material; Thai = thai-copy 06/10.
  "m-bar-15k": {
    th: {
      lede: "ด้านล่างไล่ดู M Bar 15K ทีละส่วนจากโปสเตอร์ของ SALTHUB ตั้งแต่การเปลี่ยนหัวพอต คอยล์ หน้าจอ ไปจนถึงการชาร์จและการปรับลม",
      sections: [
        {
          heading: "M Bar 15K ต่างจาก M Switch Kit ตรงไหน",
          paragraphs: [
            "ทั้งสองรุ่นใช้ตัวเครื่อง M Switch แบบเดียวกัน มีหน้าจอ ปุ่มเลื่อนปรับลม และสายคล้องเหมือนกัน ความต่างอยู่ที่หัวพอต M Bar 15K ใช้หัวพอตใสที่มีคอยล์เซรามิก ส่วน [M Switch Kit](/products/m-switch-kit) ใช้หัวพอตสีดำที่มีคอยล์ cotton mesh"
          ]
        },
        {
          heading: "M Bar 15K สูบได้กี่พัฟ",
          paragraphs: [
            "SALTHUB ระบุว่า M Bar 15K สูบได้สูงสุด 15,000 พัฟ ส่วนใช้จริงจะได้ใกล้ตัวเลขนี้มากน้อยเท่าไร ขึ้นอยู่กับว่าสูบบ่อยเพียงใด และดูดแต่ละครั้งนานเท่าไร"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the M Bar 15K one part at a time from SALTHUB's posters: the swap-in cartridge, the coil, the screen, charging and airflow.",
      sections: [
        {
          heading: "M Bar 15K or M Switch Kit?",
          paragraphs: [
            "Both use the same M Switch body, with the screen, the airflow slider and the lanyard. The difference is the cartridge: the M Bar 15K takes SALTHUB's clear M Bar cartridge with a ceramic coil, the [M Switch Kit](/products/m-switch-kit) its black cartridge with a cotton mesh coil."
          ]
        },
        {
          heading: "How many puffs?",
          paragraphs: [
            "SALTHUB rates the M Bar 15K at up to 15,000 puffs. How close you get depends on how often you vape and how long each draw is."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 SALTHUB 的海报逐项来看 M Bar 15K：可换烟弹、线圈、屏幕、充电和进气。",
      sections: [
        {
          heading: "M Bar 15K 和 M Switch Kit 怎么选？",
          paragraphs: [
            "两者用的是同一台 M Switch 主机，屏幕、进气滑块和挂绳都一样。区别在烟弹：M Bar 15K 用 SALTHUB 的透明 M Bar 烟弹，陶瓷芯；[M Switch Kit](/products/m-switch-kit) 用黑色烟弹，棉网芯。"
          ]
        },
        {
          heading: "能抽多少口？",
          paragraphs: [
            "SALTHUB 标注 M Bar 15K 最多 15,000 口。实际能抽到多接近这个数字，取决于抽的频率和每口的长短。"
          ]
        }
      ]
    },
  },
  // Round seo-push-2710 (27/10, owner: the "more details" heading of these two pages had nothing under it but the grid).
  // Neither maker publishes a product page (INFY lists no 20K; Muro has no site), so every fact below is one of the page's
  // verified rows or its flavour list; the flavour groups are the shop's own, by the words in each name (thai-copy 27/10).
  // en/zh link only the guides that exist in those languages (the flavour and disposable guides are Thai only).
  "infy-20k": {
    th: {
      lede: "INFY 20K มีให้เลือก 24 กลิ่น ด้านล่างร้านจัดกลิ่นเป็นสายไว้ให้เลือกได้ง่ายขึ้น พร้อมเรื่องการปรับช่องลมและระยะเวลาใช้งานที่ควรรู้ก่อนเลือก",
      sections: [
        {
          heading: "INFY 20K กลิ่นไหนดี",
          paragraphs: [
            "กลิ่นไหนดีไม่มีคำตอบเดียว ขึ้นอยู่กับว่าชอบแนวไหน ลองเลือกจากสายก่อนก็ได้ ร้านจัดสายเองจากคำในชื่อกลิ่น ชื่อที่มี Mint หรือ Menthol อยู่สายเย็น ชื่อที่มี Grape อยู่สายองุ่น ชื่อชาอยู่สายชา และชื่อผลไม้อื่น ๆ อยู่สายผลไม้",
            "สายเย็นมี Mint กับ Menthol Freeze ส่วนสายองุ่นมี 6 กลิ่น คือ Grape Apple · Grape Lychee · Grape Aloe · Grape Bubblegum · Kyoho Grape และ Yoyo Grape มีทั้งองุ่นอย่างเดียว องุ่นคู่กับผลไม้ องุ่นคู่กับอโล และองุ่นคู่กับหมากฝรั่ง",
            "สายผลไม้มี 12 กลิ่น มีทั้งผลไม้อย่างเดียว อย่าง Lychee · Peach · Blueberry และผลไม้สองอย่างคู่กัน อย่าง Strawberry Kiwi กับ Watermelon Lychee ส่วน Strawberry Ice Cream กับ Watermelon Bubblegum ที่มีผลไม้คู่กับขนม ร้านก็จัดไว้ในสายนี้ด้วย",
            "สายชามี Milk Tea Cha กับ Matcha ส่วน Cola กับ Mineral Water ชื่อไม่ได้เป็นผลไม้หรือชา ร้านจึงจัดไว้เป็นแนวอื่น ถ้ายังไม่แน่ใจว่าจะเริ่มจากสายไหน อ่านวิธีเลือกได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "ปรับช่องลมแล้ว การสูบต่างกันยังไง",
          paragraphs: [
            "ถ้าเปิดช่องลมให้กว้างขึ้น การสูบจะโล่งขึ้น และควันจะเย็นและบางลง ถ้าหรี่ช่องลมให้แคบลง การสูบก็จะแน่นขึ้น ลองเริ่มจากระดับกลาง ๆ ก่อน แล้วค่อยปรับทีละน้อยจนได้แบบที่ชอบ",
            "ช่องลมแบบไหนเข้ากับแนวการสูบแบบไหน ร้านเล่าไว้ละเอียดที่[เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
          ],
        },
        {
          heading: "INFY 20K ใช้ได้นานแค่ไหน",
          paragraphs: [
            "ใช้ได้กี่วันไม่มีตัวเลขตายตัว ขึ้นอยู่กับว่าสูบถี่แค่ไหน และดูดแต่ละครั้งนานเท่าไร ตัวเครื่องมีน้ำยาบรรจุมาให้แล้ว 20mL พอน้ำยาหมดก็เปลี่ยนเป็นเครื่องใหม่ ส่วนถ้าแบตหมดก่อน ก็ชาร์จผ่าน USB-C แล้วใช้ต่อได้",
            "ตัวเลขพัฟที่พอตใช้แล้วทิ้งระบุไว้ควรอ่านยังไง และสูบแบบไหนถึงใช้ได้นานขึ้น ร้านเขียนไว้ที่[พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The INFY 20K comes in 24 flavours. Below, we've sorted them into groups to make choosing easier, with a word on airflow and on how long one lasts.",
      sections: [
        {
          heading: "Which INFY 20K flavour should I start with?",
          paragraphs: [
            "There's no single right answer, so start with the kind of flavour you like. We grouped them by the words in their names, not by INFY's own list: Mint or Menthol means cool, Grape means the grape group, tea names go under tea, and other fruit names under fruit.",
            "The cool group is Mint and Menthol Freeze. The grape group has six: Grape Apple, Grape Lychee, Grape Aloe, Grape Bubblegum, Kyoho Grape and Yoyo Grape.",
            "Fruit has 12, from single fruits such as Lychee, Peach and Blueberry to pairs like Strawberry Kiwi and Watermelon Lychee. Names that pair a fruit with a sweet, like Strawberry Ice Cream and Watermelon Bubblegum, sit here too.",
            "Tea is Milk Tea Cha and Matcha. That leaves Cola and Mineral Water, whose names point to neither fruit nor tea, so we list them as others.",
          ],
        },
        {
          heading: "How does adjusting the airflow change the draw?",
          paragraphs: [
            "Open the airflow wider and the draw gets looser, with cooler, thinner vapour. Close it down and the draw gets tighter. Start in the middle and adjust a little at a time until it feels right.",
            "Which airflow suits which draw style is covered in [Choosing Wattage & Airflow](/guides/choosing-wattage-and-airflow).",
          ],
        },
        {
          heading: "How long does an INFY 20K last?",
          paragraphs: [
            "There's no fixed number of days: it depends on how often you vape and how long each draw is. It comes prefilled with 20mL, and when that runs out it's time for a new one. If the battery runs low first, charge it over USB-C and carry on.",
          ],
        },
      ],
    },
    zh: {
      lede: "INFY 20K 共有 24 种口味。下面我们按类型分好了组，方便挑选，也顺带讲讲进气调节和能用多久。",
      sections: [
        {
          heading: "INFY 20K 哪个口味好？",
          paragraphs: [
            "没有标准答案，可以先从喜欢的类型选起。我们按口味名称里的词来分组，并非 INFY 官方分类：带 Mint 或 Menthol 的归为清凉，带 Grape 的归为葡萄，茶类名称归为茶，其他水果名称归为水果。",
            "清凉类有 Mint 和 Menthol Freeze。葡萄类有 6 款：Grape Apple、Grape Lychee、Grape Aloe、Grape Bubblegum、Kyoho Grape 和 Yoyo Grape。",
            "水果类有 12 款，既有 Lychee、Peach、Blueberry 这样的单一水果，也有 Strawberry Kiwi、Watermelon Lychee 这样的组合。水果搭配甜点的名称，比如 Strawberry Ice Cream 和 Watermelon Bubblegum，也归在这一类。",
            "茶类是 Milk Tea Cha 和 Matcha。剩下的 Cola 和 Mineral Water，名称既不是水果也不是茶，我们归为其他。",
          ],
        },
        {
          heading: "调节进气，吸感有什么不同？",
          paragraphs: [
            "进气开大，吸感更松，烟雾更凉、更薄；进气收小，吸感更紧。可以先从中间开始，再一点点调到自己喜欢的程度。",
            "不同吸法适合怎样的进气，详见[如何选择功率与进气量](/guides/choosing-wattage-and-airflow)。",
          ],
        },
        {
          heading: "INFY 20K 能用多久？",
          paragraphs: [
            "能用几天没有固定数字，取决于抽的频率和每口的长短。机身预装 20mL 烟油，抽完就换新的；如果电池先用完，用 USB-C 充电后可以继续使用。",
          ],
        },
      ],
    },
  },
  "muro-sc-8000": {
    th: {
      lede: "Muro SC 8000 มีให้เลือก 12 กลิ่น ด้านล่างร้านจัดกลิ่นเป็นสายไว้ให้เลือกได้ง่ายขึ้น พร้อมเรื่องการชาร์จ และความต่างจาก Muro รุ่นที่พัฟเยอะกว่า",
      sections: [
        {
          heading: "Muro SC 8000 กลิ่นไหนดี",
          paragraphs: [
            "กลิ่นไหนดีขึ้นอยู่กับว่าชอบแนวไหน ลองเลือกจากสายก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่นที่พิมพ์ไว้บนซองของแต่ละกลิ่น สายเย็นมี Extreme Menthol กับ Double Mint ถ้ากำลังหากลิ่นเมนทอล ชื่อในรายการคือ Extreme Menthol",
            "สายผลไม้มี 7 กลิ่น คือ Strawberry · Banana Strawberry · Mix Berries · Grape · Watermelon · Honey Lemon และ Apple Shisha สองกลิ่นหลังมีผลไม้คู่กับอย่างอื่นในชื่อ ร้านก็จัดไว้ในสายนี้ด้วย",
            "ส่วนแนวอื่นมี Cola · Mineral Water และ Yakult ชื่อในกลุ่มนี้เป็นเครื่องดื่ม ไม่ได้บอกว่าเป็นผลไม้ชนิดไหน วิธีเลือกกลิ่นจากชื่อ อ่านต่อได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "พอตใช้แล้วทิ้งที่ชาร์จซ้ำได้ ใช้ยังไง",
          paragraphs: [
            "Muro SC 8000 ชาร์จซ้ำได้ผ่านช่องชาร์จ USB-C ถ้าแบตหมดก่อนน้ำยา ก็เสียบสายชาร์จแล้วสูบต่อได้ ไม่ต้องเปลี่ยนเครื่องใหม่ทั้งที่น้ำยายังเหลืออยู่",
            "ชาร์จนานแค่ไหน ชาร์จข้ามคืนได้ไหม และชาร์จยังไงให้แบตใช้ได้นาน ร้านเล่าไว้ที่[ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
          ],
        },
        {
          heading: "Muro SC 8000 กับ Connector 20K ต่างกันยังไง",
          paragraphs: [
            "สองรุ่นนี้ใช้งานต่างกัน Muro SC 8000 เป็นพอตใช้แล้วทิ้ง แกะแล้วสูบได้เลย ส่วน [Muro Connector 20K](/products/muro-connector-20k) เป็นหัวพอตบรรจุสำเร็จ รองรับสูงสุด 20,000 พัฟ ต้องใส่กับตัวเครื่อง Creator ของ Muro หรือของ RELX ถ้ามีตัวเครื่องอยู่แล้วและสูบจัด Connector 20K ก็เป็นอีกรุ่นที่น่าดู",
          ],
        },
      ],
    },
    en: {
      lede: "The Muro SC 8000 comes in 12 flavours. Below, we've sorted them into groups to make choosing easier, with a note on charging and on how it differs from Muro's higher-puff model.",
      sections: [
        {
          heading: "Which Muro SC 8000 flavour should I start with?",
          paragraphs: [
            "Start with the kind of flavour you like. We grouped them by the words in the name printed on each pouch. The cool pair is Extreme Menthol and Double Mint; if you're after menthol, the name to look for is Extreme Menthol.",
            "Fruit has seven: Strawberry, Banana Strawberry, Mix Berries, Grape, Watermelon, Honey Lemon and Apple Shisha. The last two pair a fruit with something else, and we keep them here too.",
            "The rest are Cola, Mineral Water and Yakult, all named after drinks rather than a fruit.",
          ],
        },
        {
          heading: "What does rechargeable mean on a disposable?",
          paragraphs: [
            "The Muro SC 8000 charges through a USB-C port. If the battery runs out before the e-liquid does, charge it and keep going, with no need to replace a device that still has e-liquid left.",
            "How long to charge, whether overnight is fine and how to look after the battery are covered in [Battery care](/guides/battery-care-and-charging).",
          ],
        },
        {
          heading: "Muro SC 8000 or Connector 20K?",
          paragraphs: [
            "They work differently. The Muro SC 8000 is a disposable you open and use straight away, while the [Muro Connector 20K](/products/muro-connector-20k) is a prefilled pod rated for up to 20,000 puffs that fits a Muro Creator or RELX Creator device. If you already have one of those and vape a lot, the Connector 20K is worth a look.",
          ],
        },
      ],
    },
    zh: {
      lede: "Muro SC 8000 共有 12 种口味。下面我们按类型分好了组，方便挑选，也讲讲充电，以及它和 Muro 口数更多的型号有什么不同。",
      sections: [
        {
          heading: "Muro SC 8000 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。我们按每个包装袋上印的口味名称来分组。清凉类有 Extreme Menthol 和 Double Mint；想找薄荷醇口味，就选 Extreme Menthol。",
            "水果类有 7 款：Strawberry、Banana Strawberry、Mix Berries、Grape、Watermelon、Honey Lemon 和 Apple Shisha。后两款是水果搭配其他元素，也归在这一类。",
            "其余是 Cola、Mineral Water 和 Yakult，名称都是饮品，而不是某种水果。",
          ],
        },
        {
          heading: "可充电的一次性设备，用起来有什么不同？",
          paragraphs: [
            "Muro SC 8000 通过 USB-C 接口充电。如果电池比烟油先用完，充好电就能继续抽，不必在烟油还有剩余时就换新机。",
            "要充多久、能不能整夜充电、怎样让电池更耐用，详见[电池保养](/guides/battery-care-and-charging)。",
          ],
        },
        {
          heading: "Muro SC 8000 和 Connector 20K 怎么选？",
          paragraphs: [
            "两款的用法不同：Muro SC 8000 是一次性设备，拆开就能抽；[Muro Connector 20K](/products/muro-connector-20k) 则是预装烟油的烟弹，标注最多 20,000 口，需要装在 Muro Creator 或 RELX Creator 主机上使用。如果已经有主机、抽得又多，可以看看 Connector 20K。",
          ],
        },
      ],
    },
  },
  // List-new 30/10 (nexBar Switch 15K, warehouse-listed): no maker site. Facts = nexBar's own posters — the 15-flavour
  // line-up the warehouse keeps (Shipnity Max image 2764487: nexMesh Coil · 15000 puffs · 15ML · Nic 3%) and the
  // 10-flavour poster series a Thai shop carries verbatim (vmaniath.com/en/product/1273962: nexMesh Coil · 15000 puffs ·
  // 15ML; the pod prints "nexBar SWITCH 15K" + a flavour label). Which device the pod fits = retailer text only → not said
  // (THAI_STYLE §5 "ขยายเป็นทุกที่บนเว็บ") until the owner confirms it from the shop's own stock.
  // SEO (owner 30/10): H1 = the model name · H2 "รายละเอียดเพิ่มเติม" → H3 buyer questions · H2 "คำถามที่พบบ่อย".
  "nexbar-switch-15k-pod": {
    th: {
      lede: "nexBar Switch 15K เป็นหัวพอตบรรจุสำเร็จ เลือกกลิ่นแล้วได้หัวที่มีน้ำยากลิ่นนั้นมาในตัว ด้านล่างเล่าจากโปสเตอร์ของ nexBar ว่าในหัวมีอะไร และ 15 กลิ่นแบ่งเป็นแนวไหนบ้าง",
      sections: [
        {
          heading: "nexBar Switch 15K คืออะไร",
          paragraphs: [
            "nexBar Switch 15K เป็นหัวพอตบรรจุสำเร็จ หัวหนึ่งมีน้ำยา 15mL กับคอยล์ nexMesh อยู่ในตัว จึงไม่ต้องเติมน้ำยาหรือเปลี่ยนคอยล์เองเหมือนหัวพอตเปล่า",
            "ส่วนเลข 15K ในชื่อรุ่นมาจากตัวเลขบนโปสเตอร์ของ nexBar ที่ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟ",
          ],
        },
        {
          heading: "nexBar Switch 15K มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "รุ่นนี้มี 15 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 3 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice หรือเป็นมิ้นต์ ได้แก่ Blueberry Ice, Grape Ice, Watermelon Ice และ Mint",
            "สายผลไม้ ได้แก่ Grape Lychee, Lychee, Mango Peach, Peach Strawberry, Pink Berry, Mixberry, Pineapple, Strawberry Banana และ Strawberry Watermelon",
            "แนวอื่นมี Cola กับ Strawberry Custard",
          ],
        },
        {
          heading: "ดูยังไงว่าหัวที่ได้เป็นกลิ่นไหน",
          paragraphs: [
            "ด้านหน้าของหัวพอตพิมพ์โลโก้ nexBar กับคำว่า SWITCH 15K และมีป้ายชื่อกลิ่นอยู่ด้านล่าง ซื้อไปหลายกลิ่นก็ดูชื่อบนป้ายได้เลยว่าหัวไหนเป็นกลิ่นอะไร",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar Switch 15K หัวหนึ่งสูบได้กี่พัฟ",
          answer: "โปสเตอร์ของ nexBar ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟค่ะ ตัวเลขนี้เป็นค่าสูงสุดที่ผู้ผลิตบอก สูบจริงได้มากน้อยแค่ไหนขึ้นกับวิธีสูบของแต่ละคนนะคะ",
        },
        {
          question: "nexBar Switch 15K นิโคตินกี่ %",
          answer: "โปสเตอร์ของ nexBar ระบุความเข้มข้นนิโคติน 3% ค่ะ",
        },
      ],
    },
    en: {
      lede: "The nexBar Switch 15K is a prefilled pod: pick a flavour and the pod comes with that e-liquid inside. Below, from nexBar's own posters, what is in the pod and how the 15 flavours group.",
      sections: [
        {
          heading: "What is the nexBar Switch 15K?",
          paragraphs: [
            "The nexBar Switch 15K is a prefilled pod with 15mL of e-liquid and a built-in nexMesh coil, so there is no e-liquid to add and no coil to change as with an empty pod.",
            "The 15K in the name comes from nexBar's poster, which rates each pod for up to 15,000 puffs.",
          ],
        },
        {
          heading: "Which flavours does the nexBar Switch 15K come in?",
          paragraphs: [
            "There are 15 flavours. Grouped by name, they fall into three sets.",
            "Cool, with Ice in the name or mint: Blueberry Ice, Grape Ice, Watermelon Ice and Mint.",
            "Fruit: Grape Lychee, Lychee, Mango Peach, Peach Strawberry, Pink Berry, Mixberry, Pineapple, Strawberry Banana and Strawberry Watermelon.",
            "Others: Cola and Strawberry Custard.",
          ],
        },
        {
          heading: "How do I tell which flavour a pod is?",
          paragraphs: [
            "The front of the pod is printed with the nexBar logo and SWITCH 15K, with a flavour label below. If you buy several flavours, the label tells you which pod is which.",
          ],
        },
      ],
      faq: [
        {
          question: "How many puffs does one nexBar Switch 15K pod give?",
          answer: "nexBar's poster rates each pod for up to 15,000 puffs. That is the maker's maximum; how many you actually get depends on how you vape.",
        },
        {
          question: "What nicotine strength is the nexBar Switch 15K?",
          answer: "nexBar's poster gives a nicotine strength of 3%.",
        },
      ],
    },
    zh: {
      lede: "nexBar Switch 15K 是预装烟油的烟弹：选好口味，烟弹里就装着该口味的烟油。下面根据 nexBar 自己的海报，说明烟弹里有什么，以及 15 种口味怎么分。",
      sections: [
        {
          heading: "nexBar Switch 15K 是什么？",
          paragraphs: [
            "nexBar Switch 15K 是预装烟油的烟弹，每颗装有 15mL 烟油，并内置 nexMesh 线圈，不用像空烟弹那样自己加油、换线圈。",
            "名字里的 15K 来自 nexBar 海报上的数字：每颗烟弹最多 15,000 口。",
          ],
        },
        {
          heading: "nexBar Switch 15K 有哪些口味？",
          paragraphs: [
            "共 15 种口味，按名称大致分为三类。",
            "清凉系，名称带 Ice 或是薄荷：Blueberry Ice、Grape Ice、Watermelon Ice 和 Mint。",
            "水果系：Grape Lychee、Lychee、Mango Peach、Peach Strawberry、Pink Berry、Mixberry、Pineapple、Strawberry Banana 和 Strawberry Watermelon。",
            "其他：Cola 和 Strawberry Custard。",
          ],
        },
        {
          heading: "怎么分辨烟弹是哪种口味？",
          paragraphs: [
            "烟弹正面印有 nexBar 标志和 SWITCH 15K 字样，下方有口味标签。买了好几种口味，看标签就知道哪颗是什么味道。",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar Switch 15K 一颗能抽多少口？",
          answer: "nexBar 海报标注每颗最多 15,000 口。这是厂商给出的最大值，实际能抽多少取决于个人的抽吸习惯。",
        },
        {
          question: "nexBar Switch 15K 的尼古丁浓度是多少？",
          answer: "nexBar 海报标注的尼古丁浓度为 3%。",
        },
      ],
    },
  },
};

/** The active locale's article for a product, falling back to English; undefined when the product has none. */
export function productArticle(slug: string, locale: Locale): ProductArticleCopy | undefined {
  const rec = PRODUCT_ARTICLES[slug];
  return rec?.[locale] ?? rec?.en;
}
