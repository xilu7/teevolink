<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";

const { HID, mouseCfg, deviceInfo } = useDevice();

const reportRates = [125, 250, 500, 1000, 2000, 4000, 8000];
const reportRate = computed(() => mouseCfg.value.reportRate);
const sensor = computed(() => mouseCfg.value.sensor);

async function setRate(hz) {
  await HID.Set_MS_ReportRate(hz);
}
async function setLongDistance(on) {
  if (mouseCfg.value.supportLongDistance) {
    await HID.Set_Device_LongDistance(on ? 1 : 0);
  }
}
async function setPerformanceState(on) {
  await HID.Set_MS_PerformanceState(on ? 1 : 0);
}
async function setSensorMode(v) {
  await HID.Set_MS_SensorMode(Number(v));
}
async function setLeftKeyOp(v) {
  await HID.Set_MS_LeftKeyOperation(Number(v));
}
async function setRightKeyOp(v) {
  await HID.Set_MS_RightKeyOperation(Number(v));
}
</script>

<template>
  <div class="driver-grid-2">
    <section class="driver-card">
      <h2>回报率</h2>
      <p class="driver-card-desc">
        鼠标与电脑通信频率。设备最大支持 {{ deviceInfo.maxReportRate || 8000 }} Hz
      </p>
      <div class="driver-rate-grid">
        <button
          v-for="hz in reportRates"
          :key="hz"
          type="button"
          class="driver-chip"
          :class="{ active: reportRate === hz, disabled: hz > (deviceInfo.maxReportRate || 8000) }"
          :disabled="hz > (deviceInfo.maxReportRate || 8000)"
          @click="setRate(hz)"
        >
          {{ hz }} Hz
        </button>
      </div>
    </section>

    <section class="driver-card">
      <h2>竞技与连接</h2>
      <p class="driver-card-desc">传感器模式、火力全开与远距离模式（视固件支持）</p>

      <div class="driver-toggle-row">
        <label>
          火力全开
          <span class="sub">Performance Boost</span>
        </label>
        <input
          type="checkbox"
          :checked="sensor.performanceState"
          @change="setPerformanceState($event.target.checked)"
        />
      </div>

      <div v-if="mouseCfg.supportLongDistance" class="driver-toggle-row">
        <label>
          远距离模式
          <span class="sub">提升无线远距离稳定性，可能增加功耗</span>
        </label>
        <input
          type="checkbox"
          :checked="mouseCfg.longDistance"
          @change="setLongDistance($event.target.checked)"
        />
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">传感器模式</label>
        <input
          type="range"
          min="0"
          max="2"
          :value="sensor.sensorMode"
          :disabled="sensor.sensorModeDisable"
          @change="setSensorMode($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>模式</span>
          <strong>{{ sensor.sensorMode }}</strong>
        </div>
      </div>
    </section>

    <section class="driver-card">
      <h2>按键响应</h2>
      <p class="driver-card-desc">左右键工作模式（普通 / 超前，依固件定义）</p>
      <div class="driver-toggle-row">
        <label>左键超前模式</label>
        <input
          type="checkbox"
          :checked="!!mouseCfg.leftKeyOperation"
          @change="setLeftKeyOp($event.target.checked ? 1 : 0)"
        />
      </div>
      <div class="driver-toggle-row">
        <label>右键超前模式</label>
        <input
          type="checkbox"
          :checked="!!mouseCfg.rightKeyOperation"
          @change="setRightKeyOp($event.target.checked ? 1 : 0)"
        />
      </div>
    </section>

    <section class="driver-card">
      <h2>说明</h2>
      <p class="driver-card-desc">
        LOD、去抖、移动同步等传感器参数请在底部导航「参数」中调节；改键与宏在「改键」中设置。
      </p>
      <ul class="perf-tips">
        <li>8K 接收器请使用 USB 3.0 口以获得稳定 8000Hz</li>
        <li>回报率越高，续航越短</li>
        <li>修改后自动写入板载存储</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.perf-tips {
  padding-left: 1.1rem;
  color: var(--tx2);
  font-size: 0.85rem;
  line-height: 1.65;
}
.driver-chip.disabled {
  opacity: 0.35;
  pointer-events: none;
}
</style>
