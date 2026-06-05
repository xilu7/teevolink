<script setup>
import { computed } from "vue";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";

const PROFILE_NAMES = ["竞技", "办公", "FPS", "自定义"];

function profileLabel(n) {
  const i = Number(n) - 1;
  return PROFILE_NAMES[i] ?? `配置 ${n}`;
}

const props = defineProps({
  /** { name, receiver, link, battery, dpi, hz, profile, ready, sleeping } */
  status: { type: Object, default: null },
  loading: { type: Boolean, default: false },
});

/** 固定 7 行，睡眠/唤醒行数不变，避免侧栏高度跳动 */
const chips = computed(() => {
  const s = props.status ?? {};
  return [
    { label: "设备", value: s.name ?? "—", accent: true },
    { label: "接收器", value: s.receiver ?? "—" },
    {
      label: "连接",
      value: s.link ?? "—",
      live: !!s.ready,
      sleep: !!s.sleeping,
    },
    { label: "电量", value: s.battery ?? "—" },
    {
      label: "DPI",
      value: s.dpi != null && s.dpi !== "" ? String(s.dpi) : "—",
      accent: true,
      stale: !!s.sleeping,
    },
    {
      label: "回报率",
      value: s.hz != null && s.hz !== "" ? `${s.hz} Hz` : "—",
      stale: !!s.sleeping,
    },
    {
      label: "场景",
      value: s.profile != null ? profileLabel(s.profile) : "—",
    },
  ];
});
</script>

<template>
  <div class="device-side-panel" :class="{ 'is-sleeping': status?.sleeping }">
    <header class="side-head">
      <span class="side-title">设备状态</span>
      <span v-if="loading" class="side-loading">同步中</span>
      <span v-else-if="status?.ready" class="side-dot on" title="已连接" />
      <span v-else-if="status?.sleeping" class="side-dot sleep" title="鼠标休眠" />
    </header>

    <ul class="side-stats">
      <li
        v-for="(row, i) in chips"
        :key="i"
        class="side-stat"
        :class="{ accent: row.accent, stale: row.stale }"
      >
        <span class="stat-label">{{ row.label }}</span>
        <span
          class="stat-value"
          :class="{ live: row.live, sleep: row.sleep }"
        >
          {{ row.value }}
        </span>
      </li>
    </ul>

    <div class="side-mouse">
      <MouseShowcase variant="auxiliary" />
    </div>
  </div>
</template>

<style scoped>
.device-side-panel {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
.side-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  min-height: 1.25rem;
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
  flex-shrink: 0;
}
.side-dot.on {
  background: var(--ac);
  box-shadow: 0 0 0 3px var(--acl);
}
.side-dot.sleep {
  background: var(--tx3);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tx3) 25%, transparent);
}
.side-stats {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0.55rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border: 1px solid var(--bd);
  border-radius: 10px;
  background: var(--bg);
  flex-shrink: 0;
  min-height: 7.35rem;
}
.side-stat {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 0.65rem;
  line-height: 1.35;
  min-height: 0.9rem;
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
.side-stat.stale .stat-value {
  color: var(--tx2);
  opacity: 0.88;
}
.stat-value.live {
  color: var(--ac);
}
.stat-value.sleep {
  color: var(--tx3);
  font-weight: 600;
}
.side-mouse {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 5.75rem;
  padding: 0.1rem 0 0.15rem;
}
</style>
