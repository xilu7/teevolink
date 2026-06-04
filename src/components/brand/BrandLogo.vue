<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useTheme } from "@/composables/useTheme.js";
import { BRAND_ASSETS } from "@/config/brand.js";

const props = defineProps({
  /** sm 顶栏 · md 默认 · lg 首页 */
  size: { type: String, default: "md" },
});

const { isDark } = useTheme();

/** 浅色界面用黑字标；深色界面用白字标 */
const src = computed(() => (isDark.value ? BRAND_ASSETS.logoDark : BRAND_ASSETS.logoLight));
</script>

<template>
  <RouterLink class="brand-logo" :class="size" to="/" aria-label="Teevolution 首页">
    <img :src="src" alt="Teevolution" class="brand-logo-img" />
  </RouterLink>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  line-height: 0;
  text-decoration: none;
}
.brand-logo-img {
  display: block;
  width: auto;
  object-fit: contain;
}
.brand-logo.sm .brand-logo-img {
  height: 18px;
}
.brand-logo.md .brand-logo-img {
  height: 20px;
}
.brand-logo.lg .brand-logo-img {
  height: 24px;
}
</style>
