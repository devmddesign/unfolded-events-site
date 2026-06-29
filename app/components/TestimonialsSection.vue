<script setup lang="ts">
import FoldEyebrow from "./FoldEyebrow.vue";

const quotes = [
  {
    quote:
      "They turned a blank ballroom into something our leadership still talks about. Flawless delivery — not a scuff in sight.",
    name: "Maya R.",
    role: "Events Lead · fintech firm",
  },
  {
    quote:
      "On time, beautifully styled, and genuinely easy to work with. The chairs alone made the photographs.",
    name: "Daniel & Priya",
    role: "40th anniversary · Bethesda",
  },
  {
    quote:
      "Our gala had a brutal load-in window. Unfolded handled it without a hitch, then quietly collected after.",
    name: "Theresa K.",
    role: "Development Director · nonprofit",
  },
];
</script>

<template>
  <section class="scroll-anchor bg-ivory py-20 lg:py-28" aria-labelledby="testimonials-heading">
    <div class="shell">
      <h2 id="testimonials-heading" class="sr-only">What our clients say</h2>
      <FoldEyebrow number="04" label="Testimonials" class="mb-12" />

      <ul class="grid grid-cols-1 gap-11 md:grid-cols-3">
        <li v-for="(t, i) in quotes" :key="t.name" v-reveal="i * 90" class="reveal">
          <figure class="m-0">
            <div class="mb-5 flex items-center gap-2.5" aria-hidden="true">
              <span class="diamond shrink-0"></span>
              <span class="h-px w-11 bg-gold-mid"></span>
            </div>
            <blockquote class="m-0">
              <p class="font-display text-xl italic leading-[1.42] text-[#2a261f]">"{{ t.quote }}"</p>
            </blockquote>
            <figcaption class="mt-6">
              <span class="block text-sm font-semibold text-ink">{{ t.name }}</span>
              <span class="mt-0.5 block text-[13px] text-gold-ink">{{ t.role }}</span>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template>
