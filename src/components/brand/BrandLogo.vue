<script setup>
import { BRAND_ASSETS } from "@/config/brand.js";

defineProps({
  size: { type: String, default: "md" },
  showWordmark: { type: Boolean, default: true },
  showMark: { type: Boolean, default: true },
});
</script>

<template>
  <div class="brand-logo" :class="size">
    <img
      v-if="showMark"
      :src="BRAND_ASSETS.logoMark"
      alt=""
      class="brand-mark"
      aria-hidden="true"
    />
    <span v-if="showWordmark" class="brand-wordmark" aria-label="Teevolution">
      TEE<span class="brand-v">V</span>OLUTION
    </span>
  </div>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-mark {
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}
.brand-logo.sm .brand-mark {
  height: 26px;
  width: 26px;
}
.brand-logo.md .brand-mark {
  height: 32px;
  width: 32px;
}
.brand-logo.lg .brand-mark {
  height: 40px;
  width: 40px;
}
.brand-wordmark {
  font-size: 0.72rem;
  font-weight: 800;
  font-style: italic;
  letter-spacing: 0.06em;
  color: var(--tx);
  line-height: 1;
}
.brand-logo.lg .brand-wordmark {
  font-size: 0.82rem;
}
.brand-v {
  color: var(--acd);
}
</style>
