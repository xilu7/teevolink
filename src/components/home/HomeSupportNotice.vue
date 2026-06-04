<script setup>
import { SUPPORTED_BROWSERS, UNSUPPORTED_BROWSER_NOTE } from "@/config/home-content.js";
import { PRODUCT } from "@/config/terra-pro.js";
</script>

<template>
  <section class="home-support" aria-label="支持的浏览器">
    <span class="support-label">环境</span>
    <div class="support-chips">
      <span v-for="b in SUPPORTED_BROWSERS" :key="b.id" class="chip ok">
        {{ b.name }} {{ b.version }}
      </span>
      <span class="chip product">{{ PRODUCT.name }}</span>
    </div>
    <span class="support-warn">{{ UNSUPPORTED_BROWSER_NOTE }}</span>
  </section>
</template>

<style scoped>
.home-support {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  padding: 0.45rem 0.65rem;
  border-radius: 10px;
  border: 1px solid var(--bd);
  background: var(--bg);
  font-size: 0.68rem;
  line-height: 1.35;
}
.support-label {
  font-weight: 800;
  color: var(--tx3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}
.support-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  flex: 1;
}
.chip {
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  font-weight: 600;
  color: var(--tx2);
}
.chip.ok {
  border-color: color-mix(in srgb, var(--acd) 35%, var(--bd));
  color: var(--tx);
}
.chip.product {
  font-weight: 700;
}
.support-warn {
  width: 100%;
  color: var(--tx3);
  font-size: 0.64rem;
}
@media (min-width: 720px) {
  .support-warn {
    width: auto;
    margin-left: auto;
  }
}
</style>
