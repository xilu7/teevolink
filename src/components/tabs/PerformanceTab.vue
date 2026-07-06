<script setup>

import { computed, inject, ref, watch } from "vue";

import { useDevice } from "@/composables/useDevice.js";

import { useHidAction } from "@/composables/useHidAction.js";
import { writeMouseDpi, writeMouseDpiXY } from "@/composables/useDpiWrite.js";
import { getDpiStageIndex } from "@/composables/useDpiStageIndex.js";

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
  const d = mouseCfg.value.dpis[i];
  return d?.x ?? d?.value ?? 0;
});

const currentStageIndex = computed(() => getDpiStageIndex(mouseCfg.value));

/** 各档 Flash 中的 X DPI */
const stageDpisFromDevice = computed(() =>
  Array.from({ length: STAGE_COUNT }, (_, i) => {
    const d = mouseCfg.value.dpis[i];
    const v = d?.x ?? d?.value;
    return v != null && v > 0 ? v : PRODUCT.defaultDpiPresets[i] ?? DPI_MIN;
  })
);

const stageEdits = ref([...PRODUCT.defaultDpiPresets]);
const stageEditsY = ref([...PRODUCT.defaultDpiPresets]);
const xyIndependent = ref(false);

/** 当前档正在编辑时的统一数值：滑条与顶部大数字以此为准 */
const fineDraft = ref(null);
const fineDraftY = ref(null);
/** 正在键盘输入时，避免设备轮询把数字冲掉 */
const dpiFieldEditing = ref(false);

const activeDpiEntry = computed(() => {
  const i = currentStageIndex.value;
  return mouseCfg.value.dpis[i] || { value: 0, x: 0, y: 0 };
});

const activeDpiX = computed(() => activeDpiEntry.value.x ?? activeDpiEntry.value.value ?? 0);
const activeDpiY = computed(() => {
  const y = activeDpiEntry.value.y;
  return y != null && y > 0 ? y : activeDpiX.value;
});

const heroDpi = computed(() =>
  fineDraft.value != null ? fineDraft.value : activeDpi.value
);

const heroDpiY = computed(() =>
  fineDraftY.value != null ? fineDraftY.value : activeDpiY.value
);

/** 各档 Flash 中的 Y DPI */
const stageDpisYFromDevice = computed(() =>
  Array.from({ length: STAGE_COUNT }, (_, i) => {
    const d = mouseCfg.value.dpis[i];
    const y = d?.y;
    const x = d?.value ?? d?.x;
    if (y != null && y > 0) return y;
    if (x != null && x > 0) return x;
    return PRODUCT.defaultDpiPresets[i] ?? DPI_MIN;
  })
);

watch(
  stageDpisFromDevice,
  (vals) => {
    const cur = currentStageIndex.value;
    stageEdits.value = vals.map((v, i) => {
      if (dpiFieldEditing.value && i === cur) return stageEdits.value[i];
      if (i === cur && fineDraft.value != null) return fineDraft.value;
      return v;
    });
  },
  { immediate: true }
);

watch(
  stageDpisYFromDevice,
  (vals) => {
    const cur = currentStageIndex.value;
    stageEditsY.value = vals.map((v, i) => {
      if (dpiFieldEditing.value && i === cur) return stageEditsY.value[i];
      if (i === cur && fineDraftY.value != null) return fineDraftY.value;
      return v;
    });
  },
  { immediate: true }
);

watch(
  () => [activeDpi.value, activeDpiY.value, currentStageIndex.value],
  () => {
    if (dpiFieldEditing.value) return;
    fineDraft.value = null;
    fineDraftY.value = null;
  }
);

function parseDpiInput(raw, fallback) {
  const text = String(raw ?? "").trim();
  if (!text) return fallback;
  const n = Number(text);
  if (!Number.isFinite(n)) return fallback;
  return clampDpi(n);
}

function markDpiEditing() {
  dpiFieldEditing.value = true;
}

function unmarkDpiEditing() {
  dpiFieldEditing.value = false;
}

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

function dpiYForSave(index) {
  if (index === currentStageIndex.value) {
    return clampDpi(fineDraftY.value ?? stageEditsY.value[index] ?? activeDpiY.value);
  }
  return clampDpi(stageEditsY.value[index]);
}

async function saveStageSlot(index) {
  const dpiX = dpiForSave(index);
  const dpiY = xyIndependent.value ? dpiYForSave(index) : dpiX;
  stageEdits.value[index] = dpiX;
  stageEditsY.value[index] = dpiY;
  if (index === currentStageIndex.value) {
    fineDraft.value = dpiX;
    fineDraftY.value = dpiY;
  }
  const applyStage = stageIsActive(index);
  const label = xyIndependent.value ? `${dpiX}×${dpiY}` : `${dpiX}`;
  await run(
    async () => {
      const r = xyIndependent.value
        ? await writeMouseDpiXY(index, dpiX, dpiY, { applyStage })
        : await writeMouseDpi(index, dpiX, { applyStage });
      if (!r.ok) {
        console.warn("writeMouseDpi", r);
        return false;
      }
      return true;
    },
    `第 ${index + 1} 档已保存 ${label} DPI`,
    "DPI 写入失败，请打开 /diag/dpi 诊断"
  );
}

async function saveFineToCurrentStage() {
  const idx = currentStageIndex.value;
  const dpiX = dpiForSave(idx);
  const dpiY = xyIndependent.value ? dpiYForSave(idx) : dpiX;
  fineDraft.value = dpiX;
  fineDraftY.value = dpiY;
  stageEdits.value[idx] = dpiX;
  stageEditsY.value[idx] = dpiY;
  const label = xyIndependent.value ? `${dpiX}×${dpiY}` : `${dpiX}`;
  await run(
    async () => {
      const r = xyIndependent.value
        ? await writeMouseDpiXY(idx, dpiX, dpiY)
        : await writeMouseDpi(idx, dpiX);
      if (!r.ok) return false;
      fineDraft.value = null;
      fineDraftY.value = null;
      return true;
    },
    `当前档已保存 ${label} DPI`,
    "DPI 写入失败，请打开 /diag/dpi 诊断"
  );
}

/** 数字框：失焦/回车后再对齐 50 步进，避免输入 400 时先变成 50 */
function onStageChange(index, raw) {
  unmarkDpiEditing();
  const dpi = parseDpiInput(raw, stageEdits.value[index]);
  stageEdits.value[index] = dpi;
  if (stageIsActive(index)) {
    fineDraft.value = dpi;
    if (!xyIndependent.value) {
      fineDraftY.value = dpi;
      stageEditsY.value[index] = dpi;
    }
  }
}

function onStageChangeY(index, raw) {
  unmarkDpiEditing();
  const dpi = parseDpiInput(raw, stageEditsY.value[index]);
  stageEditsY.value[index] = dpi;
  if (stageIsActive(index)) fineDraftY.value = dpi;
}

function onSliderInput(v) {
  const dpi = clampDpi(v);
  fineDraft.value = dpi;
  stageEdits.value[currentStageIndex.value] = dpi;
  if (!xyIndependent.value) {
    fineDraftY.value = dpi;
    stageEditsY.value[currentStageIndex.value] = dpi;
  }
}

function onSliderInputY(v) {
  const dpi = clampDpi(v);
  fineDraftY.value = dpi;
  stageEditsY.value[currentStageIndex.value] = dpi;
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

async function setFps20k(on) {
  await run(
    () => HID.Set_MS_SensorFPS20K(on ? 1 : 0),
    on ? "20K 帧率已开启" : "20K 帧率已关闭"
  );
}

const fps20kOn = computed(() => !!sensor.value.fps20k);

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



    <section class="panel-compact panel-equal dpi-panel">

      <header class="panel-compact-head dpi-panel-head">

        <h3>DPI</h3>

        <label class="dpi-xy-toggle">
          <span class="dpi-xy-toggle-label">X/Y 独立</span>
          <span class="switch-wrap switch-wrap-sm">
            <input v-model="xyIndependent" type="checkbox" />
            <span class="switch-ui" aria-hidden="true" />
          </span>
        </label>

      </header>

      <p class="panel-hint dpi-step-hint">DPI 范围 {{ DPI_MIN }}–{{ DPI_MAX }}，步进 {{ DPI_STEP }}</p>

      <div v-if="!xyIndependent" class="dpi-hero-num">
        <strong>{{ heroDpi }}</strong>
      </div>
      <div v-else class="dpi-hero-dual">
        <div class="dpi-hero-axis">
          <span class="axis-tag">X</span>
          <strong>{{ heroDpi }}</strong>
        </div>
        <div class="dpi-hero-axis">
          <span class="axis-tag">Y</span>
          <strong>{{ heroDpiY }}</strong>
        </div>
      </div>

      <div class="dpi-stage-grid" :class="{ 'dpi-stage-grid--xy': xyIndependent }">
        <div
          v-for="row in stageRows"
          :key="row.index"
          class="dpi-stage-card"
          :class="{ active: stageIsActive(row.index), 'dpi-stage-card--xy': xyIndependent }"
          @click="selectStage(row.index)"
        >
          <span class="dpi-stage-label">档{{ row.stage }}</span>
          <div v-if="xyIndependent && stageIsActive(row.index)" class="dpi-stage-xy-inputs" @click.stop>
            <input
              type="number"
              class="dpi-stage-input"
              :min="DPI_MIN"
              :max="DPI_MAX"
              step="1"
              inputmode="numeric"
              placeholder="X"
              :value="heroDpi"
              @focus="markDpiEditing"
              @change="onStageChange(row.index, $event.target.value)"
            />
            <input
              type="number"
              class="dpi-stage-input"
              :min="DPI_MIN"
              :max="DPI_MAX"
              step="1"
              inputmode="numeric"
              placeholder="Y"
              :value="heroDpiY"
              @focus="markDpiEditing"
              @change="onStageChangeY(row.index, $event.target.value)"
            />
          </div>
          <input
            v-else
            type="number"
            class="dpi-stage-input"
            :min="DPI_MIN"
            :max="DPI_MAX"
            step="1"
            inputmode="numeric"
            :value="stageIsActive(row.index) ? heroDpi : stageEdits[row.index]"
            @click.stop
            @focus="markDpiEditing"
            @change="onStageChange(row.index, $event.target.value)"
          />
          <button
            type="button"
            class="dpi-stage-save"
            :disabled="!isReady"
            @click.stop="saveStageSlot(row.index)"
          >
            保存
          </button>
          <span
            v-if="xyIndependent && !stageIsActive(row.index) && stageEdits[row.index] !== stageEditsY[row.index]"
            class="dpi-stage-xy-hint"
          >
            Y {{ stageEditsY[row.index] }}
          </span>
        </div>
      </div>

      <div class="compact-slider dpi-fine-block">
        <label>
          <span>{{ xyIndependent ? "X 轴精细调节" : "精细调节" }}</span>
          <span>{{ heroDpi }}</span>
        </label>
        <input
          :value="heroDpi"
          type="range"
          :min="DPI_MIN"
          :max="DPI_MAX"
          :step="DPI_STEP"
          :disabled="!isReady"
          @input="onSliderInput($event.target.value)"
        />
        <template v-if="xyIndependent">
          <label class="dpi-y-slider-label">
            <span>Y 轴精细调节</span>
            <span>{{ heroDpiY }}</span>
          </label>
          <input
            :value="heroDpiY"
            type="range"
            :min="DPI_MIN"
            :max="DPI_MAX"
            :step="DPI_STEP"
            :disabled="!isReady"
            @input="onSliderInputY($event.target.value)"
          />
        </template>
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

        <div v-if="PRODUCT.sensorFps20k" class="sensor-toggle-card">

          <div class="sensor-toggle-text">

            <span class="title">20K 帧率</span>

            <span class="sub">传感器高采样模式，可能增加功耗</span>

          </div>

          <label class="switch-wrap">

            <input

              type="checkbox"

              :checked="fps20kOn"

              :disabled="!isReady"

              @change="setFps20k($event.target.checked)"

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
.dpi-step-hint {
  margin-top: -0.25rem;
  margin-bottom: 0.45rem;
}
.dpi-hero-num span {
  display: none;
}
.dpi-panel-head {
  align-items: center;
}
.dpi-xy-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  margin-left: auto;
}
.dpi-xy-toggle-label {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--tx3);
  white-space: nowrap;
}
.switch-wrap-sm .switch-ui {
  width: 36px;
  height: 20px;
}
.switch-wrap-sm .switch-ui::after {
  width: 14px;
  height: 14px;
  top: 3px;
  left: 3px;
}
.switch-wrap-sm input:checked + .switch-ui::after {
  transform: translateX(16px);
}
.dpi-hero-dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  margin-bottom: 0.55rem;
}
.dpi-hero-axis {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2, #f5f5f5);
}
.dpi-hero-axis .axis-tag {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--tx3);
}
.dpi-hero-axis strong {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--acd);
  line-height: 1;
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
.dpi-stage-card--xy.active {
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
}
.dpi-stage-xy-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}
.dpi-stage-xy-hint {
  grid-column: 2;
  font-size: 0.58rem;
  color: var(--tx3);
  line-height: 1.2;
}
.dpi-y-slider-label {
  margin-top: 0.35rem;
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


