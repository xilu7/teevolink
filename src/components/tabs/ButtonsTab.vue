<script setup>
import { ref, computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { useSettingFeedback } from "@/composables/useSettingFeedback.js";
import SettingCard from "@/components/ui/SettingCard.vue";
import HelpTip from "@/components/ui/HelpTip.vue";
import { MOUSE_BUTTONS } from "@/config/mouse-buttons.js";
import {
  buildBasicFunctions,
  COMBO_KEY_CHARS,
  parseKeyEntry,
} from "@/config/mouse-key-functions.js";

const { HID, mouseCfg } = useDevice();
const { notify } = useSettingFeedback();
const MKF = HID.MouseKeyFunction;

const selectedBtn = ref(0);
const showMacro = ref(false);
const comboSlots = ref(["", "", ""]);

const basicFunctions = computed(() =>
  buildBasicFunctions(MKF).filter(
    (f) => f.type !== MKF.ShortcutKey && f.type !== MKF.Macro
  )
);

const macros = computed(() => mouseCfg.value.macros || []);

const selectedLabel = computed(
  () => MOUSE_BUTTONS.find((b) => b.index === selectedBtn.value)?.label ?? ""
);

function labelForKey(index) {
  const { type, param } = parseKeyEntry(mouseCfg.value.keys?.[index]);
  const fn = buildBasicFunctions(MKF).find((f) => f.type === type && f.param === param);
  if (fn) return fn.label;
  if (type === MKF.ShortcutKey) return "组合键";
  if (type === MKF.Macro) return `宏 ${param + 1}`;
  return "默认";
}

async function assignBasic(fn) {
  await HID.Set_MS_KeyFunction(selectedBtn.value, { type: fn.type, param: fn.param });
  notify(`${selectedLabel.value} → ${fn.label}`);
}

async function applyCombo() {
  const keys = comboSlots.value.filter(Boolean);
  if (!keys.length) return;
  await HID.Set_MS_ShortcutKey(selectedBtn.value, keys);
  await HID.Set_MS_KeyFunction(selectedBtn.value, { type: MKF.ShortcutKey, param: 0 });
  notify(`已为 ${selectedLabel.value} 设置组合键`);
}

async function assignMacro(i) {
  await HID.Set_MS_KeyFunction(selectedBtn.value, { type: MKF.Macro, param: i });
  notify(`已绑定宏 ${i + 1}`);
}
</script>

<template>
  <div class="tab-stack">
    <SettingCard title="选择按键">
      <HelpTip
        text="先点选左侧按键，再选择要分配的功能。改键只影响当前板载配置，不会改动 DPI 与回报率。"
      />
      <div class="btn-pick-grid">
        <button
          v-for="b in MOUSE_BUTTONS"
          :key="b.index"
          type="button"
          class="btn-pick"
          :class="{ active: selectedBtn === b.index }"
          @click="selectedBtn = b.index"
        >
          <span class="btn-pick-name">{{ b.label }}</span>
          <span class="btn-pick-fn">{{ labelForKey(b.index) }}</span>
        </button>
      </div>
    </SettingCard>

    <SettingCard :title="`分配给：${selectedLabel}`" badge="基础">
      <HelpTip text="以下为常用映射。DPI 循环、火力键等适合游戏快捷操作；选「禁用」可屏蔽误触。" />
      <div class="driver-func-grid">
        <button
          v-for="fn in basicFunctions"
          :key="fn.label"
          type="button"
          class="driver-chip"
          @click="assignBasic(fn)"
        >
          {{ fn.label }}
        </button>
      </div>
    </SettingCard>

    <button type="button" class="accordion-trigger" @click="showMacro = !showMacro">
      <span>组合键与宏</span>
      <span class="accordion-meta">{{ showMacro ? "收起" : "可选" }}</span>
      <span class="accordion-chev" :class="{ open: showMacro }">›</span>
    </button>

    <div v-show="showMacro" class="accordion-panel">
      <SettingCard title="组合键（最多 3 键）">
        <HelpTip text="依次点选下方字符填入槽位，完成后点「应用」。适合 Ctrl+C 等快捷操作。" />
        <div class="driver-combo-slots">
          <span v-for="(s, i) in comboSlots" :key="i" class="driver-combo-slot">{{ s || `键${i + 1}` }}</span>
          <button type="button" class="btn btn-secondary" @click="applyCombo">应用</button>
        </div>
        <div class="driver-func-grid compact">
          <button
            v-for="ch in COMBO_KEY_CHARS"
            :key="ch"
            type="button"
            class="driver-chip"
            @click="
              comboSlots[comboSlots.findIndex((x) => !x)] = ch;
              notify(`已填入 ${ch}`);
            "
          >
            {{ ch }}
          </button>
        </div>
      </SettingCard>

      <SettingCard title="宏绑定">
        <HelpTip text="宏需先在设备或完整驱动中录制。此处仅将按键指向已有宏。" />
        <div v-if="macros.length" class="macro-rows">
          <button
            v-for="(m, i) in macros"
            :key="i"
            type="button"
            class="driver-chip"
            @click="assignMacro(i)"
          >
            {{ m.name || `宏 ${i + 1}` }}
          </button>
        </div>
        <p v-else class="empty-hint">暂无宏数据</p>
      </SettingCard>
    </div>
  </div>
</template>

<style scoped>
.tab-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.btn-pick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}
@media (min-width: 600px) {
  .btn-pick-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.btn-pick {
  text-align: left;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--bd);
  border-radius: var(--r);
  background: var(--bg2);
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}
.btn-pick:hover {
  border-color: var(--bd2);
}
.btn-pick.active {
  background: var(--ac);
  border-color: var(--ac);
  color: #fff;
  transform: translateY(-1px);
}
.btn-pick-name {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
}
.btn-pick-fn {
  display: block;
  font-size: 0.68rem;
  opacity: 0.85;
  margin-top: 0.15rem;
}
.driver-func-grid.compact {
  max-height: 160px;
}
.macro-rows {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.empty-hint {
  color: var(--tx3);
  font-size: 0.85rem;
}
.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--bd);
  border-radius: var(--rl);
  background: var(--bg2);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}
.accordion-meta {
  flex: 1;
  text-align: right;
  font-size: 0.78rem;
  color: var(--tx3);
}
.accordion-chev {
  transition: transform 0.2s;
}
.accordion-chev.open {
  transform: rotate(90deg);
}
.accordion-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: panelIn 0.22s ease;
}
@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
