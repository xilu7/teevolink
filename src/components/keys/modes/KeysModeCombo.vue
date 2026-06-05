<script setup>
import { ref } from "vue";
import { useHidAction } from "@/composables/useHidAction.js";
import { COMBO_KEY_CHARS } from "@/config/mouse-key-functions.js";
import { injectKeysPage } from "../useKeysPageInject.js";

const { HID, selectedBtn, selectedLabel } = injectKeysPage();
const { run } = useHidAction();
const MKF = HID.MouseKeyFunction;

const comboSlots = ref(["", "", ""]);
const comboOn = ref(true);

function addKey(ch) {
  const i = comboSlots.value.findIndex((x) => !x);
  if (i >= 0) comboSlots.value[i] = ch;
}

function clearCombo() {
  comboSlots.value = ["", "", ""];
}

async function applyCombo() {
  const keys = comboSlots.value.filter(Boolean);
  if (!keys.length) return;
  await run(async () => {
    await HID.Set_MS_ShortcutKey(selectedBtn.value, keys);
    await HID.Set_MS_KeyFunction(selectedBtn.value, {
      type: MKF.ShortcutKey,
      param: 0,
    });
  }, `${selectedLabel.value} 组合键已应用`);
}
</script>

<template>
  <div class="keys-combo-layout">
    <div class="combo-side">
      <div class="combo-head">
        <strong>组合键</strong>
        <label class="combo-toggle">
          <input v-model="comboOn" type="checkbox" />
          生效
        </label>
      </div>
      <p class="combo-hint">可用右侧字符，最多 3 键，以 + 连接</p>
      <div class="combo-slots">
        <span class="combo-slot">{{ comboSlots[0] || "键 1" }}</span>
        <span class="combo-plus">+</span>
        <span class="combo-slot">{{ comboSlots[1] || "键 2" }}</span>
        <span class="combo-plus">+</span>
        <span class="combo-slot">{{ comboSlots[2] || "键 3" }}</span>
      </div>
      <div class="combo-actions">
        <button type="button" class="keys-func-btn" @click="clearCombo">清空</button>
        <button type="button" class="keys-func-btn combo-apply" @click="applyCombo">
          应用
        </button>
      </div>
    </div>
    <div class="combo-kb">
      <p class="combo-kb-title">基本字符</p>
      <div class="keys-func-grid combo-kb-grid">
        <button
          v-for="ch in COMBO_KEY_CHARS"
          :key="ch"
          type="button"
          class="keys-func-btn"
          @click="addKey(ch)"
        >
          {{ ch }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.combo-side {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.combo-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.combo-head strong {
  font-size: 0.82rem;
}
.combo-toggle {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  color: var(--tx2);
  cursor: pointer;
}
.combo-hint {
  margin: 0;
  font-size: 0.68rem;
  color: var(--tx3);
  line-height: 1.4;
}
.combo-slots {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.combo-slot {
  min-width: 2.4rem;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  border: 1px dashed var(--bd2);
  background: var(--bg2);
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
}
.combo-plus {
  font-size: 0.75rem;
  color: var(--tx3);
}
.combo-actions {
  display: flex;
  gap: 0.35rem;
}
.combo-apply {
  background: var(--ac);
  border-color: var(--ac);
  color: #fff;
}
.combo-kb-title {
  margin: 0 0 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--tx2);
}
.combo-kb-grid {
  max-height: min(200px, 22vh);
  overflow-y: auto;
}
</style>
