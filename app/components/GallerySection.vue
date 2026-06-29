<template>
  <section
    id="gallery"
    class="scroll-anchor bg-charcoal py-20 text-ivory lg:py-28"
    aria-labelledby="gallery-heading"
  >
    <div class="shell">
      <FoldEyebrow
        number="03"
        label="Selected Work"
        tone="dark"
        class="mb-9"
      />

      <div class="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <h2
          id="gallery-heading"
          class="font-display text-4xl leading-[1.02] text-ivory lg:text-5xl"
        >
          Rooms we've set.
        </h2>
        <div class="max-w-xs">
          <p class="text-[15px] leading-relaxed text-mist">
            Corporate stages, private celebrations, and everything in between —
            across the DMV.
          </p>
          <a
            href="#quote"
            class="mt-3.5 inline-block border-b border-[#6e5a33] pb-0.5 text-sm font-semibold text-gold-light"
          >
            View the full gallery →
          </a>
        </div>
      </div>

      <ul class="grid auto-rows-[120px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-4 sm:gap-4">
        <li
          v-for="(tile, i) in tiles"
          :key="tile.caption"
          v-reveal="i * 60"
          class="reveal group relative overflow-hidden rounded-card border border-line-dark"
          :class="tile.span"
        >
          <PlaceholderImage
            :alt="tile.alt"
            :width="tile.w"
            :height="tile.h"
            tone="dark"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3.5 pt-10 font-mono text-[11px] text-stone">
            {{ tile.caption }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const tiles = [{
  caption: 'corporate gala · 240 guests',
  alt: 'A ballroom set for a 240-guest corporate gala with round banquet tables and gold chiavari chairs.',
  span: 'row-span-2 sm:col-span-2 sm:row-span-2',
  w: 800,
  h: 800
}, {
  caption: 'rooftop launch · DC',
  alt: 'A rooftop product launch in Washington DC with cocktail highboys at dusk.',
  span: '',
  w: 600,
  h: 400
}, {
  caption: 'garden dinner · MoCo',
  alt: 'A long garden dinner table in Montgomery County set with cross-back chairs and linen.',
  span: '',
  w: 600,
  h: 400
}, {
  caption: 'gallery dinner · Georgetown',
  alt: 'An intimate gallery dinner in Georgetown with a single long banquet table.',
  span: 'col-span-2',
  w: 800,
  h: 400
}, {
  caption: 'chiavari detail',
  alt: 'Close-up detail of a gold chiavari chair against ivory linen.',
  span: '',
  w: 600,
  h: 400
}, {
  caption: 'tablescape · ivory',
  alt: 'An ivory tablescape with layered linens, glassware, and low florals.',
  span: '',
  w: 600,
  h: 400
}, {
  caption: 'cross-back rows',
  alt: 'Neat rows of natural cross-back chairs arranged for a ceremony.',
  span: '',
  w: 600,
  h: 400
}, {
  caption: 'highboys · cocktail hour',
  alt: 'Cocktail-hour highboy tables with smoke ghost stools during a reception.',
  span: '',
  w: 600,
  h: 400
}];
</script>
