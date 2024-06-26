import {
  CircuitDriver,
  DriverEventListener,
  ProveArgs,
  ProveResult,
  VerifyArgs,
} from "@taigalabs/prfs-driver-interface";
import { BuildStatus, O1jsDriverCtorArgs, O1jsDriverProperties } from "./types";

export default class O1jsDriver implements CircuitDriver {
  static async newInstance(
    driverProps: O1jsDriverProperties,
    eventListener: DriverEventListener,
  ): Promise<CircuitDriver> {
    console.log("Creating a driver instance, props: %o", driverProps);

    const { transactionFee, zkAppAddr } = driverProps;

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

  private constructor(args: O1jsDriverCtorArgs) {}

  getArtifactCount(): number {
    return 0;
  }

  async getBuildStatus(): Promise<BuildStatus> {
    return {};
  }

  async prove(args: ProveArgs<any>): Promise<ProveResult> {
    try {
      switch (args.circuitTypeId) {
        case "merkle_sig_pos_range_v1": {
          const { proveMembership } = await import("./proof_types/merkle_sig_pos_range");

          return proveMembership(args);
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
