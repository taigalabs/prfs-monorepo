import { encrypt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

const PRFS_ID_STORAGE_KEY = "prfs_id";

export type PrfsId = string;
export type StoredCredentialRecord = Record<PrfsId, StoredCredential>;

export interface StoredCredential {
  id: string;
  credential: number[]; // encrpyted
}

export function persistPrfsIdCredentialEncrypted(credential: PrfsIdCredential) {
  const encrypted = encrypt(credential.local_encrypt_key, Buffer.from(JSON.stringify(credential)));
  const storedCredential = {
    id: credential.id,
    credential: Array.prototype.slice.call(encrypted), // encrpyted
  };

  const credentials = loadLocalPrfsIdCredentials();
  credentials[credential.id] = storedCredential;
  const str = JSON.stringify(credentials);

  window.localStorage.setItem(PRFS_ID_STORAGE_KEY, str);
  console.log("Storing prfs is credential", credential.id, str);
}

export function loadLocalPrfsIdCredentials(): StoredCredentialRecord {
  const val = window.localStorage.getItem(PRFS_ID_STORAGE_KEY);

  try {
    if (val) {
      const obj: StoredCredentialRecord = JSON.parse(val);
      return obj;
    } else {
      return {};
    }
  } catch (err) {
    console.error(err);
    return {};
  }
}

export function removeAllPrfsIdCredentials() {
  window.localStorage.removeItem(PRFS_ID_STORAGE_KEY);
}
