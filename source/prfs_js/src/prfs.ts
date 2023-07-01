import { PrfsWasmType } from "./wasm_wrapper/types";
import { Tree } from "./helpers/tree";
import { Poseidon } from "./helpers/poseidon";
import { MembershipProver2 } from "./core/membership_prover2";
import { ProverConfig, PrfsHandlers } from "./types";
import { initWasm } from "./wasm_wrapper";

export class Prfs {
  isInitilized: boolean;
  // wasm: PrfsWasmType;
  handlers: PrfsHandlers;

  constructor(handlers: PrfsHandlers) {
    this.isInitilized = true;
    // this.wasm = wasm;
    this.handlers = handlers;
  }

  static async newInstance() {
    let handlers = await initWasm();
    return new Prfs(handlers);
  }

  newTree(depth: number, poseidon: Poseidon): Tree {
    return new Tree(depth, poseidon);
  }

  // newPoseidon(): Poseidon {
  //   return new Poseidon(this.wasm);
  // }

  // newMembershipProver(options: ProverConfig) {
  //   return new MembershipProver2(options, this.wasm);
  // }
}
