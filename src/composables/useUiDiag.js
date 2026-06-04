/** 开启：控制台执行 localStorage.setItem('teevolink_ui_diag','1') 后刷新 */
export function uiDiagEnabled() {
  try {
    return localStorage.getItem("teevolink_ui_diag") === "1";
  } catch {
    return false;
  }
}

export function uiDiagLog(scope, event, detail) {
  if (!uiDiagEnabled()) return;
  const t = new Date().toISOString().slice(11, 23);
  console.log(`[UI ${t} ${scope}] ${event}`, detail ?? "");
}
