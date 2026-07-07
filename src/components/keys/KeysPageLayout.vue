<script setup>
import { ref, computed, provide } from "vue";
import { useDevice } from "@/composables/useDevice.js";
import { MOUSE_BUTTONS } from "@/config/mouse-buttons.js";
import {
  buildBasicFunctions,
  parseKeyEntry,
} from "@/config/mouse-key-functions.js";
import {
  wouldRetainLeftButton,
  LEFT_BUTTON_GUARD_MSG,
} from "@/utils/keyRemapGuard.js";
import { KEYS_PAGE_KEY } from "./keys-context.js";
import KeysMouseHero from "./KeysMouseHero.vue";
import KeysModeRegular from "./modes/KeysModeRegular.vue";
import KeysModeCombo from "./modes/KeysModeCombo.vue";
import KeysModeMacro from "./modes/KeysModeMacro.vue";

const { HID, mouseCfg } = useDevice();
const MKF = HID.MouseKeyFunction;

const selectedBtn = ref(0);
const mode = ref("regular");
const keysAlert = ref("");
let keysAlertTimer;

function showKeysAlert(text) {
  keysAlert.value = text;
  clearTimeout(keysAlertTimer);
  keysAlertTimer = setTimeout(() => {
    keysAlert.value = "";
  }, 3200);
}

function guardKeyRemap(index, keyFunction) {
  const keys = mouseCfg.value.keys;
  if (wouldRetainLeftButton(keys, index, keyFunction, MKF)) return true;
  showKeysAlert(LEFT_BUTTON_GUARD_MSG);
  return false;
}

const modes = [
  { id: "regular", label: "常规" },
  { id: "combo", label: "组合键" },
  { id: "macro", label: "宏定义" },
];

const selectedLabel = computed(
  () => MOUSE_BUTTONS.find((b) => b.index === selectedBtn.value)?.label ?? ""
);

function labelForKey(index) {
  const { type, param } = parseKeyEntry(mouseCfg.value.keys?.[index]);
  const fn = buildBasicFunctions(MKF).find(
    (f) => f.type === type && f.param === param
  );
  if (fn) return fn.label;
  if (type === MKF.ShortcutKey) return "组合键";
  if (type === MKF.Macro) return `宏 ${param + 1}`;
  return "默认";
}

const modeComponent = computed(() => {
  if (mode.value === "combo") return KeysModeCombo;
  if (mode.value === "macro") return KeysModeMacro;
  return KeysModeRegular;
});

provide(KEYS_PAGE_KEY, {
  HID,
  mouseCfg,
  selectedBtn,
  selectedLabel,
  labelForKey,
  guardKeyRemap,
});
</script>

<template>
  <div class="keys-page driver-shell">
    <section class="keys-top-band">
      <div class="keys-hero-col">
        <div class="keys-hero-wrap">
          <KeysMouseHero />
        </div>
      </div>

      <aside class="keys-pick-col">
        <header class="keys-pick-head">
          <h3>选择按键</h3>
        </header>
        <div class="keys-pick-grid">
          <button
            v-for="b in MOUSE_BUTTONS"
            :key="b.index"
            type="button"
            class="keys-pick-btn"
            :class="{ active: selectedBtn === b.index }"
            @click="selectedBtn = b.index"
          >
            <strong>{{ b.label }}</strong>
            <span class="keys-pick-map">{{ labelForKey(b.index) }}</span>
          </button>
        </div>
      </aside>
    </section>

    <div v-if="keysAlert" class="keys-guard-alert" role="alert">
      <span class="keys-guard-icon" aria-hidden="true">!</span>
      <span>{{ keysAlert }}</span>
    </div>

    <nav class="keys-mode-bridge" aria-label="映射模式">
      <div class="keys-mode-seg">
        <button
          v-for="m in modes"
          :key="m.id"
          type="button"
          class="keys-mode-tab"
          :class="{ active: mode === m.id }"
          @click="mode = m.id"
        >
          {{ m.label }}
        </button>
      </div>
    </nav>

    <div class="keys-panel-slot">
      <div class="keys-panel-inner">
        <component :is="modeComponent" />
      </div>
    </div>
  </div>
</template>
