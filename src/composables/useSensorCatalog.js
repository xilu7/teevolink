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
  if (!catalog || !catalog[type]) return;
  HID.deviceInfo.mouseCfg.sensor.type = String(type);
  const entry = catalog[type];
  HID.deviceInfo.mouseCfg.sensor.cfg = JSON.parse(JSON.stringify(entry));
}
