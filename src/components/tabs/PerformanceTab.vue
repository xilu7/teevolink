<script setup>

import { computed, inject } from "vue";

import { useDevice } from "@/composables/useDevice.js";

import { useHidAction } from "@/composables/useHidAction.js";
import { writeMouseDpi } from "@/composables/useDpiWrite.js";

import { PRODUCT } from "@/config/terra-pro.js";

import DeviceSidePanel from "@/components/device/DeviceSidePanel.vue";



const { HID, mouseCfg, deviceInfo, isReady } = useDevice();

const { run } = useHidAction();

const deviceStatus = inject("deviceStatus", null);
const sideStatus = computed(() => deviceStatus?.detail?.value ?? deviceStatus?.detail ?? null);
const sideLoading = computed(
  () => !!(deviceStatus?.booting?.value || deviceStatus?.refreshing?.value)
);

const PRESETS = PRODUCT.defaultDpiPresets;

const DPI_MIN = PRODUCT.dpiMin;

const DPI_MAX = PRODUCT.dpiMax;

const DPI_STEP = PRODUCT.dpiStep;

const LOD_LEVELS = PRODUCT.lodLevels;

const profileNames = ["竞技", "办公", "FPS", "自定义"];

const reportRates = [125, 250, 500, 1000, 2000, 4000, 8000];



const maxHz = computed(() => deviceInfo.maxReportRate || PRODUCT.maxReportRate);

const STAGE_COUNT = PRODUCT.defaultDpiStageCount;
const presetList = computed(() =>
  PRODUCT.defaultDpiPresets.slice(0, STAGE_COUNT).map((value, i) => ({
    value,
    stage: i + 1,
    index: i,
  }))
);

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



function presetActive(item) {
  return currentStage.value === item.stage;
}

/** 每个预设对应固定档位（1～5），写入并切换到该档 */
async function applyDpiPreset(item) {
  const dpi = Number(item.value);
  const stage = item.stage;
  const idx = item.index;
  await run(
    async () => {
      const r = await writeMouseDpi(idx, dpi, stage);
      if (!r.ok) {
        console.warn("writeMouseDpi", r);
        return false;
      }
      return true;
    },
    `档位 ${stage} → ${dpi} DPI`,
    "DPI 写入失败，请打开 /diag/dpi 诊断"
  );
}

async function setDpiFine(val) {
  const idx = Math.max(0, (currentStage.value || 1) - 1);
  const stage = Number(currentStage.value || 1);
  const dpi = Number(val);
  if (!Number.isFinite(dpi) || dpi < DPI_MIN || dpi > DPI_MAX) return;
  await run(
    async () => {
      const r = await writeMouseDpi(idx, dpi, stage);
      if (!r.ok) return false;
      return true;
    },
    `DPI ${dpi}`,
    "DPI 写入失败，请打开 /diag/dpi 诊断"
  );
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

let dpiInputTimer;
function onDpiSliderInput(v) {
  clearTimeout(dpiInputTimer);
  dpiInputTimer = setTimeout(() => setDpiFine(v), 400);
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

        <span class="panel-badge muted">板载</span>

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



    <section class="panel-compact panel-equal">

      <header class="panel-compact-head">

        <h3>DPI</h3>

      </header>

      <div class="dpi-hero-num">

        <strong>{{ activeDpi }}</strong>

        <span>当前档位 {{ currentStage }} · {{ STAGE_COUNT }} 档固定 · {{ DPI_STEP }} 步进</span>

      </div>

      <div class="chip-row">

        <button
          v-for="item in presetList"
          :key="item.stage"
          type="button"
          class="chip-btn"
          :class="{ active: presetActive(item) }"
          @click="applyDpiPreset(item)"
        >
          <span class="chip-main">{{ item.value }}</span>
          <small class="chip-sub">档{{ item.stage }}</small>
        </button>

      </div>

      <div class="compact-slider">

        <label><span>精细调节</span><span>{{ activeDpi }}</span></label>

        <input
          :key="'dpi-range-' + activeDpi + '-' + currentStage"
          :value="activeDpi"
          type="range"
          :min="DPI_MIN"
          :max="DPI_MAX"
          :step="DPI_STEP"
          @input="onDpiSliderInput($event.target.value)"
        />

      </div>

      <p class="dpi-hint panel-grow-end">
        点预设会<strong>写入并切换到对应档位</strong>。无效时请打开
        <router-link to="/diag/dpi">DPI 诊断</router-link>。
      </p>
    </section>



    <section class="panel-compact panel-equal">

      <header class="panel-compact-head">

        <h3>LOD · 回报率</h3>

      </header>

      <p class="panel-hint lod-hint">当前 LOD：<strong>{{ currentLodLabel }}</strong></p>

      <div class="chip-row lod-row">

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

      <p class="panel-hint rate-hint">回报率 · 当前 <strong class="accent">{{ reportRate }} Hz</strong></p>

      <div class="chip-row rate-row">

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

    </section>



    <section class="panel-compact perf-sensor-panel perf-span-2col">

      <header class="panel-compact-head">

        <h3>传感器选项</h3>

      </header>

      <div class="sensor-toggle-grid">

        <div class="sensor-toggle-card">

          <div class="sensor-toggle-text">

            <span class="title">移动同步</span>

            <span class="sub">高刷新率下减少抖动</span>

          </div>

          <label class="switch-wrap">

            <input

              type="checkbox"

              :checked="sensor.motionSync"

              @change="setMotionSync($event.target.checked)"

            />

            <span class="switch-ui" aria-hidden="true" />

          </label>

        </div>

        <div class="sensor-toggle-card">

          <div class="sensor-toggle-text">

            <span class="title">直线修正</span>

            <span class="sub">竞技场景建议关闭</span>

          </div>

          <label class="switch-wrap">

            <input

              type="checkbox"

              :checked="sensor.angle"

              @change="setAngle($event.target.checked)"

            />

            <span class="switch-ui" aria-hidden="true" />

          </label>

        </div>

      </div>

    </section>



    <aside class="perf-visual perf-visual-side">
      <DeviceSidePanel :status="sideStatus" :loading="sideLoading" />
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

.rate-hint {

  margin-top: 0.35rem;

}

.panel-grow-end {
  margin-top: auto;
  padding-top: 0.35rem;
}
.dpi-hint {
  font-size: 0.65rem;
  color: var(--tx3);
  line-height: 1.45;
  margin: 0.5rem 0 0;
}
.dpi-hint a {
  color: var(--acd);
  font-weight: 600;
}
.chip-btn .chip-main {
  display: block;
  font-weight: 700;
}
.chip-btn .chip-sub {
  display: block;
  font-size: 0.58rem;
  opacity: 0.75;
  font-weight: 500;
}
</style>


