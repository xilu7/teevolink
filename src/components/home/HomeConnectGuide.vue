<script setup>
import { HOME_CONNECT_STEPS } from "@/config/factory-hid-flow.js";
</script>

<template>
  <section class="home-guide" aria-label="连接引导">
    <h2 class="guide-title">连接引导</h2>
    <p class="guide-lead">按工厂 Web HID 流程操作，首次需授权；下次打开会自动连接，无需再点弹窗。</p>
    <ol class="guide-steps">
      <li v-for="s in HOME_CONNECT_STEPS" :key="s.step" class="guide-step">
        <span class="guide-num">{{ s.step }}</span>
        <div class="guide-copy">
          <strong>{{ s.title }}</strong>
          <p>{{ s.desc }}</p>
        </div>
        <div class="guide-mock" :class="`mock-${s.step}`" aria-hidden="true">
          <div v-if="s.step === 1" class="mock-plus">+</div>
          <div v-else-if="s.step === 2" class="mock-dialog">
            <span class="mock-dialog-title">teevolink 要连接 HID 设备</span>
            <span class="mock-dialog-item on">RapidSync</span>
            <span class="mock-dialog-item">其他设备</span>
          </div>
          <div v-else-if="s.step === 3" class="mock-dialog">
            <span class="mock-dialog-btn">连接</span>
          </div>
          <div v-else class="mock-settings">⚙ 打开设置</div>
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
.guide-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0 0 0.35rem;
}
.guide-lead {
  font-size: 0.78rem;
  color: var(--tx2);
  margin: 0 0 0.85rem;
  line-height: 1.5;
}
.guide-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}
@media (max-width: 900px) {
  .guide-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 520px) {
  .guide-steps {
    grid-template-columns: 1fr;
  }
}
.guide-step {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.65rem;
  border-radius: 10px;
  background: var(--bg2);
  border: 1px solid var(--bd);
  min-height: 140px;
}
.guide-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--tx);
  color: var(--bg);
  font-size: 0.72rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.guide-copy strong {
  display: block;
  font-size: 0.78rem;
  margin-bottom: 0.2rem;
  line-height: 1.35;
}
.guide-copy p {
  margin: 0;
  font-size: 0.68rem;
  color: var(--tx3);
  line-height: 1.4;
}
.guide-mock {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  border-radius: 8px;
  background: var(--bg);
  border: 1px dashed var(--bd2);
}
.mock-plus {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--tx);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 300;
}
.mock-dialog {
  width: 92%;
  padding: 0.35rem;
  font-size: 0.55rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.mock-dialog-title {
  color: var(--tx2);
}
.mock-dialog-item {
  padding: 0.15rem 0.25rem;
  border-radius: 4px;
  background: var(--bg2);
}
.mock-dialog-item.on {
  outline: 2px solid var(--gn);
}
.mock-dialog-btn {
  align-self: flex-end;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}
.mock-settings {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gn);
}
</style>
