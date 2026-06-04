<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { useTheme } from "@/composables/useTheme.js";
import { PRODUCT, CONNECT_GUIDE } from "@/config/terra-pro.js";
import BrandLogo from "@/components/brand/BrandLogo.vue";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";

const router = useRouter();
const { connect } = useDevice();
const { isDark, toggleTheme } = useTheme();
const busy = ref(false);
const error = ref("");

const specs = [
  { label: "传感器", value: PRODUCT.sensorModel },
  { label: "主控", value: PRODUCT.mcu },
  { label: "DPI 范围", value: `${PRODUCT.dpiMin} – ${PRODUCT.dpiMax}` },
  { label: "推荐档位", value: PRODUCT.defaultDpiPresets.join(" / ") },
  { label: "按键", value: `${PRODUCT.buttons} 键（含 DPI）` },
  { label: "连接", value: "蓝牙 · 2.4G · USB 有线" },
];

async function onConnect() {
  error.value = "";
  if (!navigator.hid) {
    error.value = "请使用 Chrome 89+ 或 Edge 89+。";
    return;
  }
  busy.value = true;
  try {
    const ok = await connect();
    if (ok) router.push("/device");
    else {
      error.value =
        "未找到设备：请 2.4G + RapidSync 或 USB 有线，弹窗选接收器并唤醒鼠标。";
    }
  } catch (e) {
    error.value = e?.message || "连接失败";
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="home-page driver-shell home-premium">
    <header class="driver-topbar driver-topbar-premium">
      <div class="container driver-topbar-inner">
        <div class="driver-topbar-left brand-slot">
          <BrandLogo size="lg" />
          <span class="driver-pill active">TeevoLink</span>
        </div>
        <button type="button" class="theme-btn driver-icon-btn" @click="toggleTheme">
          {{ isDark ? "☀" : "☾" }}
        </button>
      </div>
    </header>

    <section class="container home-hero-grid">
      <div class="home-copy">
        <p class="home-eyebrow">{{ PRODUCT.brand.toUpperCase() }}</p>
        <h1 class="home-product-title">{{ PRODUCT.name }}</h1>
        <p class="home-product-sub">
          网页驱动 · 紧凑调校 DPI、LOD、回报率与场景配置。三模鼠标请优先 2.4G 或有线连接。
        </p>

        <dl class="home-spec-grid">
          <div v-for="s in specs" :key="s.label" class="home-spec-item">
            <dt>{{ s.label }}</dt>
            <dd>{{ s.value }}</dd>
          </div>
        </dl>

        <ul class="home-connect-guide">
          <li v-for="(line, i) in CONNECT_GUIDE" :key="i">{{ line }}</li>
        </ul>

        <div class="home-cta-row">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="busy"
            @click="onConnect"
          >
            {{ busy ? "正在连接…" : "连接设备" }}
          </button>
          <span class="cta-note">无需安装 · Web HID</span>
        </div>
        <p v-if="error" class="home-error">{{ error }}</p>
      </div>

      <div class="home-visual">
        <MouseShowcase size="lg" :show-labels="true" />
      </div>
    </section>

    <section class="container home-modules">
      <div class="home-module">
        <strong>性能调校</strong>
        场景 · DPI · LOD · 回报率
      </div>
      <div class="home-module">
        <strong>按键</strong>
        6 键改键 · 组合键与宏
      </div>
      <div class="home-module">
        <strong>灯效与设备</strong>
        RGB · 休眠 · 恢复出厂
      </div>
    </section>
  </div>
</template>

<style scoped>
.cta-note {
  font-size: 0.72rem;
  color: var(--tx3);
}
.home-error {
  color: var(--rdx);
  font-size: 0.82rem;
  margin-top: 0.55rem;
}
</style>
