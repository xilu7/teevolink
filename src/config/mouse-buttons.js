import { PRODUCT } from "./terra-pro.js";

/**
 * Terra Pro 共 6 个可改键（含 DPI 键）
 * 索引与 SDK 按键槽位对应，滚轮/DIY 不在本机型配置内
 */
export const MOUSE_BUTTONS = [
  { index: 0, label: "左键", hint: "主键" },
  { index: 1, label: "右键", hint: "副键" },
  { index: 2, label: "中键", hint: "滚轮按下" },
  { index: 3, label: "前进键", hint: "侧键" },
  { index: 4, label: "后退键", hint: "侧键" },
  { index: 5, label: "DPI 键", hint: "切换 DPI 档位" },
];

export const BUTTON_COUNT = PRODUCT.buttons;
