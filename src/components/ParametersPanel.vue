<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";

const { HID, mouseCfg } = useDevice();
const sensor = computed(() => mouseCfg.value.sensor);

async function setMotionSync(on) {
  await HID.Set_MS_MotionSync(on ? 1 : 0);
}
async function setAngle(on) {
  await HID.Set_MS_Angle(on ? 1 : 0);
}
async function setRipple(on) {
  await HID.Set_MS_Ripple(on ? 1 : 0);
}
async function setLod(v) {
  await HID.Set_MS_LOD(Number(v));
}
async function setDebounce(v) {
  await HID.Set_MS_DebounceTime(Number(v));
}
async function setDebounceRelease(v) {
  await HID.Set_MS_DebounceReleaseTime(Number(v));
}
async function setWheelDebounce(v) {
  await HID.Set_MS_WheelDebounceTime(Number(v));
}
async function setAngleTune(v) {
  await HID.Set_MS_AngleTune(Number(v));
}
async function setMovingOff(on) {
  await HID.Set_MS_MovingOffState(on ? 1 : 0);
}

const angleTuneDegrees = computed(() => {
  const raw = mouseCfg.value.angleTune ?? 0;
  if (raw > 0x7f) return raw - 0x100;
  return raw;
});
</script>

<template>
  <div class="driver-grid-2">
    <section class="driver-card">
      <h2>传感器修正</h2>
      <p class="driver-card-desc">移动同步、直线修正、波纹控制等追踪相关选项</p>

      <div class="driver-toggle-row">
        <label>
          移动同步
          <span class="sub">Motion Sync，减少高速移动抖动</span>
        </label>
        <input
          type="checkbox"
          :checked="sensor.motionSync"
          @change="setMotionSync($event.target.checked)"
        />
      </div>
      <div class="driver-toggle-row">
        <label>
          直线修正
          <span class="sub">Angle Snapping</span>
        </label>
        <input type="checkbox" :checked="sensor.angle" @change="setAngle($event.target.checked)" />
      </div>
      <div class="driver-toggle-row">
        <label>
          波纹修正
          <span class="sub">Ripple Control</span>
        </label>
        <input
          type="checkbox"
          :checked="sensor.ripple"
          @change="setRipple($event.target.checked)"
        />
      </div>
      <div class="driver-toggle-row">
        <label>
          移动时关闭灯效
          <span class="sub">移动鼠标时关闭装饰灯</span>
        </label>
        <input
          type="checkbox"
          :checked="mouseCfg.lightEffect?.movingOffState"
          @change="setMovingOff($event.target.checked)"
        />
      </div>
    </section>

    <section class="driver-card">
      <h2>高度与去抖</h2>
      <p class="driver-card-desc">静默高度 LOD、按键与滚轮去抖延迟</p>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">光学引擎静默高度 (LOD)</label>
        <input
          type="range"
          min="1"
          max="5"
          :value="sensor.lod"
          @change="setLod($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>档位</span>
          <strong>{{ sensor.lod }}</strong>
        </div>
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">按下去抖 (ms)</label>
        <input
          type="range"
          min="0"
          max="32"
          :value="mouseCfg.debounceTime"
          @change="setDebounce($event.target.value)"
        />
        <div class="driver-slider-meta">
          <strong>{{ mouseCfg.debounceTime }} ms</strong>
        </div>
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">抬起去抖 (ms)</label>
        <input
          type="range"
          min="0"
          max="32"
          :value="mouseCfg.debounceReleaseTime ?? mouseCfg.debounceTime"
          @change="setDebounceRelease($event.target.value)"
        />
        <div class="driver-slider-meta">
          <strong>{{ mouseCfg.debounceReleaseTime ?? mouseCfg.debounceTime }} ms</strong>
        </div>
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">滚轮去抖 (ms)</label>
        <input
          type="range"
          min="0"
          max="30"
          :value="mouseCfg.wheelDebounceTime ?? 0"
          @change="setWheelDebounce($event.target.value)"
        />
        <div class="driver-slider-meta">
          <strong>{{ mouseCfg.wheelDebounceTime ?? 0 }} ms</strong>
        </div>
      </div>

      <div v-if="mouseCfg.supportAngleTune" class="driver-slider-wrap">
        <label class="driver-stat-label">传感器角度微调</label>
        <input
          type="range"
          min="-30"
          max="30"
          :value="angleTuneDegrees"
          @change="setAngleTune($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>角度</span>
          <strong>{{ angleTuneDegrees }}°</strong>
        </div>
      </div>
    </section>
  </div>
</template>
