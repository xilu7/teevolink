/** Terra Pro — 与公版 Web HID 协议一致（江梦/Compx 方案） */
export const PRODUCT = {
  name: "Terra Pro",
  brand: "Teevolution",
  /** TechPowerUp / 官方规格：PixArt PAW3950 STRIKE（不是 3955） */
  sensorType: "3950",
  maxDpi: 42000,
  dpiStages: 8,
  buttons: 6,
  maxReportRate: 8000,
  /** 8K 接收器在系统里常显示为 RapidSync */
  dongleProductNameHint: "RapidSync",
};

/**
 * Web HID 过滤规则（Chrome 弹窗里能看到哪些设备）
 *
 * 只写 vendorId、不写 productId → 会列出该厂商下所有接收器/鼠标
 * （公版 controlhub 里你的设备名是 RapidSync，PID 往往不是 SDK 示例里的 F516）
 *
 * 厂商 0x3554 = 深圳江梦 / Compx 系（与 VGN、VXE 等同方案）
 */
export const HID_FILTERS = [
  { vendorId: 0x3554 },
];

/** 可选：若仍搜不到，向工厂确认后追加具体 PID，例如：
 * { vendorId: 0x3554, productId: 0x???? },
 */
