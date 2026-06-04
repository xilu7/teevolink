/**
 * 工厂 SDK（dev_HIDHandle_05_27.js）规定的 Web HID 调用顺序。
 * 业务代码必须按此顺序，不得跳过或调换。
 */

/** 首次连接（需要浏览器弹窗授权） */
export const FACTORY_FIRST_CONNECT = [
  "Set_DriverOnline(true) + Add_Listen_HID_Events",
  "Request_Device(filters) — VID 0x3554 · PID 0xF516",
  "Device_Remember",
  "Device_Reconnect(device)",
  "Device_Connect() — 内部 Get_Online_Interval 等待鼠标上线",
];

/** 再次进入（已授权，无需弹窗） */
export const FACTORY_AUTO_RECONNECT = [
  "Set_DriverOnline(true) + Add_Listen_HID_Events",
  "Get_HistoryDevicesInfo()",
  "Device_Reconnect(device)",
  "Device_Connect()",
];

/** 首页四步引导文案（对应 WL 参考交互） */
export const HOME_CONNECT_STEPS = [
  {
    step: 1,
    title: "点击「连接设备」",
    desc: "插入 RapidSync 接收器，鼠标拨到 2.4G 或 USB 有线，再点下方黑色按钮。",
  },
  {
    step: 2,
    title: "在弹窗中选择设备",
    desc: "勾选 RapidSync（接收器），不要选键盘、手柄等其他设备。",
  },
  {
    step: 3,
    title: "点击弹窗中的「连接」",
    desc: "允许浏览器访问 HID。只需授权一次，下次会自动连接。",
  },
  {
    step: 4,
    title: "点「打开驱动设置」",
    desc: "连接成功后卡片会显示 DPI、回报率、电量；进入调校页改参数。",
  },
];
