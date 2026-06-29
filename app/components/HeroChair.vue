<script setup lang="ts">
/**
 * Static, fully-open folding chair — dark form with thin gold edge highlights,
 * 3/4 view. Used now as the hero placeholder; in step 4 this same component is
 * the reduced-motion / mobile fallback while the TresJS canvas handles the
 * scroll-scrubbed unfold. Purely decorative (the hero headline carries meaning).
 */
withDefaults(defineProps<{ title?: string }>(), { title: "" });
</script>

<template>
  <svg
    viewBox="0 0 480 560"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="h-full w-full"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
  >
    <title v-if="title">{{ title }}</title>
    <defs>
      <linearGradient id="hc-wood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#5a4e3c" />
        <stop offset="0.52" stop-color="#352d22" />
        <stop offset="1" stop-color="#1b160f" />
      </linearGradient>
      <linearGradient id="hc-wood-dim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#42382a" />
        <stop offset="1" stop-color="#15110b" />
      </linearGradient>
      <linearGradient id="hc-seat" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="#4c4133" />
        <stop offset="1" stop-color="#2e271e" />
      </linearGradient>
      <linearGradient id="hc-back" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stop-color="#483d2e" />
        <stop offset="1" stop-color="#2c251d" />
      </linearGradient>
      <filter id="hc-shadow" x="-40%" y="-60%" width="180%" height="220%">
        <feGaussianBlur stdDeviation="11" />
      </filter>
    </defs>

    <!-- contact shadow on the floor plane -->
    <ellipse cx="236" cy="486" rx="150" ry="20" fill="#000" opacity="0.5" filter="url(#hc-shadow)" />

    <!-- ===== FAR side (behind, dimmer, no gold) ===== -->
    <path d="M322 474 L278 108" stroke="url(#hc-wood-dim)" stroke-width="12" stroke-linecap="round" />
    <path d="M184 474 L292 304" stroke="url(#hc-wood-dim)" stroke-width="12" stroke-linecap="round" />

    <!-- ===== Backrest panel ===== -->
    <path d="M240 150 L286 134 L296 198 L250 214 Z" fill="url(#hc-back)" />
    <path d="M240 150 L286 134" stroke="#e0c180" stroke-width="2.4" stroke-linecap="round" opacity="0.85" />
    <!-- top rail -->
    <path d="M236 150 L290 130" stroke="url(#hc-wood)" stroke-width="9" stroke-linecap="round" />
    <path d="M236 149 L290 129" stroke="#e8c98a" stroke-width="1.6" stroke-linecap="round" opacity="0.6" />

    <!-- ===== Seat ===== -->
    <path d="M168 304 L264 286 L302 300 L206 320 Z" fill="url(#hc-seat)" />
    <path d="M168 304 L264 286" stroke="#e4c586" stroke-width="2.2" stroke-linecap="round" opacity="0.8" />
    <!-- seat front lip (thickness) -->
    <path d="M168 304 L206 320 L206 328 L168 312 Z" fill="#211b12" />

    <!-- ===== NEAR side (gold edge highlights) ===== -->
    <!-- rear post (rear leg continued up into the backrest upright) -->
    <path d="M292 472 L246 96" stroke="url(#hc-wood)" stroke-width="14" stroke-linecap="round" />
    <path d="M286 470 L241 98" stroke="#d8b878" stroke-width="2.6" stroke-linecap="round" opacity="0.8" />
    <!-- front leg -->
    <path d="M150 474 L264 302" stroke="url(#hc-wood)" stroke-width="14" stroke-linecap="round" />
    <path d="M145 471 L259 301" stroke="#d8b878" stroke-width="2.6" stroke-linecap="round" opacity="0.78" />

    <!-- low front stretcher bar -->
    <path d="M170 450 L288 444" stroke="url(#hc-wood-dim)" stroke-width="8" stroke-linecap="round" />
    <path d="M170 448 L288 442" stroke="#caa873" stroke-width="1.4" stroke-linecap="round" opacity="0.5" />
  </svg>
</template>
