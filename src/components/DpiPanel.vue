<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";

const { HID, mouseCfg } = useDevice();

const stage = computed({
  get: () => mouseCfg.value.currentDpi,
  set: (v) => HID.Set_MS_CurrentDPI(Number(v)),
});

const maxStage = computed(() => mouseCfg.value.maxDpiStage);

const activeDpi = computed(() => {
  const i = Math.max(0, stage.value - 1);
  return mouseCfg.value.dpis[i] || { value: 0, color: "#ff0000" };
});

async function setDpiValue(val) {
  const idx = Math.max(0, stage.value - 1);
  await HID.Set_MS_DPIValue(idx, Number(val));
}

async function setMaxStages(n) {
  await HID.Set_MS_MaxDPI(Number(n));
}
</script>

<template>
  <section class="card">
    <h2>DPI</h2>
    <div class="field">
      <label>Active stage (1–{{ maxStage }})</label>
      <input v-model.number="stage" type="range" min="1" :max="maxStage" />
      <span>{{ stage }}</span>
    </div>
    <div class="field">
      <label>Max DPI stages</label>
      <input
        :value="maxStage"
        type="range"
        min="1"
        max="8"
        @change="setMaxStages($event.target.value)"
      />
    </div>
    <div class="field">
      <label>DPI value (stage {{ stage }})</label>
      <input
        :value="activeDpi.value"
        type="range"
        min="200"
        max="26000"
        step="50"
        @change="setDpiValue($event.target.value)"
      />
      <strong>{{ activeDpi.value }}</strong>
    </div>
    <p class="hint">Uses sensor profile {{ mouseCfg.sensor.type }} from sensor.json.</p>
  </section>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
.field {
  margin-bottom: 1.25rem;
}
.hint {
  font-size: 0.85rem;
  color: var(--tx3);
}
</style>
