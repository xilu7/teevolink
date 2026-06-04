<script setup>
import { useDevice } from "@/composables/useDevice.js";

const { HID, mouseCfg } = useDevice();
const light = () => mouseCfg.value.lightEffect;

async function setMode(mode) {
  await HID.Set_MS_LightMode(Number(mode));
}

async function setBrightness(v) {
  await HID.Set_MS_LightBrightness(Number(v));
}

async function setSpeed(v) {
  await HID.Set_MS_LightSpeed(Number(v));
}
</script>

<template>
  <section class="card">
    <h2>RGB lighting</h2>
    <div class="field">
      <label>Effect mode</label>
      <input
        type="range"
        min="0"
        max="6"
        :value="light().mode"
        @change="setMode($event.target.value)"
      />
      <span>{{ light().mode }}</span>
    </div>
    <div class="field">
      <label>Brightness</label>
      <input
        type="range"
        min="0"
        max="9"
        :value="light().brightness"
        @change="setBrightness($event.target.value)"
      />
    </div>
    <div class="field">
      <label>Speed</label>
      <input
        type="range"
        min="0"
        max="9"
        :value="light().speed"
        @change="setSpeed($event.target.value)"
      />
    </div>
    <p class="hint">DPI indicator lighting: use SDK Set_MS_DPILight* APIs to extend this panel.</p>
  </section>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
.hint {
  font-size: 0.85rem;
  color: var(--tx3);
  margin-top: 1rem;
}
</style>
