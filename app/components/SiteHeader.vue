<script setup lang="ts">
const links = [
  { label: "Inventory", href: "#inventory" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

const open = ref(false);
const toggleRef = ref<HTMLButtonElement | null>(null);

function close() {
  open.value = false;
}
function onLinkClick() {
  // Close the mobile menu and return focus to the toggle for keyboard users.
  if (open.value) {
    close();
    nextTick(() => toggleRef.value?.focus());
  }
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && open.value) {
    close();
    toggleRef.value?.focus();
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-line-dark bg-obsidian/95 backdrop-blur-sm"
    @keydown="onKeydown"
  >
    <div class="shell flex h-[68px] items-center justify-between">
      <!-- Wordmark -->
      <a href="#hero" class="flex items-end gap-2" aria-label="Unfolded Events — home" @click="onLinkClick">
        <span class="font-display text-2xl font-medium tracking-[-0.01em] text-ivory">
          Unfolded<span class="text-gold">.</span>
        </span>
        <span class="pb-1.5 text-[10px] tracking-[0.34em] text-stone">EVENTS</span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-9 md:flex" aria-label="Primary">
        <a v-for="l in links" :key="l.href" :href="l.href" class="nav-link">{{ l.label }}</a>
        <a href="#quote" class="btn btn--gold btn--sm">Request a quote</a>
      </nav>

      <!-- Mobile toggle -->
      <button
        ref="toggleRef"
        type="button"
        class="relative -mr-1 inline-flex h-11 w-11 items-center justify-center rounded-field text-ivory md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        @click="open = !open"
      >
        <span class="sr-only">{{ open ? "Close menu" : "Open menu" }}</span>
        <span class="relative block h-3.5 w-6" aria-hidden="true">
          <span
            class="absolute left-0 block h-[1.5px] w-6 bg-cream transition-all duration-300"
            :class="open ? 'top-1.5 rotate-45' : 'top-0'"
          />
          <span
            class="absolute left-0 top-1.5 block h-[1.5px] w-6 bg-cream transition-all duration-300"
            :class="open ? 'opacity-0' : 'opacity-100'"
          />
          <span
            class="absolute left-0 block h-[1.5px] w-6 bg-cream transition-all duration-300"
            :class="open ? 'top-1.5 -rotate-45' : 'top-3'"
          />
        </span>
      </button>
    </div>

    <!-- Mobile menu -->
    <nav
      v-show="open"
      id="mobile-nav"
      class="border-t border-line-dark bg-obsidian md:hidden"
      aria-label="Primary"
    >
      <ul class="shell flex flex-col py-4">
        <li v-for="l in links" :key="l.href">
          <a
            :href="l.href"
            class="block border-b border-line-dark/60 py-3.5 text-[15px] text-cream"
            @click="onLinkClick"
          >
            {{ l.label }}
          </a>
        </li>
        <li class="pt-4">
          <a href="#quote" class="btn btn--gold btn--block" @click="onLinkClick">Request a quote</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
