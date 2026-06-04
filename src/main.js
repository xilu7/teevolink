import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/main.css";
import { useTheme } from "./composables/useTheme.js";
import { useUiScale } from "./composables/useUiScale.js";
import HID from "./sdk/dev_HIDHandle_05_27.js";

const { loadTheme } = useTheme();
loadTheme();
useUiScale().loadUiScale();

createApp(App).use(router).mount("#app");
