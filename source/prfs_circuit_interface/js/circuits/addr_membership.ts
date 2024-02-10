import { SpartanMerkleProof } from "../merkle_proof";
import { SigData } from "../sig_data";

export const ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID = "addr_membership2_v1";

export const ADDR_MEMBERSHIP2_V1_CIRCUIT_URL = `prfs://${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}/\
${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}.spartan.circuit`;

export const ADDR_MEMBERSHIP2_V1_WTNS_GEN_URL = `prfs://${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}/\
${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}_js/${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}.wasm`;

export interface AddrMembershipProveInputs {
  sigData: SigData;
  merkleProof: SpartanMerkleProof;
}
