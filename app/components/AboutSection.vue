<script setup lang="ts">
import PlaceholderImage from "./PlaceholderImage.vue";
import FoldEyebrow from "./FoldEyebrow.vue";

const areas = [
  { region: "DC", items: ["Washington"] },
  { region: "Maryland", items: ["Montgomery", "Prince George's", "Howard · Frederick", "Anne Arundel"] },
  { region: "Virginia", items: ["Arlington", "Alexandria", "Fairfax · Loudoun"] },
];

// LocalBusiness JSON-LD for local SEO (areaServed = DC / MD / VA, based in Rockville, MD).
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Unfolded Events",
        description:
          "Premium table & seating rentals — delivered, styled, and set across DC, Maryland & Virginia.",
        url: "https://www.unfoldedevents.com",
        telephone: "+1-240-555-0142",
        email: "hello@unfoldedevents.com",
        priceRange: "$$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rockville",
          addressRegion: "MD",
          postalCode: "20850",
          addressCountry: "US",
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Washington, DC" },
          { "@type": "State", name: "Maryland" },
          { "@type": "State", name: "Virginia" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      }),
    },
  ],
});
</script>

<template>
  <section id="about" class="scroll-anchor bg-ivory py-20 lg:py-28" aria-labelledby="about-heading">
    <div class="shell grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <!-- Copy -->
      <div v-reveal class="reveal">
        <FoldEyebrow number="05" label="About & Service Area" class="mb-7" />
        <h2 id="about-heading" class="font-display text-4xl leading-[1.04] lg:text-5xl">Rooted in the DMV.</h2>
        <p class="mt-6 max-w-lg text-base leading-[1.7] text-muted">
          Unfolded Events is a table &amp; seating rental studio based in
          Rockville, Montgomery County — built for the way the DMV actually
          gathers, from boardrooms to backyards.
        </p>
        <p class="mt-4 max-w-lg text-base leading-[1.7] text-muted">
          A room turns the moment the furniture lands. So we obsess over the
          pieces, the delivery window, and the quiet work of setting a space
          until it feels inevitable.
        </p>
        <p class="mt-4 max-w-lg text-base leading-[1.7] text-ink">
          Every order is an <em class="italic text-gold-ink">unfolding</em> —
          flat-packed potential that opens into a finished room.
        </p>
      </div>

      <!-- Map + service grid -->
      <div v-reveal="80" class="reveal">
        <div class="overflow-hidden rounded-card border border-hairline">
          <PlaceholderImage
            alt="Service-area map of the DMV — Washington DC, Maryland, and Virginia — centered on Rockville, Maryland."
            :width="760"
            :height="200"
            label="service-area map — DC · MD · VA"
            class="h-[200px] w-full object-cover"
          />
        </div>
        <dl class="mt-6 grid grid-cols-3 gap-5">
          <div v-for="a in areas" :key="a.region">
            <dt class="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
              {{ a.region }}
            </dt>
            <dd class="m-0 text-[13px] leading-[1.8] text-muted">
              <span v-for="(item, i) in a.items" :key="item">{{ item }}<br v-if="i < a.items.length - 1" /></span>
            </dd>
          </div>
        </dl>
        <p class="mt-6 border-t border-[#ded7c8] pt-4 text-[13px] font-semibold text-gold-ink">
          Free delivery within 35 miles of Rockville, MD.
        </p>
      </div>
    </div>
  </section>
</template>
