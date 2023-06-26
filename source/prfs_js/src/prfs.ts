export * from "./types";
export * from "./helpers/public_input";
export * from "./core/membership_verifier";
export * from "./helpers/poseidon";
export * from "./config";

import { initPrfsWasm } from "./wasm_wrapper";
import { Tree } from "./helpers/tree";
import * as prfsWasm from "./wasm_build/prfs_wasm";
// import * as pr from "prfsWasm";

export * from "./core/membership_prover2";

export class Prfs {
  isInitilized: boolean;
  wasm: prfsWasm.InitOutput;

  private constructor(wasm: prfsWasm.InitOutput) {
    this.isInitilized = true;
    this.wasm = wasm;
  }

  static async newInstance() {
    let wasm = await initPrfsWasm();
    let p = new Prfs(wasm);
    return p;
  }

  newTree() {}

  newPoseidon() {}
}
