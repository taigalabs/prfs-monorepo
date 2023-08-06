import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { MerkleProof } from "@taigalabs/async-incremental-merkle-tree";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-type/bindings/SpartanCircomDriverProperties";

import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { MembershipProofGen } from "./proof_gen/membership_proof_gen";
import { PrfsHandlers, AsyncHashFn, NIZK, BuildStatus } from "./types";
import { initWasm } from "./wasm_wrapper/load_worker";
import { fromSig, loadCircuit, snarkJsWitnessGen } from "./helpers/utils";
import {
  CircuitPubInput,
  PublicInput,
  SECP256K1_P,
  computeEffEcdsaPubInput2,
  verifyEffEcdsaPubInput,
} from "./helpers/public_input";
import { BN } from "bn.js";

export default class SpartanDriver implements CircuitDriver {
  handlers: PrfsHandlers;
  wtnsGenUrl: string;
  circuitUrl: string;

  constructor(handlers: PrfsHandlers, driverProps: SpartanCircomDriverProperties) {
    console.log("SpartanDriver, driverProps: %o", driverProps);
    this.handlers = handlers;

    if (driverProps.circuit_url === undefined) {
      throw new Error("Spartan cannot be instantiated without circuitUrl");
    }

    if (driverProps.wtns_gen_url === undefined) {
      throw new Error("Spartan cannot be instantiated without wtnsGenUrl");
    }

    this.circuitUrl = driverProps.circuit_url;
    this.wtnsGenUrl = driverProps.wtns_gen_url;

    console.log("circuitUrl: %s, wtnsGenUrl: %s", this.circuitUrl, this.wtnsGenUrl);
  }

  async getBuildStatus(): Promise<BuildStatus> {
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

  async prove(sig: string, msgHash: Buffer, merkleProof: MerkleProof): Promise<NIZK> {
    console.log("\nMembershipProver2.prove()");

    const { r, s, v } = fromSig(sig);
    const effEcdsaPubInput = computeEffEcdsaPubInput2(r, v, msgHash, s);

    // console.log("effEcdsaPubInput: {}", effEcdsaPubInput);

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

    const witnessGenInput = {
      r,
      s,
      m: BigInt(m.toString()),

      ...merkleProof,
      ...effEcdsaPubInput,
    };
    console.log("witnessGenInput: %o", witnessGenInput);

    const witness = await snarkJsWitnessGen(witnessGenInput, this.wtnsGenUrl);
    const circuitBin = await loadCircuit(this.circuitUrl);
    const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();

    const proof = await this.handlers.prove(circuitBin, witness.data, circuitPublicInput);

    return {
      proof,
      publicInput,
    };
  }

  async verify(proof: Uint8Array, publicInputSer: Uint8Array): Promise<boolean> {
    const circuitBin = await loadCircuit(this.circuitUrl);

    const publicInput = PublicInput.deserialize(publicInputSer);
    const isPubInputValid = verifyEffEcdsaPubInput(publicInput);

    let isProofValid;
    try {
      isProofValid = await this.handlers.verify(
        circuitBin,
        proof,
        publicInput.circuitPubInput.serialize()
      );
    } catch (_e) {
      isProofValid = false;
    }

    return isProofValid && isPubInputValid;
  }
}

// function bigint_to_array(n: number, k: number, x: bigint): bigint[] {
//   let mod: bigint = 1n;
//   for (var idx = 0; idx < n; idx++) {
//     mod = mod * 2n;
//   }

//   let ret: bigint[] = [];
//   var x_temp: bigint = x;
//   for (var idx = 0; idx < k; idx++) {
//     ret.push(x_temp % mod);
//     x_temp = x_temp / mod;
//   }
//   return ret;
// }
