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
  // Articles queue 0211 batch 5 (02/11): VOOPOO Vmate Pro 2 — facts = VOOPOO's Vmate Pro 2 and VMATE Top Fill pages (shop.voopoo.com,
  // in-app browser 02/11 via the details chat: the 0.4Ω pod added "to satisfy both RDL and MTL", the 0.4Ω "requires at least 30 W",
  // Top Fill 0.4/0.7/1.0Ω) + VOOPOO text found by search only (ECO adapts the wattage, side 0.54" OLED, auto-draw, stepless airflow,
  // 0.4Ω RDL 18–30W, 40-minute full charge). 0.7Ω's wattage left out: VOOPOO's pages disagree (15–25W vs 5–25W). Battery, wattage,
  // the in-box list and the 7 colours stay with the tagline, spec rows and option list. Thai = thai-copy 02/11.
  "vmate-pro-2": {
    th: {
      lede: "ด้านล่างเล่าตามข้อมูลของ VOOPOO ว่าหัวพอตสองค่าที่ให้มาใช้ต่างกันยังไง โหมด ECO ช่วยอะไร จอบอกอะไรบ้าง ปรับลมได้แบบไหน และชาร์จนานแค่ไหน",
      sections: [
        {
          heading: "หัวพอตสองค่าที่ให้มาใช้ต่างกันยังไง",
          paragraphs: [
            "VOOPOO บอกว่าเพิ่มหัวพอต 0.4 โอห์มเข้ามาคู่กับหัว 0.7 โอห์ม เพื่อให้เครื่องเดียวสูบได้ทั้งสองแบบ หัว 0.4 โอห์มใช้สูบแบบ RDL ที่ 18–30 วัตต์ ส่วนหัว 0.7 โอห์มใช้สูบแบบ MTL",
            "VOOPOO เตือนไว้ว่าหัว Top Fill 0.4 โอห์มต้องใช้กับเครื่องที่จ่ายไฟได้อย่างน้อย 30 วัตต์ ถ้าจะนำหัวนี้ไปใช้กับเครื่องอื่น ก็ควรเช็ควัตต์สูงสุดของเครื่องนั้นก่อน",
            "VOOPOO ยังทำหัว Top Fill แบบ 1.0 โอห์มด้วย ส่วนหัวพอตสำรองของรุ่นนี้ดูได้ที่หน้า [หัวพอต VMATE](/products/coil-72) และถ้าอยากรู้ว่าการสูบสองแบบนี้รู้สึกต่างกันแค่ไหน อ่านต่อได้ที่ [MTL กับ DTL สูบต่างกันยังไง แล้ว RDL คืออะไร](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "โหมด ECO ช่วยอะไร",
          paragraphs: [
            "VOOPOO บอกว่าโหมด ECO จะปรับวัตต์ให้เข้ากับวิธีสูบของแต่ละคน และกดปุ่มครั้งเดียวก็สลับไปโหมด POWER ได้",
          ],
        },
        {
          heading: "จอบอกอะไรบ้าง และปรับลมได้แบบไหน",
          paragraphs: [
            "ด้านข้างเครื่องมีจอ OLED ขนาด 0.54 นิ้ว ไว้บอกแบตที่เหลือ วัตต์ที่ใช้ และค่าโอห์มของหัวพอตที่ใส่อยู่",
            "เครื่องนี้สูบได้เลยโดยไม่ต้องกดปุ่ม และปรับช่องลมได้ละเอียดแบบไม่มีขั้น จะให้ลมแน่นหรือโล่งก็ปรับได้ตามที่ชอบ",
          ],
        },
        {
          heading: "ชาร์จนานแค่ไหน",
          paragraphs: [
            "VOOPOO บอกว่าชาร์จจนเต็มใช้เวลาประมาณ 40 นาที ส่วนวิธีชาร์จและดูแลแบตให้ใช้ได้นาน อ่านต่อได้ที่ [ชาร์จข้ามคืนได้ไหม และวิธีดูแลแบต](/guides/battery-care-and-charging)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, based on VOOPOO's own information: how the two included pods differ, what ECO mode does, what the screen shows and how the airflow adjusts, and how long a charge takes.",
      sections: [
        {
          heading: "How do the two included pods differ?",
          paragraphs: [
            "VOOPOO says it added a 0.4Ω pod alongside the 0.7Ω so one device covers both styles: the 0.4Ω is for RDL at 18–30W, the 0.7Ω for MTL.",
            "VOOPOO notes that the Top Fill 0.4Ω pod needs a device that can put out at least 30W, so check a device's maximum output before moving the pod to it.",
            "VOOPOO also makes the Top Fill in 1.0Ω. Spare pods for this kit are on the [VMATE pods](/products/coil-72) page, and how the two draw styles feel different is covered in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "What does ECO mode do?",
          paragraphs: [
            "VOOPOO says ECO mode adjusts the wattage to the way you vape, and a single press of the button switches to POWER mode.",
          ],
        },
        {
          heading: "What does the screen show, and how does the airflow adjust?",
          paragraphs: [
            "A 0.54-inch OLED on the side shows the battery left, the wattage in use and the resistance of the fitted pod. It fires as you draw, with no button to press, and the airflow adjusts steplessly from tight to open.",
          ],
        },
        {
          heading: "How long does a charge take?",
          paragraphs: [
            "VOOPOO says a full charge takes about 40 minutes. For keeping the battery healthy, see [battery care and charging](/guides/battery-care-and-charging).",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 VOOPOO 的资料，介绍随附两颗烟弹的区别、ECO 模式的作用、屏幕显示什么与气流如何调节，以及充电需要多久。",
      sections: [
        {
          heading: "随附的两颗烟弹有什么区别？",
          paragraphs: [
            "VOOPOO 表示，在 0.7Ω 之外加入 0.4Ω 烟弹，让一台设备兼顾两种抽法：0.4Ω 用于 RDL，功率 18–30W；0.7Ω 用于 MTL。",
            "VOOPOO 提醒，Top Fill 0.4Ω 烟弹需要输出至少 30W 的设备，换到其他设备使用前，请先确认该设备的最大输出功率。",
            "VOOPOO 的 Top Fill 烟弹还有 1.0Ω 版本。本套装的备用烟弹见[VMATE 烟弹](/products/coil-72)页面；两种抽法的感受有何不同，见[MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "ECO 模式有什么用？",
          paragraphs: [
            "VOOPOO 表示，ECO 模式会根据个人的抽吸习惯调整功率；按一下按键即可切换到 POWER 模式。",
          ],
        },
        {
          heading: "屏幕显示什么？气流怎么调？",
          paragraphs: [
            "机身侧面有一块 0.54 英寸 OLED 屏，显示剩余电量、当前功率和所装烟弹的阻值。吸即可用，无需按键；气流支持无级调节，可从紧调到松。",
          ],
        },
        {
          heading: "充电需要多久？",
          paragraphs: [
            "VOOPOO 表示，充满电约需 40 分钟。电池保养方法见[电池保养与充电](/guides/battery-care-and-charging)。",
          ],
        },
      ],
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
  // Round "queue 0211" articles, SALTHUB (02/11): from SALTHUB's M Switch Pod page + posters, its home page ("M Switch Pod"
  // card and "THE BENEFITS — M SWITCH POD") and its FAQ page — source per sentence: _incoming/articles-0211/salthub-draft.md.
  // Flavour groups = the 17 names on SALTHUB's page, sorted by name only (no taste claims).
  "m-switch-pod": {
    th: {
      lede: "M Switch Pod เป็นหัวพอตของ SALTHUB ข้อมูลในส่วนนี้สรุปจากหน้าเว็บและโปสเตอร์ของ SALTHUB ไว้ให้ ว่าหัวนี้ใช้ยังไง สูบได้กี่พัฟ และกลิ่นทั้งหมดแบ่งได้เป็นแนวไหน",
      sections: [
        {
          heading: "M Switch Pod ใช้ยังไง",
          paragraphs: [
            "ตัวเครื่องเก็บไว้ชาร์จแล้วใช้ต่อได้ ส่วนหัวพอตบรรจุน้ำยามาแล้ว ใช้หมดก็เปลี่ยนเป็นหัวใหม่ได้เลย",
            "ถ้าเพิ่งเริ่มใช้ เริ่มจากชุด [M Switch Kit](/products/m-switch-kit) ก็ได้ ในชุดมีตัวเครื่องมาพร้อมหัวพอตหนึ่งหัว",
            "ถ้ากำลังเทียบ M Switch กับเครื่องระบบสวิตช์ยี่ห้ออื่น ร้านเทียบไว้ทีละข้อที่ [Esko Bar Switch 20K กับ M Switch](/guides/esko-bar-switch-vs-m-switch)",
          ],
        },
        {
          heading: "M Switch Pod หัวหนึ่งสูบได้กี่พัฟ",
          paragraphs: [
            "โปสเตอร์ของ SALTHUB ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคน",
            "ข้างในใช้คอยล์ cotton mesh 1.0 โอห์ม ส่วนน้ำยาเป็น salt nic ความเข้มข้น 30mg ตามข้อมูลบนโปสเตอร์และหน้าแรกของเว็บ SALTHUB",
          ],
        },
        {
          heading: "M Switch Pod มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "บนหน้าเว็บของ SALTHUB หัวพอตรุ่นนี้มีให้เลือก 17 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 4 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice หรือ Mint ได้แก่ Blue Ice และ Doublemint",
            "สายองุ่น ได้แก่ Kyoho Grape · Grape · Grape Aloe และ Grape Lychee",
            "สายผลไม้อื่น ได้แก่ Apple Aloe · Black Berry · Mango Passion · Mixberry · Peach Strawberry · Pink Berry · Strawberry · Strawberry Watermelon และ Watermelon",
            "แนวอื่นมี Cola กับ Watermelon Bubblegum",
          ],
        },
        {
          heading: "M Switch Pod ดูยังไงว่าหัวไหนเป็นกลิ่นอะไร",
          paragraphs: [
            "หัวพอตทุกกลิ่นเป็นสีดำเหมือนกัน แต่ละกลิ่นจะมีโลโก้ M คนละสี และมีป้ายชื่อกลิ่นอยู่ด้านหน้า ถ้าซื้อไปหลายกลิ่น ก็ดูจากป้ายนี้ได้เลยว่าหัวไหนเป็นกลิ่นอะไร",
          ],
        },
        {
          heading: "M Switch Pod ใช้และเก็บยังไงดี",
          paragraphs: [
            "SALTHUB แนะนำให้เลี่ยงการคว่ำเครื่องเอาหัวลง ทั้งตอนสูบและตอนวางเก็บ เพราะหยดน้ำยาที่เกาะอยู่ภายในอาจไหลเข้าปากได้",
          ],
        },
      ],
    },
    en: {
      lede: "The M Switch Pod is a SALTHUB pod. Below is a summary from SALTHUB's own page and posters of how it is used, how many puffs it gives and how its flavours group.",
      sections: [
        {
          heading: "How do you use the M Switch Pod?",
          paragraphs: [
            "You keep the device and recharge it; each pod comes with its e-liquid built in, so when one runs out you simply put on a new one.",
            "Starting out? The [M Switch Kit](/products/m-switch-kit) comes with the device and one pod.",
          ],
        },
        {
          heading: "How many puffs does one M Switch Pod give?",
          paragraphs: [
            "SALTHUB's poster rates one pod at up to 15,000 puffs; what you actually get depends on how you vape.",
            "Inside is a 1.0Ω cotton mesh coil, and the e-liquid is 30mg nicotine salt, according to SALTHUB's posters and home page.",
          ],
        },
        {
          heading: "Which flavours does the M Switch Pod come in?",
          paragraphs: [
            "SALTHUB's page lists 17 flavours. Grouped by name, they fall into four sets.",
            "Cool, with Ice or Mint in the name: Blue Ice and Doublemint.",
            "Grape: Kyoho Grape, Grape, Grape Aloe and Grape Lychee.",
            "Other fruit: Apple Aloe, Black Berry, Mango Passion, Mixberry, Peach Strawberry, Pink Berry, Strawberry, Strawberry Watermelon and Watermelon.",
            "Others: Cola and Watermelon Bubblegum.",
          ],
        },
        {
          heading: "How do I tell which flavour an M Switch Pod is?",
          paragraphs: [
            "Every pod is the same black. Each flavour has its own colour of M logo and a flavour name tag on the front, so with several flavours at hand you can read which is which.",
          ],
        },
        {
          heading: "How should you use and store the M Switch Pod?",
          paragraphs: [
            "SALTHUB advises against keeping the device upside down, whether you are vaping or not, as e-liquid droplets inside could run into your mouth.",
          ],
        },
      ],
    },
    zh: {
      lede: "M Switch Pod 是 SALTHUB 的烟弹。下面根据 SALTHUB 自己的网页和海报，介绍它的用法、每颗能抽多少口，以及口味如何分类。",
      sections: [
        {
          heading: "M Switch Pod 怎么用？",
          paragraphs: [
            "主机留着充电继续用，烟弹自带烟油，用完直接换一颗新的即可。",
            "第一次用？可以从 [M Switch Kit](/products/m-switch-kit) 开始，套装含主机和一颗烟弹。",
          ],
        },
        {
          heading: "一颗 M Switch Pod 能抽多少口？",
          paragraphs: [
            "SALTHUB 海报标注每颗最多 15,000 口，实际口数取决于个人的抽吸习惯。",
            "内部为 1.0Ω cotton mesh 线圈，烟油为 30mg 盐尼古丁，以上见 SALTHUB 的海报和官网首页。",
          ],
        },
        {
          heading: "M Switch Pod 有哪些口味？",
          paragraphs: [
            "SALTHUB 网页列出 17 种口味，按名称可分为四类。",
            "清凉系，名称带 Ice 或 Mint：Blue Ice 和 Doublemint。",
            "葡萄系：Kyoho Grape、Grape、Grape Aloe、Grape Lychee。",
            "其他水果：Apple Aloe、Black Berry、Mango Passion、Mixberry、Peach Strawberry、Pink Berry、Strawberry、Strawberry Watermelon、Watermelon。",
            "其他：Cola、Watermelon Bubblegum。",
          ],
        },
        {
          heading: "M Switch Pod 怎么分辨是哪种口味？",
          paragraphs: [
            "所有烟弹都是同样的黑色，每种口味的 M 标志颜色不同，正面还贴有口味名称标签，买了多种口味也能一眼认出。",
          ],
        },
        {
          heading: "M Switch Pod 使用和存放要注意什么？",
          paragraphs: [
            "SALTHUB 建议无论抽吸还是存放，都不要把设备倒置，以免内部的烟油液滴流进嘴里。",
          ],
        },
      ],
    },
  },
  // Same round (02/11): from SALTHUB's home page ("ZERO CARTRIDGE" card, the "FLAVORS — ZERO PRO" slider), its Zero Pro
  // posters (modes · side air intake · USB-C) and its FAQ page (e-juice ingredients · upside down). The capacity is left to
  // the spec table: the Zero Pro poster prints 2ML against the home card's 2.2mL (lesson พ18). 22 flavours = the 21 slider
  // packs + the home card's Strawberry pod, as listed on this page.
  "zero-cartridge": {
    th: {
      lede: "Zero Cartridge เป็นหัวพอตในตระกูล Zero ของ SALTHUB ด้านล่างสรุปไว้ให้จากเว็บของ SALTHUB เอง ว่าหัวนี้ใช้ยังไง มีกลิ่นแนวไหนบ้าง และน้ำยาทำจากอะไร",
      sections: [
        {
          heading: "Zero Cartridge ใช้ยังไง",
          paragraphs: [
            "SALTHUB เรียกหัวนี้ว่าหัวที่ถอดเปลี่ยนได้ ใช้หมดหัวหนึ่งก็เปลี่ยนเป็นหัวใหม่ หรือสลับไปลองกลิ่นอื่นได้",
          ],
        },
        {
          heading: "Zero Cartridge มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "บนเว็บของ SALTHUB หัวพอตรุ่นนี้มีให้เลือก 22 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 5 แนว ส่วนตัวเลือกที่ลงท้ายด้วย 50mg บนหน้านี้ เป็นแบบนิโคติน 50mg ที่ร้านลงไว้เพิ่ม",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice หรือ Mint ได้แก่ Ice Sparkling และ Mint",
            "สายผลไม้ ได้แก่ Apple Aloe · Blueberry · Grape · Grape Aloe · Grapefruit · Honey Yuzu · Lychee · Mango · Mixberry · Peach · Peach Strawberry · Pineapple · Strawberry และ Watermelon",
            "สายชา ได้แก่ Fruit Tea และ Oolong Tea",
            "สายเครื่องดื่ม ได้แก่ Cola · Lemonade และ Yakult",
            "แนวอื่นมี Cigar กลิ่นเดียว",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "น้ำยาใน Zero Cartridge ทำจากอะไร",
          paragraphs: [
            "SALTHUB ระบุไว้ในหน้าคำถามที่พบบ่อยว่าน้ำยาของแบรนด์มีส่วนผสมคือ VG · PG · นิโคตินแบบ salt nic และสารแต่งกลิ่นทั้งแบบธรรมชาติและแบบสังเคราะห์",
            "ถ้าอยากรู้จัก PG กับ VG มากขึ้น ร้านเขียนไว้ที่ [PG VG คืออะไร ต่างกันยังไง](/guides/pg-vg-in-e-liquid)",
          ],
        },
        {
          heading: "Zero Cartridge ใช้และเก็บยังไงดี",
          paragraphs: [
            "SALTHUB แนะนำให้เลี่ยงการคว่ำเครื่องเอาหัวลง ทั้งตอนสูบและตอนวางเก็บ เพราะหยดน้ำยาที่เกาะอยู่ภายในอาจไหลเข้าปากได้",
          ],
        },
      ],
    },
    en: {
      lede: "The Zero Cartridge is the pod of SALTHUB's Zero line. Below is a summary from SALTHUB's own site of how it is used, how its flavours group and what the e-liquid inside is made of.",
      sections: [
        {
          heading: "How do you use the Zero Cartridge?",
          paragraphs: [
            "SALTHUB calls it a changeable cartridge: when one runs out, put in a new one or switch to another flavour.",
          ],
        },
        {
          heading: "Which flavours does the Zero Cartridge come in?",
          paragraphs: [
            "SALTHUB's site lists 22 flavours for this pod. Grouped by name, they fall into five sets. The options on this page ending in 50mg are 50mg-nicotine versions the shop lists as well.",
            "Cool, with Ice or Mint in the name: Ice Sparkling and Mint.",
            "Fruit: Apple Aloe, Blueberry, Grape, Grape Aloe, Grapefruit, Honey Yuzu, Lychee, Mango, Mixberry, Peach, Peach Strawberry, Pineapple, Strawberry and Watermelon.",
            "Tea: Fruit Tea and Oolong Tea.",
            "Drinks: Cola, Lemonade and Yakult.",
            "Other: Cigar.",
          ],
        },
        {
          heading: "What is the e-liquid in the Zero Cartridge made of?",
          paragraphs: [
            "SALTHUB's FAQ page states that its e-liquid contains VG, PG, nicotine salt and natural and artificial flavourings.",
          ],
        },
        {
          heading: "How should you use and store the Zero Cartridge?",
          paragraphs: [
            "SALTHUB advises against keeping the device upside down, whether you are vaping or not, as e-liquid droplets inside could run into your mouth.",
          ],
        },
      ],
    },
    zh: {
      lede: "Zero Cartridge 是 SALTHUB Zero 系列的烟弹。下面根据 SALTHUB 官网的资料，介绍它的用法、口味如何分类，以及烟油的成分。",
      sections: [
        {
          heading: "Zero Cartridge 怎么用？",
          paragraphs: [
            "SALTHUB 称它为可更换的烟弹：一颗用完，换一颗新的，或换个口味都可以。",
          ],
        },
        {
          heading: "Zero Cartridge 有哪些口味？",
          paragraphs: [
            "SALTHUB 官网列出这款烟弹的 22 种口味，按名称可分为五类。本页名称以 50mg 结尾的选项，是本店另外上架的 50mg 尼古丁版本。",
            "清凉系，名称带 Ice 或 Mint：Ice Sparkling 和 Mint。",
            "水果系：Apple Aloe、Blueberry、Grape、Grape Aloe、Grapefruit、Honey Yuzu、Lychee、Mango、Mixberry、Peach、Peach Strawberry、Pineapple、Strawberry、Watermelon。",
            "茶系：Fruit Tea、Oolong Tea。",
            "饮品系：Cola、Lemonade、Yakult。",
            "其他：Cigar。",
          ],
        },
        {
          heading: "Zero Cartridge 的烟油是什么成分？",
          paragraphs: [
            "SALTHUB 在常见问题页面说明，其烟油成分为 VG、PG、盐尼古丁，以及天然和人工香料。",
          ],
        },
        {
          heading: "Zero Cartridge 使用和存放要注意什么？",
          paragraphs: [
            "SALTHUB 建议无论抽吸还是存放，都不要把设备倒置，以免内部的烟油液滴流进嘴里。",
          ],
        },
      ],
    },
  },
  // Round "queue 0211" articles, ESKO BAR (02/11): the three published ESKO BAR pages, from the maker's two product pages —
  // E1 eskobarvape.com/product/pod-system/ (device + pod) and E2 eskobarvape.com/product/eskobar ("ESKO BAR 498", the
  // disposable). Source per sentence: _incoming/articles-0211/esko-draft.md. Flavour groups on the pod page only (the kit
  // page links there); the comparison query stays with the guide esko-bar-switch-vs-m-switch. FAQ = PilotProductDetail's.
  "pod-159": {
    th: {
      lede: "Esko Bar Switch 20K เป็นเครื่องระบบสวิตช์ของ ESKO BAR ที่ตัวเครื่องกับหัวพอตแยกจากกัน พอน้ำยาหมดก็เปลี่ยนแค่หัว ด้านล่างเป็นข้อมูลจากหน้าเว็บของ ESKO BAR ว่าเครื่องนี้ปรับอะไรได้ และในกล่องมีอะไรบ้าง",
      sections: [
        {
          heading: "Esko Bar Switch 20K ต่างจากพอตใช้แล้วทิ้งยังไง",
          paragraphs: [
            "ESKO BAR ออกแบบให้แบตเตอรี่กับถังน้ำยาแยกจากกัน เวลาน้ำยาหมดหรืออยากเปลี่ยนกลิ่น ก็เปลี่ยนแค่หัวพอต ส่วนตัวเครื่องเก็บไว้ชาร์จแล้วใช้ต่อได้",
            "หัวพอตของรุ่นนี้มีขายแยกที่หน้า [หัวพอต Esko Bar Switch 20K](/products/esko-bar-switch-pod) ถ้ายังลังเลว่าแบบไหนเหมาะกว่า อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
          ],
        },
        {
          heading: "Esko Bar Switch 20K ปรับอะไรได้บ้าง",
          paragraphs: [
            "เครื่องมีสองโหมดให้เลือก กดปุ่มเดียวก็สลับได้ ทาง ESKO BAR อธิบายว่าโหมด High ให้รสเข้มกว่า ส่วนโหมด Low สูบแล้วนุ่มกว่า",
            "ที่ก้นตัวเครื่องมีปุ่มหมุนปรับลม 3 ระดับ ตั้งแต่ลมแน่นไปจนถึงลมโล่ง เลือกได้ตามแนวการสูบที่ชอบ",
          ],
        },
        {
          heading: "หน้าจอของ Esko Bar Switch 20K บอกอะไร",
          paragraphs: [
            "หน้าจอดิจิทัลบนตัวเครื่องบอกระดับแบตกับโหมดที่กำลังใช้อยู่ ส่วนที่ก้นตัวเครื่องมีวงไฟประดับอยู่ด้วย",
          ],
        },
        {
          heading: "ในกล่อง Esko Bar Switch 20K มีอะไรบ้าง",
          paragraphs: [
            "ตามรายการที่ ESKO BAR ลงไว้ ในกล่องมีตัวเครื่อง สายคล้องคอ และหัวพอต อย่างละหนึ่งชิ้น",
            "หัวพอตที่ให้มาเป็นแบบคอยล์คู่ ร้อนพร้อมกันทั้งสองตัว ESKO BAR บอกว่าช่วยให้ได้ไอมากขึ้น และรสชาติออกมาคงที่",
          ],
        },
      ],
      faq: [
        {
          question: "Esko Bar Switch 20K ใช้หัวพอตแบบไหน",
          answer: "ใช้หัวพอต Esko Bar Switch 20K ค่ะ ESKO BAR ระบุว่าหัวหนึ่งมีน้ำยา 18mL สูบได้สูงสุด 20,000 พัฟ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคนนะคะ",
        },
        {
          question: "Esko Bar Switch 20K แบตกี่ mAh",
          answer: "แบตเตอรี่อยู่ในตัวเครื่อง ความจุ 850mAh และชาร์จซ้ำได้ค่ะ",
        },
      ],
    },
    en: {
      lede: "The Esko Bar Switch 20K is ESKO BAR's switch-style device: the body and the pod are separate, so when the e-liquid runs out you change only the pod. Below is a summary from ESKO BAR's own page of what you can adjust and what comes in the box.",
      sections: [
        {
          heading: "How is the Esko Bar Switch 20K different from a disposable?",
          paragraphs: [
            "ESKO BAR keeps the battery and the e-liquid tank separate. When the e-liquid runs out or you want another flavour, you change only the pod and keep the device to recharge and use again.",
            "Its pods are sold separately on the [Esko Bar Switch 20K pod](/products/esko-bar-switch-pod) page.",
          ],
        },
        {
          heading: "What can you adjust on the Esko Bar Switch 20K?",
          paragraphs: [
            "One button switches between High and Low mode. ESKO BAR describes High as the bolder flavour and Low as the smoother draw.",
            "A dial at the base turns the airflow through three settings, from a tight draw to a wide-open one, to suit how you like to vape.",
          ],
        },
        {
          heading: "What does the Esko Bar Switch 20K screen show?",
          paragraphs: [
            "The digital screen shows the battery level and the mode in use, and an ambient light ring circles the base.",
          ],
        },
        {
          heading: "What comes in the Esko Bar Switch 20K box?",
          paragraphs: [
            "According to ESKO BAR's packing list, the box holds one device, one lanyard and one pod.",
            "The pod in the box has two coils that heat at once, which ESKO BAR says gives more vapour and a steady flavour.",
          ],
        },
      ],
      faq: [
        {
          question: "Which pod does the Esko Bar Switch 20K take?",
          answer: "It takes the Esko Bar Switch 20K pod. ESKO BAR states one pod holds 18mL of e-liquid and gives up to 20,000 puffs; what you actually get depends on how you vape.",
        },
        {
          question: "What battery does the Esko Bar Switch 20K have?",
          answer: "The device has a built-in, rechargeable 850mAh battery.",
        },
      ],
    },
    zh: {
      lede: "Esko Bar Switch 20K 是 ESKO BAR 的换弹式主机，主机和烟弹分开，烟油用完只需换烟弹。下面根据 ESKO BAR 自己的网页，介绍这款主机可以调节什么、盒内有什么。",
      sections: [
        {
          heading: "Esko Bar Switch 20K 和一次性电子烟有什么不同？",
          paragraphs: [
            "ESKO BAR 把电池和烟油仓分开设计。烟油用完或想换口味时，只换烟弹，主机留着充电继续用。",
            "这款主机的烟弹另有单独出售，详见 [Esko Bar Switch 20K 烟弹](/products/esko-bar-switch-pod) 页面。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 可以调节什么？",
          paragraphs: [
            "一个按键即可在 High 和 Low 模式之间切换。ESKO BAR 说明 High 口味更浓，Low 抽起来更柔顺。",
            "机身底部有旋钮，可调三档进气，从紧到松，按自己的抽吸习惯选择。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 的屏幕显示什么？",
          paragraphs: [
            "主机的数字屏幕会显示电量和当前模式，底部还有一圈氛围灯。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 盒内有什么？",
          paragraphs: [
            "根据 ESKO BAR 列出的包装清单，盒内有主机、挂绳和烟弹各一件。",
            "盒内附带的烟弹采用双线圈同时加热，ESKO BAR 表示这样烟雾更多，口味更稳定。",
          ],
        },
      ],
      faq: [
        {
          question: "Esko Bar Switch 20K 用哪种烟弹？",
          answer: "使用 Esko Bar Switch 20K 烟弹。ESKO BAR 标明每颗装有 18mL 烟油，最多可抽 20,000 口；实际口数取决于个人的抽吸习惯。",
        },
        {
          question: "Esko Bar Switch 20K 电池容量多大？",
          answer: "主机内置 850mAh 可充电电池。",
        },
      ],
    },
  },
  "esko-bar-switch-pod": {
    th: {
      lede: "หัวพอต Esko Bar Switch 20K ของ ESKO BAR เป็นหัวพอตบรรจุสำเร็จ แต่ละหัวมีน้ำยาของกลิ่นที่เลือกกับคอยล์คู่มาในตัว ด้านล่างสรุปจากหน้าเว็บของ ESKO BAR พร้อมแบ่งกลิ่นเป็นแนวไว้ให้เลือกง่ายขึ้น",
      sections: [
        {
          heading: "หัวพอต Esko Bar Switch 20K สลับกลิ่นยังไง",
          paragraphs: [
            "ESKO BAR ออกแบบให้ถังน้ำยาแยกจากแบตเตอรี่ และเรียกระบบนี้ว่าการเปลี่ยนหัวพอตแบบรวดเร็ว",
            "พอน้ำยาหมดก็ถอดหัวเก่าออกแล้วใส่หัวใหม่ได้เลย ถ้าซื้อไว้หลายกลิ่น ก็สลับกลิ่นกันได้โดยใช้ตัวเครื่องเดิม",
          ],
        },
        {
          heading: "หัวพอต Esko Bar Switch 20K หัวหนึ่งใช้ได้นานแค่ไหน",
          paragraphs: [
            "ถังน้ำยาในหัวหนึ่งจุ 18mL ESKO BAR บอกว่าช่วยให้เปลี่ยนหัวห่างขึ้น ส่วนจะใช้ได้กี่วันนั้น ขึ้นกับการสูบของแต่ละคน",
            "ข้างในเป็นคอยล์คู่ที่ร้อนพร้อมกันทั้งสองตัว ทาง ESKO BAR บอกว่าช่วยให้ได้ไอมากขึ้น และรสชาติออกมาคงที่",
          ],
        },
        {
          heading: "หัวพอต Esko Bar Switch 20K มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "หน้าเว็บของ ESKO BAR ลงหัวพอตรุ่นนี้ไว้ 20 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 3 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Mint · Ice หรือ Menthol ได้แก่ Cool Mint · Chocolate Mint · Watermelon Ice และ Extra Menthol",
            "สายผลไม้ ได้แก่ Apple Aloe · Blueberry · Coconut · Grape · Honeydew · Lychee · Mango · Mix Berry · Pineapple · Pink Guava · Strawberry · Strawberry Banana และ Watermelon Lime",
            "แนวอื่นมี Blueberry Jam · Cola และ Yogurt",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอต Esko Bar Switch 20K ใส่เครื่องอะไร",
          answer: "ใช้กับเครื่อง [Esko Bar Switch 20K](/products/pod-159) ค่ะ",
        },
        {
          question: "หัวพอต Esko Bar Switch 20K สูบได้กี่พัฟ",
          answer: "ESKO BAR ระบุว่าหัวหนึ่งสูบได้สูงสุด 20,000 พัฟค่ะ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคนนะคะ",
        },
        {
          question: "หัวพอต Esko Bar Switch 20K ต้องเติมน้ำยาเองไหม",
          answer: "หัวพอตมีน้ำยามาในตัวแล้ว ใช้หมดก็เปลี่ยนเป็นหัวใหม่ได้เลยค่ะ",
        },
      ],
    },
    en: {
      lede: "The Esko Bar Switch 20K pod is ESKO BAR's prefilled pod: each one holds the e-liquid of the flavour you pick, with two coils built in. Below is a summary from ESKO BAR's own page, with the flavours grouped to make choosing easier.",
      sections: [
        {
          heading: "How do you switch flavours with the Esko Bar Switch 20K pod?",
          paragraphs: [
            "ESKO BAR keeps the e-liquid tank separate from the battery and calls this quick pod-swap.",
            "When a pod runs out, take it off and put a new one on. With several flavours at hand, you can move between them on the same device.",
          ],
        },
        {
          heading: "How long does one Esko Bar Switch 20K pod last?",
          paragraphs: [
            "Each pod holds 18mL of e-liquid, which ESKO BAR says means changing pods less often. How many days one lasts depends on how often you vape.",
            "Inside, two coils heat at once, which ESKO BAR says gives more vapour and a steady flavour.",
          ],
        },
        {
          heading: "Which flavours does the Esko Bar Switch 20K pod come in?",
          paragraphs: [
            "ESKO BAR's page lists 20 flavours for this pod. Grouped by name, they fall into three sets.",
            "Cool, with Mint, Ice or Menthol in the name: Cool Mint, Chocolate Mint, Watermelon Ice and Extra Menthol.",
            "Fruit: Apple Aloe, Blueberry, Coconut, Grape, Honeydew, Lychee, Mango, Mix Berry, Pineapple, Pink Guava, Strawberry, Strawberry Banana and Watermelon Lime.",
            "Others: Blueberry Jam, Cola and Yogurt.",
          ],
        },
      ],
      faq: [
        {
          question: "Which device does the Esko Bar Switch 20K pod fit?",
          answer: "It fits the [Esko Bar Switch 20K](/products/pod-159).",
        },
        {
          question: "How many puffs does one Esko Bar Switch 20K pod give?",
          answer: "ESKO BAR states one pod gives up to 20,000 puffs; what you actually get depends on how you vape.",
        },
        {
          question: "Do you refill the Esko Bar Switch 20K pod yourself?",
          answer: "No, it comes filled. When it runs out, put on a new pod.",
        },
      ],
    },
    zh: {
      lede: "Esko Bar Switch 20K 烟弹是 ESKO BAR 的预灌装烟弹，每颗都装有所选口味的烟油，并内置双线圈。下面根据 ESKO BAR 自己的网页整理，并把口味分类，方便挑选。",
      sections: [
        {
          heading: "Esko Bar Switch 20K 烟弹怎么换口味？",
          paragraphs: [
            "ESKO BAR 把烟油仓和电池分开设计，并称之为快速换弹。",
            "烟油用完时，取下旧烟弹、换上新的即可；手边备几种口味，就能用同一台主机轮换着抽。",
          ],
        },
        {
          heading: "一颗 Esko Bar Switch 20K 烟弹能用多久？",
          paragraphs: [
            "每颗烟弹装有 18mL 烟油，ESKO BAR 表示这样可以减少换弹次数。一颗能用几天，取决于抽的频率。",
            "内部双线圈同时加热，ESKO BAR 表示这样烟雾更多，口味更稳定。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 烟弹有哪些口味？",
          paragraphs: [
            "ESKO BAR 网页列出这款烟弹的 20 种口味，按名称可分为三类。",
            "清凉系（名称带 Mint、Ice 或 Menthol）：Cool Mint、Chocolate Mint、Watermelon Ice、Extra Menthol。",
            "水果系：Apple Aloe、Blueberry、Coconut、Grape、Honeydew、Lychee、Mango、Mix Berry、Pineapple、Pink Guava、Strawberry、Strawberry Banana、Watermelon Lime。",
            "其他：Blueberry Jam、Cola、Yogurt。",
          ],
        },
      ],
      faq: [
        {
          question: "Esko Bar Switch 20K 烟弹适用于哪款主机？",
          answer: "适用于 [Esko Bar Switch 20K](/products/pod-159)。",
        },
        {
          question: "一颗 Esko Bar Switch 20K 烟弹能抽多少口？",
          answer: "ESKO BAR 标明每颗最多可抽 20,000 口；实际口数取决于个人的抽吸习惯。",
        },
        {
          question: "Esko Bar Switch 20K 烟弹需要自己加烟油吗？",
          answer: "不需要，烟弹出厂已装好烟油，用完换一颗新的即可。",
        },
      ],
    },
  },
  "esko-bar-20k": {
    th: {
      lede: "ESKO BAR 20000 เป็นพอตใช้แล้วทิ้งของ ESKO BAR ซึ่งบนเว็บของแบรนด์ใช้ชื่อรุ่นว่า ESKO BAR 498 ด้านล่างสรุปจากหน้าเว็บนั้นไว้ให้ ว่าเครื่องนี้ชาร์จได้ไหมและใช้คอยล์แบบไหน พร้อมแบ่งกลิ่นที่มีให้เลือกบนหน้านี้เป็นแนว",
      sections: [
        {
          heading: "ESKO BAR 20000 ชาร์จได้ไหม",
          paragraphs: [
            "ชาร์จได้ แบตเตอรี่อยู่ในตัวเครื่อง ESKO BAR ระบุว่าเป็นแบตความหนาแน่นสูงที่ชาร์จได้เร็ว ถ้าแบตหมดก่อนน้ำยา ก็เสียบชาร์จแล้วสูบต่อจนน้ำยาหมดได้",
            "เครื่องหนึ่งใช้ได้กี่วันก็ขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
        {
          heading: "ESKO BAR 20000 ใช้คอยล์แบบไหน",
          paragraphs: [
            "ข้างในเป็นคอยล์ mesh คู่ ค่า 1.0 โอห์ม ESKO BAR บอกว่าคอยล์นี้ช่วยให้รสและกลิ่นของน้ำยาชัดขึ้น และเป็นคอยล์ mesh แบบมีส่วนทำความร้อนในตัว",
            "ตามสเปกที่ ESKO BAR ลงไว้ ตัวเครื่องมีขนาด 126 × 30 × 30 mm และทำจาก PCTG · PC กับสเตนเลส",
          ],
        },
        {
          heading: "ESKO BAR 20000 มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "บนหน้านี้มีให้เลือก 22 กลิ่น ในจำนวนนี้ 15 กลิ่นตรงกับที่ ESKO BAR ลงไว้บนหน้าเว็บของแบรนด์ ถ้าแบ่งตามชื่อกลิ่นจะได้ 4 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice · Mint หรือ Menthol ได้แก่ Blueberry Ice · Watermelon Ice · Double Mint และ Extra Menthol 5%",
            "สายองุ่น ได้แก่ Purple Grape · Grape และ Berry Grape",
            "สายผลไม้อื่น ได้แก่ Apple Aloe · E-Melon · Lychee · Mango · Mixberry · Pink Guava · Sour Strawberry · Strawberry Banana · Strawberry Kiwi และ Watermelon Strawberry",
            "แนวอื่นมี Banana Icecream · Bubblegum · Cola · Mineral และ Red Lemon Soda",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
      ],
      faq: [
        {
          question: "ESKO BAR 20000 นิโคตินกี่ %",
          answer: "ESKO BAR ระบุความเข้มข้นนิโคตินไว้ 3% ค่ะ",
        },
        {
          question: "ESKO BAR 20000 กับ Esko Bar Switch 20K ต่างกันยังไง",
          answer: "ESKO BAR 20000 ใช้หมดแล้วทิ้งทั้งเครื่อง ส่วน [Esko Bar Switch 20K](/products/pod-159) เก็บตัวเครื่องไว้ใช้ต่อได้ เปลี่ยนแค่หัวค่ะ",
        },
      ],
    },
    en: {
      lede: "The ESKO BAR 20000 is ESKO BAR's disposable, listed on the brand's own site as the ESKO BAR 498. Below is a summary from that page of whether it recharges and which coil it uses, followed by the flavours on this page in groups.",
      sections: [
        {
          heading: "Can you recharge the ESKO BAR 20000?",
          paragraphs: [
            "Yes. The battery is built in, and ESKO BAR calls it a high-density battery that charges fast. If the battery runs out before the e-liquid, plug it in and keep vaping until the e-liquid is gone.",
            "How many days one lasts depends on how often you vape.",
          ],
        },
        {
          heading: "Which coil does the ESKO BAR 20000 use?",
          paragraphs: [
            "Inside is a 1.0Ω dual mesh coil, which ESKO BAR says brings out a clearer flavour and aroma; ESKO BAR describes it as a mesh coil with integrated heating.",
            "Per ESKO BAR's spec list, the body measures 126 × 30 × 30 mm and is made of PCTG, PC and stainless steel.",
          ],
        },
        {
          heading: "Which flavours does the ESKO BAR 20000 come in?",
          paragraphs: [
            "This page offers 22 flavours, 15 of which match the ones ESKO BAR lists on its own site. Grouped by name, they fall into four sets.",
            "Cool, with Ice, Mint or Menthol in the name: Blueberry Ice, Watermelon Ice, Double Mint and Extra Menthol 5%.",
            "Grape: Purple Grape, Grape and Berry Grape.",
            "Other fruit: Apple Aloe, E-Melon, Lychee, Mango, Mixberry, Pink Guava, Sour Strawberry, Strawberry Banana, Strawberry Kiwi and Watermelon Strawberry.",
            "Others: Banana Icecream, Bubblegum, Cola, Mineral and Red Lemon Soda.",
          ],
        },
      ],
      faq: [
        {
          question: "What is the nicotine strength of the ESKO BAR 20000?",
          answer: "ESKO BAR lists a nicotine strength of 3%.",
        },
        {
          question: "How is the ESKO BAR 20000 different from the Esko Bar Switch 20K?",
          answer: "The ESKO BAR 20000 is thrown away once it is used up; with the [Esko Bar Switch 20K](/products/pod-159) you keep the device and change only the pod.",
        },
      ],
    },
    zh: {
      lede: "ESKO BAR 20000 是 ESKO BAR 的一次性电子烟，品牌官网上的型号名为 ESKO BAR 498。下面根据该网页介绍它能否充电、用什么线圈，并把本页的口味分类列出。",
      sections: [
        {
          heading: "ESKO BAR 20000 可以充电吗？",
          paragraphs: [
            "可以。电池内置于机身，ESKO BAR 称之为高密度电池，充电速度快。如果电池比烟油先用完，充上电就能继续抽，直到烟油用完。",
            "一支能用几天，取决于抽的频率。",
          ],
        },
        {
          heading: "ESKO BAR 20000 用什么线圈？",
          paragraphs: [
            "内部是 1.0Ω 的 dual mesh 线圈，ESKO BAR 表示能让口味和香气更清晰，并称之为集成加热的 mesh 线圈。",
            "根据 ESKO BAR 列出的规格，机身尺寸为 126 × 30 × 30 mm，材质为 PCTG、PC 和不锈钢。",
          ],
        },
        {
          heading: "ESKO BAR 20000 有哪些口味？",
          paragraphs: [
            "本页共有 22 种口味，其中 15 种与 ESKO BAR 官网列出的一致，按名称可分为四类。",
            "清凉系（名称带 Ice、Mint 或 Menthol）：Blueberry Ice、Watermelon Ice、Double Mint、Extra Menthol 5%。",
            "葡萄系：Purple Grape、Grape、Berry Grape。",
            "其他水果：Apple Aloe、E-Melon、Lychee、Mango、Mixberry、Pink Guava、Sour Strawberry、Strawberry Banana、Strawberry Kiwi、Watermelon Strawberry。",
            "其他：Banana Icecream、Bubblegum、Cola、Mineral、Red Lemon Soda。",
          ],
        },
      ],
      faq: [
        {
          question: "ESKO BAR 20000 的尼古丁浓度是多少？",
          answer: "ESKO BAR 标注的尼古丁浓度为 3%。",
        },
        {
          question: "ESKO BAR 20000 和 Esko Bar Switch 20K 有什么不同？",
          answer: "ESKO BAR 20000 用完后整支丢弃；[Esko Bar Switch 20K](/products/pod-159) 则保留主机，只换烟弹。",
        },
      ],
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
  // Round "queue 0211" articles, RELX (02/11): the two published RELX pages, from RELX's own pages — R2 relxnow.com/products/
  // essential-device · R7 relxnow.com/products/relx-pod-pro · R6 relxnow.my/products/relx-pod-pro-2-fresh-peach (RELX Malaysia) ·
  // R1 relxnow.com/products/relx-infinity-2-plus-device. RELX's own figures that have no spec row (55 °C · 0.2 s · 6–7.5 mg ·
  // 11 layers · 500 vs 600 puffs) are told without the number; thai-copy 02/11.
  "relx-essential-2": {
    th: {
      lede: "RELX Essential 2 เป็นเครื่องระบบสวิตช์ ใช้คู่กับหัวพอตบรรจุสำเร็จ ด้านล่างเป็นข้อมูลจากเว็บของ RELX ตั้งแต่หัวพอตที่ใช้ได้ไปจนถึงการชาร์จ",
      sections: [
        {
          heading: "RELX Essential 2 ใช้กับหัวพอตรุ่นไหน",
          paragraphs: [
            "RELX ระบุว่าเครื่องนี้ใช้ได้กับหัวพอต RELX Pod และ RELX Pod Pro ซึ่งเป็นหัวพอตทรงสมมาตรทั้งสองรุ่น",
            "หน้าเว็บของ RELX บอกด้วยว่า Pod Pro ใส่เครื่อง [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) ได้เช่นกัน",
          ],
        },
        {
          heading: "RELX Pod กับ RELX Pod Pro ต่างกันตรงไหน",
          paragraphs: [
            "RELX Pod Pro ใช้คอยล์เซรามิก ส่วน RELX Pod ใช้คอยล์สำลี",
            "RELX บอกด้วยว่า Pod Pro ปรับมาให้กันรั่วได้ดีขึ้น",
          ],
        },
        {
          heading: "สูบแล้วเป็นยังไง",
          paragraphs: [
            "เครื่องนี้ใช้ระบบที่ RELX เรียกว่า Super Smooth ซึ่งคุมไอไม่ให้ร้อนเกินไป เพื่อช่วยเลี่ยงรสไหม้",
            "RELX บอกด้วยว่าพอเริ่มสูบ เครื่องก็ทำงานแทบจะทันที และแต่ละพัฟให้ไอแน่น",
          ],
        },
        {
          heading: "ออกแบบให้กันรั่วยังไง",
          paragraphs: [
            "RELX ออกแบบด้านในเป็นโครงสร้างซ้อนกันหลายชั้น เพื่อช่วยกันน้ำยารั่ว และกันไม่ให้หยดน้ำยาไปเกาะค้างอยู่ข้างใน",
          ],
        },
        {
          heading: "ชาร์จยังไง",
          paragraphs: [
            "RELX ระบุแบตเตอรี่ไว้ที่ 380mAh และชาร์จซ้ำได้ผ่านช่อง USB-C",
            "เรื่องชาร์จนานแค่ไหนและดูแลแบตยังไง ร้านเล่าไว้ที่[ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
          ],
        },
      ],
      faq: [
        {
          question: "RELX Essential 2 มีสีอะไรบ้าง",
          answer: "ร้านมีให้เลือก Black · Grey · Orange · Steel silver และ Nebula Blue ค่ะ",
        },
        {
          question: "RELX Essential 2 ต้องเติมน้ำยาเองไหม",
          answer: "ไม่ต้องเติมค่ะ หัวพอตที่ใช้กับเครื่องนี้มีน้ำยามาในตัวแล้ว ใช้หมดก็เปลี่ยนเป็นหัวใหม่ได้เลยค่ะ",
        },
        {
          question: "RELX Essential 2 ใส่หัว RELX Infinity Pro 2 ได้ไหม",
          answer: "RELX ระบุว่าเครื่องนี้ใช้กับหัวพอต RELX Pod และ RELX Pod Pro ส่วนหัว [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) ที่แพ็กพิมพ์ชื่อ RELX Pod Pro 2 ไม่ได้อยู่ในรายชื่อนี้ค่ะ",
        },
      ],
    },
    en: {
      lede: "The RELX Essential 2 is a switch-style device that takes prefilled pods. Below is what RELX's own page says about it, from the pods it takes to how it charges.",
      sections: [
        {
          heading: "Which pods does the RELX Essential 2 take?",
          paragraphs: [
            "RELX lists two pods for it, RELX Pod and RELX Pod Pro, both of a symmetrical design.",
            "RELX's page adds that the RELX Pod Pro also fits the [RELX Infinity 2 Plus](/products/relx-infinity-2-plus).",
          ],
        },
        {
          heading: "RELX Pod or RELX Pod Pro: what's the difference?",
          paragraphs: [
            "They use different coils: the RELX Pod Pro has a ceramic coil and the RELX Pod a cotton one. RELX also says the Pod Pro has improved leak resistance.",
          ],
        },
        {
          heading: "What is it like to vape?",
          paragraphs: [
            "It uses what RELX calls Super Smooth, which keeps the vapour from running too hot to help avoid a burnt taste.",
            "RELX also says it fires almost the instant you draw, with dense vapour in every puff.",
          ],
        },
        {
          heading: "How is it built against leaks?",
          paragraphs: [
            "RELX builds the inside in several layers, to help keep e-liquid from leaking and droplets from collecting inside.",
          ],
        },
        {
          heading: "How do you charge it?",
          paragraphs: [
            "It has a 380mAh battery that recharges over USB-C.",
          ],
        },
      ],
      faq: [
        {
          question: "Which colours does the RELX Essential 2 come in?",
          answer: "The shop lists Black, Steel silver, Grey, Nebula Blue and Orange.",
        },
        {
          question: "Do I need to fill the RELX Essential 2 with e-liquid?",
          answer: "No. Its pods come filled, so when one runs out you simply put on a new one.",
        },
        {
          question: "Does the RELX Essential 2 take the RELX Infinity Pro 2 pod?",
          answer: "RELX lists two pods for this device, RELX Pod and RELX Pod Pro. RELX Pod Pro 2, the name printed on the [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) pack, is not on that list.",
        },
      ],
    },
    zh: {
      lede: "RELX Essential 2 是一款换弹式主机，搭配预灌装烟弹使用。下面根据 RELX 官网的介绍，从适用的烟弹一直讲到充电方式。",
      sections: [
        {
          heading: "RELX Essential 2 适用哪些烟弹？",
          paragraphs: [
            "RELX 标明它适用 RELX Pod 和 RELX Pod Pro 两款烟弹，两款都是对称式设计。",
            "RELX 官网还表示，RELX Pod Pro 也适用于 [RELX Infinity 2 Plus](/products/relx-infinity-2-plus)。",
          ],
        },
        {
          heading: "RELX Pod 和 RELX Pod Pro 有什么不同？",
          paragraphs: [
            "两款的线圈不同：RELX Pod Pro 用陶瓷线圈，RELX Pod 用棉芯线圈。RELX 还表示，Pod Pro 的防漏性能做了优化。",
          ],
        },
        {
          heading: "抽起来怎么样？",
          paragraphs: [
            "它采用 RELX 称为 Super Smooth 的技术，让烟雾温度不会过高，帮助避免焦味。",
            "RELX 还表示，一吸几乎立即启动，每一口烟雾都很饱满。",
          ],
        },
        {
          heading: "防漏是怎么设计的？",
          paragraphs: [
            "RELX 把内部设计成多层结构，帮助防止漏油，也避免油滴凝结在内部。",
          ],
        },
        {
          heading: "怎么充电？",
          paragraphs: [
            "主机配备 380mAh 电池，可通过 USB-C 充电。",
          ],
        },
      ],
      faq: [
        {
          question: "RELX Essential 2 有哪些颜色？",
          answer: "本店列出的颜色有 Black、Steel silver、Grey、Nebula Blue 和 Orange。",
        },
        {
          question: "RELX Essential 2 需要自己加烟油吗？",
          answer: "不需要。适用的烟弹出厂已装好烟油，用完换一颗新的即可。",
        },
        {
          question: "RELX Essential 2 能用 RELX Infinity Pro 2 烟弹吗？",
          answer: "RELX 官网为这台主机标明的适用烟弹是 RELX Pod 和 RELX Pod Pro 两款。[RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) 包装上印的名称 RELX Pod Pro 2 不在这份列表里。",
        },
      ],
    },
  },
  "relx-infinity-pro-2-pod": {
    th: {
      lede: "หัวพอต RELX Infinity Pro 2 มีน้ำยามาในตัว แพ็กและหน้าเว็บของ RELX ใช้ชื่อว่า RELX Pod Pro 2 ด้านล่างสรุปว่าหัวนี้ใช้กับโหมดไหนของเครื่อง พร้อมจัดกลิ่นเป็นแนวให้เลือกง่ายขึ้น",
      sections: [
        {
          heading: "ใช้ได้กับโหมดไหนของเครื่องบ้าง",
          paragraphs: [
            "RELX ระบุว่าหัวรุ่นนี้รองรับโหมด Eco · Smooth และ Boost ของเครื่อง",
            "RELX อธิบายว่าโหมด Eco สูบเบาลงและช่วยให้แบตอึดขึ้น โหมด Smooth ให้รสที่นุ่ม ส่วนโหมด Boost ให้รสเข้มขึ้นและไอเยอะขึ้น",
          ],
        },
        {
          heading: "หัวพอต RELX Infinity Pro 2 มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "กลิ่นของรุ่นนี้แยกได้เป็นสองกลุ่ม กลุ่มแรกคือกลิ่นที่ชื่อไม่มีคำว่า 50mg ถ้าจัดตามชื่อกลิ่นจะได้ 4 แนว",
            "สายชา ได้แก่ Hibiscus Ice Tea · Iced Black Tea · Jasmine Green Tea · Lemon Ice Tea · Longjing Ice Tea · Oolong Ice Tea และ Thai Milk Tea",
            "สายผลไม้ ได้แก่ Banana Freeze · Blueberry Splash · Fresh Peach · Green Grape Ice · Honeydew Melon · Lemon Zest · Lime Ice · Lychee Ice · Orange Sparkle · Pink Guava · Smooth Mango · Strawberry Burst · Tangy Grape และ Watermelon Ice",
            "สายยาสูบ ได้แก่ Ice Tobacco และ Lime Tobacco",
            "แนวอื่นมี Dark Sparkle · Ludou Ice และ Taro Scoop",
            "อีกกลุ่มคือกลิ่นที่ชื่อลงท้ายด้วย 50mg เป็นแบบนิโคติน 50mg ถ้าจัดตามชื่อกลิ่นก็ได้ 4 แนวเช่นกัน",
            "สายเย็นแบบ 50mg ได้แก่ Spearmint · Peppermint · Lemon Mint · Mint Freeze · Menthol Xtra และ Raspberry Mint",
            "สายยาสูบแบบ 50mg ได้แก่ Classic Tobacco · Mint Tobacco และ Rich Tobacco",
            "สายผลไม้แบบ 50mg ได้แก่ Citrus · Grape · Green Apple · Strawberry · Triple Berry และ Watermelon Ice",
            "แนวอื่นแบบ 50mg มี Ice Sparking",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอต RELX Infinity Pro 2 ใช้กับเครื่องอะไร",
          answer: "RELX ระบุว่าหัวรุ่นนี้ใช้กับเครื่อง RELX Infinity 2 และ [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) ได้ค่ะ",
        },
        {
          question: "หัวพอต RELX Infinity Pro 2 ต้องเติมน้ำยาไหม",
          answer: "ไม่ต้องเติมค่ะ หัวพอตมีน้ำยามาในตัวแล้ว หัวละ 1.9mL พอใช้หมดก็ถอดหัวเก่าออกแล้วเปลี่ยนเป็นหัวใหม่ได้เลยค่ะ",
        },
      ],
    },
    en: {
      lede: "The RELX Infinity Pro 2 pod is a prefilled pod. Its pack prints the name RELX Pod Pro 2, the same name RELX uses on its own pages. Below: which of the device's modes it works with, and the flavours grouped by name to make choosing easier.",
      sections: [
        {
          heading: "Which of the device's modes does it work with?",
          paragraphs: [
            "RELX states the pod supports the device's Eco, Smooth and Boost modes.",
            "In RELX's words, Eco gives a lighter puff and longer battery life, Smooth an ultra-smooth taste, and Boost a richer flavour with bigger clouds.",
          ],
        },
        {
          heading: "Which flavours does the RELX Infinity Pro 2 pod come in?",
          paragraphs: [
            "The flavours come in two groups. The first, with no 50mg in the name, sorts by name into four sets.",
            "Tea: Hibiscus Ice Tea, Iced Black Tea, Jasmine Green Tea, Lemon Ice Tea, Longjing Ice Tea, Oolong Ice Tea and Thai Milk Tea.",
            "Fruit: Banana Freeze, Blueberry Splash, Fresh Peach, Green Grape Ice, Honeydew Melon, Lemon Zest, Lime Ice, Lychee Ice, Orange Sparkle, Pink Guava, Smooth Mango, Strawberry Burst, Tangy Grape and Watermelon Ice.",
            "Tobacco: Ice Tobacco and Lime Tobacco.",
            "Others: Dark Sparkle, Ludou Ice and Taro Scoop.",
            "The second group ends in 50mg: these are the 50mg-nicotine pods, and they also sort into four sets.",
            "Mint and menthol, 50mg: Lemon Mint, Menthol Xtra, Mint Freeze, Peppermint, Raspberry Mint and Spearmint.",
            "Tobacco, 50mg: Classic Tobacco, Mint Tobacco and Rich Tobacco.",
            "Fruit, 50mg: Citrus, Grape, Green Apple, Strawberry, Triple Berry and Watermelon Ice.",
            "Others, 50mg: Ice Sparking.",
          ],
        },
      ],
      faq: [
        {
          question: "Which device does the RELX Infinity Pro 2 pod fit?",
          answer: "RELX states it fits the RELX Infinity 2 and the [RELX Infinity 2 Plus](/products/relx-infinity-2-plus).",
        },
        {
          question: "Do I need to fill the RELX Infinity Pro 2 pod with e-liquid?",
          answer: "No. Each pod comes filled with 1.9mL of e-liquid; when it runs out, put on a new one.",
        },
      ],
    },
    zh: {
      lede: "RELX Infinity Pro 2 烟弹是预灌装烟弹，包装上印的名称是 RELX Pod Pro 2，RELX 官网用的也是这个名称。下面介绍它支持主机的哪些模式，并按名称把口味分好类，方便挑选。",
      sections: [
        {
          heading: "支持主机的哪些模式？",
          paragraphs: [
            "RELX 标明这款烟弹支持主机的 Eco、Smooth 和 Boost 模式。",
            "按 RELX 的介绍，Eco 吸感更轻、更省电；Smooth 口感顺滑；Boost 口味更浓、烟雾更多。",
          ],
        },
        {
          heading: "RELX Infinity Pro 2 烟弹有哪些口味？",
          paragraphs: [
            "口味分为两组。第一组是名称不带 50mg 的口味，按名称可分为四类。",
            "茶系：Hibiscus Ice Tea、Iced Black Tea、Jasmine Green Tea、Lemon Ice Tea、Longjing Ice Tea、Oolong Ice Tea、Thai Milk Tea。",
            "水果系：Banana Freeze、Blueberry Splash、Fresh Peach、Green Grape Ice、Honeydew Melon、Lemon Zest、Lime Ice、Lychee Ice、Orange Sparkle、Pink Guava、Smooth Mango、Strawberry Burst、Tangy Grape、Watermelon Ice。",
            "烟草系：Ice Tobacco、Lime Tobacco。",
            "其他：Dark Sparkle、Ludou Ice、Taro Scoop。",
            "另一组是名称以 50mg 结尾的口味，尼古丁浓度为 50mg，按名称同样可分为四类。",
            "50mg 薄荷系：Lemon Mint、Menthol Xtra、Mint Freeze、Peppermint、Raspberry Mint、Spearmint。",
            "50mg 烟草系：Classic Tobacco、Mint Tobacco、Rich Tobacco。",
            "50mg 水果系：Citrus、Grape、Green Apple、Strawberry、Triple Berry、Watermelon Ice。",
            "50mg 其他：Ice Sparking。",
          ],
        },
      ],
      faq: [
        {
          question: "RELX Infinity Pro 2 烟弹适用于哪款主机？",
          answer: "RELX 标明这款烟弹适用于 RELX Infinity 2 和 [RELX Infinity 2 Plus](/products/relx-infinity-2-plus)。",
        },
        {
          question: "RELX Infinity Pro 2 烟弹需要自己加烟油吗？",
          answer: "不需要，每颗烟弹出厂已装有 1.9mL 烟油，用完换一颗新的即可。",
        },
      ],
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
        },
        {
          heading: "RELX Smash Go 12K มีกลิ่นแนวไหนบ้าง",
          paragraphs: [
            "RELX บอกไว้ว่ากลิ่นของรุ่นนี้มีทั้งผลไม้และมินต์เย็น ถ้าแบ่งกลิ่นแบบ 3% ตามชื่อกลิ่น จะได้ 3 แนว",
            "สายเย็น ได้แก่ Double Mint",
            "สายผลไม้ ได้แก่ Apple · Blueberry · Grape · Grape Aloe · Grape Lychee · Green Mango · Lychee · Mixberry · Passion Fruit · Peach Strawberry · Pineapple · Pink Berry · Pink Guava · Strawberry และ Watermelon",
            "แนวอื่นมี Cola · Oolong Tea และ Watermelon Bubblegum",
            "ส่วนแบบ 5% มี Classic Tobacco · Cola · Cool Mint · Double Mint · Grape · Mixberry · Spearmint และ Watermelon",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)"
          ]
        },
        {
          heading: "คอยล์ของ Smash Go 12K ช่วยอะไร",
          paragraphs: [
            "RELX อธิบายว่าคอยล์รุ่นนี้ช่วยให้รสนุ่มและคงที่ และทำให้น้ำยากลายเป็นไอได้สม่ำเสมอ",
            "เครื่องหนึ่งใช้ได้กี่วันก็ขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)"
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
        },
        {
          heading: "Which flavours does the RELX Smash Go 12K come in?",
          paragraphs: [
            "RELX describes the range as fruity blends and cool mint options. Grouped by name, the 3% flavours on this page fall into three sets.",
            "Cool: Double Mint.",
            "Fruit: Apple, Blueberry, Grape, Grape Aloe, Grape Lychee, Green Mango, Lychee, Mixberry, Passion Fruit, Peach Strawberry, Pineapple, Pink Berry, Pink Guava, Strawberry and Watermelon.",
            "Others: Cola, Oolong Tea and Watermelon Bubblegum.",
            "The 5% version comes in Classic Tobacco, Cola, Cool Mint, Double Mint, Grape, Mixberry, Spearmint and Watermelon."
          ]
        },
        {
          heading: "What does the Smash Go 12K's coil do?",
          paragraphs: [
            "RELX says this coil gives a smooth, consistent flavour and vaporises the e-liquid evenly.",
            "How many days one lasts depends on how often you vape."
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
        },
        {
          heading: "RELX Smash Go 12K 有哪些口味？",
          paragraphs: [
            "RELX 介绍这款有水果和清凉薄荷两类口味。本页的 3% 口味按名称可分为三类。",
            "清凉系：Double Mint。",
            "水果系：Apple、Blueberry、Grape、Grape Aloe、Grape Lychee、Green Mango、Lychee、Mixberry、Passion Fruit、Peach Strawberry、Pineapple、Pink Berry、Pink Guava、Strawberry、Watermelon。",
            "其他：Cola、Oolong Tea、Watermelon Bubblegum。",
            "5% 版本有 Classic Tobacco、Cola、Cool Mint、Double Mint、Grape、Mixberry、Spearmint、Watermelon。"
          ]
        },
        {
          heading: "RELX Smash Go 12K 的线圈有什么作用？",
          paragraphs: [
            "RELX 表示这款线圈让口味顺滑稳定，烟油雾化更均匀。",
            "一支能用几天，取决于抽的频率。"
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
  // Articles queue 0211 batch 5 (02/11): nexBar CLEAR 18K, no brand (owner 29/09). No maker site — every product fact = the
  // maker's own posters (owner-supplied overview + the 15 per-flavour posters, also carried on ihavevape.net / pod789.com;
  // copies in _incoming/nexbar-clear/src). Taste lines = each poster's tagline. Kyoho Grape · Pineapple · Mango · Cola Lemon =
  // the warehouse list (Max Disposable-46), not on the posters. Clear tank · modes · puffs · battery stay out: the tagline and
  // short description already say them (one fact at most twice, HANDOFF §18). Thai = thai-copy 02/11.
  "pod-180": {
    th: {
      lede: "nexBar CLEAR 18K มีให้เลือก 19 กลิ่นบนหน้านี้ ด้านล่างร้านจัดกลิ่นเป็นสายตามคำบรรยายบนโปสเตอร์ของผู้ผลิต และบอกว่าดูชื่อกลิ่นบนตัวเครื่องได้จากตรงไหน",
      sections: [
        {
          heading: "nexBar CLEAR 18K กลิ่นไหนดี",
          paragraphs: [
            "ผู้ผลิตทำโปสเตอร์แยกให้ทุกกลิ่นในรายการ 15 กลิ่นของรุ่นนี้ และเขียนคำบรรยายรสสั้น ๆ ไว้ใต้ชื่อกลิ่น ร้านจึงจัดสายตามคำบรรยายนั้น",
            "สายเย็นมี Mint ที่ผู้ผลิตบรรยายว่าเย็นและสดชื่น White Slush ที่บรรยายไว้แบบเดียวกัน และ Blueberry ที่เป็นบลูเบอร์รี่เย็น ๆ กับเมนทอล",
            "ถ้าชอบผลไม้ที่เย็นด้วย ก็มี Grape Ice ที่เป็นองุ่นสดกับน้ำแข็ง และ Watermelon Ice ที่เป็นแตงโมฉ่ำ ๆ เย็นแบบน้ำแข็ง",
            "สายผลไม้มี Lychee ลิ้นจี่หวานฉ่ำ Honeydew Melon เมลอนที่ผู้ผลิตบรรยายว่านุ่ม สด และฉ่ำ Grape Lychee องุ่นฉ่ำคู่กับลิ้นจี่ และ Mixberry เบอร์รี่หลายชนิดรวมกัน รสหวานและสดชื่น",
            "สตรอเบอร์รี่คู่กับผลไม้อีกชนิดมีสี่กลิ่น คือ Strawberry Watermelon คู่กับแตงโม Strawberry Kiwi คู่กับกีวีสด Strawberry Banana คู่กับกล้วยที่บรรยายว่าครีมมี่ และ Peach Strawberry คู่กับพีชหวาน",
            "ถ้าชอบรสหวานแนวขนม ก็มี Strawberry Custard ที่เป็นสตรอเบอร์รี่หวานกับคัสตาร์ดเนื้อครีม และ Watermelon Bubblegum แตงโมหวานกับหมากฝรั่ง",
          ],
        },
        {
          heading: "อีก 4 กลิ่นบนหน้านี้",
          paragraphs: [
            "บนหน้านี้ยังมี Kyoho Grape · Pineapple · Mango และ Cola Lemon ให้เลือกด้วย สี่กลิ่นนี้ร้านลงเพิ่มจากรายการของผู้ผลิต และจัดสายตามชื่อกลิ่น",
            "Kyoho Grape คือองุ่นเคียวโฮ ถ้าชอบองุ่น ก็เลือกดูคู่กับ Grape Ice และ Grape Lychee ได้ Pineapple กับ Mango อยู่สายผลไม้ ส่วน Cola Lemon ชื่อบอกว่าเป็นโคล่ากับมะนาว",
            "ถ้ายังเลือกไม่ได้ว่าจะเริ่มจากสายไหน ก็อ่านวิธีเลือกกลิ่นจากชื่อได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "ดูชื่อกลิ่นบนตัวเครื่องได้ตรงไหน",
          paragraphs: [
            "ตัวเครื่องครึ่งล่างเป็นสีดำ พิมพ์คำว่า nexBar CLEAR ชื่อกลิ่น และ 18K ไว้ ถ้าซื้อไปหลายกลิ่น ก็ดูจากตรงนี้ได้ว่าเครื่องไหนเป็นกลิ่นอะไร ส่วนคำที่ผู้ผลิตใช้บนโปสเตอร์คือ “STAY LOW. LIVE HIGH.”",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar CLEAR 18K กับ WOTOFO nexBAR 18K เป็นรุ่นเดียวกันไหม",
          answer: "คนละรุ่นค่ะ แม้ชื่อจะคล้ายกัน แต่รุ่นบนหน้านี้คือ nexBar CLEAR 18K ส่วน [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) เป็นรุ่นของ WOTOFO ที่มีหน้าแยกของตัวเองค่ะ",
        },
        {
          question: "nexBar CLEAR 18K กลิ่น Blueberry กับ Blueberry Ice คือกลิ่นเดียวกันไหม",
          answer: "กลิ่นเดียวกันค่ะ รายการกลิ่นของผู้ผลิตเขียนว่า Blueberry ส่วนโปสเตอร์ของกลิ่นนี้และตัวเครื่องพิมพ์ชื่อว่า BLUEBERRY ICE บนหน้านี้จึงใช้ชื่อ Blueberry ตามรายการค่ะ",
        },
      ],
    },
    en: {
      lede: "The nexBar CLEAR 18K comes in 19 flavours on this page. Below, we group them using the maker's own poster descriptions and show where the flavour name is printed on the device.",
      sections: [
        {
          heading: "Which nexBar CLEAR 18K flavour should I pick?",
          paragraphs: [
            "The maker gives each of the 15 flavours on its list a poster of its own, with a short taste line under the flavour name. We grouped them from those lines.",
            "The cool ones are Mint and White Slush, both described as cool and refreshing, and Blueberry, cool blueberry with refreshing menthol. For fruit with a chill, Grape Ice is fresh grape with ice and Watermelon Ice is juicy watermelon with icy coolness.",
            "Fruit: Lychee (sweet and juicy), Honeydew Melon (smooth, fresh and juicy), Grape Lychee (juicy grape with lychee) and Mixberry (a burst of mixed berries, sweet and refreshing). Four pair strawberry with another fruit: Strawberry Watermelon with watermelon, Strawberry Kiwi with fresh kiwi, Strawberry Banana with creamy banana, and Peach Strawberry with sweet peach.",
            "For a dessert-style sweet, Strawberry Custard is sweet strawberry with creamy custard, and Watermelon Bubblegum is sweet watermelon with bubblegum.",
          ],
        },
        {
          heading: "The other 4 flavours on this page",
          paragraphs: [
            "We also list Kyoho Grape, Pineapple, Mango and Cola Lemon on this page, added to the maker's list and grouped by name. Kyoho Grape is the Kyoho variety, so if you like grape, look at it alongside Grape Ice and Grape Lychee. Pineapple and Mango are fruit, and Cola Lemon is cola with lemon.",
          ],
        },
        {
          heading: "Where is the flavour name on the device?",
          paragraphs: [
            "The bottom half of the device is black and printed with nexBar CLEAR, the flavour name and 18K, so if you buy several flavours you can tell them apart at a glance. The line on the maker's posters is “STAY LOW. LIVE HIGH.”",
          ],
        },
      ],
      faq: [
        {
          question: "Is the nexBar CLEAR 18K the same as the WOTOFO nexBAR 18K?",
          answer: "No. The names are alike, but this page is the nexBar CLEAR 18K; the [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) is a WOTOFO model with its own page.",
        },
        {
          question: "Are Blueberry and Blueberry Ice the same nexBar CLEAR 18K flavour?",
          answer: "Yes. The maker's flavour list says Blueberry, while this flavour's poster and the device print BLUEBERRY ICE. This page follows the list and uses Blueberry.",
        },
      ],
    },
    zh: {
      lede: "本页的 nexBar CLEAR 18K 共有 19 种口味。下面按厂商海报上的口味描述分组，并说明机身上哪里印着口味名称。",
      sections: [
        {
          heading: "nexBar CLEAR 18K 哪个口味好？",
          paragraphs: [
            "厂商为口味清单上的 15 种口味各做了一张海报，口味名称下方有一句简短的口感描述，我们按这些描述来分组。",
            "清凉类有 Mint 和 White Slush，厂商对两者的描述都是清凉提神，还有 Blueberry（清凉蓝莓配清爽薄荷）。想要带凉感的水果，可以选 Grape Ice（新鲜葡萄加冰）或 Watermelon Ice（多汁西瓜，冰爽清凉）。",
            "水果类：Lychee（香甜多汁）、Honeydew Melon（柔和、新鲜、多汁）、Grape Lychee（多汁葡萄配荔枝）和 Mixberry（多种莓果，香甜清爽）。草莓配另一种水果的有四款：Strawberry Watermelon 配西瓜，Strawberry Kiwi 配新鲜猕猴桃，Strawberry Banana 配奶香香蕉，Peach Strawberry 配香甜蜜桃。",
            "偏甜点、糖果风味的有 Strawberry Custard（香甜草莓配奶香卡仕达）和 Watermelon Bubblegum（香甜西瓜配泡泡糖）。",
          ],
        },
        {
          heading: "本页另外 4 种口味",
          paragraphs: [
            "本页另有 Kyoho Grape、Pineapple、Mango 和 Cola Lemon，这几款是在厂商清单之外加上的，我们按名称来归类：Kyoho Grape 是巨峰葡萄，喜欢葡萄的话可以和 Grape Ice、Grape Lychee 一起比较；Pineapple 和 Mango 归水果类；Cola Lemon 是可乐加柠檬。",
          ],
        },
        {
          heading: "机身哪里印着口味名称？",
          paragraphs: [
            "机身下半部是黑色，印有 nexBar CLEAR、口味名称和 18K，买了多种口味也能一眼分清。厂商海报上的标语是“STAY LOW. LIVE HIGH.”。",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar CLEAR 18K 和 WOTOFO nexBAR 18K 是同一款吗？",
          answer: "不是。两者名称相近，但本页是 nexBar CLEAR 18K，[WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) 是 WOTOFO 的型号，另有单独页面。",
        },
        {
          question: "nexBar CLEAR 18K 的 Blueberry 和 Blueberry Ice 是同一个口味吗？",
          answer: "是的。厂商的口味清单写作 Blueberry，该口味的海报和机身印的是 BLUEBERRY ICE，本页按清单使用 Blueberry。",
        },
      ],
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
  // Round "queue 0211" articles, Muro e-liquids (02/11): no maker site exists — facts = the records in src/data/products/unbranded.ts
  // only: the nicotine type (verified, it is in the name) and the flavour names (one set for both). Bottle size and nicotine mg rows
  // are unverified → not stated; salt nic vs freebase itself = the shop guide, linked, not retold. Legacy pages render no article
  // FAQ → none written. Thai = thai-copy 02/11 (worded apart so the sibling pages do not duplicate).
  "muro-salt-nic": {
    th: {
      lede: "ด้านล่างร้านจัดกลิ่นของ Muro Salt Nic เป็นสายให้ดูง่ายขึ้น และเล่าว่าต่างจาก Muro Freebase ตรงไหน",
      sections: [
        {
          heading: "Muro Salt Nic กับ Muro Freebase ต่างกันยังไง",
          paragraphs: [
            "สองรุ่นนี้ใช้ชื่อกลิ่นชุดเดียวกันทุกกลิ่น ที่ต่างกันคือชนิดของนิโคติน Muro Salt Nic ใช้นิโคตินแบบ salt nic ส่วน [Muro Freebase](/products/muro-freebase) ใช้แบบ freebase จะเลือกรุ่นไหน จึงดูจากเครื่องที่ใช้ก่อนได้เลย แล้วค่อยเลือกกลิ่นที่ชอบ",
            "สองแบบนี้เป็นนิโคตินคนละชนิด และเข้ากับเครื่องคนละแบบด้วย ถ้ายังไม่แน่ใจว่าเครื่องที่ใช้อยู่เข้ากับแบบไหน อ่านต่อได้ที่[นิโคติน salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
          ],
        },
        {
          heading: "มีกลิ่นแนวไหนให้เลือกบ้าง",
          paragraphs: [
            "ร้านจัดสายจากคำในชื่อกลิ่น สายเย็นมี Click Mint สายองุ่นมี Grape ส่วนสายผลไม้มี Watermelon · Strawberry Twist และ Peach ที่เหลือคือ Big Cola ชื่อนี้ไม่ได้บอกผลไม้ ร้านจึงจัดไว้แนวอื่น",
            "ถ้าใช้พอตซิสเต็มที่เติมน้ำยาเอง กลิ่นอยู่ที่น้ำยา ไม่ได้ผูกกับตัวเครื่อง อยากลองกลิ่นอื่นก็ไม่ต้องเปลี่ยนเครื่อง วิธีเติมน้ำยาทีละขั้น ร้านเล่าไว้ที่[เติมพอตยังไง](/guides/refilling-a-pod)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, the Muro Salt Nic flavours sorted into groups, and how it differs from Muro Freebase.",
      sections: [
        {
          heading: "Muro Salt Nic or Muro Freebase?",
          paragraphs: [
            "The two share the same set of flavour names. The difference is the nicotine: Muro Salt Nic uses salt nic, while [Muro Freebase](/products/muro-freebase) uses freebase. So let your device decide which one to take first, then pick the flavour you like.",
            "Salt nic and freebase are two different forms of nicotine, and each suits a different kind of device, so it's worth checking what your device's maker recommends.",
          ],
        },
        {
          heading: "Which flavours are there?",
          paragraphs: [
            "We grouped them by the words in their names. Click Mint is the cool one and Grape the grape; fruit has Watermelon, Strawberry Twist and Peach. Big Cola doesn't name a fruit, so it sits on its own.",
            "In a pod system you refill yourself, the flavour is in the e-liquid rather than the device, so trying another flavour doesn't mean changing devices.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面把 Muro Salt Nic 的口味按类型分好组，并说明它和 Muro Freebase 有什么不同。",
      sections: [
        {
          heading: "Muro Salt Nic 和 Muro Freebase 有什么不同？",
          paragraphs: [
            "两款的口味名称完全相同，区别在于尼古丁类型：Muro Salt Nic 采用盐尼古丁，[Muro Freebase](/products/muro-freebase) 则采用游离碱尼古丁。所以可以先按所用设备决定选哪一款，再挑喜欢的口味。",
            "盐尼古丁和游离碱尼古丁是两种不同形式的尼古丁，适合的设备也不同，建议参考设备厂家的推荐。",
          ],
        },
        {
          heading: "有哪些口味可选？",
          paragraphs: [
            "我们按口味名称里的词来分组：清凉类是 Click Mint，葡萄类是 Grape，水果类有 Watermelon、Strawberry Twist 和 Peach。Big Cola 的名称不是水果，单独归为其他。",
            "如果使用可自行注油的开放式设备，口味在烟油里，与主机无关，想换口味不必更换设备。",
          ],
        },
      ],
    },
  },
  "muro-freebase": {
    th: {
      lede: "ด้านล่างร้านเล่าว่า Muro Freebase ต่างจาก Muro Salt Nic ตรงไหน พร้อมจัดกลิ่นเป็นสายไว้ให้เลือกได้ง่ายขึ้น",
      sections: [
        {
          heading: "ต่างจาก Muro Salt Nic ตรงไหน",
          paragraphs: [
            "Muro Freebase กับ [Muro Salt Nic](/products/muro-salt-nic) มีชื่อกลิ่นเหมือนกันทุกกลิ่น สิ่งที่ต่างคือชนิดของนิโคติน รุ่นนี้เป็นแบบ freebase ส่วนอีกรุ่นเป็นแบบ salt nic เวลาเลือกระหว่างสองรุ่นนี้ ให้ดูเครื่องที่ใช้อยู่เป็นหลัก แล้วกลิ่นที่ชอบก็มีให้เลือกในรุ่นนั้นเหมือนกัน",
            "freebase กับ salt nic เป็นนิโคตินคนละชนิด และเข้ากับเครื่องคนละแบบ ความต่างของทั้งสองแบบ รวมถึงวิธีดูว่าเครื่องที่ใช้อยู่เข้ากับแบบไหน ร้านรวมไว้ที่[นิโคติน salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
          ],
        },
        {
          heading: "Muro Freebase กลิ่นไหนดี",
          paragraphs: [
            "เลือกจากแนวที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่น ถ้าชอบความเย็น ชื่อที่มีคำว่า Mint คือ Click Mint ถ้าชอบองุ่นมี Grape และถ้าชอบผลไม้มี Watermelon · Strawberry Twist กับ Peach ส่วน Big Cola เป็นชื่อเครื่องดื่ม ไม่ได้บอกผลไม้ ร้านจัดไว้แนวอื่น",
            "ถ้าใช้เครื่องที่ปรับวัตต์ได้ วิธีตั้งวัตต์และช่องลมให้เข้ากับแนวการสูบ อ่านได้ที่[เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, how Muro Freebase differs from Muro Salt Nic, and its flavours sorted into groups to make choosing easier.",
      sections: [
        {
          heading: "How is it different from Muro Salt Nic?",
          paragraphs: [
            "Muro Freebase and [Muro Salt Nic](/products/muro-salt-nic) share the same flavour names; what differs is the nicotine. This one is freebase, the other is salt nic. Let your device decide which one to take, and the flavour you like is there in either.",
            "Because freebase and salt nic suit different kinds of device, your device maker's recommendation is the best guide.",
          ],
        },
        {
          heading: "Which Muro Freebase flavour should I pick?",
          paragraphs: [
            "Start with what you like. We grouped the flavours by the words in their names: for cool, Click Mint; for grape, Grape; for fruit, Watermelon, Strawberry Twist and Peach. Big Cola is named after a drink rather than a fruit, so we list it separately.",
            "If your device lets you set the wattage, [Choosing Wattage & Airflow](/guides/choosing-wattage-and-airflow) explains how to match wattage and airflow to the way you vape.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面说明 Muro Freebase 和 Muro Salt Nic 的区别，并把口味按类型分好组，方便挑选。",
      sections: [
        {
          heading: "和 Muro Salt Nic 有什么不同？",
          paragraphs: [
            "Muro Freebase 和 [Muro Salt Nic](/products/muro-salt-nic) 的口味名称完全相同，不同的是尼古丁：这款是游离碱尼古丁，另一款是盐尼古丁。先根据设备决定选哪一款，喜欢的口味两款都有。",
            "游离碱尼古丁和盐尼古丁适合的设备类型不同，建议参考设备厂家的推荐。",
          ],
        },
        {
          heading: "Muro Freebase 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。我们按口味名称里的词来分组：清凉类是 Click Mint，葡萄类是 Grape，水果类有 Watermelon、Strawberry Twist 和 Peach。Big Cola 是饮品名称而不是水果，单独列出。",
            "如果设备可以调功率，怎样让功率和进气配合自己的吸法，详见[如何选择功率与进气量](/guides/choosing-wattage-and-airflow)。",
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
  // Round "queue 0211" articles, Muro (02/11): no maker site exists — facts = the records in src/data/products/unbranded.ts only
  // (flavour names, verified rows, what the maker's packs/posters print per the record notes), sorted by name only; spec rows
  // marked unverified (bottle size · nicotine mg) are not stated. The Muro / RELX Creator fit already shows twice on the
  // Connector page (shortDescription + whoIsThisFor), so the article leaves it out. Legacy pages render no article FAQ →
  // none written. Thai = thai-copy 02/11.
  "muro-connector-20k": {
    th: {
      lede: "Muro Connector 20K มีให้เลือก 33 กลิ่น ด้านล่างร้านอธิบายการใช้งานของหัวพอตนี้ จัดกลิ่นเป็นสายให้เลือกง่ายขึ้น และเล่าถึงกลิ่นที่มี 50MG ต่อท้ายชื่อด้วย",
      sections: [
        {
          heading: "หัวพอตแบบ Connector ใช้งานยังไง",
          paragraphs: [
            "โปสเตอร์ของ Muro พิมพ์ว่า CONNECTOR POD คือหัวพอตที่ต้องเสียบกับตัวเครื่องก่อนถึงจะสูบได้",
            "ตัวหัวไม่มีแบต แบตอยู่ที่ตัวเครื่องซึ่งขายแยกจากหัว พอน้ำยาในหัวหมด ก็ถอดหัวเดิมออกแล้วใส่หัวใหม่ ส่วนตัวเครื่องใช้ต่อได้ตามเดิม",
          ],
        },
        {
          heading: "Muro Connector 20K กลิ่นไหนดี",
          paragraphs: [
            "แต่ละคนชอบรสไม่เหมือนกัน ลองเริ่มจากสายที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่น สายเย็นมี 4 กลิ่น คือ Double Mint · Cool Mint · Spear Mint และ Blue Ice ส่วนสายองุ่นมี Grape และ Kyoho Grape สำหรับคนที่หาองุ่นเคียวโฮ",
            "สายผลไม้มี 11 กลิ่น มีทั้งผลไม้ชนิดเดียวอย่าง Watermelon กับ Pineapple ผลไม้สองชนิดคู่กันอย่าง Strawberry Peach กับ Banana Strawberry และยังมี Mix Berries · Pink Berry · Honey Lemon · Lemon Jeez · Apple Baraku กับ Fruit Punch",
            "กลิ่นที่ 11 คือ Strawberry Ice Cream ชื่อมีผลไม้คู่กับไอศกรีม ร้านก็จัดไว้ในสายนี้ด้วย",
            "ถ้าชอบแนวชา นม และขนม ฝั่งชามี Green Tea กับ Peach Tea ฝั่งนมมี Yakult กับ Yakult Orange และฝั่งขนมมี Vanilla Ice Cream · Taro Ice Cream · Butterscotch กับ Chocolate Dubai",
            "คำว่า Ice Cream ในชื่อหมายถึงไอศกรีม ไม่ได้บอกว่าเป็นกลิ่นเย็น ส่วน Peach Tea กับ Yakult Orange แม้มีผลไม้ในชื่อ ร้านก็จัดตามคำหลักของชื่อ",
            "แนวอื่นมี Cola · Mineral Water และ Green Slush สามชื่อนี้ไม่ได้บอกผลไม้หรือขนมตรง ๆ วิธีเลือกกลิ่นจากชื่อแบบละเอียด อ่านต่อได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "กลิ่นที่มี 50MG ต่อท้ายชื่อคืออะไร",
          paragraphs: [
            "ในรายการมี 5 กลิ่นที่ชื่อมี 50MG ต่อท้าย คือ Grape · Watermelon · Double Mint · Mix Berries และ Yakult ห้ากลิ่นนี้มีให้เลือกสองแบบ คือแบบที่มี 50MG ในชื่อ กับแบบที่ไม่มี ก่อนกดเลือก ลองดูชื่อในรายการอีกครั้งให้ตรงกับแบบที่ต้องการ",
          ],
        },
        {
          heading: "หัวพอตหน้าตาเป็นยังไง",
          paragraphs: [
            "ตัวหัวด้านหนึ่งเป็นลายรังผึ้ง อีกด้านพิมพ์ชื่อกลิ่นไว้ ถ้าซื้อไปหลายกลิ่น ก็ดูจากชื่อบนตัวหัวได้เลยว่าหัวไหนเป็นกลิ่นอะไร คลิปของร้านบนหน้านี้เรียกหัวนี้ว่า LEGO ตามหน้าตาของตัวหัว และคำที่ Muro พิมพ์ไว้บนตัวหัวคือ “AWAKE YOUR NOSE.”",
          ],
        },
      ],
    },
    en: {
      lede: "The Muro Connector 20K comes in 33 flavours. Below, how the pod works, the flavours sorted into groups to make choosing easier, and a note on the flavours with 50MG in the name.",
      sections: [
        {
          heading: "How does a connector pod work?",
          paragraphs: [
            "Muro's poster calls it a CONNECTOR POD: a pod that has to go on a device before you can vape. The pod has no battery of its own; the battery is in the device, which is sold separately. When a pod runs out, take it off, put on a new one and keep using the same device.",
          ],
        },
        {
          heading: "Which Muro Connector 20K flavour should I pick?",
          paragraphs: [
            "Everyone's taste is different, so start with the kind you like. We grouped the flavours by the words in their names. The cool four are Double Mint, Cool Mint, Spear Mint and Blue Ice, and the grapes are Grape and Kyoho Grape.",
            "Fruit has eleven: single fruits such as Watermelon and Pineapple, pairs such as Banana Strawberry and Strawberry Peach, plus Mix Berries, Pink Berry, Honey Lemon, Lemon Jeez, Apple Baraku and Fruit Punch. Strawberry Ice Cream pairs a fruit with ice cream, and we keep it here too.",
            "For tea, milk and dessert there's Green Tea and Peach Tea, Yakult and Yakult Orange, and Vanilla Ice Cream, Taro Ice Cream, Butterscotch and Chocolate Dubai. Ice Cream in a name means ice cream, not a cooling flavour. Peach Tea and Yakult Orange name a fruit too, but we sort by the main word.",
            "The rest are Cola, Mineral Water and Green Slush, none of which names a fruit or a dessert outright.",
          ],
        },
        {
          heading: "What are the flavours with 50MG in the name?",
          paragraphs: [
            "Five flavours have 50MG at the end of the name: Grape, Watermelon, Double Mint, Mix Berries and Yakult. Each of these five comes in two versions, one with 50MG in the name and one without, so check the name in the list before you choose.",
          ],
        },
        {
          heading: "What does the pod look like?",
          paragraphs: [
            "One face of the pod has a honeycomb pattern and the other carries the flavour name, so if you buy several flavours you can tell them apart at a glance. Our shop's video on this page calls it the LEGO pod, after its look, and the line Muro prints on the pod is “AWAKE YOUR NOSE.”",
          ],
        },
      ],
    },
    zh: {
      lede: "Muro Connector 20K 共有 33 种口味。下面介绍这款烟弹怎么用，把口味按类型分好组方便挑选，并说明名称带 50MG 的口味。",
      sections: [
        {
          heading: "Connector 烟弹怎么用？",
          paragraphs: [
            "Muro 的海报上印着 CONNECTOR POD，意思是烟弹要先装在主机上才能抽。烟弹本身没有电池，电池在主机里，主机需另外购买。烟弹里的烟油用完后，取下换上新的即可，主机可以继续使用。",
          ],
        },
        {
          heading: "Muro Connector 20K 哪个口味好？",
          paragraphs: [
            "每个人口味不同，可以先从喜欢的类型选起。我们按口味名称里的词来分组。清凉类有 4 款：Double Mint、Cool Mint、Spear Mint 和 Blue Ice；葡萄类有 Grape 和 Kyoho Grape。",
            "水果类有 11 款：既有 Watermelon、Pineapple 这样的单一水果，也有 Banana Strawberry、Strawberry Peach 这样的组合，另外还有 Mix Berries、Pink Berry、Honey Lemon、Lemon Jeez、Apple Baraku 和 Fruit Punch。Strawberry Ice Cream 是水果搭配冰淇淋，也归在这一类。",
            "茶、奶和甜点类：茶有 Green Tea 和 Peach Tea，奶有 Yakult 和 Yakult Orange，甜点有 Vanilla Ice Cream、Taro Ice Cream、Butterscotch 和 Chocolate Dubai。名称里的 Ice Cream 指冰淇淋，并不代表清凉口味。Peach Tea 和 Yakult Orange 名称里也有水果，我们按名称的主词来归类。",
            "其余是 Cola、Mineral Water 和 Green Slush，名称没有直接写出水果或甜点。",
          ],
        },
        {
          heading: "名称带 50MG 的口味是什么？",
          paragraphs: [
            "有 5 款口味名称后面带 50MG：Grape、Watermelon、Double Mint、Mix Berries 和 Yakult。这 5 款各有两个版本：名称带 50MG 的和不带的，选购前请先核对列表里的名称。",
          ],
        },
        {
          heading: "烟弹长什么样？",
          paragraphs: [
            "烟弹一面是蜂窝纹，另一面印着口味名称，买了多种口味也能一眼分清。本页里我们店的视频把它叫作 LEGO 烟弹，取自它的外观；Muro 印在烟弹上的标语是“AWAKE YOUR NOSE.”。",
          ],
        },
      ],
    },
  },
  "muro-3ml": {
    th: {
      lede: "ด้านล่างร้านจัดกลิ่นของ Muro 3ML เป็นสายไว้ให้เลือกได้ง่ายขึ้น และเล่าถึงคำที่พิมพ์อยู่ข้างกล่องของกลิ่น Muro Grape ไว้ด้วย",
      sections: [
        {
          heading: "Muro 3ML กลิ่นไหนดี",
          paragraphs: [
            "เลือกจากสายที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่นที่พิมพ์ไว้บนกล่องของแต่ละกลิ่น สายเย็นมี Smooth Mint กลิ่นเดียว และเป็นชื่อเดียวในรายการที่มีคำว่า Mint",
            "สายองุ่นมีให้เลือกสองกลิ่น คือ Grape กับ Muro Grape ส่วนสายผลไม้มี Watermelon · Very Strawberry · Mix Berries · Strawberry Peach และ Apple Juice ชื่อที่มีผลไม้คู่กับอย่างอื่น อย่าง Honey Lemon กับ Blueberry Bubblegum ร้านก็จัดไว้ในสายนี้ด้วย",
            "แนวอื่นมี Cola · Mineral Water · Green Slush และ Double Shisha สี่ชื่อนี้ไม่ได้บอกผลไม้ตรง ๆ ร้านจึงแยกไว้อีกกลุ่ม วิธีเลือกกลิ่นจากชื่อแบบละเอียด อ่านต่อได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "ทำไมกล่อง Muro Grape มี VERY STRAWBERRY",
          paragraphs: [
            "ถ้าดูรูปกล่องของกลิ่น Muro Grape จะเห็นคำว่า VERY STRAWBERRY อยู่ที่ด้านข้างกล่อง คำนี้เป็นลายที่ผู้ผลิตพิมพ์มากับกล่องเอง ร้านจึงคงรูปไว้ตามต้นฉบับ กล่องนี้เป็นของกลิ่น Muro Grape ตามชื่อที่พิมพ์หน้ากล่อง ส่วน Very Strawberry มีกล่องของตัวเองแยกเป็นอีกกลิ่นหนึ่ง",
          ],
        },
        {
          heading: "สูบกลิ่นเดิมจนลิ้นชิน ทำยังไงดี",
          paragraphs: [
            "จากที่ร้านเจอ พอสูบกลิ่นเดิมไปสักพัก ลิ้นจะเริ่มชิน จนรู้สึกว่ารสไม่ชัดเท่าตอนแรก หัวพอตของ Muro 3ML แยกกลิ่นกันหัวละกลิ่น ถ้าเป็นแบบนี้ ลองสลับไปกลิ่นในสายอื่นบ้างก็ได้ แล้วค่อยกลับมากลิ่นเดิมทีหลัง",
          ],
        },
      ],
    },
    en: {
      lede: "Below, the Muro 3ML flavours sorted into groups to make choosing easier, plus a note on the words printed on the side of the Muro Grape box.",
      sections: [
        {
          heading: "Which Muro 3ML flavour should I pick?",
          paragraphs: [
            "Start with the kind of flavour you like. We grouped them by the words in the name printed on each flavour's box. The only cool one is Smooth Mint, the one name in the list with Mint in it.",
            "There are two grapes, Grape and Muro Grape. Fruit has Watermelon, Very Strawberry, Mix Berries, Strawberry Peach and Apple Juice, and we keep Honey Lemon and Blueberry Bubblegum here too, as they pair a fruit with something else.",
            "The rest are Cola, Mineral Water, Green Slush and Double Shisha, none of which names a fruit outright.",
          ],
        },
        {
          heading: "Why does the Muro Grape box say VERY STRAWBERRY?",
          paragraphs: [
            "In the Muro Grape box photo you'll see VERY STRAWBERRY on the side panel. That's part of the maker's own box artwork, so we've kept the image as it is. The name printed on the front says Muro Grape; Very Strawberry has its own box as a separate flavour.",
          ],
        },
        {
          heading: "What if a flavour starts to taste flat?",
          paragraphs: [
            "In our experience, after a while on the same flavour your palate gets used to it and the taste seems less clear than at first. Each Muro 3ML pod is a single flavour, so try one from another group for a while, then come back.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面把 Muro 3ML 的口味按类型分好组，方便挑选，也说明 Muro Grape 包装盒侧面印的字。",
      sections: [
        {
          heading: "Muro 3ML 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。我们按每个口味包装盒上印的名称来分组。清凉类只有 Smooth Mint 一款，也是列表里唯一带 Mint 的名称。",
            "葡萄类有两款：Grape 和 Muro Grape。水果类有 Watermelon、Very Strawberry、Mix Berries、Strawberry Peach 和 Apple Juice；Honey Lemon 和 Blueberry Bubblegum 是水果搭配其他元素，也归在这一类。",
            "其余是 Cola、Mineral Water、Green Slush 和 Double Shisha，名称没有直接写出水果。",
          ],
        },
        {
          heading: "为什么 Muro Grape 的包装盒上写着 VERY STRAWBERRY？",
          paragraphs: [
            "在 Muro Grape 的包装盒图片里，可以看到侧面印着 VERY STRAWBERRY。这是厂家包装本身的图案，所以我们保留了原样。盒子正面印的名称就是 Muro Grape；Very Strawberry 另有自己的包装盒，是另一款口味。",
          ],
        },
        {
          heading: "同一个口味抽久了觉得味道变淡，怎么办？",
          paragraphs: [
            "根据我们店的经验，同一个口味抽一段时间后，舌头会慢慢习惯，觉得味道不如一开始明显。Muro 3ML 每个烟弹只有一种口味，可以先换另一类口味抽一阵，再换回来。",
          ],
        },
      ],
    },
  },
  // List-new 30/10 (nexBar Switch 15K, warehouse-listed): no maker site. Facts = nexBar's own posters — the 15-flavour
  // line-up the warehouse keeps (Shipnity Max image 2764487: nexMesh Coil · 15000 puffs · 15ML · Nic 3%) and the
  // 10-flavour poster series a Thai shop carries verbatim (vmaniath.com/en/product/1273962: nexMesh Coil · 15000 puffs ·
  // 15ML; the pod prints the nexBar logo, "SWITCH" and a flavour label — the figure under SWITCH is not legible in any source, so it is not quoted).
  // Fit with SALTHUB M Switch (31/10, owner asked Friday to look it up — "ใช้ Chrome หาข้อมูลได้เลย"): no nexBar page exists;
  // Thai shops (vmaniath · goatvapethai "ทำออกมาให้ใช้กับตัวพอตรุ่น M SWITCH เท่านั้น" · pod789 "สำหรับเครื่อง Marbo M switch" ·
  // thshop24) + two reviewers plugging it into an M Switch on video (ปลัดอู๊ดพลังใบ 13/01/2569 · ชาคริต C9Vapor 15/01/2569) →
  // written plainly, no "official" claim (owner-requested lookup, independent hands-on tests). Link only on this page.
  // SEO (owner 30/10): H1 = the model name · H2 "รายละเอียดเพิ่มเติม" → H3 buyer questions · H2 "คำถามที่พบบ่อย".
  "nexbar-switch-15k-pod": {
    th: {
      lede: "nexBar Switch 15K เป็นหัวพอตบรรจุสำเร็จ แต่ละหัวมีน้ำยาของกลิ่นที่เลือกมาในตัว ด้านล่างสรุปจากโปสเตอร์ของ nexBar ไว้ให้ ว่าในหัวพอตมีอะไรบ้าง และ 15 กลิ่นแบ่งได้เป็นแนวไหน",
      sections: [
        {
          heading: "nexBar Switch 15K คืออะไร",
          paragraphs: [
            "nexBar Switch 15K เป็นหัวพอตบรรจุสำเร็จ หัวหนึ่งมีน้ำยา 15mL กับคอยล์ nexMesh อยู่ในตัว จึงไม่ต้องเติมน้ำยาหรือเปลี่ยนคอยล์เองเหมือนหัวพอตเปล่า",
            "หัวรุ่นนี้ใส่กับเครื่อง [SALTHUB M Switch](/products/m-switch-kit) ได้ ใช้หมดหัวหนึ่งก็ถอดเปลี่ยนเป็นหัวใหม่ได้เลย",
            "เลข 15K ในชื่อรุ่นตรงกับตัวเลขบนโปสเตอร์ของ nexBar ที่ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟ",
          ],
        },
        {
          heading: "nexBar Switch 15K มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "รุ่นนี้มีให้เลือก 15 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 3 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice หรือ Mint ได้แก่ Blueberry Ice · Grape Ice · Watermelon Ice และ Mint",
            "สายผลไม้ ได้แก่ Grape Lychee · Lychee · Mango Peach · Peach Strawberry · Pink Berry · Mixberry · Pineapple · Strawberry Banana และ Strawberry Watermelon",
            "แนวอื่นมี Cola กับ Strawberry Custard",
          ],
        },
        {
          heading: "nexBar Switch 15K ดูยังไงว่าหัวไหนเป็นกลิ่นอะไร",
          paragraphs: [
            "ด้านหน้าหัวพอตพิมพ์โลโก้ nexBar กับคำว่า SWITCH และมีป้ายบอกชื่อกลิ่นอยู่ด้วย ถ้าซื้อไปหลายกลิ่น ก็ดูจากป้ายนี้ได้เลยว่าหัวไหนเป็นกลิ่นอะไร",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar Switch 15K ใช้กับเครื่องอะไร",
          answer: "ใช้กับเครื่อง [SALTHUB M Switch](/products/m-switch-kit) ได้ค่ะ",
        },
        {
          question: "nexBar Switch 15K หัวหนึ่งสูบได้กี่พัฟ",
          answer: "โปสเตอร์ของ nexBar ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟค่ะ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคนนะคะ",
        },
        {
          question: "nexBar Switch 15K นิโคตินกี่ %",
          answer: "nexBar ระบุความเข้มข้นนิโคตินไว้ 3% ค่ะ",
        },
      ],
    },
    en: {
      lede: "The nexBar Switch 15K is a prefilled pod: each one comes with the e-liquid of the flavour you choose. Below is a summary from nexBar's own posters of what each pod holds and how the 15 flavours group.",
      sections: [
        {
          heading: "What is the nexBar Switch 15K?",
          paragraphs: [
            "The nexBar Switch 15K is a prefilled pod with 15mL of e-liquid and a built-in nexMesh coil, so there is no e-liquid to add and no coil to change as with an empty pod.",
            "It fits the [SALTHUB M Switch](/products/m-switch-kit): when one pod runs out, take it off and put on a new one.",
            "The 15K in the name matches nexBar's poster, which rates each pod for up to 15,000 puffs.",
          ],
        },
        {
          heading: "Which flavours does the nexBar Switch 15K come in?",
          paragraphs: [
            "There are 15 flavours. Grouped by name, they fall into three sets.",
            "Cool, with Ice or Mint in the name: Blueberry Ice, Grape Ice, Watermelon Ice and Mint.",
            "Fruit: Grape Lychee, Lychee, Mango Peach, Peach Strawberry, Pink Berry, Mixberry, Pineapple, Strawberry Banana and Strawberry Watermelon.",
            "Others: Cola and Strawberry Custard.",
          ],
        },
        {
          heading: "How do I tell which flavour a nexBar Switch 15K pod is?",
          paragraphs: [
            "The front of each pod is printed with the nexBar logo and the word SWITCH, along with a flavour label. If you buy several flavours, the label tells you which pod is which.",
          ],
        },
      ],
      faq: [
        {
          question: "Which device does the nexBar Switch 15K fit?",
          answer: "It fits the [SALTHUB M Switch](/products/m-switch-kit).",
        },
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
            "这款烟弹可以装在 [SALTHUB M Switch](/products/m-switch-kit) 主机上使用，一颗用完就取下换一颗新的。",
            "名字里的 15K 与 nexBar 海报上的数字一致：每颗烟弹最多 15,000 口。",
          ],
        },
        {
          heading: "nexBar Switch 15K 有哪些口味？",
          paragraphs: [
            "共 15 种口味，按名称大致分为三类。",
            "清凉系，名称带 Ice 或 Mint：Blueberry Ice、Grape Ice、Watermelon Ice 和 Mint。",
            "水果系：Grape Lychee、Lychee、Mango Peach、Peach Strawberry、Pink Berry、Mixberry、Pineapple、Strawberry Banana 和 Strawberry Watermelon。",
            "其他：Cola 和 Strawberry Custard。",
          ],
        },
        {
          heading: "nexBar Switch 15K 怎么分辨是哪种口味？",
          paragraphs: [
            "烟弹正面印有 nexBar 标志和 SWITCH 字样，并带有口味标签。买了好几种口味，看标签就知道哪颗是什么味道。",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar Switch 15K 适用于哪款主机？",
          answer: "可以装在 [SALTHUB M Switch](/products/m-switch-kit) 主机上使用。",
        },
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
  // Articles queue 0211 batch 5 (02/11): UWELL GPP pod — every fact = UWELL's G Pod Platform page (myuwell.com/g-pod-platform).
  // "Fits G5 · G4 · G3" and what the product is stay out: tagline + short description say them twice already (HANDOFF §18).
  // U² Anti-Leak's "150%" is not repeated (no spec row). UWELL's "new GPP cartridges coming in 2026" is not repeated (stale by
  // 11/2026). "The 4-resistance pods here are the refillable kind" = the shop's reading of UWELL's table (pre-filled = 0.9Ω only).
  "coil-94": {
    th: {
      lede: "ด้านล่างสรุปจากหน้า G Pod Platform ของ UWELL ว่า GPP คืออะไร หัว GPP มีกี่ชนิด และ UWELL ใส่อะไรไว้ในตัวหัวบ้าง",
      sections: [
        {
          heading: "GPP คืออะไร ดูยังไงว่าเป็นหัว GPP",
          paragraphs: [
            "GPP ย่อมาจาก G Pod Platform เป็นชื่อที่ UWELL ใช้เรียกระบบหัวพอตของ Caliburn กลุ่มนี้ทั้งหมด หัวในกลุ่มนี้มีคำว่า GPP พิมพ์ไว้บนกล่อง ถ้าอยากรู้ว่าหัวที่มีอยู่เป็นหัว GPP หรือเปล่า ก็ดูที่กล่องได้เลย",
          ],
        },
        {
          heading: "หัว GPP มีกี่ชนิด",
          paragraphs: [
            "หน้า G Pod Platform ของ UWELL แบ่งหัว GPP ไว้ 3 ชนิด",
            "สองชนิดแรกเป็นหัวที่เติมน้ำยาเอง ต่างกันตรงตำแหน่งช่องเติม ชนิดหนึ่งเติมด้านข้าง มีความจุ 3.0mL กับ 2.5mL อีกชนิดเติมด้านบน มีความจุ 3.0mL กับ 2.0mL และทั้งสองชนิดมีให้เลือก 4 ค่าโอห์ม",
            "ชนิดที่สามเป็นหัวพอตบรรจุสำเร็จ มีค่าเดียวคือ 0.9 โอห์ม หัวบนหน้านี้จึงเป็นชนิดที่เติมน้ำยาเอง เพราะมีให้เลือก 4 ค่าโอห์ม ใครยังไม่เคยเติม มีวิธีเติมทีละขั้นอยู่ที่ [เติมพอตยังไง](/guides/refilling-a-pod)",
          ],
        },
        {
          heading: "UWELL ใส่อะไรไว้ในหัว GPP",
          paragraphs: [
            "เรื่องกันรั่ว UWELL ใช้ระบบที่เรียกว่า U² Anti-Leak ซึ่งมีอยู่สองส่วน ส่วนแรกคือ ultrasonic welding ที่ UWELL บอกว่าช่วยให้หัวกันรั่วได้ดีขึ้น ส่วนที่สองคือช่องลมรูปตัว U ที่ช่วยให้ลมไหลได้ดีขึ้น",
            "อีกส่วนคือ PRO-FOCS ระบบปรับรสชาติที่ UWELL บอกว่าผ่านการทดสอบมาอย่างเข้มงวด ช่วยคงรสเดิมของน้ำยาไว้ และใช้ได้กับน้ำยาหลายความเข้มข้น ทั้งนิโคตินแบบ freebase และแบบ salt nic ถ้าอยากรู้ว่านิโคตินสองแบบต่างกันยังไง อ่านต่อได้ที่ [นิโคติน salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, a summary of UWELL's G Pod Platform page: what GPP is, how many kinds of GPP pod there are, and what UWELL builds into them.",
      sections: [
        {
          heading: "What is GPP, and how do I know a pod is GPP?",
          paragraphs: [
            "GPP stands for G Pod Platform, UWELL's name for this whole family of Caliburn pods. The boxes of these pods are marked GPP, so if you're not sure whether a pod you have is GPP, the box will tell you.",
          ],
        },
        {
          heading: "How many kinds of GPP pod are there?",
          paragraphs: [
            "UWELL's G Pod Platform page lists three kinds. Two are refillable and differ in where you fill them: side refill comes in 3.0 mL and 2.5 mL, top refill in 3.0 mL and 2.0 mL, and both come in four resistances. The third kind is pre-filled, in 0.9Ω only. The pods on this page come in four resistances, so they are the refillable kind.",
          ],
        },
        {
          heading: "What does UWELL build into GPP pods?",
          paragraphs: [
            "For leaks, UWELL uses what it calls U² Anti-Leak, made up of two parts: ultrasonic welding, which UWELL says improves leak protection, and a U-shaped channel that improves airflow. UWELL also builds in PRO-FOCS, a flavour system it describes as rigorously tested, made to keep the e-liquid's original taste and to work with a range of nicotine strengths, in both freebase and nicotine-salt form.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 UWELL 的 G Pod Platform 页面，介绍 GPP 是什么、GPP 烟弹有几种，以及 UWELL 在烟弹里用了哪些设计。",
      sections: [
        {
          heading: "GPP 是什么？怎么确认是 GPP 烟弹？",
          paragraphs: [
            "GPP 是 G Pod Platform 的缩写，是 UWELL 对这一整个 Caliburn 烟弹系列的称呼。这些烟弹的包装盒上都印有 GPP，不确定手上的烟弹是不是 GPP，看一下盒子即可。",
          ],
        },
        {
          heading: "GPP 烟弹有几种？",
          paragraphs: [
            "UWELL 的 G Pod Platform 页面把 GPP 烟弹分为 3 种。前两种是可自行注油的烟弹，区别在注油口位置：侧注油有 3.0 mL 和 2.5 mL，顶注油有 3.0 mL 和 2.0 mL，两种都有 4 种阻值。第三种是预注油烟弹，只有 0.9Ω 一种。本页烟弹有 4 种阻值可选，所以属于可注油的类型。",
          ],
        },
        {
          heading: "UWELL 在 GPP 烟弹里用了什么？",
          paragraphs: [
            "防漏方面，UWELL 采用 U² Anti-Leak 技术，由两部分组成：一是超声波焊接，UWELL 表示能提升防漏表现；二是 U 形气道，让气流更顺畅。UWELL 还在烟弹中加入了 PRO-FOCS 口味优化技术，UWELL 称其经过严格测试，能保留烟油原本的味道，并适用于多种浓度的游离碱尼古丁和尼古丁盐。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): UWELL Caliburn G coils — facts = UWELL's Caliburn G2, GK2 and X pages (in-app browser
  // 02/11). The bare 0.8 / 1.0 / 1.2 list stays out (tagline + short description give it). UWELL's G2 page (02/11) also says the G2
  // takes the Caliburn G 1.0Ω coil; details PR #1133 then made the spec row "ใช้ได้กับ" say so, so the article leaves G2 + 1.0Ω
  // to the table under it.
  "coil-53": {
    th: {
      lede: "คอยล์สามค่านี้ UWELL ตั้งชื่อรุ่นไว้ต่างกัน และเครื่องแต่ละรุ่นก็ให้คอยล์มาในกล่องคนละแบบ ด้านล่างสรุปไว้ทีละข้อตามที่ UWELL เขียนไว้บนหน้าเครื่องแต่ละรุ่น",
      sections: [
        {
          heading: "แต่ละค่าเป็นคอยล์รุ่นไหน",
          paragraphs: [
            "UWELL เรียกคอยล์ 1.2 โอห์มว่าคอยล์ Caliburn G2 ส่วนอีกสองค่าเรียกว่าคอยล์ Caliburn G และทั้งสามค่าทำจาก FeCrAl",
            "บนหน้า Caliburn G2 UWELL บอกว่าในกล่องเครื่องมีคอยล์ mesh มาให้สองตัว คือ 1.2 กับ 0.8 โอห์ม ตัว 1.2 โอห์มสำหรับสูบแบบ MTL ส่วนตัว 0.8 โอห์มสำหรับสูบ DTL แบบลมแน่น สองแนวการสูบนี้ต่างกันตรงไหน ร้านอธิบายไว้ที่ [MTL กับ DTL ต่างกันยังไง](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "เครื่องรุ่นไหนใส่ได้",
          paragraphs: [
            "Caliburn GK2 ใส่ได้ทั้งสามค่า ในกล่องมี 1.2 โอห์มติดเครื่องมา และมี 0.8 โอห์มเป็นตัวสำรอง ส่วน 1.0 โอห์มต้องซื้อแยก",
            "Caliburn X ก็ใช้คอยล์ตระกูล Caliburn G ในกล่องมี 0.8 โอห์มติดเครื่องมา และมี 1.2 โอห์มเป็นตัวสำรอง ส่วน 1.0 โอห์มต้องซื้อแยกเหมือนกัน",
            "ถ้ากำลังหาหัวพอตเปล่าที่ใช้กับคอยล์เหล่านี้ บนเว็บมี [หัวพอต Caliburn X](/products/coil-74) และ [หัวพอต Caliburn G2](/products/coil-55)",
          ],
        },
      ],
    },
    en: {
      lede: "These three coils carry different UWELL names, and each device comes with a different set of them in the box. Below, one point at a time, as UWELL states on each device's page.",
      sections: [
        {
          heading: "Which coil is each resistance?",
          paragraphs: [
            "UWELL calls the 1.2Ω coil the Caliburn G2 coil and the other two Caliburn G coils; all three are FeCrAl. On its Caliburn G2 page, UWELL says the kit includes two mesh coils, 1.2Ω and 0.8Ω: the 1.2Ω for MTL vaping and the 0.8Ω for a restricted DTL draw. Not sure how the two draws differ? See [MTL vs DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "Which devices take them?",
          paragraphs: [
            "The Caliburn GK2 takes all three: 1.2Ω fitted, 0.8Ω as a spare, 1.0Ω sold separately. The Caliburn X uses Caliburn G-family coils too: 0.8Ω fitted, 1.2Ω as a spare, 1.0Ω sold separately.",
            "Looking for an empty pod for these coils? The site has the [Caliburn X pod](/products/coil-74) and the [Caliburn G2 pod](/products/coil-55).",
          ],
        },
      ],
    },
    zh: {
      lede: "这三颗线圈在 UWELL 的命名各不相同，各款设备盒内附带的组合也不一样。下面根据 UWELL 各设备页面逐项说明。",
      sections: [
        {
          heading: "每种阻值是哪款线圈？",
          paragraphs: [
            "UWELL 把 1.2Ω 线圈称为 Caliburn G2 线圈，另外两种称为 Caliburn G 线圈，三款都是 FeCrAl 材质。UWELL 在 Caliburn G2 页面上说明，套装附带 1.2Ω 和 0.8Ω 两颗网状线圈：1.2Ω 用于 MTL 口吸，0.8Ω 用于偏紧的 DTL 肺吸。两种吸法的区别请看[MTL 与 DTL](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "哪些设备可以用？",
          paragraphs: [
            "Caliburn GK2 三种都能用：出厂装 1.2Ω，附备用 0.8Ω，1.0Ω 需另购。Caliburn X 同样使用 Caliburn G 系列线圈：出厂装 0.8Ω，附备用 1.2Ω，1.0Ω 需另购。",
            "想找能装这些线圈的空烟弹，本站有 [Caliburn X 烟弹](/products/coil-74) 和 [Caliburn G2 烟弹](/products/coil-55)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): UWELL Caliburn X empty pod — facts = UWELL's Caliburn X page (+ the G2 page / coil-55's
  // spec rows for the comparison paragraph). "หัวพอตเปล่า" = THAI_STYLE §3 (no coil in the box). Thai = thai-copy 02/11.
  "coil-74": {
    th: {
      lede: "ด้านล่างบอกว่าหัวพอตเปล่านี้ใส่คอยล์รุ่นไหนได้ น้ำยาเต็มหัวใช้ได้นานแค่ไหนตามที่ UWELL บอก และต่างจากหัวของ Caliburn G2 ตรงไหน",
      sections: [
        {
          heading: "หัวพอตเปล่าคืออะไร",
          paragraphs: [
            "หัวพอตเปล่าคือหัวพอตที่มาแต่ตัวหัว คอยล์เลือกค่าที่ต้องการแล้วใส่เอง จากนั้นก็เติมน้ำยาที่ชอบได้เลย คอยล์กับหัวเป็นคนละชิ้นกัน พอถึงรอบเปลี่ยนคอยล์ก็เปลี่ยนแค่คอยล์ แล้วใช้หัวเดิมต่อได้",
          ],
        },
        {
          heading: "ใส่คอยล์รุ่นไหนได้",
          paragraphs: [
            "ในกล่องชุด Caliburn X มีคอยล์ Caliburn G 0.8 โอห์มติดมากับเครื่อง และคอยล์ Caliburn G2 1.2 โอห์มเป็นตัวสำรอง ส่วนคอยล์ Caliburn G 1.0 โอห์มขายแยก",
            "คอยล์ทั้งสามค่านี้ดูได้ที่หน้า [คอยล์ Caliburn G](/products/coil-53)",
          ],
        },
        {
          heading: "น้ำยาเต็มหัวใช้ได้นานแค่ไหน",
          paragraphs: [
            "UWELL เขียนไว้บนหน้า Caliburn X ว่าแบต 850mAh ของเครื่องกับน้ำยา 3mL ในหัวนี้ สูบได้นานกว่าหนึ่งวัน ไม่ต้องคอยชาร์จหรือเติมน้ำยาบ่อย ส่วนจะอยู่ได้นานแค่ไหนจริง ๆ ก็ขึ้นอยู่กับว่าสูบถี่แค่ไหน",
          ],
        },
        {
          heading: "ต่างจากหัวของ Caliburn G2 ตรงไหน",
          paragraphs: [
            "หัวของ Caliburn G2 ก็ใช้คอยล์ชุดเดียวกันนี้ได้ ที่ต่างกันชัดคือความจุ หัวนั้นจุน้ำยา 2mL ส่วนหัวนี้จุได้มากกว่า ทั้งสองเป็นหัวพอตของคนละชุด จึงควรเลือกให้ตรงกับเครื่องที่ใช้อยู่ ถ้าใช้ Caliburn G2 ดู [หัวพอต Caliburn G2](/products/coil-55) แทนได้เลย",
            "ส่วนวิธีเติมน้ำยาและการดูแลคอยล์ให้ใช้ได้นานขึ้น อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
    },
    en: {
      lede: "Below: which coils this empty pod takes, how long a full pod lasts by UWELL's account, and how it differs from the Caliburn G2 pod.",
      sections: [
        {
          heading: "What is an empty pod?",
          paragraphs: [
            "An empty pod comes as the pod alone: you choose the coil you want, fit it yourself, then fill it with the e-liquid you like. The coil and the pod are separate parts, so when it's time for a new coil you change just the coil and keep the same pod.",
          ],
        },
        {
          heading: "Which coils does it take?",
          paragraphs: [
            "The Caliburn X kit comes with the Caliburn G 0.8Ω coil fitted and the Caliburn G2 1.2Ω coil as a spare; the Caliburn G 1.0Ω coil is sold separately. All three are on the [Caliburn G coils](/products/coil-53) page.",
          ],
        },
        {
          heading: "How long does a full pod last?",
          paragraphs: [
            "UWELL's Caliburn X page says the device's 850mAh battery and the 3 mL in this pod give more than a day of vaping, without frequent charging or refilling. How long it really lasts depends on how often you vape.",
          ],
        },
        {
          heading: "How is it different from the Caliburn G2 pod?",
          paragraphs: [
            "The Caliburn G2 pod takes the same coils. The clear difference is capacity: the G2 pod holds 2 mL and this one holds more. Each is the pod of its own kit, so pick the one that matches your device; on a Caliburn G2, see the [Caliburn G2 pod](/products/coil-55) instead. For refilling and coil care, see [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
    },
    zh: {
      lede: "下面介绍这款空烟弹能装哪些线圈、按 UWELL 的说法一仓烟油能用多久，以及与 Caliburn G2 烟弹的区别。",
      sections: [
        {
          heading: "什么是空烟弹？",
          paragraphs: [
            "空烟弹只有烟弹本身，线圈按需要的阻值另选、自己装上，再注入喜欢的烟油即可。线圈和烟弹是分开的部件，到了该换线圈的时候只换线圈，烟弹可以继续用。",
          ],
        },
        {
          heading: "能装哪些线圈？",
          paragraphs: [
            "Caliburn X 套装出厂装 Caliburn G 0.8Ω 线圈，附备用 Caliburn G2 1.2Ω 线圈；Caliburn G 1.0Ω 线圈需另购。三款都在[Caliburn G 线圈](/products/coil-53)页面。",
          ],
        },
        {
          heading: "一仓烟油能用多久？",
          paragraphs: [
            "UWELL 在 Caliburn X 页面上写道，设备的 850mAh 电池加上这款烟弹的 3 mL 烟油，可以用一天以上，不必频繁充电或注油。实际能用多久取决于抽吸频率。",
          ],
        },
        {
          heading: "和 Caliburn G2 烟弹有什么不同？",
          paragraphs: [
            "Caliburn G2 烟弹也能用同样这几款线圈，明显的区别在容量：Caliburn G2 烟弹装 2 mL，这款装得更多。两者分属不同套装，请按自己的设备选择；用 Caliburn G2 的话，请看 [Caliburn G2 烟弹](/products/coil-55)。注油和线圈保养请看[线圈与烟弹保养](/guides/coil-and-pod-maintenance)。",
          ],
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
