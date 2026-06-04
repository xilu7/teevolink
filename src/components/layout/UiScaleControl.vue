<script setup>
import { useUiScale } from "@/composables/useUiScale.js";

const { percentLabel, zoomIn, zoomOut, resetZoom } = useUiScale();
</script>

<template>
  <div class="ui-scale" role="group" aria-label="界面缩放">
    <button type="button" class="ui-scale-btn" title="缩小" @click="zoomOut">−</button>
    <span class="ui-scale-val">{{ percentLabel }}</span>
    <button type="button" class="ui-scale-btn" title="放大" @click="zoomIn">+</button>
    <button type="button" class="ui-scale-reset" title="恢复 125%" @click="resetZoom">
      重置
    </button>
  </div>
</template>

<style scoped>
.ui-scale {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.2rem 0.35rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2);
}
.ui-scale-btn,
.ui-scale-reset {
  border: none;
  background: transparent;
  color: var(--tx2);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
  line-height: 1;
}
.ui-scale-btn:hover,
.ui-scale-reset:hover {
  background: var(--bg);
  color: var(--tx);
}
.ui-scale-val {
  min-width: 3rem;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--tx);
}
.ui-scale-reset {
  font-size: 0.72rem;
  margin-left: 0.15rem;
}
</style>
