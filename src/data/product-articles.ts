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
      lede: "Caliburn G5 คือรุ่นที่ UWELL ใส่จอสี ระบบแตะ 3 ครั้ง และตัวเครื่องอะลูมิเนียมมาในชุดเดียว แถมหัวพอตในกล่องอีก 3 หัว ด้านล่างไล่ให้ดูทีละจุดจากข้อมูลของ UWELL พร้อมตอบเรื่องที่คนมักถามก่อนซื้อ",
      sections: [
        {
          heading: "Caliburn G5 ต่างจาก G5 Lite ยังไง",
          paragraphs: [
            "สองรุ่นนี้ใช้แบต 1600mAh และขึ้นได้สูงสุด 35 วัตต์เท่ากัน ที่ต่างกันคือวิธีดูสถานะและวิธีสั่งงาน G5 มีจอสี 0.85 นิ้วที่บอกแบต วัตต์ และโหมดในหน้าเดียว ใช้การแตะ 3 ครั้งเป็นปุ่มลัด และปรับลมด้านข้างได้แบบไม่มีขั้น ส่วน G5 Lite บอกระดับแบตด้วยไฟ LED 4 ขีด",
            "ถ้าอยากเห็นตัวเลขบนจอและชอบตัวเครื่องอะลูมิเนียม G5 ตอบโจทย์กว่า ถ้าอยากได้เครื่องที่ใช้ง่ายและไม่ต้องดูจอ ลองดู [Caliburn G5 Lite](/products/caliburn-g5-lite) ประกอบ"
          ]
        },
        {
          heading: "หัวพอต Alpha ที่แถมมาในกล่องดียังไง",
          paragraphs: [
            "ทุกชุดมีหัวพอต 3 หัว หนึ่งในนั้นคือหัว GPP Alpha 0.6 โอห์ม ซึ่ง UWELL ออกแบบด้วยเทคโนโลยี AlphaCore ให้คอยล์อยู่ได้นานขึ้น และให้รสชาติคงที่ตั้งแต่พัฟแรกจนหมดหัว ส่วนอีก 2 หัวเป็นหัว GPP รุ่นปกติ โอห์มและแบบเติมน้ำยาต่างกันตามรุ่นจำหน่ายของแต่ละประเทศ",
            "ปากดูดยาง TPU นุ่ม ๆ ของหัว Alpha นั้น UWELL ใส่ให้หัว GPP รุ่นปกติด้วย เวลาซื้อหัวพอตเพิ่ม ใช้ได้ทั้งหัว GPP แบบเติมด้านข้างและเติมด้านบน"
          ]
        },
        {
          heading: "แตะ 3 ครั้ง ใช้งานจริงยังไง",
          paragraphs: [
            "แตะตรงไหนของตัวเครื่องก็ได้ 3 ครั้ง แล้วตั้งเองว่าจะให้ทำอะไร ระหว่างสลับโหมด เปลี่ยนธีมหน้าจอ หรือปรับความสว่าง UWELL ตั้งใจให้ใช้ได้ตอนที่มองจอไม่ถนัด เช่น ตอนเดิน ในที่มืด หรือกลางแดดจ้า ไม่ต้องก้มหาปุ่มเล็ก ๆ"
          ]
        },
        {
          heading: "เลือกสียังไงดี",
          paragraphs: [
            "G5 มี 7 สี แต่ละสีมาพร้อมธีมหน้าจอที่ทำมาคู่กัน เลือกสีตัวเครื่องจึงเท่ากับเลือกบรรยากาศของหน้าจอไปด้วย ตัวเครื่องเป็นอะลูมิเนียมผิวด้าน ไม่ค่อยติดรอยนิ้วมือ ถือแล้วกระชับมือ"
          ]
        },
        {
          heading: "ปรับลมให้เข้ากับการสูบ",
          paragraphs: [
            "ตัวปรับลมอยู่ด้านข้างเครื่อง เลื่อนได้ต่อเนื่องไม่มีขั้น ตั้งแต่สูบแน่นแบบ MTL (ดูดเข้าปากก่อน) ไปจนถึงโล่งขึ้นแบบ RDL ถ้ายังไม่แน่ใจว่าตัวเองสูบแบบไหน อ่าน [MTL กับ DTL ต่างกันยังไง](/guides/understanding-mtl-vs-dtl) ก่อน",
            "ถ้ากำลังเทียบ G5 กับ G4 หรือ Caliburn รุ่นอื่น มีตารางเทียบสเปกทีละคู่ไว้ที่ [Caliburn G5 vs G4 ต่างกันยังไง](/guides/comparing-caliburn-models)"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G5 is where UWELL puts a colour screen, triple-tap control and an aluminium body in one kit, with three pods in the box. Below, each point is shown from UWELL's own material, with the questions people usually ask before buying.",
      sections: [
        {
          heading: "How is the Caliburn G5 different from the G5 Lite?",
          paragraphs: [
            "Both run on a 1600mAh battery up to 35W. The difference is how you read and control them: the G5 has a 0.85\" colour screen showing battery, wattage and mode on one view, a triple tap as a shortcut, and stepless side airflow; the G5 Lite shows battery level on a 4-bar LED.",
            "If you want numbers on a screen and an aluminium body, the G5 fits better; for something simpler with no screen to read, see the [Caliburn G5 Lite](/products/caliburn-g5-lite)."
          ]
        },
        {
          heading: "What is special about the Alpha pod in the box?",
          paragraphs: [
            "Every kit has three pods, one of them a 0.6Ω GPP Alpha cartridge, which UWELL built with its AlphaCore technology for a longer coil life and steady flavour from the first puff to the last. The other two are standard GPP pods; their resistance and refill style depend on the market version.",
            "The Alpha's soft-touch TPU mouthpiece is also fitted to UWELL's standard GPP pods. When you buy more pods, both side-refill and top-refill GPP cartridges fit."
          ]
        },
        {
          heading: "How does the triple tap work day to day?",
          paragraphs: [
            "Triple-tap anywhere on the body and choose what it does: switch mode, change the screen theme or adjust brightness. UWELL designed it for moments when the screen is hard to read — walking, in the dark or in bright sunlight — so there is no small button to find."
          ]
        },
        {
          heading: "Choosing a colour",
          paragraphs: [
            "The G5 comes in 7 colours, each paired with its own screen theme, so picking a finish also picks the look of the screen. The body is matte aluminium alloy that resists fingerprints and sits comfortably in the hand."
          ]
        },
        {
          heading: "Setting the airflow to how you draw",
          paragraphs: [
            "The airflow control sits on the side and moves without steps, from a tighter MTL draw to a looser RDL. Not sure which you are? Read [MTL vs. DTL](/guides/understanding-mtl-vs-dtl) first.",
            "Comparing the G5 with the G4 or another Caliburn? The pair-by-pair spec comparison is in [Caliburn G5 vs G4](/guides/comparing-caliburn-models)."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G5 把彩色屏幕、三击控制和铝合金机身放进同一套装，盒内还附 3 颗烟弹。下面按 UWELL 官方资料逐项介绍，并回答购买前常见的问题。",
      sections: [
        {
          heading: "Caliburn G5 和 G5 Lite 有什么不同？",
          paragraphs: [
            "两款都是 1600mAh 电池、最高 35W。不同在于查看与操作方式：G5 有 0.85 英寸彩色屏幕，一屏显示电量、功率和模式，用三击作为快捷键，侧边进气可无级调节；G5 Lite 则用 4 格 LED 显示电量。",
            "想在屏幕上看到数字、喜欢铝合金机身，选 G5 更合适；想要更简单、不用看屏幕的机器，可以看看 [Caliburn G5 Lite](/products/caliburn-g5-lite)。"
          ]
        },
        {
          heading: "盒内的 Alpha 烟弹好在哪里？",
          paragraphs: [
            "每套附 3 颗烟弹，其中一颗是 0.6Ω 的 GPP Alpha 烟弹。UWELL 采用 AlphaCore 技术，让线圈寿命更长，从第一口到最后一口口味稳定。另外两颗是普通 GPP 烟弹，阻值和注油方式因销售版本而异。",
            "Alpha 的软质 TPU 烟嘴，UWELL 也用在了普通 GPP 烟弹上。另购烟弹时，侧注油和顶注油的 GPP 烟弹都可以用。"
          ]
        },
        {
          heading: "三击在日常使用中怎么用？",
          paragraphs: [
            "在机身任意位置连敲三下，并自行设定它的功能：切换模式、更换屏幕主题或调节亮度。UWELL 的设计初衷是在不方便看屏幕时也能操作，比如走路、在暗处或强光下，不必去找小按键。"
          ]
        },
        {
          heading: "怎么选颜色？",
          paragraphs: [
            "G5 共有 7 种颜色，每种颜色都配有专属的屏幕主题，选机身颜色也就选了屏幕的风格。机身为磨砂铝合金，不易留指纹，握感舒适。"
          ]
        },
        {
          heading: "按吸法调节进气",
          paragraphs: [
            "进气调节在机身侧面，可无级滑动，从较紧的 MTL 到较松的 RDL。还不确定自己的吸法？先看 [MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
            "如果正在比较 G5 与 G4 或其他 Caliburn，可以看逐对规格对比：[Caliburn G5 vs G4](/guides/comparing-caliburn-models)。"
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
