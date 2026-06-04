import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { PRODUCT } from "@/config/terra-pro.js";
import { ensureSensorConfig, syncDpiSensorFromFlash } from "./useSensorCatalog.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function layoutKind() {
  return PRODUCT.dpiEepromLayout || PRODUCT.sensorType || "3950";
}

/**
 * Terra Pro：仅 3950 区（0x0C）+ sensor.json 3950 步进表
 */
export async function writeMouseDpi(index, dpi) {
  await syncDpiSensorFromFlash();

  const kind = layoutKind();
  if (!(await ensureSensorConfig(PRODUCT.sensorType))) {
    return { ok: false, error: "sensor.json 未加载" };
  }

  HID.deviceInfo.mouseCfg.sensor.dpiEepromKind = kind;
  HID.deviceInfo.mouseCfg.sensor.type = PRODUCT.sensorType;

  const snapped = Math.round(dpi / PRODUCT.dpiStep) * PRODUCT.dpiStep;
  const clamped = Math.min(PRODUCT.dpiMax, Math.max(PRODUCT.dpiMin, snapped));

  let wrote = false;
  if (kind === "3955") {
    wrote = await HID.Set_MS_DPIXYValue(index, clamped, clamped);
  } else {
    wrote = await HID.Set_MS_DPIValue(index, clamped);
  }
  if (wrote === false) {
    return { ok: false, error: `${kind} 区写入失败，请晃动鼠标` };
  }

  await sleep(80);
  if (index < 0 || index >= PRODUCT.defaultDpiStageCount) {
    return { ok: false, error: `档位下标无效（0～${PRODUCT.defaultDpiStageCount - 1}）` };
  }

  const applied = await HID.Set_MS_CurrentDPI(index);
  if (applied === false) {
    return { ok: false, error: "应用当前档位失败" };
  }

  await sleep(120);
  try {
    await HID.Get_Device_Eeprom_Buffer(0x0c + index * 4, 4);
    await sleep(80);
  } catch (e) {
    console.warn("Get_Device_Eeprom_Buffer", e);
  }
  HID.refreshMouseDpiFromFlash();

  const readBack = HID.deviceInfo.mouseCfg.dpis[index]?.value;
  const stageNow = HID.deviceInfo.mouseCfg.currentDpi;
  if (Math.abs(readBack - clamped) >= PRODUCT.dpiStep) {
    return {
      ok: false,
      error: `写入后读回 ${readBack}，期望 ${clamped}（区 ${kind}）`,
    };
  }
  return { ok: true, kind, dpi: clamped, stage: stageNow };
}
