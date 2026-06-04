<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";

const router = useRouter();
const { connect, PRODUCT } = useDevice();
const busy = ref(false);
const error = ref("");

const features = [
  "8 DPI stages · 200 – 26,000 DPI",
  "RGB body + DPI indicator",
  "6 remappable buttons",
  "Macro editor",
  "4 on-device profiles",
  "4K wireless + long-range mode",
];

async function onConnect() {
  error.value = "";
  if (!navigator.hid) {
    error.value = "Web HID is not supported. Use Chrome 89+ or Edge 89+.";
    return;
  }
  busy.value = true;
  try {
    const ok = await connect();
    if (ok) router.push("/device");
    else error.value = "未找到设备：请插入 8K 接收器或 USB 线，在弹窗中选择 RapidSync，并换 USB 口重试。";
  } catch (e) {
    console.error(e);
    error.value = e?.message || "Connection failed.";
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <header class="hero">
    <div class="container hero-inner">
      <p class="badge">TeevoLink v2</p>
      <h1>Configure your {{ PRODUCT.name }}</h1>
      <p class="lead">
        A browser driver for Terra Pro — no install, no account. Plug in via USB or wireless
        receiver and customize in Chrome.
      </p>
      <ul class="feat-list">
        <li v-for="f in features" :key="f">{{ f }}</li>
      </ul>
      <p class="dongle-hint">
        无线请插入 <strong>8K 接收器</strong>（屏幕上可能显示 RapidSync）。弹窗里选中
        <strong>RapidSync</strong> 或 2.4G Receiver，再点「连接」。
      </p>
      <div class="actions">
        <button class="btn btn-primary" :disabled="busy" @click="onConnect">
          {{ busy ? "正在连接…" : "连接鼠标" }}
        </button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <section class="how card">
        <h2>How it works</h2>
        <ol>
          <li>Connect Terra Pro via USB or plug in the 2.4GHz receiver.</li>
          <li>Chrome asks to access the device — click <strong>Allow</strong>.</li>
          <li>TeevoLink reads settings from the mouse.</li>
          <li>Changes save to the device automatically.</li>
        </ol>
        <p class="note">Requires Chrome 89+ or Edge 89+. Firefox and Safari are not supported.</p>
      </section>
    </div>
  </header>
</template>

<style scoped>
.hero {
  padding: 3rem 0 4rem;
}
.hero-inner {
  max-width: 640px;
}
.lead {
  color: var(--tx2);
  margin: 1rem 0 1.5rem;
  line-height: 1.55;
}
.feat-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  color: var(--tx2);
}
.feat-list li {
  padding: 0.25rem 0;
}
.feat-list li::before {
  content: "✓ ";
  color: var(--ac);
  font-weight: 700;
}
.dongle-hint {
  font-size: 0.9rem;
  color: var(--tx2);
  margin-bottom: 1rem;
  line-height: 1.5;
}
.actions {
  margin-bottom: 1rem;
}
.error {
  color: var(--rdx);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.how {
  margin-top: 2rem;
}
.how h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.how ol {
  padding-left: 1.25rem;
  color: var(--tx2);
  line-height: 1.6;
}
.note {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--tx3);
}
</style>
