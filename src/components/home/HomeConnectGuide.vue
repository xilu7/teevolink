<script setup>
import { HOME_CONNECT_STEPS } from "@/config/factory-hid-flow.js";
import GuidePointer from "@/components/home/GuidePointer.vue";
</script>

<template>
  <section class="home-guide-premium" aria-label="连接引导">
    <header class="guide-head">
      <h2 class="guide-title">连接引导</h2>
    </header>

    <ol class="guide-grid">
      <li v-for="s in HOME_CONNECT_STEPS" :key="s.step" class="guide-card">
        <div class="guide-card-top">
          <span class="guide-num">{{ s.step }}</span>
          <div class="guide-copy">
            <strong>{{ s.title }}</strong>
          </div>
        </div>
        <div class="guide-visual" :class="`visual-${s.step}`" aria-hidden="true">
          <GuidePointer />
          <div v-if="s.step === 1" class="mock-inner">
            <span class="mock-btn primary">连接设备</span>
          </div>
          <div v-else-if="s.step === 2" class="mock-dialog">
            <p class="mock-title">HID 设备</p>
            <div class="mock-row on">
              <span class="dot" />
              RapidSync
            </div>
          </div>
          <div v-else-if="s.step === 3" class="mock-inner mock-actions">
            <span class="mock-btn ghost">取消</span>
            <span class="mock-btn primary">连接</span>
          </div>
          <div v-else class="mock-inner mock-settings">
            <span class="mock-btn primary">打开驱动设置</span>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.mock-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mock-actions {
  flex-direction: row;
  justify-content: flex-end;
  gap: 0.3rem;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--acd);
  flex-shrink: 0;
}
</style>
