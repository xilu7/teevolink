<script setup>
import { computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { PRODUCT } from "@/config/terra-pro.js";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";

const props = defineProps({
  booting: { type: Boolean, default: false },
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
  const i = Math.max(0, (mouseCfg.value.currentDpi || 1) - 1);
  return mouseCfg.value.dpis?.[i]?.value ?? "—";
});

const reportHz = computed(() =>
  isReady.value ? `${mouseCfg.value.reportRate} Hz` : "—"
);

const batteryText = computed(() => {
  if (!deviceOpen.value) return "—";
  const lv = battery.value?.level;
  if (lv == null) return connecting.value ? "读取中…" : "—";
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
  if (props.booting) return "正在连接…";
  if (isReady.value) return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
  if (connecting.value) return "同步参数中…";
  if (deviceOpen.value && online.value) return "鼠标在线 · 同步中";
  if (deviceOpen.value) return "接收器已授权 · 等待鼠标";
  return "未连接";
});
</script>

<template>
  <section class="home-device-card">
    <div class="card-visual">
      <MouseShowcase size="md" />
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

      <p v-if="deviceOpen && !isReady" class="card-hint">
        SDK：{{ connectStateLabel }} · 在线 {{ online ? "是" : "否" }}。请底部开关
        <strong>2.4G</strong> 并晃动鼠标。
      </p>

      <div class="card-actions">
        <button
          v-if="!deviceOpen"
          type="button"
          class="btn btn-primary"
          :disabled="booting"
          @click="emit('connect')"
        >
          连接设备
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
            :disabled="booting"
            @click="emit('refresh')"
          >
            {{ booting ? "同步中…" : "重新同步" }}
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
  grid-template-columns: minmax(160px, 0.85fr) minmax(0, 1.4fr);
  gap: 1.25rem;
  padding: 1.15rem 1.2rem;
  border-radius: 14px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  align-items: center;
}
@media (max-width: 720px) {
  .home-device-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
.card-visual {
  padding: 0.75rem;
  border-radius: 12px;
  background: var(--bg);
  border: 1px solid var(--bd);
}
.card-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem 0.6rem;
  margin-bottom: 0.2rem;
}
.card-title {
  font-size: 1.35rem;
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
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tx3);
  margin-bottom: 0.12rem;
}
.param-cell dd {
  margin: 0;
  font-size: 0.88rem;
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
