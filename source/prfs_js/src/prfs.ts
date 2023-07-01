import { PrfsWasmType } from "./wasm_wrapper/types";
import { Tree } from "./helpers/tree";
import { Poseidon } from "./helpers/poseidon";
import { MembershipProver2 } from "./core/membership_prover2";
import { ProverConfig } from "./types";

export class Prfs {
  isInitilized: boolean;
  wasm: PrfsWasmType;

  public constructor(wasm: PrfsWasmType) {
    this.isInitilized = true;
    this.wasm = wasm;
  }

  newTree(depth: number, poseidon: Poseidon): Tree {
    return new Tree(depth, poseidon);
  }

  newPoseidon(): Poseidon {
    return new Poseidon(this.wasm);
  }

  newMembershipProver(options: ProverConfig) {
    return new MembershipProver2(options, this.wasm);
  }
}
