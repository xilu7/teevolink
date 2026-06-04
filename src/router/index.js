import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import DeviceView from "@/views/DeviceView.vue";
import ConnectDiagView from "@/views/ConnectDiagView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/device", name: "device", component: DeviceView },
    { path: "/diag", name: "diag", component: ConnectDiagView },
  ],
});

export default router;
