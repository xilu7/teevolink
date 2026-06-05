import { ref, computed } from "vue";

const MAX_LINES = 40;
const lines = ref([]);

/** 开启：地址栏加 ?diag=1 ，或控制台 localStorage.setItem('teevolink_ui_diag','1') 后刷新 */
export function uiDiagEnabled() {
  try {
    if (typeof window !== "undefined") {
      if (new URLSearchParams(window.location.search).get("diag") === "1") {
        return true;
      }
    }
    return localStorage.getItem("teevolink_ui_diag") === "1";
  } catch {
    return false;
  }
}

export function uiDiagLog(scope, event, detail) {
  const t = new Date().toISOString().slice(11, 23);
  const text =
    detail === undefined
      ? `[${t}] ${scope} · ${event}`
      : `[${t}] ${scope} · ${event} · ${safeJson(detail)}`;
  lines.value = [text, ...lines.value].slice(0, MAX_LINES);
  if (uiDiagEnabled()) {
    console.log(`[UI ${scope}] ${event}`, detail ?? "");
  }
}

function safeJson(v) {
  try {
    if (typeof v === "string") return v;
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function useUiDiagLines() {
  return computed(() => lines.value);
}

export function clearUiDiag() {
  lines.value = [];
}

export async function copyUiDiagReport(snapshot) {
  const body = [
    "=== Teevolink 诊断 ===",
    new Date().toISOString(),
    "",
    "--- 状态快照 ---",
    ...Object.entries(snapshot).map(([k, v]) => `${k}: ${v}`),
    "",
    "--- 最近事件 ---",
    ...lines.value,
  ].join("\n");
  try {
    await navigator.clipboard.writeText(body);
    return true;
  } catch {
    return false;
  }
}
