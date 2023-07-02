import { Tree } from "./helpers/tree";
import { Poseidon } from "./helpers/poseidon";
import { MembershipProver2 } from "./core/membership_prover2";
import { ProverConfig, PrfsHandlers, PrfsWasmType, HashFn } from "./types";
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

  newPoseidon(): Poseidon {
    return new Poseidon(this.handlers);
  }

  newTree(depth: number, hash: HashFn): Tree {
    return new Tree(depth, hash);
  }

  // newMembershipProver(options: ProverConfig) {
  //   return new MembershipProver2(options, this.wasm);
  // }
}
