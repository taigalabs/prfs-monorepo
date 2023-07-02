import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { MembershipProver2 } from "./core/membership_prover2";
import { MembershipVerifier } from "./core/membership_verifier";
import { ProverConfig, VerifyConfig, PrfsHandlers, AsyncHashFn } from "./types";
import { initWasm } from "./wasm_wrapper";

export class Prfs {
  isInitilized: boolean;
  handlers: PrfsHandlers;

  constructor(handlers: PrfsHandlers) {
    this.isInitilized = true;
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

  newMembershipVerifier(options: VerifyConfig) {
    return new MembershipVerifier(options, this.handlers);
  }
}
