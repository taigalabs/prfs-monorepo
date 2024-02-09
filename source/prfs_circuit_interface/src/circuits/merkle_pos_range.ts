import { CircuitInputType } from "@taigalabs/prfs-entities/bindings/CircuitInputType";

import { SpartanMerkleProof } from "../merkle_proof";

export const MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID = "merkle_pos_range_v1";

export const MERKLE_POS_RANGE_INPUT_TYPE_V1: CircuitInputType = "MERKLE_SIG_POS_RANGE_V1";

export const MERKLE_POS_RANGE_V1_CIRCUIT_ID =
  "0x0000000000000000000000000000000000000000000000000000000000000002";

export const MERKLE_POS_RANGE_V1_CIRCUIT_URL = `prfs://${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}/\
${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}.spartan.circuit`;

export const MERKLE_POS_RANGE_V1_WTNS_GEN_URL = `prfs://${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}/\
${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}_js/${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}.wasm`;

export interface MerklePosRangeInputs {
  leaf: bigint;
  asset_size: bigint;
  asset_size_max_limit: bigint;
  merkleProof: SpartanMerkleProof;
}
