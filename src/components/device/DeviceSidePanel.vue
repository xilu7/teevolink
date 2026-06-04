<script setup>
import MouseShowcase from "@/components/brand/MouseShowcase.vue";

defineProps({
  statusText: { type: String, default: "" },
});
</script>

<template>
  <div class="device-side-panel">
    <p v-if="statusText" class="device-side-status">{{ statusText }}</p>
    <MouseShowcase size="side" />
  </div>
</template>

<style scoped>
.device-side-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.85rem;
  width: 100%;
  height: 100%;
}
.device-side-status {
  margin: 0;
  font-size: 0.68rem;
  line-height: 1.55;
  color: var(--tx2);
  word-break: break-word;
}
</style>
