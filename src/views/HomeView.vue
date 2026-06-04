<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import { CONNECT_GUIDE } from "@/config/terra-pro.js";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import HomeDeviceCard from "@/components/home/HomeDeviceCard.vue";

const router = useRouter();
const { connect, autoConnectFromFactory, syncDevice, deviceOpen, isReady } = useDevice();

const busy = ref(false);
const booting = ref(false);
const statusMsg = ref("");
const error = ref("");
const success = ref("");

const BUILD_TAG = "2026-06-04-i";

async function onConnectDevice() {
  error.value = "";
  success.value = "";
  if (!navigator.hid) {
    error.value = "请使用 Chrome 89+ 或 Edge 89+。";
    return;
  }
  if (busy.value) return;

  busy.value = true;
  statusMsg.value = "正在连接，请稍候（约 20 秒）…";
  try {
    const result = await connect({ maxSeconds: 18 });
    if (result.status === "cancelled") {
      error.value = result.message;
      return;
    }
    if (result.status === "failed") {
      error.value = result.message;
      return;
    }
    success.value = result.message;
    if (result.ready) {
      setTimeout(() => router.push("/device"), 400);
    }
  } catch (e) {
    error.value = e?.message || "连接失败";
  } finally {
    busy.value = false;
    statusMsg.value = "";
  }
}

async function onResync() {
  if (busy.value) return;
  busy.value = true;
  statusMsg.value = "正在同步参数…";
  try {
    const ok = await syncDevice(18);
    success.value = ok ? "已连接，可以改 DPI" : "请确认鼠标在 2.4G 并已唤醒";
  } finally {
    busy.value = false;
    statusMsg.value = "";
  }
}

function openSettings() {
  router.push("/device");
}

onMounted(async () => {
  if (!navigator.hid) return;
  booting.value = true;
  try {
    await autoConnectFromFactory({ quick: true, silent: true });
  } catch (e) {
    console.warn("home auto connect", e);
  } finally {
    booting.value = false;
  }
});
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
    </AppTopbar>

    <main class="container home-main">
      <p v-if="statusMsg" class="home-status">{{ statusMsg }}</p>

      <HomeDeviceCard
        :busy="busy || booting"
        @connect="onConnectDevice"
        @open-settings="openSettings"
        @refresh="onResync"
      />

      <section v-if="!deviceOpen" class="home-hint">
        <p><strong>首次使用：</strong>插入 RapidSync → 点上方「连接设备」→ 弹窗选 RapidSync → 允许。</p>
        <p>鼠标请拨到 <strong>2.4G</strong>，打开电源并晃动唤醒。</p>
      </section>

      <section v-else class="home-tips">
        <p class="tips-title">已记住浏览器授权</p>
        <ul>
          <li v-for="(line, i) in CONNECT_GUIDE" :key="i">{{ line }}</li>
        </ul>
        <p v-if="isReady" class="tips-go">已连接。点「打开驱动设置」改 DPI / 按键。</p>
        <p v-else class="tips-warn">接收器已打开。请 2.4G 唤醒后点「重新同步」。</p>
      </section>

      <p v-if="success" class="feedback success">{{ success }}</p>
      <p v-if="error" class="feedback error">
        {{ error }}
        <button type="button" class="feedback-retry" @click="onConnectDevice">重试</button>
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
.home-status {
  font-size: 0.92rem;
  color: var(--tx2);
  margin: 0;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
}
.home-hint {
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--bg);
  font-size: 0.92rem;
  color: var(--tx2);
  line-height: 1.55;
}
.home-hint p {
  margin: 0 0 0.4rem;
}
.home-tips {
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: var(--bg);
  font-size: 0.88rem;
  color: var(--tx2);
  line-height: 1.5;
}
.tips-title {
  font-weight: 700;
  color: var(--tx);
  margin: 0 0 0.4rem;
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
