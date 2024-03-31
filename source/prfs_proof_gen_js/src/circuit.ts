import { resolveCircuitUrl } from "@taigalabs/prfs-circuit-artifact-uri-resolver";
import { CircuitTypeId } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeId";
import { CircuitDriverId } from "@taigalabs/prfs-driver-interface/bindings/CircuitDriverId";

export function loadCircuitArtifactURIs(
  assetEndpoint: string,
  circuitTypeId: CircuitTypeId,
  driverId: CircuitDriverId,
) {
  switch (circuitTypeId) {
    case "merkle_sig_pos_range_v1": {
      if (driverId === "spartan_circom_v1") {
        const wtnsGenUrl = resolveCircuitUrl(assetEndpoint, circuitTypeId);
        return {};
      } else {
        throw new Error("Currently only spartan_circuit_v1 is supported");
      }
    }
    default:
      throw new Error(`This circuit type isn't supported yet, circuitTypeId: ${circuitTypeId}`);
  }
}
