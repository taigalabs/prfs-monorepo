import { Credential } from "@taigalabs/prfs-crypto-js";

const PRFS_ID_STORAGE_KEY = "prfs_id";

export interface StoredCredential {
  id: string;
  credential: string; // encrpyted
}

export function persistPrfsIdCredential(credential: StoredCredential) {
  const credentials = loadLocalPrfsIdCredentials();
  credentials.push(credential);
  const str = JSON.stringify(credentials);
  window.localStorage.setItem(PRFS_ID_STORAGE_KEY, str);
  console.log("Storing prfs is credential", credential.id, str);
}

export function loadLocalPrfsIdCredentials(): StoredCredential[] {
  const val = window.localStorage.getItem(PRFS_ID_STORAGE_KEY);

  try {
    if (val) {
      const obj: StoredCredential[] = JSON.parse(val);
      return obj;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}
