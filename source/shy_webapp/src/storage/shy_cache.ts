export interface LocalShyCacheItem {
  key: string;
  value: string;
}

export type LocalShyCache = Record<string, string>;

const SHY_CACHE = "shy_cache";

export function loadLocalShyCache(): LocalShyCache | null {
  const val = window.localStorage.getItem(SHY_CACHE);

  try {
    if (val) {
      const obj: LocalShyCache = JSON.parse(val);
      return obj;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
