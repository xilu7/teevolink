<script setup>
import { ref, computed } from "vue";
import { useHidAction } from "@/composables/useHidAction.js";
import { buildBasicFunctions } from "@/config/mouse-key-functions.js";
import { injectKeysPage } from "../useKeysPageInject.js";

const { HID, selectedBtn, selectedLabel } = injectKeysPage();
const { run } = useHidAction();
const MKF = HID.MouseKeyFunction;

const subTab = ref("basic");

const subTabs = [
  { id: "basic", label: "基本按键" },
  { id: "media", label: "多媒体按键" },
  { id: "chars", label: "键盘字符" },
];

const basicFunctions = computed(() =>
  buildBasicFunctions(MKF).filter(
    (f) =>
      f.type !== MKF.ShortcutKey &&
      f.type !== MKF.Macro &&
      f.label !== "组合键" &&
      f.label !== "宏"
  )
);

const mediaFunctions = computed(() =>
  buildBasicFunctions(MKF).filter((f) =>
    ["灯效切换", "配置切换", "回报率切换"].includes(f.label)
  )
);

async function assignBasic(fn) {
  await run(
    async () => {
      await HID.Set_MS_KeyFunction(selectedBtn.value, {
        type: fn.type,
        param: fn.param,
      });
    },
    `${selectedLabel.value} → ${fn.label}`
  );
}
</script>

<template>
  <div class="keys-mode-regular">
    <nav class="keys-subtabs" aria-label="常规子分类">
      <button
        v-for="t in subTabs"
        :key="t.id"
        type="button"
        class="keys-subtab"
        :class="{ active: subTab === t.id }"
        @click="subTab = t.id"
      >
        {{ t.label }}
      </button>
    </nav>

    <div v-if="subTab === 'basic'" class="keys-func-grid">
      <button
        v-for="fn in basicFunctions"
        :key="fn.label"
        type="button"
        class="keys-func-btn"
        @click="assignBasic(fn)"
      >
        {{ fn.label }}
      </button>
    </div>

    <div v-else-if="subTab === 'media'" class="keys-func-grid">
      <button
        v-for="fn in mediaFunctions"
        :key="fn.label"
        type="button"
        class="keys-func-btn"
        @click="assignBasic(fn)"
      >
        {{ fn.label }}
      </button>
    </div>

    <p v-else class="keys-mode-hint">
      键盘单键请使用上方「组合键」模式；此处为鼠标功能映射。
    </p>
  </div>
</template>

<style scoped>
.keys-mode-hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--tx3);
  line-height: 1.5;
}
</style>
