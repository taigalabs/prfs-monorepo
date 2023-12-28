export type ShyId = string;
export interface LocalShyCredential {
  account_id: string;
  public_key: string; // encrpyted
  avatar_color: string;
}

const SHY_KEY = "shy";

export function persistShyCredential(credential: LocalShyCredential): LocalShyCredential {
  const value = JSON.stringify(credential);

  console.log("Persisting Shy credential", credential);
  window.localStorage.setItem(SHY_KEY, value);
  return credential;
}

export function loadLocalShyCredential(): LocalShyCredential | null {
  const val = window.localStorage.getItem(SHY_KEY);

  try {
    if (val) {
      const obj: LocalShyCredential = JSON.parse(val);

      if (!checkSanity(obj)) {
        console.log("Shy credential is corrupted. Removing...");
        removeLocalShyCredential();
        return null;
      }

      return obj;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function checkSanity(obj: LocalShyCredential): boolean {
  if (!obj.account_id || obj.account_id.length < 1) {
    return false;
  }

  if (!obj.public_key || obj.public_key.length < 1) {
    return false;
  }

  if (!obj.avatar_color || obj.avatar_color.length < 1) {
    return false;
  }

  return true;
}

export function removeLocalShyCredential() {
  window.localStorage.removeItem(SHY_KEY);
}
