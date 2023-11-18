import { PrfsProofSnapItem } from "@taigalabs/prfs-entities/bindings/PrfsProofSnapItem";

import type { State } from "./utils";

export type BaseParams = { encrypted?: boolean };

/**
 * The parameters for the `setState` JSON-RPC method.
 * The current state will be merged with the new state.
 */
// export type AddProofParams = BaseParams & Partial<State>;
export type AddProofParams = BaseParams & {
  proof: PrfsProofSnapItem;
};
// export type AddProofParams = {
//   proof: PrfsProof;
// };

// export interface PrfsProof {
//   label: string;
//   public_inputs: string[];
//   url: string;
// }
