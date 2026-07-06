import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { PRODUCT } from "@/config/terra-pro.js";
import { ensureSensorConfig, syncDpiSensorFromFlash } from "./useSensorCatalog.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function layoutKind() {
  return PRODUCT.dpiEepromLayout || PRODUCT.sensorType || "3950";
}

function clampDpiValue(dpi) {
  const n = Number(dpi);
  if (!Number.isFinite(n)) return PRODUCT.dpiMin;
  const snapped = Math.round(n / PRODUCT.dpiStep) * PRODUCT.dpiStep;
  return Math.min(PRODUCT.dpiMax, Math.max(PRODUCT.dpiMin, snapped));
}

/**
 * Terra Pro：仅 3950 区（0x0C）+ sensor.json 3950 步进表
 */
/**
 * @param {number} index 档位下标 0 起算
 * @param {number} dpi
 * @param {{ applyStage?: boolean }} options applyStage=false 时只写该档数值，不切换当前档
 */
export async function writeMouseDpi(index, dpi, options = {}) {
  const clamped = clampDpiValue(dpi);
  return writeMouseDpiXY(index, clamped, clamped, options);
}

/**
 * @param {number} index 档位下标 0 起算
 * @param {number} dpiX
 * @param {number} dpiY
 * @param {{ applyStage?: boolean }} options
 */
export async function writeMouseDpiXY(index, dpiX, dpiY, options = {}) {
  const { applyStage = true } = options;
  await syncDpiSensorFromFlash();

  const kind = layoutKind();
  if (!(await ensureSensorConfig(PRODUCT.sensorType))) {
    return { ok: false, error: "sensor.json 未加载" };
  }

  HID.deviceInfo.mouseCfg.sensor.dpiEepromKind = kind;
  HID.deviceInfo.mouseCfg.sensor.type = PRODUCT.sensorType;

  const clampedX = clampDpiValue(dpiX);
  const clampedY = clampDpiValue(dpiY);

  const wrote = await HID.Set_MS_DPIXYValue(index, clampedX, clampedY);
  if (wrote === false) {
    return { ok: false, error: `${kind} 区 X/Y 写入失败，请晃动鼠标` };
  }

  await sleep(80);
  if (index < 0 || index >= PRODUCT.defaultDpiStageCount) {
    return { ok: false, error: `档位下标无效（0～${PRODUCT.defaultDpiStageCount - 1}）` };
  }

  if (applyStage) {
    const applied = await HID.Set_MS_CurrentDPI(index);
    if (applied === false) {
      return { ok: false, error: "应用当前档位失败" };
    }
    await sleep(120);
  } else {
    await sleep(80);
  }
  try {
    await HID.Get_Device_Eeprom_Buffer(0x0c + index * 4, 4);
    await sleep(80);
  } catch (e) {
    console.warn("Get_Device_Eeprom_Buffer", e);
  }
  HID.refreshMouseDpiFromFlash();

  const readX = HID.deviceInfo.mouseCfg.dpis[index]?.x ?? HID.deviceInfo.mouseCfg.dpis[index]?.value;
  const readY = HID.deviceInfo.mouseCfg.dpis[index]?.y ?? readX;
  const stageNow = HID.deviceInfo.mouseCfg.currentDpi;
  if (Math.abs(readX - clampedX) >= PRODUCT.dpiStep || Math.abs(readY - clampedY) >= PRODUCT.dpiStep) {
    return {
      ok: false,
      error: `写入后读回 X=${readX} Y=${readY}，期望 X=${clampedX} Y=${clampedY}（区 ${kind}）`,
    };
  }
  return { ok: true, kind, x: clampedX, y: clampedY, stage: stageNow };
}
