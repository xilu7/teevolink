import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { ensureSensorConfig, syncDpiSensorFromFlash } from "./useSensorCatalog.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function dpiKindsToTry() {
  const is8k =
    HID.deviceInfo.maxReportRate >= 8000 ||
    HID.deviceInfo.info?.type === 0x05 ||
    HID.deviceInfo.info?.type === 0x03;
  return is8k ? ["3955", "3950"] : ["3950", "3955"];
}

/**
 * 写入 DPI（8K 接收器优先 3955 区，失败则回退 3950 区）
 * @returns {{ ok: boolean, kind?: string, error?: string }}
 */
export async function writeMouseDpi(index, dpi, stage) {
  await syncDpiSensorFromFlash();

  const kinds = dpiKindsToTry();
  let lastError = "HID 写入无应答";

  for (const kind of kinds) {
    if (!(await ensureSensorConfig(kind))) continue;
    HID.deviceInfo.mouseCfg.sensor.dpiEepromKind = kind;
    HID.deviceInfo.mouseCfg.sensor.type = kind;

    let wrote;
    if (kind === "3955") {
      wrote = await HID.Set_MS_DPIXYValue(index, dpi, dpi);
    } else {
      wrote = await HID.Set_MS_DPIValue(index, dpi);
    }
    if (wrote === false) {
      lastError = `${kind} 区 DPI 数据写入失败`;
      continue;
    }

    await sleep(60);
    const applied = await HID.Set_MS_CurrentDPI(stage);
    if (applied === false) {
      lastError = "当前档位应用失败";
      continue;
    }

    await sleep(80);
    HID.refreshMouseDpiFromFlash();
    return { ok: true, kind };
  }

  return { ok: false, error: lastError };
}
