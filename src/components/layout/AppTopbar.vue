<script setup>
import BrandLogo from "@/components/brand/BrandLogo.vue";
import { useTheme } from "@/composables/useTheme.js";

defineProps({
  logoSize: { type: String, default: "md" },
  showConnect: { type: Boolean, default: false },
});

const emit = defineEmits(["connect"]);
const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <header class="app-topbar">
    <div class="container app-topbar-inner">
      <div class="app-topbar-start">
        <BrandLogo :size="logoSize" />
        <nav v-if="$slots.nav" class="topbar-nav">
          <slot name="nav" />
        </nav>
      </div>
      <div class="app-topbar-end">
        <slot name="meta" />
        <slot name="status" />
        <button
          v-if="showConnect"
          type="button"
          class="topbar-connect"
          title="连接设备（Request_Device）"
          @click="emit('connect')"
        >
          +
        </button>
        <button
          type="button"
          class="topbar-icon"
          :title="isDark ? '浅色模式' : '深色模式'"
          @click="toggleTheme"
        >
          {{ isDark ? "☀" : "☾" }}
        </button>
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--bg);
  border-bottom: 1px solid var(--bd);
  backdrop-filter: blur(8px);
}
.app-topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 58px;
  padding: 0.4rem 0;
}
.app-topbar-start,
.app-topbar-end {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.topbar-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.25rem;
}
.topbar-nav :deep(.nav-active) {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--tx);
  padding: 0.3rem 0.55rem;
  border-radius: 6px;
  background: var(--bg2);
}
.app-topbar-end :deep(.driver-ver) {
  font-size: 0.68rem;
  color: var(--tx3);
  white-space: nowrap;
}
.topbar-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--tx2);
  background: none;
  border: none;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
}
.topbar-link:hover {
  color: var(--tx);
}
.topbar-connect {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--bd2);
  background: var(--bg2);
  color: var(--tx);
  font-size: 1.35rem;
  font-weight: 300;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}
.topbar-connect:hover {
  border-color: var(--tx);
  transform: scale(1.04);
}
.topbar-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  color: var(--tx2);
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.topbar-icon:hover {
  border-color: var(--bd2);
  color: var(--tx);
}
</style>
