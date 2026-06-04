import { ref, watch } from "vue";

const THEME_KEY = "teevolink_theme";
/** TEEVO 设计系统默认浅色；深色为可选 */
const isDark = ref(false);

function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") isDark.value = true;
  else if (saved === "light") isDark.value = false;
  else isDark.value = false;
  applyTheme(isDark.value);
}

export function useTheme() {
  if (typeof document !== "undefined" && !document.documentElement.hasAttribute("data-theme")) {
    loadTheme();
  }

  watch(isDark, (v) => {
    applyTheme(v);
    localStorage.setItem(THEME_KEY, v ? "dark" : "light");
  });

  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  return { isDark, toggleTheme, loadTheme };
}
