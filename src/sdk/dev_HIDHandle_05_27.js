/*
2025.09.02 导入配置的结束地址修改为当前鼠标里面的有效长度
2026.01.07 
新增鼠标功能：
1.按键操作功能
//设置左键为0->普通模式 1->超前模式
Set_MS_LeftKeyOperation,

//设置右键为0->普通模式 1->超前模式
Set_MS_RightKeyOperation,

2.滚轮防抖时间
//设置滚轮防抖时间（范围:10-100）
Set_MS_WheelDebounceTime,

3.按键抬起防抖时间
//设置按键抬起防抖时间（范围:0-30）
Set_MS_DebounceReleaseTime, 

2026.01.29
新增办公键盘
新增办公键盘自定义灯效

Set_KB_OfficeCustomLight,设置办公键盘自定义灯效
Set_KB_OfficeCustomLightMode,设置办公键盘自定义灯效模式
Set_KB_OfficeCustomLightSpeed,设置办公键盘自定义灯效速度
Set_KB_OfficeCustomLightBrightness,设置办公键盘自定义灯效亮度
Set_KB_OfficeCustomLightColor,设置办公键盘自定义灯效颜色
Set_KB_OfficeCustomLightTotalRows,设置办公键盘自定义灯效总条数
Set_KB_OfficeCustomLightRowTime,设置办公键盘自定义灯效每一条的时间
Set_Device_OfficeCustomLightState,设置办公键盘自定义灯效开关状态
Set_Device_OfficeCustomMacroState,设置办公键盘自定义灯效宏是否正在录制状态

2026.03.04
新增sensor3955，8980和办公sensor
新增CRC查询

Set_KB_CRC:设置键盘CRC值，在退出键盘设备之前进行设置

2026.03.12
更新键盘宏和flashData的记录
更新导入键盘和办公键盘配置的区别

2026.03.17
1.更新LOD
LOD的值和对应的高度（不同的sensor对应值不一样）:
3395:1->1mm;2->2mm
3950:1->1mm;2->2mm;3->0.7mm
3955:1->0.7mm;2->0.9mm;3->1.2mm;4->1.4mm;5->1.5mm

2.3955 sensor 模式在各个报告率下的使用:

2.1 无线模式:
    报告率(/HZ)                        模式  
         
       125		            LP/HP  默认LP
       250		            LP/HP  默认LP
       500		            LP/HP  默认LP
       1000		            LP/HP  默认LP
       2000		            HP  
       4000		            HP  
       8000		            corded

2.2 有线模式 : 所有报告率都使用 corded
       
2.3 打开sensor fps20K : 所有报告率都使用corded 

3.更新3955的DPI值的寄存器位置
修改了Set_MS_DPIValue和Set_MS_DPIXYValue

2026.03.24
新增Update_MS_SensorModeDisplay函数
新增deviceInfo.mouseCfg.sensor.sensorModeDisplay和deviceInfo.mouseCfg.sensor.sensorModeDisable变量
切换报告率，切换有线模式或者开关fps20k的时候需要获取当前的sensor模式:
deviceInfo.mouseCfg.sensor.sensorModeDisplay表示显示的sensor模式(0->LP;1->HP;256->corder)
deviceInfo.mouseCfg.sensor.sensorModeDisable表示当前sensor模式是否可以切换(true->不可以切换;false->可以切换)

2026.04.16
新增
1.飞轮
deviceInfo.mouseCfg.flywheel.state //滚轮/飞轮开关
deviceInfo.mouseCfg.flywheel.maxSpeed //飞轮初始最快速度(飞轮滑动速度)
deviceInfo.mouseCfg.flywheel.maxSpeedTime //飞轮最快速度持续时间(智能惯性时间)
deviceInfo.mouseCfg.flywheel.reduceSpeed //飞轮降速快慢(滑动阻尼强弱)

Set_MS_FlywheelState,//设置滚轮/飞轮开关
Set_MS_FlywheelMaxSpeed,//设置飞轮初始最快速度(飞轮滑动速度)
Set_MS_FlywheelMaxSpeedTime,//设置飞轮最快速度持续时间(智能惯性时间)
Set_MS_FlywheelReduceSpeed,//设置飞轮降速快慢(滑动阻尼强弱)

滚轮/飞轮的三击功能复用在Key14（Set_MS_KeyFunction（index=14））
滚轮/飞轮的双击功能复用在Key15（Set_MS_KeyFunction（index=15））

2.震动马达
Set_Device_MotorParam,
Set_Device_MotorMode,
Set_Device_MotorLevel,
Set_Device_MotorButton,
Set_Device_MotorSwitches,

3.OLED
Set_Device_OLEDPicture,//OLED 图片数据更新
Restore_Device_OLEDPicture,//恢复OLED 默认图片数据

4.状态变化获取
//LOD发生改变
Get_MS_LOD();
//按键防抖时间发生改变
Get_MS_DebounceTime();
//motion sync发生改变
Get_MS_MotionSync();
//飞轮模式发生改变
Get_MS_FlywheelState();

修改
1.修改DPILock的值

2026.04.27
新增
左键触发点，左键快速触发，左键触觉反馈
右键触发点，右键快速触发，右键触觉反馈

//设置按键触发点
//button: 0:左键  1:右键
//value：
// 左键触发点，分10档（25/档）   档位对应的值 10进制数:
// 数值0~9:
// 0-----------------/+25
// 1-----------------/+50
// 2-----------------/+75
// 3-----------------/+100
// 4-----------------/+125
// 5-----------------/+150
// 6-----------------/+175
// 7-----------------/+200
// 8-----------------/+225
// 9----------------/+250
Set_MS_ButtonTrigger(button,value),

//设置按键快速触发
//button: 0:左键  1:右键
//state: 0:关   1:开
//power
//Bit6 ~Bit0:
// 左键快速触发，分5档 （25/档） 档位对应的值 10进制数
// 数值0~5::
// 0:关
// 1--------------/-25
// 2--------------/-50
// 3--------------/-75
// 4--------------/-100
// 5--------------/-125
Set_MS_ButtonFastTrigger(button,state,power),

//设置按键触觉反馈
//button: 0:左键  1:右键
//sound:bit7：1=开按键声音，0=关按键声音
//bit6-bit4：保留
//power: bit3-bit0：力度强弱

// 力度强弱:0~5:
// 0------------------关
// 1------------------波形1
// 2------------------波形2
// 3------------------波形3
// 4------------------波形4
// 5------------------波形5
Set_MS_ButtonTactileFeedback(button,sound,power),

2026.04.28
新增
1.deviceInfo.mouseCfg.trigger.{left/right}.fastTriggerState:0,//a=按键快速触发开关

修改
1.Set_MS_ButtonFastTrigger(button,value)->Set_MS_ButtonFastTrigger(button,state,power)

2026.04.30
新增
办公键盘音乐律动
打开音乐律动的时候会弹窗让客户选择需要共享的音视频（要打开音频，不然会报错）
Set_KB_MusicStart(mode, colorMode, color, matrix):开启音乐律动，需要传入音乐律动模式，颜色模式（0:单色，1:混彩），颜色，键盘矩阵
Set_KB_GameMusicMode(mode):修改音乐律动模式
Set_KB_GameMusicColor(mode,color):修改音乐律动颜色，需要传入颜色模式（0:单色，1:混彩），颜色
Set_KB_MusicStop:关闭音乐律动

2026.05.20
修改
Set_KB_MusicStart:办公键盘在开启音乐律动的时候的时候先切换到灯光模式到音乐律动模式

新增函数
Set_Device_MagneticMicroswitchCal(state):设置磁微动鼠标进入校准模式
新增参数
磁微动参数,用户需要自己监听magneticMicroswitchCal.state的值来判断是否校准完成
霍尔按键校验流程：
1.	驱动下发Set_Device_MagneticMicroswitchCal(1)
2.	magneticMicroswitchCal.state = 1时，鼠标按键进入校验模式
3.	通过magneticMicroswitchCal.left/right.currentRoute来判断当前行程（0-10）
3.	通过magneticMicroswitchCal.left/right.pressCalCompleted/releaseCalCompleted来判断当前按键按下/释放校准是否完成
4.	magneticMicroswitchCal.state = 0时，鼠标按键退出校验模式

magneticMicroswitchCal:{
    state:0,
    left:{
        currentRoute:0,//
        pressCalCompleted:false,
        releaseCalCompleted:false,
    },
    right:{
        currentRoute:0,
        pressCalCompleted:false,
        releaseCalCompleted:false,
    },
},
*/

import { ref, reactive } from "vue";
// getItem from legacy utils removed for TeevoLink v2
//键盘按键转HID值
import HIDKey from "./HIDKey";
//电池优化
import BatteryHandle from "./BatteryHandle";
//数据转换
import UserConvert from "./UserConvert";
//升级
import UpgradeHandle from "./UpgradeHandle";

//浏览模式，有USB连接过程，但是没有USB数据收发
var visit = false;

var Command = {
  EncryptionData: 1,//下传加密沟通数据
  PCDriverStatus: 2,//下传驱动状态的命令（驱动是否处于窗口激活状态）
  DeviceOnLine: 3,//获取无线鼠标是否在线
  BatteryLevel: 4, //获取电池电量
  DongleEnterPair: 5,//设置无线Dongle进入配对状态
  GetPairState: 6,//获取无线Dongle配对结果
  WriteFlashData: 7,//设置eeprom内容
  ReadFlashData: 8,//获取eeprom内容
  ClearSetting: 9,//恢复出厂设置
  StatusChanged: 0x0A,//上报鼠标某些状态改变，如DPI等
  SetDeviceVidPid: 0x0B,//设置Dongle的USB VID/PID
  SetDeviceDescriptorString: 0x0C,//设置Dongle的USB设备描述字符串
  EnterUsbUpdateMode: 0x0D,//进入USB升级模式
  GetCurrentConfig: 0x0E,//获取当前配置
  SetCurrentConfig: 0x0F,//设置当前配置
  ReadCIDMID: 0x10,//获取鼠标CID/mid
  EnterMTKMode: 0x11,//设置无线Dongle进入EMI/MTK测试模式
  ReadVersionID: 0x12,//获取鼠标版本号

  Set4KDongleRGB: 0x14,//设置4K dongle RGB灯模式,dongle上有个rgb灯（不是在鼠标上）
  Get4KDongleRGBValue: 0x15,//获取4K dongle RGB灯模式
  SetLongRangeMode: 0x16,//设置远距离模式
  GetLongRangeMode: 0x17,//获取远距离模式
  SetDongleRGBBarMode: 0x18,//设置dongle灯带模式
  GetDongleRGBBarMode: 0x19,//获取dongle灯带模式  

  GetDongleVersion: 0x1d, //获取dongle版本

  SetDongle3RGBMode: 0x2C,//设置dongle 3个RGB灯模式
  GetDongle3RGBMode: 0x2D,//获取dongle 3个RGB灯模式 

  SetMagneticMicroswitchCal: 0x2E,//设置磁微动鼠标进入校准模式

  SetMusicColorful: 0xB0,//音乐律动全彩
  SetMusicLightOFF: 0xB1,//音乐律动全键单色
  SetOfficeMusicParameter: 0xB2,//设置办公键盘音乐律动参数
  GetOfficeMusicParameter: 0xB3,//获取办公键盘音乐律动参数

  OfficeMusicAmplitude: 0xB6,//办公键盘音乐律动振幅
  OfficeCustomLightState: 0xB7,//办公键盘自定灯光开关

  WriteKBCIdMID: 0xF0,//读取cid mid,cx53710专用
  ReadKBCIdMID: 0xF1,//读取cid mid,cx53710专用

  //专案，普通客户不支持
  SetMotorParam: 0x2E,//设置震动马达参数
  GetMotorParam: 0x2F,//获取震动马达参数 
  RestoreMotorParam: 0x30,//震动马达参数恢复默认 

  SetOLEDPicture: 0x31,//OLED 图片数据更新
  RestoreOLEDPicture: 0x32,//OLED 图片数据更新  
}

//鼠标EEPROM起始地址
var MouseEepromAddr = {
  ReportRate: 0x00,//报告率
  maxDpiStage: 0x02,//最大DPI档位
  CurrentDPI: 0x04,//当前DPI档位
  KeyOperation: 0x08,//按键操作模式  
  LOD: 0x0A,//LOD高度
  DPIValue: 0x0C,//第一档DPI值
  DPIColor: 0x2C,//第一档DPI颜色
  DPIEffectMode: 0x4C,//DPI灯效
  DPIEffectBrightness: 0x4E,//DPI灯效亮度
  DPIEffectSpeed: 0x50,//DPI灯效亮度
  DPIEffectState: 0x52,//DPI灯效亮度
  Light: 0xA0,//装饰灯
  DebounceTime: 0xA9,//按钮消抖
  MotionSync: 0xAB,
  SleepTime: 0xAD,//休眠时间
  Angle: 0xAF,
  Ripple: 0xB1,
  MovingOffLight: 0xB3,
  PerformanceState: 0xB5,
  Performance: 0xB7,
  SensorMode: 0xB9,
  AngleTune: 0xBD,
  AngleTuneState: 0xBF,
  SensorFPS20K: 0xE1,
  WheelDebounceTime: 0xE3,//滚轮防抖时间
  DebounceReleaseTime: 0xE5,//按键抬起防抖时间 
  FlywheelState: 0xE9,//滚轮/飞轮开关
  FlywheelMaxSpeed: 0xEB,//飞轮初始最快速度
  FlywheelMaxSpeedTime: 0xEC,//飞轮最快速度持续时间
  FlywheelReduceSpeed: 0xED,//飞轮降速快慢 
  LeftTrigger: 0xEF,//左键触发点
  LeftFastTrigger: 0xF1,//左键快速触发
  LeftTactileFeedback: 0xF3,//左键触觉反馈
  RightTrigger: 0xF5,//右键触发点
  RightFastTrigger: 0xF7,//右键快速触发
  RightTactileFeedback: 0xF9,//右键触觉反馈  
  KeyFunction: 0x60,
  ShortcutKey: 0x0100,
  Macro: 0x0300,
  Sensor3955DPI: 0x1B00,
  EndEeprom: 0x1B4B,
}

var GameKeyboardEepromAddr = {
  CustomLightMaps: 0x1820,
  TapeParam: 0x1D40,
  CurrentLightMode: 0x2130,
  LightModeCount: 0x10,
  LightState: 0x2132,
  OffLightTime: 0x2134,
  EffectPara: 0x2160,
  EffectParaEnd: 0x24A0,

  ReportRate: 0x24C0,
  BootAnimation: 0x24C2,
  BootAnimationState: 0x24C4,
  ForbidKeyFunction: 0x24C6,
  CurrentSystem: 0x24C8,
  FNLockState: 0x24CA,
  FullKeyLockState: 0x24CC,
  MusicState: 0x24CE,
  ScanKeyTime: 0x24D0,
  MultikeyType: 0x24D2,
  WASDKey: 0x24D4,
  End: 0x24A0,
  SyncCRC: 0x2520,
  SyncCRCEnd: 0x2618,
  SyncCRCLen: 0x08,
  SyncCRCLightIndex: 12,
  SyncCRCMacroIndex: 16,
  Macro: 0x2750,

  SystemKeysSize: 0x600,
  LayoutKeysSize: 0x200,
  MaxLayouts: 3,
};

var OfficeKeyboardEepromAddr = {
  CustomLightMaps: 0x1820,
  TapeParam: 0x1d40,
  CurrentLightMode: 0x1210,
  LightModeCount: 0x0a,
  LightState: 0x1212,
  OffLightTime: 0x1214,
  EffectPara: 0x1226,
  EffectParaEnd: 0x14a6,

  ReportRate: 0x14b6,
  BootAnimation: 0x14b8,
  BootAnimationState: 0x14ba,
  ForbidKeyFunction: 0x14bc,
  CurrentSystem: 0x14be,
  FNLockState: 0x14c0,
  FullKeyLockState: 0x14c2,
  MusicState: 0x14c4,
  ScanKeyTime: 0x14c6,
  MultikeyType: 0x14c8,
  WASDKey: 0x14ca,
  End: 0x14e5,
  SyncCRC: 0x2b90,
  SyncCRCEnd: 0x2c9c,
  SyncCRCLen: 0x04,
  SyncCRCLightIndex: 8,
  SyncCRCMacroIndex: 11,
  SyncCRCOfficeLightIndex: 27,
  Macro: 0x14f6,
  OfficeCustomParam: 0x2d10,
  OfficeCustomLights: 0x2d14,

  SystemKeysSize: 0x480,
  LayoutKeysSize: 0x240,
  MaxLayouts: 2,
};

//鼠标按键功能
var MouseKeyFunction = {
  Disable: 0x00,
  MouseKey: 0x01,
  LeftKey: 0x0100,
  DPISwitch: 0x02,
  LeftRightRoll: 0x03,
  FireKey: 0x04,
  ShortcutKey: 0x05,
  Macro: 0x06,
  ReportRateSwitch: 0x07,
  LightSwitch: 0x08,
  ProfileSwitch: 0x09,
  DPILock: 0x0a,
  UpDownRoll: 0x0b,
};

var KeyboardKeyFunction = {
  Disable: 0x00,
  Modify: 0x01,
  Normal: 0x02,
  Media: 0x03,
  Power: 0x04,
  Special: 0x05,
  Function: 0x06,
  Combine: 0x07,
  Macro: 0x08,
  Queue: 0x09,
  Mouse: 0x0a,
  PCKey: 0x0b,
  ADCKey: 0x0c,
  MouseFireKey: 0x0d,
};

//配对状态
var DevicePairResult = reactive({
  Pairing: 0x01,
  Fail: 0x02,
  Success: 0x03,
});

var DeviceConectState = reactive({
  Disconnected: 0x00,
  Connecting: 0x01,
  Connected: 0x02,
  TimeOut: 0x03,
});

var on = true;
var off = false;

var usb;

var ReportId = 0x08;
var devicePID = ref("");

var device;
var historyDevices = [];
let historyDevicesInfos = [];
var receivedData = [];
var sendingFlag = false;
var flashData = new Uint8Array(0x4000).fill(0);
var flashEndAddress = 0;

var KeyboardEepromAddr = 0;

//获取设备超时定时器
var getFlashTimerID;
var getFlashTimerTickCount = 0;
//查询是否在线定时器
var onlineTimerID;
//查询电池定时器
var batteryTimerID;
//查询配对状态定时器
var pairTimerID;
//发送HID Buffer定时器
var sendHIDBufferTimerID;
//发送HID Buffer超时
var sendHIDBufferTimerTimeOut;

//配对结果
var pairResult = reactive({
  pairStatus: 0,
  pairLeftTime: 20,
});

var SYSTEMS = ["win", "mac", "iOS", "android"];
var LAYOUTS = ["normal", "fn", "fn2"];

var getCurrentPorfileFlag = false;
var setCurrentPorfileFlag = false;
var getPairResultTimeCount = 0;

//是否需要获取电量
var getBatteryFlag = false;
var driverOnlineFlag = false;

//OLED
var oledSetErrorFlag = false;

//键盘音乐律动
var musicObject = reactive({
  isCapturing: false,
  errorMsg: '',
  audioCtx: null,
  mediaStream: null,
  analyserNode: null,
  keepAliveCtx: null,
  keepAliveSource: null,
  rmsHistory: [],
  historyMaxLen: 43,
  beatThresholdFactor: 1.5,
  //游戏键盘才需要初始化的参数  
  mode: 0,//游戏键盘的音乐律动模式
  colorMode: 0,//0:单色模式 1:混彩模式
  matrix: [],//游戏键盘的按键矩阵，二维数组
  roundMatrix: [[]],//游戏键盘将矩阵转成圆形的
  color: 'rgb(255,0,0)',//颜色
  values: [],//下发的HID值
  valuesIndex: 0,//当前下发到第几包
  packageIsEmpty: true,//游戏键盘音乐律动数据为空，可以下发下一包数据
})


var deviceInfo = reactive({
  deviceOpen: false,
  connectState: DeviceConectState.Disconnected,//Device connect state
  online: false,//设备在不在线
  addr: [],//设备地址
  info: {
    cid: 1,//设备的CID，MID
    mid: 1,
    type: 1//设备类型 0:dongle_1K, 1:dongle_4K, 2:有线_1K  3:有线_4K
  },
  pairCID: 0,
  type: "mouse", //当前设备类型：
  // type: getItem("deviceType") || "mouse", //当前设备类型：
  isWired: false, //设备是有线还是无线-是否是有线
  maxReportRate: 1000, //该设备最大报告率
  battery: {
    level: 20, //电量百分比
    charging: false, //0：没充电 1：充电中
    voltage: 0x0e90, //电池电压
  },
  batteryOptimizeInit: false,
  batteryOptimize: false,//是否开启电池优化
  autoGetBattery: true,//定时获取电量
  version: {
    dongle: "--",//接收器版本
    device: "--",//设备版本
  },
  supportChangeProfile: false, //是否可以切换报告率
  profile: 0, //设备当前选择的配置
  isRestoring: false, //是否正在恢复出厂设置
  showOfflineDialog: false, //设备不在线的时候显示是否需要显示不在线窗体
  lastSyncError: "", // 最近一次参数同步异常（网页诊断用）
  dongle4KRGB: {
    mode: 0,
    color1: "rgb(255,0,0)",
    color2: "rgb(255,0,0)",
    color3: "rgb(255,0,0)",
  },
  defaultDongle4KRGB: {
    mode: 2,
    color1: "rgb(255,0,0)",
    color2: "rgb(255,0,0)",
    color3: "rgb(255,0,0)",
  },
  dongleRGBBar: {
    mode: 0,
    color: "rgb(255,0,0)",
    speed: 3,
    brightness: 3,
    time: 1,
  },
  dongle3LEDRGB: {
    mode: [],
  },
  defaultDongleRGBBar: {
    mode: 0,
    color: "rgb(255,0,0)",
    speed: 3,
    brightness: 3,
    time: 1,
  },
  mouseCfg: {
    //鼠标配置
    reportRate: 1, //回报率
    maxDpiStage: 4, //最大DPI
    currentDpi: 2, //当前DPI
    xSpindown: 0, //
    ySpindown: 0, //
    debounceTime: 8, //按键防抖时间
    debounceReleaseTime: 8, //按键抬起防抖时间
    supportLongDistance: true, //是否支持远距离模式
    longDistance: false, //远距离模式
    defaultLongDistance: false, //默认远距离模式，恢复出厂设置的时候需要下传USB
    supportAngleTune: true,
    angleTune: 0x00, //0XE2: -30 degree
    //0XF6: -10 degree
    //0X00:  0 degree
    //0X0F: +15 degree
    //0X1E: +30 degree
    angleTuneState: 0, //0: Angle tune disable(default) 1:Angle tune enable
    wheelDebounceTime: 0, //10ms-30ms
    leftKeyOperation: 0, //0：普通模式 1：超前模式
    rightKeyOperation: 0, //0：普通模式 1：超前模式
    sensor: {
      //sensor的配置
      cfg: {}, //读取sensor.json中当前sensor的配置，包括range,value(可能没有)
      type: "3950", //sensor型号
      dpiEepromKind: "", // 实际 DPI 存储区：3950@0x0C 或 3955@0x1B00（连接后自动检测）
      lod: 1, //lod参数
      motionSync: false, //motionSync
      angle: false, //直线修正
      ripple: false, //波纹控制
      performanceState: false, //火力全开状态
      performance: 6, //火力全开时间
      sensorMode: 0, //sensor模式
      sensorModeDisplay: 0, //sensor模式
      sensorModeDisable: false,
      fps20k: 0, //only NRF54
    },
    flywheel: {
      state: 0,
      maxSpeed: 2,
      maxSpeedTime: 2,
      reduceSpeed: 2,
    },
    motor: {
      mode: 0,
      levels: [0, 0, 0],
      buttons: [0, 0, 0, 0, 0, 0],
      switches: 0
    },
    trigger: {
      left: {
        triggerPoint: 0,//左键触发点
        fastTriggerState: 0,//左键快速触发开关
        fastTrigger: 0,//左键快速触发档位
        tactileFeedback: 0,//左键触觉反馈强度
        buttonSound: 0,//左键触觉反馈按键声音开关
        currentRoute: 0,//左键当前行程
      },
      right: {
        triggerPoint: 0,//右键触发点
        fastTriggerState: 0,//右键快速触发开关
        fastTrigger: 0,//右键快速触发档位
        tactileFeedback: 0,//右键触觉反馈强度
        buttonSound: 0,//右键触觉反馈按键声音开关
        currentRoute: 0,//右键当前行程
      }
    },
    magneticMicroswitchCal: {
      state: 0,
      left: {
        currentRoute: 0,
        pressCalCompleted: false,
        releaseCalCompleted: false,
      },
      right: {
        currentRoute: 0,
        pressCalCompleted: false,
        releaseCalCompleted: false,
      },
    },
    dpis: [//DPI的配置
      {
        value: 400, //DPI值
        x: 400,
        y: 400,
        color: "#ff0000", //DPI颜色
      },
      {
        value: 800,
        x: 800,
        y: 800,
        color: "#00ff00",
      },
      {
        value: 1600,
        x: 1600,
        y: 1600,
        color: "#0000ff",
      },
      {
        value: 3200,
        x: 3200,
        y: 3200,
        color: "#ff00ff",
      },
      {
        value: 400,
        x: 400,
        y: 400,
        color: "#ff0000",
      },
      {
        value: 400,
        x: 400,
        y: 400,
        color: "#ff0000",
      },
      {
        value: 400,
        x: 400,
        y: 400,
        color: "#ff0000",
      },
      {
        value: 400,
        x: 400,
        y: 400,
        color: "#ff0000",
      },
    ],
    dpiEffect: {
      //DPI灯效配置
      mode: 1, //1.常亮；2.呼吸
      state: on, //DPI灯效开关，off：关，on：开
      brightness: 3, //亮度
      speed: 3, //速度
    },
    lightEffect: {
      //灯光灯效配置
      mode: 2,
      /*
      0x00: 关闭（不支持调速，不支持调亮度，不支持调颜色）
      0X01: 彩色流动（默认）（支持调速、调亮度，不支持调颜色）
      0X02: 单色呼吸（支持调速、调亮度、调颜色）
      0X03: 单色常亮（支持调亮度、颜色，不支持调速度）
      0X04: 霓虹（支持调速、调亮度，不支持调颜色）
      0X05: 混彩呼吸（支持调速、调亮度，不支持调颜色）
      0X06: 炫彩常亮（支持调速、调亮度，不支持调颜色）
      */
      brightness: 3, //亮度
      speed: 3, //速度
      color: "#ff0000", //装饰灯颜色
      state: on, //DPI灯效开关，off：关，on：开
      movingOffState: false, //移动时关闭指示灯
    },
    sleepTime: 3,//休眠时间和放停时关闭装饰灯
    keysCount: 16,//鼠标的按键个数
    keys: [//按键配置
      {
        value: ["1", "0x0001"],
      },
      {
        value: ["1", "0x0002"],
      },
      {
        value: ["1", "0x0004"],
      },
      {
        value: ["1", "0x0010"],
      },
      {
        value: ["1", "0x0008"],
      },
      {
        value: ["2", "0x0001"],
      },
      {
        value: ["2", "0x0002"],
      },
      {
        value: ["2", "0x0003"],
      },
    ],
    shortCutKey: [
      //快捷键
      /*
    isMedia : false,true:是多媒体键，false：快捷键
    contexts : [
    {
      status：按键状态：0为按下，1为抬起
      type：按键类型
      value：按键值
    },
    {
      status：按键状态：0为按下，1为抬起
      type：按键类型
      value：按键值
    },],
    */
    ],
    macros: [
      //宏
      /*
    macro = {
    name:name,
    contexts:[
    {
      status：按键状态：0为按下，1为抬起
      type：按键类型
      value：按键值
    },
    {
      status：按键状态：0为按下，1为抬起
      type：按键类型
      value：按键值
    },
    ]}
    */
    ],
  },
  keyboard: {
    reportRate: 1, //回报率
    bootAnimation: 0, //开机动画
    bootAnimationState: 0, //开机动画开关
    forbidKeyFunction: 0, //禁用键功能
    currentSystem: 0, //当前系统状态
    fnLockState: 0, //FNLOCK状态
    fullKeyLockState: 0, //全键锁功能
    musicState: 0, //音乐律动模式开关
    scanKeyTime: 0, //按键延时时间 数值:0~255(单位0.1ms)---(延时时间0~25ms) 数值0:极速模式。 数值50:普通模式。
    multikeyType: 0, //Multikey_type:    0x00:全键无冲模式。    0x01:六键无冲模式。
    wasdKey: 0, //0x00:正常模式。 0x01:WASD和方向键互换。
    importingProfile: false,
    lightChange: false,
    lightEffect: {
      mode: 0,
      state: on, //DPI灯效开关，off：关，on：开
      offTime: 0,

      effects: [
        {
          colorIndex: 0,
          brightness: 3,//亮度
          speed: 3,//速度
          colors: [
            "#ff0000"
          ]
        }
      ]
    },
    customLights: [
      {
        type: 0,
        streamIndex: 0, //流水号
        streamListIndex: 0, //流水序列号
        runningIndex: 0, //流水号
        runningListIndex: 0, //流水序列号
        speed: 0,
        brightness: 0,
        color: "rgb(255,0,0)",
      },
    ],
    officeCustomParam: {
      customLightState: 0,
      macroState: 0,
      totalRows: 1,
      groups: [
        {
          time: 10,
          reserve: [],
        },
      ],
    },
    officeCustomLights: [
      [
        {
          mode: 0,
          speed: 0,
          brightness: 0,
          color: "rgb(255,0,0)",
        },
      ],
    ],
    officeMusicParam: {
      mode: 0,
      speed: 0,
      brightness: 0,
      colorMode: 0,
      foregroundColor: "rgb(255,0,0)",
      backgroundColor: "rgb(255,0,0)",
    },
    systems: ["win", "mac", "iOS", "android"],//选择需要获取的系统，按需填写，可以减少获取时间
    layouts: ["normal", "fn"],//选择需要获取的层，按需填写，可以减少获取时间
    keys: {
      win: {
        normal: [
          {
            value: [0, 0],
          },
        ],
        fn: [],
        fn2: [],
      },
      mac: {
        normal: [
          {
            value: [0, 0],
          },
        ],
        fn: [],
        fn2: [],
      },
      iOS: {
        normal: [
          {
            value: [0, 0],
          },
        ],
        fn: [],
        fn2: [],
      },
      android: {
        normal: [
          {
            value: [0, 0],
          },
        ],
        fn: [],
        fn2: [],
      },
    },

    macros: [
      //宏
      /*
    macro = {
    name:name,
    contexts:[
    {
      status：按键状态：0为按下，1为抬起
      type：按键类型
      value：按键值
    },
    {
      status：按键状态：0为按下，1为抬起
      type：按键类型
      value：按键值
    },
    ]}
    */
    ],
    crcs: [],
  },
});

/*
请求设备连接，filters参数如下：
var filter = {
  vendorId: Number.parseInt(vid),
  productId: Number.parseInt(pid),
}
filters.push(filter);

return true:设备连接
       false：设备未连接
*/
async function Request_Device(filters) {
  const devices = await navigator.hid.requestDevice({ filters });
  if (devices.length == 0) return false;

  var connect = false;
  for (let temp of devices) {
    if (visit) {
      connect = visit;
      break;
    }

    //判断连接设备的端口是否符合要求
    for (let i = 0; i < temp.collections.length; i++) {
      if (temp.collections[i].inputReports.length === 1 && temp.collections[i].outputReports.length === 1) {
        //只识别ReportId为0x08的设备
        if (ReportId == temp.collections[i].outputReports[0].reportId) {
          device = temp;

          if (!device.opened) {
            await device.open();
          }

          deviceInfo.deviceOpen = true;
          read_HID_Buffer();

          // devicePID = device.vendorId;
          devicePID.value = `0x${String(device.productId?.toString(16).padStart(4, "0")).toUpperCase()}`;

          Device_Disconnect();
          connect = true;

          await Get_Device_Info();
          console.log("requestDevice:", { devices, deviceInfo });
          break;
        }
      }
    }
  }
  return connect;
}

/* 本地记住设备信息 */
function Device_Remember(deviceType, info) {
  if (device?.productId && device?.vendorId) {
    const connectDevices = JSON.parse(localStorage.getItem("hidDevices")) || [];
    const currentInfo = {
      deviceName: device?.productName || "",
      deviceType: deviceType,
      productId: device.productId,
      vendorId: device.vendorId,
      ...info,
    };
    if (connectDevices.length == 0) {
      connectDevices.push(currentInfo);
      localStorage.setItem("hidDevices", JSON.stringify(connectDevices));
    } else {
      const deviceIndex = connectDevices.findIndex(({ deviceName, productId, vendorId }) => {
        return deviceName == device.productName && productId == device.productId && vendorId == device.vendorId;
      });
      if (deviceIndex === -1) {
        connectDevices.push(currentInfo);
      } else {
        const deviceTypeNo = connectDevices[deviceIndex].deviceType !== deviceType;
        if (deviceTypeNo) {
          const isRepeat = connectDevices.findIndex((item) => JSON.stringify(item) === JSON.stringify(currentInfo));
          if (isRepeat === -1) connectDevices.push(currentInfo);
        } else {
          connectDevices[deviceIndex] = currentInfo;
        }
      }
      localStorage.setItem("hidDevices", JSON.stringify(connectDevices));
    }
  }
}

//设备连接
async function Device_Connect() {
  if (visit == false) {
    /** 网页驱动 driverOnlineFlag=false 时跳过 Get_Dongle_Param，避免部分 8K 接收器固件命令导致断连 */
    if (deviceInfo.isWired == false && driverOnlineFlag) {
      await Get_Dongle_Param();
    }

    if ((await Get_Online_Interval()) == false) {
      onlineTimerID = setInterval(Get_Online_Interval, 1500);
    }
  }
}
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

async function Get_HistoryDevicesInfo() {
  var gettingHistoryDevicesInfo = false;
  let connectDevices = JSON.parse(localStorage.getItem("hidDevices")) || [];
  if (gettingHistoryDevicesInfo == false) {
    gettingHistoryDevicesInfo = true;
    let devices = await navigator.hid.getDevices();
    if (devices.length == 0) {
      historyDevicesInfos = [];
      historyDevices = [];
      return historyDevicesInfos;
    }

    var equal = true;

    if (historyDevices.length !== devices.length) {
      equal = false;
    } else {
      equal = historyDevices.every((item, index) => deepEqual(item, devices[index]));
    }

    if (equal == false) {
      historyDevicesInfos = [];
      historyDevices = devices;
      for (let j = 0; j < devices.length; j++) {
        let temp = devices[j];
        for (let i = 0; i < temp.collections.length; i++) {
          if (temp.collections[i].inputReports.length === 1 && temp.collections[i].outputReports.length === 1) {
            //只识别ReportId为0x08的设备
            if (ReportId == temp.collections[i].outputReports[0].reportId) {
              device = temp;

              if (!device.opened) {
                await device.open();
              }

              deviceInfo.deviceOpen = true;
              await read_HID_Buffer();

              const currentDevice = connectDevices.filter(({ productId, vendorId, deviceName }) => productId == device.productId && vendorId == device.vendorId && deviceName == device.productName);
              if (currentDevice.length > 1) deviceInfo.type = currentDevice?.deviceType || "mouse";
              const info = await Get_Device_Info();

              var isWired = false;
              var reportRate = 1000;
              // 设备类型
              // 0:dongle_1K,
              // 1:dongle_4K,
              // 2:有线_1K
              // 3:有线_8K
              // 4:dongle_2K
              // 5:dongle_8K
              if (info.type == 0x02) {
                isWired = true;
                reportRate = 1000;
              } else if (info.type == 0x03) {
                isWired = true;
                reportRate = 8000;
              } else {
                isWired = false;
                if (info.type == 0x00) {
                  reportRate = 1000;
                } else if (info.type == 0x01) {
                  reportRate = 4000;
                } else if (info.type == 0x04) {
                  reportRate = 2000;
                } else if (info.type == 0x05) {
                  reportRate = 8000;
                }
              }

              var online = await Get_Device_Online();

              for (let item of currentDevice) {
                historyDevicesInfos.push({
                  device: temp,
                  cid: item?.cid || info.cid,
                  mid: item?.mid || info.mid,
                  isWired: isWired,
                  reportRate: reportRate,
                  online: online,
                  deviceType: item?.deviceType || deviceInfo.type,
                  maxType: item?.maxType,
                  type: item?.type ?? info?.type,
                });
              }
              console.log({ info, device, historyDevicesInfos, currentDevice, connectDevices }, "-----------获取连接过的设备");
              break;
            }
          }
        }
      }
      gettingHistoryDevicesInfo = false;
    } else {
      for (let i = 0; i < historyDevicesInfos.length; i++) {
        let temp = historyDevicesInfos[i].device;
        device = temp;

        if (!device.opened) {
          await device.open();
        }

        deviceInfo.deviceOpen = true;
        read_HID_Buffer();

        var online = await Get_Device_Online();
        historyDevicesInfos[i].online = online;
      }
      gettingHistoryDevicesInfo = false;
    }
  }
  const result = historyDevicesInfos.filter((item) => item?.type !== undefined);
  return result.reduce((acc, cur) => {
    const isExist = acc.some((item) => item.type === cur.type && item.deviceType === cur.deviceType && item.cid === cur.cid && item.mid === cur.mid);
    if (!isExist) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

async function Get_Current_Device_Online(temp) {
  device = temp;

  if (!device.opened) {
    await device.open();
  }

  deviceInfo.deviceOpen = true;
  read_HID_Buffer();

  var online = await Get_Device_Online();
  return online;
}

var isListenHIDConnectEvent = false;
var hidDeviceChangeEvent = reactive({ value: false });

const handleHIDConnectEvent = (event) => {
  if (isListenHIDConnectEvent == false) {
    isListenHIDConnectEvent = true;

    setTimeout(() => {
      isListenHIDConnectEvent = false;
      hidDeviceChangeEvent.value = true;
    }, 200);
  }
};

const handleHIDDisconnectEvent = (event) => {
  if (event.device.collections.length >= 2) {
    for (var i = 0; i < event.device.collections.length; i++) {
      if (event.device.collections[i].inputReports.length === 1 && event.device.collections[i].outputReports.length === 1) {
        //只识别ReportId为0x08的设备
        if (ReportId == event.device.collections[i].outputReports[0].reportId) {
          hidDeviceChangeEvent.value = true;
          if (event.type == "disconnect") {
            const connectDevices = JSON.parse(localStorage.getItem("hidDevices")) || [];
            const deviceIndex = connectDevices.findIndex(({ deviceName, productId, vendorId }) => {
              if (deviceName) return deviceName == event.device.productName && productId == event.device.productId && vendorId == event.device.vendorId;
              return productId == event.device.productId && vendorId == event.device.vendorId;
            });
            if (deviceIndex > -1) {
              connectDevices.splice(deviceIndex, 1);
              localStorage.setItem("hidDevices", JSON.stringify(connectDevices));
            }
          }
        }
      }
    }
  }
};

async function Add_Listen_HID_Events() {
  navigator.hid.addEventListener("connect", handleHIDConnectEvent);
  navigator.hid.addEventListener("disconnect", handleHIDDisconnectEvent);
}

async function Remove_Listen_HID_Events() {
  navigator.hid.removeEventListener("connect", handleHIDConnectEvent);
  navigator.hid.removeEventListener("disconnect", handleHIDDisconnectEvent);
}

//回连设备
async function Device_Reconnect(temp) {
  device = temp;
  if (!device.opened) {
    await device.open();
  }
  deviceInfo.deviceOpen = true;
  read_HID_Buffer();

  devicePID.value = `0x${String(device.productId?.toString(16).padStart(4, "0")).toUpperCase()}`;
  Device_Disconnect();

  const info = await Get_Device_Info();
  console.log("Device_Reconnect:", info, device, deviceInfo);
  return info;
}

function clear_All_Interval() {
  if (pairTimerID) {
    clearInterval(pairTimerID);
  }

  if (batteryTimerID) {
    clearInterval(batteryTimerID);
  }

  if (onlineTimerID) {
    clearInterval(onlineTimerID);
  }

  if (getFlashTimerID) {
    clearInterval(getFlashTimerID);
  }

  if (sendHIDBufferTimerID) {
    clearTimeout(sendHIDBufferTimerID);
  }
}

function battery_Handle_Exit() {
  BatteryHandle.batteryHandleExit();
  deviceInfo.batteryOptimize = false;
  deviceInfo.batteryOptimizeInit = false;
}

function deviceInfo_Restore() {
  deviceInfo.deviceOpen = false;
  deviceInfo.connectState = DeviceConectState.Disconnected;
  deviceInfo.online = false;
  deviceInfo.version.device = "--";
  deviceInfo.version.dongle = "--";
}

//设备退出
function Handle_Exit() {
  historyDevices = [];
  historyDevices = [];
  clear_All_Interval();
  battery_Handle_Exit();
}

//设备主动断开，例如拔出设备
function Device_Disconnect() {
  navigator.hid.ondisconnect = async (event) => {
    if (event.device.productName === device.productName) {
      await Handle_Exit();

      deviceInfo_Restore();
    }
  };
}

//驱动断开设备，如驱动关闭
async function Device_Close() {
  if (typeof driverOnlineFlag != "undefined") {
    if (driverOnlineFlag) await Set_PC_Satae(0); //网页驱动版本现在不需要了
  }

  await Handle_Exit();

  deviceInfo_Restore();
  if (visit == false) {
    if (typeof device != "undefined") await device.close();
  }
}

//读USB设备上传的数据
function read_HID_Buffer() {
  device.oninputreport = async (event) => {
    if (event.reportId === ReportId) {
      receivedData = new Uint8Array(event.data.buffer);
      let command = receivedData[0];

      if (receivedData[1] == 0) {
        switch (command) {
          //获取设备的cid,mid和设备类型
          case Command.EncryptionData:
            deviceInfo.info.cid = receivedData[9];
            deviceInfo.info.mid = receivedData[10];
            deviceInfo.info.type = receivedData[11];
            // 设备类型
            // 0:dongle_1K,
            // 1:dongle_4K,
            // 2:有线_1K
            // 3:有线_8K
            // 4:dongle_2K
            // 5:dongle_8K
            if (deviceInfo.info.type == 0x02) {
              deviceInfo.isWired = true;
              deviceInfo.maxReportRate = 1000;
            } else if (deviceInfo.info.type == 0x03) {
              deviceInfo.isWired = true;
              deviceInfo.maxReportRate = 8000;
            } else {
              deviceInfo.isWired = false;
              if (deviceInfo.info.type == 0x00) {
                deviceInfo.maxReportRate = 1000;
              } else if (deviceInfo.info.type == 0x01) {
                deviceInfo.maxReportRate = 4000;
              } else if (deviceInfo.info.type == 0x04) {
                deviceInfo.maxReportRate = 2000;
              } else if (deviceInfo.info.type == 0x05) {
                deviceInfo.maxReportRate = 8000;
              }
            }
            break;

          //驱动状态
          case Command.PCDriverStatus:
            break;

          //设备是否在线
          case Command.DeviceOnLine:
            deviceInfo.online = receivedData[5];
            deviceInfo.addr.length = 3;
            deviceInfo.addr[2] = receivedData[6];
            deviceInfo.addr[1] = receivedData[7];
            deviceInfo.addr[0] = receivedData[8];
            break;

          //电池电量
          case Command.BatteryLevel:
            deviceInfo.battery.level = receivedData[5];
            deviceInfo.battery.charging = receivedData[6] == 1;
            deviceInfo.battery.voltage = (receivedData[7] << 8) + receivedData[8];
            //电池优化
            if (deviceInfo.batteryOptimize == false) {
              if (deviceInfo.batteryOptimizeInit == false) BatteryHandle.batteryHandleInit(deviceInfo.addr, deviceInfo.battery);
              deviceInfo.batteryOptimizeInit = true;
              BatteryHandle.setDisplayLevel(deviceInfo.battery);
              deviceInfo.battery.level = BatteryHandle.getDisplayLevel();
              deviceInfo.batteryOptimize = true;
            } else {
              BatteryHandle.setDisplayLevel(deviceInfo.battery);
              //console.log("setDisplayLevel:",deviceInfo.battery,BatteryHandle.getDisplayLevel());
              deviceInfo.battery.level = BatteryHandle.getDisplayLevel();
            }
            break;

          case Command.DongleEnterPair:
            getBatteryFlag = false;
            getPairResultTimeCount = 0;
            pairResult.pairStatus = 0;
            //设备进入对码模式之后需要开启定时监测配对结果
            pairTimerID = setInterval(Get_Device_PairResult, 1000);
            break;

          case Command.GetPairState:
            //配对结果
            pairResult.pairStatus = receivedData[5];
            pairResult.pairLeftTime = receivedData[6];

            if (pairResult.pairStatus == DevicePairResult.Fail || pairResult.pairStatus == DevicePairResult.Success) {
              if (deviceInfo.connectState == DeviceConectState.Connected) getBatteryFlag = true;
              if (pairTimerID) {
                clearInterval(pairTimerID);
              }
            }
            break;

          case Command.WriteFlashData:
            var addr = 0;
            addr = (receivedData[2] << 8) + receivedData[3];
            var len = receivedData[4] & 0x0f;
            for (var i = 0; i < len; i++) {
              flashData[addr + i] = receivedData[5 + i];
            }
            break;

          case Command.ReadFlashData:
            var addr = 0;
            addr = (receivedData[2] << 8) + receivedData[3];
            var len = receivedData[4] & 0x0f;

            for (var i = 0; i < len; i++) {
              flashData[addr + i] = receivedData[5 + i];
            }

            if (deviceInfo.type == "mouse") {
              if (((addr == MouseEepromAddr.ReportRate) && (len == 2)) ||
                ((addr == MouseEepromAddr.CurrentDPI) && (len == 2)) ||
                ((addr == MouseEepromAddr.DPIEffectMode) && (len == 8)) ||
                ((addr == MouseEepromAddr.Light) && (len == 7)) ||
                ((addr == MouseEepromAddr.LOD) && (len == 2)) ||
                ((addr == MouseEepromAddr.DebounceTime) && (len == 2)) ||
                ((addr == MouseEepromAddr.MotionSync) && (len == 2)) ||
                ((addr == MouseEepromAddr.FlywheelState) && (len == 2))) {
                Update_Mouse_Info();
              }
            } else if ((deviceInfo.type == "keyboard") || (deviceInfo.type == "officeKeyboard")) {
              if (((addr == KeyboardEepromAddr.ReportRate) && (len == 2)) ||
                ((addr == KeyboardEepromAddr.CurrentSystem) && (len == 2))) {
                Update_Keyboard_Info();
              }
              else if (((addr == KeyboardEepromAddr.MusicState) && (len == 2)) ||
                ((addr == KeyboardEepromAddr.LightState) && (len == 2))) {
                Update_Keyboard_LightChange();
              }
            }
            break;

          case Command.ClearSetting:
            deviceInfo.isRestoring = false;
            break;

          case Command.StatusChanged:
            var value = receivedData[5];
            var value1 = receivedData[6];

            if (deviceInfo.mouseCfg.magneticMicroswitchCal.state) {
              deviceInfo.mouseCfg.magneticMicroswitchCal.left.currentRoute = receivedData[13] / 10;
              deviceInfo.mouseCfg.magneticMicroswitchCal.right.currentRoute = receivedData[14] / 10;
              if(receivedData[13] == 100){
                  if(deviceInfo.mouseCfg.magneticMicroswitchCal.left.pressCalCompleted == false)
                    deviceInfo.mouseCfg.magneticMicroswitchCal.left.pressCalCompleted = true;
                }

                //磁微动校准要先判断按下之后才能判断抬起
                if ((receivedData[13] == 0) && (deviceInfo.mouseCfg.magneticMicroswitchCal.left.pressCalCompleted == true)){
                  if(deviceInfo.mouseCfg.magneticMicroswitchCal.left.releaseCalCompleted == false)
                    deviceInfo.mouseCfg.magneticMicroswitchCal.left.releaseCalCompleted = true;
                } 
                
                if(receivedData[14] == 100){
                  if(deviceInfo.mouseCfg.magneticMicroswitchCal.right.pressCalCompleted == false)
                    deviceInfo.mouseCfg.magneticMicroswitchCal.right.pressCalCompleted = true;
                }
                
                //磁微动校准要先判断按下之后才能判断抬起
                if((receivedData[14] == 0) && (deviceInfo.mouseCfg.magneticMicroswitchCal.right.pressCalCompleted == true)){
                  if(deviceInfo.mouseCfg.magneticMicroswitchCal.right.releaseCalCompleted == false)
                    deviceInfo.mouseCfg.magneticMicroswitchCal.right.releaseCalCompleted = true;
                }

              if (deviceInfo.mouseCfg.magneticMicroswitchCal.left.pressCalCompleted &&
                deviceInfo.mouseCfg.magneticMicroswitchCal.left.releaseCalCompleted &&
                deviceInfo.mouseCfg.magneticMicroswitchCal.right.pressCalCompleted &&
                deviceInfo.mouseCfg.magneticMicroswitchCal.right.releaseCalCompleted) {
                deviceInfo.mouseCfg.magneticMicroswitchCal.state = 0;
              }
            } else {
              deviceInfo.mouseCfg.trigger.left.currentRoute = receivedData[13] / 10;
              deviceInfo.mouseCfg.trigger.right.currentRoute = receivedData[14] / 10;
            }

            if (deviceInfo.type == "mouse") {
              //DPI档位变化，需要获当前DPI的配置
              if ((value & 0x01) == 0x01) {
                Get_MS_CurrentDPI();
              }

              //报告率变化，需要当前报告率的配置
              if ((value & 0x02) == 0x02) {
                Get_MS_ReportRate();
              }

              //配置变化，需要获取鼠标的所有设置,与打开驱动时同步鼠标的设置操作一样
              if ((value & 0x04) == 0x04) {
                if (getCurrentPorfileFlag == false && setCurrentPorfileFlag == false) {
                  getCurrentPorfileFlag = true;
                  await Get_Device_Profile();
                }
              }

              //DPI指示灯变化，需要获取DPI指示灯的配置
              if ((value & 0x08) == 0x08) {
                Get_MS_DPILightEffect();
              }

              //LOGO指示灯状态改变，需要获取LOGO灯的配置
              if ((value & 0x10) == 0x10) {
              }

              //灯带状态改变，需要获取灯带的配置
              if ((value & 0x20) == 0x20) {
                Get_MS_Light();
              }

              //电量百分比发生改变，需要获取电量
              if ((value & 0x40) == 0x40) {
                Get_Device_Battery();
              }

              //保留
              if ((value & 0x80) == 0x80) {
              }

              //LOD发生改变
              if ((value1 & 0x01) == 0x01) {
                Get_MS_LOD();
              }

              //按键防抖时间发生改变
              if ((value1 & 0x02) == 0x02) {
                Get_MS_DebounceTime();
              }

              //motion sync发生改变
              if ((value1 & 0x04) == 0x04) {
                Get_MS_MotionSync();
              }

              //飞轮模式发生改变
              if ((value1 & 0x08) == 0x08) {
                Get_MS_FlywheelState();
              }
            } else if ((deviceInfo.type == "keyboard") || (deviceInfo.type == "officeKeyboard")) {
              //保留
              if ((value & 0x01) == 0x01) {

              }

              //报告率变化，需要当前报告率的配置
              if ((value & 0x02) == 0x02) {
                Get_KB_ReportRate();
              }

              //系统切换
              if ((value & 0x04) == 0x04) {
                Get_KB_CurrentSystem();
              }

              //设备恢复出厂设置
              if ((value & 0x08) == 0x08) {
                deviceInfo.isRestoring = false;
                //Update_Device_Param();
              }

              //灯光开关
              if ((value & 0x10) == 0x10) {
                Get_KB_LightState();
              }

              //FNLock ON/OFF
              if ((value & 0x20) == 0x20) {
              }

              //电量百分比发生改变，需要获取电量
              if ((value & 0x40) == 0x40) {
                Get_Device_Battery();
              }
              //灯光状态（模式，速度，亮度，颜色）
              if ((value & 0x80) == 0x80) {
                deviceInfo.keyboard.lightChange = false;
                await Get_KB_LightEffectMode();
                await Get_KB_CurrentEffectParam(deviceInfo.keyboard.lightEffect.mode);

                await Get_KB_MusicState();
              }
            }
            break;

          case Command.GetCurrentConfig:
            deviceInfo.supportChangeProfile = true;
            deviceInfo.profile = receivedData[5];

            if (visit == false && getCurrentPorfileFlag) {
              getCurrentPorfileFlag = false;
              await Update_Device_Param();
              deviceInfo.connectState = DeviceConectState.Connected;
            }
            break;

          case Command.SetCurrentConfig:
            break;

          case Command.ReadVersionID:
            var version = "v" + receivedData[5].toString()
              + "." + receivedData[6].toString(16).padStart(2, '0');
            deviceInfo.version.device = version;
            break;

          case Command.Set4KDongleRGB:
            deviceInfo.dongle4KRGB.mode = receivedData[5];
            deviceInfo.dongle4KRGB.color1 = UserConvert.Buffer_To_Color(receivedData, 6);
            deviceInfo.dongle4KRGB.color2 = UserConvert.Buffer_To_Color(receivedData, 9);
            deviceInfo.dongle4KRGB.color3 = UserConvert.Buffer_To_Color(receivedData, 12);
            break;

          case Command.Get4KDongleRGBValue:
            deviceInfo.dongle4KRGB.mode = receivedData[5];
            deviceInfo.dongle4KRGB.color1 = UserConvert.Buffer_To_Color(receivedData, 6);
            deviceInfo.dongle4KRGB.color2 = UserConvert.Buffer_To_Color(receivedData, 9);
            deviceInfo.dongle4KRGB.color3 = UserConvert.Buffer_To_Color(receivedData, 12);
            break;

          case Command.SetLongRangeMode:
            break;

          case Command.GetLongRangeMode:
            deviceInfo.mouseCfg.supportLongDistance = true;
            deviceInfo.mouseCfg.longDistance = receivedData[5] == 1;
            break;

          case Command.SetDongleRGBBarMode:
            deviceInfo.dongleRGBBar.mode = receivedData[5];
            deviceInfo.dongleRGBBar.color = UserConvert.Buffer_To_Color(receivedData, 6);
            deviceInfo.dongleRGBBar.speed = receivedData[9];
            deviceInfo.dongleRGBBar.brightness = receivedData[10];
            deviceInfo.dongleRGBBar.time = receivedData[11];
            break;

          case Command.GetDongleRGBBarMode:
            deviceInfo.dongleRGBBar.mode = receivedData[5];
            deviceInfo.dongleRGBBar.color = UserConvert.Buffer_To_Color(receivedData, 6);
            deviceInfo.dongleRGBBar.speed = receivedData[9];
            deviceInfo.dongleRGBBar.brightness = receivedData[10];
            deviceInfo.dongleRGBBar.time = receivedData[11];
            break;

          case Command.GetDongleVersion:
            var version = "v" + receivedData[5].toString() + "." + receivedData[6].toString(16).padStart(2, "0");
            deviceInfo.version.dongle = version;
            break;

          case Command.SetDongle3RGBMode:
            deviceInfo.dongle3LEDRGB.mode = [];
            for (var i = 0; i < 3; i++) deviceInfo.dongle3LEDRGB.mode.push(receivedData[5 + i]);
            break;

          case Command.GetDongle3RGBMode:
            deviceInfo.dongle3LEDRGB.mode = [];
            for (var i = 0; i < 3; i++)
              deviceInfo.dongle3LEDRGB.mode.push(receivedData[5 + i]);
            break;

          case Command.SetMagneticMicroswitchCal:
            deviceInfo.mouseCfg.magneticMicroswitchCal.state = receivedData[5];
            if (receivedData[5] == 0x01) {
              deviceInfo.mouseCfg.magneticMicroswitchCal.left.pressCalCompleted = false;
              deviceInfo.mouseCfg.magneticMicroswitchCal.left.releaseCalCompleted = false;
              deviceInfo.mouseCfg.magneticMicroswitchCal.right.pressCalCompleted = false;
              deviceInfo.mouseCfg.magneticMicroswitchCal.right.releaseCalCompleted = false;           
            }
            break;

          case Command.SetOLEDPicture:
            oledSetErrorFlag = false;
            break;

          case Command.GetMotorParam:
            deviceInfo.mouseCfg.motor.mode = receivedData[5] & 0x0f;
            deviceInfo.mouseCfg.motor.levels[0] = receivedData[5] >> 4;
            deviceInfo.mouseCfg.motor.levels[1] = receivedData[6] & 0x0f;
            deviceInfo.mouseCfg.motor.levels[2] = receivedData[6] >> 4;
            deviceInfo.mouseCfg.motor.buttons = [];
            for (var i = 0; i < 6; i++) deviceInfo.mouseCfg.motor.buttons.push(receivedData[7 + i]);
            deviceInfo.mouseCfg.motor.switches = receivedData[13];
            break;

          case Command.GetOfficeMusicParameter:
            deviceInfo.keyboard.officeMusicParam.mode = receivedData[5];
            deviceInfo.keyboard.officeMusicParam.speed = receivedData[6];
            deviceInfo.keyboard.officeMusicParam.brightness = receivedData[7];
            deviceInfo.keyboard.officeMusicParam.colorMode = receivedData[8];
            deviceInfo.keyboard.officeMusicParam.foregroundColor = UserConvert.Buffer_To_Color(receivedData, 9);
            deviceInfo.keyboard.officeMusicParam.backgroundColor = UserConvert.Buffer_To_Color(receivedData, 12);
            break;

          case Command.OfficeCustomLightState:
            break;
        }
      } else if (receivedData[1] == 1) {
        switch (command) {
          //不支持远距离模式
          case Command.GetLongRangeMode:
            deviceInfo.mouseCfg.supportLongDistance = false;
            break;

          case Command.GetCurrentConfig:
            deviceInfo.supportChangeProfile = false;
            break;

          case Command.GetDongleVersion:
            deviceInfo.version.dongle = "v1.0";
            break;

          case Command.SetOLEDPicture:
            oledSetErrorFlag = true;
            break;
        }
      }
      sendingFlag = false;
    }
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//下发USB数据
//data：长度16的byte数组
async function Send_HID_Buffer(data) {
  var result = false;

  if (visit) {
    return visit;
  }

  var index = 0;
  var sendCount = -1;

  while (index < 5) {
    if (sendCount != index) {
      try {
        sendingFlag = true;

        await device.sendReport(ReportId, data);
        Send_HID_Buffer_Timeout(200);
      } catch (e) {
        console.error(e);
        return false;
      }
      sendCount = index;
    }

    if (sendHIDBufferTimerTimeOut) {
      index++;
    } else if (sendingFlag == false) {
      var check = true;
      var len = 3;
      if (data[0] == 0x08) {
        len = 5;
      }

      for (var j = 0; j < len; j++) {
        if (receivedData[1] === 1) {
          return true;
        }

        if (data[j] !== receivedData[j]) {
          check = false;
          break;
        }
      }

      if (check) {
        return true;
      }

      index++;
    }

    await sleep(1);
  }
  console.log("Send_HID_Buffer error count max");

  return result;
}

//Crc校验
function get_Crc(value) {
  var crc = 0;
  for (var i = 0; i < value.length - 1; i++) {
    crc += value[i];
  }
  crc = crc & 0xff;
  crc = 0x55 - crc;
  return crc;
}

function check_crc(value, start, end) {
  var crc = 0;
  for (var i = start; i < end; i++) {
    crc += value[i];
  }
  console.log("check crc", crc);
  crc = crc & 0xff;
  if (crc == 0x55) {
    return true;
  } else return false;
}

function get_type_length() {
  const lengthTypes = {
    keyboard: 0x80,
    officeKeyboard: 0x80,
    mouse: 0x00,
  };

  return lengthTypes[deviceInfo.type];
}

//下发带数据的驱动命令
async function Send_Command_With_Value(com, value) {
  let data = Uint8Array.of(com, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
  let crc = 0;

  data[4] = value.length + (get_type_length() || 0x00);

  for (let i = 0; i < value.length; i++) {
    data[5 + i] = value[i];
  }
  crc = get_Crc(data);
  data[15] = crc - ReportId;

  var result = await Send_HID_Buffer(data);
  return result;
}

//下发不带数据的驱动命令
async function Send_Command(com) {
  let data = Uint8Array.of(com, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef); // 示例数据

  data[4] = get_type_length();

  let crc = get_Crc(data);
  data[15] = crc - ReportId;

  await Send_HID_Buffer(data);
}

//获取设备信息
async function Get_ConnectDevice_Info(connectDevice) {
  var info = null;
  const devices = await navigator.hid.getDevices();
  if (devices.length == 0) return info;

  var filterDevices = devices.filter(function (device) {
    if (device.vendorId == connectDevice.vendorId && device.productId == connectDevice.productId && device.productName == connectDevice.productName) {
      return device;
    }
  });

  console.log("filterDevices", filterDevices);
  var connect = await Connect_Device(filterDevices);
  if (connect) {
    info = await Get_Device_Info();
  }
  return info;
}

async function Connect_Device(devices) {
  var connect = false;
  for (let temp of devices) {
    if (visit) {
      connect = visit;
      break;
    }

    //判断连接设备的端口是否符合要求
    for (let i = 0; i < temp.collections.length; i++) {
      if (temp.collections[i].inputReports.length === 1 && temp.collections[i].outputReports.length === 1) {
        //只识别ReportId为0x08的设备
        if (ReportId == temp.collections[i].outputReports[0].reportId) {
          device = temp;

          if (!device.opened) {
            await device.open();
          }

          deviceInfo.deviceOpen = true;
          read_HID_Buffer();

          devicePID.value = `0x${String(device.productId?.toString(16).padStart(4, "0")).toUpperCase()}`;
          Device_Disconnect();
          connect = true;

          break;
        }
      }
    }
  }

  return connect;
}

//获取设备信息
//return 设备cid，mid和类型
async function Get_Device_Info() {
  var value = [];
  // 获取指定范围内的随机整数（包括最小值和最大值）
  var min = 0;
  var max = 255;

  value[0] = Math.floor(Math.random() * (max - min + 1)) + min;
  value[1] = Math.floor(Math.random() * (max - min + 1)) + min;
  value[2] = Math.floor(Math.random() * (max - min + 1)) + min;
  value[3] = Math.floor(Math.random() * (max - min + 1)) + min;

  value[4] = 0;
  value[5] = 0;
  value[6] = 0;
  value[7] = 0;

  var info = {};
  if (await Send_Command_With_Value(Command.EncryptionData, value)) {
    info = {
      cid: deviceInfo.info.cid, //设备的CID，MID
      mid: deviceInfo.info.mid,
      type: deviceInfo.info.type, //设备类型 0:dongle_1K, 1:dongle_4K, 2:有线_1K  3:有线_8K 4:dongle_2K 5:dongle_8K
    };
  }

  return info;
}

//下发驱动在线命令，暂时不用
async function Set_PC_Satae(value) {
  var arr = [];
  arr[0] = value;
  await Send_Command_With_Value(Command.PCDriverStatus, arr);
}

//获取设备在不在线
//return true：设备在线
//       false：设备不在线
async function Get_Device_Online() {
  await Send_Command(Command.DeviceOnLine);

  if (receivedData[5] === 1) return true;
  else return false;
}

//获取设备在不在线，如果不在线需要弹窗提示
//return true：设备在线
//       false：设备不在线
async function Get_Device_Online_With_Dialog() {
  await Send_Command(Command.DeviceOnLine);

  if (visit) {
    return true;
  } else {
    if (receivedData[5] === 1) return true;
    else {
      deviceInfo.online = false;
      deviceInfo.showOfflineDialog = true;
      return false;
    }
  }
}

//获取设备电池电量
async function Get_Device_Battery() {
  if (getBatteryFlag) {
    var flag = await Get_Device_Online();

    if (flag == true) {
      await Send_Command(Command.BatteryLevel);
    }
    else {
      getBatteryFlag = false;
      deviceInfo.batteryOptimize = false;

      clearInterval(onlineTimerID);
      onlineTimerID = setInterval(Get_Online_Interval, 1500);
    }
  }
}

function Set_Pair_CID(value) {
  deviceInfo.pairCID = value;
}

//设备进入对码模式
async function Set_Device_EnterPairMode() {
  let data = Uint8Array.of(Command.DongleEnterPair, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
  let crc = 0;
  data[4] = 2 + get_type_length();
  data[5] = 0x00;
  data[6] = 0x00;
  data[7] = deviceInfo.pairCID == 0 ? deviceInfo.info.cid : deviceInfo.pairCID;
  crc = get_Crc(data);
  data[15] = crc - ReportId;
  console.log("Set_Pair_CID", deviceInfo.pairCID, data[7], deviceInfo);
  await Send_HID_Buffer(data);
}

//获取设备对码结果
async function Get_Device_PairResult() {
  getPairResultTimeCount++;
  var result = await Send_Command(Command.GetPairState);
  if (result == false || getPairResultTimeCount >= 20) {
    getBatteryFlag = true;
    pairResult.pairStatus = DevicePairResult.Fail;
    if (pairTimerID) {
      clearInterval(pairTimerID);
    }
  }
}

//设备恢复出厂设置-重置
async function Device_Restore() {
  var flag = await Get_Device_Online_With_Dialog();

  if (visit) return;

  if (flag == true) {
    deviceInfo.isRestoring = true;
    getBatteryFlag = false;
    var cnt = deviceInfo.type != "keyboard" ? 20 : 4;
    let data = Uint8Array.of(Command.ClearSetting, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef); // 示例数据

    data[4] = get_type_length();
    let crc = get_Crc(data);
    data[15] = crc - ReportId;

    await device.sendReport(ReportId, data);
    if (deviceInfo.type == "keyboard") deviceInfo.connectState = DeviceConectState.Connecting;
    do {
      await sleep(300);
      cnt--;
    } while (deviceInfo.isRestoring && cnt > 0);

    if (deviceInfo.isRestoring == false) {
      if (deviceInfo.isWired == false) {
        await Get_Dongle_Param();
      }
      await Update_Device_Param();
      await Get_Device_Profile();
      //无线模式下且支持远距离模式
      if (typeof deviceInfo.mouseCfg.defaultLongDistance != "undefined") {
        if (deviceInfo.isWired == false && deviceInfo.mouseCfg.supportLongDistance) {
          await Set_Device_LongDistance(deviceInfo.mouseCfg.defaultLongDistance ? 1 : 0);
          deviceInfo.mouseCfg.longDistance = deviceInfo.mouseCfg.defaultLongDistance;
        }
      }

      if (typeof deviceInfo.defaultDongle4KRGB != "undefined") {
        if (deviceInfo.isWired == false) {
          deviceInfo.dongle4KRGB = JSON.parse(JSON.stringify(deviceInfo.defaultDongle4KRGB));
          await Set_Device_4KDongleRGB();
        }
      }

      //2026.04.16 恢复默认不需要下发灯带效果了
      // if(typeof deviceInfo.defaultDongleRGBBar != 'undefined') {
      //  if(deviceInfo.isWired == false) {
      //     deviceInfo.dongleRGBBar = JSON.parse(JSON.stringify(deviceInfo.defaultDongleRGBBar));
      //     await Set_Device_DongleRGBBar();
      //   }
      // }

      deviceInfo.connectState = DeviceConectState.Connected;
    }
    getBatteryFlag = true;
  }
}

async function Set_Device_EnterUpgrade() {
  if (typeof driverOnlineFlag != "undefined") {
    if (driverOnlineFlag) await Set_PC_Satae(0); //网页驱动版本现在不需要了
  }

  Handle_Exit();
  UpgradeHandle.DeviceOpen(device);
}

async function Set_Device_ExitUpgrade() {
  if (typeof device != "undefined") await Device_Connect();
}

//设置设备配置
async function Set_Device_Profile(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var data = [];
    data.push(value);
    setCurrentPorfileFlag = true;
    await Send_Command_With_Value(Command.SetCurrentConfig, data);

    if (visit == false) {
      await Update_Device_Param();
      deviceInfo.connectState = DeviceConectState.Connected;
    }
    deviceInfo.profile = value;
    setCurrentPorfileFlag = false;
  }
  return flag;
}

//获取设备当前配置
async function Get_Device_Profile() {
  await Send_Command(Command.GetCurrentConfig);
}

//获取设备版本（不是接收器的）
async function Get_Device_Version() {
  await Send_Command(Command.ReadVersionID);
}

async function Set_Device_4KDongleRGB() {
  var data = new Uint8Array(10);
  data[0] = deviceInfo.dongle4KRGB.mode;
  var color = UserConvert.Color_To_Buffer(deviceInfo.dongle4KRGB.color1);
  data[1] = color[0];
  data[2] = color[1];
  data[3] = color[2];
  color = UserConvert.Color_To_Buffer(deviceInfo.dongle4KRGB.color2);
  data[4] = color[0];
  data[5] = color[1];
  data[6] = color[2];
  color = UserConvert.Color_To_Buffer(deviceInfo.dongle4KRGB.color3);
  data[7] = color[0];
  data[8] = color[1];
  data[9] = color[2];

  await Send_Command_With_Value(Command.Set4KDongleRGB, data);
}

async function Set_Device_4KDongleRGBMode(mode) {
  deviceInfo.dongle4KRGB.mode = mode;
  await Set_Device_4KDongleRGB();
}

async function Set_Device_4KDongleRGBColor(index, color) {
  if (index == 0) {
    deviceInfo.dongle4KRGB.color1 = color;
  } else if (index == 1) {
    deviceInfo.dongle4KRGB.color2 = color;
  } else if (index == 2) {
    deviceInfo.dongle4KRGB.color3 = color;
  }
  await Set_Device_4KDongleRGB();
}

//设置设备远距离模式，数据长度是10个
async function Set_Device_LongDistance(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var data = new Uint8Array(10);
    data[0] = value;
    await Send_Command_With_Value(Command.SetLongRangeMode, data);
    deviceInfo.mouseCfg.longDistance = !!value;
  }
  return flag;
}

async function Get_Dongle_Param() {
  if (deviceInfo.type == "mouse") {
    await Get_Dongle_Version();
    await Get_Device_4KDongleRGB();
    await Get_Device_DongleRGBBar();
    await Get_Dongle_3RGBMode();
  }
}

async function Get_Device_4KDongleRGB(value) {
  await Send_Command(Command.Get4KDongleRGBValue);
}

//获取设备远距离模式
async function Get_Device_LongDistance() {
  await Send_Command(Command.GetLongRangeMode);
}

async function Set_Device_DongleRGBBar() {
  var data = new Uint8Array(10);
  data[0] = deviceInfo.dongleRGBBar.mode;
  var color = UserConvert.Color_To_Buffer(deviceInfo.dongleRGBBar.color);
  data[1] = color[0];
  data[2] = color[1];
  data[3] = color[2];
  data[4] = deviceInfo.dongleRGBBar.speed;
  data[5] = deviceInfo.dongleRGBBar.brightness;
  data[6] = deviceInfo.dongleRGBBar.time;

  await Send_Command_With_Value(Command.SetDongleRGBBarMode, data);
}

async function Set_Device_LightMode(mode) {
  deviceInfo.dongleRGBBar.mode = mode;
  await Set_Device_DongleRGBBar();
}

async function Set_Device_LightColor(color) {
  deviceInfo.dongleRGBBar.color = color;
  await Set_Device_DongleRGBBar();
}

async function Set_Device_LightSpeed(speed) {
  deviceInfo.dongleRGBBar.speed = speed;
  await Set_Device_DongleRGBBar();
}

async function Set_Device_LightBrightness(brightness) {
  deviceInfo.dongleRGBBar.brightness = brightness;
  await Set_Device_DongleRGBBar();
}

async function Set_Device_LightTime(time) {
  deviceInfo.dongleRGBBar.time = time;
  await Set_Device_DongleRGBBar();
}

async function Get_Device_DongleRGBBar() {
  await Send_Command(Command.GetDongleRGBBarMode);
}

async function Get_Dongle_Version() {
  await Send_Command(Command.GetDongleVersion);
}

// 0: 关闭
// 1 : 连接状态(指示信号强度)
// 2：电量指示
// 3：回报率指示

async function Set_Dongle_3RGBMode(index, mode) {
  var data = new Uint8Array(10);
  for (var i = 0; i < 3; i++) {
    if (i == index) {
      data[i] = mode;
    } else {
      data[i] = deviceInfo.dongle3LEDRGB.mode[i];
    }
  }
  await Send_Command_With_Value(Command.SetDongle3RGBMode, data);
}

async function Get_Dongle_3RGBMode() {
  await Send_Command(Command.GetDongle3RGBMode);
}

//设置磁微动鼠标进入校准模式
//0:退出校准
//1:进入校准
async function Set_Device_MagneticMicroswitchCal(state) {
  var data = new Uint8Array(8);
  data[0] = state;
  await Send_Command_With_Value(Command.SetMagneticMicroswitchCal, data);
}


//设置马达参数
async function Set_Device_MotorParam() {
  var data = new Uint8Array(9);
  data[0] = (deviceInfo.mouseCfg.motor.mode & 0x0f) + (deviceInfo.mouseCfg.motor.levels[0] << 4);
  data[1] = (deviceInfo.mouseCfg.motor.levels[1] & 0x0f) + (deviceInfo.mouseCfg.motor.levels[2] << 4);
  for (var i = 0; i < 6; i++)
    data[2 + i] = deviceInfo.mouseCfg.motor.buttons[i];
  data[8] = deviceInfo.mouseCfg.motor.switches;
  await Send_Command_With_Value(Command.SetMotorParam, data);
}

//Mode(当前震动模式)
// 0：关闭震动
// 1：普通震动
// 2：加强震动
// 3：爆破振动
async function Set_Device_MotorMode(value) {
  deviceInfo.mouseCfg.motor.mode = value;
  await Set_Device_MotorParam();
}

// Level(当前微调档位)
// 0：无需微调
// 1：增加 1 档
// 2：增加 2 档
// 3：增加 3 档
// 4：增加 4 档
async function Set_Device_MotorLevel(index, value) {
  deviceInfo.mouseCfg.motor.levels[index] = value;
  await Set_Device_MotorParam();
}

// Button1(按键1震动类型)
// 0：关闭震动
// 1：短震动
// 2：长震动
async function Set_Device_MotorButton(index, value) {
  deviceInfo.mouseCfg.motor.buttons[index] = value;
  await Set_Device_MotorParam();
}

// Switches(功能震动使能开关)
// Bit0：开机震动使能(0--关闭，1--开启)
// Bit1：DPI切换震动使能(0--关闭，1--开启)
// Bit2：低电震动提示使能(0--关闭，1--开启)
// Bit3：倒计时休息提醒功能(0--关闭，1--开启)
// Bit 4~7: 预留 (填 0)
async function Set_Device_MotorSwitches(value) {
  deviceInfo.mouseCfg.motor.switches = value;
  await Set_Device_MotorParam();
}

async function Get_Device_MotorParam() {
  await Send_Command(Command.GetMotorParam);
}

async function Restore_Device_MotorParam() {
  await Send_Command(Command.RestoreMotorParam);
}

//OLED 图片数据更新
async function Set_Device_OLEDPicture(pixel) {
  var cnt = (pixel.length % 10);
  cnt = (cnt > 0) ? (Math.floor(pixel.length / 10) + 1) : Math.floor(pixel.length / 10);

  for (var retry = 0; retry < 3; retry++) {
    oledSetErrorFlag = false;

    for (var i = 0; i < cnt; i++) {
      let data = Uint8Array.of(Command.SetOLEDPicture, 0x00, (i + 1) >> 8, (i + 1) & 0xff, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
      var len = ((((i + 1) * 10) > pixel.length) ? (pixel.length - (i * 10)) : 10);
      let crc = 0;

      data[4] = 0x0a + get_type_length();
      for (let j = 0; j < len; j++) {
        data[5 + j] = pixel[i * 10 + j];
      }
      crc = get_Crc(data);
      data[15] = crc - ReportId;

      await device.sendReport(ReportId, data);

      if (oledSetErrorFlag) {
        await sleep(100);
        break;
      }
      await sleep(5);
    }

    if (oledSetErrorFlag == false) break;
  }

  return oledSetErrorFlag == false;
}

//恢复OLED 默认图片数据
async function Restore_Device_OLEDPicture() {
  await Send_Command(Command.RestoreOLEDPicture);
}

//设置游戏键盘音乐律动的参数
async function Set_KB_MusicStart(mode, colorMode, color, matrix) {
  musicObject.mode = mode;
  musicObject.colorMode = colorMode;
  musicObject.color = color;

  if (deviceInfo.type == "officeKeyboard") {
    await Set_KB_LightMode(0x09);
  }
  else if (deviceInfo.type == "keyboard") {
    musicObject.matrix = matrix;
    var offset = 1;
    var count = matrix.length;

    var maxRow = 0;

    for (var i = 0; i < count; i++) {
      if (maxRow < matrix[i].length) {
        maxRow = matrix[i].length;
      }
    }

    var halfMaxRow = Math.floor((maxRow - 1) / 2);
    var halfRow = Math.floor((count - 1) / 2);
    musicObject.roundMatrix = new Array(Math.ceil((maxRow) / 2) + 2);

    for (var i = 0; i < Math.ceil((maxRow) / 2) + 2; i++) {
      musicObject.roundMatrix[i] = [];
    }

    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        var row = halfMaxRow - j;
        var cnt = halfRow - i;

        if (j >= (halfMaxRow))
          row = j - (halfMaxRow);

        if (i > halfRow)
          cnt = i - halfRow;

        offset = row + cnt;
        if (((j > halfMaxRow) && (i != halfRow)) ||
          ((j < halfMaxRow) && ((cnt != 1) && i != halfRow))) {
          offset -= 1;
        }

        musicObject.roundMatrix[offset].push(matrix[i][j]);
      }
    }
  }

  console.log("Set_KB_MusicStart", musicObject);

  await keyboardMusicStart();
}

async function Set_KB_GameMusicMode(mode) {
  musicObject.mode = mode;
  await Reset_Device_MusicLight();
}

async function Set_KB_GameMusicColor(mode, color) {
  musicObject.colorMode = mode;
  musicObject.color = color;
}

//组装游戏键盘的音乐律动数据
async function Assemble_Keyboard_MusicData(amplitude) {
  if (musicObject.packageIsEmpty) {
    var colors = [];
    var indexs = [];

    //是否有有效的音乐律动振幅
    var max = -1;
    for (var i = 0; i < amplitude.length; i++) {
      if (amplitude[i] > 0)
        max = i;
    }

    if (max > -1) {
      // console.log("amplitude",amplitude);
      if ((musicObject.mode == 0) || (musicObject.mode == 1)) {
        for (var i = 0; i < musicObject.matrix.length; i++) {
          var list = [];

          for (var j = 0; j < musicObject.matrix[i].length; j++) {
            if (musicObject.mode == 0) {
              var peak = musicObject.matrix.length - Math.ceil((amplitude[j] * musicObject.matrix.length) / 15);

              if ((peak <= i) && (musicObject.matrix[i][j] != 255)) {
                list.push(musicObject.matrix[i][j]);
              }
            }
            else {
              var peak = amplitude[i];

              if ((peak >= j) & (musicObject.matrix[i][j] != 255)) {
                list.push(musicObject.matrix[i][j]);
              }
            }
          }

          if (musicObject.colorMode == 1) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            var color = `rgb(${r}, ${g}, ${b})`;
            colors.push(color);
          }
          else {
            colors.push(musicObject.color);
          }
          indexs.push(list);
        }
      }
      else if (musicObject.mode == 2) {
        for (var i = 0; i < musicObject.roundMatrix.length; i++) {
          var list = [];

          for (var j = 0; j < musicObject.roundMatrix[i].length; j++) {
            if ((amplitude[i] > 0) && (musicObject.roundMatrix[i][j] != 255)) {
              list.push(musicObject.roundMatrix[i][j]);
            }
          }

          if (musicObject.colorMode == 1) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            var color = `rgb(${r}, ${g}, ${b})`;
            colors.push(color);
          }
          else {
            colors.push(musicObject.color);
          }
          indexs.push(list);
        }
      }
    }

    var values = [];

    for (var i = 0; i < colors.length; i++) {
      if (indexs[i].length > 0) {
        var color = UserConvert.Color_To_Buffer(colors[i]);
        values.push(color[0]);
        values.push(color[1]);
        values.push(color[2]);
        values.push(indexs[i].length);
        for (var j = 0; j < indexs[i].length; j++) {
          values.push(indexs[i][j]);
        }
      }
    }

    musicObject.packageIsEmpty = false;
    musicObject.values = values;
    musicObject.valuesIndex = 0;
  }
}
var keyboardMusicOFF = false;

//开启音乐律动之后间隔10ms发送一次音乐数据
async function Set_Device_MusicValuesPolling() {
  if (musicObject.values.length > 0) {
    var count = Math.ceil(musicObject.values.length / 12);
    var left = 0;

    let data = Uint8Array.of(Command.SetMusicColorful, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
    let crc = 0;

    data[1] = count;
    data[2] = musicObject.valuesIndex;

    left = musicObject.values.length > (musicObject.valuesIndex + 1) * 12 ? 12 : (musicObject.values.length - musicObject.valuesIndex * 12);

    for (var j = 0; j < left; j++) {
      data[j + 3] = musicObject.values[musicObject.valuesIndex * 12 + j];
    }

    crc = get_Crc(data);
    data[15] = crc - ReportId;

    if (musicObject.valuesIndex < count) {
      await device.sendReport(ReportId, data);
      musicObject.valuesIndex++;
      keyboardMusicOFF = false;
    }

    musicObject.packageIsEmpty = musicObject.valuesIndex >= count;
  }
  else {
    musicObject.packageIsEmpty = true;
  }
}

async function Reset_Device_MusicLight() {
  if (keyboardMusicOFF == false) {
    let data = Uint8Array.of(Command.SetMusicLightOFF, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
    let crc = 0;

    crc = get_Crc(data);
    data[15] = crc - ReportId;

    await device.sendReport(ReportId, data);
  }
  musicObject.values = [];
  musicObject.valuesIndex = 0;
  musicObject.packageIsEmpty = true;
  keyboardMusicOFF = true;
}

async function Set_Device_MusicLightOFF() {
  var flag = await Get_Device_Online_With_Dialog();
  if (flag) {
    if (keyboardMusicOFF == false) {
      let data = Uint8Array.of(Command.SetMusicLightOFF, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
      let crc = 0;

      crc = get_Crc(data);
      data[15] = crc - ReportId;

      await device.sendReport(ReportId, data);
    }
    musicObject.values = [];
    musicObject.valuesIndex = 0;
    musicObject.packageIsEmpty = true;
    keyboardMusicOFF = true;
  }

  return flag;
}

async function Set_Device_OfficeMusicParameter(param) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var data = new Uint8Array(10);
    data[0] = param.mode;
    data[1] = param.speed;
    data[2] = param.brightness;
    data[3] = param.colorMode;
    var color = UserConvert.Color_To_Buffer(param.foregroundColor);
    data[4] = color[0];
    data[5] = color[1];
    data[6] = color[2];
    color = UserConvert.Color_To_Buffer(param.backgroundColor);
    data[7] = color[0];
    data[8] = color[1];
    data[9] = color[2];
    await Send_Command_With_Value(Command.SetOfficeMusicParameter, data);
  }
  return flag;
}

//动画模式:
// 0x00:律动模式。
// 0x01:波浪模式。
async function Set_Device_OfficeMusicMode(mode) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.keyboard.officeMusicParam.mode = mode;
    await Set_Device_OfficeMusicParameter(deviceInfo.keyboard.officeMusicParam);
  }
  return flag;
}

//音乐律动速度档位(0~4)。
async function Set_Device_OfficeMusicSpeed(speed) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.keyboard.officeMusicParam.speed = speed;
    await Set_Device_OfficeMusicParameter(deviceInfo.keyboard.officeMusicParam);
  }
  return flag;
}

//音乐律动亮度档位(0~4)。
async function Set_Device_OfficeMusicBrightness(brightness) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.keyboard.officeMusicParam.brightness = brightness;
    await Set_Device_OfficeMusicParameter(deviceInfo.keyboard.officeMusicParam);
  }
  return flag;
}

// 全彩模式:
//    0：单色模式。
//    1：全彩模式。
async function Set_Device_OfficeMusicColorMode(mode) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.keyboard.officeMusicParam.colorMode = mode;
    await Set_Device_OfficeMusicParameter(deviceInfo.keyboard.officeMusicParam);
  }
  return flag;
}

//前景颜色值
async function Set_Device_OfficeMusicForegroundColor(color) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.keyboard.officeMusicParam.foregroundColor = color;
    await Set_Device_OfficeMusicParameter(deviceInfo.keyboard.officeMusicParam);
  }
  return flag;
}

//背景颜色值
async function Set_Device_OfficeMusicBackgroundColor(color) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.keyboard.officeMusicParam.backgroundColor = color;
    await Set_Device_OfficeMusicParameter(deviceInfo.keyboard.officeMusicParam);
  }
  return flag;
}

//获取办公键盘音乐律动参数
async function Get_Device_OfficeMusicParameter() {
  await Send_Command(Command.GetOfficeMusicParameter);
}

// ---------- 静默播放器（防止最小化读取不到声音） ----------
function setupSilentAudio() {
  if (musicObject.keepAliveCtx) return;
  try {
    musicObject.keepAliveCtx = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = musicObject.keepAliveCtx.createBuffer(1, 1, 22050);
    const source = musicObject.keepAliveCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(musicObject.keepAliveCtx.destination);
    source.start();
    musicObject.keepAliveSource = source;
    if (musicObject.keepAliveCtx.state === 'suspended') {
      musicObject.keepAliveCtx.resume();
    }
    console.log('[静默播放器] 已启动');
  } catch (err) {
    console.warn('[静默播放器] 启动失败', err);
  }
}

function stopSilentAudio() {
  if (musicObject.keepAliveSource) {
    try { musicObject.keepAliveSource.stop(); } catch (e) { }
    musicObject.keepAliveSource = null;
  }
  if (musicObject.keepAliveCtx) {
    musicObject.keepAliveCtx.close();
    musicObject.keepAliveCtx = null;
  }
}

// ---------- 节拍检测：基于历史 RMS 的动态阈值 ----------
// 输入当前帧的 RMS 值（线性，范围 0~1）
// 返回 { detected: boolean, strength: number }
function detectBeat(currentRMS) {
  musicObject.rmsHistory.push(currentRMS);
  if (musicObject.rmsHistory.length > musicObject.historyMaxLen) {
    musicObject.rmsHistory.shift();
  }
  if (musicObject.rmsHistory.length < 10) {
    return { detected: false, strength: 0 };
  }
  let sum = 0;
  for (let val of musicObject.rmsHistory) sum += val;
  const mean = sum / musicObject.rmsHistory.length;
  let sumSq = 0;
  for (let val of musicObject.rmsHistory) sumSq += (val - mean) ** 2;
  const std = Math.sqrt(sumSq / musicObject.rmsHistory.length);
  const threshold = mean + musicObject.beatThresholdFactor * std;
  if (currentRMS > threshold) {
    let strength = (currentRMS - threshold) / (1 - threshold);
    strength = Math.min(1.0, Math.max(0, strength));
    return { detected: true, strength };
  } else {
    return { detected: false, strength: 0 };
  }
}
var noMusicCount = 0;
// ---------- 核心：获取参数 ----------
async function getAudioParams() {
  if (!musicObject.isCapturing || !musicObject.analyserNode || !musicObject.audioCtx) return;

  const analyser = musicObject.analyserNode;
  const fftSize = analyser.fftSize;
  const timeArray = new Uint8Array(fftSize);
  const freqArray = new Uint8Array(fftSize / 2);

  analyser.getByteTimeDomainData(timeArray);
  analyser.getByteFrequencyData(freqArray);

  // 振幅
  let sumSquares = 0;
  let maxSample = 0;
  for (let i = 0; i < fftSize; i++) {
    const v = (timeArray[i] - 128) / 128;
    sumSquares += v * v;
    const absV = Math.abs(v);
    if (absV > maxSample) maxSample = absV;
  }
  const rmsLinear = Math.sqrt(sumSquares / fftSize);
  let volumeDB = -100;
  if (rmsLinear > 0.00001) volumeDB = 20 * Math.log10(rmsLinear);
  volumeDB = Math.max(-100, Math.min(0, volumeDB));

  // 频谱：16个频段，范围0~44.1kHz，输出值0~15
  const sampleRate = musicObject.audioCtx.sampleRate;
  const maxFreq = 44100 / 2;
  const numBands = 22;
  const bandWidth = maxFreq / numBands;
  const freqResolution = sampleRate / fftSize;
  const bandSum = new Array(numBands).fill(0);
  const bandCount = new Array(numBands).fill(0);

  for (let i = 0; i < freqArray.length; i++) {
    const freq = i * freqResolution;
    if (freq > maxFreq) break;
    const bandIndex = Math.floor(freq / bandWidth);
    if (bandIndex < numBands) {
      bandSum[bandIndex] += freqArray[i];
      bandCount[bandIndex]++;
    }
  }

  // 计算每个频段均值，然后从0-255映射到0-15
  const bandValues = new Array(numBands).fill(0);
  for (let i = 0; i < numBands; i++) {
    let avg = 0;
    if (bandCount[i] > 0) {
      avg = bandSum[i] / bandCount[i];
    }
    // 线性映射：0-255 -> 0-15，取整
    let mapped = Math.floor(avg * 15 / 255) * 1.5;
    // 边界裁剪
    if (mapped < 0) mapped = 0;
    if (mapped > 15) mapped = 15;
    bandValues[i] = mapped;
  }

  // 全频域峰值频率（仅用于参考）
  let peakMag = -Infinity;
  let peakIdx = 0;
  for (let i = 0; i < freqArray.length; i++) {
    if (freqArray[i] > peakMag) {
      peakMag = freqArray[i];
      peakIdx = i;
    }
  }
  const peakFreq = peakIdx * freqResolution;

  // 节拍
  const beat = detectBeat(rmsLinear);

  // if((volumeDB > -100) && (peakFreq > 0)) {
  //   console.log({
  //     timestamp: Date.now(),
  //     amplitude: {
  //       rms_dB: volumeDB.toFixed(2),
  //       max_amplitude: maxSample.toFixed(4),
  //       rms_linear: rmsLinear.toFixed(4),
  //     },
  //     spectrum: {
  //       bands_16: bandValues,      // 每个值 0~15 整数
  //       peak_freq_Hz: peakFreq.toFixed(1),
  //     },
  //     beat: {
  //       detected: beat.detected,
  //       strength: beat.strength.toFixed(3),
  //     },
  //   });
  // }

  //办公键盘的音乐律动
  if (deviceInfo.type == "officeKeyboard")
    await Set_Device_OfficeMusicAmplitude(bandValues);
  else if (deviceInfo.type == "keyboard") {
    if ((volumeDB > -100) && (peakFreq > 0)) {
      noMusicCount = 0;
      await Assemble_Keyboard_MusicData(bandValues);
    }
    else {
      if (noMusicCount > 10) {
        await Set_Device_MusicLightOFF();
      }
      else
        noMusicCount++;
    }
  }
}

// ----------------------------
// 后台高精度定时器（不卡、最小化不减速）
// ----------------------------
const worker = new Worker(URL.createObjectURL(new Blob([`
  const TARGET = 10;
  let last = performance.now();
  function tick() {
    const now = performance.now();
    if (now - last >= TARGET) {
      postMessage(1);
      last = now;
    }
    setTimeout(tick, 0);
  }
  tick();
`])));

// 👇 关键：支持 async 函数 + 防止重叠执行
let workerIsRunning = false;
let musicIsStart = false;
worker.onmessage = async () => {
  if (workerIsRunning) return; // 防止上一次没执行完又触发
  workerIsRunning = true;
  try {
    if (musicIsStart) {
      await getAudioParams(); // 执行你的异步逻辑
      if (deviceInfo.type == "keyboard") {
        await Set_Device_MusicValuesPolling(); // 执行你的异步逻辑
      }
    }

  } catch (err) {
    console.error("执行出错", err);
  } finally {
    workerIsRunning = false;
  }
};

// ---------- 开始捕获系统音频 ----------
async function keyboardMusicStart() {
  musicObject.errorMsg = '';
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    musicObject.errorMsg = '浏览器不支持 getDisplayMedia，无法捕获系统音频。';
    return;
  }

  setupSilentAudio();

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        systemAudio: 'include',
        suppressLocalAudioPlayback: false,
      },
      selfBrowserSurface: 'include',
    });

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) {
      throw new Error('未捕获到系统音频，请勾选“共享音频”');
    }

    musicObject.mediaStream = stream;

    if (musicObject.audioCtx && musicObject.audioCtx.state !== 'closed') {
      await musicObject.audioCtx.close();
    }
    musicObject.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const sourceNode = musicObject.audioCtx.createMediaStreamSource(stream);
    musicObject.analyserNode = musicObject.audioCtx.createAnalyser();
    musicObject.analyserNode.fftSize = 2048;
    musicObject.analyserNode.smoothingTimeConstant = 0.8;
    sourceNode.connect(musicObject.analyserNode);

    if (musicObject.audioCtx.state === 'suspended') {
      await musicObject.audioCtx.resume();
    }

    musicObject.isCapturing = true;
    musicObject.rmsHistory = [];

    getBatteryFlag = false;
    await Set_KB_MusicState(1);//打开音乐律动

    musicIsStart = true;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.addEventListener('ended', () => {
        Set_KB_MusicStop();
      });
    }
  } catch (err) {
    console.error(err);
    musicObject.errorMsg = `捕获失败: ${err.message}`;
    Set_KB_MusicStop();
  }
}

// ---------- 停止捕获 ----------
async function Set_KB_MusicStop() {
  musicIsStart = false;

  if (musicObject.audioCtx) {
    musicObject.audioCtx.close().catch(e => console.warn);
    musicObject.audioCtx = null;
  }
  if (musicObject.mediaStream) {
    musicObject.mediaStream.getTracks().forEach(track => track.stop());
    musicObject.mediaStream = null;
  }
  musicObject.isCapturing = false;

  if (deviceInfo.type == "keyboard") {
    sleep(100);
    await Set_Device_MusicLightOFF();
  }

  await Set_KB_MusicState(0);//关闭音乐律动
  getBatteryFlag = true;

  stopSilentAudio();
}

async function Set_Device_OfficeMusicAmplitude(amplitudes) {
  let data = Uint8Array.of(Command.OfficeMusicAmplitude, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
  let crc = 0;

  data[4] = amplitudes.length + get_type_length();

  var max = 0;

  for (var i = 0; i < amplitudes.length / 2; i++) {
    var amplitude = ((amplitudes[2 * i] & 0x0f) << 4) + (amplitudes[2 * i + 1] & 0x0f);
    data[i + 5] = amplitude;
  }

  crc = get_Crc(data);
  data[15] = crc - ReportId;

  await device.sendReport(ReportId, data);
}

async function Set_Device_OfficeCustomLightState(state) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var data = new Uint8Array(2);
    data[0] = state;
    data[1] = 0;
    await Send_Command_With_Value(Command.OfficeCustomLightState, data);
    deviceInfo.keyboard.officeCustomParam.customLightState = state;
  }
  return flag;
}

async function Set_Device_OfficeCustomMacroState(state) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var data = new Uint8Array(2);
    data[0] = 0;
    data[1] = state;
    await Send_Command_With_Value(Command.OfficeCustomLightState, data);
    deviceInfo.keyboard.officeCustomParam.macroState = state;
  }
  return flag;
}

//设置eeprom内容（长度>=2）
async function Set_Device_Eeprom_Array(address, value) {
  let data = Uint8Array.of(0x07, 0x00, address >> 8, address & 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);

  var result = false;
  var cnt = value.length % 10;
  cnt = cnt > 0 ? Math.floor(value.length / 10) + 1 : Math.floor(value.length / 10);

  for (var i = 0; i < cnt; i++) {
    var add = address + i * 10;
    var len = (i + 1) * 10 > value.length ? value.length - i * 10 : 10;

    data[0] = 0x07;
    data[1] = 0x00;
    data[2] = add >> 8;
    data[3] = add & 0xff;
    data[4] = len + get_type_length();
    for (var j = 0; j < 10; j++) {
      if (j < len) data[5 + j] = value[j + i * 10];
      else data[5 + j] = 0;
    }

    data[15] = get_Crc(data) - ReportId;

    result = await Send_HID_Buffer(data);
    if (result == false) {
      break;
    }
  }

  if (result) {
    for (var i = 0; i < value.length; i++) {
      flashData[i + address] = value[i];
    }
  }
  return result;
}

//设置eeprom内容（长度==1）
async function Set_Device_Eeprom_Value(address, value) {
  let data = Uint8Array.of(0x07, 0x00, address >> 8, address & 0xff, 0x02, 0x08, 0x4d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef); // 示例数据

  data[4] = 0x02 + get_type_length();
  data[5] = value;
  data[6] = 0x55 - value;
  let crc = get_Crc(data);
  data[15] = crc - ReportId;

  if (await Send_HID_Buffer(data)) {
    flashData[address] = value;
    flashData[address + 1] = data[6];
    return true;
  }
  return false;
}

//获取eeprom数据
async function Get_Device_Eeprom_Buffer(address, length) {
  let data = Uint8Array.of(0x08, 0x00, address >> 8, address & 0xff, length, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef);
  data[4] = length + get_type_length();
  let crc = 0;
  crc = get_Crc(data);
  data[15] = crc - ReportId;

  await Send_HID_Buffer(data);
}

async function Update_Device_Param() {
  deviceInfo.connectState = DeviceConectState.Connecting;
  flashData.fill(0xff);

  if (deviceInfo.type == "mouse") {
    await Read_Device_Flash(0, 0x100);
    // if (deviceInfo.mouseCfg.sensor.type == "3955") {
    //   await Read_Device_Flash(MouseEepromAddr.Sensor3955DPI, MouseEepromAddr.Sensor3955DPI + 6 * 8);
    // }

    await Read_Device_Flash(MouseEepromAddr.Sensor3955DPI, MouseEepromAddr.EndEeprom);

    /*2025.09.02 修改*/
    let flashCRC = 0;
    let endFFFlash = 0;
    for (var i = 0; i < 0x100; i++) {
      if (flashData[i] != 0xff) {
        endFFFlash = i;
      }
    }

    for (var i = 0; i < 0x100; i++) {
      if (flashData[i] == 0xff) {
        if (flashCRC == 0) {
          if (i >= endFFFlash) {
            flashEndAddress = endFFFlash;
            break;
          }
        }
      }

      flashCRC += flashData[i];
      if ((flashCRC & 0xff) == 0x55) {
        flashCRC = 0;
      }
    }
    /*2025.09.02 修改*/
    deviceInfo.mouseCfg.sensor.dpiEepromKind = detectDpiEepromType();
    await Update_Mouse_Info();
    await Get_Mouse_KeyFunctions();
  } else if (deviceInfo.type == "keyboard" || deviceInfo.type == "officeKeyboard") {
    KeyboardEepromAddr = deviceInfo.type == "keyboard" ? GameKeyboardEepromAddr : OfficeKeyboardEepromAddr;
    await Get_Keyboard_SyncCRC(); //获取键盘CRC和localStorage的数据
    await Update_Keyboard_KeyFunctions(); ////更新按键数据
    await Update_Keyboard_LightEffect(); //更新灯光模式数据

    if (deviceInfo.type == "keyboard") {
      await Update_Keyboard_CustomLightMaps();//更新自定义模式灯
    } else if (deviceInfo.type == "officeKeyboard") {
      await Get_Device_OfficeMusicParameter();
      await Update_Keyboard_OfficeCustomLights();
    }

    await Update_Keyboard_Info();
  }
  console.log("device info:", deviceInfo);
}

//写鼠标flash内容
async function Write_Mouse_Flash(buffer) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    getBatteryFlag = false;
    deviceInfo.connectState = DeviceConectState.Connecting;
    var value = [];
    value.length = flashEndAddress;
    for (var i = 0; i <= flashEndAddress; i++) {
      value[i] = buffer[i];
    }

    await Set_Device_Eeprom_Array(0, value);

    if (deviceInfo.mouseCfg.sensor.type == "3955") {
      var sensor3955Value = [];
      sensor3955Value.length = 48; /*2026.03.19 修改*/
      for (var i = 0; i < 48; i++) {
        /*2026.03.19 修改*/
        sensor3955Value[i] = buffer[i + MouseEepromAddr.Sensor3955DPI];
      }

      await Set_Device_Eeprom_Array(MouseEepromAddr.Sensor3955DPI, sensor3955Value);
    }

    Update_Mouse_Info();
    deviceInfo.mouseCfg.shortCutKey = [];
    deviceInfo.mouseCfg.macros = [];

    for (var i = 0; i < deviceInfo.mouseCfg.keysCount; i++) {
      var addr = i * 4 + 0x60;
      var tmp = (buffer[addr + 1] << 8) + buffer[addr + 2];
      var keyValue = [buffer[addr].toString(16), "0x" + tmp.toString(16).padStart(4, "0")];
      deviceInfo.mouseCfg.keys[i] = keyValue;

      var same = true;
      var address = 0;

      for (var k = 0; k < 2; k++) {
        same = true;
        if (k == 0) {
          value.length = 0x20;
          address = MouseEepromAddr.ShortcutKey;
        } else {
          value.length = 0x180;
          address = MouseEepromAddr.Macro;
        }
        address += i * value.length;

        var diff = [];
        for (var j = 0; j < value.length; j++) {
          value[j] = buffer[address + j];

          if (flashData[address + j] != value[j]) {
            same = false;
            diff.push(j);
          }
        }

        if (same == false) {
          await Set_Device_Eeprom_Array(address, value);
        }
      }

      var shortCut = {
        isMedia: false,
        contexts: [],
      };

      if (keyValue[0] == MouseKeyFunction.ShortcutKey) {
        shortCut = Update_Mouse_ShortcutKey(i);
      }
      deviceInfo.mouseCfg.shortCutKey.push(shortCut);

      var macro = {
        name: "",
        contexts: [],
        cycleTimes: buffer[addr + 2],
      };

      if (keyValue[0] == MouseKeyFunction.Macro) {
        var tmp = Update_Mouse_Macro(i);
        macro.name = tmp.name;
        macro.contexts = tmp.contexts;
      }
      deviceInfo.mouseCfg.macros.push(macro);
      console.log("Write_Mouse_Flash i:", i, deviceInfo, buffer, flashData);
    }
    deviceInfo.connectState = DeviceConectState.Connected;
    console.log("Write_Mouse_Flash:", deviceInfo, buffer, flashData);
    getBatteryFlag = true;
  }

  return flag;
}

function Send_HID_Buffer_Elapsed() {
  sendHIDBufferTimerTimeOut = true;
}

function Send_HID_Buffer_Timeout(count) {
  clearTimeout(sendHIDBufferTimerID);

  sendHIDBufferTimerTimeOut = false;

  sendHIDBufferTimerID = setInterval(Send_HID_Buffer_Elapsed, count);
}

async function Read_Device_Flash(start, end) {
  var result = false;
  let data = Uint8Array.of(0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xef); // 示例数据

  var add = start;
  var current = -1;
  var errorCount = 0;

  while (add < end) {
    if (add != current) {
      try {
        sendingFlag = true;

        data[2] = add >> 8;
        data[3] = add & 0xff;
        var len = end - add > 10 ? 10 : end - add;
        data[4] = len + get_type_length();

        let crc = get_Crc(data);
        data[15] = crc - ReportId;

        await device.sendReport(ReportId, data);
        Send_HID_Buffer_Timeout(200);
        current = add;
      } catch (e) {
        console.error(e);
        break;
      }
    }

    if (sendingFlag == false) {
      getFlashTimerTickCount = 0;
      var check = true;
      for (var i = 0; i < 5; i++) {
        if (data[i] !== receivedData[i]) {
          check = false;
          break;
        }
      }

      if (check) {
        errorCount = 0;
        add += 10;
      } else {
        errorCount++;

        if (errorCount >= 5) {
          result = false;
          console.log("Read_Device_Flash error count max");
          break;
        } else {
          current = -1;
        }
      }
    } else if (sendHIDBufferTimerTimeOut) {
      errorCount++;

      if (errorCount >= 5) {
        result = false;
        console.log("Read_Device_Flash error count max");
        break;
      } else {
        current = -1;
      }
    }

    await sleep(1);
  }

  return result;
}

//鼠标不在线时定时获取在不在线定时器
async function Get_Online_Interval() {
  var flag = await Get_Device_Online();
  if (flag) {
    clearInterval(onlineTimerID);
    getFlashTimerTickCount = 0;
    getFlashTimerID = setInterval(Get_Flash_Time_Tick, 1000);
    console.log("driverOnline", driverOnlineFlag);
    if (typeof driverOnlineFlag != "undefined") {
      if (driverOnlineFlag) await Set_PC_Satae(1); //网页驱动版本现在不需要了
    }

    try {
      deviceInfo.lastSyncError = "";
      await Update_Device_Param();
      await Get_Device_Profile();
      await Get_Device_Version();
      await Get_Dongle_Version();
      getBatteryFlag = true;
      await Get_Device_Battery();
      // await Get_Device_MotorParam();
      //只有无线才需要获取远距离模式
      if (typeof deviceInfo.mouseCfg.defaultLongDistance != "undefined") {
        if (deviceInfo.isWired || deviceInfo.type != "mouse") {
          deviceInfo.mouseCfg.supportLongDistance = false;
        } else {
          await Get_Device_LongDistance();
        }
      } else {
        deviceInfo.mouseCfg.supportLongDistance = false;
      }
      deviceInfo.connectState = DeviceConectState.Connected;

      if (getFlashTimerID) {
        clearInterval(getFlashTimerID);
      }

      if (deviceInfo.autoGetBattery) {
        clearInterval(batteryTimerID);
        batteryTimerID = setInterval(Get_Device_Battery, 5000);
      }
    } catch (error) {
      console.error("Get_Online_Interval", error);
      deviceInfo.lastSyncError = String(error?.message || error);
      if (getFlashTimerID) {
        clearInterval(getFlashTimerID);
      }
      deviceInfo.connectState = DeviceConectState.TimeOut;
      return false;
    }
  }
  return flag;
}

function Get_Flash_Time_Tick() {
  getFlashTimerTickCount++;

  if (getFlashTimerTickCount >= 30) {
    console.error("Get_Flash_Time_Tick");
    if (deviceInfo.connectState == DeviceConectState.Connecting) {
      deviceInfo.connectState = DeviceConectState.TimeOut;
      deviceInfo.lastSyncError = deviceInfo.lastSyncError || "读 Flash 超过 30 秒";
      if (driverOnlineFlag) Device_Close();
    }
  }
}

function EepromValue_To_DPIValue(val, dpiEx) {
  var value = val;
  var ex = dpiEx & 0x03;

  var doubleFlag = (dpiEx & 0x01) == 0x01;
  var step100Flag = (dpiEx & 0x02) == 0x02;

  var index = 0;
  //办公sensor
  if (typeof deviceInfo.mouseCfg.sensor.cfg.office !== "undefined" && deviceInfo.mouseCfg.sensor.cfg.office !== null) {
    for (index = 0; index < deviceInfo.mouseCfg.sensor.cfg.office.length; index++) {
      if (index == val) {
        value = deviceInfo.mouseCfg.sensor.cfg.office[index];
        break;
      }
    }

    console.log("updateMouseDpi", index, value);
  } else {
    if (typeof deviceInfo.mouseCfg.sensor.cfg.values !== "undefined" && deviceInfo.mouseCfg.sensor.cfg.values !== null) {
      if (deviceInfo.mouseCfg.sensor.type == "3315") {
        for (index = 0; index < deviceInfo.mouseCfg.sensor.cfg.values[step100Flag ? 1 : 0].length; index++) {
          if (deviceInfo.mouseCfg.sensor.cfg.values[step100Flag ? 1 : 0][index] == value) {
            break;
          }
        }
      } else {
        for (index = 0; index < deviceInfo.mouseCfg.sensor.cfg.values.length; index++) {
          if (deviceInfo.mouseCfg.sensor.cfg.values[index] == value) {
            break;
          }
        }
      }

      if (deviceInfo.mouseCfg.sensor.type == "3315" && step100Flag) {
        value = index * deviceInfo.mouseCfg.sensor.cfg.range[1].step + deviceInfo.mouseCfg.sensor.cfg.range[1].min;
      } else {
        value = index * deviceInfo.mouseCfg.sensor.cfg.range[0].step + deviceInfo.mouseCfg.sensor.cfg.range[0].min;
      }

      console.log("updateMouseDpi", index, value);
    } else {
      const range0 = deviceInfo.mouseCfg.sensor.cfg?.range?.[0];
      if (!range0) {
        const step = deviceInfo.mouseCfg.sensor.type === "3950" ? 50 : 100;
        value = (value + 1) * step;
      } else if (deviceInfo.mouseCfg.sensor.type == "OM76") value = value * range0.step + (step100Flag == false ? range0.min : 0);
      else if (deviceInfo.mouseCfg.sensor.type == "S312") value = value * range0.step;
      else value = (value + 1) * range0.step;
    }
  }
  if (doubleFlag) {
    value *= 2;
  }

  if (step100Flag) {
    if (deviceInfo.mouseCfg.sensor.type == "OM76") value *= 10;
    else if (deviceInfo.mouseCfg.sensor.type == "3315") value = value;
    else value *= 2;
  }

  return value;
}

/** 判断 DPI 存在哪段 EEPROM（Terra Pro 等 8K 固件多用 3955 区 0x1B00） */
function detectDpiEepromType() {
  for (var i = 0; i < 8; i++) {
    var base3955 = MouseEepromAddr.Sensor3955DPI + i * 6;
    if (check_crc(flashData, base3955, base3955 + 5)) return "3955";
  }
  for (var j = 0; j < 8; j++) {
    var base3950 = MouseEepromAddr.DPIValue + j * 4;
    if (check_crc(flashData, base3950, base3950 + 3)) return "3950";
  }
  return deviceInfo.mouseCfg.sensor.type == "3955" ? "3955" : "3950";
}

function dpiLayoutIs3955() {
  if (deviceInfo.mouseCfg.sensor.dpiEepromKind == "3955") return true;
  if (deviceInfo.mouseCfg.sensor.dpiEepromKind == "3950") return false;
  return detectDpiEepromType() == "3955";
}

function refreshMouseDpiFromFlash() {
  deviceInfo.mouseCfg.sensor.dpiEepromKind = detectDpiEepromType();
  Update_Mouse_Dpi();
}

//更新鼠标DPI
function Update_Mouse_Dpi() {
  var dpiKind = deviceInfo.mouseCfg.sensor.dpiEepromKind || detectDpiEepromType();
  for (var i = 0; i < 8; i++) {
    var addr = dpiKind == "3955" ? i * 6 + MouseEepromAddr.Sensor3955DPI : i * 4 + MouseEepromAddr.DPIValue;
    var shift = dpiKind == "3955" ? 4 : 2;
    var val = 0;
    var ex = flashData[addr + shift] & 0x03;
    var high = flashData[addr + shift] & 0x0c;
    high >>= 2;

    if (dpiKind == "3955") {
      val = flashData[addr] + (flashData[addr + 1] << 8) + (high << 16);
    } else val = flashData[addr] + (high << 8);

    deviceInfo.mouseCfg.dpis[i].x = deviceInfo.mouseCfg.dpis[i].value = EepromValue_To_DPIValue(val, ex);

    ex = flashData[addr + shift] & 0x30;
    ex >>= 4;
    high = flashData[addr + shift] & 0xc0;
    high >>= 6;

    if (dpiKind == "3955") {
      val = flashData[addr + 2] + (flashData[addr + 3] << 8) + (high << 16);
    } else val = flashData[addr + 1] + (high << 8);

    console.log("Update_Mouse_Dpi", i, dpiKind, val);

    deviceInfo.mouseCfg.dpis[i].y = EepromValue_To_DPIValue(val, ex);
    deviceInfo.mouseCfg.dpis[i].color = UserConvert.Buffer_To_Color(flashData, i * 4 + MouseEepromAddr.DPIValue + 0x20);
  }
}

//更新鼠标信息
async function Update_Mouse_Info() {
  deviceInfo.mouseCfg.reportRate = UserConvert.FlashData_To_ReportRate(flashData[0]);

  if (deviceInfo.mouseCfg.reportRate > deviceInfo.maxReportRate) {
    deviceInfo.mouseCfg.reportRate = deviceInfo.maxReportRate;
    console.log("current reportRate > maxReportRate", deviceInfo.mouseCfg.reportRate);
  }

  deviceInfo.mouseCfg.leftKeyOperation = flashData[MouseEepromAddr.KeyOperation] & 0x01; //2026.01.07
  deviceInfo.mouseCfg.rightKeyOperation = (flashData[MouseEepromAddr.KeyOperation] & 0x02) >> 1; //2026.01.07
  deviceInfo.mouseCfg.sensor.lod = flashData[MouseEepromAddr.LOD];

  Update_Mouse_Dpi();

  deviceInfo.mouseCfg.maxDpiStage = flashData[MouseEepromAddr.maxDpiStage];
  deviceInfo.mouseCfg.currentDpi = flashData[MouseEepromAddr.CurrentDPI];

  deviceInfo.mouseCfg.dpiEffect.mode = flashData[MouseEepromAddr.DPIEffectMode];
  deviceInfo.mouseCfg.dpiEffect.brightness = DPILightBrightness_To_Index(flashData[MouseEepromAddr.DPIEffectBrightness]);
  deviceInfo.mouseCfg.dpiEffect.speed = flashData[MouseEepromAddr.DPIEffectSpeed];
  deviceInfo.mouseCfg.dpiEffect.state = flashData[MouseEepromAddr.DPIEffectState] == 1 ? on : off;

  deviceInfo.mouseCfg.lightEffect.mode = flashData[MouseEepromAddr.Light];
  deviceInfo.mouseCfg.lightEffect.color = UserConvert.Buffer_To_Color(flashData, 0xa1);
  deviceInfo.mouseCfg.lightEffect.speed = flashData[0xa4] > 9 ? 9 : flashData[0xa4];
  deviceInfo.mouseCfg.lightEffect.brightness = flashData[0xa5] > 9 ? 9 : flashData[0xa5];
  deviceInfo.mouseCfg.lightEffect.state = flashData[0xa7] == 1 ? on : off;
  deviceInfo.mouseCfg.lightEffect.movingOffState = flashData[MouseEepromAddr.MovingOffLight] == 1;
  deviceInfo.mouseCfg.sleepTime = flashData[MouseEepromAddr.SleepTime];

  deviceInfo.mouseCfg.debounceTime = flashData[MouseEepromAddr.DebounceTime];
  deviceInfo.mouseCfg.sensor.motionSync = flashData[MouseEepromAddr.MotionSync] == 1;
  deviceInfo.mouseCfg.sensor.performance = flashData[MouseEepromAddr.Performance];
  deviceInfo.mouseCfg.sensor.angle = flashData[MouseEepromAddr.Angle] == 1;
  deviceInfo.mouseCfg.sensor.ripple = flashData[MouseEepromAddr.Ripple] == 1;
  deviceInfo.mouseCfg.sensor.performanceState = flashData[MouseEepromAddr.PerformanceState] == 1;
  deviceInfo.mouseCfg.sensor.sensorMode = flashData[MouseEepromAddr.SensorMode];

  if (((flashData[MouseEepromAddr.SensorFPS20K] + flashData[MouseEepromAddr.SensorFPS20K + 1]) & 0xff) == 0x55) {
    deviceInfo.mouseCfg.sensor.fps20k = flashData[MouseEepromAddr.SensorFPS20K];
  }

  if (((flashData[MouseEepromAddr.AngleTune] + flashData[MouseEepromAddr.AngleTune + 1]) & 0xff) == 0x55 && ((flashData[MouseEepromAddr.AngleTuneState] + flashData[MouseEepromAddr.AngleTuneState + 1]) & 0xff) == 0x55) {
    deviceInfo.mouseCfg.supportAngleTune = true;
    var temp = flashData[MouseEepromAddr.AngleTune];
    if (flashData[MouseEepromAddr.AngleTune] >= 0x80) {
      temp -= 0x100;
    }
    deviceInfo.mouseCfg.angleTune = temp; //-30 ~ 30
    deviceInfo.mouseCfg.angleTuneState = flashData[MouseEepromAddr.AngleTuneState];
  } else {
    deviceInfo.mouseCfg.supportAngleTune = false;
  }

  if (((flashData[MouseEepromAddr.WheelDebounceTime] + flashData[MouseEepromAddr.WheelDebounceTime + 1]) & 0xff) == 0x55) {
    deviceInfo.mouseCfg.wheelDebounceTime = flashData[MouseEepromAddr.WheelDebounceTime];
  }

  if (((flashData[MouseEepromAddr.DebounceReleaseTime] + flashData[MouseEepromAddr.DebounceReleaseTime + 1]) & 0xff) == 0x55) {
    deviceInfo.mouseCfg.debounceReleaseTime = flashData[MouseEepromAddr.DebounceReleaseTime];
  }

  //2026.04.16 新增飞轮功能
  if (((flashData[MouseEepromAddr.FlywheelState] + flashData[MouseEepromAddr.FlywheelState + 1]) & 0xff) == 0x55) {
    deviceInfo.mouseCfg.flywheel.state = flashData[MouseEepromAddr.FlywheelState];
  }

  if ((((flashData[MouseEepromAddr.FlywheelMaxSpeed] + flashData[MouseEepromAddr.FlywheelMaxSpeedTime]
    + flashData[MouseEepromAddr.FlywheelReduceSpeed] + flashData[MouseEepromAddr.FlywheelReduceSpeed + 1]) & 0xFF) == 0x55)) {
    deviceInfo.mouseCfg.flywheel.maxSpeed = flashData[MouseEepromAddr.FlywheelMaxSpeed];
    deviceInfo.mouseCfg.flywheel.maxSpeedTime = flashData[MouseEepromAddr.FlywheelMaxSpeedTime];
    deviceInfo.mouseCfg.flywheel.reduceSpeed = flashData[MouseEepromAddr.FlywheelReduceSpeed];
  }

  //2026.04.27 新增按键触发
  if ((((flashData[MouseEepromAddr.LeftTrigger] + flashData[MouseEepromAddr.LeftTrigger + 1]) & 0xFF) == 0x55)) {
    deviceInfo.mouseCfg.trigger.left.triggerPoint = flashData[MouseEepromAddr.LeftTrigger];
  }
  if ((((flashData[MouseEepromAddr.LeftFastTrigger] + flashData[MouseEepromAddr.LeftFastTrigger + 1]) & 0xFF) == 0x55)) {
    deviceInfo.mouseCfg.trigger.left.fastTriggerState = flashData[MouseEepromAddr.LeftFastTrigger] >> 7;
    deviceInfo.mouseCfg.trigger.left.fastTrigger = flashData[MouseEepromAddr.LeftFastTrigger] & 0x7F;
  }
  if ((((flashData[MouseEepromAddr.LeftTactileFeedback] + flashData[MouseEepromAddr.LeftTactileFeedback + 1]) & 0xFF) == 0x55)) {
    deviceInfo.mouseCfg.trigger.left.buttonSound = flashData[MouseEepromAddr.LeftTactileFeedback] >> 7;
    deviceInfo.mouseCfg.trigger.left.tactileFeedback = flashData[MouseEepromAddr.LeftTactileFeedback] & 0x0F;
  }

  if ((((flashData[MouseEepromAddr.RightTrigger] + flashData[MouseEepromAddr.RightTrigger + 1]) & 0xFF) == 0x55)) {
    deviceInfo.mouseCfg.trigger.right.triggerPoint = flashData[MouseEepromAddr.RightTrigger];
  }
  if ((((flashData[MouseEepromAddr.RightFastTrigger] + flashData[MouseEepromAddr.RightFastTrigger + 1]) & 0xFF) == 0x55)) {
    deviceInfo.mouseCfg.trigger.right.fastTriggerState = flashData[MouseEepromAddr.RightFastTrigger] >> 7;
    deviceInfo.mouseCfg.trigger.right.fastTrigger = flashData[MouseEepromAddr.RightFastTrigger] & 0x7F;
  }
  if ((((flashData[MouseEepromAddr.RightTactileFeedback] + flashData[MouseEepromAddr.RightTactileFeedback + 1]) & 0xFF) == 0x55)) {
    deviceInfo.mouseCfg.trigger.right.buttonSound = flashData[MouseEepromAddr.RightTactileFeedback] >> 7;
    deviceInfo.mouseCfg.trigger.right.tactileFeedback = flashData[MouseEepromAddr.RightTactileFeedback] & 0x0F;
  }

  Update_MS_SensorModeDisplay();
  //鼠标配置初始化成功
}

//获取鼠标按键功能
async function Get_Mouse_KeyFunctions() {
  if (deviceInfo.connectState == DeviceConectState.Connecting) {
    deviceInfo.mouseCfg.shortCutKey = [];
    deviceInfo.mouseCfg.macros = [];
    for (var i = 0; i < deviceInfo.mouseCfg.keysCount; i++) {
      var addr = i * 4 + 0x60;
      var tmp = (flashData[addr + 1] << 8) + flashData[addr + 2];
      var value = [flashData[addr].toString(16).toUpperCase(), "0x" + tmp.toString(16).padStart(4, "0")];

      if (flashData[addr] == MouseKeyFunction.DPILock) {
        var dpi = EepromValue_To_DPIValue(flashData[addr + 1] + (flashData[addr + 2] << 8), 0);
        value = [flashData[addr].toString(16).toUpperCase(), dpi.toString()];
      }

      deviceInfo.mouseCfg.keys[i] = value;

      var shortCut = {
        isMedia: false,
        contexts: [],
      };

      if (value[0] == MouseKeyFunction.ShortcutKey) {
        await Get_MS_ShortcutKey(i);
        shortCut = Update_Mouse_ShortcutKey(i);
      }
      deviceInfo.mouseCfg.shortCutKey.push(shortCut);

      var macro = {
        name: "",
        contexts: [],
        cycleTimes: flashData[addr + 2],
      };

      if (value[0] == MouseKeyFunction.Macro) {
        await Get_MS_Macro(i);
        var tmp = Update_Mouse_Macro(i);
        macro.name = tmp.name;
        macro.contexts = tmp.contexts;
      }
      deviceInfo.mouseCfg.macros.push(macro);
    }   
  }
}

//更新鼠标快捷键
function Update_Mouse_ShortcutKey(index) {
  var shortCut = {
    isMedia: false,
    contexts: [],
  };

  var addr = MouseEepromAddr.ShortcutKey + 0x20 * index;
  var count = flashData[addr];
  var contexts = [];
  for (var i = 0; i < count / 2; i++) {
    var type = flashData[addr + i * 0x03 + 1] & 0x0f;
    var value = (flashData[addr + i * 0x03 + 3] << 8) + flashData[addr + i * 0x03 + 2];
    var context = {
      type: type,
      value: value,
    };
    contexts.push(context);
  }

  //快捷键类型是多媒体键
  if (contexts.length == 1) {
    if (contexts[0].type == 2) {
      shortCut.isMedia = true;

      var context = {
        type: contexts[0].type,
        value: "0x" + contexts[0].value.toString(16).padStart(4, "0").toUpperCase(),
      };
      shortCut.contexts.push(context);
    }
  }

  if (shortCut.isMedia == false) {
    shortCut.contexts = contexts;
  }

  return shortCut;
}

function Update_Macro(addr) {
  var nameLen = flashData[addr];
  var contextLen = flashData[addr + 0x1f];
  var context;
  if (nameLen <= 30 && nameLen > 0 && contextLen <= 70) {
    var names = new Uint8Array(nameLen);
    for (var i = 0; i < nameLen; i++) {
      names[i] = flashData[addr + 1 + i];
    }

    var name = UserConvert.UTF8_To_String(names);

    var contexts = [];
    for (var i = 0; i < contextLen; i++) {
      var tmp = flashData[addr + 0x20 + i * 5];

      var status = tmp >> 6;
      status = status === 2 ? 0 : 1;
      var type = tmp & 0x0f;
      var value = (flashData[addr + 0x20 + i * 5 + 2] << 8) + flashData[addr + 0x20 + i * 5 + 1];

      var delay = (flashData[addr + 0x20 + i * 5 + 3] << 8) + flashData[addr + 0x20 + i * 5 + 4];
      var context = {
        status: status,
        type: type,
        value: value,
        delay: delay,
      };

      contexts.push(context);
    }

    var macro = {
      name: name,
      contexts: contexts,
    };

    return macro;
  }

  return null;
}

//更新鼠标宏
function Update_Mouse_Macro(index) {
  var addr = MouseEepromAddr.Macro + 0x180 * index;

  return Update_Macro(addr);
}

//value值为报告率值，例如500Hz value=500
async function Set_MS_ReportRate(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var reportRate = 1;
    if (value <= 1000) {
      reportRate = 1000 / value;
    } else {
      reportRate = (value / 2000) * 0x10;
    }

    await Set_Device_Eeprom_Value(MouseEepromAddr.ReportRate, reportRate);
    deviceInfo.mouseCfg.reportRate = value;
    Update_MS_SensorModeDisplay();
  }
  return flag;
}

//获取鼠标报告率
async function Get_MS_ReportRate() {
  await Get_Device_Eeprom_Buffer(MouseEepromAddr.ReportRate, 2);
}

//设置最大DPI值
async function Set_MS_MaxDPI(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(MouseEepromAddr.maxDpiStage, value);

  return flag;
}

//设置鼠标当前DPI档位，0-maxDPI-1
async function Set_MS_CurrentDPI(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    flag = await Set_Device_Eeprom_Value(MouseEepromAddr.CurrentDPI, value);
    if (flag) deviceInfo.mouseCfg.currentDpi = value;
  }

  return flag;
}

//获取鼠标当前DPI档位
async function Get_MS_CurrentDPI() {
  await Get_Device_Eeprom_Buffer(MouseEepromAddr.CurrentDPI, 2);
}

async function Set_MS_XSpindown(value) {
  await Set_Device_Eeprom_Value(0x06, value);
}

async function Set_MS_YSpindown(value) {
  await Set_Device_Eeprom_Value(0x08, value);
}

//20260107
async function Set_MS_KeyOperation() {
  var value = 0;
  if (deviceInfo.mouseCfg.leftKeyOperation > 0) {
    value |= 0x01;
  }

  if (deviceInfo.mouseCfg.rightKeyOperation > 0) {
    value |= 0x02;
  }

  await Set_Device_Eeprom_Value(MouseEepromAddr.KeyOperation, value);
}

//设置左键为0->普通模式 1->超前模式
async function Set_MS_LeftKeyOperation(value) {
  deviceInfo.mouseCfg.leftKeyOperation = value > 0 ? 1 : 0;
  await Set_MS_KeyOperation();
}

//设置右键为0->普通模式 1->超前模式
async function Set_MS_RightKeyOperation(value) {
  deviceInfo.mouseCfg.rightKeyOperation = value > 0 ? 1 : 0;
  await Set_MS_KeyOperation();
}

function DPIValue_To_EepromValue(value) {
  var val = 0;

  var dpiEx = 0x00;
  var div = 1;
  var index;
  //办公sensor
  if (typeof deviceInfo.mouseCfg.sensor.cfg.office !== "undefined" && deviceInfo.mouseCfg.sensor.cfg.office !== null) {
    var found = false;
    for (index = 0; index < deviceInfo.mouseCfg.sensor.cfg.office.length; index++) {
      if (value == deviceInfo.mouseCfg.sensor.cfg.office[index]) {
        val = index;
        found = true;
        break;
      }
    }

    if (found == false) {
      for (index = 0; index < deviceInfo.mouseCfg.sensor.cfg.office.length; index++) {
        if (value == deviceInfo.mouseCfg.sensor.cfg.office[index] * 2) {
          val = index;
          dpiEx = 0x11;
          found = true;
          break;
        }
      }
    }

    console.log("updateMouseDpi", index, value);
  } else {
    for (index = deviceInfo.mouseCfg.sensor.cfg.range.length - 1; index >= 0; index--) {
      if (value >= deviceInfo.mouseCfg.sensor.cfg.range[index].min) {
        break;
      }
    }

    dpiEx = deviceInfo.mouseCfg.sensor.cfg.range[index].DPIex;

    if (index == 3) {
      div = 4;
    } else if (index == 1 || index == 2) {
      div = 2;
    }

    if (deviceInfo.mouseCfg.sensor.type == "OM76" && dpiEx == 0x22) div = 10;
    else if (deviceInfo.mouseCfg.sensor.type == "OM76" && dpiEx == 0x33) div = 20;

    val = value / div;

    if (typeof deviceInfo.mouseCfg.sensor.cfg.values !== "undefined" && deviceInfo.mouseCfg.sensor.cfg.values !== null) {
      if (deviceInfo.mouseCfg.sensor.type == "3315") {
        var doubleFlag = (dpiEx & 0x01) == 0x01;
        var step100Flag = (dpiEx & 0x02) == 0x02;

        val = value / (doubleFlag ? 2 : 1);
        index = (val - deviceInfo.mouseCfg.sensor.cfg.range[step100Flag ? 1 : 0].min) / deviceInfo.mouseCfg.sensor.cfg.range[step100Flag ? 1 : 0].step;
        val = deviceInfo.mouseCfg.sensor.cfg.values[step100Flag ? 1 : 0][index];
      } else {
        index = (val - deviceInfo.mouseCfg.sensor.cfg.range[0].min) / deviceInfo.mouseCfg.sensor.cfg.range[0].step;
        val = deviceInfo.mouseCfg.sensor.cfg.values[index];
      }
    } else {
      val = val / deviceInfo.mouseCfg.sensor.cfg.range[0].step;

      if ((deviceInfo.mouseCfg.sensor.type == "OM76" && value > 10000) || deviceInfo.mouseCfg.sensor.type == "S312") val -= 0;
      else val -= 1;
    }
  }

  var temp = {
    val,
    dpiEx,
  };
  return temp;
}

//设置DPI值，index为哪一个档，value为dpi值
async function Set_MS_DPIValue(index, value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    if (dpiLayoutIs3955()) {
      var addr = MouseEepromAddr.Sensor3955DPI + index * 6;
      var data = Uint8Array.of(0x00, 0x00, 0x00, 0x00, 0x00, 0x00);

      var temp = DPIValue_To_EepromValue(value);
      data[0] = temp.val;
      data[1] = temp.val >> 8;
      data[2] = temp.val;
      data[3] = temp.val >> 8;
      var high = 0;

      high = temp.val >> 16;
      data[4] = (high << 2) | (high << 6) | temp.dpiEx | (temp.dpiEx << 4);
      data[4] |= temp.dpiEx;

      data[5] = get_Crc(data);
      console.log("Set_MS_DPIValue:", value, temp);
      flag = await Set_Device_Eeprom_Array(addr, data);
      if (flag) deviceInfo.mouseCfg.dpis[index].value = value;
    } else {
      var addr = MouseEepromAddr.DPIValue + index * 4;
      var data = Uint8Array.of(0x00, 0x00, 0x00, 0x00);

      var temp = DPIValue_To_EepromValue(value);
      data[0] = temp.val;
      var high = 0;

      data[1] = temp.val;
      high = temp.val >> 8;
      data[2] = (high << 2) | (high << 6) | temp.dpiEx | (temp.dpiEx << 4);

      data[3] = get_Crc(data);
      console.log("Set_MS_DPIValue:", value, temp);
      flag = await Set_Device_Eeprom_Array(addr, data);
      if (flag) {
        deviceInfo.mouseCfg.dpis[index].x = deviceInfo.mouseCfg.dpis[index].y = deviceInfo.mouseCfg.dpis[index].value = value;
      }
    }
  }

  return flag;
}

//设置DPI值，index为哪一个档，valueX为X的dpi值，valueY为Y的dpi值
async function Set_MS_DPIXYValue(index, valueX, valueY) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    if (dpiLayoutIs3955()) {
      var addr = MouseEepromAddr.Sensor3955DPI + index * 6;
      var data = Uint8Array.of(0x00, 0x00, 0x00, 0x00, 0x00, 0x00);

      var x = DPIValue_To_EepromValue(valueX);
      var y = DPIValue_To_EepromValue(valueY);
      data[0] = x.val;
      data[1] = x.val >> 8;
      data[2] = y.val;
      data[3] = y.val >> 8;
      var highX = x.val >> 16;
      var highY = y.val >> 16;

      data[4] = (highX << 2) | (highY << 6) | x.dpiEx | (y.dpiEx << 4);

      data[5] = get_Crc(data);
      console.log("Set_MS_DPIXYValue:", index, valueX, valueY, x, y);
      flag = await Set_Device_Eeprom_Array(addr, data);
      if (flag) {
        deviceInfo.mouseCfg.dpis[index].x = deviceInfo.mouseCfg.dpis[index].value = valueX;
        deviceInfo.mouseCfg.dpis[index].y = valueY;
      }
    } else {
      var addr = MouseEepromAddr.DPIValue + index * 4;
      var data = Uint8Array.of(0x00, 0x00, 0x00, 0x00);

      var x = DPIValue_To_EepromValue(valueX);
      var y = DPIValue_To_EepromValue(valueY);
      data[0] = x.val;
      data[1] = y.val;
      var highX = x.val >> 8;
      var highY = y.val >> 8;

      data[2] = (highX << 2) | (highY << 6) | x.dpiEx | (y.dpiEx << 4);

      data[3] = get_Crc(data);
      console.log("Set_MS_DPIXYValue:", valueX, x, valueY, y);
      await Set_Device_Eeprom_Array(addr, data);
      deviceInfo.mouseCfg.dpis[index].x = deviceInfo.mouseCfg.dpis[index].value = valueX;
      deviceInfo.mouseCfg.dpis[index].y = valueY;
    }
  }

  return flag;
}

//设置DPI值，index为哪一个档，value为dpi颜色值（格式rgb（255,0,0））
async function Set_MS_DPIColor(index, color) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var addr = MouseEepromAddr.DPIColor + index * 4;
    var data = UserConvert.Color_To_Buffer(color);
    var value = Uint8Array.of(data[0], data[1], data[2], 0x00);
    value[3] = get_Crc(value);
    await Set_Device_Eeprom_Array(addr, value);
  }

  return flag;
}

//获取DPI灯效
async function Get_MS_DPILightEffect() {
  await Get_Device_Eeprom_Buffer(MouseEepromAddr.DPIEffectMode, 8);
}

//设置DPI灯效模式
async function Set_MS_DPILightMode(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.DPIEffectMode, value);
    if (deviceInfo.mouseCfg.dpiEffect.state == off) {
      deviceInfo.mouseCfg.dpiEffect.state = on;
      await Set_Device_Eeprom_Value(MouseEepromAddr.DPIEffectState, 1);
    }
  }
  return flag;
}

//设置DPI灯效亮度（仅呼吸模式）
async function Set_MS_DPILightBrightness(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var bri = Index_To_DPILightBrightness(value);
    await Set_Device_Eeprom_Value(MouseEepromAddr.DPIEffectBrightness, bri);
  }

  return flag;
}

/// <summary>
/// DPI亮度值切换
/// </summary>
/// <param name="index"></param>
/// <returns></returns>
function Index_To_DPILightBrightness(index) {
  /*
   * 1=0x10
   * 2=0x1E
   * 3=0x3C
   * 4=0x5A
   * 5=0x80(默认)
   * 6=0x96
   * 7=0xB4
   * 8=0xD2
   * 9=0xE6
   * 10=0xFF
   */
  var value = 0;
  switch (index) {
    case 1:
      value = 0x10;
      break;
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
    case 8:
      value = 0x1e * (index - 1);
      break;
    case 5:
      value = 0x80;
      break;
    case 9:
      value = 0xe6;
      break;
    case 10:
      value = 0xff;
      break;
    default:
      value = 0x80;
      break;
  }

  return value;
}

function DPILightBrightness_To_Index(value) {
  /*
   * 1=0x10
   * 2=0x1E
   * 3=0x3C
   * 4=0x5A
   * 5=0x80(默认)
   * 6=0x96
   * 7=0xB4
   * 8=0xD2
   * 9=0xE6
   * 10=0xFF
   */
  var index = 0;

  if (value % 0x1e == 0) {
    index = value / 0x1e + 1;
  } else {
    switch (value) {
      case 0x10:
        index = 1;
        break;
      case 0x80:
        index = 5;
        break;
      case 0xe6:
        index = 9;
        break;
      case 0xff:
        index = 10;
        break;
      default:
        index = 5;
        break;
    }
  }

  return index;
}

//设置DPI灯效速度（仅常亮模式）
async function Set_MS_DPILightSpeed(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(MouseEepromAddr.DPIEffectSpeed, value);

  return flag;
}

//关闭DPI灯效
async function Set_MS_DPILightOff() {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.mouseCfg.dpiEffect.state = off;
    await Set_Device_Eeprom_Value(MouseEepromAddr.DPIEffectState, 0);
  }

  return flag;
}

async function setRGBColor(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Array(0x54, value);
}

async function setRGBEffect(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(0x58, value);
}

async function setRGBSpeed(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(0x5a, value);
}

async function setRGBBri(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(0x5c, value);
}

async function Set_MS_LightPowerSave(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(0x5e, value);

  return flag;
}

//获取鼠标装饰灯
async function Get_MS_Light() {
  await Get_Device_Eeprom_Buffer(MouseEepromAddr.Light, 7);
}

//设置鼠标装饰灯
async function Set_MS_Light() {
  var value = Uint8Array.of(0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
  value[0] = deviceInfo.mouseCfg.lightEffect.mode;
  var color = UserConvert.Color_To_Buffer(deviceInfo.mouseCfg.lightEffect.color);
  value[1] = color[0];
  value[2] = color[1];
  value[3] = color[2];
  value[4] = deviceInfo.mouseCfg.lightEffect.speed;
  value[5] = deviceInfo.mouseCfg.lightEffect.brightness;
  value[6] = get_Crc(value);
  await Set_Device_Eeprom_Array(MouseEepromAddr.Light, value);
}

//设置鼠标装饰灯颜色
async function Set_MS_LightColor(color) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.mouseCfg.lightEffect.color = UserConvert.Buffer_To_Color(color, 0);
    await Set_MS_Light();
  }

  return flag;
}

//设置鼠标装饰灯模式
async function Set_MS_LightMode(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    if (value == 0) {
      if (deviceInfo.mouseCfg.lightEffect.state == on) {
        await Set_Device_Eeprom_Value(0xa7, 0);
        deviceInfo.mouseCfg.lightEffect.state = off;
      }
    } else {
      if (deviceInfo.mouseCfg.lightEffect.state == off) {
        await Set_Device_Eeprom_Value(0xa7, 1);
        deviceInfo.mouseCfg.lightEffect.state = on;
      }

      deviceInfo.mouseCfg.lightEffect.mode = value;
      await Set_MS_Light();
    }
  }

  return flag;
}

//设置鼠标装饰灯亮度
async function Set_MS_LightBrightness(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.mouseCfg.lightEffect.brightness = value;
    await Set_MS_Light();
  }

  return flag;
}

//设置鼠标装饰灯速度
async function Set_MS_LightSpeed(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.mouseCfg.lightEffect.speed = value;
    await Set_MS_Light();
  }

  return flag;
}

/*设置鼠标LOD值
根据senor区分:
3395:1->1mm;2->2mm
3950:1->1mm;2->2mm;3->0.7mm
3955:1->0.7mm;2->0.9mm;3->1.2mm;4->1.4mm;5->1.5mm
*/
async function Set_MS_LOD(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.LOD, value);
    deviceInfo.mouseCfg.sensor.lod = value;
  }

  return flag;
}

//获取鼠标LOD值
async function Get_MS_LOD() {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Get_Device_Eeprom_Buffer(MouseEepromAddr.LOD, 2);
  }

  return flag;
}

//设置鼠标按键消抖时间
async function Set_MS_DebounceTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.DebounceTime, value);
    deviceInfo.mouseCfg.debounceTime = value;
  }

  return flag;
}

//设置鼠标按键消抖时间
async function Get_MS_DebounceTime() {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Get_Device_Eeprom_Buffer(MouseEepromAddr.DebounceTime, 2);
  }

  return flag;
}

//设置鼠标motionsync
async function Set_MS_MotionSync(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.MotionSync, value);
    deviceInfo.mouseCfg.sensor.motionSync = value;
  }

  return flag;
}

async function Get_MS_MotionSync() {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Get_Device_Eeprom_Buffer(MouseEepromAddr.MotionSync, 2);
  }

  return flag;
}

async function Set_MS_LightOffTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.SleepTime, value);
    deviceInfo.mouseCfg.sleepTime = value;
  }

  return flag;
}

//设置鼠标直线修正
async function Set_MS_Angle(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.Angle, value);
    deviceInfo.mouseCfg.sensor.angle = value;
  }

  return flag;
}

//设置鼠标波纹控制
async function Set_MS_Ripple(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.Ripple, value);
    deviceInfo.mouseCfg.sensor.ripple = value;
  }

  return flag;
}

//设置鼠标移动关装饰灯状态
async function Set_MS_MovingOffState(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.MovingOffLight, value);
    deviceInfo.mouseCfg.lightEffect.movingOffState = value == 1;
  }

  return flag;
}

//设置鼠标火力全开状态
async function Set_MS_PerformanceState(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.PerformanceState, value);
    deviceInfo.mouseCfg.sensor.performance = value;
  }

  return flag;
}

//设置鼠标火力全开时间
async function Set_MS_PerformanceTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(MouseEepromAddr.Performance, value);

  return flag;
}

//设置鼠标Sensor模式
async function Set_MS_SensorMode(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.SensorMode, value);
    deviceInfo.mouseCfg.sensor.sensorMode = value;
    deviceInfo.mouseCfg.sensor.sensorModeDisplay = value;
  }

  return flag;
}

//更新显示的Sensor模式
function Update_MS_SensorModeDisplay() {
  var mode = 256; // 0:LP Mode
  // 1:HP Mode
  // 256:Corder Mode
  var disable = true;
  if (deviceInfo.isWired == false && deviceInfo.mouseCfg.sensor.fps20k == false) {
    //报告率在125,250,500和1000的时候才能选择sensor模式（LP/HP）
    if (deviceInfo.mouseCfg.reportRate < 2000) {
      disable = false;
      mode = deviceInfo.mouseCfg.sensor.sensorMode;
    }
    //报告率在8000的时候只能选择corder模式
    else if (deviceInfo.mouseCfg.reportRate == 8000) {
    } else {
      //报告率在2000和4000的时候
      //sensor=3955的时候，只能选HP模式
      //其他sensor只能选corder模式
      if (deviceInfo.mouseCfg.sensor.type == "3955") {
        mode = 1;
      }
    }
  }

  deviceInfo.mouseCfg.sensor.sensorModeDisplay = mode;
  deviceInfo.mouseCfg.sensor.sensorModeDisable = disable;

  console.log("Update_MS_SensorModeDisplay", deviceInfo.mouseCfg);
}

async function Set_MS_AngleTune(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    if (deviceInfo.mouseCfg.angleTuneState == false) {
      await Set_Device_Eeprom_Value(MouseEepromAddr.AngleTuneState, 1);
      deviceInfo.mouseCfg.angleTuneState = 1;
    }

    var temp = value;
    if (value < 0) {
      temp += 0x100;
    }
    deviceInfo.mouseCfg.angleTune = value; //-30 ~ 30

    await Set_Device_Eeprom_Value(MouseEepromAddr.AngleTune, temp);
  }

  return flag;
}

//设置鼠标Sensor FPS 20K
async function Set_MS_SensorFPS20K(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.SensorFPS20K, value);
    deviceInfo.mouseCfg.sensor.fps20k = value;
    Update_MS_SensorModeDisplay();
  }

  return flag;
}

//设置滚轮防抖时间（范围:10-100）
async function Set_MS_WheelDebounceTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.WheelDebounceTime, value);
    deviceInfo.mouseCfg.wheelDebounceTime = value;
  }

  return flag;
}

//设置按键抬起防抖时间（范围:0-30）
async function Set_MS_DebounceReleaseTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.DebounceReleaseTime, value);
    deviceInfo.mouseCfg.debounceReleaseTime = value;
  }

  return flag;
}

//设置飞轮开关
async function Set_MS_FlywheelState(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Set_Device_Eeprom_Value(MouseEepromAddr.FlywheelState, value);
    deviceInfo.mouseCfg.flywheel.state = value;
  }

  return flag;
}

//设置飞轮开关
async function Get_MS_FlywheelState() {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    await Get_Device_Eeprom_Buffer(MouseEepromAddr.FlywheelState, 2);
  }

  return flag;
}

//设置飞轮参数
async function Set_MS_FlywheelParam() {
  let data = Uint8Array.of(0x08, 0x00, 0x00, 0x00); // 示例数据
  data[0] = deviceInfo.mouseCfg.flywheel.maxSpeed;
  data[1] = deviceInfo.mouseCfg.flywheel.maxSpeedTime;
  data[2] = deviceInfo.mouseCfg.flywheel.reduceSpeed;
  data[3] = get_Crc(data);
  await Set_Device_Eeprom_Array(MouseEepromAddr.FlywheelMaxSpeed, data);
}

//飞轮初始最快速度
//0~4:最快速度档位1到5，总共五档，0最慢
async function Set_MS_FlywheelMaxSpeed(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.mouseCfg.flywheel.maxSpeed = value;
    Set_MS_FlywheelParam();
  }

  return flag;
}

//飞轮最快速度持续时间
//0~4:最快速度持续时间档位1到5，总共五档，0最慢
async function Set_MS_FlywheelMaxSpeedTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.mouseCfg.flywheel.maxSpeedTime = value;
    Set_MS_FlywheelParam();
  }

  return flag;
}

//飞轮降速快慢
//0~4:降速快慢档位1到5，总共五档，0最慢
async function Set_MS_FlywheelReduceSpeed(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    deviceInfo.mouseCfg.flywheel.reduceSpeed = value;
    Set_MS_FlywheelParam();
  }

  return flag;
}

//设置按键触发点
//button: 0:左键  1:右键
//value：
// 左键触发点，分10档（25/档）   档位对应的值 10进制数:
// 数值0~9:
// 0-----------------/+25
// 1-----------------/+50
// 2-----------------/+75
// 3-----------------/+100
// 4-----------------/+125
// 5-----------------/+150
// 6-----------------/+175
// 7-----------------/+200
// 8-----------------/+225
// 9----------------/+250
async function Set_MS_ButtonTrigger(button, value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    if (button == 0) {
      await Set_Device_Eeprom_Value(MouseEepromAddr.LeftTrigger, value);
      deviceInfo.mouseCfg.trigger.left.triggerPoint = value;
    } else {
      await Set_Device_Eeprom_Value(MouseEepromAddr.RightTrigger, value);
      deviceInfo.mouseCfg.trigger.right.triggerPoint = value;
    }
  }

  return flag;
}

//设置按键快速触发
//button: 0:左键  1:右键
//state: 0:关   1:开
//power
//Bit6 ~Bit0:
// 左键快速触发，分5档 （25/档） 档位对应的值 10进制数
// 数值0~5::
// 0:关
// 1--------------/-25
// 2--------------/-50
// 3--------------/-75
// 4--------------/-100
// 5--------------/-125
async function Set_MS_ButtonFastTrigger(button, state, power) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var value = (state << 7) + (power & 0x7F);
    if (button == 0) {
      await Set_Device_Eeprom_Value(MouseEepromAddr.LeftFastTrigger, value);
      deviceInfo.mouseCfg.trigger.left.fastTrigger = value;
    }
    else {
      await Set_Device_Eeprom_Value(MouseEepromAddr.RightFastTrigger, value);
      deviceInfo.mouseCfg.trigger.right.fastTrigger = value;
    }
  }

  return flag;
}

//设置按键触觉反馈
//button: 0:左键  1:右键
//sound:bit7：1=开按键声音，0=关按键声音
// bit6-bit4：保留
//power: bit3-bit0：力度强弱

// 力度强弱:0~5:
// 0------------------关
// 1------------------波形1
// 2------------------波形2
// 3------------------波形3
// 4------------------波形4
// 5------------------波形5
async function Set_MS_ButtonTactileFeedback(button, sound, power) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var value = (sound << 7) + (power & 0x0F);
    if (button == 0) {
      await Set_Device_Eeprom_Value(MouseEepromAddr.LeftTactileFeedback, value);
      deviceInfo.mouseCfg.trigger.left.buttonSound = sound;
      deviceInfo.mouseCfg.trigger.left.tactileFeedback = power;
    }
    else {
      await Set_Device_Eeprom_Value(MouseEepromAddr.RightTactileFeedback, value);
      deviceInfo.mouseCfg.trigger.right.buttonSound = sound;
      deviceInfo.mouseCfg.trigger.right.tactileFeedback = power;
    }
  }

  return flag;
}

//设置鼠标按键功能：index为按键索引
async function Set_MS_KeyFunction(index, keyFunction) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var addr = MouseEepromAddr.KeyFunction + index * 4;
    let data = Uint8Array.of(0x08, 0x00, 0x00, 0x00); // 示例数据
    data[0] = keyFunction.type;
    if (keyFunction.type == MouseKeyFunction.DPILock) {
      var temp = DPIValue_To_EepromValue(keyFunction.param);
      data[1] = temp.val & 0xff;
      data[2] = temp.val >> 8;
      data[3] = get_Crc(data);
    } else {
      data[1] = keyFunction.param >> 8;
      data[2] = keyFunction.param & 0xFF;
      data[3] = get_Crc(data);
    }

    await Set_Device_Eeprom_Array(addr, data);
    var keyValue = [keyFunction.type.toString(16), "0x" + keyFunction.param.toString(16).padStart(4, '0')];
    deviceInfo.mouseCfg.keys[index] = keyValue;
  }

  return flag;
}

//设置鼠标多媒体按键：index为按键索引，value为键值
async function Set_MS_Multimedia(index, multimedia) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var addr = MouseEepromAddr.ShortcutKey + index * 0x20;
    var value = [];
    var data = UserConvert.String_To_Hex(multimedia);

    var cnt = 0;
    value[cnt++] = 0x02;
    value[cnt++] = 0x82;
    value[cnt++] = data & 0xff;
    value[cnt++] = data >> 8;

    value[cnt++] = 0x42;
    value[cnt++] = data & 0xff;
    value[cnt++] = data >> 8;

    value[cnt] = 0;
    value[cnt] = get_Crc(value);

    await Set_Device_Eeprom_Array(addr, value);

    var shortCut = {
      isMedia: true,
      contexts: [],
    };

    shortCut = Update_Mouse_ShortcutKey(index);
    deviceInfo.mouseCfg.shortCutKey[index] = shortCut;
  }

  return flag;
}

//设置鼠标快捷键：index为按键索引，shortCut为快捷键数组（例如[LCtrl,A]）
async function Set_MS_ShortcutKey(index, shortCut) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var addr = MouseEepromAddr.ShortcutKey + index * 0x20;
    var value = [];

    var cnt = shortCut.length;
    console.log("shortCutKey:", shortCut, cnt);
    value.push(cnt * 2);
    for (var i = 0; i < cnt; i++) {
      var tmp = HIDKey.textToHID(shortCut[i]);

      value.push(tmp.type | 0x80);
      value.push(tmp.value & 0xff);
      value.push((tmp.value >> 8) & 0xff);
    }

    for (var i = 0; i < cnt; i++) {
      var tmp = HIDKey.textToHID(shortCut[cnt - 1 - i]);

      value.push(tmp.type | 0x40);
      value.push(tmp.value & 0xff);
      value.push((tmp.value >> 8) & 0xff);
    }

    value.push(0);
    value[value.length - 1] = get_Crc(value);
    await Set_Device_Eeprom_Array(addr, value);

    var shortCut = {
      isMedia: true,
      contexts: [],
    };

    shortCut = Update_Mouse_ShortcutKey(index);
    deviceInfo.mouseCfg.shortCutKey[index] = shortCut;
  }

  return flag;
}

//获取鼠标快捷键：index为按键索引
async function Get_MS_ShortcutKey(index) {
  await Get_Device_Eeprom_Buffer(MouseEepromAddr.ShortcutKey + index * 0x20, 10);
  var count = flashData[MouseEepromAddr.ShortcutKey + index * 0x20];
  if (count >= 2) {
    var start = 10;
    var end = count * 3 + 2;

    do {
      var len = end - start > 10 ? 10 : end - start;
      await Get_Device_Eeprom_Buffer(MouseEepromAddr.ShortcutKey + index * 0x20 + start, len);
      start += 10;
    } while (start < end);
  }
}

//设置鼠标宏名称：index为按键索引，name为字符串，字符串转换的utf-8数组必须小于30
async function Set_MS_MacroName(index, name) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    var value = await Get_MacroName_Value(name);

    var addr = MouseEepromAddr.Macro + index * 0x180;
    await Set_Device_Eeprom_Array(addr, value);
    deviceInfo.mouseCfg.macros[index].name = name;
  }

  return flag;
}

//设置鼠标宏：index为按键索引，contexts为数组
async function Set_MS_MacroContext(index, contexts) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var value = await Get_MacroContext_Value(contexts);

    var addr = MouseEepromAddr.Macro + index * 0x180 + 0x1f;
    await Set_Device_Eeprom_Array(addr, value);

    deviceInfo.mouseCfg.macros[index].contexts = contexts;
  }

  return flag;
}

//设置鼠标宏：index为索引，macro = {name：name，contexts：contexts}
async function Set_MS_Macro(index, macro) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var value = await Get_Macro_Value(macro);

    var addr = MouseEepromAddr.Macro + index * 0x180;
    await Set_Device_Eeprom_Array(addr, value);

    deviceInfo.mouseCfg.macros[index].name = macro.name;
    deviceInfo.mouseCfg.macros[index].contexts = macro.contexts;
  }

  return flag;
}

//恢复鼠标宏数据：index为索引
async function Restore_MS_Macro(index) {
  var flag = Get_Device_Online();

  if (flag) {
    var value = new Uint8Array(0x180);

    var macro = {
      name: "",
      contexts: [],
      cycleTimes: 1,
    };
    deviceInfo.mouseCfg.macros[index] = macro;

    var addr = MouseEepromAddr.Macro + index * 0x180;
    await Set_Device_Eeprom_Array(addr, value);
  }
}

async function Get_MacroName(addr) {
  await Get_Device_Eeprom_Buffer(addr, 10);

  var count = flashData[addr] + 1;
  if (count > 10) {
    var start = 10;
    var end = count;

    do {
      var len = end - start > 10 ? 10 : end - start;
      await Get_Device_Eeprom_Buffer(addr + start, len);
      start += 10;
    } while (start < end);
  }
}

async function Get_MacroContext(addr) {
  await Get_Device_Eeprom_Buffer(addr, 10);

  var count = flashData[addr];
  if (count >= 2) {
    var start = 10;
    var end = count * 5 + 2;

    do {
      var len = end - start > 10 ? 10 : end - start;
      await Get_Device_Eeprom_Buffer(addr + start, len);
      start += 10;
    } while (start < end);
  }
}

//设置鼠标宏名称：index为按键索引，name为字符串，字符串转换的utf-8数组必须小于30
async function Get_MacroName_Value(name) {
  var nameArray = UserConvert.String_To_UTF8(name);

  var value = new Uint8Array(30 + 1);
  value.fill(0xff);
  value[0] = nameArray.length;
  for (let i = 0; i < nameArray.length; i++) {
    value[i + 1] = nameArray[i];
  }

  return value;
}

//设置鼠标宏：index为按键索引，contexts为数组
async function Get_MacroContext_Value(contexts) {
  var value = [];

  value[0] = contexts.length;
  for (let i = 0; i < contexts.length; i++) {
    var status = 0;
    switch (contexts[i].status) {
      case 0:
        status = 2;
        break;

      case 1:
        status = 1;
        break;
    }
    var para = (status << 6) + contexts[i].type;
    value.push(para);

    para = contexts[i].value & 0xff;
    value.push(para);

    para = contexts[i].value >> 8;
    value.push(para);

    para = contexts[i].delay >> 8;
    value.push(para);

    para = contexts[i].delay & 0xff;
    value.push(para);
  }

  value.push(0);
  value[value.length - 1] = get_Crc(value);

  return value;
}

async function Get_Macro_Value(macro) {
  var name = macro.name;
  var contexts = macro.contexts;
  var nameArray = UserConvert.String_To_UTF8(name);

  var value = new Uint8Array(33 + contexts.length * 5);
  value.fill(0xff);
  value[0] = nameArray.length;
  for (let i = 0; i < nameArray.length; i++) {
    value[i + 1] = nameArray[i];
  }

  value[31] = contexts.length;
  var tmp = [];
  for (let i = 0; i < contexts.length; i++) {
    var status = 0;
    switch (contexts[i].status) {
      case 0:
        status = 2;
        break;

      case 1:
        status = 1;
        break;
    }
    var para = (status << 6) + contexts[i].type;
    tmp.push(para);

    para = contexts[i].value & 0xff;
    tmp.push(para);

    para = contexts[i].value >> 8;
    tmp.push(para);

    para = contexts[i].delay >> 8;
    tmp.push(para);

    para = contexts[i].delay & 0xff;
    tmp.push(para);
  }

  tmp.push(0);
  tmp[tmp.length - 1] = get_Crc(tmp) - contexts.length;

  for (var i = 0; i < tmp.length; i++) {
    value[32 + i] = tmp[i];
  }

  return value;
}

//获取鼠标宏名称
async function Get_MS_MacroName(index) {
  var addr = MouseEepromAddr.Macro + index * 0x180;
  await Get_MacroName(addr);
}

//获取鼠标宏数据
async function Get_MS_MacroContext(index) {
  var addr = MouseEepromAddr.Macro + index * 0x180 + 0x1f;
  await Get_MacroContext(addr);
}

//获取鼠标宏
async function Get_MS_Macro(index) {
  await Get_MS_MacroName(index);
  await Get_MS_MacroContext(index);
}

//保留：暂时没用上
async function Set_MS_RFTXTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) await Set_Device_Eeprom_Value(0xbb, value);

  return flag;
}

async function Get_Keyboard_SyncCRC() {
  var start = KeyboardEepromAddr.SyncCRC;
  var end = KeyboardEepromAddr.SyncCRCEnd;

  await Read_Device_Flash(start, end); //获取同步CRC

  var count = (end - start) / KeyboardEepromAddr.SyncCRCLen;
  var item = localStorage.getItem(deviceInfo.type + "_flash_map");

  deviceInfo.keyboard.crcs = [];

  for (var i = 0; i < count; i++) {
    deviceInfo.keyboard.crcs.push(false);
  }

  if (item) {
    var map = JSON.parse(item);
    for (var i = 0; i < count; i++) {
      var addr = start + i * KeyboardEepromAddr.SyncCRCLen;
      if ((map[addr] == flashData[addr]) &&
        (map[addr + 1] == flashData[addr + 1]) &&
        (map[addr + 2] == flashData[addr + 2]) &&
        (map[addr + 3] == flashData[addr + 3])) {
        deviceInfo.keyboard.crcs[i] = true;
      }
    }

    for (var i = 0; i < flashData.length; i++) {
      if (i < KeyboardEepromAddr.SyncCRC || i > KeyboardEepromAddr.SyncCRCEnd) flashData[i] = map[i];
    }
    console.log("flash map:", deviceInfo.keyboard.crcs, map[0]);
  }
}

//获取机械键盘按键功能
async function Update_Keyboard_KeyFunctions() {
  var macros = [];
  deviceInfo.keyboard.macros = [];
  for (var i = 0; i < 15; i++) {
    macros.push(false);
  }

  deviceInfo.keyboard.keys = {};
  for (var systemIndex = 0; systemIndex < SYSTEMS.length; systemIndex++) {
    if (deviceInfo.keyboard.systems.includes(SYSTEMS[systemIndex])) {
      var system = SYSTEMS[systemIndex];
      deviceInfo.keyboard.keys[system] = {};

      for (var layoutIndex = 0; layoutIndex < LAYOUTS.length; layoutIndex++) {
        if (deviceInfo.keyboard.layouts.includes(LAYOUTS[layoutIndex])) {
          var layout = LAYOUTS[layoutIndex];
          deviceInfo.keyboard.keys[system][layout] = [];

          var start = systemIndex * KeyboardEepromAddr.SystemKeysSize + layoutIndex * KeyboardEepromAddr.LayoutKeysSize;
          var end = start + KeyboardEepromAddr.LayoutKeysSize;

          var index = systemIndex * KeyboardEepromAddr.MaxLayouts + layoutIndex;
          if (deviceInfo.keyboard.crcs[index] == false) await Read_Device_Flash(start, end); //获取按键功能

          for (var i = start; i < end; i += 4) {
            var tmp = (flashData[i + 1] << 8) + flashData[i + 2];

            var key = {
              type: flashData[i],
              value: (flashData[i + 2] << 8) + flashData[i + 1],
            };

            deviceInfo.keyboard.keys[system][layout].push(key);

            if ((flashData[i] & 0x0f) == KeyboardKeyFunction.Macro) {
              if (macros[flashData[i + 1]] == false) {
                macros[flashData[i + 1]] = true;
              }
            }
          }
        }
      }
    }
  }

  for (var i = 0; i < macros.length; i++) {
    var macro = {
      name: "",
      contexts: [],
    };

    if (macros[i]) {
      if (deviceInfo.keyboard.crcs[KeyboardEepromAddr.SyncCRCMacroIndex + i] == false) await Get_KB_Macro(i);
      var tmp = Update_Keyboard_Macro(i);
      if (tmp != null) {
        macro.name = tmp.name;
        macro.contexts = tmp.contexts;
      }
    }

    deviceInfo.keyboard.macros.push(macro);
  }
}

//获取机械键盘灯效
async function Update_Keyboard_LightEffect() {
  await Get_KB_LightEffect();
  await Read_Device_Flash(KeyboardEepromAddr.EffectPara, KeyboardEepromAddr.EffectParaEnd); //获取灯光模式数据

  deviceInfo.keyboard.lightEffect.mode = flashData[KeyboardEepromAddr.CurrentLightMode];
  deviceInfo.keyboard.lightEffect.state = flashData[KeyboardEepromAddr.LightState] == 1;
  deviceInfo.keyboard.lightEffect.offTime = flashData[KeyboardEepromAddr.OffLightTime];

  deviceInfo.keyboard.lightEffect.effects = [];
  for (var i = 0; i < KeyboardEepromAddr.LightModeCount; i++) {
    var effect = {
      colorIndex: 0,
      brightness: 3, //亮度
      speed: 3, //速度
      colors: [],
    };

    var add = KeyboardEepromAddr.EffectPara + 0x20 * i;
    effect.colorIndex = flashData[add];
    effect.speed = flashData[add + 1];
    effect.brightness = flashData[add + 2];

    for (var j = 0; j < 7; j++) {
      var color = UserConvert.Buffer_To_Color(flashData, add + 4 + j * 4);

      effect.colors.push(color);
    }

    deviceInfo.keyboard.lightEffect.effects.push(effect);
  }
}

function Update_Keyboard_LightChange() {
  deviceInfo.keyboard.lightEffect.mode = flashData[KeyboardEepromAddr.CurrentLightMode];
  deviceInfo.keyboard.lightEffect.state = flashData[KeyboardEepromAddr.LightState] == 1;

  var index = deviceInfo.keyboard.lightEffect.mode;

  var add = KeyboardEepromAddr.EffectPara + 0x20 * index;
  deviceInfo.keyboard.lightEffect.effects[index].colorIndex = flashData[add];
  deviceInfo.keyboard.lightEffect.effects[index].speed = flashData[add + 1];
  deviceInfo.keyboard.lightEffect.effects[index].brightness = flashData[add + 2];

  deviceInfo.keyboard.musicState = flashData[KeyboardEepromAddr.MusicState];

  deviceInfo.keyboard.lightChange = true;
}

async function Update_Keyboard_CustomLightMaps() {
  await Read_Device_Flash(KeyboardEepromAddr.CustomLightMaps, 0x1d20); //获取自定义模式灯

  deviceInfo.keyboard.customLights = [];

  for (var i = 0; i < 128; i++) {
    var addr = KeyboardEepromAddr.CustomLightMaps + i * 10;

    var customLight = {
      type: flashData[addr],
      streamIndex: flashData[addr + 1], //流水号
      streamListIndex: flashData[addr + 2], //流水序列号
      runningIndex: flashData[addr + 3], //流水号
      runningListIndex: flashData[addr + 4], //流水序列号
      speed: flashData[addr + 5] >> 4,
      brightness: flashData[addr + 5] & 0x0f,
      color: UserConvert.Buffer_To_Color(flashData, addr + 6),
    };

    deviceInfo.keyboard.customLights.push(customLight);
  }
}

async function Update_Keyboard_OfficeCustomLights() {
  await Read_Device_Flash(KeyboardEepromAddr.OfficeCustomParam, KeyboardEepromAddr.OfficeCustomParam + 0x04); //获取办公键盘自定义模式灯
  //check_crc(flashData, KeyboardEepromAddr.OfficeCustomParam, KeyboardEepromAddr.OfficeCustomParam + 0x04)
  if (check_crc(flashData, KeyboardEepromAddr.OfficeCustomParam, KeyboardEepromAddr.OfficeCustomParam + 0x04)) {
    var total = (deviceInfo.keyboard.officeCustomParam.totalRows = flashData[KeyboardEepromAddr.OfficeCustomParam]); //获取办公键盘自定义灯条行数
    total = total > 30 ? 30 : total;

    deviceInfo.keyboard.officeCustomParam.groups = [];
    deviceInfo.keyboard.officeCustomLights = [];
    for (var i = 0; i < 40; i++) {
      if (i < total) {
        if (deviceInfo.keyboard.crcs[KeyboardEepromAddr.SyncCRCOfficeLightIndex + i] == false) await Read_Device_Flash(KeyboardEepromAddr.OfficeCustomLights + (7 * 16 + 7) * i, KeyboardEepromAddr.OfficeCustomLights + (7 * 16 + 7) * (i + 1)); //获取办公键盘自定义模式灯
      }

      var lights = [];
      for (var j = 0; j < 16; j++) {
        var addr = KeyboardEepromAddr.OfficeCustomLights + (7 * 16 + 7) * i + 7 * j;

        var light = {
          mode: flashData[addr],
          color: UserConvert.Buffer_To_Color(flashData, addr + 1),
          speed: flashData[addr + 4],
          brightness: flashData[addr + 5],
        };
        lights.push(light);
      }
      deviceInfo.keyboard.officeCustomLights.push(lights);

      var groupsAddr = KeyboardEepromAddr.OfficeCustomLights + (7 * 16 + 7) * i + 7 * 16;
      var groups = {
        time: (flashData[groupsAddr] << 8) + flashData[groupsAddr + 1],
        reserve: [],
      };

      for (var k = 0; k < 4; k++) {
        groups.reserve.push(flashData[groupsAddr + 2 + k]);
      }

      deviceInfo.keyboard.officeCustomParam.groups.push(groups);
    }
  } else console.log("OfficeCustomLights crc fail");
}

//获取机械键盘其他信息
async function Update_Keyboard_Info() {
  await Read_Device_Flash(KeyboardEepromAddr.ReportRate, KeyboardEepromAddr.End); //获取其他信息数据

  deviceInfo.keyboard.reportRate = UserConvert.FlashData_To_ReportRate(flashData[KeyboardEepromAddr.ReportRate]);

  if (deviceInfo.keyboard.reportRate > deviceInfo.maxReportRate) {
    deviceInfo.keyboard.reportRate = deviceInfo.maxReportRate;
    console.log("current reportRate > maxReportRate", deviceInfo.keyboard.reportRate);
  }

  deviceInfo.keyboard.bootAnimation = flashData[KeyboardEepromAddr.BootAnimation];
  deviceInfo.keyboard.bootAnimationState = flashData[KeyboardEepromAddr.BootAnimationState] == 1;
  deviceInfo.keyboard.forbidKeyFunction = flashData[KeyboardEepromAddr.ForbidKeyFunction];
  var systems = ["win", "mac", "android", "iOS"];
  deviceInfo.keyboard.currentSystem = systems[flashData[KeyboardEepromAddr.CurrentSystem]];
  deviceInfo.keyboard.fnLockState = flashData[KeyboardEepromAddr.FNLockState];
  deviceInfo.keyboard.fullKeyLockState = flashData[KeyboardEepromAddr.FullKeyLockState];
  deviceInfo.keyboard.musicState = flashData[KeyboardEepromAddr.MusicState];
  deviceInfo.keyboard.scanKeyTime = flashData[KeyboardEepromAddr.ScanKeyTime];
  deviceInfo.keyboard.multikeyType = flashData[KeyboardEepromAddr.MultikeyType];
  deviceInfo.keyboard.wasdKey = flashData[KeyboardEepromAddr.WASDKey];

  Write_Keyboard_Map_To_LocalStorage();
}

function Write_Keyboard_Map_To_LocalStorage() {
  console.log("Write_Keyboard_Map_To_LocalStorage", flashData);
  localStorage.setItem(deviceInfo.type + "_flash_map", JSON.stringify(flashData));
}

//更新鼠标宏
function Update_Keyboard_Macro(index) {
  var addr = KeyboardEepromAddr.Macro + 0x180 * index;

  return Update_Macro(addr);
}

async function Get_KB_LightEffect() {
  await Get_Device_Eeprom_Buffer(KeyboardEepromAddr.CurrentLightMode, 6);
}

async function Get_KB_LightEffectMode() {
  await Get_Device_Eeprom_Buffer(KeyboardEepromAddr.CurrentLightMode, 4);
  deviceInfo.keyboard.lightEffect.mode = flashData[KeyboardEepromAddr.CurrentLightMode];
  deviceInfo.keyboard.lightEffect.state = flashData[KeyboardEepromAddr.LightState] == 1;
}

async function Get_KB_LightState() {
  await Get_Device_Eeprom_Buffer(KeyboardEepromAddr.LightState, 2);
}

async function Get_KB_CurrentEffectParam(index) {
  await Get_Device_Eeprom_Buffer(KeyboardEepromAddr.EffectPara + index * 0x20, 4);

  const mode = deviceInfo.keyboard.lightEffect.mode;
  const add = KeyboardEepromAddr.EffectPara + 0x20 * mode;
  deviceInfo.keyboard.lightEffect.effects[mode].colorIndex = flashData[add];
  deviceInfo.keyboard.lightEffect.effects[mode].speed = flashData[add + 1];
  deviceInfo.keyboard.lightEffect.effects[mode].brightness = flashData[add + 2];
}

async function Get_KB_ReportRate() {
  await Get_Device_Eeprom_Buffer(KeyboardEepromAddr.ReportRate, 2);
}

async function Get_KB_CurrentSystem() {
  await Get_Device_Eeprom_Buffer(KeyboardEepromAddr.CurrentSystem, 2);
}

async function Get_KB_MusicState() {
  await Get_Device_Eeprom_Buffer(KeyboardEepromAddr.MusicState, 2);
}

//获取键盘宏名称
async function Get_KB_MacroName(index) {
  var addr = KeyboardEepromAddr.Macro + index * 0x180;
  await Get_MacroName(addr);
}

//获取键盘宏数据
async function Get_KB_MacroContext(index) {
  var addr = KeyboardEepromAddr.Macro + index * 0x180 + 0x1f;
  await Get_MacroContext(addr);
}

//获取键盘宏
async function Get_KB_Macro(index) {
  await Get_KB_MacroName(index);
  await Get_KB_MacroContext(index);
}

//设置鼠标按键功能：system:["win", "mac", "iOS", "android"] layout = ["normal", "fn", "fn2"];index为按键索引
async function Set_KB_KeyFunction(system, layout, index, keyFunction) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var systemIndex = SYSTEMS.indexOf(system);
    var layoutIndex = LAYOUTS.indexOf(layout);

    var addr = systemIndex * KeyboardEepromAddr.SystemKeysSize + layoutIndex * KeyboardEepromAddr.LayoutKeysSize + index * 4;
    let data = Uint8Array.of(0x08, 0x00, 0x00, 0x00); // 示例数据
    data[0] = keyFunction.type;
    data[1] = keyFunction.value & 0xff;
    data[2] = keyFunction.value >> 8;
    data[3] = get_Crc(data);
    await Set_Device_Eeprom_Array(addr, data);
    deviceInfo.keyboard.keys[system][layout][index] = keyFunction;

    deviceInfo.keyboard.crcs[KeyboardEepromAddr.MaxLayouts * systemIndex + layoutIndex] = false;
  }

  return flag;
}

async function Set_KB_KeyRestore(system, layout, keyFunctions) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var systemIndex = SYSTEMS.indexOf(system);
    var layoutIndex = LAYOUTS.indexOf(layout);

    var addr = systemIndex * KeyboardEepromAddr.SystemKeysSize + layoutIndex * KeyboardEepromAddr.LayoutKeysSize;
    let data = new Uint8Array(keyFunctions.length * 4); // 示例数据
    for (var i = 0; i < keyFunctions.length; i++) {
      let temp = Uint8Array.of(0x00, 0x00, 0x00, 0x00);
      temp[0] = keyFunctions[i].type;
      temp[1] = keyFunctions[i].value & 0xff;
      temp[2] = keyFunctions[i].value >> 8;
      temp[3] = get_Crc(temp);

      for (var j = 0; j < 4; j++) {
        data[i * 4 + j] = temp[j];
      }
    }
    await Set_Device_Eeprom_Array(addr, data);
    deviceInfo.keyboard.keys[system][layout] = keyFunctions;
  }
  return flag;
}

async function Set_KB_LightMode(mode) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.CurrentLightMode, mode);
  }
}

async function Set_KB_LightState(state) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.LightState, state);
  }
}

async function Set_KB_OffLightTime(time) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.OffLightTime, time);
    deviceInfo.keyboard.lightEffect.offTime = time;
    return flag;
  }
}

async function Set_KB_LightEffectParam(index) {
  let data = Uint8Array.of(0x08, 0x00, 0x00, 0x00); // 示例数据
  data[0] = deviceInfo.keyboard.lightEffect.effects[index].colorIndex;
  data[1] = deviceInfo.keyboard.lightEffect.effects[index].speed;
  data[2] = deviceInfo.keyboard.lightEffect.effects[index].brightness;
  data[3] = get_Crc(data);
  await Set_Device_Eeprom_Array(KeyboardEepromAddr.EffectPara + index * 0x20, data);
}

async function Set_KB_LightEffectColorIndex(effect, colorIndex) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.lightEffect.effects[effect].colorIndex = colorIndex;
    await Set_KB_LightEffectParam(effect);
  }

  return flag;
}

async function Set_KB_LightEffectSpeed(effect, speed) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.lightEffect.effects[effect].speed = speed;
    await Set_KB_LightEffectParam(effect);
  }

  return flag;
}

async function Set_KB_LightEffectBrightness(effect, brightness) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.lightEffect.effects[effect].brightness = brightness;
    await Set_KB_LightEffectParam(effect);
  }

  return flag;
}

async function Set_KB_LightEffectColor(effect, index, color) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.lightEffect.effects[effect].colors[index] = color;
    var addr = KeyboardEepromAddr.EffectPara + effect * 0x20 + index * 4 + 4;
    var data = UserConvert.Color_To_Buffer(color);
    var value = Uint8Array.of(data[0], data[1], data[2], 0x00);
    value[3] = get_Crc(value);
    await Set_Device_Eeprom_Array(addr, value);
  }

  return flag;
}

async function Set_KB_CustomLight(index, customLight) {
  let data = new Uint8Array(10); // 示例数据
  data[0] = customLight.type;
  data[1] = customLight.streamIndex;
  data[2] = customLight.streamListIndex;
  data[3] = customLight.runningIndex;
  data[4] = customLight.runningListIndex;
  var data5 = ((customLight.speed & 0x0f) << 4) + (customLight.brightness & 0x0f);
  data[5] = data5;
  var color = UserConvert.Color_To_Buffer(customLight.color);
  data[6] = color[0];
  data[7] = color[1];
  data[8] = color[2];
  data[9] = get_Crc(data);
  await Set_Device_Eeprom_Array(KeyboardEepromAddr.CustomLightMaps + index * 10, data);
}

async function Set_KB_CustomLightType(index, type) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.customLights[index].type = type;
    await Set_KB_CustomLight(index, deviceInfo.keyboard.customLights[index]);
  }

  return flag;
}

async function Set_KB_CustomLightStream(index, streamIndex, streamListIndex) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.customLights[index].type = 1;
    deviceInfo.keyboard.customLights[index].streamIndex = streamIndex;
    deviceInfo.keyboard.customLights[index].streamListIndex = streamListIndex;
    await Set_KB_CustomLight(index, deviceInfo.keyboard.customLights[index]);
  }

  return flag;
}

async function Set_KB_CustomLightRunning(index, runningIndex, runningListIndex) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.customLights[index].type = 4;
    deviceInfo.keyboard.customLights[index].runningIndex = runningIndex;
    deviceInfo.keyboard.customLights[index].runningListIndex = runningListIndex;
    await Set_KB_CustomLight(index, deviceInfo.keyboard.customLights[index]);
  }

  return flag;
}

async function Set_KB_CustomLightSpeed(index, speed) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.customLights[index].speed = speed;
    await Set_KB_CustomLight(index, deviceInfo.keyboard.customLights[index]);
  }

  return flag;
}

async function Set_KB_CustomLightBrightness(index, brightness) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.customLights[index].brightness = brightness;
    await Set_KB_CustomLight(index, deviceInfo.keyboard.customLights[index]);
  }

  return flag;
}

async function Set_KB_CustomLightColor(index, color) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.customLights[index].color = color;
    await Set_KB_CustomLight(index, deviceInfo.keyboard.customLights[index]);
  }

  return flag;
}

async function Set_KB_OfficeCustomLight(row, index, light) {
  console.log("Set_KB_OfficeCustomLight", row, index, light);
  let data = new Uint8Array(7); // 示例数据
  data[0] = light.mode;
  var color = UserConvert.Color_To_Buffer(light.color);
  data[1] = color[0];
  data[2] = color[1];
  data[3] = color[2];
  data[4] = light.speed;
  data[5] = light.brightness;
  data[6] = get_Crc(data);
  await Set_Device_Eeprom_Array(KeyboardEepromAddr.OfficeCustomLights + 119 * row + 7 * index, data);

  deviceInfo.keyboard.officeCustomLights[row][index] = light;
  deviceInfo.keyboard.crcs[KeyboardEepromAddr.SyncCRCOfficeLightIndex + row] = false;
}

async function Set_KB_OfficeCustomLightMode(row, index, mode) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.officeCustomLights[row][index].mode = mode;

    await Set_KB_OfficeCustomLight(row, index, deviceInfo.keyboard.officeCustomLights[row][index]);
  }

  return flag;
}

async function Set_KB_OfficeCustomLightSpeed(row, index, speed) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.officeCustomLights[row][index].speed = speed;
    await Set_KB_OfficeCustomLight(row, index, deviceInfo.keyboard.officeCustomLights[row][index]);
  }

  return flag;
}

async function Set_KB_OfficeCustomLightBrightness(row, index, brightness) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.officeCustomLights[row][index].brightness = brightness;
    await Set_KB_OfficeCustomLight(row, index, deviceInfo.keyboard.officeCustomLights[row][index]);
  }

  return flag;
}

async function Set_KB_OfficeCustomLightColor(row, index, color) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.officeCustomLights[row][index].color = color;

    await Set_KB_OfficeCustomLight(row, index, deviceInfo.keyboard.officeCustomLights[row][index]);
  }

  return flag;
}

async function Set_KB_OfficeCustomLightTotalRows(row) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.officeCustomParam.totalRows = row;
    let data = new Uint8Array(4); // 示例数据
    data[0] = row;
    data[1] = 0;
    data[2] = 0;
    data[3] = get_Crc(data);
    await Set_Device_Eeprom_Array(KeyboardEepromAddr.OfficeCustomParam, data);
  }

  return flag;
}

async function Set_KB_OfficeCustomLightRowTime(row, time) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    deviceInfo.keyboard.officeCustomParam.groups[row].time = time;
    let data = new Uint8Array(7); // 示例数据
    data[0] = (time >> 8) & 0xff;
    data[1] = time & 0xff;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = get_Crc(data);
    await Set_Device_Eeprom_Array(KeyboardEepromAddr.OfficeCustomLights + 119 * (row + 1) - 7, data);
  }

  return flag;
}
/* 
1000 (默认)
500
250 
125
*/
async function Set_KB_ReportRate(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var reportRate = 1;
    if (value <= 1000) {
      reportRate = 1000 / value;
    } else {
      reportRate = (value / 2000) * 0x10;
    }

    await Set_Device_Eeprom_Value(KeyboardEepromAddr.ReportRate, reportRate);
    deviceInfo.keyboard.reportRate = value;
  }
  return flag;
}

// 0：开机动画1
// 1：开机动画2(默认)
async function Set_KB_BootAnimation(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.BootAnimation, value);
  }
  return flag;
}

async function Set_KB_BootAnimationState(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.BootAnimationState, value);
  }
  return flag;
}

async function Set_KB_ForbidKeyFunction(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.ForbidKeyFunction, value);
  }
  return flag;
}

async function Set_KB_CurrentSystem(system) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    var systems = ["win", "mac", "android", "iOS"];
    var index = systems.indexOf(system);
    deviceInfo.keyboard.currentSystem = system;
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.CurrentSystem, index);
  }
  return flag;
}

async function Set_KB_FNLockState(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.FNLockState, value);
  }
  return flag;
}

async function Set_KB_FullKeyLockState(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.FullKeyLockState, value);
  }
  return flag;
}

async function Set_KB_MusicState(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.MusicState, value);
  }
  return flag;
}

async function Set_KB_ScanKeyTime(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.ScanKeyTime, value);
  }
  return flag;
}

async function Set_KB_MultikeyType(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.MultikeyType, value);
  }
  return flag;
}

async function Set_KB_WASDKey(value) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag) {
    await Set_Device_Eeprom_Value(KeyboardEepromAddr.WASDKey, value);
  }
  return flag;
}

//设置鼠标宏：index为索引，macro = {name：name，contexts：contexts}
async function Set_KB_Macro(index, macro) {
  var flag = await Get_Device_Online_With_Dialog();

  if (flag == true) {
    var value = await Get_Macro_Value(macro);

    var addr = KeyboardEepromAddr.Macro + index * 0x180;
    await Set_Device_Eeprom_Array(addr, value);

    deviceInfo.keyboard.macros[index].name = macro.name;
    deviceInfo.keyboard.macros[index].contexts = macro.contexts;

    deviceInfo.keyboard.crcs[index + KeyboardEepromAddr.SyncCRCMacroIndex] = false;
  }

  return flag;
}

async function Set_KB_CRC() {
  console.log("Set KB CRC", deviceInfo.keyboard.crcs);
  var flag = await Get_Device_Online();

  if (flag) {
    for (var i = 0; i < deviceInfo.keyboard.crcs.length; i++) {
      if (deviceInfo.keyboard.crcs[i] == false) {
        var addr = KeyboardEepromAddr.SyncCRC + i * KeyboardEepromAddr.SyncCRCLen;

        var length;
        //键盘按键
        if (i < KeyboardEepromAddr.SyncCRCLightIndex) {
          length = KeyboardEepromAddr.LayoutKeysSize;
          addr = i * length;
        } else {
          if (i > KeyboardEepromAddr.SyncCRCMacroIndex + 15 && deviceInfo.type == "officeKeyboard") {
            //办公键盘自定义灯效
            length = 0x77;
            addr = KeyboardEepromAddr.OfficeCustomLights + (i - KeyboardEepromAddr.SyncCRCOfficeLightIndex) * length;
          }
          //键盘宏
          else if (i >= KeyboardEepromAddr.SyncCRCMacroIndex) {
            length = 0x180;
            addr = KeyboardEepromAddr.Macro + (i - KeyboardEepromAddr.SyncCRCMacroIndex) * length;
          }
        }
        var data = new Uint8Array(length);
        for (var j = 0; j < length; j++) {
          data[j] = flashData[addr + j];
        }

        var crc = crc32(data);
        var value = new Uint8Array(KeyboardEepromAddr.SyncCRCLen);
        value[0] = crc[0];
        value[1] = crc[1];
        value[2] = crc[2];
        value[3] = crc[3];

        await Set_Device_Eeprom_Array(KeyboardEepromAddr.SyncCRC + i * KeyboardEepromAddr.SyncCRCLen, value);

        console.log("Set KB CRC", value);
      }
    }
  }

  Write_Keyboard_Map_To_LocalStorage();
  return flag;
}

//恢复鼠标宏数据：index为索引
async function Restore_KB_Macro(index) {
  var flag = await Get_Device_Online();

  if (flag) {
    var value = new Uint8Array(0x180);

    var macro = {
      name: "",
      contexts: [],
      cycleTimes: 1,
    };
    deviceInfo.keyboard.macros[index] = macro;

    var addr = KeyboardEepromAddr.Macro + index * 0x180;
    await Set_Device_Eeprom_Array(addr, value);
  }
}

function crc32(data) {
  // 生成CRC表（如果尚未生成）
  if (!crc32.table) {
    crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let crc = i;
      for (let j = 0; j < 8; j++) {
        crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
      }
      crc32.table[i] = crc >>> 0; // 确保无符号
    }
  }

  // 将输入转换为Uint8Array
  let bytes;
  if (typeof data === "string") {
    // 将字符串编码为UTF-8字节
    bytes = new TextEncoder().encode(data);
  } else if (data instanceof Uint8Array) {
    bytes = data;
  } else if (data instanceof ArrayBuffer) {
    bytes = new Uint8Array(data);
  } else {
    throw new TypeError("data must be string, Uint8Array, or ArrayBuffer");
  }

  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crc32.table[(crc ^ bytes[i]) & 0xff];
  }
  crc = (crc ^ 0xffffffff) >>> 0; // 取反并转为无符号

  var value = new Uint8Array(4);
  value[0] = crc >> 24;
  value[1] = crc >> 16;
  value[2] = crc >> 8;
  value[3] = crc;
  return value;
}

async function Import_KB_Profile(params) {
  getBatteryFlag = false;
  var flag = await Get_Device_Online();

  if (flag) {
    deviceInfo.keyboard.importingProfile = true;

    var macros = [];
    for (var i = 0; i < 15; i++) {
      macros.push(false);
    }

    //按键功能
    for (var i = 0; i < params.systems.length; i++) {
      for (var j = 0; j < params.layouts.length; j++) {
        var addr = i * KeyboardEepromAddr.SystemKeysSize + j * KeyboardEepromAddr.LayoutKeysSize;
        var size = KeyboardEepromAddr.LayoutKeysSize / 4;
        let data = new Uint8Array(size * 4); // 示例数据
        for (var k = 0; k < size; k++) {
          let temp = Uint8Array.of(0x00, 0x00, 0x00, 0x00);
          temp[0] = params.keys[SYSTEMS[i]][LAYOUTS[j]][k].type;
          temp[1] = params.keys[SYSTEMS[i]][LAYOUTS[j]][k].value & 0xff;
          temp[2] = params.keys[SYSTEMS[i]][LAYOUTS[j]][k].value >> 8;
          temp[3] = get_Crc(temp);

          for (var h = 0; h < 4; h++) {
            data[k * 4 + h] = temp[h];
          }

          if ((temp[0] & 0x0f) == KeyboardKeyFunction.Macro) {
            if (macros[temp[1]] == false) {
              macros[temp[1]] = true;
            }
          }
        }
        await Set_Device_Eeprom_Array(addr, data);
      }
    }

    //灯效
    var lightEffect = new Uint8Array(6);

    lightEffect[0] = params.lightEffect.mode;
    lightEffect[1] = 0x55 - params.lightEffect.mode;

    lightEffect[2] = params.lightEffect.state ? 1 : 0;
    lightEffect[3] = 0x55 - (params.lightEffect.state ? 1 : 0);

    lightEffect[4] = params.lightEffect.offTime;
    lightEffect[5] = 0x55 - params.lightEffect.offTime;

    await Set_Device_Eeprom_Array(KeyboardEepromAddr.CurrentLightMode, lightEffect);

    if (typeof params.lightEffect.effects != "undefined") {
      for (var i = 0; i < KeyboardEepromAddr.LightModeCount; i++) {
        var effect = new Uint8Array(32);

        var temp = new Uint8Array(4);
        temp[0] = params.lightEffect.effects[i].colorIndex;
        temp[1] = params.lightEffect.effects[i].speed;
        temp[2] = params.lightEffect.effects[i].brightness;
        temp[3] = get_Crc(temp);

        for (var j = 0; j < 4; j++) {
          effect[j] = temp[j];
        }

        for (var k = 0; k < 7; k++) {
          temp = new Uint8Array(4);
          var color = UserConvert.Color_To_Buffer(params.lightEffect.effects[i].colors[k]);
          temp[0] = color[0];
          temp[1] = color[1];
          temp[2] = color[2];
          temp[3] = get_Crc(temp);

          for (var j = 0; j < 4; j++) {
            effect[j + 4 * k + 4] = temp[j];
          }
        }
        await Set_Device_Eeprom_Array(KeyboardEepromAddr.EffectPara + 0x20 * i, effect);
      }
    }

    if (deviceInfo.type == "keyboard") {
      if (typeof params.customLights != "undefined") {
        for (var i = 0; i < 128; i++) {
          var customLights = new Uint8Array(10);

          customLights[0] = params.customLights[i].type;
          customLights[1] = params.customLights[i].streamIndex;
          customLights[2] = params.customLights[i].streamListIndex;
          customLights[3] = params.customLights[i].runningIndex;
          customLights[4] = params.customLights[i].runningListIndex;
          customLights[5] = (params.customLights[i].speed << 4) + params.customLights[i].brightness;
          var color = UserConvert.Color_To_Buffer(params.customLights[i].color);
          customLights[6] = color[0];
          customLights[7] = color[1];
          customLights[8] = color[2];
          customLights[9] = get_Crc(customLights);
          await Set_Device_Eeprom_Array(KeyboardEepromAddr.CustomLightMaps + 10 * i, customLights);
        }
      }
    } else if (deviceInfo.type == "officeKeyboard") {
      if (typeof params.officeCustomLights != "undefined" && typeof params.officeCustomParam != "undefined") {
        for (var row = 0; row < params.officeCustomParam.totalRows; row++) {
          for (var index = 0; index < 16; index++) {
            let data = new Uint8Array(7); // 示例数据
            data[0] = params.officeCustomLights[row][index].mode;
            var color = UserConvert.Color_To_Buffer(params.officeCustomLights[row][index].color);
            data[1] = color[0];
            data[2] = color[1];
            data[3] = color[2];
            data[4] = params.officeCustomLights[row][index].speed;
            data[5] = params.officeCustomLights[row][index].brightness;
            data[6] = get_Crc(data);
            await Set_Device_Eeprom_Array(KeyboardEepromAddr.OfficeCustomLights + 119 * row + 7 * index, data);
          }

          let data = new Uint8Array(7); // 示例数据
          data[0] = (params.officeCustomLights[row].time >> 8) & 0xff;
          data[1] = params.officeCustomLights[row].time & 0xff;
          data[2] = 0;
          data[3] = 0;
          data[4] = 0;
          data[5] = 0;
          data[6] = get_Crc(data);
          await Set_Device_Eeprom_Array(KeyboardEepromAddr.OfficeCustomLights + 119 * (row + 1) - 7, data);
        }

        let data = new Uint8Array(4); // 示例数据
        data[0] = params.officeCustomParam.totalRows;
        data[1] = 0;
        data[2] = 0;
        data[3] = get_Crc(data);
        await Set_Device_Eeprom_Array(KeyboardEepromAddr.OfficeCustomParam, data);
      }
    }

    var misc = new Uint8Array(0x20);
    misc[0] = UserConvert.ReportRate_To_FlashData(params.reportRate);
    misc[1] = 0x55 - misc[0];

    misc[2] = params.bootAnimation;
    misc[3] = 0x55 - misc[2];

    misc[4] = params.bootAnimationState ? 1 : 0;
    misc[5] = 0x55 - misc[4];

    misc[6] = params.forbidKeyFunction;
    misc[7] = 0x55 - misc[6];

    var systems = ["win", "mac", "android", "iOS"];
    misc[8] = systems.indexOf(params.currentSystem);
    misc[9] = 0x55 - misc[8];

    misc[10] = params.fnLockState;
    misc[11] = 0x55 - misc[10];

    misc[12] = params.fullKeyLockState;
    misc[13] = 0x55 - misc[12];

    misc[14] = params.musicState;
    misc[15] = 0x55 - misc[14];

    misc[16] = params.scanKeyTime;
    misc[17] = 0x55 - misc[16];

    misc[18] = params.multikeyType;
    misc[19] = 0x55 - misc[18];

    misc[20] = params.wasdKey;
    misc[21] = 0x55 - misc[20];

    await Set_Device_Eeprom_Array(KeyboardEepromAddr.ReportRate, misc);

    for (var i = 0; i < macros.length; i++) {
      if (macros[i]) {
        await Set_KB_Macro(i, params.macros[i]);
      }
    }

    deviceInfo.keyboard.importingProfile = false;
    deviceInfo.keyboard = params;
  }
  getBatteryFlag = true;
}

//设置为Visit模式之后将不会下发和读取USBS数据
function Set_Visit_Mode(flag) {
  visit = flag;
}

function Set_DriverOnline(flag) {
  driverOnlineFlag = flag;
}

export default {
  /*
  Request_Device(filters)

  Request device
  parameter:
  var filters = [];
  var filter = {
    vendorId: Number.parseInt("0x3554"),
    productId: Number.parseInt("0xF516"),
  }
  filters.push(filter);

  returns:
  true:device connect 
  false：device disconnect
  */
  Request_Device,

  /*
  Device_Connect();
  Device connect
  parameter：null
  returns:null
  */
  Device_Connect,

  /*
  Get_HistoryDevicesInfo();
  Get historyDevicesInfo
  parameter：null
  returns:historyDevicesInfo
  */
  Get_HistoryDevicesInfo,

  /*
  Get_Current_Device_Online();
  Get the online status of the device you want to know
  parameter：device
  returns:online state
  */
  Get_Current_Device_Online,

  /*
  Add_Listen_HID_Events();
  Listen HID device Connect and disconnect state
  parameter：null
  returns:null
  */
  Add_Listen_HID_Events,

  Remove_Listen_HID_Events,

  /*
  Device_Reconnect(temp);
  Device reconnect
  parameter：temp
  returns:null
  */

  Device_Reconnect,

  /*
  Write_Mouse_Flash(buffer);
  Write Mouse Flash
  parameter：
  var buffer = [];

  returns:
  false:device offline
  true: device online
  */
  Write_Mouse_Flash,

  /*
  Device_Close();
  Device close:close driver or connect timeout
  parameter：null
  returns:null
  */
  Device_Close,

  /*
  Set_MS_KeyFunction(index,keyFunction)
  Set mouse keyfunction 
  parameter：
  index:current set key index
             keyFunction:
             example:left click
             var keyFunction = {
              type:MouseKeyFunction.MouseKey
              param:0x0100
             }

  returns:
  false:device offline
  true: device online
  */
  Set_MS_KeyFunction,

  /*
  Set_MS_DebounceTime(value);
  Set Mouse Debounce Time
  parameter：
  var value = 8;
  returns:false:device offline
          true: device online
  */
  Set_MS_DebounceTime,

  /*
  Set_MS_Multimedia(index,multimedia);
  Set mouse key Multimedia
  parameter：
  index:current set key index
  multimedia:
  example Volume+:
  var multimedia = 0x00E9;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_Multimedia,

  /*
  Set_MS_ShortcutKey(index,shortCut);
  Set mouse key Shortcut
  parameter：
  index:current set key index
  multimedia:
  example Ctrl+A:
  var shortCut = ["LCtrl","A"];

  returns:
  false:device offline
  true: device online
  */
  Set_MS_ShortcutKey,

  /*
  Set_MS_MacroName(index,name);
  Set mouse macro name
  parameter：
  index:current set key index
  multimedia:
  example hello:
  var name = "hello"

  returns:
  false:device offline
  true: device online
  */
  Set_MS_MacroName,

  /*
  Set_MS_MacroContext(index,contexts);
  Set mouse macro contexts
  parameter：
  index:current set key index
  contexts:
  example :
  A     press   50ms
  A     release 123ms
  Ctrl  


  returns:
  false:device offline
  true: device online
  */
  Set_MS_MacroContext,

  /*
  Set_MS_Macro(index,macro);
  Set mouse key to macro
  parameter：
  index:current set key index
  macro:

  returns:
  false:device offline
  true: device online
  */
  Set_MS_Macro,

  /*
  Restore_MS_Macro(index);
  Restore mouse key(index) macro
  parameter：
  index:current set key index

  returns:
  false:device offline
  true: device online
  */
  Restore_MS_Macro,

  /*
  Set_MS_ReportRate(value);
  Set mouse ReportRate
  parameter：
  example 125Hz
  var value = 125;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_ReportRate,

  //设置左键为0->普通模式 1->超前模式
  Set_MS_LeftKeyOperation,

  //设置右键为0->普通模式 1->超前模式
  Set_MS_RightKeyOperation,

  /*
  Set_MS_MaxDPI(value);
  Set mouse max dpi
  parameter(max 8)：
  example 5
  var value = 5;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_MaxDPI,

  /*
  Set_MS_CurrentDPI(value);
  Set mouse current dpi
  parameter(max (MaxDPI - 1)))：
  example 5
  var value = 5;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_CurrentDPI,

  /*
  Set_MS_DPIValue(index,value);
  Set mouse dpi value
  parameter：
  index:current set dpi stage index
  var value = 500;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_DPIValue,
  Set_MS_DPIXYValue,

  /*
  Set_MS_DPIColor(index,color);
  Set mouse dpi color
  parameter：
  index:current set dpi stage index
  example:red,rgb(255,0,0)
  var value = "rgb(255,0,0)";

  returns:
  false:device offline
  true: device online
  */
  Set_MS_DPIColor,

  /*
  Sensor Setting:
  TODO:not all sensor have the following Settings(For details please see"sensor.json")
  */
  /*
  Set_MS_SensorMode(value);
  Set mouse sensor mode
  parameter：
  0:LP
  1:HP
  var value = 0;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_SensorMode,

  Set_MS_AngleTune,
  /*
  Set_MS_SensorFPS20K(value);
  Set mouse sensor fps 20k
  parameter：
  0:off
  1:on
  var value = 0;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_SensorFPS20K,

  //设置滚轮防抖时间（范围:10-100）
  Set_MS_WheelDebounceTime,

  //设置按键抬起防抖时间（范围:0-30）
  Set_MS_DebounceReleaseTime,
  Set_MS_FlywheelState,
  Set_MS_FlywheelMaxSpeed,
  Set_MS_FlywheelMaxSpeedTime,
  Set_MS_FlywheelReduceSpeed,

  Set_MS_ButtonTrigger,
  Set_MS_ButtonFastTrigger,
  Set_MS_ButtonTactileFeedback,

  /*
  Set_MS_LOD(value);
  Set mouse LOD
  parameter：
  1:1mm
  2:2mm
  3:0.7mm(only sensor 3395)
  var value = 0;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_LOD,

  /*
  Set_MS_PerformanceState(value);
  Set mouse Performance State
  parameter：
  0:off
  1:on
  var value = 0;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_PerformanceState,

  /*
  Set_MS_PerformanceTime(value);
  Set mouse Performance time
  parameter：
  time = value * 10(uint 1s);
  example: 30
  var value = 3;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_PerformanceTime,

  /*
  Set_MS_Angle(value);
  Set mouse Angle snap
  parameter：
  0:off
  1:on
  var value = 0;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_Angle,

  /*
  Set_MS_Ripple(value);
  Set mouse Ripple control
  parameter：
  0:off
  1:on
  var value = 0;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_Ripple,

  /*
  Set_MS_MotionSync(value);
  Set mouse Motion Sync
  parameter：
  0:off
  1:on
  var value = 0;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_MotionSync,

  /*
  Set_MS_DPILightMode(value);
  Set mouse dpi light mode
  parameter：
  1:Steady
  2:Breathing
  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_DPILightMode,

  /*
  Set_MS_DPILightBrightness(value);
  Set mouse dpi light brightness
  parameter(1-10)：
  1:dark
  10:light
  var value = 5;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_DPILightBrightness,

  /*
  Set_MS_DPILightSpeed(value);
  Set mouse dpi light speed
  parameter(1-5)：
  1:slow
  10:fase
  var value = 5;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_DPILightSpeed,

  /*
  Set_MS_DPILightOff();
  Set mouse dpi light off

  returns:
  false:device offline
  true: device online
  */
  Set_MS_DPILightOff,

  // 灯光页
  /*
  Set_MS_LightColor(color);
  Set mouse light color
  parameter：
  example:red rgb(255,0,0)
  var value = "rgb(255,0,0)";

  returns:
  false:device offline
  true: device online
  */
  Set_MS_LightColor,

  /*
  Set_MS_LightMode(value);
  Set mouse light mode
  parameter：
  0x00: Off（speed ×，brightness ×，color ×）
  0X01: Rainbow（default）（speed √，brightness √，color ×）
  0X02: Single Color Breath（speed √，brightness √，color √）
  0X03: Fixed Color（speed ×，brightness √，color √）
  0X04: Neon（speed √，brightness √，color ×）
  0X05: Rainbow Breath（speed √，brightness √，color ×）
  0X06: Fixed Rainbow（speed √，brightness √，color ×）
  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_LightMode,

  /*
  Set_MS_LightBrightness(value);
  Set mouse light brightness
  parameter(0-9)：
  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_LightBrightness,

  /*
  Set_MS_LightSpeed(value);
  Set mouse light speed
  parameter(0-9)：
  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_LightSpeed,

  /*
  Set_MS_MovingOffState(value);
  Set mouse Turn off lights while moving
  parameter：
  0:off
  1:on
  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_MovingOffState,

  /*
  Set_MS_LightOffTime(value);
  Set mouse time until lights turn off after stationary
  parameter：
  time = value * 10(uint 1s);
  example: 30
  var value = 3;

  returns:
  false:device offline
  true: device online
  */
  Set_MS_LightOffTime,
  Set_MS_LightPowerSave,

  /*
  Set_KB_KeyFunction(system, layout, index, keyfunction)
  设置鼠标按键功能：system:["win", "mac", "iOS", "android"] layout = ["normal", "fn", "fn2"];index为按键索引
  Set keyboard keyfunction
  parameter：
  system:["win", "mac", "iOS", "android"] one of this
  layout = ["normal", "fn", "fn2"] one of this
  index: set key index
  keyFunction:

  example:esc
  var keyFunction = {
  type:KeyboardKeyFunction.Normal
  param:0x2900
  }

  returns:
  false:device offline
  true: device online
  */
  Set_KB_KeyFunction,

  /*
  Set_KB_KeyRestore(system, layout, keyfunction)
  设置鼠标按键功能：system:["win", "mac", "iOS", "android"] layout = ["normal", "fn", "fn2"];
  Set keyboard keyfunction
  parameter：
  system:["win", "mac", "iOS", "android"] one of this
  layout = ["normal", "fn", "fn2"] one of this
  keyFunctions:

  example:esc
  var keyFunction = {
  type:KeyboardKeyFunction.Normal
  param:0x2900
  }

  returns:
  false:device offline
  true: device online
  */
  Set_KB_KeyRestore,

  /*
  Set_KB_LightMode(mode);
  Set keyboard light mode
  parameter：
  
  0x00: 川流不息 （speed √，brightness √，color √）
  0x01: 飞流直下 （speed √，brightness √，color √）
  0x02: 花开四季 （speed √，brightness √，color √）
  0x03: 七彩变幻 （speed √，brightness √，color ×）
  0x04: 踏雪无痕 （speed √，brightness √，color √）
  0x05: 呼吸     （speed √，brightness √，color √）
  0x06: 正玄光波 （speed √，brightness √，color √）
  0x07: 一触即发 （speed √，brightness √，color √）
  0x08: 涟漪点点 （speed √，brightness √，color √）
  0x09: 贪吃蛇   （speed √，brightness √，color √）
  0x0A: 恒亮     （speed ×，brightness √，color √）
  0x0B: 自定义灯效 （speed √，brightness √，color √）
  0x0C: 游戏模式1 （speed √，brightness √，color √）
  0x0D: 游戏模式2 （speed √，brightness √，color √）
  0x0E: 游戏模式3 （speed √，brightness √，color √）
  0x0F: 音乐律动模式 （speed √，brightness √，color √）

  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_LightMode,

  /*
  Set_KB_LightState(state),
  Set keyboard light state
  parameter：
  state:0->off
        1->on 

  returns:
  false:device offline
  true: device online
  */
  Set_KB_LightState,

  /*
  Set_KB_OffLightTime(time),
  Set keyboard off light time
  parameter：
  time:time * 10(uint 1s);

  example:Set keyboard off light time 30 Second
  var time = 3;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_OffLightTime,

  /*
  Set_KB_LightEffectColorIndex(effect,colorIndex),
  Set keyboard light effect color index
  parameter：
  effect:0~15
  colorIndex:0~7

  example:Set keyboard light effect "呼吸" color index 4
  var Set_KB_LightEffectColorIndex(0x05,4)

  returns:
  false:device offline
  true: device online
  */
  Set_KB_LightEffectColorIndex,

  /*
  Set_KB_LightEffectSpeed(effect,speed),
  Set keyboard light effect speed
  parameter：
  effect:0~15
  speed:0~4

  example:Set keyboard light effect "呼吸" speed2
  var Set_KB_LightEffectSpeed(0x05,2)

  returns:
  false:device offline
  true: device online
  */
  Set_KB_LightEffectSpeed,

  /*
  Set_KB_LightEffectBrightness(effect,brightness),
  Set keyboard light effect brightness
  parameter：
  effect:0~15
  brightness:0~4

  example:Set keyboard light effect "呼吸" brightness 2
  var Set_KB_LightEffectBrightness(0x05,2)

  returns:
  false:device offline
  true: device online
  */
  Set_KB_LightEffectBrightness,

  /*
  Set_KB_LightEffectColor(effect,index,color);
  Set keyboard light effect  color
  parameter：
  effect:light effect
  index:color index
  color:

  example:set "呼吸" index 4 color red
  Set_KB_LightEffectColor(0x05,4,'rgb(255,0,0)');

  returns:
  false:device offline
  true: device online
  */
  Set_KB_LightEffectColor,

  /*
  Set_KB_CustomLight(index, customLight);
  Set keyboard custom light type
  parameter：
  var customLight = {
  type:0,
  streamIndex:0,//流水号
  streamListIndex:0,//流水序列号
  runningIndex:0,//流水号
  runningListIndex:0,//流水序列号 
  speed:0,
  brightness:0,
  color:'rgb(255,0,0)'      
} 

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CustomLight,

  /*
  Set_KB_CustomLightType(index, type);
  Set keyboard custom light type
  parameter：
  
  0x00: 关闭
  0x01: 流水
  0x02: 呼吸
  0x03: 常亮
  0x04: 跑马

  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CustomLightType,

  /*
  Set_KB_CustomLightStream(index, streamIndex, streamListIndex);
  Set keyboard custom light type
  parameter：

  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CustomLightStream,

  /*
    Set_KB_CustomLightRunning(index, runningIndex, runningListIndex) ;
  Set keyboard custom light type
  parameter：

  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CustomLightRunning,

  /*
  Set_KB_CustomLightSpeed(index, speed)  ;
  Set keyboard custom light type
  parameter：

  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CustomLightSpeed,

  /*
  Set_KB_CustomLightBrightness(index, brightness) ;
  Set keyboard custom light type
  parameter：

  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CustomLightBrightness,

  /*
  Set_KB_CustomLightColor(index, color) ;
  Set keyboard custom light type
  parameter：

  var value = 1;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CustomLightColor,

  Set_KB_MusicStart,
  Set_KB_GameMusicMode,
  Set_KB_GameMusicColor,

  Assemble_Keyboard_MusicData,
  Set_Device_MusicLightOFF,

  Set_Device_OfficeMusicParameter,
  Set_Device_OfficeMusicMode,
  Set_Device_OfficeMusicSpeed,
  Set_Device_OfficeMusicBrightness,
  Set_Device_OfficeMusicColorMode,
  Set_Device_OfficeMusicForegroundColor,
  Set_Device_OfficeMusicBackgroundColor,
  Set_Device_OfficeMusicAmplitude,

  Set_KB_OfficeCustomLight,
  Set_KB_OfficeCustomLightMode,
  Set_KB_OfficeCustomLightSpeed,
  Set_KB_OfficeCustomLightBrightness,
  Set_KB_OfficeCustomLightColor,
  Set_KB_OfficeCustomLightTotalRows,
  Set_KB_OfficeCustomLightRowTime,
  Set_Device_OfficeCustomLightState,
  Set_Device_OfficeCustomMacroState,

  Set_Device_MagneticMicroswitchCal,

  Set_Device_MotorParam,
  Set_Device_MotorMode,
  Set_Device_MotorLevel,
  Set_Device_MotorButton,
  Set_Device_MotorSwitches,
  Get_Device_MotorParam,
  Restore_Device_MotorParam,

  Set_Device_OLEDPicture,
  Restore_Device_OLEDPicture,
  /*
  Set_KB_ReportRate(value);
  Set keyboard ReportRate
  parameter：
  example 125Hz
  var value = 125;

  returns:
  false:device offline
  true: device online
  */
  Set_KB_ReportRate,

  /*
  Set_KB_BootAnimation(value);
  Set keyboard Boot Animation
  parameter：
  value: 0：开机动画1
         1：开机动画2(默认)

  returns:
  false:device offline
  true: device online
  */
  Set_KB_BootAnimation,

  /*
  Set_KB_BootAnimationState(value);
  Set keyboard Boot Animation State
  parameter：
  value: 1:打开开机动画(默认)  
         0：关闭开机动画

  returns:
  false:device offline
  true: device online
  */
  Set_KB_BootAnimationState,

  /*
  Set_KB_ForbidKeyFunction(value);
  Set keyboard Forbid Key Function
  parameter：
  value:  Bit0(Alt+Tab)：
            1:禁用。
            0:不禁用(默认)。
          Bit1(Alt+F4):
            1:禁用。
            0:不禁用(默认)。
          Bit2(Shift+Tab):
            1:禁用。
            0:不禁用(默认)。
          Bit3(Win):
            1:禁用。
            0:不禁用(默认)。
          Bit4(Win+APP)(20220415):
            1:禁用。
            0:不禁用(默认)。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_ForbidKeyFunction,

  /*
  Set_KB_CurrentSystem(value);
  Set keyboard Current System
  parameter：
  value:  0x00:WIN系统。
          0x01:MAC系统。
          0x02:Android 系统(预留)。
          0x03：IOS系统(预留)。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CurrentSystem,

  /*
  Set_KB_FNLockState(value);
  Set keyboard FN Lock State
  parameter：
  value:  0x00:FNLOCK off。
          0x01:FNLOCK on。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_FNLockState,

  /*
  Set_KB_FullKeyLockState(value);
  Set keyboard Full Key LockS tate
  parameter：
  value: 0x00:全键锁关闭。
         0x01:全键锁打开。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_FullKeyLockState,

  /*
  Set_KB_MusicState(value);
  Set keyboard Music State
  parameter：
  value:  音乐律动模式开关:
          00:正常灯效模式。
          01:音乐律动灯效模式。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_MusicState,

  /*
  Set_KB_ScanKeyTime(value);
  Set keyboard Scan Key Time
  parameter：
  value:  按键延时时间:
          数值:0~255(单位0.1ms)---(延时时间0~25ms)
          数值0:极速模式。
          数值50:普通模式。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_ScanKeyTime,

  /*
  Set_KB_MultikeyType(value);
  Set keyboard Multikey Type
  parameter：
  value:  0x00:全键无冲模式。
          0x01:六键无冲模式。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_MultikeyType,

  /*
  Set_KB_WASDKey(value);
  Set keyboard WASD Interchange
  parameter：
  value:  0x00:正常模式。
          0x01:WASD和方向键互换。

  returns:
  false:device offline
  true: device online
  */
  Set_KB_WASDKey,

  /*
  Set_KB_Macro(index,macro);
  Set keyboard key to macro
  parameter：
  index:current set key index
  macro:

  returns:
  false:device offline
  true: device online
  */
  Set_KB_Macro,

  /*
  Set_KB_CRC();
  Set keyboard crc before usb exit
  parameter：

  returns:
  false:device offline
  true: device online
  */
  Set_KB_CRC,

  /*
  Restore_KB_Macro(index);
  Restore keyboard key(index) macro
  parameter：
  index:current set key index

  returns:
  false:device offline
  true: device online
  */
  Restore_KB_Macro,

  Import_KB_Profile,
  /*
  Get_Device_Info();
  Set device info

  returns:
  info = {
  cid:1,
  mid:1
  type:1
  }
  cid:customer id
  mid:moudle id
  type:
  0:dongle 1K, 
  1:dongle 4K, 
  2:wired 1K  
  3:wired 8K 
  4:dongle 2K 
  5:dongle 8K  
  14 蓝牙
  */
  Get_Device_Info,

  Set_PC_Satae,

  Get_Device_Battery,
  Set_Pair_CID,
  /*
  Set_Device_EnterPairMode();
  Set device enter pair mode
  */
  Set_Device_EnterPairMode,

  /*
  Get_Device_PairResult();
  Get device pair result
  */
  Get_Device_PairResult,

  /*
  Device_Restore();
  Set device Restore
  */
  Device_Restore,

  Set_Device_EnterUpgrade,
  Set_Device_ExitUpgrade,

  /*
  Set_Device_Profile(value);
  Set device Profile
  parameter:(0-3,some mcu not support)

  var value = 1;
  */
  Set_Device_Profile,

  /*
  Set_Device_LongDistance(value);
  Set device Long Distance
  parameter:
  0:off
  1:on
  var value = 1;
  */
  Set_Device_LongDistance,

  Set_Device_4KDongleRGBMode,
  Set_Device_4KDongleRGBColor,
  Set_Device_LightMode,
  Set_Device_LightColor,
  Set_Device_LightSpeed,
  Set_Device_LightBrightness,
  Set_Device_LightTime,

  Set_Dongle_3RGBMode,

  Index_To_DPILightBrightness,
  DPILightBrightness_To_Index,

  /*
  Set_Visit_Mode(value);
  Set driver visit mode
  parameter:
  0:off
  1:on
  var value = 1;
  */
  Set_Visit_Mode,

  Update_Device_Param,
  Set_DriverOnline,
  Get_ConnectDevice_Info,

  Device_Remember,
  Get_Device_Online_With_Dialog,

  /*fllowing is parameter */
  /*device flash data */
  flashData,
  /*device information */
  deviceInfo,
  /*device pair result */
  pairResult,
  /*current device pid */
  devicePID,
  /*driver visit mode */
  visit,
  driverOnlineFlag,
  historyDevicesInfos,
  hidDeviceChangeEvent,

  detectDpiEepromType,
  refreshMouseDpiFromFlash,
  dpiLayoutIs3955,

  /*fllowing is define */
  DevicePairResult,
  MouseKeyFunction,
  KeyboardKeyFunction,
  DeviceConectState,

  //音乐律动
  keyboardMusicStart,
  Set_KB_MusicStop,
  musicObject,
}