import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { MembershipProofGen } from "./proof_gen/membership_proof_gen";
import { PrfsHandlers, AsyncHashFn, NIZK } from "./types";
import { initWasm } from "./wasm_wrapper/load_worker";
import { MerkleProof } from "@zk-kit/incremental-merkle-tree";
import { fromSig, loadCircuit, snarkJsWitnessGen } from "./helpers/utils";
import {
  CircuitPubInput,
  PublicInput,
  SECP256K1_P,
  computeEffEcdsaPubInput2,
} from "./helpers/public_input";
import { BN } from "bn.js";

export default class SpartanDriver {
  handlers: PrfsHandlers;

  private constructor(handlers: PrfsHandlers) {
    this.handlers = handlers;
  }

  static async newInstance(): Promise<SpartanDriver> {
    let prfsHandlers = await initWasm();
    return new SpartanDriver(prfsHandlers);
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

  async prove(
    sig: string,
    msgHash: Buffer,
    merkleProof: MerkleProof,
    circuitUrl: string,
    wtnsGenUrl: string
  ): Promise<NIZK> {
    console.log("\nMembershipProver2.prove()");

    const { r, s, v } = fromSig(sig);
    console.log("r: %s", r);
    console.log("s: %s", s);
    console.log("v: %s", v);

    const effEcdsaPubInput = computeEffEcdsaPubInput2(r, v, msgHash, s);
    console.log("effEcdsaPubInput: {}", effEcdsaPubInput);

    const circuitPubInput = new CircuitPubInput(
      merkleProof.root,
      effEcdsaPubInput.Tx,
      effEcdsaPubInput.Ty,
      effEcdsaPubInput.Ux,
      effEcdsaPubInput.Uy
    );

    const publicInput = new PublicInput(r, v, msgHash, circuitPubInput);
    console.log("publicInput: %o", publicInput);

    const m = new BN(msgHash).mod(SECP256K1_P);

    let s_array: bigint[] = bigint_to_array(64, 4, s);

    const witnessGenInput = {
      r,
      s,
      s2: s_array,
      m: BigInt(m.toString()),

      ...merkleProof,
      ...effEcdsaPubInput,
    };
    console.log("witnessGenInput: %o", witnessGenInput);

    const witness = await snarkJsWitnessGen(witnessGenInput, wtnsGenUrl);

    const circuitBin = await loadCircuit(circuitUrl);

    const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();

    let proof = await this.handlers.prove(circuitBin, witness.data, circuitPublicInput);

    return {
      proof,
      publicInput,
    };
  }
}

function bigint_to_array(n: number, k: number, x: bigint) {
  let mod: bigint = 1n;
  for (var idx = 0; idx < n; idx++) {
    mod = mod * 2n;
  }

  let ret: bigint[] = [];
  var x_temp: bigint = x;
  for (var idx = 0; idx < k; idx++) {
    ret.push(x_temp % mod);
    x_temp = x_temp / mod;
  }
  return ret;
}
