<script setup lang="ts">
// Title template lives here (runtime, where functions are fine) rather than in
// nuxt.config app.head — a function in the static config head is not reliably
// serialized and was dropping the entire head from the prerendered HTML.
useHead({
  titleTemplate: (title?: string) =>
    title ? `${title} · Unfolded Events` : "Unfolded Events — Table & Chair Rentals in the DMV",
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
