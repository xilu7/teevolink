<script setup>
import { HOME_CONNECT_STEPS } from "@/config/factory-hid-flow.js";
import GuidePointer from "@/components/home/GuidePointer.vue";
</script>

<template>
  <section class="home-guide" aria-label="连接引导">
    <header class="guide-head">
      <h2 class="guide-title">首次连接 · 四步图文引导</h2>
      <p class="guide-lead">按顺序操作；浏览器授权一次后，下次会自动连接。</p>
    </header>

    <ol class="guide-grid">
      <li v-for="s in HOME_CONNECT_STEPS" :key="s.step" class="guide-card">
        <div class="guide-card-top">
          <span class="guide-num">{{ s.step }}</span>
          <div class="guide-copy">
            <strong>{{ s.title }}</strong>
            <p>{{ s.desc }}</p>
          </div>
        </div>
        <div class="guide-visual" :class="`visual-${s.step}`" aria-hidden="true">
          <GuidePointer />
          <div v-if="s.step === 1" class="mock-inner">
            <span class="mock-btn primary">连接设备</span>
          </div>
          <div v-else-if="s.step === 2" class="mock-inner mock-dialog">
            <p class="mock-title">选择 HID 设备</p>
            <div class="mock-row on">
              <span class="dot" />
              RapidSync
            </div>
          </div>
          <div v-else-if="s.step === 3" class="mock-inner mock-actions">
            <span class="mock-btn ghost">取消</span>
            <span class="mock-btn primary">连接</span>
          </div>
          <div v-else class="mock-inner">
            <span class="mock-btn primary">打开驱动设置</span>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.home-guide {
  padding: 1rem 1.1rem 1.05rem;
  border-radius: 14px;
  border: 1px solid var(--bd);
  background: var(--bg);
}
.guide-head {
  margin-bottom: 0.85rem;
}
.guide-title {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 0.3rem;
  letter-spacing: -0.02em;
}
.guide-lead {
  margin: 0;
  font-size: 0.8rem;
  color: var(--tx2);
  line-height: 1.5;
}
.guide-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
@media (min-width: 1080px) {
  .guide-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.guide-card {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.75rem 0.8rem;
  border-radius: 12px;
  background: var(--bg2);
  border: 1px solid var(--bd);
  min-height: 152px;
}
.guide-card-top {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}
.guide-num {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--tx);
  color: var(--bg);
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.guide-copy strong {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
  line-height: 1.35;
  color: var(--tx);
}
.guide-copy p {
  margin: 0;
  font-size: 0.72rem;
  color: var(--tx3);
  line-height: 1.45;
}
.guide-visual {
  position: relative;
  flex: 1;
  min-height: 76px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px dashed var(--bd2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem;
}
.guide-visual :deep(.guide-pointer) {
  position: absolute;
  z-index: 2;
  width: 24px;
  height: 24px;
}
.visual-1 :deep(.guide-pointer) {
  top: 6px;
  right: 10px;
  transform: rotate(10deg);
}
.visual-2 :deep(.guide-pointer) {
  bottom: 6px;
  left: 42%;
  transform: rotate(-20deg) scaleX(-1);
}
.visual-3 :deep(.guide-pointer) {
  bottom: 8px;
  right: 22%;
  transform: rotate(8deg);
}
.visual-4 :deep(.guide-pointer) {
  bottom: 6px;
  right: 12%;
  transform: rotate(-6deg);
}
.mock-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}
.mock-dialog {
  align-items: stretch;
}
.mock-title {
  margin: 0;
  width: 100%;
  font-size: 0.62rem;
  color: var(--tx3);
  text-align: left;
}
.mock-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  background: #fff;
  border: 1px solid var(--bd);
}
.mock-row.on {
  outline: 2px solid var(--acd);
  background: color-mix(in srgb, var(--acd) 8%, #fff);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--acd);
  flex-shrink: 0;
}
.mock-actions {
  flex-direction: row;
  justify-content: flex-end;
  gap: 0.35rem;
}
.mock-btn {
  padding: 0.32rem 0.65rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}
.mock-btn.primary {
  background: var(--tx);
  color: var(--bg);
}
.mock-btn.ghost {
  border: 1px solid var(--bd);
  color: var(--tx3);
  background: #fff;
}
</style>
