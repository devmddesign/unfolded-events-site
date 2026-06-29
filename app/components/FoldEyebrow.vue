<template>
  <div class="flex items-center gap-3.5">
    <p
      :id="id"
      class="eyebrow"
      :class="{ 'text-gold-light': tone === 'dark' }"
    >
      {{ text }}
    </p>
    <span
      class="diamond diamond--hollow shrink-0"
      aria-hidden="true"
    ></span>
    <span
      class="rule-fade"
      :class="{ 'rule-fade--dark': tone === 'dark' }"
      aria-hidden="true"
    ></span>
  </div>
</template>

<script setup lang="ts">
/** The recurring "fold line" eyebrow: numbered label · diamond · fading rule. */
const props = withDefaults(
  defineProps<{
    label: string;
    number?: string;
    tone?: 'light' | 'dark';
    id?: string;
  }>(),
  { tone: 'light' }
);

const text = computed(() => (props.number ? `${props.number} — ${props.label}` : props.label));
</script>
