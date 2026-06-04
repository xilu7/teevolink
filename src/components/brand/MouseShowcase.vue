<script setup>
import { BRAND_ASSETS } from "@/config/brand.js";

defineProps({
  size: { type: String, default: "md" },
  showLabels: { type: Boolean, default: false },
  /** 仅正面大图（设备页侧栏） */
  frontOnly: { type: Boolean, default: false },
});
</script>

<template>
  <div v-if="frontOnly" class="mouse-showcase-front-only">
    <img :src="BRAND_ASSETS.mouseFront" alt="Terra Pro" loading="lazy" />
  </div>
  <div v-else class="mouse-showcase" :class="size">
    <figure class="mouse-fig">
      <img :src="BRAND_ASSETS.mouseFront" alt="Terra Pro" loading="lazy" />
      <figcaption v-if="showLabels">正面</figcaption>
    </figure>
    <figure class="mouse-fig">
      <img :src="BRAND_ASSETS.mouseBack" alt="Terra Pro 底面" loading="lazy" />
      <figcaption v-if="showLabels">底面</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.mouse-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  align-items: end;
  justify-items: center;
}
.mouse-fig {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.mouse-fig img {
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center bottom;
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.18));
  transition: transform 0.35s ease;
}
.mouse-showcase:hover .mouse-fig img {
  transform: translateY(-2px);
}
.mouse-fig figcaption {
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tx3);
}
.mouse-showcase.sm .mouse-fig img {
  max-height: 72px;
}
.mouse-showcase.md .mouse-fig img {
  max-height: 108px;
}
.mouse-showcase.lg .mouse-fig img {
  max-height: 148px;
}
.mouse-showcase-front-only {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mouse-showcase-front-only img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
}
</style>
