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
     */
    imgOptConcurrency: 2,
  },
};

export default nextConfig;
