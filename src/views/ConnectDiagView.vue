<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import HID from "@/sdk/dev_HIDHandle_05_27.js";
import { HID_FILTERS, PRODUCT } from "@/config/terra-pro.js";
import { ensureSensorConfig } from "@/composables/useSensorCatalog.js";
import AppTopbar from "@/components/layout/AppTopbar.vue";

const router = useRouter();
const logs = ref([]);
const running = ref(false);
const REPORT_ID = 0x08;

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
    }) ?? null
  );
}

function log(msg, ok) {
  const line = `[${new Date().toLocaleTimeString()}] ${ok === true ? "✓ " : ok === false ? "✗ " : ""}${msg}`;
  logs.value.push(line);
  console.log(line);
}

async function runFactoryDiag() {
  logs.value = [];
  running.value = true;
  try {
    if (!navigator.hid) {
      log("无 Web HID：请用 Chrome/Edge + HTTPS", false);
      return;
    }
    log("浏览器支持 Web HID", true);

    const sensorOk = await ensureSensorConfig(PRODUCT.sensorType);
    if (!sensorOk) {
      log("sensor.json 未加载（无法解析 DPI）", false);
      return;
    }
    log("sensor.json 已加载（3950 DPI 表）", true);
    HID.deviceInfo.type = "mouse";
    HID.visit = false;
    HID.Set_DriverOnline(false);
    HID.Add_Listen_HID_Events();
    log("初始化：sensor=" + PRODUCT.sensorType + "，DriverOnline=false（工厂建议）", true);

    log("Request_Device：请在弹窗选 RapidSync…");
    const picked = await HID.Request_Device(HID_FILTERS);
    if (!picked) {
      log("未选择设备或取消", false);
      return;
    }
    log("Request_Device 成功", true);

    const dev = pickDevice(await navigator.hid.getDevices());
    if (!dev) {
      log("未找到 RapidSync（VID 3554）", false);
      return;
    }
    log(
      `设备：${dev?.productName} VID=0x${dev?.vendorId?.toString(16)} PID=0x${dev?.productId?.toString(16)}`,
      true
    );

    await HID.Device_Reconnect(dev);
    log("Device_Reconnect 完成，deviceOpen=" + HID.deviceInfo.deviceOpen, HID.deviceInfo.deviceOpen);

    const online = await HID.Get_Current_Device_Online(dev);
    log("Get_Current_Device_Online = " + online, online);
    if (!online) {
      log("鼠标未上线：请 2.4G 档 + 开机 + 晃动", false);
      return;
    }

    log("Device_Connect（读参数；网页模式已跳过灯效类接收器命令）…");
    try {
      await HID.Device_Connect();
    } catch (e) {
      log("Device_Connect 异常：" + (e?.message || e), false);
      return;
    }

    for (let i = 1; i <= 90; i++) {
      const st = HID.deviceInfo.connectState;
      const stName =
        st === HID.DeviceConectState.Connected
          ? "Connected"
          : st === HID.DeviceConectState.Connecting
            ? "Connecting"
            : st === HID.DeviceConectState.TimeOut
              ? "TimeOut"
              : "Disconnected";
      if (i % 5 === 0 || st === HID.DeviceConectState.Connected) {
        log(
          `第 ${i} 秒：状态=${stName}，online=${HID.deviceInfo.online}，deviceOpen=${HID.deviceInfo.deviceOpen}`,
          st === HID.DeviceConectState.Connected
        );
      }
      if (st === HID.DeviceConectState.Connected) {
        log("成功：已进入 Connected，可以改 DPI", true);
        return;
      }
      if (st === HID.DeviceConectState.TimeOut) {
        const detail = HID.deviceInfo.lastSyncError ? `（${HID.deviceInfo.lastSyncError}）` : "";
        log("失败：同步超时 TimeOut" + detail, false);
        return;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    log("90 秒内未 Connected：若曾变 Disconnected，多为同步失败（已避免自动关设备）", false);
  } catch (e) {
    log("异常：" + (e?.message || e), false);
  } finally {
    running.value = false;
  }
}
</script>

<template>
  <div class="driver-shell diag-page">
    <AppTopbar logo-size="sm" />
    <main class="container">
      <h1>连接诊断（工厂 SDK 逐步执行）</h1>
      <p class="lead">
        用于排查「从未连接成功」。请：2.4G 或 USB 有线 → 插接收器 → 唤醒鼠标 → 点下面按钮。
      </p>
      <button type="button" class="btn-run" :disabled="running" @click="runFactoryDiag">
        {{ running ? "诊断中…" : "开始诊断（约 1 分钟）" }}
      </button>
      <pre class="log-box">{{ logs.join("\n") || "等待开始…" }}</pre>
      <p class="hint">把上面灰框文字全选复制发给我们。成功后回首页即可正常使用。</p>
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
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
.btn-run {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: var(--tx);
  color: var(--bg);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
}
.btn-run:disabled {
  opacity: 0.6;
}
.log-box {
  background: #1a1a1a;
  color: #b8f0c8;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  line-height: 1.45;
  max-height: 420px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.hint {
  font-size: 0.85rem;
  color: var(--tx3);
  margin-top: 0.75rem;
}
</style>
