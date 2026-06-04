<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { useTheme } from "@/composables/useTheme.js";
import DpiPanel from "@/components/DpiPanel.vue";
import KeyMappingPanel from "@/components/KeyMappingPanel.vue";
import PerformancePanel from "@/components/PerformancePanel.vue";
import ParametersPanel from "@/components/ParametersPanel.vue";
import MouseSettingsPanel from "@/components/MouseSettingsPanel.vue";

const router = useRouter();
const { HID, connected, online, battery, isWired, deviceInfo, mouseCfg, disconnect, refresh, PRODUCT } =
  useDevice();
const { isDark, toggleTheme } = useTheme();

const tab = ref("dpi");
const refreshing = ref(false);

const tabs = [
  { id: "dpi", label: "DPI 设置" },
  { id: "keys", label: "改键" },
  { id: "performance", label: "性能" },
  { id: "params", label: "参数" },
  { id: "settings", label: "鼠标设置" },
];

const profileLabel = computed(() => `配置 ${(deviceInfo.profile ?? 0) + 1}`);

const connectionText = computed(() => {
  if (!connected.value) return "未连接";
  if (!online.value) return "离线";
  return isWired.value ? "有线" : "无线";
});

const batteryText = computed(() => {
  if (battery.value?.level == null) return "—";
  const pct = battery.value.level;
  const chg = battery.value.charging ? " · 充电中" : "";
  return `${pct}%${chg}`;
});

const currentDpiValue = computed(() => {
  const i = Math.max(0, (mouseCfg.value.currentDpi || 1) - 1);
  return mouseCfg.value.dpis?.[i]?.value ?? "—";
});

const showCompactHero = computed(() => tab.value !== "keys");

onMounted(async () => {
  if (!HID.deviceInfo.deviceOpen) {
    router.replace("/");
  }
});

function goHome() {
  router.push("/");
}

async function onDisconnect() {
  await disconnect();
  router.push("/");
}

async function onRefresh() {
  refreshing.value = true;
  try {
    await refresh();
  } finally {
    refreshing.value = false;
  }
}
</script>

<template>
  <div class="driver-page">
    <header class="driver-topbar">
      <div class="container driver-topbar-inner">
        <div class="driver-topbar-left">
          <span class="brand-mark">T</span>
          <button type="button" class="driver-pill" @click="goHome">主页</button>
          <button type="button" class="driver-pill profile active" disabled>
            我的配置：{{ profileLabel }}
          </button>
        </div>
        <div class="driver-topbar-right">
          <span class="sync">
            <span
              class="sd"
              :class="connected && online ? '' : connected ? 'w' : 'e'"
            />
            {{ connectionText }}
            <span v-if="battery?.level != null"> · {{ batteryText }}</span>
          </span>
          <span class="driver-divider-v" />
          <button type="button" class="theme-btn" title="切换主题" @click="toggleTheme">
            {{ isDark ? "☀" : "☾" }}
          </button>
          <button type="button" class="theme-btn" title="断开连接" @click="onDisconnect">
            ⏻
          </button>
        </div>
      </div>
    </header>

    <section v-if="showCompactHero" class="driver-hero">
      <div class="container driver-hero-grid">
        <div class="driver-status-cards">
          <div class="driver-stat">
            <div class="driver-stat-label">连接</div>
            <div class="driver-stat-value">{{ connectionText }}</div>
          </div>
          <div class="driver-stat">
            <div class="driver-stat-label">电量</div>
            <div class="driver-stat-value accent">{{ batteryText }}</div>
          </div>
        </div>
        <div class="driver-device-viz">
          <img src="/device-mouse.svg" :alt="PRODUCT.name" width="180" height="234" />
          <div class="driver-device-name">{{ PRODUCT.name }}</div>
          <div class="driver-device-sub">{{ PRODUCT.brand }}</div>
        </div>
        <div class="driver-status-cards">
          <div class="driver-stat">
            <div class="driver-stat-label">DPI</div>
            <div class="driver-stat-value accent">
              第 {{ mouseCfg.currentDpi }} 档 · {{ currentDpiValue }}
            </div>
          </div>
          <div class="driver-stat">
            <div class="driver-stat-label">回报率</div>
            <div class="driver-stat-value">{{ mouseCfg.reportRate }} Hz</div>
          </div>
        </div>
      </div>
    </section>

    <main class="container driver-main">
      <div class="driver-toolbar">
        <h2 class="page-title">{{ tabs.find((t) => t.id === tab)?.label }}</h2>
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="refreshing"
          @click="onRefresh"
        >
          {{ refreshing ? "同步中…" : "从设备刷新" }}
        </button>
      </div>

      <div class="driver-panel-wrap">
        <DpiPanel v-if="tab === 'dpi'" />
        <KeyMappingPanel v-else-if="tab === 'keys'" />
        <PerformancePanel v-else-if="tab === 'performance'" />
        <ParametersPanel v-else-if="tab === 'params'" />
        <MouseSettingsPanel v-else-if="tab === 'settings'" />
      </div>
    </main>

    <nav class="driver-dock" aria-label="功能导航">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="driver-dock-item"
        :class="{ active: tab === t.id }"
        @click="tab = t.id"
      >
        {{ t.label }}
      </button>
    </nav>
  </div>
</template>
