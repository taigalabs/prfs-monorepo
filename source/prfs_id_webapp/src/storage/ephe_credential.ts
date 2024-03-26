import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

const PRFS_ID_EPHEMERAL = "prfs_id_ephemeral";
const EPHEMERAL_CREDENTIAL_LIFE = 600000; // 60 * 10 * 1000

export interface EphemeralPrfsIdCredential {
  createdAt: number;
  credential: PrfsIdCredential;
}

export function persistEphemeralPrfsIdCredential(credential: PrfsIdCredential) {
  const cred: EphemeralPrfsIdCredential = { createdAt: Date.now(), credential };
  const json = JSON.stringify(cred);
  window.localStorage.setItem(PRFS_ID_EPHEMERAL, json);
  // console.log("Storing prfs is credential", credential.id);
}

export function bustEphemeralPrfsIdCredential(force?: boolean) {
  try {
    const json = window.localStorage.getItem(PRFS_ID_EPHEMERAL);
    if (json) {
      const cred: EphemeralPrfsIdCredential = JSON.parse(json);
      const lasted = Date.now() - cred.createdAt;
      if (lasted > EPHEMERAL_CREDENTIAL_LIFE || force) {
        console.log("Busting ephemeral prfs id credential");
        window.localStorage.removeItem(PRFS_ID_EPHEMERAL);
      }
    }
  } catch (err) {
    console.error(err);
    return;
  }
}

export function loadEphemeralPrfsIdCredential(): EphemeralPrfsIdCredential | null {
  try {
    const val = window.localStorage.getItem(PRFS_ID_EPHEMERAL);
    if (val) {
      const cred: EphemeralPrfsIdCredential = JSON.parse(val);

      if (Date.now() - cred.createdAt > EPHEMERAL_CREDENTIAL_LIFE) {
        console.log("Busting ephemeral prfs id credential");
        window.localStorage.removeItem(PRFS_ID_EPHEMERAL);
        return null;
      } else {
        return cred;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
