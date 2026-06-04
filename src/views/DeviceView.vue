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
const {
  HID,
  connected,
  connecting,
  deviceOpen,
  isReady,
  isAwaitingMouse,
  battery,
  isWired,
  deviceInfo,
  mouseCfg,
  disconnect,
  refresh,
  bootDevicePage,
  PRODUCT,
} = useDevice();
const { isDark, toggleTheme } = useTheme();
const { feedback, notify } = useSettingFeedback();

const tab = ref("performance");
const refreshing = ref(false);
const booting = ref(true);

const tabs = [
  { id: "performance", label: "性能调校", hint: "DPI · 回报率" },
  { id: "buttons", label: "按键", hint: "改键 · 宏" },
  { id: "device", label: "配置与灯效", hint: "场景 · 灯光" },
];

const profileLabel = computed(() => (deviceInfo.profile ?? 0) + 1);

const connectionText = computed(() => {
  if (!deviceOpen.value) return "未授权";
  if (connecting.value) return "同步中…";
  if (isReady.value) return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
  if (isAwaitingMouse.value) return "等待鼠标上线";
  return "未连接";
});

const statusDotClass = computed(() => {
  if (isReady.value) return "";
  if (connecting.value || isAwaitingMouse.value) return "w";
  return "e";
});

const statusLine = computed(() => {
  if (!isReady.value) return connectionText.value;
  const i = Math.max(0, (mouseCfg.value.currentDpi || 1) - 1);
  const dpi = mouseCfg.value.dpis?.[i]?.value ?? "—";
  const bat = battery.value?.level != null ? `${battery.value.level}%` : "";
  return [PRODUCT.name, connectionText.value, bat, `${dpi} DPI`, `${mouseCfg.value.reportRate} Hz`, `配置${profileLabel.value}`]
    .filter(Boolean)
    .join(" · ");
});

onMounted(async () => {
  if (!HID.deviceInfo.deviceOpen) {
    router.replace("/");
    return;
  }
  booting.value = true;
  const ok = await bootDevicePage();
  booting.value = false;
  if (!ok) {
    notify("接收器已识别，请晃动鼠标唤醒后点「同步设备」");
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
    const ok = await refresh();
    notify(ok ? "已与鼠标同步" : "同步失败：请晃动鼠标或重新插拔接收器");
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
            <span class="sd" :class="statusDotClass" />
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
      <p class="status-line">{{ booting ? "正在连接鼠标…" : statusLine }}</p>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        :disabled="refreshing || booting"
        @click="onRefresh"
      >
        {{ refreshing ? "同步中…" : "同步设备" }}
      </button>
    </div>

    <div v-if="!booting && !isReady" class="container">
      <div class="connect-banner">
        <strong>接收器已连接，鼠标尚未上线</strong>
        <p>
          无线模式下请：<strong>晃动鼠标</strong>或按任意键唤醒 → 再点右上角「同步设备」。有线模式请确认 USB 已插紧。
        </p>
      </div>
    </div>

    <main class="container driver-main">
      <p class="tab-intro">{{ tabs.find((t) => t.id === tab)?.hint }}</p>

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
.connect-banner {
  margin-bottom: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: var(--rl);
  background: var(--aml);
  border: 1px solid var(--bd);
  font-size: 0.85rem;
  color: var(--tx2);
  line-height: 1.55;
}
.connect-banner strong {
  display: block;
  color: var(--amx);
  margin-bottom: 0.35rem;
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
