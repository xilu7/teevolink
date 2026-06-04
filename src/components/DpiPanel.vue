<script setup>
import { ref, computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { hexToRgbString, toHexColor } from "@/utils/color.js";

const { HID, mouseCfg } = useDevice();
const PRESETS = [400, 800, 1200, 1600, 2400, 3200, 6400, 12000];
const xyIndependent = ref(false);

const stage = computed({
  get: () => mouseCfg.value.currentDpi,
  set: (v) => HID.Set_MS_CurrentDPI(Number(v)),
});

const maxStage = computed(() => mouseCfg.value.maxDpiStage);

const activeDpi = computed(() => {
  const i = Math.max(0, stage.value - 1);
  return mouseCfg.value.dpis[i] || { value: 0, x: 0, y: 0, color: "#78BE1F" };
});

async function setDpiValue(val) {
  const idx = Math.max(0, stage.value - 1);
  if (xyIndependent.value) {
    await HID.Set_MS_DPIXYValue(idx, Number(val), Number(activeDpi.value.y || val));
  } else {
    await HID.Set_MS_DPIValue(idx, Number(val));
  }
}

async function setDpiY(val) {
  const idx = Math.max(0, stage.value - 1);
  await HID.Set_MS_DPIXYValue(idx, activeDpi.value.x || activeDpi.value.value, Number(val));
}

async function setDpiColor(hex) {
  const idx = Math.max(0, stage.value - 1);
  await HID.Set_MS_DPIColor(idx, hexToRgbString(hex));
}

async function setMaxStages(n) {
  await HID.Set_MS_MaxDPI(Number(n));
}

async function applyPreset(val) {
  await setDpiValue(val);
}
</script>

<template>
  <div class="driver-grid-2">
    <section class="driver-card">
      <h2>DPI 档位</h2>
      <p class="driver-card-desc">快速选择常用 DPI，共 {{ maxStage }} 档可切换</p>
      <div class="driver-dpi-presets">
        <button
          v-for="p in PRESETS"
          :key="p"
          type="button"
          class="driver-chip"
          :class="{ active: activeDpi.value === p }"
          @click="applyPreset(p)"
        >
          {{ p }}
        </button>
      </div>
      <div class="driver-slider-wrap" style="margin-top: 1.25rem">
        <label class="driver-stat-label">当前档位</label>
        <input v-model.number="stage" type="range" min="1" :max="maxStage" />
        <div class="driver-slider-meta">
          <span>档位</span>
          <strong>{{ stage }} / {{ maxStage }}</strong>
        </div>
      </div>
      <div class="driver-slider-wrap">
        <label class="driver-stat-label">最大档位数</label>
        <input
          :value="maxStage"
          type="range"
          min="1"
          max="8"
          @change="setMaxStages($event.target.value)"
        />
      </div>
      <div class="field" style="margin-top: 0.75rem">
        <label>本档指示灯颜色</label>
        <input
          type="color"
          :value="toHexColor(activeDpi.color)"
          @change="setDpiColor($event.target.value)"
        />
      </div>
    </section>

    <section class="driver-card">
      <h2>DPI 微调</h2>
      <div class="driver-toggle-row">
        <label>
          横向 X 与纵向 Y 独立设置
          <span class="sub">开启后可分别调节 X/Y DPI</span>
        </label>
        <input v-model="xyIndependent" type="checkbox" />
      </div>
      <div class="driver-slider-wrap">
        <input
          :value="activeDpi.value"
          type="range"
          min="200"
          max="26000"
          step="50"
          @change="setDpiValue($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>{{ xyIndependent ? "X 轴 DPI" : "DPI" }}</span>
          <strong>{{ activeDpi.value }}</strong>
        </div>
      </div>
      <div v-if="xyIndependent" class="driver-slider-wrap">
        <input
          :value="activeDpi.y || activeDpi.value"
          type="range"
          min="200"
          max="26000"
          step="50"
          @change="setDpiY($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>Y 轴 DPI</span>
          <strong>{{ activeDpi.y || activeDpi.value }}</strong>
        </div>
      </div>
      <p class="hint">传感器：{{ mouseCfg.sensor.type }}（sensor.json）</p>
    </section>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.8rem;
  color: var(--tx3);
  margin-top: 1rem;
}
.field label {
  display: block;
  font-size: 0.85rem;
  color: var(--tx2);
  margin-bottom: 0.35rem;
}
</style>
