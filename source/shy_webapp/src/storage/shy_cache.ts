export interface LocalShyCacheItem {
  key: string;
  value: string;
  timestamp: number;
}

export type LocalShyCache = Record<string, string>;

const SHY_CACHE = "shy_cache";

export function loadLocalShyCache(): LocalShyCache | null {
  const cache = window.localStorage.getItem(SHY_CACHE);

  try {
    if (cache) {
      const obj: LocalShyCache = JSON.parse(cache);
      return obj;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export function persistShyCache(cache: LocalShyCache): LocalShyCache | null {
  if (cache) {
    const str = JSON.stringify(cache);
    window.localStorage.setItem(SHY_CACHE, str);
  }

  return cache;
}
