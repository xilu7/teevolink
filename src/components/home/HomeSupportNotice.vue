<script setup>
import {
  SUPPORTED_BROWSERS,
  UNSUPPORTED_BROWSER_NOTE,
} from "@/config/home-content.js";
import { PRODUCT } from "@/config/terra-pro.js";
</script>

<template>
  <section class="home-env" aria-label="环境与支持浏览器">
    <span class="env-label">环境</span>
    <div class="env-tags">
      <span
        v-for="b in SUPPORTED_BROWSERS"
        :key="b.id"
        class="env-chip"
      >
        {{ b.name }} {{ b.version }}
      </span>
      <span class="env-chip product">{{ PRODUCT.name }}</span>
    </div>
    <p class="env-note">{{ UNSUPPORTED_BROWSER_NOTE }}</p>
  </section>
</template>

<style scoped>
.home-env {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 0.5rem 0.85rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--bd);
  background: var(--bg);
}
.env-label {
  grid-row: 1 / -1;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tx3);
  padding-right: 0.25rem;
  border-right: 1px solid var(--bd);
  padding-top: 0.15rem;
  align-self: stretch;
  display: flex;
  align-items: center;
}
.env-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}
.env-chip {
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--tx);
  background: var(--bg2);
  border: 1px solid var(--bd);
  white-space: nowrap;
}
.env-chip.product {
  background: color-mix(in srgb, var(--acd) 10%, var(--bg2));
  border-color: color-mix(in srgb, var(--acd) 35%, var(--bd));
}
.env-note {
  grid-column: 2;
  margin: 0;
  font-size: 0.72rem;
  color: var(--amx);
  line-height: 1.45;
}
@media (max-width: 640px) {
  .home-env {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .env-label {
    grid-row: auto;
    border-right: none;
    border-bottom: 1px solid var(--bd);
    padding-bottom: 0.35rem;
  }
  .env-note {
    grid-column: 1;
  }
}
</style>
