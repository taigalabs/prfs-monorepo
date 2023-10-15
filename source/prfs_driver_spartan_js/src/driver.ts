import {
  CircuitDriver,
  ProveArgs,
  ProveReceipt,
  VerifyArgs,
} from "@taigalabs/prfs-driver-interface";

import { Tree } from "./utils/tree";
import { makePoseidon } from "./utils/poseidon";
import { PrfsHandlers, AsyncHashFn, BuildStatus, SpartanDriverCtorArgs } from "./types";
import { PublicInput, verifyEffEcdsaPubInput } from "@/provers/membership_proof/public_input";
import { deserializePublicInput } from "@/provers/membership_proof/serialize";
import { initWasm } from "./wasm_wrapper/load_worker";
import { fetchAsset } from "./utils/utils";

export default class SpartanDriver implements CircuitDriver {
  handlers: PrfsHandlers;
  circuit: Uint8Array;
  wtnsGen: Uint8Array;

  static async newInstance(driverProps: SpartanCircomDriverProperties): Promise<CircuitDriver> {
    console.log("Creating a driver instance, props: %o", driverProps);

    let prfsHandlers;
    try {
      prfsHandlers = await initWasm();

      const ts = Date.now();
      const circuit = await fetchAsset(`${driverProps.circuit_url}?version=${ts}`);
      const wtnsGen = await fetchAsset(`${driverProps.wtns_gen_url}?version=${ts}`);

      const args: SpartanDriverCtorArgs = {
        handlers: prfsHandlers,
        wtnsGen,
        circuit,
      };

      const obj = new SpartanDriver(args);
      return obj;
    } catch (err) {
      throw err;
    }
  }

  private constructor(args: SpartanDriverCtorArgs) {
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

  async prove(args: ProveArgs<any>): Promise<ProveReceipt> {
    try {
      // const { inputs, circuitType, eventListener } = args;
      console.log(11, args.circuitTypeId);

      switch (args.circuitTypeId) {
        case "SIMPLE_HASH_1": {
          const { proveSimpleHash } = await import("./provers/simple_hash/simple_hash");

          return proveSimpleHash(args, this.handlers, this.wtnsGen, this.circuit);
        }
        case "MEMBERSHIP_PROOF_1": {
          const { proveMembership } = await import("./provers/membership_proof/membership_proof_1");

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
      console.log(11, args.circuitTypeId);

      switch (args.circuitTypeId) {
        case "SIMPLE_HASH_1": {
          break;
        }
        case "MEMBERSHIP_PROOF_1": {
          const { verifyMembership } = await import(
            "./provers/membership_proof/membership_proof_1"
          );

          break;
        }
        default:
          throw new Error(`Unknown circuit type: ${args.circuitTypeId}`);
      }

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

export interface SpartanCircomDriverProperties {
  instance_path: string;
  wtns_gen_url: string;
  circuit_url: string;
}
