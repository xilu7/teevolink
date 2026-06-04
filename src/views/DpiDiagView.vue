<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { ensureSensorConfig, syncDpiSensorFromFlash } from "@/composables/useSensorCatalog.js";
import { writeMouseDpi } from "@/composables/useDpiWrite.js";
import AppTopbar from "@/components/layout/AppTopbar.vue";

const router = useRouter();
const logs = ref([]);
const running = ref(false);

const ADDR = {
  maxStage: 0x02,
  current: 0x04,
  dpi0: 0x0c,
  sensor3955: 0x1b00,
};

function log(msg, ok) {
  const line = `[${new Date().toLocaleTimeString()}] ${ok === true ? "✓ " : ok === false ? "✗ " : ""}${msg}`;
  logs.value.push(line);
}

function hexByte(b) {
  return "0x" + (b & 0xff).toString(16).padStart(2, "0");
}

function flashSlice(addr, len) {
  const parts = [];
  for (let i = 0; i < len; i++) parts.push(hexByte(HID.flashData[addr + i]));
  return parts.join(" ");
}

async function ensureSession() {
  if (!navigator.hid) {
    log("无 Web HID", false);
    return false;
  }
  await ensureSensorConfig(PRODUCT.sensorType);
  HID.deviceInfo.type = "mouse";
  HID.visit = false;
  HID.Set_DriverOnline(false);
  HID.Add_Listen_HID_Events();

  const devs = await navigator.hid.getDevices();
  const dev =
    devs.find((d) => d.vendorId === 0x3554 && d.opened) ??
    devs.find((d) => d.vendorId === 0x3554);
  if (!dev) {
    log("未授权设备：请先在首页连接 RapidSync", false);
    return false;
  }
  if (!dev.opened) {
    await HID.Device_Reconnect(dev);
  }
  if (!HID.deviceInfo.deviceOpen) {
    log("Device_Reconnect 失败", false);
    return false;
  }
  const online = await HID.Get_Current_Device_Online(dev);
  log("deviceOpen=" + HID.deviceInfo.deviceOpen + " online=" + online, online);
  if (!online) {
    log("鼠标未在线：请 2.4G 唤醒", false);
    return false;
  }
  if (HID.deviceInfo.connectState !== HID.DeviceConectState.Connected) {
    await HID.Device_Connect();
    await new Promise((r) => setTimeout(r, 2000));
  }
  log("connectState=" + HID.deviceInfo.connectState, HID.deviceInfo.connectState === HID.DeviceConectState.Connected);
  await syncDpiSensorFromFlash();
  return HID.deviceInfo.connectState === HID.DeviceConectState.Connected;
}

async function runReadReport() {
  logs.value = [];
  running.value = true;
  try {
    log("—— DPI 诊断（BUILD 2026-06-04-s）——");
    if (!(await ensureSession())) return;

    const layout = HID.deviceInfo.mouseCfg.sensor.dpiEepromKind || HID.detectDpiEepromType();
    log("dpiEepromKind=" + layout + " sensor.type=" + HID.deviceInfo.mouseCfg.sensor.type, true);
    log("maxDpiStage(Flash)=" + HID.deviceInfo.mouseCfg.maxDpiStage + " 目标=" + PRODUCT.defaultDpiStageCount);
    log("currentDpi(Flash)=" + HID.deviceInfo.mouseCfg.currentDpi);

    log("EEPROM 0x02 档位数 raw: " + flashSlice(ADDR.maxStage, 2));
    log("EEPROM 0x04 当前档 raw: " + flashSlice(ADDR.current, 2));

    for (let i = 0; i < 5; i++) {
      const a = ADDR.dpi0 + i * 4;
      const v = HID.deviceInfo.mouseCfg.dpis[i]?.value ?? "?";
      log(`档位 ${i + 1} @0x${a.toString(16)} raw[4]=${flashSlice(a, 4)} → UI ${v} DPI`);
    }

    const a55 = ADDR.sensor3955;
    log("3955区 档1 @0x1B00 raw[6]=" + flashSlice(a55, 6) + "（若全 FF 则未用此区）");
  } catch (e) {
    log("异常: " + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}

async function runWriteTest(targetDpi, stageIndex) {
  running.value = true;
  try {
    if (!(await ensureSession())) return;
    const stage = stageIndex + 1;
    log(`—— 写入测试：档位 ${stage} → ${targetDpi} DPI ——`);
    const r = await writeMouseDpi(stageIndex, targetDpi, stage);
    if (!r.ok) {
      log("writeMouseDpi 失败: " + (r.error || ""), false);
      return;
    }
    log("writeMouseDpi 成功 kind=" + r.kind + " dpi=" + r.dpi, true);

    await new Promise((res) => setTimeout(res, 200));
    await syncDpiSensorFromFlash();
    const read = HID.deviceInfo.mouseCfg.dpis[stageIndex]?.value;
    const cur = HID.deviceInfo.mouseCfg.currentDpi;
    log(`读回：档位${stage}=${read} DPI，当前档=${cur}`, read === targetDpi);
    if (read !== targetDpi) {
      log("读回不一致：可能写入失败或地址错误", false);
    }
    log("请眼看接收器屏幕 DPI 是否变为 " + targetDpi);
  } catch (e) {
    log("异常: " + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}

async function runFixStages() {
  running.value = true;
  try {
    if (!(await ensureSession())) return;
    log("—— 将档位数设为 " + PRODUCT.defaultDpiStageCount + " ——");
    const ok = await HID.Set_MS_MaxDPI(PRODUCT.defaultDpiStageCount);
    log("Set_MS_MaxDPI(" + PRODUCT.defaultDpiStageCount + ") → " + ok, ok);
    await syncDpiSensorFromFlash();
    log("刷新后 maxDpiStage=" + HID.deviceInfo.mouseCfg.maxDpiStage, true);
  } catch (e) {
    log("异常: " + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}
</script>

<template>
  <div class="driver-shell diag-page">
    <AppTopbar logo-size="sm" />
    <main class="container">
      <h1>DPI 专项诊断</h1>
      <p class="lead">
        Terra Pro 使用 <strong>3950·0x0C</strong> 存储。请 2.4G 唤醒后依次点下面按钮，把灰框日志全选复制给我们。
      </p>
      <div class="btn-row">
        <button type="button" class="btn-diag" :disabled="running" @click="runReadReport">1. 读取现状</button>
        <button type="button" class="btn-diag" :disabled="running" @click="runWriteTest(800, 0)">2. 写档位1=800</button>
        <button type="button" class="btn-diag" :disabled="running" @click="runWriteTest(1600, 2)">3. 写档位3=1600</button>
        <button type="button" class="btn-diag" :disabled="running" @click="runFixStages">4. 修正为5档</button>
      </div>
      <pre class="log-box">{{ logs.join("\n") || "等待开始…" }}</pre>
      <p class="hint">
        <router-link to="/diag">通用连接诊断</router-link>
        ·
        <router-link to="/device">返回设备页</router-link>
        · 首页页脚版本应为 <strong>2026-06-04-s</strong>
      </p>
    </main>
  </div>
</template>

<style scoped>
.diag-page main {
  padding: 1.5rem 0 3rem;
}
h1 {
  font-size: 1.35rem;
  margin: 0 0 0.5rem;
}
.lead {
  color: var(--tx2);
  font-size: 0.9rem;
  line-height: 1.55;
  margin-bottom: 1rem;
}
.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.btn-diag {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--bd);
  background: var(--tx);
  color: var(--bg);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-diag:disabled {
  opacity: 0.5;
}
.log-box {
  background: #1a1a1a;
  color: #b8f0c8;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.78rem;
  line-height: 1.45;
  max-height: 480px;
  overflow: auto;
  white-space: pre-wrap;
}
.hint {
  font-size: 0.85rem;
  color: var(--tx3);
  margin-top: 0.75rem;
}
</style>
