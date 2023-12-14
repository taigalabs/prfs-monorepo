import { PrfsIdSignInSuccessPayload } from "@taigalabs/prfs-id-sdk-web";

export type PrfsProofId = string;
export interface LocalPrfsProofCredential {
  id: string;
  publicKey: string; // encrpyted
}

const PRFS_PROOF_KEY = "prfs_proof";

export async function persistPrfsProofCredential(
  prfsIdSignInSuccessPayload: PrfsIdSignInSuccessPayload,
) {
  const credential: LocalPrfsProofCredential = {
    id: prfsIdSignInSuccessPayload.id,
    publicKey: prfsIdSignInSuccessPayload.publicKey,
  };
  const value = JSON.stringify(credential);
  console.log("Persisting Prfs proof credential", prfsIdSignInSuccessPayload);
  window.localStorage.setItem(PRFS_PROOF_KEY, value);
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
