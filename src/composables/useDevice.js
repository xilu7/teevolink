import { computed } from "vue";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { applySensorConfig, loadSensorCatalog } from "./useSensorCatalog.js";

export function useDevice() {
  const connected = computed(
    () => HID.deviceInfo.connectState === HID.DeviceConectState.Connected
  );
  const connecting = computed(
    () => HID.deviceInfo.connectState === HID.DeviceConectState.Connecting
  );
  const online = computed(() => HID.deviceInfo.online);
  const battery = computed(() => HID.deviceInfo.battery);
  const mouseCfg = computed(() => HID.deviceInfo.mouseCfg);
  const isWired = computed(() => HID.deviceInfo.isWired);

  async function init() {
    await loadSensorCatalog();
    applySensorConfig();
    HID.deviceInfo.type = "mouse";
    HID.visit = false;
    HID.Set_DriverOnline(true);
  }

  async function connect() {
    await init();
    const ok = await HID.Request_Device(HID_FILTERS);
    if (!ok) return false;
    HID.Device_Remember("mouse", { product: PRODUCT.name });
    await HID.Device_Connect();
    await waitForConnected(20000);
    if (connected.value) {
      applySensorConfig();
      return true;
    }
    return false;
  }

  async function disconnect() {
    await HID.Device_Close();
  }

  async function refresh() {
    if (!HID.deviceInfo.deviceOpen) return;
    applySensorConfig();
    await HID.Update_Device_Param();
  }

  return {
    HID,
    PRODUCT,
    connected,
    connecting,
    online,
    battery,
    mouseCfg,
    isWired,
    deviceInfo: HID.deviceInfo,
    connect,
    disconnect,
    refresh,
  };
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
