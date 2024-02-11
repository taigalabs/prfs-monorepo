import { CircuitTypeId } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeId";
import { DriverId } from "@taigalabs/prfs-driver-interface";

export function loadCircuitArtifactURIs(circuitTypeId: CircuitTypeId, driverId: DriverId) {
  switch (circuitTypeId) {
    case "merkle_sig_pos_range_v1": {
      if (driverId === "spartan_circom_v1") {
        return {};
      } else {
        throw new Error("Currently only spartan_circuit_v1 is supported");
      }
    }
  }
}
