import { useDevice } from "./useDevice.js";
import { useSettingFeedback } from "./useSettingFeedback.js";

/**
 * 包装 SDK 写操作：先 ensureReady，失败时提示用户唤醒鼠标
 */
export function useHidAction() {
  const { ensureReady } = useDevice();
  const { notify } = useSettingFeedback();

  async function run(action, successMsg, failMsg) {
    const ready = await ensureReady();
    if (!ready) {
      notify(
        failMsg ||
          "鼠标未上线：先晃动唤醒 → 点「同步设备」→ 右上角显示「已连接」后再改"
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
