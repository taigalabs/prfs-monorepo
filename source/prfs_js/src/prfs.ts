export * from "./types";
export * from "./helpers/public_input";
export * from "./core/membership_verifier";
export * from "./helpers/poseidon";
export * from "./config";

import { initWasm } from "./wasm_wrapper";
import { Tree } from "./helpers/tree";

export * from "./core/membership_prover2";

export class Prfs {
  isInitilized: boolean = false;

  async init() {
    await initWasm();
    this.isInitilized = true;
  }

  newTree() {

  }

  newPoseidon() {

  }
}
