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

const features = [
  { title: "DPI 设置", desc: "多档 DPI、XY 独立、指示灯颜色" },
  { title: "改键", desc: "常规按键、组合键、宏绑定" },
  { title: "性能", desc: "回报率、传感器模式、远距离" },
  { title: "参数", desc: "LOD、去抖、移动同步与角度" },
  { title: "鼠标设置", desc: "配置方案、RGB、休眠与恢复出厂" },
];

async function onConnect() {
  error.value = "";
  if (!navigator.hid) {
    error.value = "当前浏览器不支持 Web HID，请使用 Chrome 89+ 或 Edge 89+。";
    return;
  }
  busy.value = true;
  try {
    const ok = await connect();
    if (ok) router.push("/device");
    else {
      error.value =
        "未找到设备：请插入 8K 接收器或 USB 线，在弹窗中选择 RapidSync，并换 USB 口重试。";
    }
  } catch (e) {
    console.error(e);
    error.value = e?.message || "连接失败，请重试。";
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
          <span class="driver-pill active">主页</span>
          <span class="driver-pill profile" style="opacity: 0.65">连接后管理配置</span>
        </div>
        <div class="driver-topbar-right">
          <button type="button" class="theme-btn" title="切换主题" @click="toggleTheme">
            {{ isDark ? "☀" : "☾" }}
          </button>
        </div>
      </div>
    </header>

    <section class="home-hero home-wrap">
      <div class="container home-hero-grid">
        <div class="hero-card" style="margin-bottom: 0">
          <p class="home-brand">TEEVOLUTION · TEEVOLINK</p>
          <h1 class="home-title page-title">配置 {{ PRODUCT.name }}</h1>
          <p class="home-lead">
            浏览器端官方驱动，无需安装。参考专业外设驱动的信息架构，保留 Teevolution
            品牌体验——DPI、改键、性能、参数与设备设置一应俱全。
          </p>

          <div class="home-feature-grid">
            <div v-for="f in features" :key="f.title" class="home-feature-card">
              <strong>{{ f.title }}</strong>
              {{ f.desc }}
            </div>
          </div>

          <p class="dongle-hint">
            无线请插入 <strong>8K 接收器</strong>（可能显示为 RapidSync）。在弹窗中选中设备后点击「连接设备」。
          </p>

          <button
            type="button"
            class="btn btn-primary home-connect-btn"
            :disabled="busy"
            @click="onConnect"
          >
            {{ busy ? "正在连接…" : "连接设备" }}
          </button>
          <p v-if="error" class="home-error">{{ error }}</p>

          <section class="home-steps">
            <h2 class="page-title" style="font-size: 1rem">使用步骤</h2>
            <ol>
              <li>USB 连接鼠标，或插入 2.4GHz 接收器。</li>
              <li>允许浏览器访问 HID 设备。</li>
              <li>使用底部导航切换 DPI、改键、性能等功能模块。</li>
              <li>设置自动保存至鼠标板载存储。</li>
            </ol>
            <p class="home-note">需 Chrome 89+ 或 Edge 89+。</p>
          </section>
        </div>

        <div class="home-viz-card">
          <img src="/device-mouse.svg" :alt="PRODUCT.name" />
          <p class="driver-device-name">{{ PRODUCT.name }}</p>
          <p class="driver-device-sub">{{ PRODUCT.brand }} · PAW3950</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dongle-hint {
  font-size: 0.9rem;
  color: var(--tx2);
  margin-bottom: 1.25rem;
  line-height: 1.55;
}
</style>
