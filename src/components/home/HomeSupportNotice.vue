<script setup>
import {
  SUPPORTED_BROWSERS,
  UNSUPPORTED_BROWSER_NOTE,
  SUPPORTED_PRODUCTS,
  HOME_SITE_HINT,
} from "@/config/home-content.js";
import { PRODUCT } from "@/config/terra-pro.js";
</script>

<template>
  <section class="home-support" aria-label="环境与支持说明">
    <div class="support-hero">
      <span class="support-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="9" />
          <path stroke-linecap="round" d="M12 8v4M12 16h.01" />
        </svg>
      </span>
      <div>
        <h2 class="support-title">支持的浏览器与设备</h2>
        <p class="support-lead">
          本驱动为 <strong>网页版</strong>，需浏览器提供 Web HID。当前适配
          <strong>{{ PRODUCT.name }}</strong>。
        </p>
      </div>
    </div>

    <div class="support-grid">
      <div class="support-block">
        <h3>推荐浏览器</h3>
        <ul class="browser-list">
          <li v-for="b in SUPPORTED_BROWSERS" :key="b.id" class="browser-item ok">
            <span class="browser-badge">✓</span>
            <span>
              <strong>{{ b.name }}</strong>
              <small>{{ b.version }}</small>
            </span>
          </li>
        </ul>
        <p class="support-note warn">{{ UNSUPPORTED_BROWSER_NOTE }}</p>
      </div>
      <div class="support-block">
        <h3>支持型号</h3>
        <ul class="product-list">
          <li v-for="(p, i) in SUPPORTED_PRODUCTS" :key="i">{{ p }}</li>
        </ul>
        <p class="support-note">{{ HOME_SITE_HINT }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-support {
  padding: 1rem 1.15rem;
  border-radius: 14px;
  border: 1px solid var(--bd);
  background: linear-gradient(165deg, var(--bg) 0%, var(--bg2) 100%);
}
.support-hero {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 0.85rem;
}
.support-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg2);
  border: 1px solid var(--bd);
  color: var(--acd);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.support-icon svg {
  width: 22px;
  height: 22px;
}
.support-title {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 0.25rem;
  letter-spacing: -0.02em;
}
.support-lead {
  margin: 0;
  font-size: 0.82rem;
  color: var(--tx2);
  line-height: 1.5;
}
.support-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
@media (max-width: 640px) {
  .support-grid {
    grid-template-columns: 1fr;
  }
}
.support-block h3 {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tx3);
  margin: 0 0 0.45rem;
}
.browser-list,
.product-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.browser-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
}
.browser-badge {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--acd) 18%, transparent);
  color: var(--acd);
  font-size: 0.7rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.browser-item strong {
  display: block;
  font-weight: 700;
  color: var(--tx);
}
.browser-item small {
  color: var(--tx3);
  font-size: 0.68rem;
}
.product-list li {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--tx2);
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}
.support-note {
  margin: 0.5rem 0 0;
  font-size: 0.72rem;
  color: var(--tx3);
  line-height: 1.45;
}
.support-note.warn {
  color: var(--amx);
}
</style>
