<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { PRODUCT } from "@/config/terra-pro.js";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";
import { getDpiStageIndex } from "@/composables/useDpiStageIndex.js";

const props = defineProps({
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["connect", "open-settings", "refresh"]);

const {
  deviceOpen,
  isReady,
  online,
  connecting,
  battery,
  mouseCfg,
  deviceInfo,
  dongleTypeLabel,
  connectStateLabel,
  isWired,
} = useDevice();

const activeDpi = computed(() => {
  if (!isReady.value) return "—";
  const i = getDpiStageIndex(mouseCfg.value);
  return mouseCfg.value.dpis?.[i]?.value ?? "—";
});

const reportHz = computed(() =>
  isReady.value ? `${mouseCfg.value.reportRate} Hz` : "—"
);

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

const dongleVer = computed(() => deviceInfo.version?.dongle || "—");
const mouseVer = computed(() => deviceInfo.version?.device || "—");

const statusText = computed(() => {
  if (props.busy) return "正在连接…";
  if (isReady.value) return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
  if (deviceOpen.value && online.value) return "鼠标在线 · 等待同步完成";
  if (deviceOpen.value) return "接收器已就绪";
  return "未连接";
});
</script>

<template>
  <section class="home-device-card">
    <div class="card-visual">
      <MouseShowcase size="hero" show-labels />
    </div>
    <div class="card-body">
      <div class="card-head">
        <h2 class="card-title">{{ PRODUCT.name }}</h2>
        <span class="card-signal" :class="{ on: isReady || online }" title="连接状态" />
        <span class="card-status">{{ statusText }}</span>
      </div>
      <p class="card-sub">{{ dongleTypeLabel }}</p>

      <dl class="param-grid">
        <div class="param-cell">
          <dt>DPI</dt>
          <dd>{{ activeDpi }}</dd>
        </div>
        <div class="param-cell">
          <dt>回报率</dt>
          <dd>{{ reportHz }}</dd>
        </div>
        <div class="param-cell">
          <dt>电量</dt>
          <dd>{{ batteryText }}</dd>
        </div>
        <div class="param-cell">
          <dt>LOD</dt>
          <dd>{{ lodText }}</dd>
        </div>
        <div class="param-cell wide">
          <dt>接收器固件</dt>
          <dd>{{ dongleVer }}</dd>
        </div>
        <div class="param-cell wide">
          <dt>鼠标固件</dt>
          <dd>{{ mouseVer }}</dd>
        </div>
      </dl>

      <p v-if="deviceOpen && !isReady && !busy" class="card-hint">
        请底部开关 <strong>2.4G</strong>，打开电源并晃动鼠标。若超过 20 秒仍未连接，拔插接收器后重试。
      </p>

      <div class="card-actions">
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

<style scoped>
.home-device-card {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, 1.35fr);
  gap: 1.35rem;
  padding: 1.2rem 1.35rem;
  border-radius: 14px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  align-items: stretch;
}
@media (max-width: 720px) {
  .home-device-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
.card-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: 1rem 0.85rem;
  border-radius: 12px;
  background: linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--bg2) 80%, var(--bg)) 100%);
  border: 1px solid var(--bd);
}
.card-visual :deep(.mouse-fig figcaption) {
  font-size: 0.65rem;
  letter-spacing: 0.14em;
}
.card-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem 0.6rem;
  margin-bottom: 0.2rem;
}
.card-title {
  font-size: 1.65rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
}
.card-signal {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--tx3);
  flex-shrink: 0;
}
.card-signal.on {
  background: var(--gn);
  box-shadow: 0 0 0 3px var(--gnl);
}
.card-status {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--tx2);
}
.card-sub {
  font-size: 0.78rem;
  color: var(--tx3);
  margin: 0 0 0.75rem;
}
.param-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.45rem;
  margin: 0 0 0.75rem;
}
@media (max-width: 560px) {
  .param-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.param-cell {
  padding: 0.5rem 0.55rem;
  border-radius: 8px;
  background: var(--bg);
  border: 1px solid var(--bd);
}
.param-cell.wide {
  grid-column: span 2;
}
@media (max-width: 560px) {
  .param-cell.wide {
    grid-column: span 1;
  }
}
.param-cell dt {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tx3);
  margin-bottom: 0.12rem;
}
.param-cell dd {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--tx);
}
.card-hint {
  font-size: 0.78rem;
  color: var(--amx);
  margin: 0 0 0.65rem;
  line-height: 1.45;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.btn {
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--bd2);
}
.btn-primary {
  background: var(--tx);
  color: var(--bg);
  border-color: var(--tx);
}
.btn-secondary {
  background: var(--bg);
  color: var(--tx);
}
.btn:disabled {
  opacity: 0.55;
  cursor: wait;
}
</style>
