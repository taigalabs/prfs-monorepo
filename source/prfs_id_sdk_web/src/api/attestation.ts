const ATST = "atst";

export function makeAttestation({ attType, provenance, destination, id, cm }: MakeAttestationArgs) {
  return `${ATST} ${attType} ${provenance} ${destination} ${id} ${cm}`;
}

export interface MakeAttestationArgs {
  attType: string;
  provenance: string;
  destination: string;
  id: string;
  cm: string;
}
