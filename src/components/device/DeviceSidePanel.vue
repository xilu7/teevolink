<script setup>
import { computed } from "vue";
import { BRAND_ASSETS } from "@/config/brand.js";

const PROFILE_NAMES = ["竞技", "办公", "FPS", "自定义"];

function profileLabel(n) {
  const i = Number(n) - 1;
  return PROFILE_NAMES[i] ?? `配置 ${n}`;
}

const props = defineProps({
  /** { name, receiver, link, battery, dpi, hz, profile } */
  status: { type: Object, default: null },
  loading: { type: Boolean, default: false },
});

const chips = computed(() => {
  const s = props.status;
  if (!s) return [];
  const rows = [
    { label: "设备", value: s.name, accent: true },
    { label: "接收器", value: s.receiver },
    { label: "连接", value: s.link, live: s.ready },
    s.battery != null && s.battery !== "" ? { label: "电量", value: s.battery } : null,
    s.dpi != null ? { label: "DPI", value: String(s.dpi), accent: true } : null,
    s.hz != null ? { label: "回报率", value: `${s.hz} Hz` } : null,
    s.profile != null ? { label: "场景", value: profileLabel(s.profile) } : null,
  ];
  return rows.filter(Boolean);
});
</script>

<template>
  <div class="device-side-panel">
    <header class="side-head">
      <span class="side-title">设备状态</span>
      <span v-if="loading" class="side-loading">同步中</span>
      <span v-else-if="status?.ready" class="side-dot on" title="已连接" />
    </header>

    <ul v-if="chips.length" class="side-stats">
      <li v-for="(row, i) in chips" :key="i" class="side-stat" :class="{ accent: row.accent }">
        <span class="stat-label">{{ row.label }}</span>
        <span class="stat-value" :class="{ live: row.live }">{{ row.value }}</span>
      </li>
    </ul>

    <div class="side-mouse">
      <img :src="BRAND_ASSETS.mouseFront" alt="Terra Pro" loading="lazy" />
    </div>
  </div>
</template>

<style scoped>
.device-side-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.side-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.side-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--tx);
}
.side-loading {
  font-size: 0.62rem;
  color: var(--tx3);
  margin-left: auto;
}
.side-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: auto;
  background: var(--bd);
}
.side-dot.on {
  background: var(--ac);
  box-shadow: 0 0 0 3px var(--acl);
}
.side-stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border: 1px solid var(--bd);
  border-radius: 10px;
  background: var(--bg);
  padding: 0.5rem 0.55rem;
}
.side-stat {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 0.65rem;
  line-height: 1.35;
}
.stat-label {
  color: var(--tx3);
  flex-shrink: 0;
}
.stat-value {
  color: var(--tx2);
  font-weight: 600;
  text-align: right;
  word-break: break-word;
}
.side-stat.accent .stat-value {
  color: var(--acd);
  font-weight: 800;
  font-size: 0.72rem;
}
.stat-value.live {
  color: var(--ac);
}
.side-mouse {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0 0;
  margin-top: auto;
}
.side-mouse img {
  width: 100%;
  max-width: 168px;
  max-height: min(120px, 18vh);
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.14));
}
</style>
