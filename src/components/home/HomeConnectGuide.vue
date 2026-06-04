<script setup>
import { HOME_CONNECT_STEPS } from "@/config/factory-hid-flow.js";
import { HOME_GUIDE_INTRO, HOME_GUIDE_COMPAT } from "@/config/home-content.js";
</script>

<template>
  <section class="home-guide-premium" aria-label="连接引导">
    <header class="guide-head">
      <h2 class="guide-title">连接引导</h2>
      <p class="guide-lead">{{ HOME_GUIDE_INTRO }}</p>
      <ul class="guide-compat">
        <li v-for="(line, i) in HOME_GUIDE_COMPAT" :key="i">{{ line }}</li>
      </ul>
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
        <div class="guide-visual" aria-hidden="true">
          <div v-if="s.step === 1" class="mock-topbar-row">
            <span class="mock-icon">☾</span>
            <span class="mock-icon accent">+</span>
          </div>
          <div v-else-if="s.step === 2" class="mock-dialog">
            <p class="mock-dialog-title">teevolink 要连接 HID 设备</p>
            <div class="mock-row on">
              <span class="dot" />
              RapidSync
            </div>
            <div class="mock-row muted">其他设备</div>
          </div>
          <div v-else-if="s.step === 3" class="mock-dialog-actions">
            <span class="mock-btn ghost">取消</span>
            <span class="mock-btn connect">连接</span>
          </div>
          <div v-else class="mock-settings">
            <span class="mock-gear" aria-hidden="true">⚙</span>
            <span class="mock-btn settings">打开设置</span>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.mock-topbar-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  width: 100%;
}
.mock-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--bd);
  background: var(--bg2);
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tx3);
}
.mock-icon.accent {
  background: var(--tx);
  color: var(--bg);
  border-color: var(--tx);
  font-size: 1.1rem;
  line-height: 1;
}
.mock-dialog {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: stretch;
}
.mock-dialog-title {
  margin: 0;
  font-size: 0.58rem;
  color: var(--tx3);
  line-height: 1.35;
  text-align: left;
}
.mock-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.32rem 0.42rem;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  background: var(--bg2);
  border: 1px solid var(--bd);
  color: var(--tx);
}
.mock-row.on {
  outline: 2px solid var(--acd);
  background: color-mix(in srgb, var(--acd) 12%, var(--bg2));
}
.mock-row.muted {
  color: var(--tx3);
  font-weight: 500;
  border-style: dashed;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--acd);
  flex-shrink: 0;
}
.mock-dialog-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}
.mock-btn {
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 700;
  white-space: nowrap;
}
.mock-btn.ghost {
  border: 1px solid var(--bd);
  color: var(--tx3);
  background: var(--bg2);
}
.mock-btn.connect {
  background: #1a73e8;
  color: #fff;
  border: 1px solid #1a73e8;
}
.mock-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}
.mock-gear {
  font-size: 1.25rem;
  opacity: 0.55;
  line-height: 1;
}
.mock-btn.settings {
  border: 1px solid var(--bd);
  background: var(--bg2);
  color: var(--tx);
  padding: 0.35rem 0.75rem;
}
</style>
