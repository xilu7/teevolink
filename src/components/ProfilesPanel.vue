<script setup>
import { ref } from "vue";
import { useDevice } from "@/composables/useDevice.js";

const { HID, deviceInfo } = useDevice();
const profileNames = ref(["游戏", "办公", "FPS", "自定义"]);

async function setProfile(n) {
  await HID.Set_Device_Profile(Number(n));
}

async function restore() {
  if (!confirm("确定要恢复鼠标出厂设置吗？此操作不可撤销。")) return;
  await HID.Device_Restore();
}
</script>

<template>
  <div class="driver-grid-2">
    <section class="driver-card">
      <h2>板载配置方案</h2>
      <p class="driver-card-desc">
        鼠标内置 4 组配置，切换后 DPI、按键与灯光等参数会一并切换。当前：配置
        {{ (deviceInfo.profile ?? 0) + 1 }}
      </p>
      <div class="profile-grid">
        <button
          v-for="n in 4"
          :key="n"
          type="button"
          class="profile-card"
          :class="{ active: deviceInfo.profile === n - 1 }"
          @click="setProfile(n - 1)"
        >
          <span class="profile-num">配置 {{ n }}</span>
          <span class="profile-name">{{ profileNames[n - 1] }}</span>
        </button>
      </div>
    </section>

    <section class="driver-card">
      <h2>设备维护</h2>
      <p class="driver-card-desc">恢复出厂将清除自定义设置，请谨慎操作</p>
      <button type="button" class="btn btn-secondary danger-btn" @click="restore">
        恢复出厂设置
      </button>
      <p class="hint" style="margin-top: 1rem">
        提示：配置名称仅在本页面显示，实际保存以设备板载存储为准。
      </p>
    </section>
  </div>
</template>

<style scoped>
.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (max-width: 500px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  text-align: left;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  border: 1px solid var(--bd);
  background: var(--bg2);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.profile-card:hover {
  border-color: var(--ac);
  transform: translateY(-2px);
}

.profile-card.active {
  border-color: var(--ac);
  background: var(--acl);
  box-shadow: 0 0 20px var(--ac-shadow);
}

.profile-num {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--tx);
  margin-bottom: 0.25rem;
}

.profile-name {
  font-size: 0.8rem;
  color: var(--tx3);
}

.profile-card.active .profile-num {
  color: var(--ac);
}

.danger-btn {
  color: var(--rdx);
  border-color: var(--rdx);
  width: 100%;
  margin-top: 0.5rem;
}

.danger-btn:hover {
  background: var(--rdl);
}

.hint {
  font-size: 0.8rem;
  color: var(--tx3);
}
</style>
