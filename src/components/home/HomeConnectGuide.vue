<script setup>
import { HOME_CONNECT_STEPS } from "@/config/factory-hid-flow.js";
import GuidePointer from "@/components/home/GuidePointer.vue";
</script>

<template>
  <section class="home-guide" aria-label="连接引导">
    <header class="guide-head">
      <h2 class="guide-title">首次连接 · 四步引导</h2>
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
          <div v-if="s.step === 1" class="mock-card-connect">
            <span class="mock-btn primary">连接设备</span>
          </div>
          <div v-else-if="s.step === 2" class="mock-hid-dialog">
            <div class="mock-hid-item on">
              <span class="mock-radio" />
              RapidSync
            </div>
          </div>
          <div v-else-if="s.step === 3" class="mock-hid-dialog compact">
            <span class="mock-btn ghost">取消</span>
            <span class="mock-btn primary">连接</span>
          </div>
          <div v-else class="mock-open-settings">
            <span class="mock-btn primary">打开驱动设置</span>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.home-guide {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0.5rem 0.6rem 0.55rem;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--bg);
}
.guide-head {
  margin-bottom: 0.4rem;
  flex-shrink: 0;
}
.guide-title {
  font-size: 0.82rem;
  font-weight: 800;
  margin: 0;
}
.guide-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.4rem;
}
@media (max-width: 860px) {
  .guide-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.guide-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.45rem 0.5rem;
  border-radius: 10px;
  background: var(--bg2);
  border: 1px solid var(--bd);
  min-height: 0;
}
.guide-card-top {
  display: flex;
  gap: 0.35rem;
  align-items: flex-start;
}
.guide-num {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--tx);
  color: var(--bg);
  font-size: 0.68rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.guide-copy strong {
  display: block;
  font-size: 0.68rem;
  margin-bottom: 0.1rem;
  line-height: 1.3;
  color: var(--tx);
}
.guide-copy p {
  margin: 0;
  font-size: 0.6rem;
  color: var(--tx3);
  line-height: 1.35;
}
.guide-visual {
  position: relative;
  flex: 1;
  min-height: 52px;
  max-height: 72px;
  border-radius: 8px;
  background: var(--bg);
  border: 1px dashed var(--bd2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  overflow: visible;
}
.guide-visual :deep(.guide-pointer) {
  position: absolute;
  z-index: 2;
}
.visual-1 :deep(.guide-pointer) {
  top: 2px;
  right: 8px;
  transform: rotate(8deg);
}
.visual-2 :deep(.guide-pointer) {
  bottom: 2px;
  left: 38%;
  transform: rotate(-25deg) scaleX(-1);
}
.visual-3 :deep(.guide-pointer) {
  bottom: 4px;
  right: 18%;
  transform: rotate(12deg);
}
.visual-4 :deep(.guide-pointer) {
  bottom: 2px;
  right: 10%;
  transform: rotate(-8deg);
}
.mock-card-connect,
.mock-open-settings {
  width: 100%;
  display: flex;
  justify-content: center;
}
.mock-btn {
  padding: 0.22rem 0.5rem;
  border-radius: 5px;
  font-size: 0.58rem;
  font-weight: 700;
  white-space: nowrap;
}
.mock-btn.primary {
  background: var(--tx);
  color: var(--bg);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--acd) 30%, transparent);
}
.mock-btn.ghost {
  border: 1px solid var(--bd);
  color: var(--tx3);
  margin-right: 0.25rem;
}
.mock-hid-dialog {
  width: 100%;
  padding: 0.3rem;
  border-radius: 6px;
  border: 1px solid var(--bd);
  background: #fff;
  font-size: 0.55rem;
}
.mock-hid-dialog.compact {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.2rem;
  background: transparent;
  border: none;
  padding: 0;
}
.mock-hid-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
  font-weight: 700;
  color: var(--tx);
}
.mock-hid-item.on {
  background: color-mix(in srgb, var(--acd) 10%, #fff);
  outline: 2px solid var(--acd);
}
.mock-radio {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--acd);
}
</style>
