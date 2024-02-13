import { resolveCircuitUrl } from "@taigalabs/prfs-circuit-artifacts-uri-resolver";
import { CircuitTypeId } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeId";
import { DriverId } from "@taigalabs/prfs-driver-interface";

export function loadCircuitArtifactURIs(
  assetEndpoint: string,
  circuitTypeId: CircuitTypeId,
  driverId: DriverId,
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
