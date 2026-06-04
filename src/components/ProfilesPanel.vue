<script setup>
import { useDevice } from "@/composables/useDevice.js";

const { HID, deviceInfo } = useDevice();

async function setProfile(n) {
  await HID.Set_Device_Profile(Number(n));
}

async function restore() {
  if (!confirm("Restore factory settings on the mouse?")) return;
  await HID.Device_Restore();
}
</script>

<template>
  <section class="card">
    <h2>Profiles</h2>
    <p class="muted">Current profile: {{ deviceInfo.profile }}</p>
    <div class="profile-btns">
      <button
        v-for="n in 4"
        :key="n"
        class="btn"
        :class="deviceInfo.profile === n - 1 ? 'btn-primary' : 'btn-secondary'"
        @click="setProfile(n - 1)"
      >
        Profile {{ n }}
      </button>
    </div>
    <hr />
    <button class="btn btn-secondary danger" @click="restore">Restore factory settings</button>
  </section>
</template>

<style scoped>
h2 {
  margin-bottom: 0.75rem;
}
.muted {
  color: var(--tx2);
  margin-bottom: 1rem;
}
.profile-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
hr {
  border: none;
  border-top: 1px solid var(--bd);
  margin: 1.5rem 0;
}
.danger {
  color: var(--rdx);
  border-color: var(--rdx);
}
</style>
