<script setup>
import BrandLogo from "@/components/brand/BrandLogo.vue";
import { useTheme } from "@/composables/useTheme.js";

defineProps({
  logoSize: { type: String, default: "md" },
  showHome: { type: Boolean, default: false },
});

const emit = defineEmits(["home"]);
const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <header class="app-topbar">
    <div class="container app-topbar-inner">
      <div class="app-topbar-start">
        <BrandLogo :size="logoSize" />
        <button v-if="showHome" type="button" class="topbar-link" @click="emit('home')">
          主页
        </button>
      </div>
      <div class="app-topbar-end">
        <slot name="status" />
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
  min-height: 52px;
  padding: 0.4rem 0;
}
.app-topbar-start,
.app-topbar-end {
  display: flex;
  align-items: center;
  gap: 0.65rem;
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
