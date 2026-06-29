<template>
  <div
    class="hero-canvas"
    :data-ready="ready ? 'true' : 'false'"
    aria-hidden="true"
  >
    <TresCanvas
      render-mode="manual"
      :dpr="[1, 2]"
      :alpha="true"
      :clear-alpha="0"
      :antialias="true"
      power-preference="low-power"
    >
      <TresAmbientLight
        :intensity="0.2"
        color="#fff3df"
      />
      <TresDirectionalLight
        :position="[3, 5, 4]"
        :intensity="KEY"
        color="#fff4e2"
      />
      <!-- gold rim/back light → the gold edge highlight on the dark metal -->
      <TresDirectionalLight
        :position="[-4, 1.5, -3.5]"
        :intensity="RIM"
        color="#e8c074"
      />
      <!-- cool fill from the opposite side so no rotation hits a flat silhouette -->
      <TresDirectionalLight
        :position="[-3, 1, 3]"
        :intensity="FILL"
        color="#cfe0ff"
      />
      <HeroChairModel
        :active="active"
        @ready="onReady"
      />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';

/**
 * Client-only TresJS canvas (three + the GLTF loader stay out of the initial/SSR
 * bundle — lazily imported only on capable desktops when the hero is in view).
 * Decorative: aria-hidden, no focusable content. render-mode "manual": the model
 * owns the continuous spin/float loop and calls advance() per frame, gated to the
 * in-view window so nothing renders while the hero is off-screen.
 */
defineProps<{ active: boolean }>();
const emit = defineEmits<{ ready: [] }>();

// Light intensities — env (RoomEnvironment IBL, set in the model) does the wrap
// fill so the metal reads from every angle; these add the key + gold edge.
const KEY = 2.4; // front-upper-3/4 key
const RIM = 2.7; // gold rim/back light for the edge highlight
const FILL = 0.55; // cool fill to keep the far side from going flat

const ready = ref(false);
const onReady = () => {
  ready.value = true;
  emit('ready');
};
</script>
