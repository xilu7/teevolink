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
  gap: 0.15rem;
  height: 40px;
  padding: 0 0.4rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2);
}
.ui-scale-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--tx);
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
}
.ui-scale-reset {
  border: none;
  background: transparent;
  color: var(--tx2);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0 0.35rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  height: 32px;
}
.ui-scale-btn:hover,
.ui-scale-reset:hover {
  background: var(--bg);
  color: var(--tx);
}
.ui-scale-val {
  min-width: 3.2rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--tx);
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}
</style>
