<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDevice } from "@/composables/useDevice.js";
import DpiPanel from "@/components/DpiPanel.vue";
import PerformancePanel from "@/components/PerformancePanel.vue";
import LightingPanel from "@/components/LightingPanel.vue";
import ProfilesPanel from "@/components/ProfilesPanel.vue";

const router = useRouter();
const { HID, connected, online, battery, isWired, deviceInfo, disconnect, refresh, PRODUCT } =
  useDevice();

const tab = ref("dpi");

onMounted(async () => {
  if (!HID.deviceInfo.deviceOpen) {
    router.replace("/");
  }
});

async function onDisconnect() {
  await disconnect();
  router.push("/");
}
</script>

<template>
  <div class="device-page">
    <header class="topbar">
      <div class="container topbar-inner">
        <div>
          <strong>{{ PRODUCT.name }}</strong>
          <span class="sub">by {{ PRODUCT.brand }}</span>
        </div>
        <div class="status">
          <span class="status-dot" :class="connected && online ? 'ok' : 'warn'" />
          {{ isWired ? "Wired" : "Wireless" }}
          <span v-if="battery"> · {{ battery.level }}%</span>
          <span v-if="battery?.charging"> (charging)</span>
        </div>
        <button class="btn btn-secondary" @click="onDisconnect">Disconnect</button>
      </div>
    </header>

    <main class="container main">
      <nav class="nav-tabs">
        <button :class="{ active: tab === 'dpi' }" @click="tab = 'dpi'">DPI</button>
        <button :class="{ active: tab === 'performance' }" @click="tab = 'performance'">
          Performance
        </button>
        <button :class="{ active: tab === 'lighting' }" @click="tab = 'lighting'">Lighting</button>
        <button :class="{ active: tab === 'profiles' }" @click="tab = 'profiles'">Profiles</button>
      </nav>

      <button class="btn btn-secondary refresh" @click="refresh">Refresh from device</button>

      <DpiPanel v-if="tab === 'dpi'" />
      <PerformancePanel v-else-if="tab === 'performance'" />
      <LightingPanel v-else-if="tab === 'lighting'" />
      <ProfilesPanel v-else-if="tab === 'profiles'" />
    </main>
  </div>
</template>

<style scoped>
.topbar {
  background: var(--bg);
  border-bottom: 1px solid var(--bd);
  padding: 0.85rem 0;
}
.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.sub {
  color: var(--tx3);
  font-size: 0.85rem;
  margin-left: 0.5rem;
}
.status {
  font-size: 0.9rem;
  color: var(--tx2);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.main {
  padding: 1.5rem 0 3rem;
}
.refresh {
  margin-bottom: 1rem;
}
</style>
