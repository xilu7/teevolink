import { inject } from "vue";
import { KEYS_PAGE_KEY } from "./keys-context.js";

export function injectKeysPage() {
  const ctx = inject(KEYS_PAGE_KEY);
  if (!ctx) throw new Error("KeysPage context missing");
  return ctx;
}
