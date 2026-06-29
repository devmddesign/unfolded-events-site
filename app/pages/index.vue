<template>
  <HeroSection />
  <InventorySection />
  <QuoteSection />
  <GallerySection />
  <TestimonialsSection />
  <AboutSection />
  <FaqSection />
</template>

<script setup lang="ts">
// Home: composes every section. Header + footer come from the default layout.
// Global title/description/OG live in nuxt.config; here we add canonical + url.
const canonical = 'https://www.unfoldedevents.com/';
useHead({
  link: [{
    rel: 'canonical',
    href: canonical
  }]
});
useSeoMeta({ ogUrl: canonical });
</script>
