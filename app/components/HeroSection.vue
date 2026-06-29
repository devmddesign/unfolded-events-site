<script setup lang="ts">
import HeroChair from "./HeroChair.vue";

// Hero copy is above the fold → never wrapped in v-reveal so it paints
// immediately for LCP. The static <HeroChair> SVG is the SSR poster and the
// reduced-motion / mobile / no-WebGL fallback. On capable desktops (.hero-anim,
// set pre-paint by the head script) a TresJS canvas lazy-mounts into the SAME
// .hero-stage box; the chair free-floats and spins on its own loop (no scroll
// coupling, normal height).

const animated = ref(false); // mirrors documentElement.hero-anim
const inView = ref(false); // hero currently intersecting → drives the render loop
const everInView = ref(false); // latched on first intersection → mounts the canvas once

const heroEl = ref<HTMLElement | null>(null);

// The canvas (HeroCanvasScene.client.vue) is a Nuxt client-only component, so
// three + the GLTF loader are excluded from the SSR bundle entirely AND
// lazy-loaded only when this turns true. Once mounted it STAYS mounted; the
// render loop is paused/resumed via `active = inView` (no re-init thrash). The
// strip-js-prefetch Nitro plugin removes the eager prefetch so mobile /
// reduced-motion / no-WebGL visitors never download three or the model.
const mountCanvas = computed(() => animated.value && everInView.value);

let io: IntersectionObserver | null = null;

onMounted(() => {
  animated.value = document.documentElement.classList.contains("hero-anim");
  if (!animated.value) return; // fallback: static poster only — no canvas, no loop

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        inView.value = e.isIntersecting;
        if (e.isIntersecting) everInView.value = true;
      }
    },
    { rootMargin: "200px 0px" },
  );
  io.observe(heroEl.value!);
});

onBeforeUnmount(() => {
  io?.disconnect();
  io = null;
});
</script>

<template>
  <section
    id="hero"
    ref="heroEl"
    class="scroll-anchor relative bg-obsidian text-ivory"
    aria-labelledby="hero-heading"
  >
    <div
      class="shell relative flex flex-col gap-10 pb-20 pt-12 lg:min-h-[620px] lg:flex-row lg:items-center lg:gap-8 lg:pb-24 lg:pt-20"
    >
      <!-- Text -->
      <div class="relative z-10 max-w-xl lg:w-[54%]">
        <p class="eyebrow text-gold-light">Table &amp; Seating Rentals · The DMV</p>
        <h1
          id="hero-heading"
          class="mt-5 font-display text-[2.75rem] leading-[1.02] text-ivory sm:text-6xl lg:text-[68px] lg:leading-[1.0]"
        >
          Every event,<br />
          <em class="italic text-gold-light">unfolded</em> with care.
        </h1>
        <p class="mt-6 max-w-md text-lg leading-relaxed text-cream">
          Premium tables and seating for corporate gatherings and private
          celebrations — delivered, styled, and set across DC, Maryland &amp;
          Virginia.
        </p>
        <div class="mt-9 flex flex-wrap gap-3.5">
          <a href="#quote" class="btn btn--gold">Request a quote</a>
          <a href="#inventory" class="btn btn--ghost-light">Explore the collection</a>
        </div>
        <p
          class="mt-8 inline-flex items-center gap-2 rounded-full border border-gold-light/35 bg-obsidian/60 px-3.5 py-1.5 text-[11px] font-medium text-gold-light"
        >
          <span aria-hidden="true">▸</span> Crafted seating, across the DMV
        </p>
      </div>

      <!-- Chair stage: poster SVG + (desktop) lazy TresJS canvas, same box -->
      <div class="lg:w-[46%]">
        <div
          class="hero-stage relative mx-auto aspect-[4/5] w-full max-w-[380px] lg:mx-0 lg:aspect-auto lg:h-[520px] lg:w-full lg:max-w-none"
        >
          <HeroChair class="hero-poster absolute inset-0 h-full w-full" />
          <LazyHeroCanvasScene v-if="mountCanvas" :active="inView" />
        </div>
      </div>
    </div>
  </section>
</template>
