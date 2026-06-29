/**
 * Remove `<link rel="prefetch" as="script">` hints from rendered HTML.
 *
 * The hero's TresJS/three.js chunks are split out and loaded via a guarded
 * dynamic import that fires ONLY for capable desktops once the hero is in view.
 * Nuxt would otherwise eagerly prefetch those chunks for every visitor —
 * including mobile / reduced-motion / no-WebGL users who never use them — so we
 * drop the JS prefetch hints and let the on-demand import do the fetching.
 *
 * IMPORTANT: Nuxt delivers the head as concatenated string chunk(s), so we must
 * remove only the matching <link> SUBSTRINGS — never filter out whole chunks
 * (doing so deletes the entire <head>).
 */
const PREFETCH_LINK = /<link\b[^>]*>/g;

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("render:html", (html) => {
    html.head = html.head.map((chunk) =>
      chunk.replace(PREFETCH_LINK, (tag) =>
        tag.includes('rel="prefetch"') && tag.includes('as="script"') ? "" : tag,
      ),
    );
  });
});
