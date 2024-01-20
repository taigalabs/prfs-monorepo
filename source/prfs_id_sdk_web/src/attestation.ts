const ATST = "atst";

export function makeAccAttestation({ attType, destination, id, cm }: MakeAttestationArgs) {
  return `${ATST}-${attType} ${destination} ${id} ${cm}`;
}

export interface MakeAttestationArgs {
  attType: string;
  destination: string;
  id: string;
  cm: string;
}
