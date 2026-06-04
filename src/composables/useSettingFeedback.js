import { ref } from "vue";

const message = ref("");
let timer;

export function useSettingFeedback() {
  function notify(text) {
    message.value = text;
    clearTimeout(timer);
    timer = setTimeout(() => {
      message.value = "";
    }, 2200);
  }

  return { feedback: message, notify };
}
