import { parseKeyEntry } from "@/config/mouse-key-functions.js";
import { MOUSE_BUTTONS } from "@/config/mouse-buttons.js";

export const LEFT_BUTTON_GUARD_MSG = "至少要有一个左键";

const LEFT_BUTTON_PARAM = 0x0100;

export function isLeftButtonKey(type, param, MKF) {
  return type === MKF.MouseKey && param === LEFT_BUTTON_PARAM;
}

/** 模拟改键后是否仍至少有一个左键（全 6 键统计，含 DPI 键） */
export function wouldRetainLeftButton(keys, index, keyFunction, MKF) {
  const count = MOUSE_BUTTONS.length;
  for (let i = 0; i < count; i++) {
    const { type, param } =
      i === index
        ? keyFunction
        : parseKeyEntry(keys?.[i]);
    if (isLeftButtonKey(type, param, MKF)) return true;
  }
  return false;
}
