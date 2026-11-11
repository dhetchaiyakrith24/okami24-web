import type { NextConfig } from "next";

/**
 * Content-Security-Policy (owner 09/11 "ความปลอดภัยของเว็บ"): the browser may only load scripts, styles, fonts and
 * data from this site, so a script tag injected through some future bug cannot pull code from another host, and a
 * page cannot send what it reads (a customer's order, the staff pages) to another host (`connect-src 'self'`).
 *
 * No nonce, on purpose: a nonce has to differ per response, which forces every page to render per request — the
 * home and product pages are prerendered and served from the Cloudflare cache today (`x-nextjs-prerender: 1`), and
 * a 0.5-CPU Render box should not render them per visitor. Without a nonce Next's own inline bootstrap scripts need
 * `'unsafe-inline'` (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md "Without Nonces"),
 * so this does not stop an inline script that is already in the HTML; it does stop every other host.
 *
 * Every outside host the site actually loads from, measured on the built pages 09/11:
 * - https://i.ytimg.com — the review-video thumbnails (ProductReviewVideo, `unoptimized`, so the browser fetches it).
 * - blob: — the slip / refund-slip / bill previews (`URL.createObjectURL`) · data: — inline SVG/PNG in CSS and props.
 * - worker-src 'self' — the hero ribbons run in a same-origin worker (ribbon-driver.ts).
 * - Cloudflare Web Analytics (T2-48, 10/11): Cloudflare adds its own beacon to every HTML page at the edge —
 *   https://static.cloudflareinsights.com/beacon.min.js (script) reporting to https://cloudflareinsights.com/cdn-cgi/rum
 *   (connect). The policy blocked it, so the dashboard counted nothing and every page logged a CSP error. Those two hosts only.
 * `frame-ancestors 'self'` says what X-Frame-Options SAMEORIGIN says, for browsers that read only CSP.
 * `next dev` needs `'unsafe-eval'` for React's dev tooling; production never sends it.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  /** No `x-powered-by: Next.js` on responses (owner 04/11 security pass): it only tells a scanner what to try. */
  poweredByHeader: false,

  /**
   * Version-skew protection (owner 11/11: "หลังจากกดสินค้าเปลี่ยนหน้า ขึ้นภาพจอดำและมีปุ่มให้กด Reload"). Every merge
   * redeploys Render, and the new build renames its JS chunks. A tab opened before the deploy then asks for chunks that are
   * gone on its next client-side navigation, and Next shows its black error screen with a Reload button.
   * With a deployment id, Next stamps it on assets and navigation requests; when the client's id differs from the server's
   * it does a full page load instead (node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/
   * deploymentId.md "How it works"). Render sets RENDER_GIT_COMMIT at build time and run time. Unset (local builds,
   * the test server) = undefined = Next behaves exactly as before.
   */
  deploymentId: process.env.RENDER_GIT_COMMIT || undefined,

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
      /**
       * Security headers on every response (owner 04/11 "ความปลอดภัยของเว็บ"). Before this, `curl -D -` on the live
       * home and /products returned none of them. Each one is a browser-side rule only — nothing the pages render changes:
       * - HSTS: browsers go straight to https (http:// already 301s at Cloudflare). One year, no `includeSubDomains`
       *   and no `preload`, so no other host name is bound by it.
       * - nosniff: a file is only ever read as the type the server says (an uploaded slip cannot run as a script).
       * - SAMEORIGIN: no other site can show these pages inside a frame (clickjacking on the cart and staff pages).
       *   Nothing on the site frames itself or is framed elsewhere (videos open on YouTube, never in an iframe).
       * - Referrer-Policy: the browsers' own default, stated so an old browser cannot send full URLs (order links) on.
       * - Permissions-Policy: no page uses the microphone, location, payment or USB APIs. The camera is left alone —
       *   the slip upload uses a file input, which this header does not govern.
       */
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ],
      },
      /**
       * Config headers beat the ones a route sets, so the block above would replace the slip route's own stricter
       * `no-referrer` (src/app/api/line/slip/[token]/route.ts — the address itself is the key to a customer's slip).
       * The last matching entry wins, so this one has to stay below the block above.
       */
      {
        source: "/api/line/slip/:token",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
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
   *
   * pod-kits (owner 2026-10-19, chat): the category is retired — its refillable devices joined pod-systems and the
   * prefilled-pod devices got their own switch-pods page — so the old category URL goes to pod-systems, which ends
   * the two pages splitting the bare query "pod" (GSC 18/10).
   */
  async redirects() {
    return [
      { source: "/products/m-bar-15k", destination: "/products/m-switch-kit", permanent: true },
      { source: "/products/pod-kits", destination: "/products/pod-systems", permanent: true },
    ];
  },
};

export default nextConfig;
