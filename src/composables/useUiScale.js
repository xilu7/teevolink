import { ref, computed } from "vue";

/** 用户确认 125% 最舒适 */
export const DEFAULT_UI_SCALE = 1.25;

const SCALE_STEPS = [1, 1.1, 1.15, 1.2, 1.25, 1.35, 1.5, 1.75];

const scale = ref(DEFAULT_UI_SCALE);

function applyScale(value) {
  const v = Math.min(1.75, Math.max(1, value));
  scale.value = v;
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--ui-scale", String(v));
  }
  try {
    localStorage.setItem("teevolink-ui-scale", String(v));
  } catch {
    /* ignore */
  }
}

function nearestStepIndex(v) {
  let best = 0;
  let diff = Math.abs(SCALE_STEPS[0] - v);
  for (let i = 1; i < SCALE_STEPS.length; i++) {
    const d = Math.abs(SCALE_STEPS[i] - v);
    if (d < diff) {
      diff = d;
      best = i;
    }
  }
  return best;
}

export function useUiScale() {
  const percentLabel = computed(() => `${Math.round(scale.value * 100)}%`);

  function loadUiScale() {
    try {
      const raw = localStorage.getItem("teevolink-ui-scale");
      const saved = raw != null ? parseFloat(raw) : NaN;
      const v = Number.isFinite(saved) ? saved : DEFAULT_UI_SCALE;
      applyScale(v < 1.2 ? DEFAULT_UI_SCALE : v);
    } catch {
      applyScale(DEFAULT_UI_SCALE);
    }
  }

  function zoomIn() {
    const i = nearestStepIndex(scale.value);
    applyScale(SCALE_STEPS[Math.min(i + 1, SCALE_STEPS.length - 1)]);
  }

  function zoomOut() {
    const i = nearestStepIndex(scale.value);
    applyScale(SCALE_STEPS[Math.max(i - 1, 0)]);
  }

  function resetZoom() {
    applyScale(DEFAULT_UI_SCALE);
  }

  return {
    scale,
    percentLabel,
    loadUiScale,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
