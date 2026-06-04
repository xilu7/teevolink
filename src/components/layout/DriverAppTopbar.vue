<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import IconHome from "@/components/icons/IconHome.vue";
import IconUnplug from "@/components/icons/IconUnplug.vue";
import { useDevice } from "@/composables/useDevice.js";
import { BUILD_TAG } from "@/config/build.js";

const props = defineProps({
  logoSize: { type: String, default: "md" },
  /** home | device — 高亮顶栏「首页」 */
  activeNav: { type: String, default: "" },
  disconnectBusy: { type: Boolean, default: false },
});

const emit = defineEmits(["disconnect"]);

const router = useRouter();
const route = useRoute();
const { deviceOpen, isReady, online, connecting, isWired } = useDevice();

const onHome = computed(() => route.path === "/");

const statusText = computed(() => {
  if (!deviceOpen.value) return "未连接";
  if (isReady.value) return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
  if (connecting.value) return "同步中";
  if (online.value) return "鼠标在线";
  return "接收器已就绪";
});

const statusDotClass = computed(() => {
  if (!deviceOpen.value) return "e";
  if (isReady.value) return "";
  if (connecting.value || online.value) return "w";
  return "e";
});

function goHome() {
  if (!onHome.value) router.push("/");
}

function onDisconnect() {
  if (!deviceOpen.value || props.disconnectBusy) return;
  emit("disconnect");
}
</script>

<template>
  <AppTopbar :logo-size="logoSize">
    <template v-if="activeNav" #nav>
      <span v-if="activeNav === 'home'" class="nav-active">首页</span>
    </template>
    <template #meta>
      <span class="driver-ver">驱动 {{ BUILD_TAG }}</span>
    </template>
    <template #status>
      <span class="topbar-pill">
        <span class="sd" :class="statusDotClass" />
        {{ statusText }}
      </span>
    </template>
    <template #actions>
      <button
        type="button"
        class="topbar-icon-btn"
        :class="{ 'is-active': onHome }"
        title="返回首页（保持连接）"
        aria-label="返回首页"
        @click="goHome"
      >
        <IconHome />
      </button>
      <button
        type="button"
        class="topbar-icon-btn danger"
        title="断开连接"
        aria-label="断开连接"
        :disabled="!deviceOpen || disconnectBusy"
        @click="onDisconnect"
      >
        <IconUnplug />
      </button>
    </template>
  </AppTopbar>
</template>
