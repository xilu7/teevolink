<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { useTheme } from "@/composables/useTheme.js";
import { useSettingFeedback } from "@/composables/useSettingFeedback.js";
import PerformanceTab from "@/components/tabs/PerformanceTab.vue";
import ButtonsTab from "@/components/tabs/ButtonsTab.vue";
import DeviceTab from "@/components/tabs/DeviceTab.vue";

const router = useRouter();
const { HID, connected, online, battery, isWired, deviceInfo, mouseCfg, disconnect, refresh, PRODUCT } =
  useDevice();
const { isDark, toggleTheme } = useTheme();
const { feedback, notify } = useSettingFeedback();

const tab = ref("performance");
const refreshing = ref(false);

const tabs = [
  { id: "performance", label: "性能调校", hint: "DPI · 回报率" },
  { id: "buttons", label: "按键", hint: "改键 · 宏" },
  { id: "device", label: "配置与灯效", hint: "场景 · 灯光" },
];

const profileLabel = computed(() => (deviceInfo.profile ?? 0) + 1);

const connectionText = computed(() => {
  if (!connected.value) return "未连接";
  if (!online.value) return "离线";
  return isWired.value ? "有线" : "无线";
});

const statusLine = computed(() => {
  const i = Math.max(0, (mouseCfg.value.currentDpi || 1) - 1);
  const dpi = mouseCfg.value.dpis?.[i]?.value ?? "—";
  const bat =
    battery.value?.level != null ? `${battery.value.level}%` : "";
  const parts = [
    PRODUCT.name,
    connectionText.value,
    bat,
    `${dpi} DPI`,
    `${mouseCfg.value.reportRate} Hz`,
    `配置${profileLabel.value}`,
  ].filter(Boolean);
  return parts.join(" · ");
});

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
    notify("已从设备同步最新设置");
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
        </div>
        <div class="driver-topbar-right">
          <span class="sync">
            <span class="sd" :class="connected && online ? '' : connected ? 'w' : 'e'" />
            {{ connectionText }}
          </span>
          <button type="button" class="theme-btn" title="主题" @click="toggleTheme">
            {{ isDark ? "☀" : "☾" }}
          </button>
          <button type="button" class="theme-btn" title="断开" @click="onDisconnect">⏻</button>
        </div>
      </div>
    </header>

    <div class="container status-strip">
      <p class="status-line">{{ statusLine }}</p>
      <button
        type="button"
        class="btn btn-secondary btn-sm"
        :disabled="refreshing"
        @click="onRefresh"
      >
        {{ refreshing ? "同步中…" : "同步设备" }}
      </button>
    </div>

    <main class="container driver-main">
      <p class="tab-intro">
        {{ tabs.find((t) => t.id === tab)?.hint }}
      </p>

      <div class="driver-panel-wrap">
        <PerformanceTab v-if="tab === 'performance'" />
        <ButtonsTab v-else-if="tab === 'buttons'" />
        <DeviceTab v-else-if="tab === 'device'" />
      </div>
    </main>

    <nav class="driver-dock dock-three" aria-label="主功能">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="driver-dock-item"
        :class="{ active: tab === t.id }"
        @click="tab = t.id"
      >
        <span class="dock-label">{{ t.label }}</span>
        <span class="dock-hint">{{ t.hint }}</span>
      </button>
    </nav>

    <Transition name="toast">
      <div v-if="feedback" class="feedback-toast" role="status">{{ feedback }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.status-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.65rem 0 0.25rem;
}
.status-line {
  font-size: 0.8rem;
  color: var(--tx2);
  flex: 1;
  min-width: 200px;
}
.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
}
.tab-intro {
  font-size: 0.85rem;
  color: var(--tx3);
  margin-bottom: 0.85rem;
}
.dock-hint {
  display: block;
  font-size: 0.62rem;
  font-weight: 500;
  opacity: 0.85;
  margin-top: 0.1rem;
}
.dock-label {
  font-size: 0.78rem;
}
.driver-dock-item.active .dock-hint {
  opacity: 0.95;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
