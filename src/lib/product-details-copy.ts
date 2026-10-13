import { LOCALES, type Locale } from "@/i18n/config";
import { productArticle, type ProductArticleCopy } from "@/data/product-articles";
import { STORY_COPY, type StoryBlockCopy } from "@/i18n/story-copy";
import { ANATOMY_SHEETS, type AnatomySheet } from "@/i18n/anatomy-sheet-copy";
import { PRODUCT_COPY_TH, type ProductCopyTh } from "@/i18n/product-copy-th";

/**
 * One legacy product's slice of the "more details" copy tables, built by the server page and handed to
 * ProductMoreDetails as a prop (round SEO ฉ batch 4, 14/10). ProductMoreDetails and its children are Client Components:
 * importing STORY_COPY, ANATOMY_SHEETS and the product articles there put every product's text (~300 KB) into the
 * browser bundle of every /products/* page. The lookups are the same ones the components made before.
 */
export interface ProductDetailsCopy {
  /** `productArticle(slug, locale)` per locale — the English fallback already applied; a missing key = no article. */
  articles: Partial<Record<Locale, ProductArticleCopy>>;
  story?: Record<string, StoryBlockCopy>;
  anatomySheet?: AnatomySheet;
  /** PRODUCT_COPY_TH[slug]?.features — the Thai overlay for the story blocks. */
  featuresTh?: ProductCopyTh["features"];
}

export function productDetailsCopy(slug: string): ProductDetailsCopy {
  const articles: Partial<Record<Locale, ProductArticleCopy>> = {};
  for (const l of LOCALES) {
    const a = productArticle(slug, l);
    if (a) articles[l] = a;
  }
  return { articles, story: STORY_COPY[slug], anatomySheet: ANATOMY_SHEETS[slug], featuresTh: PRODUCT_COPY_TH[slug]?.features };
}
