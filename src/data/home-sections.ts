import type { HeroType } from "@/data/home-hero";

/**
 * The homepage below the hero, by product TYPE (owner 20/10 ~03:40: "not Caliburn-centred — a
 * section per type, e.g. Pod System with the Caliburn line and the best picks, then disposables with
 * every product/brand as the existing cards"). Same four types, same order as the hero's tabs; the
 * section titles reuse the hero tabs' words (dict.heroShowcase.types), so no new copy.
 *
 * Every product of the section's categories is shown (desktop: the sideways rail; phones: the first
 * PHONE_CARDS cards, then "see all N"). `first` = the models that lead the row — Friday's picks for
 * the best-looking / flagship models of each type, swappable here in one line. Owner 20/10: no
 * "best seller" wording anywhere (there are no sales figures), so the order carries no claim.
 */
export const HOME_TYPE_SECTIONS: { type: HeroType; categories: string[]; first: string[] }[] = [
  {
    type: "pod-systems",
    categories: ["pod-systems"],
    first: ["caliburn-g5", "argus-g4", "caliburn-g5-lite", "argus-p3", "caliburn-g4-pro-koko", "vmate-pro-2", "drag-6"],
  },
  {
    type: "switch-pods",
    categories: ["switch-pods"],
    first: ["m-switch-kit", "relx-infinity-2-plus", "nexpod-15k", "zero-pro", "pod-159"],
  },
  {
    type: "disposables",
    categories: ["disposables"],
    first: ["m-bar-10k", "relx-smash-go-12k", "infy-20k", "joiway-f4", "mq-bar-22k", "relx-lumi-18k", "esko-bar-20k"],
  },
  {
    type: "heated-tobacco-devices",
    categories: ["heated-tobacco-devices", "heated-tobacco-consumables"],
    first: ["iqosheet-17", "iqosheet-18", "iqosheet-16", "iqosheet-14", "iqosheet-15"],
  },
];

/** cards shown per section on a phone (two rows of two … three rows) before "see all N" */
export const PHONE_CARDS = 6;
/** cards shown per section on a tablet (two rows of four) */
export const TABLET_CARDS = 8;
