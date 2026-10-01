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
  // DRAFT (batch 1, 02/10) — written only from the verified spec rows already on the page, to let the owner pick the
  // article format. The real text is written from UWELL's G5 page once the cloud can reach myuwell.com.
  "caliburn-g5": {
    th: {
      lede: "Caliburn G5 คือรุ่นที่ UWELL ใส่จอสีกับระบบแตะสลับโหมดลงในตัวเครื่องขนาดพกพา ใครที่อยากได้พอตซิสเต็มที่เห็นแบตและวัตต์ได้ทันที โดยไม่ต้องกดปุ่มไล่เมนู รุ่นนี้ตอบโจทย์ตรงนั้น",
      sections: [
        {
          heading: "Caliburn G5 ต่างจาก G5 Lite ตรงไหน",
          paragraphs: [
            "ทั้งสองรุ่นใช้แบต 1600mAh และขึ้นได้สูงสุด 35 วัตต์เท่ากัน สิ่งที่ G5 เพิ่มมาคือจอสี 0.85 นิ้วที่โชว์แบต วัตต์ และโหมดในหน้าเดียว กับระบบ Smart Triple-Tap Control ที่ใช้การแตะแทนการกดปุ่ม",
            "ถ้าไม่ได้ต้องการจอ และอยากได้ตัวเครื่องที่ใช้งานเรียบง่ายกว่า ดู [Caliburn G5 Lite](/products/caliburn-g5-lite) ประกอบได้",
          ],
        },
        {
          heading: "แตะสลับโหมดใช้งานยังไง",
          paragraphs: [
            "ตัวเครื่องมีเซ็นเซอร์จับการแตะ แตะตามจังหวะที่ UWELL กำหนดเพื่อสลับโหมดวัตต์หรือเช็คสถานะเครื่อง ตัวเครื่องจึงไม่มีแถวปุ่มเกะกะ และจอจะบอกทันทีว่าตอนนี้อยู่โหมดไหน",
          ],
        },
        {
          heading: "เลือกวัตต์และหัวพอตให้เข้ากับการสูบ",
          paragraphs: [
            "G5 ปรับวัตต์ได้ตั้งแต่ 5–35 วัตต์ ใช้หัวพอตตระกูล GPP แบบเติมน้ำยาด้านบน คนที่สูบแน่นแบบ MTL (ดูดเข้าปากก่อน) กับคนที่ชอบโล่งขึ้นจะตั้งวัตต์และเลือกหัวพอตต่างกัน ถ้ายังไม่แน่ใจว่าตัวเองสูบแบบไหน อ่าน [MTL กับ DTL ต่างกันยังไง](/guides/understanding-mtl-vs-dtl) ก่อน แล้วค่อยดู [วิธีเลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
          ],
        },
      ],
    },
    en: {
      lede: "The Caliburn G5 is where UWELL puts a colour screen and tap-to-switch control into a pocket-size body — for anyone who wants to see battery and wattage at a glance without clicking through a menu.",
      sections: [
        {
          heading: "How is the Caliburn G5 different from the G5 Lite?",
          paragraphs: [
            "Both carry a 1600mAh battery and a 35W ceiling. The G5 adds a 0.85\" colour screen that shows battery, wattage and mode on one view, and Smart Triple-Tap Control, which switches modes by tapping instead of pressing buttons.",
            "If you do not need the screen and want a simpler device, compare the [Caliburn G5 Lite](/products/caliburn-g5-lite).",
          ],
        },
        {
          heading: "How does tap-to-switch work?",
          paragraphs: [
            "A sensor in the body reads taps in the pattern UWELL sets to switch output modes or check the device status, so there is no row of buttons, and the screen shows which mode is active.",
          ],
        },
        {
          heading: "Matching wattage and pods to how you draw",
          paragraphs: [
            "The G5 runs from 5 to 35W on top-fill GPP pods. A tight MTL draw and a looser one call for different wattage and pods — if you are not sure which you are, read [MTL vs. DTL](/guides/understanding-mtl-vs-dtl), then [choosing wattage and airflow](/guides/choosing-wattage-and-airflow).",
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
