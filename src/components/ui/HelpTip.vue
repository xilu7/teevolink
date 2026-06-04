<script setup>
defineProps({
  text: { type: String, required: true },
});
</script>

<template>
  <p class="help-tip">{{ text }}</p>
</template>

<style scoped>
.help-tip {
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--tx3);
  margin: 0 0 0.85rem;
}
</style>
