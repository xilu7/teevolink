<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { useHidAction } from "@/composables/useHidAction.js";
import { PRODUCT } from "@/config/terra-pro.js";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";

const { HID, mouseCfg, deviceInfo, isReady } = useDevice();
const { run } = useHidAction();

const PRESETS = PRODUCT.defaultDpiPresets;
const DPI_MIN = PRODUCT.dpiMin;
const DPI_MAX = PRODUCT.dpiMax;
const DPI_STEP = PRODUCT.dpiStep;
const LOD_LEVELS = PRODUCT.lodLevels;
const profileNames = ["竞技", "办公", "FPS", "自定义"];
const reportRates = [125, 250, 500, 1000, 2000, 4000, 8000];

const maxHz = computed(() => deviceInfo.maxReportRate || PRODUCT.maxReportRate);
const maxStage = computed(() => mouseCfg.value.maxDpiStage);
const activeDpi = computed(() => {
  const i = Math.max(0, (mouseCfg.value.currentDpi || 1) - 1);
  return mouseCfg.value.dpis[i]?.value ?? 0;
});
const currentStage = computed(() => mouseCfg.value.currentDpi);
const reportRate = computed(() => mouseCfg.value.reportRate);
const sensor = computed(() => mouseCfg.value.sensor);
const currentLodLabel = computed(() => {
  const lod = sensor.value.lod;
  const item = LOD_LEVELS.find((l) => l.value === lod);
  return item ? `${item.label} · ${item.height}` : `档位 ${lod}`;
});

async function setProfile(n) {
  await run(
    () => HID.Set_Device_Profile(Number(n)),
    `场景：${profileNames[n] || "配置 " + (n + 1)}`
  );
}

async function setStage(v) {
  await run(() => HID.Set_MS_CurrentDPI(Number(v)), `第 ${v} 档`);
}

async function setDpiValue(val) {
  const idx = Math.max(0, currentStage.value - 1);
  await run(() => HID.Set_MS_DPIValue(idx, Number(val)), `DPI ${val}`);
}

async function setMaxStages(n) {
  await run(() => HID.Set_MS_MaxDPI(Number(n)), `${n} 档`);
}

async function setRate(hz) {
  if (hz > maxHz.value) return;
  await run(() => HID.Set_MS_ReportRate(hz), `${hz} Hz`);
}

async function setLod(v) {
  const item = LOD_LEVELS.find((l) => l.value === Number(v));
  await run(
    () => HID.Set_MS_LOD(Number(v)),
    item ? `LOD ${item.label}` : `LOD ${v}`
  );
}

async function setMotionSync(on) {
  await run(() => HID.Set_MS_MotionSync(on ? 1 : 0), on ? "移动同步开" : "移动同步关");
}

async function setAngle(on) {
  await run(() => HID.Set_MS_Angle(on ? 1 : 0), on ? "直线修正开" : "直线修正关");
}
</script>

<template>
  <div class="perf-workspace driver-shell">
    <p v-if="!isReady" class="tab-warn-compact perf-span-full">
      预览模式：右上角显示「已连接」后设置才会写入鼠标。
    </p>

    <section class="panel-compact perf-span-full">
      <header class="panel-compact-head">
        <h3>场景配置</h3>
        <span class="panel-badge">板载</span>
      </header>
      <p class="panel-hint">独立保存 DPI、改键与灯效，切换后立即生效。</p>
      <div class="profile-strip">
        <button
          v-for="n in 4"
          :key="n"
          type="button"
          class="profile-pill"
          :class="{ active: deviceInfo.profile === n - 1 }"
          @click="setProfile(n - 1)"
        >
          <span class="num">{{ n }}</span>
          <span class="tag">{{ profileNames[n - 1] }}</span>
        </button>
      </div>
    </section>

    <section class="panel-compact">
      <header class="panel-compact-head">
        <h3>DPI</h3>
        <span class="panel-badge">主</span>
      </header>
      <div class="dpi-hero-num">
        <strong>{{ activeDpi }}</strong>
        <span>第 {{ currentStage }} / {{ maxStage }} 档 · {{ DPI_STEP }} 步进</span>
      </div>
      <div class="chip-row">
        <button
          v-for="p in PRESETS"
          :key="p"
          type="button"
          class="chip-btn"
          :class="{ active: activeDpi === p }"
          @click="setDpiValue(p)"
        >
          {{ p }}
        </button>
      </div>
      <div class="compact-slider">
        <label><span>精细调节</span><span>{{ activeDpi }}</span></label>
        <input
          :value="activeDpi"
          type="range"
          :min="DPI_MIN"
          :max="DPI_MAX"
          :step="DPI_STEP"
          @change="setDpiValue($event.target.value)"
        />
      </div>
      <div class="side-rail" style="margin-top: 0.5rem">
        <div class="compact-slider">
          <label><span>档位数</span><span>{{ maxStage }}</span></label>
          <input
            :value="maxStage"
            type="range"
            min="1"
            :max="PRODUCT.maxDpiStages"
            @change="setMaxStages($event.target.value)"
          />
        </div>
        <div class="compact-slider">
          <label><span>当前档</span><span>{{ currentStage }}</span></label>
          <input
            :value="currentStage"
            type="range"
            min="1"
            :max="maxStage"
            @change="setStage($event.target.value)"
          />
        </div>
      </div>
    </section>

    <section class="panel-compact">
      <header class="panel-compact-head">
        <h3>LOD · 回报率</h3>
        <span class="panel-badge">主</span>
      </header>
      <p class="panel-hint lod-hint">当前 LOD：<strong>{{ currentLodLabel }}</strong></p>
      <div class="chip-row" style="margin-bottom: 0.55rem">
        <button
          v-for="lod in LOD_LEVELS"
          :key="lod.value"
          type="button"
          class="chip-btn lod-btn"
          :class="{ active: sensor.lod === lod.value }"
          @click="setLod(lod.value)"
        >
          {{ lod.label }}
          <small>{{ lod.height }}</small>
        </button>
      </div>
      <p class="panel-hint">回报率 · 当前 <strong class="accent">{{ reportRate }} Hz</strong></p>
      <div class="chip-row">
        <button
          v-for="hz in reportRates"
          :key="hz"
          type="button"
          class="chip-btn"
          :class="{ active: reportRate === hz, disabled: hz > maxHz }"
          :disabled="hz > maxHz"
          @click="setRate(hz)"
        >
          {{ hz }}
        </button>
      </div>
      <div class="mini-toggles">
        <div class="mini-toggle">
          <label @click.prevent>
            <span class="title">移动同步</span>
            <span class="sub">高刷屏减抖</span>
          </label>
          <input
            type="checkbox"
            :checked="sensor.motionSync"
            @change="setMotionSync($event.target.checked)"
          />
        </div>
        <div class="mini-toggle">
          <label @click.prevent>
            <span class="title">直线修正</span>
            <span class="sub">竞技建议关</span>
          </label>
          <input type="checkbox" :checked="sensor.angle" @change="setAngle($event.target.checked)" />
        </div>
      </div>
    </section>

    <aside class="perf-visual">
      <MouseShowcase size="md" :show-labels="true" />
    </aside>
  </div>
</template>

<style scoped>
.panel-hint {
  font-size: 0.68rem;
  color: var(--tx3);
  margin: 0 0 0.5rem;
  line-height: 1.4;
}
.panel-hint strong,
.lod-hint strong.accent {
  color: var(--acd);
  font-weight: 700;
}
.lod-hint strong:not(.accent) {
  color: var(--tx);
}
</style>
