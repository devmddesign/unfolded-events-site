<script setup lang="ts">
/**
 * Accessible placeholder image. Renders a real <img> whose source is a tiny
 * inline SVG (the comp's diagonal-hatch look), so it has:
 *   - descriptive alt text (carries meaning of the eventual photo),
 *   - intrinsic width/height → no layout shift (CLS),
 *   - loading="lazy" + decoding="async" by default (eager opt-in above the fold).
 * Swap the computed `src` for a real <NuxtImg>/photo URL at launch with no
 * markup changes elsewhere.
 */
const props = withDefaults(
  defineProps<{
    alt: string;
    width?: number;
    height?: number;
    label?: string;
    tone?: "light" | "dark";
    eager?: boolean;
  }>(),
  { width: 800, height: 600, tone: "light", eager: false },
);

const palette = computed(() =>
  props.tone === "dark"
    ? { a: "#23201b", b: "#282520", text: "#8e867a" }
    : { a: "#ece7dc", b: "#f1ece2", text: "#a89f8c" },
);

const src = computed(() => {
  const { width: w, height: h, label } = props;
  const { a, b, text } = palette.value;
  const caption = label
    ? `<text x="50%" y="50%" fill="${text}" font-family="ui-monospace,monospace" font-size="13" text-anchor="middle" dominant-baseline="middle">${label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><pattern id="h" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(135)"><rect width="22" height="22" fill="${a}"/><rect width="11" height="22" fill="${b}"/></pattern></defs><rect width="100%" height="100%" fill="url(#h)"/>${caption}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
});
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : 'auto'"
    decoding="async"
    class="block bg-sand"
  />
</template>
