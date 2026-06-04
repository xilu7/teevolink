/** 首页展示：玩家关心的浏览器与型号说明 */

export const SUPPORTED_BROWSERS = [
  {
    id: "chrome",
    name: "Google Chrome",
    version: "89 及以上",
    ok: true,
  },
  {
    id: "edge",
    name: "Microsoft Edge",
    version: "89 及以上",
    ok: true,
  },
];

export const UNSUPPORTED_BROWSER_NOTE =
  "暂不支持 Firefox、Safari 网页版。请用电脑版 Chrome 或 Edge 打开本页。";

export const SUPPORTED_PRODUCTS = [
  "Teevolution Terra Pro",
  "RapidSync 8K 无线接收器（VID 3554）",
];

export const HOME_SITE_HINT =
  "请通过 HTTPS 访问官方驱动页（如 Vercel 部署链接），勿用本地文件双击打开。";
