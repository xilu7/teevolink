import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/main.css";
import { useTheme } from "./composables/useTheme.js";

const { loadTheme } = useTheme();
loadTheme();

createApp(App).use(router).mount("#app");
