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
export function ProductReviewVideo({
  video,
  eyebrow,
  watchOnYoutubeLabel,
}: {
  video: { videoId: string; title: string; channelName: string };
  eyebrow: string;
  watchOnYoutubeLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-mono text-xs text-foreground-dim">{eyebrow}</span>
      <a
        href={`https://www.youtube.com/watch?v=${video.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${watchOnYoutubeLabel}: ${video.title}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-surface-border-soft bg-surface-1"
      >
        <Image
          src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
          alt={video.title}
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
        <p className="text-sm font-medium text-foreground">{video.title}</p>
        <p className="text-xs text-foreground-dim">{video.channelName}</p>
      </div>
    </div>
  );
}
