<script setup>
import { ref, computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { useSettingFeedback } from "@/composables/useSettingFeedback.js";
import SettingCard from "@/components/ui/SettingCard.vue";
import HelpTip from "@/components/ui/HelpTip.vue";

const { HID, mouseCfg, deviceInfo } = useDevice();
const { notify } = useSettingFeedback();

const showAdvanced = ref(false);
const PRESETS = [400, 800, 1200, 1600, 2400, 3200, 6400];
const reportRates = [125, 250, 500, 1000, 2000, 4000, 8000];
const maxHz = computed(() => deviceInfo.maxReportRate || 8000);

const stage = computed({
  get: () => mouseCfg.value.currentDpi,
  set: async (v) => {
    await HID.Set_MS_CurrentDPI(Number(v));
    notify(`已切换到第 ${v} 档 DPI`);
  },
});

const maxStage = computed(() => mouseCfg.value.maxDpiStage);

const activeDpi = computed(() => {
  const i = Math.max(0, stage.value - 1);
  return mouseCfg.value.dpis[i]?.value ?? 0;
});

const reportRate = computed(() => mouseCfg.value.reportRate);
const sensor = computed(() => mouseCfg.value.sensor);

async function setDpiValue(val) {
  const idx = Math.max(0, stage.value - 1);
  await HID.Set_MS_DPIValue(idx, Number(val));
  notify(`本档 DPI 已设为 ${val}`);
}

async function setMaxStages(n) {
  await HID.Set_MS_MaxDPI(Number(n));
  notify(`DPI 档位数：${n}`);
}

async function setRate(hz) {
  if (hz > maxHz.value) return;
  await HID.Set_MS_ReportRate(hz);
  notify(`回报率已设为 ${hz} Hz`);
}

async function setLod(v) {
  await HID.Set_MS_LOD(Number(v));
  notify(`离地高度 LOD：档位 ${v}`);
}

async function setMotionSync(on) {
  await HID.Set_MS_MotionSync(on ? 1 : 0);
  notify(on ? "已开启移动同步" : "已关闭移动同步");
}

async function setAngle(on) {
  await HID.Set_MS_Angle(on ? 1 : 0);
  notify(on ? "已开启直线修正" : "已关闭直线修正（推荐竞技）");
}
</script>

<template>
  <div class="tab-stack">
    <SettingCard title="DPI 灵敏度" badge="基础">
      <template #desc>
        <HelpTip
          text="DPI 越高，鼠标移动相同距离时指针在屏幕上移动越远。竞技玩家常用多档 DPI，便于瞄准时降低、扫射时提高。"
        />
      </template>

      <div class="live-value">
        <span class="live-label">当前生效</span>
        <strong class="live-num">{{ activeDpi }}</strong>
        <span class="live-unit">DPI · 第 {{ stage }} / {{ maxStage }} 档</span>
      </div>

      <div class="driver-dpi-presets">
        <button
          v-for="p in PRESETS"
          :key="p"
          type="button"
          class="driver-chip"
          :class="{ active: activeDpi === p }"
          @click="setDpiValue(p)"
        >
          {{ p }}
        </button>
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">精细调节（当前档）</label>
        <input
          :value="activeDpi"
          type="range"
          min="200"
          max="26000"
          step="50"
          @change="setDpiValue($event.target.value)"
        />
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">可用档位数</label>
        <input
          :value="maxStage"
          type="range"
          min="1"
          max="8"
          @change="setMaxStages($event.target.value)"
        />
        <HelpTip text="档位数决定鼠标侧键或专用键可循环切换的 DPI 数量，不影响当前灵敏度数值。" />
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">切换当前档位</label>
        <input v-model.number="stage" type="range" min="1" :max="maxStage" />
      </div>
    </SettingCard>

    <SettingCard title="回报率" badge="基础">
      <template #desc>
        <HelpTip
          text="回报率（Hz）是鼠标每秒向电脑报告位置的次数。数值越高指针越跟手，但会更耗电、占用更多系统资源。8K 接收器最高支持 8000 Hz。"
        />
      </template>

      <div class="driver-rate-grid">
        <button
          v-for="hz in reportRates"
          :key="hz"
          type="button"
          class="driver-chip"
          :class="{ active: reportRate === hz, disabled: hz > maxHz }"
          :disabled="hz > maxHz"
          @click="setRate(hz)"
        >
          {{ hz }}
        </button>
      </div>
      <p class="rate-hint">当前：<strong>{{ reportRate }} Hz</strong></p>
    </SettingCard>

    <button type="button" class="accordion-trigger" @click="showAdvanced = !showAdvanced">
      <span>进阶调校</span>
      <span class="accordion-meta">{{ showAdvanced ? "收起" : "LOD · 移动同步 · 直线修正" }}</span>
      <span class="accordion-chev" :class="{ open: showAdvanced }">›</span>
    </button>

    <div v-show="showAdvanced" class="accordion-panel">
      <SettingCard title="离地高度 LOD" badge="进阶">
        <template #desc>
          <HelpTip
            text="LOD（Lift-Off Distance）是鼠标离开桌面后仍能追踪的高度。较低 LOD 可减少抬鼠时的误移动，多数 FPS 玩家偏好较低档位。"
          />
        </template>
        <div class="driver-slider-wrap">
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
      </SettingCard>

      <SettingCard title="追踪优化" badge="进阶">
        <div class="driver-toggle-row">
          <label>
            移动同步（Motion Sync）
            <span class="sub">与显示器刷新协同，减轻高速移动时的抖动</span>
          </label>
          <input
            type="checkbox"
            :checked="sensor.motionSync"
            @change="setMotionSync($event.target.checked)"
          />
        </div>
        <div class="driver-toggle-row">
          <label>
            直线修正（Angle Snapping）
            <span class="sub">自动拉直移动轨迹；竞技建议关闭以保持精准甩枪</span>
          </label>
          <input type="checkbox" :checked="sensor.angle" @change="setAngle($event.target.checked)" />
        </div>
      </SettingCard>
    </div>
  </div>
</template>

<style scoped>
.tab-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.live-value {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.35rem 0.6rem;
  margin-bottom: 1rem;
  padding: 0.75rem 0.9rem;
  background: var(--acl);
  border-radius: var(--r);
  border: 1px solid var(--bd);
}
.live-label {
  font-size: 0.75rem;
  color: var(--tx3);
  width: 100%;
}
.live-num {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--acd);
  letter-spacing: -0.02em;
}
.live-unit {
  font-size: 0.85rem;
  color: var(--tx2);
}
.rate-hint {
  margin-top: 0.65rem;
  font-size: 0.85rem;
  color: var(--tx2);
}
.rate-hint strong {
  color: var(--acd);
}
.driver-chip.disabled {
  opacity: 0.35;
  pointer-events: none;
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
  color: var(--tx);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.accordion-trigger:hover {
  border-color: var(--bd2);
  background: var(--bg);
}
.accordion-meta {
  flex: 1;
  text-align: right;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--tx3);
}
.accordion-chev {
  display: inline-block;
  transition: transform 0.2s ease;
  color: var(--tx3);
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
