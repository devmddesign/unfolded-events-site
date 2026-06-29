<script setup lang="ts">
// Standalone (no site chrome) confirmation page — the no-JS form-POST landing
// and a safe success fallback. Prerendered (routeRules in nuxt.config).
definePageMeta({ layout: false });
useSeoMeta({ title: "Thank you", robots: "noindex, follow" });
</script>

<template>
  <main
    class="flex min-h-dvh flex-col items-center justify-center bg-obsidian px-6 py-20 text-center text-ivory"
  >
    <a href="/" class="mb-10 flex items-end gap-2" aria-label="Unfolded Events — home">
      <span class="font-display text-2xl font-medium text-ivory">Unfolded<span class="text-gold">.</span></span>
      <span class="pb-1.5 text-[10px] tracking-[0.34em] text-stone">EVENTS</span>
    </a>

    <span
      class="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" class="h-7 w-7 text-gold-light" fill="none">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <h1 class="font-display text-4xl leading-tight sm:text-5xl">Request received.</h1>
    <p class="mt-4 max-w-md text-lg leading-relaxed text-cream">
      Thank you — we'll reply within one business day with an itemized quote. For
      anything urgent, call
      <a href="tel:+12405550142" class="text-gold-light underline">(240) 555-0142</a>.
    </p>

    <a href="/" class="btn btn--gold mt-9">Back to home</a>
  </main>
</template>
