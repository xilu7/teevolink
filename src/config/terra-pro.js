/** Terra Pro 硬件规格（与工厂参数、实物一致） */
export const PRODUCT = {
  name: "Terra Pro",
  brand: "Teevolution",

  /** PixArt PAW3950 STRIKE */
  sensorType: "3950",
  sensorModel: "PAW3950",

  /** 主控 nRF52840 */
  mcu: "nRF52840",

  /** 三模：蓝牙 + 2.4G（RapidSync）+ USB 有线 */
  triMode: true,

  /**
   * 底部三段开关（实物）：蓝牙 / 关闭 / 2.4G
   * 网页 Web HID 调参：请用 2.4G+接收器，或 USB 有线；蓝牙模式浏览器一般无法直连
   */
  connectivity: {
    bluetooth: {
      label: "蓝牙",
      switchHint: "底部开关拨到蓝牙档",
      webDriverNote: "适合办公省电；Chrome 网页驱动通常无法在蓝牙下读写参数",
    },
    wireless24g: {
      label: "2.4G 无线",
      switchHint: "底部开关拨到 2.4G 档，并插入 RapidSync 8K 接收器",
      webDriverNote: "竞技与网页调参的推荐无线方式",
    },
    wired: {
      label: "USB 有线",
      switchHint: "用数据线连接鼠标与电脑（可不依赖接收器）",
      webDriverNote: "连接最稳，支持高回报率；唤醒后选 HID 设备中的鼠标或接收器",
    },
    powerOff: {
      label: "关闭",
      switchHint: "底部开关中间档为关机/省电",
    },
  },

  /** RapidSync 8K 接收器（橙色外壳、顶部按键、屏显 DPI/回报率/LOD 等） */
  receiver: {
    productName: "RapidSync",
    reportRateMax: 8000,
    screenParams: ["DPI", "回报率", "LOD", "移动同步", "配置", "直线修正"],
  },

  /** 外观与按键布局（用户实拍） */
  appearance: {
    shellGradient: "前黄 → 橙红 → 后深棕/黑渐变",
    bottomMark: "terra",
    dpiButton: "滚轮后方独立键",
    sideButtons: "左侧拇指区两枚侧键",
    modeSwitch: "底部传感器旁三段开关",
  },

  /** DPI：50 步进，最高 42000 */
  dpiMin: 50,
  dpiMax: 42000,
  dpiStep: 50,

  /** 出厂推荐五档（接收器屏显示例含 1600） */
  defaultDpiPresets: [400, 800, 1600, 3200, 6400],
  defaultDpiStageCount: 5,

  /** 物理按键 6 个：左、右、中、前进、后退、DPI */
  buttons: 6,
  maxDpiStages: 8,

  maxReportRate: 8000,

  /**
   * PAW3950 LOD（与接收器屏「1MM」及 SDK 一致）
   * 1 → 1 mm，2 → 2 mm，3 → 0.7 mm
   */
  lodLevels: [
    { value: 3, label: "低", height: "0.7 mm" },
    { value: 1, label: "中", height: "1 mm" },
    { value: 2, label: "高", height: "2 mm" },
  ],

  dongleProductNameHint: "RapidSync",
};

/**
 * Web HID 筛选（与工厂 SDK 示例一致）
 * - RapidSync 接收器：VID 0x3554 · PID 0xF516
 * - 第二条仅 VID：兼容 USB 有线等同厂设备
 */
export const HID_FILTERS = [
  { vendorId: 0x3554, productId: 0xf516 },
  { vendorId: 0x3554 },
];

/** 连接设备前的简短说明（首页/引导用） */
export const CONNECT_GUIDE = [
  "三模鼠标：蓝牙、2.4G（RapidSync 接收器）、USB 有线。",
  "网页调参请用 2.4G + 插入接收器，或 USB 线直连鼠标；蓝牙模式下浏览器一般无法改参。",
  "无线时：底部开关拨到 2.4G → 插接收器 → Chrome 里选 RapidSync → 晃动唤醒鼠标 → 右上角显示「已连接」。",
];
