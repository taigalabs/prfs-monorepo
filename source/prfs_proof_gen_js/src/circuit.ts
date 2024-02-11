import { CircuitTypeId } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeId";

export function loadCircuitArtifactURIs(circuitTypeId: CircuitTypeId) {
  switch (circuitTypeId) {
    case "merkle_sig_pos_range_v1": {
      return {};
    }
  }
}
