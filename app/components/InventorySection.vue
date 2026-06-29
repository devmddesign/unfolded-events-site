<template>
  <section
    id="inventory"
    class="scroll-anchor bg-ivory py-20 lg:py-28"
    aria-labelledby="inventory-heading"
  >
    <div class="shell">
      <FoldEyebrow
        number="01"
        label="The Collection"
        class="mb-9"
      />

      <div class="mb-11 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <h2
          id="inventory-heading"
          class="max-w-xl font-display text-4xl leading-[1.02] lg:text-5xl"
        >
          A considered inventory.
        </h2>
        <div class="max-w-sm">
          <p class="text-[15px] leading-relaxed text-muted">
            Pieces chosen for their lines, finish, and the way a room feels once
            they're in it — photographed, with real dimensions and capacities.
          </p>
          <a
            href="#quote"
            class="mt-3.5 inline-block border-b border-gold-mid pb-0.5 text-sm font-semibold text-gold-ink"
          >
            Request availability →
          </a>
        </div>
      </div>

      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(item, i) in catalog"
          :key="item.name"
          v-reveal="i * 70"
          class="card card--interactive reveal"
        >
          <article>
            <div class="relative aspect-[4/3]">
              <PlaceholderImage
                :alt="item.alt"
                :width="800"
                :height="600"
                :label="item.img"
                class="h-full w-full object-cover"
              />
              <span class="chip--tag absolute left-3.5 top-3.5">
                {{ item.cat }}
              </span>
            </div>
            <div class="px-5 pb-6 pt-5">
              <h3 class="font-display text-[22px] leading-tight text-ink">
                {{ item.name }}
              </h3>
              <div class="mt-3 flex items-center justify-between border-t border-divider pt-3">
                <span class="text-[13px] text-muted">
                  {{ item.dim }}
                </span>
                <span class="text-xs font-semibold text-gold-ink">
                  {{ item.cap }}
                </span>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
// The six catalogue pieces from the design. `alt` describes the eventual photo.
const catalog = [{
  cat: 'Tables',
  name: 'Beaumont Round',
  dim: '72″ diameter',
  cap: 'Seats 10–12',
  img: 'round banquet table',
  alt: 'Beaumont Round — a 72-inch round banquet table dressed in ivory linen, seating ten to twelve guests.'
}, {
  cat: 'Tables',
  name: 'Linden Banquet',
  dim: '96″ × 30″',
  cap: 'Seats 8–10',
  img: 'rectangular banquet table',
  alt: 'Linden Banquet — a 96 by 30 inch rectangular banquet table, seating eight to ten guests.'
}, {
  cat: 'Tables',
  name: 'Highboy Cocktail',
  dim: '30″ Ø · 42″ tall',
  cap: 'Stand 4–6',
  img: 'cocktail highboy table',
  alt: 'Highboy Cocktail — a 30-inch round, 42-inch tall standing cocktail table for four to six guests.'
}, {
  cat: 'Seating',
  name: 'Chiavari Chair',
  dim: '16″ seat · 36″ tall',
  cap: 'Gold / clear',
  img: 'chiavari chair',
  alt: 'Chiavari Chair — a classic ballroom chair with a 16-inch seat and 36-inch height, in gold or clear.'
}, {
  cat: 'Seating',
  name: 'Florence Cross-Back',
  dim: 'Solid beech · 35″',
  cap: 'Natural / black',
  img: 'cross-back chair',
  alt: 'Florence Cross-Back — a solid beech cross-back chair standing 35 inches tall, in natural or black.'
}, {
  cat: 'Seating',
  name: 'Lucent Ghost Chair',
  dim: 'Polycarbonate · 33″',
  cap: 'Clear / smoke',
  img: 'acrylic ghost chair',
  alt: 'Lucent Ghost Chair — a transparent polycarbonate chair standing 33 inches tall, in clear or smoke.'
}];
</script>
