<script setup>
import { computed } from "vue";
import { useHidAction } from "@/composables/useHidAction.js";
import { injectKeysPage } from "../useKeysPageInject.js";

const { HID, mouseCfg, selectedBtn, selectedLabel } = injectKeysPage();
const { run } = useHidAction();
const MKF = HID.MouseKeyFunction;

const macros = computed(() => mouseCfg.value.macros || []);

async function assignMacro(i) {
  await run(
    () =>
      HID.Set_MS_KeyFunction(selectedBtn.value, { type: MKF.Macro, param: i }),
    `${selectedLabel.value} → 宏 ${i + 1}`
  );
}
</script>

<template>
  <div class="keys-macro-layout">
    <aside class="macro-list-panel">
      <div class="macro-toolbar">
        <button type="button" class="keys-func-btn" disabled title="后续版本">
          导入
        </button>
        <button type="button" class="keys-func-btn" disabled title="后续版本">
          导出
        </button>
        <button type="button" class="keys-func-btn" disabled title="后续版本">
          + 新建
        </button>
      </div>
      <ul v-if="macros.length" class="macro-list">
        <li v-for="(m, i) in macros" :key="i">
          <button type="button" class="macro-list-btn" @click="assignMacro(i)">
            {{ m.name || `宏 ${i + 1}` }}
          </button>
        </li>
      </ul>
      <p v-else class="macro-empty">
        空空如也，连接设备后可读取板载宏，或等待后续「新建宏」功能。
      </p>
    </aside>
    <section class="macro-editor-panel">
      <p class="macro-editor-title">宏录制</p>
      <p class="macro-editor-hint">
        将 {{ selectedLabel }} 绑定为宏后，在左侧列表选择宏槽位。完整录制编辑器将在下一版接入 SDK。
      </p>
      <div class="macro-placeholder">
        <span>开始录制</span>
        <small>（开发中）</small>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* layout in keys-workspace.css */
.macro-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}
.macro-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-height: min(180px, 20vh);
  overflow-y: auto;
}
.macro-list-btn {
  width: 100%;
  text-align: left;
  padding: 0.4rem 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}
.macro-list-btn:hover {
  border-color: var(--ac);
}
.macro-empty {
  margin: 0;
  font-size: 0.7rem;
  color: var(--tx3);
  line-height: 1.45;
}
.macro-editor-title {
  margin: 0 0 0.35rem;
  font-size: 0.82rem;
  font-weight: 700;
}
.macro-editor-hint {
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  color: var(--tx3);
  line-height: 1.45;
}
.macro-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 120px;
  border-radius: 10px;
  border: 1px dashed var(--bd2);
  background: var(--bg2);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--tx3);
}
.macro-placeholder small {
  font-weight: 500;
  opacity: 0.8;
}
@media (max-width: 720px) {
  .keys-macro-layout {
    grid-template-columns: 1fr;
  }
}
</style>
