<script setup>
import { HOME_WELCOME } from "@/config/home-content.js";
</script>

<template>
  <section class="home-welcome" aria-label="欢迎与兼容说明">
    <h2 class="welcome-title">{{ HOME_WELCOME.title }}</h2>
    <p class="welcome-line">{{ HOME_WELCOME.osLine }}</p>
    <p class="welcome-line">{{ HOME_WELCOME.browserLine }}</p>
  </section>
</template>

<style scoped>
.home-welcome {
  padding: 0.15rem 0 0.1rem;
}
.welcome-title {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--tx);
}
.welcome-line {
  margin: 0 0 0.28rem;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.55;
  color: var(--tx2);
}
.welcome-line:last-child {
  margin-bottom: 0;
}
</style>
