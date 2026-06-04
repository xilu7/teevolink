<script setup>
import BrandLogo from "@/components/brand/BrandLogo.vue";
import IconMoon from "@/components/icons/IconMoon.vue";
import IconSun from "@/components/icons/IconSun.vue";
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
        <div class="topbar-cluster">
          <slot name="status" />
          <button
            v-if="showConnect"
            type="button"
            class="topbar-icon-btn"
            title="连接设备"
            aria-label="连接设备"
            @click="emit('connect')"
          >
            +
          </button>
          <button
            type="button"
            class="topbar-icon-btn"
            :class="{ 'is-dark': isDark }"
            :title="isDark ? '切换为浅色' : '切换为深色'"
            :aria-label="isDark ? '切换为浅色' : '切换为深色'"
            @click="toggleTheme"
          >
            <IconSun v-if="isDark" />
            <IconMoon v-else />
          </button>
          <div v-if="$slots.actions" class="topbar-actions">
            <slot name="actions" />
          </div>
        </div>
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
@media (max-width: 720px) {
  .app-topbar-inner {
    flex-wrap: wrap;
    row-gap: 0.35rem;
  }
  .app-topbar-end {
    width: 100%;
    justify-content: space-between;
  }
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
</style>
