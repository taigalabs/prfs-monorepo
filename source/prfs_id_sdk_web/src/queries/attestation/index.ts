const ATST = "atst";

export function makeAccAttestation({ attType, destination, id, cm }: MakeAttestationArgs) {
  return `${ATST}-${attType} ${destination} ${id} ${cm}`;
}

export const PRFS_ATTESTATION_STEM = "PRFS_ATST_";

export interface MakeAttestationArgs {
  attType: string;
  destination: string;
  id: string;
  cm: string;
}
