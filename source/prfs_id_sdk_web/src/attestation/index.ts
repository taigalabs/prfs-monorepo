const ATST = "atst";

export function makeAccAttestation({ attType, destination, id, cm }: MakeAttestationArgs) {
  return `${ATST}-${attType} ${destination} ${id} ${cm}`;
}

export const PRFS_ATTESTATION_STEM = "PRFS_ATST_";

export const GROUP_MEMBER = "group_member";

export const WALLET_CACHE_KEY = "wallet_cache_key";
// export const WALLET_CM_STEM = "WALLET";

export interface MakeAttestationArgs {
  attType: string;
  destination: string;
  id: string;
  cm: string;
}
