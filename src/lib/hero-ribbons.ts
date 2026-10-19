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
uniform float u_ang, u_len, u_span, u_T, u_halfw, u_alpha;
uniform vec4 u_r1; // amp f1 f2 s1
uniform vec4 u_r2; // s2 p1 p2 w
uniform vec3 u_r3; // tw ts yc
varying float v_u;
varying float v_side;
varying float v_alpha;
const float TAU = 6.2831853;
const float PI = 3.1415927;
vec2 pathAt(float u) {
  float base = u_span * (u_r3.z + u_r1.x * sin(TAU * (u_r1.y * u + u_T * u_r1.w + u_r2.y))
             + u_r1.x * 0.45 * sin(TAU * (u_r1.z * u - u_T * u_r2.x + u_r2.z)));
  float y = base + a_k * u_r2.w * u_span * sin(PI * (u_r3.x * u * 2.0 + u_T * u_r3.y + a_k * 0.12))
          + sin(TAU * (2.6 * u + u_T * 0.18 + a_i * 0.045)) * 1.6;
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
  v_side = a_side;
  v_alpha = u_alpha * a_f;
}`;

const FRAG = `
precision mediump float;
varying float v_u;
varying float v_side;
varying float v_alpha;
uniform float u_fade, u_core, u_halo, u_feather;
vec4 stop2(float u, float a, vec4 ca, float b, vec4 cb) { return mix(ca, cb, clamp((u - a) / (b - a), 0.0, 1.0)); }
vec4 mainGrad(float u) {
  // along the band: faint behind the headline (left), full behind the product, out at the edges
  vec4 c0 = vec4(1.0, 0.416, 0.173, 0.0);
  vec4 c1 = vec4(1.0, 0.416, 0.173, 0.25);
  vec4 c2 = vec4(1.0, 0.471, 0.235, 1.0);
  vec4 c3 = vec4(1.0, 0.627, 0.392, 1.0);
  vec4 c4 = vec4(1.0, 0.416, 0.173, 0.7);
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
  vec4 g = u_core > 0.5 ? coreGrad(v_u) : mainGrad(v_u);
  float d = abs(v_side);
  float edge = u_halo > 0.5 ? exp(-d * d * 3.5) : 1.0 - smoothstep(1.0 - u_feather, 1.0, d);
  float a = g.a * v_alpha * edge;
  gl_FragColor = vec4(g.rgb * a, a);
}`;

export type RibbonFocus = { x: number; y: number };

type Uniforms = Record<string, WebGLUniformLocation | null>;

/** One instanced draw: which lines (k · index · opacity falloff), how wide, which look. */
type Batch = { buf: WebGLBuffer; count: number; ribbon: Ribbon; kind: "halo" | "line" | "core"; values: number[] };

/**
 * The per-line values of every ribbon, as instance data — built once per detail level, so a frame
 * is a handful of uniforms and nine instanced draws instead of one draw per line (measured 20/10:
 * one draw per line, ~450 GL calls a frame, cost ~4.5 s of main-thread time across a Lighthouse
 * mobile run; the frame itself is GPU work).
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

export class HeroRibbons {
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
  private t = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private surgeLeft = 0;
  private scrollV = 0;
  private lastY = 0;
  private lastYT = 0;

  /** Returns null when WebGL is unavailable — the caller simply shows no ribbons. */
  static create(canvas: HTMLCanvasElement, focus: () => RibbonFocus): HeroRibbons | null {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return null;
    try {
      return new HeroRibbons(canvas, gl, focus);
    } catch {
      return null;
    }
  }

  private constructor(
    private canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    /** where the bundle crosses — the product's centre, in canvas CSS pixels */
    private focus: () => RibbonFocus,
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
    for (const name of ["u_res", "u_focus", "u_ang", "u_len", "u_span", "u_T", "u_halfw", "u_alpha", "u_r1", "u_r2", "u_r3", "u_fade", "u_core", "u_halo", "u_feather"]) {
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
    this.canvas.width = Math.max(1, Math.round(r.width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(r.height * this.dpr));
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

  private draw(dt: number) {
    const { gl, u, a, w, h, phone, dpr, inst } = this;
    if (!w || !h || gl.isContextLost()) return;
    const heroP = Math.min(1, Math.max(0, window.scrollY / h));
    this.surgeLeft = Math.max(0, this.surgeLeft - dt / 1600);
    const surge = Math.sin((Math.min(1, this.surgeLeft) * Math.PI) / 2);
    this.scrollV *= Math.pow(0.9, dt / 16);
    const speed = 1 + Math.min(this.scrollV / 900, 1.6) + surge * 3.2;
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

    const f = this.focus();
    const strength = (1 - heroP * 0.65) * (1 + surge * 0.55);
    gl.uniform2f(u.u_res, w, h);
    gl.uniform2f(u.u_focus, f.x, f.y - heroP * h * 0.15);
    gl.uniform1f(u.u_ang, phone ? -0.52 : -0.26);
    gl.uniform1f(u.u_len, Math.hypot(w, h) * 1.25);
    gl.uniform1f(u.u_span, phone ? Math.max(h * 0.62, 420) : h);
    gl.uniform1f(u.u_T, this.t);
    gl.uniform1f(u.u_fade, phone ? 0.18 : 0.36);

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
      if (b.kind === "halo") gl.uniform1f(u.u_halfw, HALO.halfWidth);
      else crisp(b.kind === "core" ? 1.6 : phone ? 0.9 : 1);
      gl.uniform1f(u.u_alpha, b.kind === "core" ? 0.45 * strength : r.a * strength * (b.kind === "halo" ? HALO.alpha : 1));
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
