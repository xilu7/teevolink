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
          "还不能写入鼠标：请保持 2.4G 或 USB 有线，并晃动鼠标直到右上角显示「已连接」"
      );
      return false;
    }
    try {
      const result = await action();
      if (result === false) {
        notify(failMsg || "写入失败，请晃动鼠标后重试");
        return false;
      }
      if (successMsg) notify(successMsg);
      return true;
    } catch (e) {
      console.error(e);
      notify(e?.message || "操作失败，请稍后重试");
      return false;
    }
  }

  return { run, notify };
}
