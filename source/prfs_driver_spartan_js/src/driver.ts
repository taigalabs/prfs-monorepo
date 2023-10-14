import {
  CircuitDriver,
  ProveArgs,
  ProveReceipt,
  VerifyArgs,
  SpartanMerkleProof,
} from "@taigalabs/prfs-driver-interface";

import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { PrfsHandlers, AsyncHashFn, BuildStatus } from "./types";
import { PublicInput, verifyEffEcdsaPubInput } from "./helpers/public_input";
import { deserializePublicInput } from "./serialize";

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

  async hash(args: bigint[]): Promise<bigint> {
    const poseidon = makePoseidon(this.handlers);
    const ret = await poseidon(args);

    return ret;
  }

  async newTree(depth: number, hash: AsyncHashFn): Promise<Tree> {
    return await Tree.newInstance(depth, hash);
  }

  async prove(args: ProveArgs<MembershipProveInputs>): Promise<ProveReceipt> {
    try {
      // const { inputs, circuitType, eventListener } = args;

      console.log(11, args.circuitTypeId);

      switch (args.circuitTypeId) {
        case "SIMPLE_HASH_1": {
          const { proveSimpleHash } = await import("./prove/simple_hash");

          return proveSimpleHash(args, this.handlers, this.wtnsGen, this.circuit);
        }
        case "MEMBERSHIP_PROOF_1": {
          const { proveMembership } = await import("./prove/membership_proof_1");

          return proveMembership(args, this.handlers, this.wtnsGen, this.circuit);
        }
        default:
          throw new Error(`Unknown circuit type: ${args.circuitTypeId}`);
      }
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
