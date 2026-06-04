/**
 * Firmware upgrade bridge — replace with factory UpgradeHandle.js when available.
 */
export default {
  DeviceOpen(_device) {
    console.warn("[TeevoLink] UpgradeHandle stub: firmware upgrade not available.");
  },
};
