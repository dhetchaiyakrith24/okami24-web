/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Thai-leak gate for the en/zh locales (round "leftovers", 2026-09-22).
//
// The mirror image of scripts/scan.js. scan.js fetches the SERVER HTML and flags English
// sentences on the Thai page — it can only ever see the Thai locale, because locale on this site
// is a cookie read client-side by LocaleProvider (see src/components/i18n/LocaleProvider.tsx):
// the server always renders Thai, so no HTTP-based gate can see what an English visitor sees.
// That is exactly why "สอบถามสินค้า" sat on the English page for months without any gate
// noticing (found by the owner switching language by hand, 2026-09-22).
//
// So this gate reads the SOURCE instead. It flags Thai script in the three places a component can
// put text on the screen without ever consulting the dictionary:
//
//   1. JSX text children            <span>สอบถามสินค้า</span>
//   2. user-visible JSX attributes  aria-label="ติดต่อ OKami24 ทาง LINE"
//   3. module constants             const ARIA_LABEL = "ติดต่อสอบถามสินค้าทาง LINE"
//
// (3) is there because the LINE button hid its Thai aria-label exactly that way: the attribute
// read `aria-label={ARIA_LABEL}` — an expression, invisible to (2) — while the string sat three
// lines above it.
//
// Both render identically under every locale, so a hit here is text an en/zh visitor sees in
// Thai. Text that comes from the dictionary ({dict.x.y}) is an expression, not a literal, and is
// never flagged. Comments are stripped first. Head copy (export const metadata / generateMetadata)
// is NOT a JSX child or attribute and so never reaches this scanner — <title>/meta stay Thai for
// crawlers by design (THAI_STYLE §2), which is a different question from what a visitor sees.
//
//   node scripts/thai-leak-scan.js [--verbose] [--json]
//
// Pass = 0 unexplained hits (prints "0 leak(s) / <n> file(s)"). Exit code 1 when anything is
// flagged, so the checker can use it as a gate. Read-only, no build and no browser needed.
//
// Every allowed hit needs a reason in ALLOW below. "It has always been like that" is not one —
// the point of the list is that each exception names the ruling that keeps it there.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SCAN_DIRS = [path.join("src", "components"), path.join("src", "app")];
// Thai letters, vowels and tone marks \u2014 deliberately NOT the whole U+0E00 block, because the baht
// sign (U+0E3F) lives in it and is shown to every locale on purpose (every price on the site).
const THAI = /[\u0E01-\u0E3A\u0E40-\u0E5B]/;

// Attributes whose value a person reads or hears (screen readers included). `alt` and
// `aria-label` are the ones that hide easily — nothing on screen shows them being wrong.
const VISIBLE_ATTRS = ["aria-label", "aria-description", "aria-placeholder", "alt", "title", "placeholder", "label", "eyebrow", "description", "heading", "caption"];

/**
 * Files whose Thai literals are ruled, not bugs. Each entry says WHY, and `until` says what would
 * remove it from this list — an exception with no way out is how a gate rots.
 */
const ALLOW = [
  {
    file: path.join("src", "components", "layout", "AgeGate.tsx"),
    why: "Age/nicotine legal notice — THAI_STYLE §5 group ก, untouchable since round 30.1; translating it is new customer-facing legal copy, which is the owner's call (CLAUDE.md 13.4 #6).",
    until: "the owner approves an en/zh wording for the age gate.",
  },
  {
    file: path.join("src", "app", "about", "page.tsx"),
    why: "The /about body is hardcoded Thai prose (a Server Component). It is a real leak, not a ruled exception — but every sentence is customer-facing copy that has no en/zh version anywhere, so writing one is the owner's call (CLAUDE.md 13.4 #6). Raised in round 'leftovers', 2026-09-22.",
    until: "the owner rules on an en/zh /about (then this row goes away and the page moves into the dictionaries).",
  },
  {
    dir: path.join("src", "app", "preview"),
    why: "DEV-only ProductMaster preview: robots index:false and a production notFound() gate (see preview-guard.ts). No customer ever reaches it, in any locale.",
    until: "the preview pool is ever shown to a customer.",
  },
];

function allowFor(rel) {
  return ALLOW.find((a) => (a.file && rel === a.file) || (a.dir && rel.startsWith(a.dir + path.sep)));
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Blank out comments and quoted strings that are NOT JSX attribute values, keeping the file's
 * exact length so every index still maps back to the original line number. Working on a
 * same-length mask is what lets the reporting stay honest about where a hit is.
 */
function maskComments(src) {
  const out = src.split("");
  let i = 0;
  const blank = (from, to) => {
    for (let k = from; k < to && k < out.length; k++) if (out[k] !== "\n") out[k] = " ";
  };
  while (i < src.length) {
    if (src[i] === "/" && src[i + 1] === "/") {
      const end = src.indexOf("\n", i);
      blank(i, end === -1 ? src.length : end);
      i = end === -1 ? src.length : end;
    } else if (src[i] === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      blank(i, end === -1 ? src.length : end + 2);
      i = end === -1 ? src.length : end + 2;
    } else if (src[i] === "{" && src[i + 1] === "/" && src[i + 2] === "*") {
      // JSX comment {/* ... */}
      const end = src.indexOf("*/}", i + 3);
      blank(i, end === -1 ? src.length : end + 3);
      i = end === -1 ? src.length : end + 3;
    } else {
      i++;
    }
  }
  return out.join("");
}

function lineOf(src, index) {
  let line = 1;
  for (let i = 0; i < index && i < src.length; i++) if (src[i] === "\n") line++;
  return line;
}

function snippet(text) {
  const one = text.replace(/\s+/g, " ").trim();
  return one.length > 70 ? one.slice(0, 70) + "…" : one;
}

/** Thai inside a user-visible JSX attribute: aria-label="ติดต่อ …" (single or double quoted). */
function attributeHits(masked, src) {
  const hits = [];
  const attr = new RegExp("(" + VISIBLE_ATTRS.join("|") + ")\\s*=\\s*(\"[^\"]*\"|'[^']*')", "g");
  let m;
  while ((m = attr.exec(masked)) !== null) {
    const value = m[2].slice(1, -1);
    if (THAI.test(value)) hits.push({ kind: `attr ${m[1]}`, line: lineOf(src, m.index), text: snippet(value) });
  }
  return hits;
}

/**
 * Thai in a JSX text child: the run between a `>` that closes a tag and the next `<`. Anything
 * inside {...} is an expression (dictionary lookup, variable) and is blanked out first, so only
 * literal text typed straight into the markup survives.
 */
function childHits(masked, src) {
  const hits = [];
  // Blank innermost {...} only — ONE pass. Repeating it would eat whole function bodies (a
  // component is itself `function X() { … }`), taking the JSX with them and turning the gate
  // silently green. A nested expression that survives half-blanked is handled below instead.
  const withoutExpressions = masked.replace(/\{[^{}]*\}/g, (s) => " ".repeat(s.length));
  const child = />([^<>]*)</g;
  let m;
  while ((m = child.exec(withoutExpressions)) !== null) {
    const text = m[1];
    if (!THAI.test(text)) continue;
    const at = m.index + 1 + text.search(THAI);
    hits.push({ kind: "jsx text", line: lineOf(src, at), text: snippet(text) });
  }
  return hits;
}

/**
 * Thai in a plain `const LABEL = "…"` inside a component file. This is the shape that hid the
 * LINE button's aria-label: the attribute read `aria-label={ARIA_LABEL}`, an expression, so the
 * two detectors above saw nothing while the string itself sat three lines up. A component file
 * has no business holding a Thai string literal at all — copy belongs in src/i18n.
 */
function constantHits(masked, src) {
  const hits = [];
  const decl = /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=\s*("[^"]*"|'[^']*'|`[^`]*`)/g;
  let m;
  while ((m = decl.exec(masked)) !== null) {
    const value = m[1].slice(1, -1);
    if (THAI.test(value)) hits.push({ kind: "const string", line: lineOf(src, m.index), text: snippet(value) });
  }
  return hits;
}

const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const flagged = [];
const allowed = [];

for (const full of files) {
  const rel = path.relative(ROOT, full);
  const src = fs.readFileSync(full, "utf8");
  if (!THAI.test(src)) continue;
  const masked = maskComments(src);
  const hits = [...attributeHits(masked, src), ...childHits(masked, src), ...constantHits(masked, src)].sort((a, b) => a.line - b.line);
  if (hits.length === 0) continue;
  const allow = allowFor(rel);
  (allow ? allowed : flagged).push({ rel, hits, allow });
}

const VERBOSE = process.argv.includes("--verbose");
const AS_JSON = process.argv.includes("--json");

if (AS_JSON) {
  console.log(JSON.stringify({ flagged, allowed, filesScanned: files.length }, null, 2));
} else {
  for (const f of flagged) {
    for (const h of f.hits) console.log(`LEAK  ${f.rel}:${h.line}  [${h.kind}]  ${h.text}`);
  }
  if (VERBOSE) {
    for (const f of allowed) {
      console.log(`allow ${f.rel}  (${f.hits.length} hit(s)) — ${f.allow.why}`);
      console.log(`      until: ${f.allow.until}`);
      for (const h of f.hits) console.log(`      ${f.rel}:${h.line}  [${h.kind}]  ${h.text}`);
    }
  }
  const total = flagged.reduce((n, f) => n + f.hits.length, 0);
  const allowedTotal = allowed.reduce((n, f) => n + f.hits.length, 0);
  console.log(`${total} leak(s) / ${files.length} file(s) scanned · ${allowedTotal} allowed hit(s) in ${allowed.length} ruled file(s)${VERBOSE ? "" : " (--verbose to list them)"}`);
}

process.exit(flagged.length === 0 ? 0 : 1);
