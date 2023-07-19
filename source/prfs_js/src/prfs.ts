import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { MembershipProofGen } from "./proof_gen/membership_proof_gen";
import { PrfsHandlers, AsyncHashFn } from "./types";

import { initWasm } from "./wasm_wrapper/load_es";

export class Prfs {
  isInitilized: boolean;
  handlers: PrfsHandlers;

  private constructor(handlers: PrfsHandlers) {
    this.isInitilized = true;
    this.handlers = handlers;
  }

  static async newInstance(): Promise<Prfs> {
    let prfsHandlers = await initWasm();
    return new Prfs(prfsHandlers);
  }

  async getBuildStatus() {
    return this.handlers.getBuildStatus();
  }

  async makeMerkleProof(leaves: string[], leafIdx: BigInt, depth: number) {
    return this.handlers.makeMerkleProof(leaves, leafIdx, depth);
  }

  newPoseidon() {
    return makePoseidon(this.handlers);
  }

  async newTree(depth: number, hash: AsyncHashFn): Promise<Tree> {
    return await Tree.newInstance(depth, hash);
  }

  newMembershipProofGen(witnessGenWasmUrl: string, circuitUrl: string) {
    return new MembershipProofGen(witnessGenWasmUrl, circuitUrl, this.handlers);
  }
}
