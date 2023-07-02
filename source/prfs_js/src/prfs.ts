import { Tree } from "./helpers/tree";
import { Poseidon, makePoseidon } from "./helpers/poseidon";
import { MembershipProver2 } from "./core/membership_prover2";
import { ProverConfig, PrfsHandlers, PrfsWasmType, AsyncHashFn } from "./types";
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

  newPoseidon() {
    return makePoseidon(this.handlers);
  }

  async newTree(depth: number, hash: AsyncHashFn): Promise<Tree> {
    return await Tree.newInstance(depth, hash);
  }

  newMembershipProver(options: ProverConfig) {
    return new MembershipProver2(options, this.handlers);
  }
}
