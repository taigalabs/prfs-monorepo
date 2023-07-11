import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { MembershipProofGen } from "./proof_gen/membership_proof_gen";
import { PrfsHandlers, AsyncHashFn } from "./types";

export class Prfs {
  isInitilized: boolean;
  handlers: PrfsHandlers;

  constructor(handlers: PrfsHandlers) {
    this.isInitilized = true;
    this.handlers = handlers;
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

  newMembershipProofGen(
    witnessGenWasmUrl: string,
    circuitUrl: string,
  ) {
    return new MembershipProofGen(
      witnessGenWasmUrl,
      circuitUrl,
      this.handlers,
    );
  }
}
