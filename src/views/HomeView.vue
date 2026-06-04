<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { syncDpiSensorFromFlash } from "@/composables/useSensorCatalog.js";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import HomeDeviceCard from "@/components/home/HomeDeviceCard.vue";
import HomeSupportNotice from "@/components/home/HomeSupportNotice.vue";
import HomeConnectGuide from "@/components/home/HomeConnectGuide.vue";
import IconUnplug from "@/components/icons/IconUnplug.vue";

const router = useRouter();
const {
  connect,
  syncDevice,
  deviceOpen,
  isReady,
  online,
  connecting,
  isWired,
  disconnect,
} = useDevice();

const busy = ref(false);
const statusMsg = ref("");
const error = ref("");
const success = ref("");

const BUILD_TAG = "2026-06-05-a";

const homeStatusText = computed(() => {
  if (!deviceOpen.value) return "";
  if (isReady.value) return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
  if (connecting.value) return "同步中";
  if (online.value) return "鼠标在线";
  return "接收器已就绪";
});

async function onDisconnect() {
  if (busy.value) return;
  await disconnect();
}

onMounted(async () => {
  if (deviceOpen.value && isReady.value) {
    try {
      await syncDpiSensorFromFlash();
    } catch (e) {
      console.warn("home syncDpi", e);
    }
  }
});

async function runConnect() {
  if (busy.value) return;
  error.value = "";
  success.value = "";
  if (!navigator.hid) {
    error.value = "请使用 Chrome 或 Edge 打开本页。";
    return;
  }

  busy.value = true;
  statusMsg.value = "正在连接，首次可能需 30～60 秒，请勿关闭页面…";
  try {
    let ready = false;
    let message = "";

    if (deviceOpen.value) {
      ready = await syncDevice();
      message = ready
        ? "已连接"
        : "接收器已打开。请 2.4G 唤醒鼠标后再点一次";
    } else {
      const result = await connect();
      if (result.status === "cancelled") {
        error.value = result.message;
        return;
      }
      if (result.status === "failed") {
        error.value = result.message;
        return;
      }
      ready = result.ready;
      message = result.message;
    }

    if (ready) {
      success.value = message || "已连接";
      setTimeout(() => router.push("/device"), 500);
    } else {
      success.value = message;
    }
  } catch (e) {
    error.value = e?.message || "连接失败";
  } finally {
    busy.value = false;
    statusMsg.value = "";
  }
}

function openSettings() {
  router.push("/device");
}
</script>

<template>
  <div class="home-page driver-shell">
    <AppTopbar logo-size="lg">
      <template #nav>
        <span class="nav-active">首页</span>
      </template>
      <template #meta>
        <span class="driver-ver">驱动 {{ BUILD_TAG }}</span>
      </template>
      <template v-if="deviceOpen" #status>
        <span class="topbar-pill">
          <span class="sd" :class="isReady ? '' : online ? 'w' : 'e'" />
          {{ homeStatusText }}
        </span>
      </template>
      <template v-if="deviceOpen" #actions>
        <button
          type="button"
          class="topbar-icon-btn danger"
          title="断开连接"
          aria-label="断开连接"
          :disabled="busy"
          @click="onDisconnect"
        >
          <IconUnplug />
        </button>
      </template>
    </AppTopbar>

    <main class="container home-main">
      <p v-if="busy && statusMsg" class="home-status">{{ statusMsg }}</p>

      <HomeDeviceCard
        :busy="busy"
        @connect="runConnect"
        @open-settings="openSettings"
        @refresh="runConnect"
      />

      <HomeSupportNotice />

      <HomeConnectGuide v-if="!deviceOpen" />

      <section v-else-if="isReady" class="home-ready-tip">
        <p>已连接。点「打开驱动设置」调整 DPI、回报率、LOD 等。</p>
      </section>
      <section v-else class="home-ready-tip warn">
        <p>接收器已授权。请 2.4G 开机并晃动鼠标，再点「重新同步」。</p>
      </section>

      <p v-if="success" class="feedback success">{{ success }}</p>
      <p v-if="error" class="feedback error">
        {{ error }}
        <button type="button" class="feedback-retry" @click="runConnect">重试</button>
      </p>
    </main>
  </div>
</template>

<style scoped>
.home-main {
  padding: 1rem 0 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 960px;
}
.home-status {
  font-size: 0.92rem;
  color: var(--tx2);
  margin: 0;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}
.home-ready-tip {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--bg);
  font-size: 0.88rem;
  color: var(--acd);
  font-weight: 600;
  line-height: 1.5;
}
.home-ready-tip p {
  margin: 0;
}
.home-ready-tip.warn {
  color: var(--amx);
  font-weight: 600;
}
.feedback {
  font-size: 0.88rem;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  margin: 0;
}
.feedback.success {
  background: var(--gnl);
  border: 1px solid var(--bd);
}
.feedback.error {
  background: var(--rdl);
  color: var(--rdx);
  border: 1px solid var(--bd);
}
.feedback-retry {
  margin-left: 0.5rem;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}
</style>
