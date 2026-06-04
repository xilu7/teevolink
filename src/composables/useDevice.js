import { computed } from "vue";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { applySensorConfig, loadSensorCatalog } from "./useSensorCatalog.js";

let hidListenersRegistered = false;

export function useDevice() {
  const connected = computed(
    () => HID.deviceInfo.connectState === HID.DeviceConectState.Connected
  );
  const connecting = computed(
    () => HID.deviceInfo.connectState === HID.DeviceConectState.Connecting
  );
  const deviceOpen = computed(() => HID.deviceInfo.deviceOpen);
  const online = computed(() => HID.deviceInfo.online);
  const battery = computed(() => HID.deviceInfo.battery);
  const mouseCfg = computed(() => HID.deviceInfo.mouseCfg);
  const isWired = computed(() => HID.deviceInfo.isWired);

  /** 可以下发 DPI/改键等命令 */
  const isReady = computed(() => deviceOpen.value && connected.value);

  /** 已授权 HID，但鼠标尚未与接收器/主机建立会话 */
  const isAwaitingMouse = computed(
    () => deviceOpen.value && !connected.value && !connecting.value
  );

  async function init() {
    await loadSensorCatalog();
    applySensorConfig();
    HID.deviceInfo.type = "mouse";
    HID.visit = false;
    HID.Set_DriverOnline(true);
    registerHidListeners();
  }

  function registerHidListeners() {
    if (hidListenersRegistered || typeof navigator === "undefined" || !navigator.hid) return;
    HID.Add_Listen_HID_Events();
    hidListenersRegistered = true;
  }

  /** 按 SDK 流程：Device_Connect → 等待 Get_Online_Interval 完成 */
  async function waitUntilReady(timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
        return true;
      }
      await sleep(200);
    }
    return HID.deviceInfo.connectState === HID.DeviceConectState.Connected;
  }

  /** 尝试用已授权的 HID 设备恢复会话（刷新页面后） */
  async function resumeAuthorizedDevice() {
    if (typeof navigator === "undefined" || !navigator.hid?.getDevices) return false;

    const devices = await navigator.hid.getDevices();
    const candidates = devices.filter((d) => {
      if (d.vendorId !== HID_FILTERS[0]?.vendorId) return false;
      return d.collections?.some(
        (c) =>
          c.inputReports?.length === 1 &&
          c.outputReports?.length === 1 &&
          c.outputReports[0].reportId === 0x08
      );
    });

    for (const d of candidates) {
      try {
        await HID.Device_Reconnect(d);
        await HID.Device_Connect();
        if (await waitUntilReady(25000)) {
          applySensorConfig();
          return true;
        }
      } catch (e) {
        console.warn("resumeAuthorizedDevice", e);
      }
    }
    return false;
  }

  /**
   * 确保鼠标在线且 flash 已读取 — 所有写操作前应调用
   * 不修改 SDK，仅重复调用已导出的 Device_Connect / Update_Device_Param
   */
  async function ensureReady() {
    if (!HID.deviceInfo.deviceOpen) return false;

    if (connected.value) return true;

    await HID.Device_Connect();
    if (await waitUntilReady(8000)) {
      applySensorConfig();
      return true;
    }

    return false;
  }

  async function connect() {
    await init();
    const ok = await HID.Request_Device(HID_FILTERS);
    if (!ok) return false;

    HID.Device_Remember("mouse", { product: PRODUCT.name });
    await HID.Device_Connect();

    if (await waitUntilReady(35000)) {
      applySensorConfig();
      return true;
    }
    return false;
  }

  async function disconnect() {
    await HID.Device_Close();
  }

  /** 从设备同步 — 指南中的标准流程 */
  async function refresh() {
    if (!HID.deviceInfo.deviceOpen) return false;
    await init();
    await HID.Device_Connect();

    if (!(await waitUntilReady(20000))) {
      const resumed = await resumeAuthorizedDevice();
      if (!resumed) return false;
    }

    applySensorConfig();
    try {
      await HID.Update_Device_Param();
      return connected.value;
    } catch (e) {
      console.error("refresh", e);
      return false;
    }
  }

  async function bootDevicePage() {
    await init();
    if (!HID.deviceInfo.deviceOpen) return false;

    if (connected.value) {
      applySensorConfig();
      return true;
    }

    await HID.Device_Connect();
    if (await waitUntilReady(15000)) {
      applySensorConfig();
      return true;
    }

    return resumeAuthorizedDevice();
  }

  return {
    HID,
    PRODUCT,
    connected,
    connecting,
    deviceOpen,
    isReady,
    isAwaitingMouse,
    online,
    battery,
    mouseCfg,
    isWired,
    deviceInfo: HID.deviceInfo,
    connect,
    disconnect,
    refresh,
    ensureReady,
    bootDevicePage,
    waitUntilReady,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function waitForConnected(timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
        resolve(true);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        resolve(false);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}
