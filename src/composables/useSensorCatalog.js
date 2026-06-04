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



/**

 * 连接后刷新 DPI 显示

 * - dpiEepromLayout：Flash 地址格式（Terra Pro = 3950）

 * - sensor.type：换算表（PAW3950 = 3950），二者不要混用

 */

export async function syncDpiSensorFromFlash() {

  await loadSensorCatalog();



  const layout = PRODUCT.dpiEepromLayout || "3950";

  let detected = layout;

  if (!PRODUCT.dpiEepromLayout) {

    detected = HID.detectDpiEepromType();

  }



  HID.deviceInfo.mouseCfg.sensor.dpiEepromKind = detected;

  applySensorConfig(PRODUCT.sensorType);

  HID.deviceInfo.mouseCfg.sensor.type = PRODUCT.sensorType;

  HID.refreshMouseDpiFromFlash();

  if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
    await ensureDpiStageCount();
  }

  return detected;
}

/** Flash 档位数与 Terra Pro 实物不一致时，写回 4 档 */
export async function ensureDpiStageCount() {
  const want = PRODUCT.defaultDpiStageCount;
  const have = Number(HID.deviceInfo.mouseCfg.maxDpiStage);
  if (!Number.isFinite(have) || have === want) return true;
  const ok = await HID.Set_MS_MaxDPI(want);
  if (ok !== false) HID.refreshMouseDpiFromFlash();
  return ok !== false;
}


