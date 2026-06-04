<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { PRODUCT, CONNECT_GUIDE } from "@/config/terra-pro.js";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import HomeDeviceCard from "@/components/home/HomeDeviceCard.vue";
import HomeConnectGuide from "@/components/home/HomeConnectGuide.vue";

const router = useRouter();
const { connect, autoConnectFromFactory, syncDevice, deviceOpen, isReady } = useDevice();

const busy = ref(false);
const booting = ref(true);
const phase = ref("");
const error = ref("");
const success = ref("");

const BUILD_TAG = "2026-06-04-h";

const showGuide = computed(() => !deviceOpen.value);

async function runConnect(firstTime) {
  error.value = "";
  success.value = "";
  if (!navigator.hid) {
    error.value = "请使用 Chrome 89+ 或 Edge 89+。";
    return;
  }

  busy.value = true;
  try {
    const result = firstTime
      ? await connect({ onPhase: (m) => (phase.value = m) })
      : await autoConnectFromFactory({ onPhase: (m) => (phase.value = m) });

    if (result.status === "cancelled") {
      error.value = result.message;
      return;
    }
    if (result.status === "failed") {
      error.value = result.message;
      return;
    }
    if (result.status === "need_request") {
      error.value = result.message;
      return;
    }

    success.value = result.message;
  } catch (e) {
    error.value = e?.message || "连接失败";
  } finally {
    busy.value = false;
    phase.value = "";
  }
}

function onPlusConnect() {
  runConnect(true);
}

async function onRefresh() {
  busy.value = true;
  phase.value = "同步中（约 20 秒）…";
  try {
    const ok = await syncDevice(20);
    success.value = ok ? "参数已更新" : "仍未上线，请 2.4G 唤醒鼠标";
  } finally {
    busy.value = false;
    phase.value = "";
  }
}

function openSettings() {
  router.push("/device");
}

onMounted(async () => {
  if (!navigator.hid) {
    booting.value = false;
    return;
  }
  booting.value = true;
  phase.value = "正在检查已授权设备…";
  try {
    const result = await autoConnectFromFactory({ quick: true });
    if (result.message && result.status !== "need_request") {
      success.value = result.message;
    }
  } catch (e) {
    console.warn("home auto connect", e);
  } finally {
    booting.value = false;
    phase.value = "";
  }
});
</script>

<template>
  <div class="home-page driver-shell">
    <AppTopbar logo-size="lg" show-connect @connect="onPlusConnect">
      <template #nav>
        <span class="nav-active">首页</span>
      </template>
      <template #meta>
        <span class="driver-ver">驱动 {{ BUILD_TAG }}</span>
      </template>
    </AppTopbar>

    <main class="container home-main">
      <p v-if="(booting || busy) && (phase || booting)" class="home-phase">
        {{ phase || "正在检查连接…" }}
      </p>

      <HomeDeviceCard
        :booting="booting || busy"
        @connect="onPlusConnect"
        @open-settings="openSettings"
        @refresh="onRefresh"
      />

      <HomeConnectGuide v-if="showGuide" />

      <section v-else class="home-tips">
        <p class="tips-title">已记住此浏览器授权</p>
        <ul>
          <li v-for="(line, i) in CONNECT_GUIDE" :key="i">{{ line }}</li>
        </ul>
        <p v-if="isReady" class="tips-go">
          参数已同步。点上方 <strong>打开驱动设置</strong> 修改 DPI / 按键 / 灯效。
        </p>
        <p v-else class="tips-warn">
          接收器已打开，等待鼠标上线。请 2.4G + 唤醒后点「重新同步」。
        </p>
      </section>

      <p v-if="success" class="feedback success">{{ success }}</p>
      <p v-if="error" class="feedback error">
        {{ error }}
        <button type="button" class="feedback-retry" @click="onPlusConnect">重试</button>
      </p>

      <p class="home-footer-meta">
        工厂流程：Get_HistoryDevicesInfo → Device_Reconnect → Device_Connect · 页脚 {{ BUILD_TAG }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.home-main {
  padding: 1rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.home-phase {
  font-size: 0.78rem;
  color: var(--tx2);
  margin: 0;
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}
.home-tips {
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--bg);
  font-size: 0.8rem;
  color: var(--tx2);
  line-height: 1.5;
}
.tips-title {
  font-weight: 700;
  color: var(--tx);
  margin: 0 0 0.4rem;
  font-size: 0.85rem;
}
.home-tips ul {
  margin: 0 0 0.5rem;
  padding-left: 1.1rem;
}
.tips-go {
  margin: 0.5rem 0 0;
  color: var(--gn);
  font-weight: 600;
}
.tips-warn {
  margin: 0.5rem 0 0;
  color: var(--amx);
}
.home-footer-meta {
  font-size: 0.65rem;
  color: var(--tx3);
  margin: 0;
}
.feedback {
  font-size: 0.8rem;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  margin: 0;
}
.feedback.success {
  background: var(--gnl);
  border: 1px solid var(--bd);
  color: var(--tx);
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
  font-weight: 600;
}
</style>
