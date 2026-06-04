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
  async function pollMouseOnline(maxSeconds = 60, readyTimeoutMs = 12000) {
    const dev = await getAuthorizedDevice();
    if (!dev) return false;

    for (let i = 0; i < maxSeconds; i++) {
      try {
        const isOn = await HID.Get_Current_Device_Online(dev);
        if (isOn) {
          await HID.Device_Connect();
          if (await waitUntilReady(readyTimeoutMs)) return true;
        }
      } catch (e) {
        console.warn("pollMouseOnline", e);
      }
      await sleep(1000);
    }
    return false;
  }

  /** 浏览器已授权过接收器时，直接恢复会话（不进首页长等待） */
  async function openAuthorizedSession() {
    await init();
    const dev = await getAuthorizedDevice();
    if (!dev) return false;
    try {
      await HID.Device_Reconnect(dev);
      return !!HID.deviceInfo.deviceOpen;
    } catch (e) {
      console.warn("openAuthorizedSession", e);
      return false;
    }
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

    const dev = await getAuthorizedDevice();
    if (!dev) return false;

    try {
      const isOn = await HID.Get_Current_Device_Online(dev);
      if (!isOn) return false;
    } catch (e) {
      console.warn("ensureReady online check", e);
      return false;
    }

    if (connecting.value) {
      return await waitUntilReady(6000);
    }

    try {
      await HID.Device_Connect();
    } catch (e) {
      console.warn("ensureReady Device_Connect", e);
    }
    if (await waitUntilReady(6000)) return true;

    return pollMouseOnline(5, 6000);
  }

  /**
   * @param {{ onPhase?: (msg: string) => void, maxPollSeconds?: number }} [opts]
   * @returns {Promise<{ status: 'ready'|'authorized'|'cancelled'|'failed', ready: boolean, message: string }>}
   */
  async function connect(opts = {}) {
    const onPhase = opts.onPhase;

    onPhase?.("请在弹窗中选择 RapidSync…");
    await init();

    const picked = await HID.Request_Device(HID_FILTERS);
    if (!picked) {
      return { status: "cancelled", ready: false, message: "已取消选择设备" };
    }

    HID.Device_Remember("mouse", { product: PRODUCT.name });
    await sleep(200);

    const dev = await getAuthorizedDevice();
    if (!dev) {
      return {
        status: "failed",
        ready: false,
        message: "未识别到接收器。请重新插拔 USB 后再试",
      };
    }

    onPhase?.("正在进入驱动…");
    try {
      await HID.Device_Reconnect(dev);
    } catch (e) {
      console.warn("Device_Reconnect", e);
    }

    // 首页不等待鼠标上线、不调用 Device_Connect（避免卡在 Connecting）
    return {
      status: "authorized",
      ready: connected.value,
      message: "已进入驱动。唤醒鼠标后点「同步设备」即可改 DPI",
    };
  }

  async function disconnect() {
    await HID.Device_Close();
  }

  async function refresh() {
    if (!HID.deviceInfo.deviceOpen) return false;
    await init();

    const dev = await getAuthorizedDevice();
    if (dev) {
      try {
        await HID.Device_Reconnect(dev);
      } catch (e) {
        console.warn("refresh reconnect", e);
      }
    }

    if (connecting.value) {
      try {
        await HID.Device_Close();
        await sleep(500);
        if (dev) await HID.Device_Reconnect(dev);
        await HID.Device_Connect();
      } catch (e) {
        console.warn("refresh connecting", e);
      }
      return await waitUntilReady(12000);
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
    if (connecting.value) {
      try {
        await HID.Device_Close();
        await sleep(400);
        const dev = await getAuthorizedDevice();
        if (dev) await HID.Device_Reconnect(dev);
      } catch (e) {
        console.warn("bootDevicePage connecting", e);
      }
      return false;
    }
    return pollMouseOnline(8, 6000);
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
    openAuthorizedSession,
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
