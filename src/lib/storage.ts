import { useEffect, useState } from "react";

/* Per-device memory (chat history, unread dot). Wrapped in try/catch because storage can be blocked. */
const PREFIX = "smartstay:";

export function readStore<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(PREFIX + key); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}

export function writeStore(key: string, value: unknown) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch { /* ignore */ }
}

export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore(key, fallback));
  useEffect(() => writeStore(key, value), [key, value]);
  return [value, setValue] as const;
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}
