/** Terra Pro — same HID stack as TeevoLink v1 */
export const PRODUCT = {
  name: "Terra Pro",
  brand: "Teevolution",
  sensorType: "3955",
  maxDpi: 26000,
  dpiStages: 8,
  buttons: 6,
  maxReportRate: 8000,
};

/** SDK example filters — add more PID entries if factory provides them */
export const HID_FILTERS = [
  { vendorId: 0x3554, productId: 0xf516 },
];
