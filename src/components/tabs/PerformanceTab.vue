<script setup>

import { computed, inject } from "vue";

import { useDevice } from "@/composables/useDevice.js";

import { useHidAction } from "@/composables/useHidAction.js";
import { writeMouseDpi } from "@/composables/useDpiWrite.js";
import { getDpiStageIndex, getDpiStageLabel } from "@/composables/useDpiStageIndex.js";

import { PRODUCT } from "@/config/terra-pro.js";

import DeviceSidePanel from "@/components/device/DeviceSidePanel.vue";



const { HID, mouseCfg, deviceInfo, isReady } = useDevice();

const { run } = useHidAction();

const deviceStatus = inject("deviceStatus", null);
const sideStatus = computed(() => deviceStatus?.detail?.value ?? deviceStatus?.detail ?? null);
const sideLoading = computed(
  () => !!(deviceStatus?.booting?.value || deviceStatus?.refreshing?.value)
);

/** 仅首次从未连上时显示；浅睡/重连不再闪黄条 */
const showPreviewWarn = computed(() => {
  const mode = deviceStatus?.showPreviewMode;
  return !!(mode?.value ?? mode);
});

const PRESETS = PRODUCT.defaultDpiPresets;

const DPI_MIN = PRODUCT.dpiMin;

const DPI_MAX = PRODUCT.dpiMax;

const DPI_STEP = PRODUCT.dpiStep;

const LOD_LEVELS = PRODUCT.lodLevels;

const profileNames = ["竞技", "办公", "FPS", "自定义"];

const reportRates = [125, 250, 500, 1000, 2000, 4000, 8000];



const maxHz = computed(() => deviceInfo.maxReportRate || PRODUCT.maxReportRate);

const STAGE_COUNT = PRODUCT.defaultDpiStageCount;

const stageRows = computed(() =>
  Array.from({ length: STAGE_COUNT }, (_, i) => ({
    index: i,
    stage: i + 1,
  }))
);

const activeDpi = computed(() => {
  const i = getDpiStageIndex(mouseCfg.value);
  return mouseCfg.value.dpis[i]?.value ?? 0;
});

const currentStageIndex = computed(() => getDpiStageIndex(mouseCfg.value));

/** 各档 Flash 中的 DPI（与接收器一致） */
const stageDpisFromDevice = computed(() =>
  Array.from({ length: STAGE_COUNT }, (_, i) => {
    const v = mouseCfg.value.dpis[i]?.value;
    return v != null && v > 0 ? v : PRODUCT.defaultDpiPresets[i] ?? DPI_MIN;
  })
);

const stageEdits = ref([...PRODUCT.defaultDpiPresets]);

/** 当前档正在编辑时的统一数值：滑条与顶部大数字以此为准 */
const fineDraft = ref(null);

const heroDpi = computed(() =>
  fineDraft.value != null ? fineDraft.value : activeDpi.value
);

watch(
  stageDpisFromDevice,
  (vals) => {
    const cur = currentStageIndex.value;
    stageEdits.value = vals.map((v, i) => {
      if (i === cur && fineDraft.value != null) return fineDraft.value;
      return v;
    });
  },
  { immediate: true }
);

watch(
  () => [activeDpi.value, currentStageIndex.value],
  () => {
    fineDraft.value = null;
  }
);

function dpiForSave(index) {
  if (index === currentStageIndex.value) {
    return clampDpi(fineDraft.value ?? stageEdits.value[index] ?? activeDpi.value);
  }
  return clampDpi(stageEdits.value[index]);
}

function clampDpi(dpi) {
  const n = Number(dpi);
  if (!Number.isFinite(n)) return DPI_MIN;
  const snapped = Math.round(n / DPI_STEP) * DPI_STEP;
  return Math.min(DPI_MAX, Math.max(DPI_MIN, snapped));
}

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



function stageIsActive(index) {
  return currentStageIndex.value === index;
}

async function selectStage(index) {
  if (stageIsActive(index)) return;
  await run(
    async () => {
      const ok = await HID.Set_MS_CurrentDPI(index);
      return ok !== false;
    },
    `切换到第 ${index + 1} 档`
  );
}

async function saveStageSlot(index) {
  const dpi = dpiForSave(index);
  stageEdits.value[index] = dpi;
  if (index === currentStageIndex.value) fineDraft.value = dpi;
  const applyStage = stageIsActive(index);
  await run(
    async () => {
      const r = await writeMouseDpi(index, dpi, { applyStage });
      if (!r.ok) {
        console.warn("writeMouseDpi", r);
        return false;
      }
      return true;
    },
    `第 ${index + 1} 档已保存 ${dpi} DPI`,
    "DPI 写入失败，请打开 /diag/dpi 诊断"
  );
}

async function saveFineToCurrentStage() {
  const idx = currentStageIndex.value;
  const dpi = dpiForSave(idx);
  fineDraft.value = dpi;
  stageEdits.value[idx] = dpi;
  await run(
    async () => {
      const r = await writeMouseDpi(idx, dpi);
      if (!r.ok) return false;
      fineDraft.value = null;
      return true;
    },
    `当前档已保存 ${dpi} DPI`,
    "DPI 写入失败，请打开 /diag/dpi 诊断"
  );
}

/** 改当前档数字时同步滑条/大数字；非当前档只改本档输入框 */
function onStageInput(index, raw) {
  const dpi = clampDpi(raw);
  stageEdits.value[index] = dpi;
  if (stageIsActive(index)) {
    fineDraft.value = dpi;
  }
}

function onSliderInput(v) {
  const dpi = clampDpi(v);
  fineDraft.value = dpi;
  stageEdits.value[currentStageIndex.value] = dpi;
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

    <p v-if="showPreviewWarn" class="tab-warn-compact perf-span-full">
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
        <strong>{{ heroDpi }}</strong>
      </div>

      <div class="dpi-stage-grid">
        <div
          v-for="row in stageRows"
          :key="row.index"
          class="dpi-stage-card"
          :class="{ active: stageIsActive(row.index) }"
          @click="selectStage(row.index)"
        >
          <span class="dpi-stage-label">档{{ row.stage }}</span>
          <input
            type="number"
            class="dpi-stage-input"
            :min="DPI_MIN"
            :max="DPI_MAX"
            :step="DPI_STEP"
            :value="stageIsActive(row.index) ? heroDpi : stageEdits[row.index]"
            @click.stop
            @input="onStageInput(row.index, $event.target.value)"
          />
          <button
            type="button"
            class="dpi-stage-save"
            :disabled="!isReady"
            @click.stop="saveStageSlot(row.index)"
          >
            保存
          </button>
        </div>
      </div>

      <div class="compact-slider dpi-fine-block">
        <label><span>精细调节</span><span>{{ heroDpi }}</span></label>
        <input
          :value="heroDpi"
          type="range"
          :min="DPI_MIN"
          :max="DPI_MAX"
          :step="DPI_STEP"
          :disabled="!isReady"
          @input="onSliderInput($event.target.value)"
        />
        <button
          type="button"
          class="dpi-save-current"
          :disabled="!isReady"
          @click="saveFineToCurrentStage"
        >
          保存到当前档
        </button>
      </div>
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
.dpi-hero-num span {
  display: none;
}
.dpi-stage-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.45rem;
  margin-bottom: 0.65rem;
}
.dpi-stage-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.45rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2, #f5f5f5);
  cursor: pointer;
}
.dpi-stage-card.active {
  border-color: var(--acd);
  background: color-mix(in srgb, var(--acd) 12%, transparent);
}
.dpi-stage-label {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--tx3);
  white-space: nowrap;
}
.dpi-stage-input {
  width: 100%;
  min-width: 0;
  padding: 0.25rem 0.35rem;
  border: 1px solid var(--bd);
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
  background: var(--bg, #fff);
  color: var(--tx);
}
.dpi-stage-save {
  padding: 0.2rem 0.45rem;
  border: none;
  border-radius: 6px;
  font-size: 0.62rem;
  font-weight: 600;
  background: var(--tx);
  color: var(--bg);
  cursor: pointer;
}
.dpi-stage-save:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.dpi-fine-block {
  margin-top: 0.15rem;
}
.dpi-save-current {
  width: 100%;
  margin-top: 0.45rem;
  padding: 0.45rem 0.65rem;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--acd);
  color: #fff;
  cursor: pointer;
}
.dpi-save-current:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>


