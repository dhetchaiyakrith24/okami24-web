import Image from "next/image";

/**
 * A real OKami24-channel review video, rendered as a thumbnail card that LINKS OUT to YouTube
 * rather than an inline iframe embed (owner mandate, 2026-09-03 — "avoid heavy embeds that
 * unnecessarily damage performance", satisfied here even more directly: zero YouTube script or
 * iframe ever loads on this page, full stop).
 *
 * This was deliberately changed from an initial click-to-load-iframe design after live testing
 * found the real failure mode: YouTube age-restricts most vape-review content, and an
 * age-restricted video refuses to play inside ANY embedded iframe at all ("Sorry, this content is
 * age-restricted... only available on YouTube") — confirmed directly on this catalog's own review
 * videos. An inline embed would therefore silently dead-end for much of exactly the content this
 * feature exists to surface. Linking out is not a fallback here, it's the only approach that
 * reliably works for this content category — the thumbnail (a plain `i.ytimg.com` image request,
 * no tracking) still gives the visual preview without that risk.
 */
/** Round 10B rule, one place since round "clip" (2026-09-27): on an English/Chinese page a clip whose YouTube title
 *  is Thai shows no title line and is named by its channel instead (alt + screen-reader label), so the text the site
 *  writes around a clip is always in the page's language. */
export function hideThaiClipTitle(locale: string, title: string): boolean {
  return locale !== "th" && /[ก-ฺเ-๛]/.test(title);
}

export function ProductReviewVideo({
  video,
  eyebrow,
  watchOnYoutubeLabel,
  hideTitle = false,
  contextName,
  hiddenTitleLabel,
}: {
  video: { videoId: string; title: string; channelName: string };
  eyebrow: string;
  watchOnYoutubeLabel: string;
  /** Round 10B (owner ruling 2026-09-24: 0 Thai on the en/zh guide pages): the clip's own YouTube title is Thai for
   *  the shop's channels, so an English/Chinese guide page drops the title line and names the channel instead in the
   *  image's alt/label. Opt-in — every other caller renders exactly as before. */
  hideTitle?: boolean;
  /** Round "clip" (designer): with the title hidden, the channel alone does not say what the clip is about — the
   *  page's own name (a model name, a brand) is added to the alt/label, in the page's language. */
  contextName?: string;
  /** Round "clip" (owner 2026-09-27): with the Thai title hidden, this line (page language, e.g. "Hands-on review
   *  (in Thai)") takes the title's place, so the card still says what the clip is. */
  hiddenTitleLabel?: string;
}) {
  const accessibleName = hideTitle ? (contextName ? `${video.channelName} · ${contextName}` : video.channelName) : video.title;
  return (
    <div className="flex flex-col gap-3">
      <span className="label-mono text-xs text-foreground-dim">{eyebrow}</span>
      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${watchOnYoutubeLabel}: ${accessibleName}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-surface-border-soft bg-surface-1"
      >
        <Image
          src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
          alt={accessibleName}
          fill
          sizes="(min-width: 1024px) 42vw, 90vw"
          className="object-cover"
          unoptimized
        />
        <span className="absolute inset-0 bg-black/25 transition-colors duration-200 group-hover:bg-black/35" aria-hidden />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ember/90 shadow-lg transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </a>
      <div className="flex flex-col gap-0.5">
        {!hideTitle && <p className="text-sm font-medium text-foreground">{video.title}</p>}
        {hideTitle && hiddenTitleLabel && <p className="text-sm font-medium text-foreground">{hiddenTitleLabel}</p>}
        <p className="text-xs text-foreground-dim">{video.channelName}</p>
      </div>
    </div>
  );
}
