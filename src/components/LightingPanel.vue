<script setup>
import { useDevice } from "@/composables/useDevice.js";

const { HID, mouseCfg } = useDevice();
const light = () => mouseCfg.value.lightEffect;

const modeNames = ["关闭", "常亮", "呼吸", "霓虹", "流光", "彩虹", "反应", "自定义"];

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
  <section class="driver-card">
    <h2>RGB 灯效</h2>
    <p class="driver-card-desc">调节机身灯光模式、亮度与速度</p>

    <div class="driver-slider-wrap">
      <label class="driver-stat-label">灯效模式</label>
      <input
        type="range"
        min="0"
        max="6"
        :value="light().mode"
        @change="setMode($event.target.value)"
      />
      <div class="driver-slider-meta">
        <span>{{ modeNames[light().mode] || "模式 " + light().mode }}</span>
        <strong>{{ light().mode }}</strong>
      </div>
    </div>

    <div class="driver-grid-2" style="margin-top: 1rem">
      <div class="driver-slider-wrap">
        <label class="driver-stat-label">亮度</label>
        <input
          type="range"
          min="0"
          max="9"
          :value="light().brightness"
          @change="setBrightness($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>等级</span>
          <strong>{{ light().brightness }}</strong>
        </div>
      </div>
      <div class="driver-slider-wrap">
        <label class="driver-stat-label">速度</label>
        <input
          type="range"
          min="0"
          max="9"
          :value="light().speed"
          @change="setSpeed($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>等级</span>
          <strong>{{ light().speed }}</strong>
        </div>
      </div>
    </div>

    <p class="hint">DPI 指示灯可在后续版本通过 Set_MS_DPILight* 接口扩展。</p>
  </section>
</template>

<style scoped>
.hint {
  font-size: 0.8rem;
  color: var(--tx3);
  margin-top: 1.25rem;
}
</style>
