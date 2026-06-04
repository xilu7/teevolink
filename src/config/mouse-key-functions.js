/** 常规改键 — 对应 HID.MouseKeyFunction 类型 */
export function buildBasicFunctions(MKF) {
  return [
    { label: "左键", type: MKF.MouseKey, param: 0x0100 },
    { label: "右键", type: MKF.MouseKey, param: 0x0200 },
    { label: "中键", type: MKF.MouseKey, param: 0x0400 },
    { label: "前进键", type: MKF.MouseKey, param: 0x1000 },
    { label: "后退键", type: MKF.MouseKey, param: 0x0800 },
    { label: "DPI 循环", type: MKF.DPISwitch, param: 0 },
    { label: "火力键", type: MKF.FireKey, param: 0 },
    { label: "回报率切换", type: MKF.ReportRateSwitch, param: 0 },
    { label: "灯效切换", type: MKF.LightSwitch, param: 0 },
    { label: "配置切换", type: MKF.ProfileSwitch, param: 0 },
    { label: "组合键", type: MKF.ShortcutKey, param: 0 },
    { label: "宏", type: MKF.Macro, param: 0 },
    { label: "禁用按键", type: MKF.Disable, param: 0 },
  ];
}

/** 组合键编辑器可选字符（常用键） */
export const COMBO_KEY_CHARS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "Esc", "Tab", "←", "Space", "Enter",
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
];

export function parseKeyEntry(entry) {
  if (!entry) return { type: 0, param: 0, raw: "" };
  const arr = Array.isArray(entry) ? entry : entry.value;
  if (!arr || arr.length < 2) return { type: 0, param: 0, raw: "" };
  const type = parseInt(String(arr[0]).replace(/^0x/i, ""), 16);
  const param = parseInt(String(arr[1]).replace(/^0x/i, ""), 16);
  return { type, param, raw: `${arr[0]} / ${arr[1]}` };
}
