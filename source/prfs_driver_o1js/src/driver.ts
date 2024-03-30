import {
  CircuitDriver,
  DriverEventListener,
  ProveArgs,
  ProveReceipt,
  ProveResult,
  VerifyArgs,
} from "@taigalabs/prfs-driver-interface";
import { MERKLE_SIG_POS_RANGE_V1, SIMPLE_HASH_V1 } from "@taigalabs/prfs-circuit-interface";
import { BuildStatus, O1jsDriverCtorArgs, O1jsDriverProperties } from "./types";

// import {
//   PrfsHandlers,
//   AsyncHashFn,
//   BuildStatus,
//   SpartanDriverCtorArgs,
//   SpartanCircomDriverProperties,
// } from "./types";
// import { initWasm } from "./wasm_wrapper/load_worker";
// import { fetchAsset } from "./utils/fetch";

export default class O1jsDriver implements CircuitDriver {
  static async newInstance(
    driverProps: O1jsDriverProperties,
    eventListener: DriverEventListener,
  ): Promise<CircuitDriver> {
    console.log("Creating a driver instance, props: %o", driverProps);

    const {
      transactionFee,
      zkAppAddr,
    } = driverProps;

    eventListener({
      type: "LOAD_DRIVER_SUCCESS",
      payload: {
        artifactCount: 2,
      },
    });

    const args: O1jsDriverCtorArgs = {
      transactionFee,
      zkAppAddr,
    };
    return new O1jsDriver(args);
  }

  private constructor(args: O1jsDriverCtorArgs) {
    // this.handlers = args.handlers;

    // if (args.circuit === undefined) {
    //   throw new Error("Spartan cannot be instantiated without circuit");
    // }

    // if (args.wtnsGen === undefined) {
    //   throw new Error("Spartan cannot be instantiated without wtnsGen");
    // }

    // this.circuit = args.circuit;
    // this.wtnsGen = args.wtnsGen;
  }

  getArtifactCount(): number {
    return 0;
  }

  async getBuildStatus(): Promise<BuildStatus> {
    return {}
  }

  // async makeMerkleProof(leaves: string[], leafIdx: BigInt, depth: number) {
  //   return this.handlers.makeMerkleProof(leaves, leafIdx, depth);
  // }

  // async newTree(depth: number, hash: AsyncHashFn): Promise<Tree> {
  //   return await Tree.newInstance(depth, hash);
  // }

  async prove(args: ProveArgs<any>): Promise<ProveResult> {
    try {
      switch (args.circuitTypeId) {
        case "merkle_sig_pos_range_v1": {
          const { proveMembership } = await import("./proof_types/merkle_sig_pos_range");

          return proveMembership(args,);
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
      switch (args.circuitTypeId) {
        // case "merkle_sig_pos_range_v1": {
        //   const { verifyMembership } = await import(
        //     "./proof_types/merkle_sig_pos_range/merkle_sig_pos_range_v1"
        //   );

        //   return verifyMembership(args, this.handlers, this.circuit);
        // }
        default:
          throw new Error(`Unknown circuit type: ${args.circuitTypeId}`);
      }
    } catch (err) {
      console.error("Error verifying a proof, err: %o", err);

      return Promise.reject(err);
    }
  }
}
