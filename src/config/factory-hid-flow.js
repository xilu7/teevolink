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

export const HOME_GUIDE_LEAD =
  "按工厂 Web HID 流程操作，首次需授权；下次打开会自动连接，无需再点弹窗。";

export const HOME_CONNECT_STEPS = [
  {
    step: 1,
    title: "点击右上角 + 连接设备",
    desc: "插入 RapidSync 接收器后，点顶栏圆形 + 按钮。",
  },
  {
    step: 2,
    title: "在弹窗中选择设备",
    desc: "选择 RapidSync（或列表中的接收器名称），不要选错其他 USB 设备。",
  },
  {
    step: 3,
    title: "点击弹窗中的「连接」",
    desc: "允许浏览器访问 HID 设备。只需授权一次。",
  },
  {
    step: 4,
    title: "连接成功后打开设置",
    desc: "上方会出现 DPI、回报率、电量等；点「打开驱动设置」进入调校页。",
  },
];
