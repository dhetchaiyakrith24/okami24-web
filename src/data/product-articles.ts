import type { ArticleSubsection } from "@/types/catalog";
import type { Locale } from "@/i18n/config";

/**
 * Article round (owner 30/09 + 02/10: every product page carries an article in its "more details" section, written to
 * answer what a buyer asks — docs/rounds/รอบบทความ-รายละเอียดเพิ่มเติม.txt). One record per product slug, one copy
 * per locale; a locale without a copy falls back to `en`, then shows nothing.
 *
 * - `lede`: two sentences under the section heading, before the posters.
 * - `sections`: the article itself, after the all-options grid — H3 blocks whose headings are buyer questions.
 *   Paragraphs may carry inline links `[text](/path)` (ArticleBody's syntax), at most three per article.
 *
 * Every product fact here must come from the maker (THAI_STYLE §5 "แหล่งอ้างอิง" — maker pages, posters, manuals);
 * the source per sentence lives in the batch's source table (docs/cloud-results/รอบบทความ-รายละเอียดเพิ่มเติม.md).
 * Never repeat a spec-sheet number on its own, never answer a question the product's own `faqs` already answer.
 * This text does not reach <title>/meta/JSON-LD (they read head-copy / shortDescription only).
 */
export interface ProductArticleCopy {
  lede: string;
  sections: ArticleSubsection[];
}

export const PRODUCT_ARTICLES: Record<string, Partial<Record<Locale, ProductArticleCopy>>> = {
  // Batch 1 (02/10): written from UWELL's G5 page, its spec sheet and the G5 Lite page (sources per sentence:
  // docs/cloud-results/รอบบทความ-รายละเอียดเพิ่มเติม.md §5). Owner format A, ~2,500 Thai characters.
  "caliburn-g5": {
    th: {
      lede: "Caliburn G5 มีจอสี แตะสามครั้งเพื่อสลับโหมด ตัวเครื่องเป็นอะลูมิเนียม และในกล่องมีหัวพอตมาให้สามหัว ด้านล่างคือรายละเอียดทีละข้อจาก UWELL",
      sections: [
        {
          heading: "Caliburn G5 ต่างจาก G5 Lite ยังไง",
          paragraphs: [
            "สองรุ่นนี้แบต 1600mAh และสูงสุด 35 วัตต์เท่ากัน ที่ต่างคือวิธีดูสถานะเครื่องกับวิธีใช้งาน G5 มีจอสี 0.85 นิ้ว บอกแบต วัตต์ และโหมดไว้ในหน้าเดียว และใช้การแตะสามครั้งเป็นทางลัด ส่วน G5 Lite ไม่มีจอสีและไม่มีระบบแตะ บอกระดับแบตด้วยไฟ LED 4 ขีด",
            "ถ้าอยากเห็นตัวเลขบนจอและสลับโหมดด้วยการแตะ G5 เหมาะกว่า ถ้าอยากได้เครื่องที่ใช้ง่าย ไม่ต้องดูจอ ดู [Caliburn G5 Lite](/products/caliburn-g5-lite) แทน",
            "ถ้ากำลังเทียบ G5 กับ G4 หรือ Caliburn รุ่นอื่น ดูตารางเทียบสเปกทีละคู่ได้ที่ [Caliburn G5 vs G4 ต่างกันยังไง](/guides/comparing-caliburn-models)"
          ]
        },
        {
          heading: "GPP Alpha ต่างจากหัว GPP ปกติยังไง",
          paragraphs: [
            "ในสามหัวที่มากับกล่อง มี GPP Alpha 0.6 โอห์มอยู่หนึ่งหัว UWELL บอกว่าหัวนี้ใช้ AlphaCore ทำให้คอยล์ใช้ได้นานขึ้น และรสชาติคงที่ตั้งแต่พัฟแรกถึงพัฟสุดท้าย อีกสองหัวเป็นหัว GPP ปกติ โอห์มและแบบเติมน้ำยาต่างกันตามรุ่นจำหน่ายของแต่ละประเทศ",
            "ปากดูดของหัว Alpha เป็นยาง TPU นุ่มปาก และ UWELL ใส่ปากดูดแบบนี้ให้หัว GPP ปกติด้วย"
          ]
        },
        {
          heading: "แตะสามครั้ง ทำอะไรได้บ้าง",
          paragraphs: [
            "ตั้งได้ว่าแตะสามครั้งแล้วให้เครื่องสลับโหมด เปลี่ยนธีมหน้าจอ หรือปรับความสว่าง แตะตรงไหนของตัวเครื่องก็ได้ UWELL ทำมาให้ใช้ตอนที่มองจอไม่ถนัด เช่น ตอนเดิน ในที่มืด หรือกลางแดด"
          ]
        },
        {
          heading: "7 สีต่างกันแค่สีตัวเครื่องไหม",
          paragraphs: [
            "ไม่ใช่แค่สีตัวเครื่อง G5 มี 7 สี แต่ละสีมีธีมหน้าจอของตัวเอง เลือกสีก็คือเลือกหน้าตาของจอไปด้วย ตัวเครื่องเป็นอะลูมิเนียมผิวด้าน ไม่ค่อยติดรอยนิ้วมือ"
          ]
        },
        {
          heading: "ปรับลมได้แค่ไหน",
          paragraphs: [
            "ตัวปรับลมอยู่ด้านข้างเครื่อง ปรับได้ละเอียดแบบไม่มีขั้น ตั้งแต่สูบแน่นแบบ MTL ไปจนถึงโล่งขึ้นแบบ RDL ถ้ายังไม่แน่ใจว่าตัวเองสูบแนวไหน อ่าน [MTL กับ DTL](/guides/understanding-mtl-vs-dtl) ก่อน"
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
            "Both have a 1600mAh battery and a 35W maximum. The difference is how you read and use them: the G5 has a 0.85\" colour screen showing battery, wattage and mode on one view, and a triple tap as a shortcut; the G5 Lite has no colour screen and no tap control, and shows battery level on a 4-bar LED.",
            "If you want numbers on a screen and tap-to-switch, the G5 fits better; for something simpler with no screen to read, see the [Caliburn G5 Lite](/products/caliburn-g5-lite) instead.",
            "Comparing the G5 with the G4 or another Caliburn? The pair-by-pair spec comparison is in [Caliburn G5 vs G4](/guides/comparing-caliburn-models)."
          ]
        },
        {
          heading: "How is GPP Alpha different from a standard GPP pod?",
          paragraphs: [
            "Of the three pods in the box, one is a 0.6Ω GPP Alpha. UWELL says it uses AlphaCore for a longer coil life and steady flavour from the first puff to the last. The other two are standard GPP pods; their resistance and refill style depend on the market version.",
            "The Alpha's mouthpiece is soft-touch TPU, and UWELL fits the same mouthpiece to its standard GPP pods."
          ]
        },
        {
          heading: "What can the triple tap do?",
          paragraphs: [
            "Set a triple tap to switch mode, change the screen theme or adjust brightness — anywhere on the body. UWELL made it for moments when the screen is hard to read: walking, in the dark or in bright sunlight."
          ]
        },
        {
          heading: "Do the 7 colours differ only in colour?",
          paragraphs: [
            "Not only the body: each of the 7 colours has its own screen theme, so picking a colour also picks the look of the screen. The body is matte aluminium alloy that resists fingerprints."
          ]
        },
        {
          heading: "How far does the airflow adjust?",
          paragraphs: [
            "The airflow control is on the side and adjusts steplessly, from a tighter MTL draw to a looser RDL. Not sure which you are? Read [MTL vs. DTL](/guides/understanding-mtl-vs-dtl) first."
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
            "两款都是 1600mAh 电池、最高 35W。不同在于查看与操作方式：G5 有 0.85 英寸彩色屏幕，一屏显示电量、功率和模式，并用三击作为快捷操作；G5 Lite 没有彩色屏幕和敲击控制，用 4 格 LED 显示电量。",
            "想在屏幕上看到数字、用敲击切换模式，选 G5 更合适；想要更简单、不用看屏幕的机器，可以看 [Caliburn G5 Lite](/products/caliburn-g5-lite)。",
            "如果正在比较 G5 与 G4 或其他 Caliburn，可以看逐对规格对比：[Caliburn G5 vs G4](/guides/comparing-caliburn-models)。"
          ]
        },
        {
          heading: "GPP Alpha 和普通 GPP 烟弹有什么不同？",
          paragraphs: [
            "盒内 3 颗烟弹中有 1 颗是 0.6Ω 的 GPP Alpha。UWELL 表示它采用 AlphaCore，线圈寿命更长，从第一口到最后一口口味稳定。另外 2 颗是普通 GPP 烟弹，阻值和注油方式因销售版本而异。",
            "Alpha 的烟嘴是软质 TPU，UWELL 也把同样的烟嘴用在普通 GPP 烟弹上。"
          ]
        },
        {
          heading: "三击能做什么？",
          paragraphs: [
            "可以设定三击来切换模式、更换屏幕主题或调节亮度，在机身任意位置敲击即可。UWELL 的设计是让你在不方便看屏幕时也能操作，比如走路、在暗处或强光下。"
          ]
        },
        {
          heading: "7 种颜色只是机身颜色不同吗？",
          paragraphs: [
            "不只是机身：7 种颜色各有专属的屏幕主题，选颜色也就选了屏幕的样子。机身为磨砂铝合金，不易留指纹。"
          ]
        },
        {
          heading: "进气能调到什么程度？",
          paragraphs: [
            "进气调节在机身侧面，可无级调节，从较紧的 MTL 到较松的 RDL。还不确定自己的吸法？先看 [MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。"
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
