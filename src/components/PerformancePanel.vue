<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";

const { HID, mouseCfg } = useDevice();

const reportRates = [125, 250, 500, 1000, 2000, 4000, 8000];

const reportRate = computed(() => mouseCfg.value.reportRate);

async function setRate(hz) {
  await HID.Set_MS_ReportRate(hz);
}

async function setLod(v) {
  await HID.Set_MS_LOD(Number(v));
}

async function setDebounce(v) {
  await HID.Set_MS_DebounceTime(Number(v));
}

async function setMotionSync(on) {
  await HID.Set_MS_MotionSync(on ? 1 : 0);
}
</script>

<template>
  <section class="card">
    <h2>Performance</h2>
    <div class="field">
      <label>Report rate</label>
      <div class="rate-grid">
        <button
          v-for="hz in reportRates"
          :key="hz"
          class="btn"
          :class="reportRate === hz ? 'btn-primary' : 'btn-secondary'"
          @click="setRate(hz)"
        >
          {{ hz }} Hz
        </button>
      </div>
    </div>
    <div class="field">
      <label>LOD height</label>
      <input
        type="range"
        min="1"
        max="5"
        :value="mouseCfg.sensor.lod"
        @change="setLod($event.target.value)"
      />
    </div>
    <div class="field">
      <label>Debounce (ms)</label>
      <input
        type="range"
        min="0"
        max="30"
        :value="mouseCfg.debounceTime"
        @change="setDebounce($event.target.value)"
      />
      <span>{{ mouseCfg.debounceTime }}</span>
    </div>
    <div class="field row">
      <label>Motion sync</label>
      <input
        type="checkbox"
        :checked="mouseCfg.sensor.motionSync"
        @change="setMotionSync($event.target.checked)"
      />
    </div>
  </section>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
.rate-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.field.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
