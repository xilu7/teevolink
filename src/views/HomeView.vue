<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { useTheme } from "@/composables/useTheme.js";
import { PRODUCT } from "@/config/terra-pro.js";

const router = useRouter();
const { connect } = useDevice();
const { isDark, toggleTheme } = useTheme();
const busy = ref(false);
const error = ref("");

const modules = [
  {
    title: "性能调校",
    desc: "DPI 与回报率优先，进阶含 LOD、移动同步",
  },
  {
    title: "按键",
    desc: "改键一目了然，组合键与宏按需展开",
  },
  {
    title: "配置与灯效",
    desc: "多场景板载配置，灯效为可选视觉项",
  },
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
      error.value = "未找到设备：请插入接收器或 USB，在弹窗选择 RapidSync。";
    }
  } catch (e) {
    error.value = e?.message || "连接失败";
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="home-page">
    <header class="driver-topbar">
      <div class="container driver-topbar-inner">
        <div class="driver-topbar-left">
          <span class="brand-mark">T</span>
          <span class="driver-pill active">TeevoLink</span>
        </div>
        <button type="button" class="theme-btn" @click="toggleTheme">{{ isDark ? "☀" : "☾" }}</button>
      </div>
    </header>

    <section class="home-wrap container">
      <div class="hero-card">
        <p class="home-brand">TEEVOLUTION</p>
        <h1 class="page-title home-title">{{ PRODUCT.name }} 驱动</h1>
        <p class="home-lead">
          三个模块、循序渐进：先调好 DPI 与回报率即可上手，再按需改键与切换场景配置。
        </p>

        <div class="module-cards">
          <div v-for="m in modules" :key="m.title" class="module-card">
            <strong>{{ m.title }}</strong>
            <span>{{ m.desc }}</span>
          </div>
        </div>

        <p class="dongle-hint">
          无线请插入 8K 接收器（RapidSync），USB 有线亦可。连接后即可在网页调参，无需安装。
        </p>

        <button type="button" class="btn btn-primary home-connect-btn" :disabled="busy" @click="onConnect">
          {{ busy ? "正在连接…" : "连接设备" }}
        </button>
        <p v-if="error" class="home-error">{{ error }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-wrap {
  padding: 2rem 0 4rem;
}
.home-title {
  margin: 0.35rem 0 0.75rem;
}
.home-lead {
  color: var(--tx2);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  max-width: 520px;
}
.home-brand {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--acd);
}
.module-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}
@media (max-width: 700px) {
  .module-cards {
    grid-template-columns: 1fr;
  }
}
.module-card {
  padding: 0.85rem;
  border: 1px solid var(--bd);
  border-radius: var(--r);
  background: var(--bg2);
  font-size: 0.8rem;
  color: var(--tx2);
  line-height: 1.45;
}
.module-card strong {
  display: block;
  color: var(--tx);
  font-size: 0.88rem;
  margin-bottom: 0.25rem;
}
.dongle-hint {
  font-size: 0.88rem;
  color: var(--tx2);
  margin-bottom: 1rem;
  line-height: 1.5;
}
.home-connect-btn {
  padding: 0.8rem 1.75rem;
}
.home-error {
  color: var(--rdx);
  font-size: 0.88rem;
  margin-top: 0.65rem;
}
</style>
