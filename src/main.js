import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/main.css";
import { useTheme } from "./composables/useTheme.js";
import HID from "./sdk/dev_HIDHandle_05_27.js";

const { loadTheme } = useTheme();
loadTheme();

if (typeof navigator !== "undefined" && navigator.hid) {
  HID.Add_Listen_HID_Events();
}

createApp(App).use(router).mount("#app");
