<script setup>
import { HOME_CONNECT_STEPS } from "@/config/factory-hid-flow.js";
</script>

<template>
  <section class="home-guide" aria-label="连接引导">
    <header class="guide-head">
      <h2 class="guide-title">首次连接 · 四步图文引导</h2>
      <p class="guide-lead">按顺序操作即可；授权一次后，下次打开会自动记住设备。</p>
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
          <span class="hand" title="点击位置">👆</span>
          <div v-if="s.step === 1" class="mock-card-connect">
            <span class="mock-btn primary wide">连接设备</span>
          </div>
          <div v-else-if="s.step === 2" class="mock-hid-dialog">
            <p class="mock-hid-title">teevolink 要连接 HID 设备</p>
            <div class="mock-hid-item on">
              <span class="mock-radio" />
              RapidSync
            </div>
            <div class="mock-hid-item muted">其他设备…</div>
          </div>
          <div v-else-if="s.step === 3" class="mock-hid-dialog compact">
            <div class="mock-hid-actions">
              <span class="mock-btn ghost">取消</span>
              <span class="mock-btn primary">连接</span>
            </div>
          </div>
          <div v-else class="mock-open-settings">
            <div class="mock-device-row">
              <span class="mock-mouse-icon" />
              <span class="mock-btn primary wide">打开驱动设置</span>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.home-guide {
  padding: 1rem 1.1rem 1.15rem;
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
}
.guide-lead {
  font-size: 0.78rem;
  color: var(--tx2);
  margin: 0;
  line-height: 1.5;
}
.guide-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}
@media (max-width: 720px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }
}
.guide-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.7rem 0.75rem;
  border-radius: 12px;
  background: var(--bg2);
  border: 1px solid var(--bd);
  min-height: 168px;
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
  font-size: 0.7rem;
  color: var(--tx3);
  line-height: 1.45;
}
.guide-visual {
  position: relative;
  flex: 1;
  min-height: 88px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px dashed var(--bd2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  overflow: hidden;
}
.hand {
  position: absolute;
  bottom: 6px;
  right: 8px;
  font-size: 1.1rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
  pointer-events: none;
  z-index: 2;
}
.visual-1 .hand {
  bottom: auto;
  top: 8px;
  right: 12px;
}
.mock-card-connect {
  width: 92%;
  display: flex;
  justify-content: center;
}
.mock-card-connect .mock-btn.primary {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--acd) 35%, transparent);
}
.mock-hid-dialog {
  width: 94%;
  padding: 0.4rem 0.45rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  font-size: 0.58rem;
}
.mock-hid-dialog.compact {
  padding: 0.55rem;
}
.mock-hid-title {
  margin: 0 0 0.35rem;
  color: var(--tx2);
  font-weight: 600;
}
.mock-hid-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.25rem;
  border-radius: 4px;
  color: var(--tx2);
}
.mock-hid-item.on {
  background: color-mix(in srgb, var(--acd) 12%, #fff);
  outline: 2px solid var(--acd);
  font-weight: 700;
  color: var(--tx);
}
.mock-hid-item.muted {
  opacity: 0.45;
  margin-top: 0.15rem;
}
.mock-radio {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--acd);
  background: var(--acd);
}
.mock-hid-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}
.mock-btn {
  padding: 0.18rem 0.5rem;
  border-radius: 5px;
  font-size: 0.58rem;
  font-weight: 700;
}
.mock-btn.ghost {
  border: 1px solid var(--bd);
  color: var(--tx3);
}
.mock-btn.primary {
  background: var(--tx);
  color: var(--bg);
}
.mock-btn.wide {
  padding: 0.35rem 0.65rem;
  font-size: 0.62rem;
}
.mock-open-settings {
  width: 94%;
}
.mock-device-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}
.mock-mouse-icon {
  width: 48px;
  height: 28px;
  border-radius: 14px 14px 8px 8px;
  background: linear-gradient(180deg, #333 0%, #111 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
