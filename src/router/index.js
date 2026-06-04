import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import DeviceView from "@/views/DeviceView.vue";
import ConnectDiagView from "@/views/ConnectDiagView.vue";
import DpiDiagView from "@/views/DpiDiagView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/device", name: "device", component: DeviceView },
    { path: "/diag", name: "diag", component: ConnectDiagView },
    { path: "/diag/dpi", name: "diag-dpi", component: DpiDiagView },
  ],
});

export default router;
