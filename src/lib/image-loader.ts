/**
 * next/image's URL builder for this site (next.config.ts `images.loaderFile`; speed round, owner 13/11 "เว็บรู้สึกโหลดภาพช้า").
 *
 * Same URL as Next's default loader — `/_next/image?url=<src>&w=<width>&q=75` — with one difference: no `&dpl=<deploy>`.
 * Since `deploymentId` (next.config.ts, version-skew fix 11/11) every picture URL carried the deploy's commit, so each of
 * the 12–19 deploys a day changed every picture's address and the browser and Cloudflare had to fetch all of them again
 * from the 0.5-CPU optimizer (measured live 13/11: a phone scroll of /products 10 minutes after a deploy = 35 pictures,
 * median 5.1 s; the same scroll warm = 0.1 s). Pictures are not code: a picture from the previous deploy is still right.
 *
 * What does change a picture is its file. `&v=` is a short hash of the picture files in the picture's folder, computed at
 * build time (next.config.ts `imageVersions`), so a replaced photo — even under the same name — gets a new address on the
 * deploy that ships it, and every other picture keeps its address and its cached copies. JS and RSC requests still carry
 * the deploy id: version-skew protection is untouched.
 *
 * `q=75` is fixed because `images.qualities` is Next's default `[75]` and the optimizer refuses any other value; an SVG is
 * returned as it is, as the default loader does (it never goes through the optimizer).
 */
const VERSIONS: Record<string, string> = JSON.parse(process.env.OKAMI24_IMAGE_VERSIONS || "{}");

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const path = src.split("?", 1)[0];
  if (path.endsWith(".svg")) return src;
  const v = src.startsWith("/") ? VERSIONS[path.slice(0, path.lastIndexOf("/"))] : undefined;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75${v ? `&v=${v}` : ""}`;
}
