/**
 * The homepage hero's light ribbons (round "หน้าแรก hero", owner 20/10): orange only, drawn in code
 * so they stay sharp at every width and cost no video bytes. WebGL 1, no library.
 *
 * A ribbon is a bundle of thin lines that share one wandering path; the bundle's width swings
 * through zero, which reads as a band of light twisting in space. Lines are added on top of each
 * other (additive blending), so the places where they bunch up glow on their own; a second pass
 * draws a few of them again as wide soft strokes — the halo.
 *
 * Why WebGL and not canvas 2D (the draft): measured 20/10 at 1440×900, the same picture stroked
 * with canvas 2D ran at ~17 fps (raster cost of ~14k gradient segments a frame), while the path
 * maths costs nothing on a GPU. Here the whole path is computed in the vertex shader from a handful
 * of uniforms: the CPU uploads one static strip and the per-line values once per detail level, then each
 * frame only sets uniforms and issues nine instanced draws.
 *
 * Motion is "medium" (owner): a slow drift, a beat when the visitor scrolls (speed follows scroll
 * velocity) and a surge whenever the hero changes product (`surge()`), so the ribbons carry the
 * change. The caller starts/stops the loop (off-screen, hidden tab) and decides when only a single
 * still frame is wanted (reduced motion / Save-Data). No WebGL = no ribbons (the hero still works).
 * By default the engine runs in a worker on an OffscreenCanvas (hero-ribbons.worker.ts), so the
 * page's main thread has no animation loop at all; mainThreadDriver() is the fallback.
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

/** halo pass: every Nth line, drawn this wide (CSS px, half-width) at this share of its opacity */
const HALO = { every: 2, halfWidth: 16, alpha: 0.075 };

const VERT = `
attribute float a_u;
attribute float a_side;
uniform vec2 u_res;
uniform vec2 u_focus;
attribute float a_k; // line offset across the bundle (-0.5 … 0.5)
attribute float a_i; // line index (its small wobble)
attribute float a_f; // line opacity falloff
uniform float u_ang, u_len, u_span, u_T, u_halfw, u_alpha, u_off;
uniform vec4 u_r1; // amp f1 f2 s1
uniform vec4 u_r2; // s2 p1 p2 w
uniform vec3 u_r3; // tw ts yc
// flow layer: the ribbon follows a route laid on the PAGE (control points of a Catmull-Rom spline,
// already in canvas px for this frame), so it scrolls with the boxes instead of swaying on screen.
// u_s0 = index of the first point in the whole route, so the waves and the pulse stay tied to the page.
uniform float u_flow, u_npts, u_s0;
uniform vec2 u_pts[24];
varying float v_u;
varying float v_g;
varying float v_side;
varying float v_alpha;
const float TAU = 6.2831853;
const float PI = 3.1415927;
vec2 P(float i) {
  float j = clamp(i, 0.0, u_npts - 1.0);
  for (int k = 0; k < 24; k++) {
    if (float(k) == j) return u_pts[k];
  }
  return u_pts[0];
}
vec2 spine(float u) {
  float s = clamp(u, 0.0, 1.0) * (u_npts - 1.0);
  float i = min(floor(s), u_npts - 2.0);
  float t = s - i;
  vec2 a = P(i - 1.0);
  vec2 b = P(i);
  vec2 c = P(i + 1.0);
  vec2 d = P(i + 2.0);
  float t2 = t * t;
  return 0.5 * (2.0 * b + (c - a) * t + (2.0 * a - 5.0 * b + 4.0 * c - d) * t2 + (3.0 * b - a - 3.0 * c + d) * t2 * t);
}
vec2 flowAt(float u) {
  vec2 c = spine(u);
  vec2 tg = normalize(spine(u + 0.002) - c + vec2(0.0, 1e-4));
  float w = (u_s0 + u * (u_npts - 1.0)) * 0.45;
  float lat = u_span * (u_r3.z * 0.5 + u_r1.x * 0.4 * sin(TAU * (u_r1.y * w + u_T * u_r1.w + u_r2.y)))
            + a_k * u_r2.w * u_span * sin(PI * (u_r3.x * w * 2.0 + u_T * u_r3.y + a_k * 0.12))
            + sin(TAU * (2.6 * w + u_T * 0.18 + a_i * 0.045)) * 1.6;
  return c + vec2(-tg.y, tg.x) * lat;
}
vec2 pathAt(float u) {
  if (u_flow > 0.5) return flowAt(u);
  float w = u + u_off;
  float base = u_span * (u_r3.z + u_r1.x * sin(TAU * (u_r1.y * w + u_T * u_r1.w + u_r2.y))
             + u_r1.x * 0.45 * sin(TAU * (u_r1.z * w - u_T * u_r2.x + u_r2.z)));
  float y = base + a_k * u_r2.w * u_span * sin(PI * (u_r3.x * w * 2.0 + u_T * u_r3.y + a_k * 0.12))
          + sin(TAU * (2.6 * w + u_T * 0.18 + a_i * 0.045)) * 1.6;
  float x = (u - 0.5) * u_len;
  float c = cos(u_ang);
  float s = sin(u_ang);
  return u_focus + vec2(x * c - y * s, x * s + y * c);
}
void main() {
  vec2 p = pathAt(a_u);
  vec2 t = normalize(pathAt(a_u + 0.0015) - p);
  vec2 pos = p + vec2(-t.y, t.x) * a_side * u_halfw;
  vec2 clip = pos / u_res * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_u = a_u;
  v_g = u_s0 + a_u * (u_npts - 1.0);
  v_side = a_side;
  v_alpha = u_alpha * a_f;
}`;

const FRAG = `
precision mediump float;
varying float v_u;
varying float v_g;
// (its own name: a uniform shared by both shaders must have one precision, and the vertex side is highp)
uniform float u_flowF;
varying float v_side;
varying float v_alpha;
uniform float u_fade, u_core, u_halo, u_feather;
uniform vec3 u_pulse; // amount, time, wave offset — bright and dim patches drifting along the ribbon (flow layer)
// flow layer: the text blocks that sit on the page without a box (headings, ledes, links), in canvas
// CSS px (x, y, w, h). The ribbon fades softly to a glow behind them, so no sharp line crosses a word.
uniform vec4 u_holes[16];
uniform float u_nholes, u_canvasH, u_dpr;
// flow layer, scroll-driven (owner 20/10 ~05:40): x = route position of the scroll "head", y = draw
// only up to the head (the line is laid as the visitor scrolls), z = glow while scrolling (0 … 1)
uniform vec3 u_head;
vec4 stop2(float u, float a, vec4 ca, float b, vec4 cb) { return mix(ca, cb, clamp((u - a) / (b - a), 0.0, 1.0)); }
vec4 mainGrad(float u) {
  // along the band: faint behind the headline (left), full behind the product, out at the edges.
  // Colour = the shop orange leaning a little to the logo red (owner 20/10 ~04:30).
  vec4 c0 = vec4(1.0, 0.36, 0.165, 0.0);
  vec4 c1 = vec4(1.0, 0.36, 0.165, 0.25);
  vec4 c2 = vec4(1.0, 0.41, 0.215, 1.0);
  vec4 c3 = vec4(1.0, 0.56, 0.37, 1.0);
  vec4 c4 = vec4(1.0, 0.36, 0.165, 0.7);
  float a = u_fade * 0.6;
  float b = u_fade + 0.12;
  if (u < a) return stop2(u, 0.0, c0, a, c1);
  if (u < b) return stop2(u, a, c1, b, c2);
  if (u < 0.5) return stop2(u, b, c2, 0.5, c3);
  if (u < 0.82) return stop2(u, 0.5, c3, 0.82, c4);
  return stop2(u, 0.82, c4, 1.0, c0);
}
vec4 coreGrad(float u) {
  vec4 z = vec4(1.0, 0.784, 0.627, 0.0);
  vec4 f = vec4(1.0, 0.784, 0.627, 1.0);
  vec4 h = vec4(1.0, 0.784, 0.627, 0.6);
  if (u < u_fade) return z;
  if (u < 0.5) return stop2(u, u_fade, z, 0.5, f);
  if (u < 0.75) return stop2(u, 0.5, f, 0.75, h);
  return stop2(u, 0.75, h, 1.0, z);
}
void main() {
  // flow: one even colour along the route (its ends are off screen) · hero: the band's gradient
  vec4 g = u_flowF > 0.5 ? (u_core > 0.5 ? vec4(1.0, 0.784, 0.627, 1.0) : vec4(1.0, 0.4, 0.2, 1.0))
         : (u_core > 0.5 ? coreGrad(v_u) : mainGrad(v_u));
  float d = abs(v_side);
  float edge = u_halo > 0.5 ? exp(-d * d * 3.5) : 1.0 - smoothstep(1.0 - u_feather, 1.0, d);
  float beat = 0.5 + 0.5 * sin(6.2831853 * (v_g * 0.42 - u_pulse.y * 0.09));
  float a = g.a * v_alpha * edge * mix(1.0, 0.35 + 1.05 * beat * beat, u_pulse.x);
  if (u_head.y > 0.5) a *= 1.0 - smoothstep(u_head.x - 0.35, u_head.x + 0.02, v_g);
  float near = (v_g - u_head.x) / 0.45;
  a *= 1.0 + u_head.z * 1.6 * exp(-near * near);
  vec2 p = vec2(gl_FragCoord.x, u_canvasH - gl_FragCoord.y) / u_dpr;
  for (int i = 0; i < 16; i++) {
    if (float(i) >= u_nholes) break;
    vec4 r = u_holes[i];
    vec2 q = abs(p - (r.xy + r.zw * 0.5)) - r.zw * 0.5;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    a *= mix(0.1, 1.0, smoothstep(-6.0, 44.0, dist));
  }
  gl_FragColor = vec4(g.rgb * a, a);
}`;

type Uniforms = Record<string, WebGLUniformLocation | null>;

/**
 * "hero" = the band across the hero, through the product · "flow" = the same ribbons
 * and carried down the rest of the homepage behind the sections (HomeFlow, owner 20/10 ~05:00: like
 * his reference — thick and soft like the hero's, behind frosted boxes, brightness that swells and
 * dims). In flow mode the ribbon follows a route laid on the page (`holes`: route points + the text
 * blocks it fades behind); `scroll` = the page's scroll past the top of the flow area, used only to
 * place that route on the sticky canvas — the ribbon scrolls with the page and never sways.
 */
export type RibbonMode = "hero" | "flow";

/** One instanced draw: which lines (k · index · opacity falloff), how wide, which look. */
type Batch = { buf: WebGLBuffer; count: number; ribbon: Ribbon; kind: "halo" | "line" | "core"; values: number[] };

/**
 * The per-line values of every ribbon, as instance data — built once per detail level, so a frame
 * is a handful of uniforms and nine instanced draws instead of one draw per line (measured 20/10:
 * one draw per line, ~450 GL calls a frame).
 */
function lineSets(r: Ribbon, phone: boolean) {
  const n = phone ? Math.round(r.n * 0.6) : r.n;
  const halo: number[] = [];
  const line: number[] = [];
  const core: number[] = [];
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1) - 0.5;
    const f = 0.55 + 0.45 * Math.cos(k * Math.PI);
    line.push(k, i, f);
    if (i % HALO.every === 0) halo.push(k, i, f);
    if (r.core && Math.abs(k) < 0.06) core.push(k, i, 1);
  }
  return { halo, line, core };
}

type Ctx2Canvas = HTMLCanvasElement | OffscreenCanvas;
const frameLater: (cb: (t: number) => void) => number =
  typeof requestAnimationFrame === "function" ? (cb) => requestAnimationFrame(cb) : (cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
const cancelFrame: (id: number) => void =
  typeof cancelAnimationFrame === "function" ? (id) => cancelAnimationFrame(id) : (id) => clearTimeout(id);

/**
 * The renderer. It knows nothing about the page: the owner of the canvas tells it the size, the
 * focus point and the scroll position (`size` · `focus` · `scroll`), so the same code runs on the
 * main thread or inside a worker on an OffscreenCanvas (hero-ribbons.worker.ts — the default: a
 * main-thread animation loop made the browser re-tick every other animation on the page each frame,
 * measured 20/10 as ~1 s of style work per 5 s from the brand strip alone).
 */
export class RibbonEngine {
  private gl: WebGLRenderingContext;
  private inst: ANGLE_instanced_arrays | null;
  private prog: WebGLProgram;
  private u: Uniforms = {};
  private strips: { buf: WebGLBuffer; count: number }[] = [];
  private batches: Batch[][] = [];
  private a: Record<"u" | "side" | "k" | "i" | "f", number> = { u: 0, side: 0, k: 0, i: 0, f: 0 };
  private w = 0;
  private h = 0;
  private dpr = 1;
  private phone = false;
  private fx = 0;
  private fy = 0;
  private scrollY = 0;
  private t = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private surgeLeft = 0;
  private scrollV = 0;
  private lastScrollT = 0;
  /** flow layer: text blocks to fade behind, relative to the top of the flow area (x, y, w, h …) */
  private holeRects: number[] = [];
  private areaH = 0;
  private holeBuf = new Float32Array(64);
  /** flow layer: the route's control points (x, y …, CSS px from the top of the flow area) */
  private route: number[] = [];
  private ptBuf = new Float32Array(48);
  /** flow layer, scroll-driven: draw up to the scroll head · glow around it while scrolling */
  private drawOnScroll = false;
  private glowOnScroll = false;
  private head = 0;
  private glow = 0;

  /** Returns null when WebGL is unavailable — the caller simply shows no ribbons. */
  static create(canvas: Ctx2Canvas, mode: RibbonMode = "hero"): RibbonEngine | null {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" }) as WebGLRenderingContext | null;
    if (!gl) return null;
    try {
      return new RibbonEngine(canvas, gl, mode);
    } catch {
      return null;
    }
  }

  private constructor(
    private canvas: Ctx2Canvas,
    gl: WebGLRenderingContext,
    private mode: RibbonMode,
  ) {
    this.gl = gl;
    this.inst = gl.getExtension("ANGLE_instanced_arrays");
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
    this.prog = prog;
    gl.useProgram(prog);
    for (const name of ["u_res", "u_focus", "u_ang", "u_len", "u_span", "u_T", "u_halfw", "u_alpha", "u_r1", "u_r2", "u_r3", "u_fade", "u_core", "u_halo", "u_feather", "u_off", "u_pulse", "u_holes", "u_nholes", "u_canvasH", "u_dpr", "u_head", "u_flow", "u_flowF", "u_npts", "u_s0", "u_pts"]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    this.a = {
      u: gl.getAttribLocation(prog, "a_u"),
      side: gl.getAttribLocation(prog, "a_side"),
      k: gl.getAttribLocation(prog, "a_k"),
      i: gl.getAttribLocation(prog, "a_i"),
      f: gl.getAttribLocation(prog, "a_f"),
    };
    // two detail levels: phone, desktop — the strip along the path, and every ribbon's line sets
    [true, false].forEach((phone, level) => {
      const segs = phone ? 120 : 180;
      const data = new Float32Array((segs + 1) * 4);
      for (let j = 0; j <= segs; j++) data.set([j / segs, -1, j / segs, 1], j * 4);
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      this.strips[level] = { buf, count: (segs + 1) * 2 };
      this.batches[level] = RIBBONS.flatMap((ribbon) => {
        const sets = lineSets(ribbon, phone);
        return (["halo", "line", "core"] as const).flatMap((kind) => {
          const v = sets[kind];
          if (!v.length) return [];
          const b = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
          return [{ buf: b, count: v.length / 3, ribbon, kind, values: v }];
        });
      });
    });
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
  }

  /** CSS size of the canvas, device pixel ratio (capped at 2 by the caller), phone layout or not */
  size(w: number, h: number, dpr: number, phone: boolean) {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.phone = phone;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
  }

  /** where the bundle crosses — the product's centre, in canvas CSS pixels */
  focus(x: number, y: number) {
    this.fx = x;
    this.fy = y;
  }

  /** how far the page has scrolled past the hero's top (≤ 0 = hero not reached yet); its speed gives the "beat" */
  scroll(y: number) {
    const now = performance.now();
    const dt = Math.max(16, now - this.lastScrollT);
    this.scrollV = this.scrollV * 0.6 + Math.abs((y - this.scrollY) / dt) * 1000 * 0.4;
    this.scrollY = y;
    this.lastScrollT = now;
  }

  /** Flow layer style (src/data/home-hero.ts): both false = the ribbon fully drawn, glow by time only. */
  style(drawOnScroll: boolean, glowOnScroll: boolean) {
    this.drawOnScroll = drawOnScroll;
    this.glowOnScroll = glowOnScroll;
  }

  /** Flow layer: the text blocks without a box (x, y, w, h per block, CSS px from the top of the flow
   *  area) and that area's height — the canvas is a sticky stage, so its top moves through the area. */
  holes(rects: number[], areaH: number, route: number[] = []) {
    this.holeRects = rects;
    this.areaH = areaH;
    this.route = route;
  }

  /** The hero changed product — the ribbons speed up and brighten for ~1.6 s. */
  surge() {
    this.surgeLeft = 1;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = frameLater(this.frame);
  }

  stop() {
    this.running = false;
    cancelFrame(this.raf);
  }

  /** One still frame (reduced motion, Save-Data). */
  still() {
    this.stop();
    this.draw(16);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(64, now - this.last);
    this.last = now;
    this.draw(dt);
    this.raf = frameLater(this.frame);
  };

  private draw(dt: number) {
    const { gl, u, a, w, h, phone, dpr, inst } = this;
    if (!w || !h || gl.isContextLost()) return;
    const heroP = Math.min(1, Math.max(0, this.scrollY / h)); // share of the hero scrolled away
    this.surgeLeft = Math.max(0, this.surgeLeft - dt / 1600);
    const surge = Math.sin((Math.min(1, this.surgeLeft) * Math.PI) / 2);
    this.scrollV *= Math.pow(0.9, dt / 16);
    // the flow layer keeps its own slow pace: scrolling moves it with the page, never faster
    const speed = this.mode === "flow" ? 1 : 1 + Math.min(this.scrollV / 900, 1.6) + surge * 3.2;
    this.t += (dt / 1000) * speed;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);

    const level = phone ? 0 : 1;
    const strip = this.strips[level];
    gl.bindBuffer(gl.ARRAY_BUFFER, strip.buf);
    gl.enableVertexAttribArray(a.u);
    gl.vertexAttribPointer(a.u, 1, gl.FLOAT, false, 8, 0);
    gl.enableVertexAttribArray(a.side);
    gl.vertexAttribPointer(a.side, 1, gl.FLOAT, false, 8, 4);
    if (inst) {
      inst.vertexAttribDivisorANGLE(a.u, 0);
      inst.vertexAttribDivisorANGLE(a.side, 0);
    }

    let strength: number;
    gl.uniform2f(u.u_res, w, h);
    gl.uniform1f(u.u_T, this.t);
    if (this.mode === "flow") {
      strength = phone ? 0.55 : 0.6;
      gl.uniform1f(u.u_flow, 1);
      gl.uniform1f(u.u_flowF, 1);
      gl.uniform1f(u.u_span, phone ? 520 : Math.min(w * 0.7, 940));
      gl.uniform1f(u.u_fade, 0);
      gl.uniform3f(u.u_pulse, 1, this.t, 0);
      // the stage is sticky: its top sits at scroll 0 … areaH - h of the flow area
      const top = Math.min(Math.max(this.scrollY, 0), Math.max(0, this.areaH - h));
      let n = 0;
      for (let i = 0; i + 3 < this.holeRects.length && n < 16; i += 4) {
        const y = this.holeRects[i + 1] - top;
        if (y + this.holeRects[i + 3] < -60 || y > h + 60) continue;
        this.holeBuf.set([this.holeRects[i], y, this.holeRects[i + 2], this.holeRects[i + 3]], n * 4);
        n++;
      }
      gl.uniform4fv(u.u_holes, this.holeBuf);
      gl.uniform1f(u.u_nholes, n);
      gl.uniform1f(u.u_canvasH, this.canvas.height);
      gl.uniform1f(u.u_dpr, dpr);
      // the part of the route on and around the screen: from the last point above it to the first below it
      const pts = this.route.length / 2;
      let i0 = 0;
      let i1 = pts - 1;
      for (let i = 0; i < pts; i++) if (this.route[i * 2 + 1] < top - h * 0.4) i0 = i;
      for (let i = pts - 1; i >= 0; i--) if (this.route[i * 2 + 1] > top + h * 1.4) i1 = i;
      i0 = Math.max(0, i0 - 1);
      i1 = Math.min(pts - 1, i1 + 1, i0 + 23);
      const np = i1 - i0 + 1;
      if (np < 2) return;
      for (let i = 0; i < np; i++) this.ptBuf.set([this.route[(i0 + i) * 2], this.route[(i0 + i) * 2 + 1] - top], i * 2);
      gl.uniform2fv(u.u_pts, this.ptBuf);
      gl.uniform1f(u.u_npts, np);
      gl.uniform1f(u.u_s0, i0);
      // the scroll head: the route position at 82 % down the screen, eased so the line flows instead
      // of jumping with each scroll event; the glow follows the scroll speed and fades when it stops
      const ty = this.scrollY + h * 0.82;
      let target = 0;
      for (let i = 0; i + 1 < pts; i++) {
        const y0 = this.route[i * 2 + 1];
        const y1 = this.route[i * 2 + 3];
        if (ty >= y1) target = i + 1;
        else if (ty > y0) {
          target = i + (ty - y0) / Math.max(1, y1 - y0);
          break;
        } else break;
      }
      this.head += (target - this.head) * Math.min(1, dt / 140);
      this.glow = Math.max(this.glow * Math.pow(0.93, dt / 16), Math.min(1, this.scrollV / 700));
      gl.uniform3f(u.u_head, this.head, this.drawOnScroll ? 1 : 0, this.glowOnScroll ? this.glow : 0);
    } else {
      strength = (1 - heroP * 0.65) * (1 + surge * 0.55);
      gl.uniform2f(u.u_focus, this.fx, this.fy - heroP * h * 0.15);
      gl.uniform1f(u.u_ang, phone ? -0.52 : -0.26);
      gl.uniform1f(u.u_len, Math.hypot(w, h) * 1.25);
      gl.uniform1f(u.u_span, phone ? Math.max(h * 0.62, 420) : h);
      gl.uniform1f(u.u_fade, phone ? 0.18 : 0.36);
      gl.uniform1f(u.u_off, 0);
      gl.uniform3f(u.u_pulse, 0, 0, 0);
      gl.uniform1f(u.u_nholes, 0);
      gl.uniform1f(u.u_flow, 0);
      gl.uniform1f(u.u_flowF, 0);
      gl.uniform3f(u.u_head, 0, 0, 0);
      gl.uniform1f(u.u_npts, 2);
      gl.uniform1f(u.u_s0, 0);
    }

    // a crisp line: its CSS width plus ~0.75 device px of feather each side
    const crisp = (cssWidth: number) => {
      const feather = 0.75 / dpr;
      const half = cssWidth / 2 + feather;
      gl.uniform1f(u.u_halfw, half);
      gl.uniform1f(u.u_feather, feather / half);
    };

    let current: Ribbon | null = null;
    // batches are in ribbon order, halo → line → core: halo first (soft, wide), crisp lines on top
    for (const b of this.batches[level]) {
      const r = b.ribbon;
      if (r !== current) {
        current = r;
        gl.uniform4f(u.u_r1, r.amp, r.f1, r.f2, r.s1);
        gl.uniform4f(u.u_r2, r.s2, r.p1, r.p2, r.w);
        gl.uniform3f(u.u_r3, r.tw, r.ts, r.yc);
      }
      gl.uniform1f(u.u_halo, b.kind === "halo" ? 1 : 0);
      gl.uniform1f(u.u_core, b.kind === "core" ? 1 : 0);
      if (b.kind === "halo") gl.uniform1f(u.u_halfw, this.mode === "flow" ? HALO.halfWidth * 1.6 : HALO.halfWidth);
      else crisp(b.kind === "core" ? 1.6 : phone ? 0.9 : 1);
      gl.uniform1f(u.u_alpha, b.kind === "core" ? (this.mode === "flow" ? 0.2 : 0.45) * strength : r.a * strength * (b.kind === "halo" ? HALO.alpha : 1));
      if (inst) {
        gl.bindBuffer(gl.ARRAY_BUFFER, b.buf);
        for (const [loc, off] of [[a.k, 0], [a.i, 4], [a.f, 8]] as const) {
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, 12, off);
          inst.vertexAttribDivisorANGLE(loc, 1);
        }
        inst.drawArraysInstancedANGLE(gl.TRIANGLE_STRIP, 0, strip.count, b.count);
      } else {
        // no instancing: the same values as constant attributes, one draw per line
        for (const loc of [a.k, a.i, a.f]) gl.disableVertexAttribArray(loc);
        for (let j = 0; j < b.count; j++) {
          gl.vertexAttrib1f(a.k, b.values[j * 3]);
          gl.vertexAttrib1f(a.i, b.values[j * 3 + 1]);
          gl.vertexAttrib1f(a.f, b.values[j * 3 + 2]);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, strip.count);
        }
      }
    }
  }
}

/** Messages the page sends to hero-ribbons.worker.ts — one per RibbonEngine method. */
export type RibbonMessage =
  | { type: "init"; canvas: OffscreenCanvas; mode?: RibbonMode }
  | { type: "size"; w: number; h: number; dpr: number; phone: boolean }
  | { type: "focus"; x: number; y: number }
  | { type: "scroll"; y: number }
  | { type: "surge" }
  | { type: "style"; draw: boolean; glow: boolean }
  | { type: "holes"; rects: number[]; areaH: number; route: number[] }
  | { type: "run"; on: boolean; still: boolean };

/** What the page holds: the same calls whether the engine runs in a worker or right here. */
export type RibbonDriver = {
  size(w: number, h: number, dpr: number, phone: boolean): void;
  focus(x: number, y: number): void;
  scroll(y: number): void;
  surge(): void;
  style(draw: boolean, glow: boolean): void;
  holes(rects: number[], areaH: number, route: number[]): void;
  run(on: boolean, still: boolean): void;
  destroy(): void;
};

/** Applies one message to an engine — shared by the worker and the main-thread fallback. */
export function applyRibbonMessage(engine: RibbonEngine, m: Exclude<RibbonMessage, { type: "init" }>) {
  switch (m.type) {
    case "size":
      engine.size(m.w, m.h, m.dpr, m.phone);
      break;
    case "focus":
      engine.focus(m.x, m.y);
      break;
    case "scroll":
      engine.scroll(m.y);
      break;
    case "surge":
      engine.surge();
      break;
    case "style":
      engine.style(m.draw, m.glow);
      break;
    case "holes":
      engine.holes(m.rects, m.areaH, m.route);
      break;
    case "run":
      if (m.still) engine.still();
      else if (m.on) engine.start();
      else engine.stop();
      break;
  }
}

/** Main-thread engine behind the same driver shape (no OffscreenCanvas / no worker). */
export function mainThreadDriver(canvas: HTMLCanvasElement, mode: RibbonMode = "hero"): RibbonDriver | null {
  const engine = RibbonEngine.create(canvas, mode);
  if (!engine) return null;
  return {
    size: (w, h, dpr, phone) => applyRibbonMessage(engine, { type: "size", w, h, dpr, phone }),
    focus: (x, y) => applyRibbonMessage(engine, { type: "focus", x, y }),
    scroll: (y) => applyRibbonMessage(engine, { type: "scroll", y }),
    surge: () => applyRibbonMessage(engine, { type: "surge" }),
    style: (draw, glow) => applyRibbonMessage(engine, { type: "style", draw, glow }),
    holes: (rects, areaH, route) => applyRibbonMessage(engine, { type: "holes", rects, areaH, route }),
    run: (on, still) => applyRibbonMessage(engine, { type: "run", on, still }),
    destroy: () => engine.stop(),
  };
}
