<script setup>
import { ref, computed } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { useHidAction } from "@/composables/useHidAction.js";
import { MOUSE_BUTTONS } from "@/config/mouse-buttons.js";
import { PRODUCT } from "@/config/terra-pro.js";
import MouseShowcase from "@/components/brand/MouseShowcase.vue";
import {
  buildBasicFunctions,
  COMBO_KEY_CHARS,
  parseKeyEntry,
} from "@/config/mouse-key-functions.js";

const { HID, mouseCfg } = useDevice();
const { run, notify } = useHidAction();
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
  await run(
    async () => {
      await HID.Set_MS_KeyFunction(selectedBtn.value, { type: fn.type, param: fn.param });
    },
    `${selectedLabel.value} → ${fn.label}`
  );
}

async function applyCombo() {
  const keys = comboSlots.value.filter(Boolean);
  if (!keys.length) return;
  await run(async () => {
    await HID.Set_MS_ShortcutKey(selectedBtn.value, keys);
    await HID.Set_MS_KeyFunction(selectedBtn.value, { type: MKF.ShortcutKey, param: 0 });
  }, `组合键已应用`);
}

async function assignMacro(i) {
  await run(
    () =>
      HID.Set_MS_KeyFunction(selectedBtn.value, { type: MKF.Macro, param: i }),
    `宏 ${i + 1}`
  );
}
</script>

<template>
  <div class="keys-workspace driver-shell">
    <div class="keys-main">
      <div class="keys-main-grid">
        <section class="panel-compact">
          <header class="panel-compact-head">
            <h3>选择按键</h3>
            <span class="panel-badge">{{ PRODUCT.buttons }} 键</span>
          </header>
          <div class="btn-pick-compact">
            <button
              v-for="b in MOUSE_BUTTONS"
              :key="b.index"
              type="button"
              :class="{ active: selectedBtn === b.index }"
              @click="selectedBtn = b.index"
            >
              <strong>{{ b.label }}</strong>
              <span>{{ labelForKey(b.index) }}</span>
            </button>
          </div>
        </section>

        <section class="panel-compact">
          <header class="panel-compact-head">
            <h3>{{ selectedLabel }}</h3>
            <span class="panel-badge">映射</span>
          </header>
          <div class="func-chips">
            <button
              v-for="fn in basicFunctions"
              :key="fn.label"
              type="button"
              class="chip-btn"
              @click="assignBasic(fn)"
            >
              {{ fn.label }}
            </button>
          </div>
        </section>
      </div>

      <button type="button" class="macro-fold" @click="showMacro = !showMacro">
        <span>组合键与宏</span>
        <span>{{ showMacro ? "收起" : "展开" }}</span>
      </button>

      <div v-show="showMacro" class="keys-main-grid macro-panel">
        <section class="panel-compact">
          <header class="panel-compact-head">
            <h3>组合键</h3>
          </header>
          <div class="combo-row">
            <span v-for="(s, i) in comboSlots" :key="i" class="combo-slot">{{ s || `键${i + 1}` }}</span>
            <button type="button" class="chip-btn active" @click="applyCombo">应用</button>
          </div>
          <div class="func-chips compact-keys">
            <button
              v-for="ch in COMBO_KEY_CHARS"
              :key="ch"
              type="button"
              class="chip-btn"
              @click="
                comboSlots[comboSlots.findIndex((x) => !x)] = ch;
                notify(ch);
              "
            >
              {{ ch }}
            </button>
          </div>
        </section>

        <section class="panel-compact">
          <header class="panel-compact-head">
            <h3>宏绑定</h3>
          </header>
          <div v-if="macros.length" class="func-chips">
            <button
              v-for="(m, i) in macros"
              :key="i"
              type="button"
              class="chip-btn"
              @click="assignMacro(i)"
            >
              {{ m.name || `宏 ${i + 1}` }}
            </button>
          </div>
          <p v-else class="empty-hint">连接设备后读取板载宏</p>
        </section>
      </div>
    </div>

    <aside class="keys-visual">
      <MouseShowcase size="md" :show-labels="true" />
    </aside>
  </div>
</template>

<style scoped>
.keys-main {
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  min-width: 0;
}
.btn-pick-compact button {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}
.btn-pick-compact strong {
  font-size: 0.72rem;
}
.btn-pick-compact span {
  font-size: 0.6rem;
  opacity: 0.8;
}
.macro-fold {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--tx2);
}
.macro-panel {
  margin-top: 0;
}
.combo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
  margin-bottom: 0.45rem;
}
.combo-slot {
  min-width: 2.2rem;
  padding: 0.3rem 0.45rem;
  border-radius: 6px;
  border: 1px dashed var(--bd2);
  font-size: 0.72rem;
  text-align: center;
}
.compact-keys {
  max-height: 120px;
}
.empty-hint {
  font-size: 0.72rem;
  color: var(--tx3);
  margin: 0;
}
</style>
