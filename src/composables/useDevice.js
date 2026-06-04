import { computed } from "vue";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { applySensorConfig, ensureSensorConfig, syncDpiSensorFromFlash } from "./useSensorCatalog.js";

let hidListenersRegistered = false;

const VENDOR_ID = HID_FILTERS[0]?.vendorId ?? 0x3554;
const DONGLE_PIDS = [0xf523, 0xf516];
const REPORT_ID = 0x08;

const STATE_LABEL = {
  [HID.DeviceConectState.Disconnected]: "断开",
  [HID.DeviceConectState.Connecting]: "同步中",
  [HID.DeviceConectState.Connected]: "已连接",
  [HID.DeviceConectState.TimeOut]: "超时",
};

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

  const connectStateLabel = computed(
    () => STATE_LABEL[HID.deviceInfo.connectState] ?? "未知"
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
    await ensureSensorConfig(PRODUCT.sensorType);
    HID.deviceInfo.type = "mouse";
    HID.visit = false;
    /** 工厂注释：网页驱动 Set_PC_Satae 暂时不用，避免多余指令干扰 */
    HID.Set_DriverOnline(false);
    registerHidListeners();
  }

  function registerHidListeners() {
    if (hidListenersRegistered || typeof navigator === "undefined" || !navigator.hid) return;
    HID.Add_Listen_HID_Events();
    hidListenersRegistered = true;
  }

  function isValidHidInterface(device) {
    return device.collections?.some(
      (c) =>
        c.inputReports?.length === 1 &&
        c.outputReports?.length === 1 &&
        c.outputReports[0].reportId === REPORT_ID
    );
  }

  function scoreHidDevice(d) {
    if (d.vendorId !== VENDOR_ID || !isValidHidInterface(d)) return -1;
    let score = 0;
    if (DONGLE_PIDS.includes(d.productId)) score += 100;
    const name = (d.productName || "").toLowerCase();
    if (/rapid|sync|terra|teevo|8k/i.test(name)) score += 50;
    return score;
  }

  function findHidDevice(devices) {
    const ranked = devices
      .map((d) => ({ d, score: scoreHidDevice(d) }))
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score);
    return ranked[0]?.d ?? null;
  }

  async function getAuthorizedDevice() {
    if (typeof navigator === "undefined" || !navigator.hid?.getDevices) return null;
    return findHidDevice(await navigator.hid.getDevices());
  }

  async function pickDeviceFromHistory() {
    try {
      const history = await HID.Get_HistoryDevicesInfo();
      if (!history?.length) return null;
      const best =
        history.find((h) => h.online && h.device) ||
        history.find((h) => h.device) ||
        null;
      return best?.device ?? null;
    } catch (e) {
      console.warn("pickDeviceFromHistory", e);
      return null;
    }
  }

  async function waitUntilReady(timeoutMs = 35000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
        await syncDpiSensorFromFlash();
        return true;
      }
      if (HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut) {
        return false;
      }
      await sleep(200);
    }
    return HID.deviceInfo.connectState === HID.DeviceConectState.Connected;
  }

  /** 工厂标准：Reconnect → Device_Connect（启动 Get_Online_Interval） */
  async function startHidSession(dev) {
    const target = dev ?? (await getAuthorizedDevice()) ?? (await pickDeviceFromHistory());
    if (!target) return false;
    try {
      applySensorConfig(PRODUCT.sensorType);
      await HID.Device_Reconnect(target);
      const online = await HID.Get_Current_Device_Online(target);
      if (!online) return !!HID.deviceInfo.deviceOpen;
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
      const flag = await HID.Get_Current_Device_Online(dev);
      return flag === true || flag === 1 || HID.deviceInfo.online === 1;
    } catch (e) {
      console.warn("checkMouseOnline", e);
      return false;
    }
  }

  /** 卡在「同步中」时：工厂 Device_Close → 重置状态 → Reconnect → Connect */
  async function recoverStuckSession() {
    try {
      await HID.Device_Close();
    } catch (e) {
      console.warn("Device_Close", e);
    }
    await sleep(700);
    HID.deviceInfo.connectState = HID.DeviceConectState.Disconnected;
    await init();
    return startHidSession();
  }

  /**
   * 安静等待 SDK 变为 Connected（不反复 Device_Connect / recover，避免界面闪烁）
   */
  async function finishConnect(maxMs = 45000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
        await syncDpiSensorFromFlash();
        return true;
      }
      if (HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut) {
        return false;
      }
      await sleep(350);
    }
    return HID.deviceInfo.connectState === HID.DeviceConectState.Connected;
  }

  function isStuckConnecting() {
    return (
      HID.deviceInfo.connectState === HID.DeviceConectState.Connecting ||
      HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut
    );
  }

  /** 用户点「同步 / 重新同步」 */
  async function syncDevice() {
    await init();

    if (isStuckConnecting()) {
      await recoverStuckSession();
    } else if (!HID.deviceInfo.deviceOpen) {
      if (!(await startHidSession())) return false;
    }

    if (connected.value) {
      await syncDpiSensorFromFlash();
      return true;
    }

    if (!(await checkMouseOnline())) return false;

    if (!isStuckConnecting()) {
      try {
        await HID.Device_Connect();
      } catch (e) {
        console.warn("syncDevice Device_Connect", e);
      }
    }

    return finishConnect(16000);
  }

  /** @deprecated 内部改用 finishConnect，保留兼容 */
  async function waitForMouseReady(maxSeconds = 16) {
    return finishConnect(maxSeconds * 1000);
  }

  async function pollMouseOnline(maxSeconds = 60) {
    return waitForMouseReady(maxSeconds);
  }

  async function openAuthorizedSession() {
    const r = await autoConnectFromFactory();
    return r.hasAuth && HID.deviceInfo.deviceOpen;
  }

  async function ensureReady() {
    if (!HID.deviceInfo.deviceOpen) {
      if (!(await startHidSession())) return false;
    }
    if (connected.value) return true;

    if (connecting.value) {
      const ok = await waitUntilReady(8000);
      if (ok) return true;
      await recoverStuckSession();
      if (!(await checkMouseOnline())) return false;
      await HID.Device_Connect();
      return await waitUntilReady(12000);
    }

    const isOn = await checkMouseOnline();
    if (!isOn) return false;

    await HID.Device_Connect();
    return await waitUntilReady(12000);
  }

  /**
   * 工厂「再次进入」流程：Get_HistoryDevicesInfo → Device_Reconnect → Device_Connect
   * 不调用 Request_Device，用户无需再次点弹窗。
   */
  async function autoConnectFromFactory(opts = {}) {
    const silent = opts.silent === true;
    const onPhase = silent ? null : opts.onPhase;
    await init();

    onPhase?.("正在恢复已授权设备…");
    const history = await HID.Get_HistoryDevicesInfo();
    const dev =
      (await getAuthorizedDevice()) ??
      history?.find((h) => h.online && h.device)?.device ??
      history?.[0]?.device ??
      null;

    if (!dev) {
      return {
        status: "need_request",
        ready: false,
        hasAuth: false,
        message: "尚未授权。请点击「连接设备」并选择 RapidSync",
      };
    }

    onPhase?.("Device_Reconnect…");
    await HID.Device_Reconnect(dev);

    onPhase?.("Device_Connect…");
    await HID.Device_Connect();

    if (!HID.deviceInfo.deviceOpen) {
      return {
        status: "failed",
        ready: false,
        hasAuth: false,
        message: "接收器打开失败，请重新插拔 USB",
      };
    }

    const historyOnline = history?.some((h) => h.online);
    if (historyOnline || (await checkMouseOnline())) {
      if (!isStuckConnecting()) {
        try {
          await HID.Device_Connect();
        } catch (e) {
          console.warn("autoConnect Device_Connect", e);
        }
      }
      const ms = opts.quick ? 6000 : 12000;
      const ready = await finishConnect(ms);
      return {
        status: ready ? "ready" : "authorized",
        ready,
        hasAuth: true,
        message: ready ? "已自动连接" : "接收器已就绪，请点「重新同步」",
      };
    }

    return {
      status: "authorized",
      ready: false,
      hasAuth: true,
      message: "接收器已连接。请 2.4G 模式唤醒鼠标",
    };
  }

  /** 工厂「首次连接」：Request_Device → Remember → Reconnect → Connect */
  async function connect(opts = {}) {
    const onPhase = opts.onPhase;
    await init();

    onPhase?.("Request_Device：请选择 RapidSync…");
    const picked = await HID.Request_Device(HID_FILTERS);
    if (!picked) {
      return {
        status: "cancelled",
        ready: false,
        hasAuth: false,
        message: "已取消。请插入接收器后重试",
      };
    }

    HID.Device_Remember("mouse", { product: PRODUCT.name });
    await sleep(400);

    const dev = await getAuthorizedDevice();
    if (!dev) {
      return {
        status: "failed",
        ready: false,
        hasAuth: false,
        message: "未识别 RapidSync，请重新插拔后重试",
      };
    }

    onPhase?.("Device_Reconnect…");
    await HID.Device_Reconnect(dev);

    onPhase?.("Device_Connect…");
    await HID.Device_Connect();

    if (!HID.deviceInfo.deviceOpen) {
      return {
        status: "failed",
        ready: false,
        hasAuth: false,
        message: "接收器打开失败",
      };
    }

    if (!(await checkMouseOnline())) {
      return {
        status: "authorized",
        ready: false,
        hasAuth: true,
        message: "已授权接收器。请 2.4G 档打开电源并晃动鼠标，再点重新同步",
      };
    }

    if (!isStuckConnecting()) {
      try {
        await HID.Device_Connect();
      } catch (e) {
        console.warn("connect Device_Connect", e);
      }
    }

    const ready = await finishConnect(16000);

    return {
      status: ready ? "ready" : "authorized",
      ready,
      hasAuth: true,
      message: ready ? "连接成功" : "接收器已就绪，请 2.4G 唤醒后点重新同步",
    };
  }

  async function disconnect() {
    await HID.Device_Close();
  }

  async function refresh() {
    return syncDevice();
  }

  async function bootDevicePage() {
    await init();
    if (!(await startHidSession())) return false;
    if (connected.value) {
      await syncDpiSensorFromFlash();
      return true;
    }
    if (await checkMouseOnline() && !isStuckConnecting()) {
      await HID.Device_Connect();
    }
    return finishConnect(16000);
  }

  async function enterPairMode() {
    if (!(await startHidSession())) return false;
    try {
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
    connectStateLabel,
    dongleTypeLabel,
    deviceInfo: HID.deviceInfo,
    connect,
    autoConnectFromFactory,
    openAuthorizedSession,
    disconnect,
    refresh,
    syncDevice,
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
