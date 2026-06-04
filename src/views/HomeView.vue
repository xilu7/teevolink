<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { PRODUCT } from "@/config/terra-pro.js";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";

const router = useRouter();
const { connect, openAuthorizedSession } = useDevice();

const busy = ref(false);
const phase = ref("");
const error = ref("");
const success = ref("");

const specs = [
  { label: "传感器", value: PRODUCT.sensorModel },
  { label: "主控", value: PRODUCT.mcu },
  { label: "DPI", value: `${PRODUCT.dpiMin} – ${PRODUCT.dpiMax}` },
  { label: "推荐档位", value: PRODUCT.defaultDpiPresets.join(" / ") },
  { label: "按键", value: `${PRODUCT.buttons} 键` },
  { label: "连接", value: "蓝牙 · 2.4G · USB" },
];

/** 改这个数字并 push 后，页脚能确认 Vercel 是否已更新 */
const BUILD_TAG = "2026-06-04-d";

const modules = [
  { title: "性能调校", desc: "场景 · DPI · LOD · 回报率" },
  { title: "按键", desc: "6 键改键 · 宏" },
  { title: "灯效与设备", desc: "RGB · 电源" },
];

async function onConnect() {
  error.value = "";
  success.value = "";
  if (!navigator.hid) {
    error.value = "请使用 Chrome 89+ 或 Edge 89+ 打开本页。";
    return;
  }

  busy.value = true;
  const guard = setTimeout(() => {
    if (!busy.value) return;
    busy.value = false;
    phase.value = "";
    error.value =
      "连接耗时过长。若已选过 RapidSync，请点「直接打开驱动」；或刷新页面后重试。";
  }, 12000);

  try {
    const result = await connect({
      onPhase: (msg) => {
        phase.value = msg;
      },
    });

    if (result.status === "cancelled") {
      error.value = result.message;
      return;
    }

    if (result.status === "failed") {
      error.value = result.message;
      return;
    }

    success.value = result.message;
    if (result.ready) {
      router.push("/device");
      return;
    }
    router.push("/device");
  } catch (e) {
    error.value = e?.message || "连接异常，请重试";
  } finally {
    clearTimeout(guard);
    busy.value = false;
    phase.value = "";
  }
}

async function onEnterDriver() {
  error.value = "";
  success.value = "";
  if (!navigator.hid) {
    error.value = "请使用 Chrome 或 Edge。";
    return;
  }
  busy.value = true;
  phase.value = "正在打开已授权设备…";
  try {
    const ok = await openAuthorizedSession();
    if (!ok) {
      error.value = "尚未授权：请先点「连接设备」并在弹窗中选 RapidSync";
      return;
    }
    success.value = "正在进入驱动…";
    router.push("/device");
  } catch (e) {
    error.value = e?.message || "无法进入驱动";
  } finally {
    busy.value = false;
    phase.value = "";
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
</script>

<template>
  <div class="home-page driver-shell">
    <AppTopbar logo-size="lg" />

    <main class="container home-main">
      <section class="home-hero">
        <div class="home-hero-copy">
          <p class="section-label">无线游戏鼠标</p>
          <h1 class="home-title">{{ PRODUCT.name }}</h1>
          <p class="home-lead">
            网页驱动 · 精密调校。请在 2.4G 或 USB 有线模式下连接 RapidSync 接收器。
          </p>
        </div>
        <div class="home-hero-visual">
          <MouseShowcase size="lg" />
        </div>
      </section>

      <section class="home-block">
        <h2 class="section-label">规格</h2>
        <dl class="spec-matrix">
          <div v-for="s in specs" :key="s.label" class="spec-cell">
            <dt>{{ s.label }}</dt>
            <dd>{{ s.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="home-block home-connect-block">
        <h2 class="section-label">连接</h2>
        <p class="connect-hint">
          插入接收器或 USB 线 → 点击按钮 → 在弹窗中选择 <strong>RapidSync</strong> → 晃动唤醒鼠标。
        </p>
        <div class="connect-actions">
          <button
            type="button"
            class="btn-enter btn-enter-primary"
            :disabled="busy"
            @click="onEnterDriver"
          >
            {{ busy ? phase || "打开中…" : "直接打开驱动" }}
          </button>
          <button
            type="button"
            class="btn-connect"
            :disabled="busy"
            @click="onConnect"
          >
            {{ busy ? phase || "连接中…" : "首次连接（选 RapidSync）" }}
          </button>
        </div>
        <p class="connect-meta">Web HID · 弹窗请选择 RapidSync · 页脚版本 {{ BUILD_TAG }}</p>
        <p v-if="success" class="feedback success">{{ success }}</p>
        <p v-if="error" class="feedback error">
          {{ error }}
          <button type="button" class="feedback-retry" @click="onConnect">重试</button>
        </p>
      </section>

      <section class="home-block">
        <h2 class="section-label">功能模块</h2>
        <div class="module-row">
          <article v-for="m in modules" :key="m.title" class="module-item">
            <h3>{{ m.title }}</h3>
            <p>{{ m.desc }}</p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-main {
  padding: 1.25rem 0 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tx3);
  margin: 0 0 0.55rem;
}

.home-block {
  padding: 0.95rem 1rem;
  border: 1px solid var(--bd);
  border-radius: 12px;
  background: var(--bg);
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(200px, 0.9fr);
  gap: 1.25rem 1.5rem;
  align-items: center;
  padding: 1.1rem 1rem;
  border: 1px solid var(--bd);
  border-radius: 12px;
  background: var(--bg);
}

@media (max-width: 780px) {
  .home-hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .home-hero-visual {
    justify-self: center;
  }
}

.home-title {
  font-size: clamp(1.85rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin: 0 0 0.45rem;
  color: var(--tx);
}

.home-lead {
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--tx2);
  max-width: 26rem;
  margin: 0;
}

.home-hero-visual {
  padding: 0.75rem;
  border-radius: 10px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}

.spec-matrix {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0;
}

@media (max-width: 640px) {
  .spec-matrix {
    grid-template-columns: repeat(2, 1fr);
  }
}

.spec-cell {
  padding: 0.5rem 0.55rem;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}

.spec-cell dt {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tx3);
  margin-bottom: 0.15rem;
}

.spec-cell dd {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--tx);
  margin: 0;
}

.connect-hint {
  font-size: 0.8rem;
  color: var(--tx2);
  line-height: 1.5;
  margin: 0 0 0.75rem;
}

.connect-hint strong {
  color: var(--tx);
  font-weight: 600;
}

.connect-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-enter {
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--bd2);
  background: var(--bg);
  color: var(--tx);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-enter-primary {
  background: var(--tx);
  color: var(--bg);
  border-color: var(--tx);
}

.btn-enter:hover:not(:disabled) {
  border-color: var(--tx3);
}

.btn-enter-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-enter:disabled {
  opacity: 0.5;
}

.btn-connect {
  min-width: 9.5rem;
  padding: 0.65rem 1.35rem;
  border: none;
  border-radius: 8px;
  background: var(--tx);
  color: var(--bg);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}

.btn-connect:hover:not(:disabled) {
  opacity: 0.88;
}

.btn-connect:disabled {
  opacity: 0.55;
  cursor: wait;
}

.connect-meta {
  font-size: 0.68rem;
  color: var(--tx3);
  letter-spacing: 0.04em;
}

.feedback {
  margin: 0.65rem 0 0;
  font-size: 0.8rem;
  line-height: 1.45;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
}

.feedback.success {
  color: var(--tx);
  background: var(--bg2);
  border: 1px solid var(--bd);
}

.feedback.error {
  color: var(--rdx);
  background: var(--rdl);
  border: 1px solid var(--bd);
}

.feedback-retry {
  margin-left: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--tx);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}

.module-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

@media (max-width: 700px) {
  .module-row {
    grid-template-columns: 1fr;
  }
}

.module-item {
  padding: 0.55rem 0.6rem;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}

.module-item h3 {
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0 0 0.15rem;
  color: var(--tx);
}

.module-item p {
  font-size: 0.68rem;
  color: var(--tx3);
  margin: 0;
  line-height: 1.4;
}
</style>
