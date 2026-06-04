<script setup>
defineProps({
  title: { type: String, default: "" },
  badge: { type: String, default: "" },
});
</script>

<template>
  <section class="setting-card">
    <header v-if="title" class="setting-card-head">
      <div>
        <h3>{{ title }}</h3>
        <slot name="desc" />
      </div>
      <span v-if="badge" class="badge">{{ badge }}</span>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.setting-card {
  background: var(--bg);
  border: 1px solid var(--bd);
  border-radius: var(--rl);
  padding: 1.15rem 1.25rem;
  box-shadow: var(--sh);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.setting-card:hover {
  border-color: var(--bd2);
  box-shadow: var(--shm);
}

.setting-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.setting-card-head h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--tx);
  margin-bottom: 0.15rem;
}
</style>
