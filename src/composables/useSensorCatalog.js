import { PRODUCT } from "@/config/terra-pro.js";
import HID from "@/sdk/dev_HIDHandle_05_27.js";

let catalog = null;

export async function loadSensorCatalog() {
  if (catalog) return catalog;
  const res = await fetch("/sensor.json");
  catalog = await res.json();
  return catalog;
}

export function applySensorConfig(type = PRODUCT.sensorType) {
  if (!catalog || !catalog[type]) {
    console.warn("applySensorConfig: sensor.json 未加载或缺少型号", type);
    return false;
  }
  HID.deviceInfo.mouseCfg.sensor.type = String(type);
  const entry = catalog[type];
  HID.deviceInfo.mouseCfg.sensor.cfg = JSON.parse(JSON.stringify(entry));
  return true;
}

/** 诊断页/连接前必须先调用，否则 DPI 解析会抛错并立刻 TimeOut */
export async function ensureSensorConfig(type = PRODUCT.sensorType) {
  await loadSensorCatalog();
  return applySensorConfig(type);
}

/** 连接后按 Flash 检测 DPI 存储区，并刷新界面上的 DPI 读数 */
export async function syncDpiSensorFromFlash() {
  const kind = HID.detectDpiEepromType();
  HID.deviceInfo.mouseCfg.sensor.dpiEepromKind = kind;
  const ok = await ensureSensorConfig(kind);
  if (ok) {
    HID.deviceInfo.mouseCfg.sensor.type = kind;
    HID.refreshMouseDpiFromFlash();
  }
  return kind;
}
