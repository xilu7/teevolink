<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppTopbar from "@/components/layout/AppTopbar.vue";
import IconHome from "@/components/icons/IconHome.vue";
import IconUnplug from "@/components/icons/IconUnplug.vue";
import { useDevice } from "@/composables/useDevice.js";
import { useConnectionDisplay } from "@/composables/useConnectionDisplay.js";
import { BUILD_TAG } from "@/config/build.js";

const props = defineProps({
  logoSize: { type: String, default: "md" },
  activeNav: { type: String, default: "" },
  disconnectBusy: { type: Boolean, default: false },
  /** 首页未连接时显示顶栏 + 连接 */
  showConnect: { type: Boolean, default: false },
});

const emit = defineEmits(["disconnect", "connect"]);

const router = useRouter();
const route = useRoute();
const { deviceOpen } = useDevice();
const { statusText, statusDotClass } = useConnectionDisplay();

const onHome = computed(() => route.path === "/");

function goHome() {
  if (!onHome.value) router.push("/");
}

function onDisconnect() {
  if (!deviceOpen.value || props.disconnectBusy) return;
  emit("disconnect");
}
</script>

<template>
  <AppTopbar :logo-size="logoSize" :show-connect="showConnect" @connect="emit('connect')">
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
