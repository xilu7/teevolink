import { computed } from "vue";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { applySensorConfig, loadSensorCatalog } from "./useSensorCatalog.js";

let hidListenersRegistered = false;

const VENDOR_ID = HID_FILTERS[0]?.vendorId ?? 0x3554;
const REPORT_ID = 0x08;

export function useDevice() {
  const connected = computed(
    () => HID.deviceInfo.connectState === HID.DeviceConectState.Connected
  );
  const connecting = computed(
    () => HID.deviceInfo.connectState === HID.DeviceConectState.Connecting
  );
  const deviceOpen = computed(() => HID.deviceInfo.deviceOpen);
  const online = computed(() => HID.deviceInfo.online === 1 || HID.deviceInfo.online === true);
  const battery = computed(() => HID.deviceInfo.battery);
  const mouseCfg = computed(() => HID.deviceInfo.mouseCfg);
  const isWired = computed(() => HID.deviceInfo.isWired);

  const isReady = computed(() => deviceOpen.value && connected.value);

  const isAwaitingMouse = computed(
    () => deviceOpen.value && !connected.value && !connecting.value
  );

  const dongleTypeLabel = computed(() => {
    const t = HID.deviceInfo.info?.type;
    const map = {
      0: "1K 接收器",
      1: "4K 接收器",
      2: "有线 1K",
      3: "有线 8K",
      4: "2K 接收器",
      5: "8K 接收器",
    };
    return map[t] ?? `类型 ${t ?? "?"}`;
  });

  async function init() {
    await loadSensorCatalog();
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

  function findHidDevice(devices) {
    return (
      devices.find((d) => {
        if (d.vendorId !== VENDOR_ID) return false;
        return d.collections?.some(
          (c) =>
            c.inputReports?.length === 1 &&
            c.outputReports?.length === 1 &&
            c.outputReports[0].reportId === REPORT_ID
        );
      }) ?? null
    );
  }

  async function getAuthorizedDevice() {
    if (typeof navigator === "undefined" || !navigator.hid?.getDevices) return null;
    return findHidDevice(await navigator.hid.getDevices());
  }

  async function waitUntilReady(timeoutMs = 45000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
        applySensorConfig();
        return true;
      }
      await sleep(200);
    }
    return HID.deviceInfo.connectState === HID.DeviceConectState.Connected;
  }

  /**
   * 用 SDK 导出的 Get_Current_Device_Online 检测鼠标是否上线（无线必做）
   * 未上线时不要调用 Update_Device_Param，否则会卡在「同步中」
   */
  async function pollMouseOnline(maxSeconds = 60) {
    const dev = await getAuthorizedDevice();
    if (!dev) return false;

    for (let i = 0; i < maxSeconds; i++) {
      try {
        const isOn = await HID.Get_Current_Device_Online(dev);
        if (isOn) {
          await HID.Device_Connect();
          if (await waitUntilReady(45000)) return true;
        }
      } catch (e) {
        console.warn("pollMouseOnline", e);
      }
      await sleep(1000);
    }
    return false;
  }

  async function resumeAuthorizedDevice() {
    const dev = await getAuthorizedDevice();
    if (!dev) return false;

    try {
      await HID.Device_Reconnect(dev);
      return pollMouseOnline(45);
    } catch (e) {
      console.warn("resumeAuthorizedDevice", e);
      return false;
    }
  }

  /** 卡在 Connecting 时：关闭再重连（不修改 SDK 的补救） */
  async function recoverStuckSession() {
    try {
      await HID.Device_Close();
    } catch (e) {
      console.warn("Device_Close", e);
    }
    await sleep(600);
    await init();
    return resumeAuthorizedDevice();
  }

  async function ensureReady() {
    if (!HID.deviceInfo.deviceOpen) return false;
    if (connected.value) return true;

    if (connecting.value) {
      const ok = await waitUntilReady(5000);
      if (ok) return true;
      return recoverStuckSession();
    }

    await HID.Device_Connect();
    if (await waitUntilReady(8000)) return true;

    return pollMouseOnline(15);
  }

  async function connect() {
    await init();
    const ok = await HID.Request_Device(HID_FILTERS);
    if (!ok) return false;

    HID.Device_Remember("mouse", { product: PRODUCT.name });
    await sleep(400);

    if (await pollMouseOnline(90)) return true;

    return false;
  }

  async function disconnect() {
    await HID.Device_Close();
  }

  async function refresh() {
    if (!HID.deviceInfo.deviceOpen) return false;
    await init();

    if (connecting.value) {
      const recovered = await recoverStuckSession();
      return recovered;
    }

    if (connected.value) {
      applySensorConfig();
      try {
        await HID.Update_Device_Param();
        return true;
      } catch (e) {
        console.error("refresh Update_Device_Param", e);
        return recoverStuckSession();
      }
    }

    return pollMouseOnline(60);
  }

  async function bootDevicePage() {
    await init();
    if (!HID.deviceInfo.deviceOpen) return false;
    if (connected.value) {
      applySensorConfig();
      return true;
    }
    if (connecting.value) return recoverStuckSession();
    return pollMouseOnline(30);
  }

  async function enterPairMode() {
    const dev = await getAuthorizedDevice();
    if (!dev) return false;
    try {
      await HID.Device_Reconnect(dev);
      await HID.Set_Device_EnterPairMode();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
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
    dongleTypeLabel,
    deviceInfo: HID.deviceInfo,
    connect,
    disconnect,
    refresh,
    ensureReady,
    bootDevicePage,
    pollMouseOnline,
    recoverStuckSession,
    enterPairMode,
    getAuthorizedDevice,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
