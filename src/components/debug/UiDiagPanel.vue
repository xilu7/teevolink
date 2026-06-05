<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { BUILD_TAG } from "@/config/build.js";
import { useDevice } from "@/composables/useDevice.js";
import { useConnectionDisplay } from "@/composables/useConnectionDisplay.js";
import {
  uiDiagEnabled,
  useUiDiagLines,
  clearUiDiag,
  copyUiDiagReport,
  uiDiagLog,
} from "@/composables/useUiDiag.js";

const props = defineProps({
  page: { type: String, default: "app" },
  extra: { type: Object, default: () => ({}) },
});

const open = ref(true);
const copied = ref(false);
const enabled = uiDiagEnabled();
const logLines = useUiDiagLines();

const {
  deviceOpen,
  isReady,
  connecting,
  online,
  connectStateLabel,
  deviceInfo,
} = useDevice();
const { displayReady, wasEverReady, statusText } = useConnectionDisplay();

const snapshot = computed(() => ({
  页面: props.page,
  版本: BUILD_TAG,
  顶栏状态: statusText.value,
  deviceOpen: deviceOpen.value,
  isReady: isReady.value,
  displayReady: displayReady.value,
  wasEverReady: wasEverReady.value,
  connecting: connecting.value,
  online: online.value,
  SDK状态: connectStateLabel.value,
  connectState: deviceInfo.connectState,
  lastSyncError: deviceInfo.lastSyncError || "—",
  ...props.extra,
}));

let tick;
onMounted(() => {
  if (!enabled) return;
  uiDiagLog("diag", "面板已开启", { page: props.page, build: BUILD_TAG });
  tick = setInterval(() => {
    uiDiagLog("heartbeat", props.page, {
      isReady: isReady.value,
      displayReady: displayReady.value,
      connecting: connecting.value,
    });
  }, 8000);
});
onUnmounted(() => {
  if (tick) clearInterval(tick);
});

async function onCopy() {
  copied.value = await copyUiDiagReport(snapshot.value);
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <aside v-if="enabled" class="ui-diag-panel" :class="{ collapsed: !open }">
    <header class="ui-diag-head">
      <strong>诊断</strong>
      <span class="ui-diag-ver">{{ BUILD_TAG }}</span>
      <button type="button" class="ui-diag-btn" @click="open = !open">
        {{ open ? "收起" : "展开" }}
      </button>
    </header>
    <div v-show="open" class="ui-diag-body">
      <dl class="ui-diag-kv">
        <template v-for="(val, key) in snapshot" :key="key">
          <dt>{{ key }}</dt>
          <dd>{{ val }}</dd>
        </template>
      </dl>
      <pre class="ui-diag-log">{{ logLines.join("\n") || "（暂无事件）" }}</pre>
      <div class="ui-diag-actions">
        <button type="button" class="ui-diag-btn" @click="onCopy">
          {{ copied ? "已复制" : "复制全部" }}
        </button>
        <button type="button" class="ui-diag-btn" @click="clearUiDiag">清空日志</button>
      </div>
      <p class="ui-diag-hint">截图本面板发给我即可。关闭：去掉地址栏 ?diag=1</p>
    </div>
  </aside>
</template>

<style scoped>
.ui-diag-panel {
  position: fixed;
  right: 0.65rem;
  bottom: 5.5rem;
  z-index: 9000;
  width: min(320px, calc(100vw - 1.2rem));
  max-height: min(52vh, 420px);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid var(--bd);
  background: color-mix(in srgb, var(--bg) 92%, #1a1a1a);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  font-size: 0.62rem;
  line-height: 1.4;
  color: var(--tx2);
}
.ui-diag-panel.collapsed {
  max-height: none;
}
.ui-diag-head {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.55rem;
  border-bottom: 1px solid var(--bd);
  background: var(--bg2);
}
.ui-diag-head strong {
  color: var(--tx);
  font-size: 0.68rem;
}
.ui-diag-ver {
  color: var(--tx3);
  margin-right: auto;
}
.ui-diag-body {
  overflow: auto;
  padding: 0.45rem 0.55rem 0.5rem;
}
.ui-diag-kv {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.15rem 0.45rem;
  margin: 0 0 0.4rem;
}
.ui-diag-kv dt {
  color: var(--tx3);
  margin: 0;
}
.ui-diag-kv dd {
  margin: 0;
  word-break: break-all;
  color: var(--tx);
  font-weight: 600;
}
.ui-diag-log {
  margin: 0 0 0.4rem;
  padding: 0.35rem 0.4rem;
  border-radius: 8px;
  background: #1a1a1a;
  color: #b8e986;
  font-family: Consolas, "Courier New", monospace;
  font-size: 0.58rem;
  line-height: 1.45;
  max-height: 140px;
  overflow: auto;
  white-space: pre-wrap;
}
.ui-diag-actions {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.ui-diag-btn {
  padding: 0.28rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  color: var(--tx);
  font-size: 0.62rem;
  cursor: pointer;
}
.ui-diag-hint {
  margin: 0.35rem 0 0;
  color: var(--tx3);
  font-size: 0.58rem;
}
</style>
