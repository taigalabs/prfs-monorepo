// export * from "./types";
export * from "./helpers/public_input";
export * from "./core/membership_verifier";
export * from "./config";

import { PrfsWasmType } from "./wasm_wrapper/types";
import { initPrfsWasm } from "./wasm_wrapper";
import { Tree } from "./helpers/tree";
import * as prfsWasm from "./wasm_build/build/prfs_wasm";
import { Poseidon } from "./helpers/poseidon";
import { MembershipProver2 } from "./core/membership_prover2";
import { IProver, MerkleProof, NIZK, ProverConfig } from "./types";

// declare type Foo = typeof import("./wasm_build/prfs_wasm");

export class Prfs {
  isInitilized: boolean;
  wasm: PrfsWasmType;

  private constructor(wasm: PrfsWasmType) {
    this.isInitilized = true;
    this.wasm = wasm;
  }

  static async newInstance() {
    let wasm = await initPrfsWasm();
    let p = new Prfs(wasm);
    return p;
  }

  newTree(depth: number, poseidon: Poseidon): Tree {
    return new Tree(depth, poseidon);
  }

  newPoseidon(): Poseidon {
    return new Poseidon(prfsWasm);
  }

  newMembershipProver(options: ProverConfig) {
    return new MembershipProver2(options, prfsWasm);
  }
}
