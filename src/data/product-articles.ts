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
};

/** The active locale's article for a product, falling back to English; undefined when the product has none. */
export function productArticle(slug: string, locale: Locale): ProductArticleCopy | undefined {
  const rec = PRODUCT_ARTICLES[slug];
  return rec?.[locale] ?? rec?.en;
}
