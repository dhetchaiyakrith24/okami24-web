import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Hold the image optimizer to two workers (2026-09-06).
     *
     * libvips sizes its thread pool from the CPU count it can see, and a container sees the host's
     * CPUs rather than its own share — measured on this project, `sharp.concurrency()` reported 32.
     * Next already halves libvips' default to 16, which is still far more than a Render Starter
     * (0.5 CPU, 512MB) can feed: each worker holds its own decode buffers while resizing, so the
     * thread count multiplies peak memory without buying any speed the CPU can deliver. When a
     * native allocation fails, libvips does not raise a catchable JavaScript error — the process
     * dies, and the kernel reports it as a segfault.
     *
     * Two is deliberate: enough to overlap decoding one image with encoding another, few enough to
     * stay inside the box. This number is used as given — `image-optimizer.js` only computes a
     * fraction of the CPU count when `imgOptConcurrency` is unset, so setting 2 means libvips runs
     * with 2 (measured, not assumed).
     *
     * Set here rather than by calling `sharp.concurrency()` ourselves: Next owns the optimizer, and
     * two places configuring the same pool means neither one is the answer.
     *
     * 2026-09-09, stability round: lowered from 2 to 1. On a 0.5-CPU instance the second worker
     * cannot run in parallel with the first anyway — there is no second half-core to put it on —
     * so it buys no throughput and only adds a second set of decode buffers to the peak. One
     * worker is the honest match for half a CPU.
     */
    imgOptConcurrency: 1,
  },

  images: {
    /**
     * 2026-09-09, stability round. Two changes, both aimed at the same thing: how often this
     * 512MB instance has to run libvips at all.
     *
     * `minimumCacheTTL` — Next 16 defaults to 14400 (4 hours), and that default is visible in
     * production: `curl -I` on any `/_next/image` URL of the live site returned
     * `Cache-Control: public, max-age=14400`. Four hours is also how far apart the six recorded
     * out-of-memory restarts sit (7 Sep 15:38, 16:01, 21:21, 22:50 · 8 Sep 00:03, 03:54). When
     * that TTL lapses the optimizer re-encodes the SAME image from source again, so the box pays
     * the full memory cost of the whole catalogue several times a day forever, for images that
     * have not changed since they were committed.
     *
     * 30 days, not the year the round asked for, and the reason is worth keeping: these URLs are
     * not content-hashed. `/assets/products/<slug>/card.png` is a stable path whose FILE gets
     * replaced whenever a better photo is sourced — that happens regularly on this project. A
     * one-year immutable answer means a visitor who has seen the old photo keeps seeing it for a
     * year. 30 days removes ~180 of the ~185 re-encodings a year while keeping the worst-case
     * staleness to something a redeploy plus a month will clear. Going to a year is safe the day
     * these filenames carry a content hash; it is not safe today.
     *
     * `deviceSizes` — the stock list ends 1920, 2048, 3840. Nothing on this site renders that
     * wide: the largest `sizes` in the codebase is `90vw`/`100vw`, so even a 2560-wide desktop
     * asks for 1920. But `/_next/image?...&w=3840` is a URL anyone — a crawler, a scanner — may
     * request, and it is the single most expensive thing this instance can be asked to do. The
     * two top entries are dropped; every width a real browser picks at 390 and at 1440 is still
     * here, which is why the 1440 screenshots of all seven pages stay pixel-identical.
     *
     * `imageSizes` is deliberately NOT trimmed. It feeds fixed-px `sizes` values (there are
     * `64px`, `144px` and `10vw` cases in the codebase) and changing it would change which file a
     * browser picks — a different resample, i.e. moved pixels, for no memory gain.
     */
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  /**
   * 2026-09-09, stability round: let the edge keep the ORIGINAL files.
   *
   * Measured on the live site: `/_next/image?...` comes back `cf-cache-status: DYNAMIC` —
   * Cloudflare does not cache it at all, so every product image on every page view is served by
   * the Render box itself. The same check on `/assets/products/caliburn-g5/card.png` came back
   * `cf-cache-status: MISS`, i.e. that one IS cacheable, just cold, because it has a real file
   * extension. Giving those originals a long, immutable answer is the part of the problem this
   * repo can fix on its own.
   *
   * It has a second effect that matters more: the docs for `minimumCacheTTL` say the optimized
   * image's max-age is "either the minimumCacheTTL or the upstream image Cache-Control header,
   * whichever is larger", so this header raises the floor for the optimizer's own cache too.
   *
   * `/_next/image` itself still needs a Cloudflare Cache Rule to be cached at the edge — that
   * lives in the Cloudflare dashboard, not in this repo. See docs/LAUNCH_AUDIT.md, the server
   * stability entry.
   */
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },

  /**
   * Retired product pages → the page that now sells the same thing (permanent, so Google moves the old URL's
   * standing to the new one). A slug listed here is `hiddenFromStorefront` in its data file.
   *
   * m-bar-15k (owner 2026-10-08, chat): with the clear M Bar pod off the site (BSOT "M Bar 15K / M Switch Pod"),
   * the 15K is the M Switch body + the black pod = the M Switch Kit, so its page folds into the Kit's.
   */
  async redirects() {
    return [{ source: "/products/m-bar-15k", destination: "/products/m-switch-kit", permanent: true }];
  },
};

export default nextConfig;
