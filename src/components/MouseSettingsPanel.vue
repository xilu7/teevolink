<script setup>
import { ref } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { hexToRgbString, toHexColor } from "@/utils/color.js";

const { HID, deviceInfo, mouseCfg } = useDevice();
const light = () => mouseCfg.value.lightEffect;

const SLEEP_LEVELS = [
  { value: 0, label: "2 分钟" },
  { value: 1, label: "5 分钟" },
  { value: 2, label: "10 分钟" },
  { value: 3, label: "15 分钟" },
  { value: 4, label: "30 分钟" },
  { value: 5, label: "60 分钟" },
];

const profileNames = ref(["游戏", "办公", "FPS", "自定义"]);

async function setProfile(n) {
  await HID.Set_Device_Profile(Number(n));
}

async function setMode(mode) {
  await HID.Set_MS_LightMode(Number(mode));
}
async function setBrightness(v) {
  await HID.Set_MS_LightBrightness(Number(v));
}
async function setSpeed(v) {
  await HID.Set_MS_LightSpeed(Number(v));
}
async function setLightColor(hex) {
  await HID.Set_MS_LightColor(hexToRgbString(hex));
}
async function setSleep(v) {
  await HID.Set_MS_LightOffTime(Number(v));
}
async function setDpiLightMode(v) {
  await HID.Set_MS_DPILightMode(Number(v));
}
async function setDpiLightBrightness(v) {
  await HID.Set_MS_DPILightBrightness(Number(v));
}

async function restore() {
  if (!confirm("确定要恢复鼠标出厂设置吗？此操作不可撤销。")) return;
  await HID.Device_Restore();
}
</script>

<template>
  <div class="settings-stack">
    <section class="driver-card">
      <h2>板载配置方案</h2>
      <p class="driver-card-desc">
        切换后 DPI、改键与灯光等参数一并切换。当前：配置 {{ (deviceInfo.profile ?? 0) + 1 }}
      </p>
      <div class="profile-grid">
        <button
          v-for="n in 4"
          :key="n"
          type="button"
          class="profile-card"
          :class="{ active: deviceInfo.profile === n - 1 }"
          @click="setProfile(n - 1)"
        >
          <span class="profile-num">配置 {{ n }}</span>
          <span class="profile-name">{{ profileNames[n - 1] }}</span>
        </button>
      </div>
    </section>

    <div class="driver-grid-2">
      <section class="driver-card">
        <h2>RGB 灯效</h2>
        <p class="driver-card-desc">机身装饰灯模式、亮度与速度</p>
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
            <strong>{{ light().mode }}</strong>
          </div>
        </div>
        <div class="driver-slider-wrap">
          <label class="driver-stat-label">亮度 / 速度</label>
          <input
            type="range"
            min="0"
            max="9"
            :value="light().brightness"
            @change="setBrightness($event.target.value)"
          />
          <input
            type="range"
            min="0"
            max="9"
            :value="light().speed"
            style="margin-top: 0.5rem"
            @change="setSpeed($event.target.value)"
          />
        </div>
        <div class="field" style="margin-top: 0.75rem">
          <label>灯效颜色</label>
          <input
            type="color"
            :value="toHexColor(light().color)"
            @change="setLightColor($event.target.value)"
          />
        </div>
      </section>

      <section class="driver-card">
        <h2>DPI 指示灯</h2>
        <p class="driver-card-desc">切换 DPI 时的指示灯效果</p>
        <div class="driver-slider-wrap">
          <label class="driver-stat-label">指示模式</label>
          <input
            type="range"
            min="0"
            max="6"
            :value="mouseCfg.dpiEffect?.mode ?? 0"
            @change="setDpiLightMode($event.target.value)"
          />
        </div>
        <div class="driver-slider-wrap">
          <label class="driver-stat-label">指示亮度</label>
          <input
            type="range"
            min="0"
            max="9"
            :value="mouseCfg.dpiEffect?.brightness ?? 3"
            @change="setDpiLightBrightness($event.target.value)"
          />
        </div>
      </section>
    </div>

    <section class="driver-card">
      <h2>电源与休眠</h2>
      <div class="driver-slider-wrap">
        <label class="driver-stat-label">无线休眠时间</label>
        <input
          type="range"
          min="0"
          :max="SLEEP_LEVELS.length - 1"
          :value="mouseCfg.sleepTime ?? 2"
          @change="setSleep($event.target.value)"
        />
        <div class="driver-slider-meta">
          <span>未操作后进入休眠</span>
          <strong>{{ SLEEP_LEVELS[mouseCfg.sleepTime ?? 2]?.label || "—" }}</strong>
        </div>
      </div>
    </section>

    <section class="driver-card">
      <h2>固件与维护</h2>
      <p class="driver-card-desc">
        网页版固件升级需工厂提供 UpgradeHandle.js。当前可通过下方恢复出厂或桌面端工具升级。
      </p>
      <div class="driver-toggle-row">
        <label>
          固件更新
          <span class="sub">连接设备后显示版本（只读）</span>
        </label>
        <span class="badge">SDK 待接入</span>
      </div>
      <button type="button" class="btn btn-secondary danger-btn" @click="restore">
        恢复出厂设置
      </button>
    </section>
  </div>
</template>

<style scoped>
.settings-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.profile-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}
@media (max-width: 700px) {
  .profile-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.profile-card {
  text-align: left;
  padding: 1rem;
  border-radius: var(--r);
  border: 1px solid var(--bd);
  background: var(--bg2);
  transition: border-color 0.15s, background 0.15s;
}
.profile-card.active {
  border-color: var(--ac);
  background: var(--acl);
}
.profile-num {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
}
.profile-name {
  font-size: 0.75rem;
  color: var(--tx3);
}
.profile-card.active .profile-num {
  color: var(--acd);
}
.danger-btn {
  color: var(--rdx);
  border-color: var(--rdx);
  margin-top: 1rem;
}
.field label {
  font-size: 0.85rem;
  color: var(--tx2);
}
</style>
