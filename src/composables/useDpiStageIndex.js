import { PRODUCT } from "@/config/terra-pro.js";

/**
 * SDK：Set_MS_CurrentDPI 为 0 起算（0 … max-1）。
 * Flash 里有时仍是 1 起算，这里统一成 0 起算的下标。
 */
export function getDpiStageIndex(mouseCfg) {
  const max = PRODUCT.defaultDpiStageCount ?? 4;
  const raw = Number(mouseCfg?.currentDpi);
  if (Number.isFinite(raw) && raw >= 0 && raw < max) return raw;
  if (Number.isFinite(raw) && raw >= 1 && raw <= max) return raw - 1;
  return 0;
}

/** 界面显示「第 N 档」（1 起算） */
export function getDpiStageLabel(mouseCfg) {
  return getDpiStageIndex(mouseCfg) + 1;
}
