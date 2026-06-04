<script setup>
import { ref } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { useHidAction } from "@/composables/useHidAction.js";
import { hexToRgbString, toHexColor } from "@/utils/color.js";

const { HID, mouseCfg } = useDevice();
const { run } = useHidAction();

const showLighting = ref(true);
const light = () => mouseCfg.value.lightEffect;

const SLEEP_LEVELS = [
  { value: 0, label: "2 分钟" },
  { value: 1, label: "5 分钟" },
  { value: 2, label: "10 分钟" },
  { value: 3, label: "15 分钟" },
  { value: 4, label: "30 分钟" },
  { value: 5, label: "60 分钟" },
];

async function setMode(mode) {
  await run(() => HID.Set_MS_LightMode(Number(mode)), "灯效已更新");
}
async function setBrightness(v) {
  await run(() => HID.Set_MS_LightBrightness(Number(v)));
}
async function setSpeed(v) {
  await run(() => HID.Set_MS_LightSpeed(Number(v)));
}
async function setLightColor(hex) {
  await run(() => HID.Set_MS_LightColor(hexToRgbString(hex)), "颜色已更新");
}
async function setDpiLightBrightness(v) {
  await run(() => HID.Set_MS_DPILightBrightness(Number(v)), "DPI 灯已更新");
}
async function setSleep(v) {
  await run(
    () => HID.Set_MS_LightOffTime(Number(v)),
    `休眠 ${SLEEP_LEVELS[v]?.label || v}`
  );
}

async function restore() {
  if (!confirm("恢复出厂将清除所有自定义设置，确定继续？")) return;
  await run(() => HID.Device_Restore(), "已恢复出厂");
}
</script>

<template>
  <div class="device-workspace driver-shell">
    <div class="device-grid">
      <section class="panel-compact">
        <header class="panel-compact-head">
          <h3>灯效</h3>
          <button type="button" class="link-fold" @click="showLighting = !showLighting">
            {{ showLighting ? "收起" : "展开" }}
          </button>
        </header>
        <div v-show="showLighting" class="device-light-body">
          <div class="compact-slider">
            <label><span>模式</span><span>{{ light().mode }}</span></label>
            <input
              type="range"
              min="0"
              max="6"
              :value="light().mode"
              @change="setMode($event.target.value)"
            />
          </div>
          <div class="compact-slider">
            <label><span>亮度</span><span>{{ light().brightness }}</span></label>
            <input
              type="range"
              min="0"
              max="9"
              :value="light().brightness"
              @change="setBrightness($event.target.value)"
            />
          </div>
          <div class="compact-slider">
            <label><span>速度</span><span>{{ light().speed }}</span></label>
            <input
              type="range"
              min="0"
              max="9"
              :value="light().speed"
              @change="setSpeed($event.target.value)"
            />
          </div>
          <label class="color-pick">
            <span>颜色</span>
            <input
              type="color"
              :value="toHexColor(light().color)"
              @change="setLightColor($event.target.value)"
            />
          </label>
          <div class="compact-slider">
            <label><span>DPI 指示灯</span></label>
            <input
              type="range"
              min="0"
              max="9"
              :value="mouseCfg.dpiEffect?.brightness ?? 3"
              @change="setDpiLightBrightness($event.target.value)"
            />
          </div>
        </div>
      </section>

      <section class="panel-compact">
        <header class="panel-compact-head">
          <h3>电源与维护</h3>
        </header>
        <div class="compact-slider">
          <label>
            <span>休眠</span>
            <span>{{ SLEEP_LEVELS[mouseCfg.sleepTime ?? 2]?.label }}</span>
          </label>
          <input
            type="range"
            min="0"
            :max="SLEEP_LEVELS.length - 1"
            :value="mouseCfg.sleepTime ?? 2"
            @change="setSleep($event.target.value)"
          />
        </div>
        <p class="panel-hint">无操作后进入休眠，移动唤醒。</p>
        <button type="button" class="btn btn-secondary danger-outline" @click="restore">
          恢复出厂设置
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.device-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--panel-gap);
  max-width: var(--driver-max);
}
@media (max-width: 640px) {
  .device-grid {
    grid-template-columns: 1fr;
  }
}
.link-fold {
  font-size: 0.68rem;
  color: var(--tx3);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.link-fold:hover {
  color: var(--acd);
}
.device-light-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.color-pick {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.68rem;
  color: var(--tx3);
  margin: 0.25rem 0;
}
.color-pick input[type="color"] {
  width: 2rem;
  height: 1.5rem;
  border: none;
  padding: 0;
  background: none;
}
.panel-hint {
  font-size: 0.68rem;
  color: var(--tx3);
  margin: 0.45rem 0;
}
.danger-outline {
  color: var(--rdx);
  border-color: var(--rdx);
  width: 100%;
  margin-top: 0.35rem;
  font-size: 0.78rem;
  padding: 0.5rem;
}
</style>
