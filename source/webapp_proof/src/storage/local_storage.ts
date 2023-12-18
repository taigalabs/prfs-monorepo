import { makeColor } from "@taigalabs/prfs-crypto-js";
import { PrfsIdSignInSuccessPayload } from "@taigalabs/prfs-id-sdk-web";

export type PrfsProofId = string;
export interface LocalPrfsProofCredential {
  account_id: string;
  public_key: string; // encrpyted
  avatar_color: string;
}

const PRFS_PROOF_KEY = "prfs_proof";

export function persistPrfsProofCredential(
  credential: LocalPrfsProofCredential,
): LocalPrfsProofCredential {
  const value = JSON.stringify(credential);

  console.log("Persisting Prfs proof credential", credential);
  window.localStorage.setItem(PRFS_PROOF_KEY, value);
  return credential;
}

export function loadLocalPrfsProofCredential(): LocalPrfsProofCredential | null {
  const val = window.localStorage.getItem(PRFS_PROOF_KEY);

  try {
    if (val) {
      const obj: LocalPrfsProofCredential = JSON.parse(val);
      return obj;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function removeLocalPrfsProofCredential() {
  window.localStorage.removeItem(PRFS_PROOF_KEY);
}
