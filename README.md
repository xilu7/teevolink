# TeevoLink v2

Browser driver for **Terra Pro** (Web HID). Built on `dev_HIDHandle_05_27.js` (2026-05 SDK).

## Requirements

- Node.js 18+
- Chrome 89+ or Edge 89+
- Terra Pro mouse + USB or 2.4GHz receiver

## Setup

```bash
cd teevolink-v2
npm install
npm run dev
```

Open http://localhost:5173 — click **Connect mouse** and allow HID access.

## Deploy — use existing domain

**Production URL:** https://teevolink.teevolution.gg

Push this project to the **same GitHub repo** already linked on Vercel, then redeploy.  
See `部署到teevolink.teevolution.gg.md` (Chinese step-by-step).

Build: `npm run build` → output `dist`. HTTPS is required for Web HID (Vercel provides this).

## Config

- `src/config/terra-pro.js` — product name, sensor type (`3955`), HID filters (VID/PID).
- `public/sensor.json` — DPI tables per sensor.
- `src/sdk/` — factory HID SDK + `UpgradeHandle.js` stub (replace when factory sends real file).

## SDK note

`BatteryHandle.js` imports `dev_HIDHandle_05_27.js`. Main SDK export includes `Update_Device_Param` for TeevoLink v2 refresh.
