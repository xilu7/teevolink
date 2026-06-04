<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { PRODUCT } from "@/config/terra-pro.js";
import { getDpiStageIndex } from "@/composables/useDpiStageIndex.js";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";

const props = defineProps({
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["connect", "open-settings", "refresh"]);

const {
  deviceOpen,
  isReady,
  online,
  battery,
  mouseCfg,
  deviceInfo,
  dongleTypeLabel,
  isWired,
} = useDevice();

const reportHz = computed(() =>
  isReady.value ? `${mouseCfg.value.reportRate} Hz` : "—"
);

const dpiText = computed(() => {
  if (!isReady.value) return "—";
  const i = getDpiStageIndex(mouseCfg.value);
  const v = mouseCfg.value.dpis?.[i]?.value;
  return v != null ? String(v) : "—";
});

const batteryText = computed(() => {
  if (!deviceOpen.value || props.busy) return "—";
  const lv = battery.value?.level;
  if (lv == null) return "—";
  return `${lv}%`;
});

const lodText = computed(() => {
  if (!isReady.value) return "—";
  const lod = mouseCfg.value.sensor?.lod;
  const item = PRODUCT.lodLevels.find((l) => l.value === lod);
  return item ? item.height : String(lod ?? "—");
});

const dongleVer = computed(() =>
  deviceOpen.value ? deviceInfo.version?.dongle || "—" : "—"
);
const mouseVer = computed(() =>
  deviceOpen.value ? deviceInfo.version?.device || "—" : "—"
);

const statusText = computed(() => {
  if (props.busy) return "正在连接…";
  if (isReady.value) return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
  if (deviceOpen.value && online.value) return "鼠标在线";
  if (deviceOpen.value) return "接收器已就绪";
  return "未连接";
});

const signalOn = computed(() => isReady.value || online.value);
</script>

<template>
  <section class="home-hero-panel" aria-label="设备信息">
    <div class="home-hero-visual">
      <MouseShowcase front-only home-front />
    </div>

    <div class="home-spec-card">
      <div>
        <div class="home-product-head">
          <h2 class="home-product-name">{{ PRODUCT.name }}</h2>
          <span
            class="home-product-signal"
            :class="{ on: signalOn }"
            title="连接状态"
          />
          <span class="home-product-status">{{ statusText }}</span>
        </div>
        <p class="home-product-sub">{{ dongleTypeLabel }}</p>
      </div>

      <dl class="home-spec-grid">
        <div class="home-spec-cell">
          <dt>DPI</dt>
          <dd>{{ dpiText }}</dd>
        </div>
        <div class="home-spec-cell">
          <dt>回报率</dt>
          <dd>{{ reportHz }}</dd>
        </div>
        <div class="home-spec-cell">
          <dt>电量</dt>
          <dd>{{ batteryText }}</dd>
        </div>
        <div class="home-spec-cell">
          <dt>LOD</dt>
          <dd>{{ lodText }}</dd>
        </div>
        <div class="home-spec-cell">
          <dt>接收器固件</dt>
          <dd>{{ dongleVer }}</dd>
        </div>
        <div class="home-spec-cell">
          <dt>鼠标固件</dt>
          <dd>{{ mouseVer }}</dd>
        </div>
      </dl>

      <div class="home-spec-actions">
        <button
          v-if="!deviceOpen"
          type="button"
          class="btn btn-primary"
          :disabled="busy"
          @click="emit('connect')"
        >
          {{ busy ? "连接中…" : "连接设备" }}
        </button>
        <template v-else>
          <button
            v-if="isReady"
            type="button"
            class="btn btn-primary"
            @click="emit('open-settings')"
          >
            打开驱动设置
          </button>
          <button
            v-else
            type="button"
            class="btn btn-secondary"
            :disabled="busy"
            @click="emit('refresh')"
          >
            {{ busy ? "连接中…" : "重新同步" }}
          </button>
          <button
            v-if="isReady"
            type="button"
            class="btn btn-secondary"
            @click="emit('refresh')"
          >
            刷新参数
          </button>
        </template>
      </div>
    </div>
  </section>
</template>
