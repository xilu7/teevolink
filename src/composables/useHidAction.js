import { useDevice } from "./useDevice.js";
import { useSettingFeedback } from "./useSettingFeedback.js";

/**
 * 包装 SDK 写操作：先 ensureReady，失败时提示用户唤醒鼠标
 */
export function useHidAction() {
  const { ensureReady, syncDevice, connecting } = useDevice();
  const { notify } = useSettingFeedback();

  async function run(action, successMsg, failMsg) {
    let ready = await ensureReady();
    if (!ready && connecting.value) {
      notify("同步卡住了，正在自动重置…");
      await syncDevice(18);
      ready = await ensureReady();
    }
    if (!ready) {
      notify(
        failMsg ||
          "还不能写入鼠标：① 底部开关拨到 2.4G ② 打开电源并晃动 ③ 点「同步设备」直到右上角「已连接」"
      );
      return false;
    }
    try {
      await action();
      if (successMsg) notify(successMsg);
      return true;
    } catch (e) {
      console.error(e);
      notify(e?.message || "操作失败，请点「同步设备」后重试");
      return false;
    }
  }

  return { run, notify };
}
