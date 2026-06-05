import { ref, computed, watch } from "vue";
import { useDevice } from "./useDevice.js";

/** 曾成功连上过鼠标（用于浅睡时不弹预览条/吐司） */
const wasEverReady = ref(false);
const holdReadyUntil = ref(0);

const HOLD_MS = 4500;

/**
 * 连接状态展示层：吸收 SDK 浅睡/重连时的短暂 Connecting 抖动，避免整页闪烁。
 */
export function useConnectionDisplay() {
  const { deviceOpen, isReady, connecting, online, isWired } = useDevice();

  watch(
    isReady,
    (ready) => {
      if (ready) {
        wasEverReady.value = true;
        holdReadyUntil.value = 0;
        return;
      }
      if (wasEverReady.value) {
        holdReadyUntil.value = Date.now() + HOLD_MS;
      }
    },
    { immediate: true }
  );

  const displayReady = computed(() => {
    if (!deviceOpen.value) return false;
    if (isReady.value) return true;
    if (wasEverReady.value && holdReadyUntil.value > Date.now()) return true;
    return false;
  });

  const displayConnecting = computed(() => {
    if (!connecting.value) return false;
    if (displayReady.value) return false;
    /** 曾连上后睡眠/唤醒：不闪「同步中」，避免侧栏与顶栏布局跳动 */
    if (wasEverReady.value) return false;
    return true;
  });

  /** 睡眠时仍展示 DPI/回报率等（用 Flash 缓存值），保持与唤醒时相同行数与高度 */
  const showCachedMetrics = computed(
    () => wasEverReady.value && deviceOpen.value
  );

  const statusText = computed(() => {
    if (!deviceOpen.value) return "未连接";
    if (displayReady.value) {
      return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
    }
    if (displayConnecting.value) return "同步中";
    if (online.value) return "鼠标在线";
    if (wasEverReady.value) return "鼠标休眠";
    return "接收器已就绪";
  });

  const statusDotClass = computed(() => {
    if (!deviceOpen.value) return "e";
    if (displayReady.value) return "";
    if (displayConnecting.value || online.value) return "w";
    return "e";
  });

  const linkDetail = computed(() => {
    if (!deviceOpen.value) return "未授权 · 请回首页连接";
    if (displayReady.value) {
      return isWired.value ? "已连接 · 有线" : "已连接 · 无线";
    }
    if (displayConnecting.value) return "同步中 · 请勿频繁点击";
    if (online.value) return "鼠标在线 · 自动同步中";
    if (wasEverReady.value) return "鼠标休眠 · 晃动唤醒即可";
    return "接收器已授权 · 等待鼠标";
  });

  /** 仅首次从未连上时显示预览模式黄条 */
  const showPreviewMode = computed(
    () =>
      deviceOpen.value &&
      !wasEverReady.value &&
      !displayReady.value &&
      !displayConnecting.value
  );

  return {
    wasEverReady,
    displayReady,
    displayConnecting,
    showCachedMetrics,
    statusText,
    statusDotClass,
    linkDetail,
    showPreviewMode,
  };
}
