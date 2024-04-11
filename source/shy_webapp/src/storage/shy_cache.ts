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

export function persistShyCacheItem(item: LocalShyCacheItem): LocalShyCache | null {
  const val = window.localStorage.getItem(SHY_CACHE);

  try {
    if (val) {
      const cache: LocalShyCache = JSON.parse(val);
      const newCache = {
        ...cache,
        [item.key]: item.value,
      };

      const newCacheStr = JSON.stringify(newCache);
      window.localStorage.setItem(SHY_CACHE, newCacheStr);

      return newCache;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
