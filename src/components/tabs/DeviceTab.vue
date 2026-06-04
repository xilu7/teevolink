<script setup>
import { ref } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { useHidAction } from "@/composables/useHidAction.js";
import SettingCard from "@/components/ui/SettingCard.vue";
import HelpTip from "@/components/ui/HelpTip.vue";
import { hexToRgbString, toHexColor } from "@/utils/color.js";

const { HID, deviceInfo, mouseCfg } = useDevice();
const { run } = useHidAction();

const showLighting = ref(false);
const profileNames = ["竞技", "办公", "FPS", "自定义"];
const light = () => mouseCfg.value.lightEffect;

const SLEEP_LEVELS = [
  { value: 0, label: "2 分钟" },
  { value: 1, label: "5 分钟" },
  { value: 2, label: "10 分钟" },
  { value: 3, label: "15 分钟" },
  { value: 4, label: "30 分钟" },
  { value: 5, label: "60 分钟" },
];

async function setProfile(n) {
  await run(
    () => HID.Set_Device_Profile(Number(n)),
    `已切换到${profileNames[n] || "配置 " + (n + 1)}`
  );
}

async function setMode(mode) {
  await run(() => HID.Set_MS_LightMode(Number(mode)), "灯效模式已更新");
}
async function setBrightness(v) {
  await run(() => HID.Set_MS_LightBrightness(Number(v)));
}
async function setSpeed(v) {
  await run(() => HID.Set_MS_LightSpeed(Number(v)));
}
async function setLightColor(hex) {
  await run(() => HID.Set_MS_LightColor(hexToRgbString(hex)), "灯效颜色已更新");
}
async function setDpiLightBrightness(v) {
  await run(() => HID.Set_MS_DPILightBrightness(Number(v)), "DPI 灯亮度已更新");
}
async function setSleep(v) {
  await run(
    () => HID.Set_MS_LightOffTime(Number(v)),
    `休眠：${SLEEP_LEVELS[v]?.label || v}`
  );
}

async function restore() {
  if (!confirm("恢复出厂将清除所有自定义设置，确定继续？")) return;
  await run(() => HID.Device_Restore(), "已恢复出厂设置");
}
</script>

<template>
  <div class="tab-stack">
    <SettingCard title="场景配置" badge="基础">
      <HelpTip
        text="每组配置独立保存 DPI、改键与灯光。切换后鼠标立即应用该方案，适合办公 / 游戏 / FPS 等场景快速切换。"
      />
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
    </SettingCard>

    <button type="button" class="accordion-trigger" @click="showLighting = !showLighting">
      <span>灯效（可选）</span>
      <span class="accordion-meta">{{ showLighting ? "收起" : "RGB · DPI 灯" }}</span>
      <span class="accordion-chev" :class="{ open: showLighting }">›</span>
    </button>

    <div v-show="showLighting" class="accordion-panel">
      <SettingCard title="机身 RGB">
        <HelpTip text="仅影响外观，不改变 DPI 或回报率。电竞玩家可关闭以省电。" />
        <div class="driver-slider-wrap">
          <label class="driver-stat-label">模式</label>
          <input
            type="range"
            min="0"
            max="6"
            :value="light().mode"
            @change="setMode($event.target.value)"
          />
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
            style="margin-top: 0.4rem"
            @change="setSpeed($event.target.value)"
          />
        </div>
        <label class="color-label">颜色</label>
        <input
          type="color"
          :value="toHexColor(light().color)"
          @change="setLightColor($event.target.value)"
        />
      </SettingCard>

      <SettingCard title="DPI 指示灯">
        <HelpTip text="切换 DPI 档位时侧面/滚轮灯的提示亮度，便于确认当前档位。" />
        <div class="driver-slider-wrap">
          <input
            type="range"
            min="0"
            max="9"
            :value="mouseCfg.dpiEffect?.brightness ?? 3"
            @change="setDpiLightBrightness($event.target.value)"
          />
        </div>
      </SettingCard>
    </div>

    <SettingCard title="电源">
      <HelpTip text="长时间无操作后鼠标进入休眠以节省电量，移动唤醒即可。" />
      <div class="driver-slider-wrap">
        <input
          type="range"
          min="0"
          :max="SLEEP_LEVELS.length - 1"
          :value="mouseCfg.sleepTime ?? 2"
          @change="setSleep($event.target.value)"
        />
        <div class="driver-slider-meta">
          <strong>{{ SLEEP_LEVELS[mouseCfg.sleepTime ?? 2]?.label }}</strong>
        </div>
      </div>
    </SettingCard>

    <SettingCard title="维护">
      <HelpTip text="网页固件升级需工厂 SDK。日常维护可使用恢复出厂。" />
      <button type="button" class="btn btn-secondary danger-outline" @click="restore">
        恢复出厂设置
      </button>
    </SettingCard>
  </div>
</template>

<style scoped>
.tab-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
}
@media (min-width: 640px) {
  .profile-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.profile-card {
  padding: 0.9rem;
  border: 1px solid var(--bd);
  border-radius: var(--r);
  background: var(--bg2);
  text-align: left;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}
.profile-card:hover {
  border-color: var(--bd2);
}
.profile-card.active {
  border-color: var(--ac);
  background: var(--acl);
  transform: translateY(-2px);
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
.color-label {
  font-size: 0.85rem;
  color: var(--tx2);
  display: block;
  margin: 0.5rem 0 0.35rem;
}
.danger-outline {
  color: var(--rdx);
  border-color: var(--rdx);
  width: 100%;
}
.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--bd);
  border-radius: var(--rl);
  background: var(--bg2);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}
.accordion-meta {
  flex: 1;
  text-align: right;
  font-size: 0.78rem;
  color: var(--tx3);
}
.accordion-chev {
  transition: transform 0.2s;
}
.accordion-chev.open {
  transform: rotate(90deg);
}
.accordion-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: panelIn 0.22s ease;
}
@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
