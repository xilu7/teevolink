<script setup>
import { BRAND_ASSETS } from "@/config/brand.js";

defineProps({
  /** home 首页 | auxiliary 性能页侧栏 | keys 改键/宏 */
  variant: {
    type: String,
    default: "auxiliary",
    validator: (v) => ["home", "auxiliary", "keys"].includes(v),
  },
});
</script>

<template>
  <div class="mouse-duo" :class="`mouse-duo--${variant}`">
    <div class="mouse-duo__front">
      <slot />
      <img :src="BRAND_ASSETS.mouseFront" alt="Terra Pro 正面" loading="lazy" />
    </div>
    <div class="mouse-duo__back">
      <img :src="BRAND_ASSETS.mouseBack" alt="Terra Pro 底面" loading="lazy" />
    </div>
  </div>
</template>
