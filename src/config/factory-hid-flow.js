/**
 * 工厂 SDK（dev_HIDHandle_05_27.js）规定的 Web HID 调用顺序。
 */

export const FACTORY_FIRST_CONNECT = [
  "Set_DriverOnline(true) + Add_Listen_HID_Events",
  "Request_Device(filters) — VID 0x3554 · PID 0xF516",
  "Device_Remember",
  "Device_Reconnect(device)",
  "Device_Connect() — 内部 Get_Online_Interval 等待鼠标上线",
];

export const FACTORY_AUTO_RECONNECT = [
  "Set_DriverOnline(true) + Add_Listen_HID_Events",
  "Get_HistoryDevicesInfo()",
  "Device_Reconnect(device)",
  "Device_Connect()",
];

export const HOME_CONNECT_STEPS = [
  {
    step: 1,
    title: "点击按钮连接设备",
    desc: "2.4G + 接收器或 USB 有线",
  },
  {
    step: 2,
    title: "点击选择设备",
    desc: "选 RapidSync",
  },
  {
    step: 3,
    title: "点击弹窗的连接",
    desc: "允许 HID 一次即可",
  },
  {
    step: 4,
    title: "打开驱动设置",
    desc: "调校 DPI / 回报率",
  },
];
