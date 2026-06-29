<template>
  <section
    id="faq"
    class="scroll-anchor bg-linen py-20 lg:py-28"
    aria-labelledby="faq-heading"
  >
    <div class="shell grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div
        v-reveal
        class="reveal"
      >
        <FoldEyebrow
          number="06"
          label="FAQ"
          class="mb-6"
        />
        <h2
          id="faq-heading"
          class="font-display text-4xl leading-[1.04] lg:text-[46px]"
        >
          Good to know.
        </h2>
        <p class="mt-4 max-w-[280px] text-[15px] leading-relaxed text-muted">
          Still have a question? We're a quick note away — and we actually reply.
        </p>
      </div>

      <div
        v-reveal="80"
        class="reveal border-b border-[#d9d1c1]"
      >
        <div
          v-for="(item, i) in faqs"
          :key="item.q"
          class="faq-item border-t border-[#d9d1c1]"
          :data-open="open[i] ? 'true' : 'false'"
        >
          <h3 class="m-0">
            <button
              :id="`faq-btn-${i}`"
              type="button"
              class="flex w-full items-center justify-between gap-5 py-6 text-left"
              :aria-expanded="open[i] ? 'true' : 'false'"
              :aria-controls="`faq-panel-${i}`"
              @click="toggle(i)"
            >
              <span class="font-display text-xl text-ink">
                {{ item.q }}
              </span>
              <span
                class="faq-marker font-display text-[22px] leading-none text-gold"
                aria-hidden="true"
              >
                {{ open[i] ? '−' : '+' }}
              </span>
            </button>
          </h3>
          <div
            :id="`faq-panel-${i}`"
            class="faq-panel"
            role="region"
            :aria-labelledby="`faq-btn-${i}`"
          >
            <div class="faq-panel__inner">
              <p class="max-w-xl pb-6 pr-6 text-[15px] leading-relaxed text-muted">
                {{ item.a }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const faqs = [{
  q: 'Do you deliver and set up?',
  a: 'Yes — we deliver, set, and collect across the DMV. Setup and breakdown can be added to any order, or choose will-call on select items.'
}, {
  q: 'Is there an order minimum?',
  a: 'Delivery orders start at $500 before tax and travel. Will-call is available on select smaller items with no minimum.'
}, {
  q: 'How far in advance should I book?',
  a: 'Two to four weeks is comfortable for most events; peak spring and fall weekends book earlier. We\'ll always try to accommodate short notice.'
}, {
  q: 'What about damage or cleaning?',
  a: 'Normal use is expected and fine. A light damage waiver covers minor wear; significant loss is billed at replacement cost. Return items free of debris — we handle the laundering.'
}, {
  q: 'How does payment work?',
  a: 'A signed quote and deposit reserve your date; the balance is due before delivery. We accept card and ACH, and provide itemized receipts.'
}];

const open = reactive<Record<number, boolean>>({ 0: true });
const toggle = (i: number) => (open[i] = !open[i]);
</script>
