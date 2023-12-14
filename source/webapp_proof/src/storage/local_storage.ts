import { makeColor } from "@taigalabs/prfs-crypto-js";
import { PrfsIdSignInSuccessPayload } from "@taigalabs/prfs-id-sdk-web";

export type PrfsProofId = string;
export interface LocalPrfsProofCredential {
  id: string;
  publicKey: string; // encrpyted
  avatarColor: string;
}

const PRFS_PROOF_KEY = "prfs_proof";

export function persistPrfsProofCredential(
  prfsIdSignInSuccessPayload: PrfsIdSignInSuccessPayload,
): LocalPrfsProofCredential {
  const avatarColor = makeColor(prfsIdSignInSuccessPayload.id);
  const credential: LocalPrfsProofCredential = {
    id: prfsIdSignInSuccessPayload.id,
    publicKey: prfsIdSignInSuccessPayload.publicKey,
    avatarColor,
  };
  const value = JSON.stringify(credential);

  console.log("Persisting Prfs proof credential", prfsIdSignInSuccessPayload);
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
