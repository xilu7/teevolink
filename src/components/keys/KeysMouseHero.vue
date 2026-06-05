<script setup>
import { computed } from "vue";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";
import { injectKeysPage } from "./useKeysPageInject.js";

const { selectedBtn, selectedLabel } = injectKeysPage();

/** 俯视图热点位置（%）— Terra Pro 六键 */
const HOTSPOTS = {
  0: { left: 38, top: 48, tagDx: 0, tagDy: -12 },
  1: { left: 62, top: 48, tagDx: 0, tagDy: -12 },
  2: { left: 50, top: 36, tagDx: 0, tagDy: -14 },
  3: { left: 72, top: 58, tagDx: 8, tagDy: -8 },
  4: { left: 28, top: 58, tagDx: -8, tagDy: -8 },
  5: { left: 50, top: 68, tagDx: 0, tagDy: 6 },
};

const spot = computed(() => HOTSPOTS[selectedBtn.value] ?? HOTSPOTS[0]);
</script>

<template>
  <MouseShowcase variant="keys">
    <span
      class="keys-hero-hotspot"
      :style="{ left: `${spot.left}%`, top: `${spot.top}%` }"
    />
    <span
      class="keys-hero-tag"
      :style="{
        left: `calc(${spot.left}% + ${spot.tagDx}px)`,
        top: `calc(${spot.top}% + ${spot.tagDy}px)`,
      }"
    >
      {{ selectedLabel }}
    </span>
  </MouseShowcase>
</template>
