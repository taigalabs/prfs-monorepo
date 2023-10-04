import {
  CircuitDriver,
  ProveArgs,
  ProveResult,
  ProveReceipt,
  VerifyArgs,
  SpartanMerkleProof,
} from "@taigalabs/prfs-driver-interface";
import { BN } from "bn.js";

import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { PrfsHandlers, AsyncHashFn, BuildStatus } from "./types";
import { fromSig, snarkJsWitnessGen } from "./helpers/utils";
import {
  CircuitPubInput,
  PublicInput,
  SECP256K1_P,
  computeEffEcdsaPubInput2,
  verifyEffEcdsaPubInput,
} from "./helpers/public_input";
import { deserializePublicInput, serializePublicInput } from "./serialize";

export default class SpartanDriver implements CircuitDriver {
  handlers: PrfsHandlers;
  circuit: Uint8Array;
  wtnsGen: Uint8Array;

  constructor(args: SpartanDriverCtorArgs) {
    this.handlers = args.handlers;

    if (args.circuit === undefined) {
      throw new Error("Spartan cannot be instantiated without circuit");
    }

    if (args.wtnsGen === undefined) {
      throw new Error("Spartan cannot be instantiated without wtnsGen");
    }

    this.circuit = args.circuit;
    this.wtnsGen = args.wtnsGen;
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

  async prove(args: ProveArgs<MembershipProveInputs>): Promise<ProveReceipt> {
    try {
      const { inputs, eventListener } = args;
      const { sigData, merkleProof } = inputs;
      const { msgRaw, msgHash, sig } = sigData;
      // console.log("inputs: %o", inputs);

      const { r, s, v } = fromSig(sig);

      const poseidon = this.newPoseidon();
      const serialNo = await poseidon([s, BigInt(0)]);

      const effEcdsaPubInput = computeEffEcdsaPubInput2(r, v, msgHash);

      eventListener("debug", "Computed ECDSA pub input");

      const circuitPubInput = new CircuitPubInput(
        merkleProof.root,
        effEcdsaPubInput.Tx,
        effEcdsaPubInput.Ty,
        effEcdsaPubInput.Ux,
        effEcdsaPubInput.Uy,
        serialNo
      );

      const publicInput = new PublicInput(r, v, msgRaw, msgHash, circuitPubInput);
      const m = new BN(msgHash).mod(SECP256K1_P);

      const witnessGenInput = {
        r,
        s,
        m: BigInt(m.toString()),

        // merkle root
        root: merkleProof.root,
        siblings: merkleProof.siblings,
        pathIndices: merkleProof.pathIndices,

        // Eff ECDSA PubInput
        Tx: effEcdsaPubInput.Tx,
        Ty: effEcdsaPubInput.Ty,
        Ux: effEcdsaPubInput.Ux,
        Uy: effEcdsaPubInput.Uy,

        serialNo,
      };

      // console.log("witnessGenInput: %o", witnessGenInput);
      const witness = await snarkJsWitnessGen(witnessGenInput, this.wtnsGen);

      eventListener("info", "Computed witness gen input");

      const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();

      const prev = performance.now();
      const proof = await this.handlers.prove(this.circuit, witness.data, circuitPublicInput);
      const now = performance.now();

      return {
        duration: now - prev,
        proveResult: {
          proof,
          publicInputSer: serializePublicInput(publicInput),
        },
      };
    } catch (err) {
      console.error("Error creating a proof, err: %o", err);

      return Promise.reject(err);
    }
  }

  async verify(args: VerifyArgs): Promise<boolean> {
    try {
      const { inputs } = args;
      const { proof, publicInputSer } = inputs;

      const publicInput = deserializePublicInput(publicInputSer);
      const isPubInputValid = verifyEffEcdsaPubInput(publicInput as PublicInput);

      let isProofValid;
      isProofValid = await this.handlers.verify(
        this.circuit,
        proof,
        publicInput.circuitPubInput.serialize()
      );
      isProofValid = false;

      return isProofValid && isPubInputValid;
    } catch (err) {
      console.error("Error verifying a proof, err: %o", err);

      return Promise.reject(err);
    }
  }
}

export interface SpartanDriverCtorArgs {
  handlers: PrfsHandlers;
  // wtnsGenUrl: string;
  circuit: Uint8Array;
  wtnsGen: Uint8Array;
}

export interface MembershipProveInputs {
  sigData: {
    msgRaw: string;
    msgHash: Buffer;
    sig: string;
  };
  merkleProof: SpartanMerkleProof;
}
