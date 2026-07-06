<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { BUILD_TAG } from "@/config/build.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { ensureSensorConfig, syncDpiSensorFromFlash } from "@/composables/useSensorCatalog.js";
import { writeMouseDpi, writeMouseDpiXY } from "@/composables/useDpiWrite.js";
import { getDpiStageLabel } from "@/composables/useDpiStageIndex.js";
import DriverAppTopbar from "@/components/layout/DriverAppTopbar.vue";
import { useDevice } from "@/composables/useDevice.js";

const router = useRouter();
const { disconnect } = useDevice();
const logs = ref([]);
const running = ref(false);

const REPORT_ID = 0x08;

const ADDR = {
  maxStage: 0x02,
  current: 0x04,
  dpi0: 0x0c,
  sensor3955: 0x1b00,
};

const PROBE_VALUES = [400, 800, 1100, 1200, 1500, 1600, 3200];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function pickDevice(devices) {
  return (
    devices.find((d) => {
      if (d.vendorId !== 0x3554) return false;
      return d.collections?.some(
        (c) =>
          c.inputReports?.length === 1 &&
          c.outputReports?.length === 1 &&
          c.outputReports[0].reportId === REPORT_ID
      );
    }) ?? devices.find((d) => d.vendorId === 0x3554) ?? null
  );
}

function connectStateName(st) {
  if (st === HID.DeviceConectState.Connected) return "Connected";
  if (st === HID.DeviceConectState.Connecting) return "Connecting";
  if (st === HID.DeviceConectState.TimeOut) return "TimeOut";
  return "Disconnected";
}

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

function decode3950Stage(index) {
  const addr = ADDR.dpi0 + index * 4;
  const b0 = HID.flashData[addr];
  const b1 = HID.flashData[addr + 1];
  const b2 = HID.flashData[addr + 2];
  const exX = b2 & 0x03;
  const exY = (b2 >> 4) & 0x03;
  const hiX = (b2 >> 2) & 0x03;
  const hiY = (b2 >> 6) & 0x03;
  const rawX = b0 + (hiX << 8);
  const rawY = b1 + (hiY << 8);
  const d = HID.deviceInfo.mouseCfg.dpis[index];
  return {
    addr,
    raw: flashSlice(addr, 4),
    uiX: d?.x ?? d?.value ?? "?",
    uiY: d?.y ?? "?",
    uiVal: d?.value ?? "?",
    rawX,
    rawY,
    exX,
    exY,
  };
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

  const dev = pickDevice(await navigator.hid.getDevices());
  if (!dev) {
    log("未授权设备：请先在首页点「连接设备」选 RapidSync", false);
    return false;
  }
  log(`设备 ${dev.productName || "?"} PID=0x${dev.productId?.toString(16)}`);

  if (
    HID.deviceInfo.deviceOpen &&
    dev.opened &&
    HID.deviceInfo.connectState === HID.DeviceConectState.Connected
  ) {
    log("已是 Connected，直接读取", true);
    await syncDpiSensorFromFlash();
    return true;
  }

  if (!dev.opened || !HID.deviceInfo.deviceOpen) {
    log("Device_Reconnect…");
    await HID.Device_Reconnect(dev);
  }
  if (!HID.deviceInfo.deviceOpen) {
    log("接收器未打开，请重新插 USB", false);
    return false;
  }

  if (HID.deviceInfo.connectState === HID.DeviceConectState.Connected) {
    await syncDpiSensorFromFlash();
    return true;
  }

  log("Device_Connect（约 1 分钟内）…");
  try {
    await HID.Device_Connect();
  } catch (e) {
    log("Device_Connect 异常: " + (e?.message || e), false);
    return false;
  }

  for (let i = 1; i <= 60; i++) {
    const st = HID.deviceInfo.connectState;
    if (i === 1 || i % 5 === 0 || st === HID.DeviceConectState.Connected) {
      log(`第 ${i} 秒：${connectStateName(st)}`, st === HID.DeviceConectState.Connected);
    }
    if (st === HID.DeviceConectState.Connected) {
      await syncDpiSensorFromFlash();
      return true;
    }
    if (st === HID.DeviceConectState.TimeOut) {
      log("失败：TimeOut", false);
      return false;
    }
    await sleep(1000);
  }
  log("60 秒未 Connected", false);
  return false;
}

async function logCurrentState(title = "读取现状") {
  log(`—— ${title} ——`);
  const layout = HID.deviceInfo.mouseCfg.sensor.dpiEepromKind || HID.detectDpiEepromType();
  log(`BUILD=${BUILD_TAG} layout=${layout} sensor=${HID.deviceInfo.mouseCfg.sensor.type}`, true);
  log(`maxDpiStage=${HID.deviceInfo.mouseCfg.maxDpiStage} currentDpi(raw)=${HID.deviceInfo.mouseCfg.currentDpi} → UI第${getDpiStageLabel(HID.deviceInfo.mouseCfg)}档`);

  for (let i = 0; i < PRODUCT.defaultDpiStageCount; i++) {
    const s = decode3950Stage(i);
    log(
      `档${i + 1} @0x${s.addr.toString(16)} raw=${s.raw} → UI X=${s.uiX} Y=${s.uiY} (value=${s.uiVal})`
    );
    if (s.uiX !== s.uiY) {
      log(`  ↳ X/Y 不同：横向 ${s.uiX} · 纵向 ${s.uiY}`, true);
    }
  }

  const a55 = ADDR.sensor3955;
  log("3955区 档1 raw[6]=" + flashSlice(a55, 6) + "（全 FF 则未用）");
}

async function runReadReport() {
  logs.value = [];
  running.value = true;
  try {
    if (!(await ensureSession())) return;
    await logCurrentState("DPI 读取");
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
    log(`—— 写入测试：档${stage} → ${targetDpi}（统一 X=Y）——`);
    const r = await writeMouseDpi(stageIndex, targetDpi);
    if (!r.ok) {
      log("writeMouseDpi 失败: " + (r.error || ""), false);
      return;
    }
    log("写入成功", true);
    await sleep(200);
    await syncDpiSensorFromFlash();
    const s = decode3950Stage(stageIndex);
    log(`读回 X=${s.uiX} Y=${s.uiY}`, s.uiX === targetDpi && s.uiY === targetDpi);
    if (s.uiX !== targetDpi || s.uiY !== targetDpi) {
      log(`期望 ${targetDpi}，读回不一致 → 可能 Flash 写入或解析有问题`, false);
    }
  } catch (e) {
    log("异常: " + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}

async function runWriteXYTest(stageIndex, x, y) {
  running.value = true;
  try {
    if (!(await ensureSession())) return;
    log(`—— X/Y 写入：档${stageIndex + 1} → X=${x} Y=${y} ——`);
    const r = await writeMouseDpiXY(stageIndex, x, y);
    if (!r.ok) {
      log("writeMouseDpiXY 失败: " + (r.error || ""), false);
      return;
    }
    log("写入成功", true);
    await sleep(200);
    await syncDpiSensorFromFlash();
    const s = decode3950Stage(stageIndex);
    log(`读回 X=${s.uiX} Y=${s.uiY}`, s.uiX === x && s.uiY === y);
    if (s.uiX !== x || s.uiY !== y) {
      log(`期望 X=${x} Y=${y}，读回不一致`, false);
    }
  } catch (e) {
    log("异常: " + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}

/** 一次性探测常见 DPI 能否写进 Flash（在档 4 上测，不影响常用档 1） */
async function runFullProbe() {
  logs.value = [];
  running.value = true;
  const stageIndex = 3;
  try {
    if (!(await ensureSession())) return;
    await logCurrentState("全面检查 · 开始前");
    log("—— 开始在档 4 探测写入（400/800/1100/1200/1500/1600/3200）——");
    let fail = 0;
    for (const v of PROBE_VALUES) {
      const r = await writeMouseDpi(stageIndex, v, { applyStage: false });
      if (!r.ok) {
        log(`${v} 写入失败: ${r.error}`, false);
        fail++;
        continue;
      }
      await sleep(150);
      await syncDpiSensorFromFlash();
      const s = decode3950Stage(stageIndex);
      const ok = s.uiX === v && s.uiY === v;
      log(`${v} → 读回 X=${s.uiX} Y=${s.uiY} raw=${s.raw}`, ok);
      if (!ok) fail++;
    }
    log("—— X/Y 独立：档4 → X=1200 Y=1100 ——");
    const xy = await writeMouseDpiXY(stageIndex, 1200, 1100, { applyStage: false });
    if (xy.ok) {
      await sleep(150);
      await syncDpiSensorFromFlash();
      const s = decode3950Stage(stageIndex);
      log(`读回 X=${s.uiX} Y=${s.uiY}`, s.uiX === 1200 && s.uiY === 1100);
      if (s.uiX !== 1200 || s.uiY !== 1100) fail++;
    } else {
      log("X/Y 写入失败: " + xy.error, false);
      fail++;
    }
    log(fail === 0 ? "全面检查通过 ✓" : `完成：${fail} 项未通过`, fail === 0);
    log("若网页输入会跳回 1500：先看读回是否正常；读回正常则是 UI 未保存被刷新（已修）；读回也不对则是 Flash/固件问题");
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
    log("Set_MS_MaxDPI → " + ok, ok);
    await syncDpiSensorFromFlash();
  } catch (e) {
    log("异常: " + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}

async function runFactoryPresets() {
  running.value = true;
  try {
    if (!(await ensureSession())) return;
    log("—— 写入出厂四档 " + PRODUCT.defaultDpiPresets.join(" / ") + " ——");
    for (let i = 0; i < PRODUCT.defaultDpiStageCount; i++) {
      const dpi = PRODUCT.defaultDpiPresets[i];
      const r = await writeMouseDpi(i, dpi);
      log(`档 ${i + 1} → ${dpi}: ` + (r.ok ? "OK" : r.error || "失败"), r.ok);
      if (!r.ok) return;
      await sleep(120);
    }
    await syncDpiSensorFromFlash();
    log("完成", true);
  } catch (e) {
    log("异常: " + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}

async function copyLogs() {
  try {
    await navigator.clipboard.writeText(logs.value.join("\n"));
    log("已复制日志到剪贴板", true);
  } catch {
    log("复制失败", false);
  }
}
</script>

<template>
  <div class="driver-shell diag-page">
    <DriverAppTopbar logo-size="sm" @disconnect="disconnect" />
    <main class="container">
      <h1>DPI 全面诊断</h1>
      <p class="lead">
        Terra Pro 使用 <strong>3950 · 0x0C</strong>。2.4G 唤醒鼠标后点
        <strong>「一键全面检查」</strong>，会自动测 400/1100/1200/1500 等能否写进 Flash，并测 X/Y 独立写入。
      </p>
      <div class="btn-row">
        <button type="button" class="btn-diag btn-primary" :disabled="running" @click="runFullProbe">
          一键全面检查
        </button>
        <button type="button" class="btn-diag" :disabled="running" @click="runReadReport">读取现状</button>
        <button type="button" class="btn-diag" :disabled="running" @click="runWriteTest(1200, 2)">写档3=1200</button>
        <button type="button" class="btn-diag" :disabled="running" @click="runWriteXYTest(2, 1600, 1500)">
          写档3 X=1600 Y=1500
        </button>
        <button type="button" class="btn-diag" :disabled="running" @click="runFixStages">修正4档</button>
        <button type="button" class="btn-diag" :disabled="running" @click="runFactoryPresets">恢复出厂四档</button>
        <button type="button" class="btn-diag" :disabled="!logs.length" @click="copyLogs">复制日志</button>
      </div>
      <pre class="log-box">{{ logs.join("\n") || "等待开始…" }}</pre>
      <p class="hint">
        BUILD <strong>{{ BUILD_TAG }}</strong>
        ·
        <router-link to="/diag">连接诊断</router-link>
        ·
        <router-link to="/device">返回设备页</router-link>
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
.btn-diag.btn-primary {
  background: var(--ac);
  border-color: var(--ac);
  color: #fff;
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
