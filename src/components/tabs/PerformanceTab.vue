<script setup>
import { ref, computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { useHidAction } from "@/composables/useHidAction.js";
import SettingCard from "@/components/ui/SettingCard.vue";
import HelpTip from "@/components/ui/HelpTip.vue";

const { HID, mouseCfg, deviceInfo, isReady } = useDevice();
const { run } = useHidAction();

const showAdvanced = ref(false);
const PRESETS = [400, 800, 1200, 1600, 2400, 3200, 6400];
const reportRates = [125, 250, 500, 1000, 2000, 4000, 8000];
const maxHz = computed(() => deviceInfo.maxReportRate || 8000);

const maxStage = computed(() => mouseCfg.value.maxDpiStage);

const activeDpi = computed(() => {
  const i = Math.max(0, (mouseCfg.value.currentDpi || 1) - 1);
  return mouseCfg.value.dpis[i]?.value ?? 0;
});

const currentStage = computed(() => mouseCfg.value.currentDpi);

const reportRate = computed(() => mouseCfg.value.reportRate);
const sensor = computed(() => mouseCfg.value.sensor);

async function setStage(v) {
  await run(() => HID.Set_MS_CurrentDPI(Number(v)), `已切换到第 ${v} 档`);
}

async function setDpiValue(val) {
  const idx = Math.max(0, currentStage.value - 1);
  await run(() => HID.Set_MS_DPIValue(idx, Number(val)), `本档 DPI：${val}`);
}

async function setMaxStages(n) {
  await run(() => HID.Set_MS_MaxDPI(Number(n)), `DPI 档位数：${n}`);
}

async function setRate(hz) {
  if (hz > maxHz.value) return;
  await run(() => HID.Set_MS_ReportRate(hz), `回报率：${hz} Hz`);
}

async function setLod(v) {
  await run(() => HID.Set_MS_LOD(Number(v)), `LOD 档位 ${v}`);
}

async function setMotionSync(on) {
  await run(
    () => HID.Set_MS_MotionSync(on ? 1 : 0),
    on ? "已开启移动同步" : "已关闭移动同步"
  );
}

async function setAngle(on) {
  await run(
    () => HID.Set_MS_Angle(on ? 1 : 0),
    on ? "已开启直线修正" : "已关闭直线修正"
  );
}
</script>

<template>
  <div class="tab-stack">
    <p v-if="!isReady" class="tab-warn">
      当前仅预览界面数值。要写入鼠标请先让右上角显示「已连接」，或点击下方提示中的「同步设备」。
    </p>

    <SettingCard title="DPI 灵敏度" badge="基础">
      <template #desc>
        <HelpTip
          text="DPI（CPI）决定指针移动速度。改完后可用鼠标侧键或专用键切换档位验证是否生效。"
        />
      </template>

      <div class="live-value">
        <span class="live-label">当前生效</span>
        <strong class="live-num">{{ activeDpi }}</strong>
        <span class="live-unit">DPI · 第 {{ currentStage }} / {{ maxStage }} 档</span>
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
        <HelpTip text="决定侧键可循环切换的 DPI 档数量。" />
      </div>

      <div class="driver-slider-wrap">
        <label class="driver-stat-label">切换当前档位</label>
        <input
          :value="currentStage"
          type="range"
          min="1"
          :max="maxStage"
          @change="setStage($event.target.value)"
        />
      </div>
    </SettingCard>

    <SettingCard title="回报率" badge="基础">
      <template #desc>
        <HelpTip
          text="Polling Rate（Hz）：每秒向电脑报告位置的次数。越高越跟手，耗电与 CPU 占用也更高。"
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
            text="抬鼠后仍能追踪的高度。FPS 玩家多选较低档位，减少抬鼠时指针漂移。"
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
            <strong>{{ sensor.lod }}</strong>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="追踪优化" badge="进阶">
        <div class="driver-toggle-row">
          <label>
            移动同步（Motion Sync）
            <span class="sub">高刷屏下减轻移动抖动</span>
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
            <span class="sub">竞技建议关闭，避免影响甩枪精度</span>
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
.tab-warn {
  padding: 0.75rem 0.9rem;
  border-radius: var(--r);
  background: var(--aml);
  border: 1px solid var(--bd);
  color: var(--amx);
  font-size: 0.85rem;
  line-height: 1.5;
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
