<script setup>
import { ref, computed, provide, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { useSettingFeedback } from "@/composables/useSettingFeedback.js";
import PerformanceTab from "@/components/tabs/PerformanceTab.vue";
import ButtonsTab from "@/components/tabs/ButtonsTab.vue";
import DeviceTab from "@/components/tabs/DeviceTab.vue";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import { getDpiStageIndex } from "@/composables/useDpiStageIndex.js";

const router = useRouter();
const {
  HID,
  connected,
  connecting,
  deviceOpen,
  isReady,
  isAwaitingMouse,
  online,
  battery,
  isWired,
  dongleTypeLabel,
  connectStateLabel,
  deviceInfo,
  mouseCfg,
  disconnect,
  refresh,
  syncDevice,
  recoverStuckSession,
  bootDevicePage,
  waitForMouseReady,
  checkMouseOnline,
  startHidSession,
  enterPairMode,
  openAuthorizedSession,
  PRODUCT,
} = useDevice();
const { feedback, notify } = useSettingFeedback();

const tab = ref("performance");
const refreshing = ref(false);
const booting = ref(true);
const showConnectBanner = ref(false);
const wasReadyOnce = ref(false);
const pollSeconds = ref(0);
let autoPollTimer = null;
let connectingWatchStart = 0;
let syncWarned = false;

const tabs = [
  { id: "performance", label: "性能调校", hint: "场景 · DPI · LOD · 回报率" },
  { id: "buttons", label: "按键", hint: "改键 · 组合键 · 宏" },
  { id: "device", label: "灯效与设备", hint: "RGB · 休眠 · 恢复出厂" },
];

const profileLabel = computed(() => (deviceInfo.profile ?? 0) + 1);

const connectionText = computed(() => {
  if (!deviceOpen.value) return "未授权 · 请回首页连接";
  if (isReady.value) return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
  if (connecting.value) return "同步中 · 请勿频繁点击";
  if (online.value) return "鼠标在线 · 自动同步中";
  return "接收器已授权 · 等待鼠标";
});

const statusDotClass = computed(() => {
  if (isReady.value) return "";
  if (connecting.value || online.value) return "w";
  return "e";
});

const statusLine = computed(() => {
  const i = getDpiStageIndex(mouseCfg.value);
  const dpi = mouseCfg.value.dpis?.[i]?.value ?? "—";
  const bat = battery.value?.level != null ? `${battery.value.level}%` : "";
  const parts = [
    PRODUCT.name,
    dongleTypeLabel.value,
    connectionText.value,
    bat,
    isReady.value ? `${dpi} DPI` : null,
    isReady.value ? `${mouseCfg.value.reportRate} Hz` : null,
    isReady.value ? `配置${profileLabel.value}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
});

const deviceStatusDetail = computed(() => {
  const i = getDpiStageIndex(mouseCfg.value);
  const dpi = mouseCfg.value.dpis?.[i]?.value;
  return {
    name: PRODUCT.name,
    receiver: dongleTypeLabel.value,
    link: connectionText.value,
    battery: battery.value?.level != null ? `${battery.value.level}%` : null,
    dpi: isReady.value && dpi != null ? dpi : null,
    hz: isReady.value ? mouseCfg.value.reportRate : null,
    profile: profileLabel.value,
    dpiLayout: HID.deviceInfo.mouseCfg.sensor.dpiEepromKind || HID.detectDpiEepromType?.() || "",
    ready: isReady.value,
  };
});

provide("deviceStatus", {
  detail: deviceStatusDetail,
  booting,
  refreshing,
});

let bannerDebounceTimer;
watch(isReady, (ready) => {
  if (ready) {
    wasReadyOnce.value = true;
    showConnectBanner.value = false;
    clearTimeout(bannerDebounceTimer);
    return;
  }
  clearTimeout(bannerDebounceTimer);
  bannerDebounceTimer = setTimeout(() => {
    if (!isReady.value && !booting.value) showConnectBanner.value = true;
  }, 2800);
});

watch(connecting, (v) => {
  if (v) connectingWatchStart = Date.now();
});

function startAutoPoll() {
  stopAutoPoll();
  autoPollTimer = setInterval(async () => {
    if (isReady.value) {
      stopAutoPoll();
      return;
    }
    pollSeconds.value += 2;

    if (connecting.value && Date.now() - connectingWatchStart > 12000 && !syncWarned) {
      syncWarned = true;
      notify("同步卡住，正在自动重置连接…");
      await recoverStuckSession();
      await syncDevice(15);
      return;
    }

    if (!isReady.value && deviceOpen.value && !refreshing.value && !connecting.value) {
      refreshing.value = true;
      try {
        if (wasReadyOnce.value) {
          const on = await checkMouseOnline();
          if (on) await waitForMouseReady(8);
        } else {
          await syncDevice(12);
        }
      } finally {
        refreshing.value = false;
      }
    }
  }, 2000);
}

function stopAutoPoll() {
  if (autoPollTimer) {
    clearInterval(autoPollTimer);
    autoPollTimer = null;
  }
}

onMounted(async () => {
  if (!HID.deviceInfo.deviceOpen) {
    await openAuthorizedSession();
  }
  if (!HID.deviceInfo.deviceOpen) {
    router.replace("/");
    return;
  }
  booting.value = true;
  pollSeconds.value = 0;
  const bootTimer = setTimeout(() => {
    booting.value = false;
  }, 8000);
  const ok = await bootDevicePage();
  clearTimeout(bootTimer);
  booting.value = false;
  if (ok) {
    notify("鼠标已连接，可以修改设置");
    stopAutoPoll();
  } else {
    notify("接收器已就绪，请唤醒鼠标（见下方步骤）");
    startAutoPoll();
  }
});

onUnmounted(() => stopAutoPoll());

async function onDisconnect() {
  stopAutoPoll();
  await disconnect();
  router.push("/");
}

async function onRefresh() {
  if (refreshing.value) {
    notify("请勿连点，约 20 秒内完成");
    return;
  }
  refreshing.value = true;
  pollSeconds.value = 0;
  syncWarned = false;
  connectingWatchStart = Date.now();
  notify("开始连接，请稍候…");
  const guard = setTimeout(() => {
    if (refreshing.value) {
      notify("超过 25 秒，请拔插接收器后重试");
    }
  }, 25000);
  try {
    const ok = await syncDevice(20);
    if (ok) {
      notify("已连接，现在可以改 DPI");
      stopAutoPoll();
    } else if (online.value) {
      notify("鼠标在线但同步失败：点「重置连接」或拔插 USB");
      startAutoPoll();
    } else {
      notify("鼠标未上线：2.4G 档 + 打开电源 + 晃动鼠标");
      startAutoPoll();
    }
  } catch (e) {
    notify(e?.message || "连接异常");
    startAutoPoll();
  } finally {
    clearTimeout(guard);
    refreshing.value = false;
  }
}

async function onForceReset() {
  refreshing.value = true;
  try {
    await recoverStuckSession();
    const ok = await syncDevice(18);
    notify(ok ? "重置成功，已连接" : "重置后仍未连接，请检查 2.4G 与对码");
  } finally {
    refreshing.value = false;
  }
}

async function onPair() {
  const ok = await enterPairMode();
  notify(ok ? "已进入对码模式，请同时操作鼠标侧对码键" : "对码指令发送失败");
}
</script>

<template>
  <div class="driver-page driver-shell">
    <AppTopbar logo-size="sm">
      <template #meta>
        <span class="driver-ver">2026-06-04-u</span>
      </template>
      <template #status>
        <span class="sync-pill">
          <span class="sd" :class="statusDotClass" />
          {{ connectionText }}
        </span>
      </template>
      <template #actions>
        <button type="button" class="topbar-icon" title="断开连接" @click="onDisconnect">⏻</button>
      </template>
    </AppTopbar>

    <div v-if="showConnectBanner && !booting" class="container">
      <div class="connect-banner">
        <strong>接收器已连接，鼠标尚未上线</strong>
        <p>网页只能改<strong>已经唤醒并连上接收器</strong>的鼠标。仅插接收器、鼠标休眠时，界面是预览，改了也不会生效。</p>
        <ol class="steps">
          <li>
            <strong>三模说明：</strong>Terra Pro 支持蓝牙 / 2.4G / USB 有线。网页调参请把底部开关拨到
            <strong>2.4G</strong> 并插 RapidSync 接收器，或用 <strong>USB 线直连</strong>；蓝牙模式下浏览器通常无法写入参数。
          </li>
          <li><strong>无线 2.4G：</strong>打开电源 → 晃动或按左/右/中/DPI 键唤醒 → 等 5～10 秒，页面会自动同步。</li>
          <li><strong>仍无效：</strong>靠近橙色接收器；接收器屏若显示断连图标，可点「进入对码」后按接收器顶部键与鼠标底部小键配对。</li>
          <li><strong>有线：</strong>数据线连电脑后一般会自动显示「已连接 · 有线」。</li>
        </ol>
        <p class="diag">
          检测：{{ dongleTypeLabel }} · 在线信号 {{ online ? "有" : "无" }} · SDK状态
          {{ connectStateLabel }}
          <span v-if="pollSeconds"> · 已等待 {{ pollSeconds }} 秒</span>
        </p>
        <p v-if="!deviceOpen" class="diag diag-warn">
          浏览器未授权：请回首页点「首次连接」，弹窗中必须选择 <strong>RapidSync</strong> 并点允许。
        </p>
        <div class="banner-actions">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="refreshing"
            @click="onRefresh"
          >
            {{ refreshing ? "正在连接…" : "立即连接鼠标" }}
          </button>
          <button
            v-if="connecting"
            type="button"
            class="btn btn-secondary"
            :disabled="refreshing"
            @click="onForceReset"
          >
            重置连接
          </button>
          <button type="button" class="btn btn-secondary" @click="onPair">进入对码</button>
        </div>
      </div>
    </div>

    <main class="container driver-main">
      <p class="tab-intro-compact">{{ tabs.find((t) => t.id === tab)?.hint }}</p>
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
.sync-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--tx2);
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  max-width: min(280px, 42vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
}
.connect-banner {
  margin-bottom: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: var(--rl);
  background: var(--bg2);
  border: 1px solid var(--bd);
  font-size: 0.85rem;
  color: var(--tx2);
  line-height: 1.55;
}
.connect-banner strong {
  display: block;
  color: var(--tx);
  margin-bottom: 0.35rem;
  font-size: 0.95rem;
}
.steps {
  margin: 0.65rem 0 0.65rem 1.1rem;
  padding: 0;
}
.steps li {
  margin-bottom: 0.35rem;
}
.diag {
  font-size: 0.78rem;
  color: var(--tx3);
  margin: 0.5rem 0;
}
.diag-warn {
  color: var(--amx);
  font-weight: 600;
}
.banner-actions {
  margin-top: 0.5rem;
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
