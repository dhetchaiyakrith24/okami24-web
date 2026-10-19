/**
 * The homepage hero's light ribbons (round "หน้าแรก hero", owner 20/10): orange only, drawn in code
 * so they stay sharp at every width and cost no video bytes. Plain canvas 2D, no React, no library.
 *
 * A ribbon is a bundle of thin lines that share one wandering path; the bundle's width swings
 * through zero, which reads as a band of light twisting in space. Additive blending ("lighter")
 * makes the places where lines bunch up glow on their own. A second, quarter-size canvas receives a
 * copy of every frame and is blurred by CSS — that is the soft halo, for the price of one drawImage.
 *
 * Motion is "medium" (owner): a slow drift, a beat when the visitor scrolls (speed follows scroll
 * velocity) and a surge whenever the hero changes product (`surge()`), so the ribbons carry the
 * change. The caller starts/stops the loop (off-screen, hidden tab) and decides when only a single
 * still frame is wanted (reduced motion / Save-Data).
 */

type Ribbon = {
  /** lines in the bundle (desktop; phones draw 60 %) */
  n: number;
  /** path: two sine waves — amplitude, frequencies, drift speeds, phases */
  amp: number; f1: number; f2: number; s1: number; s2: number; p1: number; p2: number;
  /** bundle width, twist frequency, twist drift, vertical offset from the focus point */
  w: number; tw: number; ts: number; yc: number;
  /** per-line opacity */
  a: number;
  /** draw a warm near-white core along the middle lines */
  core?: boolean;
};

const RIBBONS: Ribbon[] = [
  { n: 54, amp: 0.15, f1: 0.5, f2: 1.25, s1: 0.03, s2: 0.045, p1: 0, p2: 0.3, w: 0.13, tw: 0.95, ts: 0.05, yc: 0.02, a: 0.22, core: true },
  { n: 40, amp: 0.11, f1: 0.75, f2: 1.7, s1: -0.026, s2: 0.038, p1: 0.55, p2: 0.1, w: 0.09, tw: 1.45, ts: -0.045, yc: 0.14, a: 0.16 },
  { n: 30, amp: 0.19, f1: 0.38, f2: 1.05, s1: 0.022, s2: -0.032, p1: 0.2, p2: 0.7, w: 0.07, tw: 0.7, ts: 0.06, yc: -0.12, a: 0.12 },
];

const TAU = Math.PI * 2;

export type RibbonFocus = { x: number; y: number };

export class HeroRibbons {
  private ctx: CanvasRenderingContext2D;
  private gtx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private phone = false;
  private t = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private surgeLeft = 0;
  private scrollV = 0;
  private lastY = 0;
  private lastYT = 0;
  private grads: { main: CanvasGradient; core: CanvasGradient; len: number } | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private glow: HTMLCanvasElement,
    /** where the bundle crosses — the product's centre, in canvas CSS pixels */
    private focus: () => RibbonFocus,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.gtx = glow.getContext("2d")!;
    this.resize();
    this.lastY = window.scrollY;
    this.lastYT = performance.now();
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.phone = window.innerWidth < 1024;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.glow.width = Math.max(1, Math.ceil(r.width / 4));
    this.glow.height = Math.max(1, Math.ceil(r.height / 4));
    this.grads = null;
  }

  /** The hero changed product — the ribbons speed up and brighten for ~1.6 s. */
  surge() {
    this.surgeLeft = 1;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** One still frame (reduced motion, Save-Data). */
  still() {
    this.stop();
    this.draw(16);
  }

  destroy() {
    this.stop();
    window.removeEventListener("scroll", this.onScroll);
  }

  private onScroll = () => {
    const now = performance.now();
    const dy = window.scrollY - this.lastY;
    const dt = Math.max(16, now - this.lastYT);
    this.scrollV = this.scrollV * 0.6 + Math.abs(dy / dt) * 1000 * 0.4;
    this.lastY = window.scrollY;
    this.lastYT = now;
  };

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(64, now - this.last);
    this.last = now;
    this.draw(dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  private gradients(len: number) {
    if (this.grads && this.grads.len === len) return this.grads;
    const ctx = this.ctx;
    // along the band: faint behind the headline (left), full behind the product, out at the edges
    const fadeIn = this.phone ? 0.18 : 0.36;
    const main = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
    main.addColorStop(0, "rgba(255,106,44,0)");
    main.addColorStop(fadeIn * 0.6, "rgba(255,106,44,.25)");
    main.addColorStop(fadeIn + 0.12, "rgba(255,120,60,1)");
    main.addColorStop(0.5, "rgba(255,160,100,1)");
    main.addColorStop(0.82, "rgba(255,106,44,.7)");
    main.addColorStop(1, "rgba(255,106,44,0)");
    const core = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
    core.addColorStop(0, "rgba(255,200,160,0)");
    core.addColorStop(fadeIn, "rgba(255,200,160,0)");
    core.addColorStop(0.5, "rgba(255,200,160,1)");
    core.addColorStop(0.75, "rgba(255,200,160,.6)");
    core.addColorStop(1, "rgba(255,200,160,0)");
    this.grads = { main, core, len };
    return this.grads;
  }

  private draw(dt: number) {
    const { ctx, w, h, phone } = this;
    if (!w || !h) return;
    const heroP = Math.min(1, Math.max(0, window.scrollY / h));
    this.surgeLeft = Math.max(0, this.surgeLeft - dt / 1600);
    const surge = Math.sin((Math.min(1, this.surgeLeft) * Math.PI) / 2);
    this.scrollV *= Math.pow(0.9, dt / 16);
    const speed = 1 + Math.min(this.scrollV / 900, 1.6) + surge * 3.2;
    this.t += (dt / 1000) * speed;
    const T = this.t;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    const f = this.focus();
    const ang = phone ? -0.52 : -0.26;
    const len = Math.hypot(w, h) * 1.25;
    const span = phone ? Math.max(h * 0.62, 420) : h;
    const strength = (1 - heroP * 0.65) * (1 + surge * 0.55);
    const { main, core } = this.gradients(len);
    const S = phone ? 70 : 110;

    ctx.save();
    ctx.translate(f.x, f.y - heroP * h * 0.15);
    ctx.rotate(ang);
    for (const r of RIBBONS) {
      const n = phone ? Math.round(r.n * 0.6) : r.n;
      // the path itself does not depend on the line — compute it once per ribbon per frame
      const base = new Float32Array(S + 1);
      const twistArg = new Float32Array(S + 1);
      for (let j = 0; j <= S; j++) {
        const u = j / S;
        base[j] = span * (r.yc + r.amp * Math.sin(TAU * (r.f1 * u + T * r.s1 + r.p1)) + r.amp * 0.45 * Math.sin(TAU * (r.f2 * u - T * r.s2 + r.p2)));
        twistArg[j] = r.tw * u * 2 + T * r.ts;
      }
      ctx.strokeStyle = main;
      ctx.lineWidth = phone ? 0.9 : 1;
      for (let i = 0; i < n; i++) {
        const k = i / (n - 1) - 0.5;
        ctx.globalAlpha = r.a * strength * (0.55 + 0.45 * Math.cos(k * Math.PI));
        ctx.beginPath();
        for (let j = 0; j <= S; j++) {
          const u = j / S;
          const x = (u - 0.5) * len;
          const y = base[j] + k * r.w * span * Math.sin(Math.PI * (twistArg[j] + k * 0.12)) + Math.sin(TAU * (2.6 * u + T * 0.18 + i * 0.045)) * 1.6;
          if (j) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
        if (r.core && Math.abs(k) < 0.06) {
          ctx.strokeStyle = core;
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = 0.45 * strength;
          ctx.stroke();
          ctx.strokeStyle = main;
          ctx.lineWidth = phone ? 0.9 : 1;
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    this.gtx.clearRect(0, 0, this.glow.width, this.glow.height);
    this.gtx.drawImage(this.canvas, 0, 0, this.glow.width, this.glow.height);
  }
}
