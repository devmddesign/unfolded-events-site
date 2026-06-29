<template>
  <footer class="bg-obsidian text-ivory">
    <div class="shell py-20 lg:py-24">
      <!-- Closing CTA -->
      <div class="flex flex-col justify-between gap-8 border-b border-[#2e2a23] pb-12 md:flex-row md:items-end">
        <div>
          <p class="eyebrow text-gold-light">
            Let's talk
          </p>
          <p class="mt-4 font-display text-4xl leading-none text-ivory lg:text-[54px]">
            Let's set the scene.
          </p>
        </div>
        <a
          href="#quote"
          class="btn btn--gold self-start md:self-auto"
        >
          Request a quote →
        </a>
      </div>

      <!-- Columns -->
      <div class="grid grid-cols-2 gap-10 py-12 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-end gap-2">
            <span class="font-display text-2xl font-medium text-ivory">
              Unfolded<span class="text-gold">.</span>
            </span>
            <span class="pb-1.5 text-[10px] tracking-[0.34em] text-stone">
              EVENTS
            </span>
          </div>
          <p class="mt-3.5 max-w-[280px] text-sm leading-[1.7] text-stone">
            Premium table &amp; seating rentals — delivered, styled, and set
            across the DMV.
          </p>
        </div>

        <nav aria-label="Footer">
          <p class="mb-4 text-[11px] uppercase tracking-[0.16em] text-stone">
            Explore
          </p>
          <ul class="flex flex-col gap-2.5 text-sm text-cream">
            <li
              v-for="l in explore"
              :key="l.href"
            >
              <a
                :href="l.href"
                class="transition-colors hover:text-gold-light"
              >
                {{ l.label }}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p class="mb-4 text-[11px] uppercase tracking-[0.16em] text-stone">
            Contact
          </p>
          <ul class="flex flex-col gap-2.5 text-sm text-cream">
            <li>
              Rockville, MD
            </li>
            <li>
              <a
                href="mailto:hello@unfoldedevents.com"
                class="transition-colors hover:text-gold-light"
              >
                hello@unfoldedevents.com
              </a>
            </li>
            <li>
              <a
                href="tel:+12405550142"
                class="transition-colors hover:text-gold-light"
              >
                (240) 555-0142
              </a>
            </li>
            <li class="text-stone">
              Mon–Fri · 9–6
            </li>
          </ul>
        </div>

        <div>
          <p class="mb-4 text-[11px] uppercase tracking-[0.16em] text-stone">
            Service area
          </p>
          <ul class="flex flex-col gap-2.5 text-sm text-cream">
            <li>
              Washington, DC
            </li>
            <li>
              Maryland
            </li>
            <li>
              Virginia
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="flex flex-col justify-between gap-3 text-xs text-stone sm:flex-row sm:items-center">
        <span>
          © 2026 Unfolded Events · Rentals delivered, styled &amp; set
        </span>
        <span class="font-mono">
          DC · MD · VA
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const explore = [{
  label: 'Inventory',
  href: '#inventory'
}, {
  label: 'Gallery',
  href: '#gallery'
}, {
  label: 'About',
  href: '#about'
}, {
  label: 'FAQ',
  href: '#faq'
}];
</script>
