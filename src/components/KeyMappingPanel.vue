<script setup>
import { ref, computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { MOUSE_BUTTONS } from "@/config/mouse-buttons.js";
import {
  buildBasicFunctions,
  COMBO_KEY_CHARS,
  parseKeyEntry,
} from "@/config/mouse-key-functions.js";

const { HID, mouseCfg } = useDevice();
const MKF = HID.MouseKeyFunction;

const subTab = ref("basic");
const selectedBtn = ref(0);
const comboSlots = ref(["", "", ""]);
const activeSlot = ref(0);

const basicFunctions = computed(() => buildBasicFunctions(MKF));

const currentKey = computed(() => parseKeyEntry(mouseCfg.value.keys?.[selectedBtn.value]));

const macros = computed(() => mouseCfg.value.macros || []);

function labelForKey(index) {
  const { type, param } = parseKeyEntry(mouseCfg.value.keys?.[index]);
  const fn = basicFunctions.value.find((f) => f.type === type && f.param === param);
  if (fn) return fn.label;
  if (type === MKF.ShortcutKey) return "组合键";
  if (type === MKF.Macro) return `宏 #${param}`;
  return `类型 ${type}`;
}

async function assignBasic(fn) {
  if (fn.type === MKF.ShortcutKey) {
    subTab.value = "combo";
    return;
  }
  if (fn.type === MKF.Macro) {
    subTab.value = "macro";
    return;
  }
  await HID.Set_MS_KeyFunction(selectedBtn.value, { type: fn.type, param: fn.param });
}

async function applyCombo() {
  const keys = comboSlots.value.filter(Boolean);
  if (keys.length === 0) return;
  await HID.Set_MS_ShortcutKey(selectedBtn.value, keys);
  await HID.Set_MS_KeyFunction(selectedBtn.value, { type: MKF.ShortcutKey, param: 0 });
}

function addComboChar(ch) {
  if (activeSlot.value > 2) return;
  comboSlots.value[activeSlot.value] = ch;
  if (activeSlot.value < 2) activeSlot.value++;
}

function clearCombo() {
  comboSlots.value = ["", "", ""];
  activeSlot.value = 0;
}

async function assignMacro(macroIndex) {
  await HID.Set_MS_KeyFunction(selectedBtn.value, {
    type: MKF.Macro,
    param: macroIndex,
  });
}
</script>

<template>
  <div class="driver-key-layout">
    <aside>
      <p class="driver-card-desc" style="margin-bottom: 0.5rem">选择要改键的按键</p>
      <div class="driver-btn-list">
        <button
          v-for="b in MOUSE_BUTTONS"
          :key="b.index"
          type="button"
          class="driver-btn-item"
          :class="{ active: selectedBtn === b.index }"
          @click="selectedBtn = b.index"
        >
          {{ b.label }}
          <small>{{ labelForKey(b.index) }}</small>
        </button>
      </div>
    </aside>

    <section class="driver-card">
      <h2>改键 · {{ MOUSE_BUTTONS.find((b) => b.index === selectedBtn)?.label }}</h2>
      <p class="driver-card-desc">
        当前映射：{{ labelForKey(selectedBtn) }}
        <span v-if="currentKey.raw" class="muted">（{{ currentKey.raw }}）</span>
      </p>

      <div class="driver-subtabs">
        <button
          type="button"
          class="driver-subtab"
          :class="{ active: subTab === 'basic' }"
          @click="subTab = 'basic'"
        >
          常规
        </button>
        <button
          type="button"
          class="driver-subtab"
          :class="{ active: subTab === 'combo' }"
          @click="subTab = 'combo'"
        >
          组合键
        </button>
        <button
          type="button"
          class="driver-subtab"
          :class="{ active: subTab === 'macro' }"
          @click="subTab = 'macro'"
        >
          宏定义
        </button>
      </div>

      <template v-if="subTab === 'basic'">
        <p class="driver-card-desc">基本按键与快捷功能</p>
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
      </template>

      <template v-else-if="subTab === 'combo'">
        <p class="driver-card-desc">最多 3 个按键组合，点击下方字符填入</p>
        <div class="driver-combo-slots">
          <button
            v-for="(s, i) in comboSlots"
            :key="i"
            type="button"
            class="driver-combo-slot"
            @click="activeSlot = i"
          >
            {{ s || `按键${i + 1}` }}
          </button>
          <button type="button" class="btn btn-secondary" @click="applyCombo">应用组合键</button>
          <button type="button" class="btn btn-secondary" @click="clearCombo">清空</button>
        </div>
        <div class="driver-func-grid">
          <button
            v-for="ch in COMBO_KEY_CHARS"
            :key="ch"
            type="button"
            class="driver-chip"
            @click="addComboChar(ch)"
          >
            {{ ch }}
          </button>
        </div>
      </template>

      <template v-else>
        <p class="driver-card-desc">将按键绑定到已录制的宏（需先在设备或完整版驱动中录制）</p>
        <div v-if="macros.length" class="driver-macro-list">
          <div v-for="(m, i) in macros" :key="i" class="driver-macro-item">
            <span>{{ m.name || `宏 ${i + 1}` }}</span>
            <button type="button" class="btn btn-secondary" @click="assignMacro(i)">绑定</button>
          </div>
        </div>
        <p v-else class="driver-empty">暂无宏数据。连接设备后会从板载存储读取。</p>
      </template>
    </section>
  </div>
</template>

<style scoped>
.muted {
  color: var(--tx3);
}
</style>
