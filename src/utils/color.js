/** 将 #RRGGBB 转为 SDK 所需的 rgb(r, g, b) 字符串 */
export function hexToRgbString(hex) {
  const h = String(hex).replace("#", "");
  if (h.length < 6) return "rgb(120, 190, 31)";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

/** 将 rgb(...) 或 #hex 转为 color input 用的 #RRGGBB */
export function toHexColor(value) {
  if (!value) return "#78BE1F";
  if (value.startsWith("#")) return value;
  const m = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!m) return "#78BE1F";
  const hex = (n) => Number(n).toString(16).padStart(2, "0");
  return `#${hex(m[1])}${hex(m[2])}${hex(m[3])}`;
}
