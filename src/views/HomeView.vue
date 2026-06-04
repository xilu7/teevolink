<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { syncDpiSensorFromFlash } from "@/composables/useSensorCatalog.js";
import DriverAppTopbar from "@/components/layout/DriverAppTopbar.vue";
import HomeDeviceCard from "@/components/home/HomeDeviceCard.vue";
import HomeWelcome from "@/components/home/HomeWelcome.vue";
import HomeConnectGuide from "@/components/home/HomeConnectGuide.vue";

const router = useRouter();
const {
  connect,
  syncDevice,
  deviceOpen,
  isReady,
  disconnect,
} = useDevice();

const busy = ref(false);
const statusMsg = ref("");
const error = ref("");
const success = ref("");

onMounted(async () => {
  if (deviceOpen.value && isReady.value) {
    try {
      await syncDpiSensorFromFlash();
    } catch (e) {
      console.warn("home syncDpi", e);
    }
  }
});

async function onDisconnect() {
  if (busy.value) return;
  await disconnect();
}

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
    <DriverAppTopbar
      logo-size="lg"
      active-nav="home"
      :show-connect="!deviceOpen"
      :disconnect-busy="busy"
      @connect="runConnect"
      @disconnect="onDisconnect"
    />

    <main class="container home-main">
      <p v-if="busy && statusMsg" class="home-status">{{ statusMsg }}</p>

      <HomeDeviceCard
        :busy="busy"
        @connect="runConnect"
        @open-settings="openSettings"
        @refresh="runConnect"
      />

      <template v-if="!deviceOpen">
        <HomeWelcome />
        <HomeConnectGuide />
      </template>

      <p v-if="success" class="feedback success">{{ success }}</p>
      <p v-if="error" class="feedback error">
        {{ error }}
        <button type="button" class="feedback-retry" @click="runConnect">
          重试
        </button>
      </p>
    </main>
  </div>
</template>

<style scoped>
.home-status {
  font-size: 0.88rem;
  color: var(--tx2);
  margin: 0;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}
.feedback {
  font-size: 0.85rem;
  padding: 0.5rem 0.65rem;
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
