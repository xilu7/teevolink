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

  async function waitUntilReady(timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
        applySensorConfig();
        return true;
      }
      if (HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut) {
        return false;
      }
      await sleep(200);
    }
    return HID.deviceInfo.connectState === HID.DeviceConectState.Connected;
  }

  /** 重连接收器并启动 SDK 在线轮询（Get_Online_Interval） */
  async function startHidSession() {
    const dev = await getAuthorizedDevice();
    if (!dev) return false;
    try {
      await HID.Device_Reconnect(dev);
      await HID.Device_Connect();
      return !!HID.deviceInfo.deviceOpen;
    } catch (e) {
      console.warn("startHidSession", e);
      return false;
    }
  }

  async function checkMouseOnline() {
    const dev = await getAuthorizedDevice();
    if (!dev) return false;
    try {
      return await HID.Get_Current_Device_Online(dev);
    } catch (e) {
      console.warn("checkMouseOnline", e);
      return false;
    }
  }

  /**
   * 等待鼠标上线并完成参数同步（依赖 SDK Device_Connect → Get_Online_Interval）
   */
  async function waitForMouseReady(maxSeconds = 45) {
    if (!HID.deviceInfo.deviceOpen) {
      const ok = await startHidSession();
      if (!ok) return false;
    }

    if (connected.value) {
      applySensorConfig();
      return true;
    }

    for (let i = 0; i < maxSeconds; i++) {
      if (connected.value) {
        applySensorConfig();
        return true;
      }
      if (HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut) {
        return false;
      }

      const isOn = await checkMouseOnline();
      if (isOn && !connecting.value) {
        try {
          await HID.Device_Connect();
        } catch (e) {
          console.warn("waitForMouseReady Device_Connect", e);
        }
        if (await waitUntilReady(20000)) return true;
      }

      await sleep(1000);
    }
    return connected.value;
  }

  /** @deprecated 保留别名 */
  async function pollMouseOnline(maxSeconds = 45, readyTimeoutMs = 20000) {
    await startHidSession();
    return waitForMouseReady(maxSeconds);
  }

  async function openAuthorizedSession() {
    await init();
    return startHidSession();
  }

  async function recoverStuckSession() {
    try {
      await HID.Device_Close();
    } catch (e) {
      console.warn("Device_Close", e);
    }
    await sleep(800);
    await init();
    return startHidSession();
  }

  async function ensureReady() {
    if (!HID.deviceInfo.deviceOpen) return false;
    if (connected.value) return true;

    if (connecting.value) {
      return await waitUntilReady(12000);
    }

    const isOn = await checkMouseOnline();
    if (!isOn) return false;

    try {
      await HID.Device_Connect();
    } catch (e) {
      console.warn("ensureReady Device_Connect", e);
    }
    return await waitUntilReady(12000);
  }

  async function connect(opts = {}) {
    const onPhase = opts.onPhase;
    onPhase?.("请在弹窗中选择 RapidSync…");
    await init();

    const picked = await HID.Request_Device(HID_FILTERS);
    if (!picked) {
      return { status: "cancelled", ready: false, message: "已取消选择设备" };
    }

    HID.Device_Remember("mouse", { product: PRODUCT.name });
    await sleep(300);

    onPhase?.("正在打开接收器…");
    const sessionOk = await startHidSession();
    if (!sessionOk) {
      return {
        status: "failed",
        ready: false,
        message: "未识别到接收器。请重新插拔 USB 后再试",
      };
    }

    onPhase?.("正在检测鼠标…");
    const ready = await waitForMouseReady(12);
    return {
      status: ready ? "ready" : "authorized",
      ready,
      message: ready
        ? "已连接，可以修改 DPI"
        : "接收器已就绪。请唤醒鼠标后点「同步设备」",
    };
  }

  async function disconnect() {
    await HID.Device_Close();
  }

  /** 用户点击「同步设备」 */
  async function refresh() {
    if (!HID.deviceInfo.deviceOpen) {
      const ok = await startHidSession();
      if (!ok) return false;
    } else {
      await init();
      if (connecting.value) {
        try {
          await HID.Device_Close();
          await sleep(600);
        } catch (e) {
          console.warn("refresh close", e);
        }
      }
      await startHidSession();
    }

    if (connected.value) {
      applySensorConfig();
      return true;
    }

    return waitForMouseReady(40);
  }

  async function bootDevicePage() {
    await init();
    if (!HID.deviceInfo.deviceOpen) return false;
    if (connected.value) {
      applySensorConfig();
      return true;
    }
    await startHidSession();
    if (connected.value) {
      applySensorConfig();
      return true;
    }
    return waitForMouseReady(20);
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
    waitForMouseReady,
    checkMouseOnline,
    startHidSession,
    recoverStuckSession,
    enterPairMode,
    getAuthorizedDevice,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
