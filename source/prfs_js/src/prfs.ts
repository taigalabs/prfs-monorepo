import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { MembershipProver2 } from "./core/membership_prover2";
import { MembershipVerifier } from "./core/membership_verifier";
import { ProverConfig, VerifyConfig, PrfsHandlers, AsyncHashFn, MerkleProof } from "./types";
import { numToUint8Array } from "./helpers/utils";

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

  newMembershipProver(
    witnessGenWasmUrl: string,
    circuitUrl: string,
  ) {
    return new MembershipProver2(
      witnessGenWasmUrl,
      circuitUrl,
      this.handlers,
    );
  }

  newMembershipVerifier(options: VerifyConfig) {
    return new MembershipVerifier(options, this.handlers);
  }
}
