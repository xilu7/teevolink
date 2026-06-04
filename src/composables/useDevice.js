import { computed } from "vue";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { applySensorConfig, loadSensorCatalog } from "./useSensorCatalog.js";

let hidListenersRegistered = false;

const VENDOR_ID = HID_FILTERS[0]?.vendorId ?? 0x3554;
const DONGLE_PID = 0xf516;
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
    if (d.productId === DONGLE_PID) score += 100;
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

  /** 工厂标准：Reconnect → Device_Connect（启动 Get_Online_Interval） */
  async function startHidSession(dev) {
    const target = dev ?? (await getAuthorizedDevice()) ?? (await pickDeviceFromHistory());
    if (!target) return false;
    try {
      await HID.Device_Reconnect(target);
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

  async function waitForMouseReady(maxSeconds = 25, onTick) {
    if (
      HID.deviceInfo.connectState === HID.DeviceConectState.Connecting ||
      HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut
    ) {
      const quick = await waitUntilReady(8);
      if (quick) {
        applySensorConfig();
        return true;
      }
      await recoverStuckSession();
    }

    if (!HID.deviceInfo.deviceOpen) {
      if (!(await startHidSession())) return false;
    }

    if (connected.value) {
      applySensorConfig();
      return true;
    }

    let recovered = false;
    let lastUiTick = 0;
    for (let i = 0; i < maxSeconds; i++) {
      if (onTick && (i === 0 || Date.now() - lastUiTick > 2800)) {
        onTick(i + 1, maxSeconds);
        lastUiTick = Date.now();
      }
      if (connected.value) {
        applySensorConfig();
        return true;
      }

      if (
        !recovered &&
        i >= 10 &&
        HID.deviceInfo.connectState === HID.DeviceConectState.Connecting
      ) {
        recovered = true;
        await recoverStuckSession();
      }

      if (HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut) {
        await recoverStuckSession();
        recovered = true;
      }

      const isOn = await checkMouseOnline();
      if (
        isOn &&
        HID.deviceInfo.connectState !== HID.DeviceConectState.Connecting
      ) {
        try {
          await HID.Device_Connect();
        } catch (e) {
          console.warn("waitForMouseReady Device_Connect", e);
        }
      }

      if (await waitUntilReady(2000)) return true;
      await sleep(1000);
    }
    return connected.value;
  }

  /** 用户点「同步设备 / 立即连接」— 带超时，避免一直「正在连接」 */
  async function syncDevice(maxSeconds = 22) {
    await init();

    if (
      connecting.value ||
      HID.deviceInfo.connectState === HID.DeviceConectState.Connecting ||
      HID.deviceInfo.connectState === HID.DeviceConectState.TimeOut
    ) {
      await recoverStuckSession();
    } else if (!HID.deviceInfo.deviceOpen) {
      if (!(await startHidSession())) return false;
    }

    if (connected.value) {
      applySensorConfig();
      return true;
    }

    if (!(await checkMouseOnline())) return false;

    if (HID.deviceInfo.connectState !== HID.DeviceConectState.Connecting) {
      await HID.Device_Connect();
    }

    return waitForMouseReady(maxSeconds);
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
      if (opts.quick) {
        onPhase?.("正在同步参数…");
        const ready = await waitUntilReady(8000);
        if (ready) applySensorConfig();
        return {
          status: ready ? "ready" : "authorized",
          ready,
          hasAuth: true,
          message: ready ? "已自动连接" : "接收器已就绪，请点「重新同步」",
        };
      }
      onPhase?.("等待参数同步…");
      const ready = await waitForMouseReady(opts.maxSeconds ?? 18);
      return {
        status: ready ? "ready" : "authorized",
        ready,
        hasAuth: true,
        message: ready ? "已自动连接" : "接收器已就绪，请唤醒鼠标",
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

    const ready = await waitForMouseReady(opts.maxSeconds ?? 18);

    return {
      status: ready ? "ready" : "authorized",
      ready,
      hasAuth: true,
      message: ready
        ? "连接成功"
        : "已授权。请 2.4G + 唤醒鼠标，稍后会自动同步",
    };
  }

  async function disconnect() {
    await HID.Device_Close();
  }

  async function refresh() {
    return syncDevice(22);
  }

  async function bootDevicePage() {
    await init();
    const history = await HID.Get_HistoryDevicesInfo();
    if (history?.length) {
      const entry = history.find((h) => h.online) || history[0];
      if (entry?.device) {
        await HID.Device_Reconnect(entry.device);
        if (entry.online) {
          await HID.Device_Connect();
          if (await waitUntilReady(20000)) {
            applySensorConfig();
            return true;
          }
        }
      }
    }
    if (!HID.deviceInfo.deviceOpen) {
      if (!(await startHidSession())) return false;
    }
    await HID.Device_Connect();
    return waitForMouseReady(25);
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
