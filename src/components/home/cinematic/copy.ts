/**
 * Cinematic display copy — deliberately English-only regardless of the site's active locale
 * (owner direction, Phase 3.3.1). Brand/model names are English everywhere on the site anyway;
 * this file is the single place that copy lives so nothing here silently drifts into the i18n
 * dictionary system by accident.
 */
export const CINEMATIC_COPY = {
  void: "OKM",
  uwellBrand: "UWELL",
  uwellLine: "Precision, mastered.",
  voopooBrand: "VOOPOO",
  voopooLine: "Force, controlled.",
  heroBrand: "SALTHUB · M BAR",
  heroLine: "Bold by design.",
  finaleMark: "OKAMI24",
  skip: "Skip intro",
} as const;
