import {
  CircuitDriver,
  DriverEventListener,
  ProveArgs,
  ProveResult,
  VerifyArgs,
} from "@taigalabs/prfs-driver-interface";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-interface/bindings/SpartanCircomDriverProperties";

import { PrfsHandlers, BuildStatus, SpartanDriverCtorArgs } from "./types";
import { initWasm } from "./wasm_wrapper/load_worker";
import { fetchAsset } from "./utils/fetch";

export default class SpartanDriver implements CircuitDriver {
  handlers: PrfsHandlers;
  circuit: Uint8Array;
  wtnsGen: Uint8Array;

  static async newInstance(
    driverProps: SpartanCircomDriverProperties,
    eventListener: DriverEventListener,
  ): Promise<CircuitDriver | null> {
    console.log("Creating a driver instance, props: %o", driverProps);

    let prfsHandlers;
    try {
      prfsHandlers = await initWasm();

      const { circuit_url, circuit_len, wtns_gen_url, wtns_gen_len, version } = driverProps;

      let vs: string;
      if (version) {
        vs = version;
      } else {
        console.log("Version is not found in driver props, falling back to timestamp");
        const ts = Date.now();
        vs = ts.toString();
      }

      const [circuit, wtnsGen] = await Promise.all([
        fetchAsset("circuit", `${circuit_url}?version=${vs}`, eventListener, Number(circuit_len)),
        fetchAsset("wtnsGen", `${wtns_gen_url}?version=${vs}`, eventListener, Number(wtns_gen_len)),
      ]);

      eventListener({
        type: "LOAD_DRIVER_SUCCESS",
        payload: {
          artifactCount: 2,
        },
      });

      const args: SpartanDriverCtorArgs = {
        handlers: prfsHandlers,
        wtnsGen,
        circuit,
      };

      const obj = new SpartanDriver(args);
      return obj;
    } catch (err: any) {
      console.error(err);

      eventListener({
        type: "LOAD_DRIVER_ERROR",
        payload: {
          message: err.toString(),
        },
      });

      return Promise.resolve(null);
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

  getArtifactCount(): number {
    return 2;
  }

  async getBuildStatus(): Promise<BuildStatus> {
    return this.handlers.getBuildStatus();
  }

  async prove(args: ProveArgs<any>): Promise<ProveResult> {
    try {
      switch (args.circuitTypeId) {
        case "simple_hash_v1": {
          const { proveSimpleHash } = await import("./proof_types/simple_hash/simple_hash");

          return proveSimpleHash(args, this.handlers, this.wtnsGen, this.circuit);
        }
        case "addr_membership_v1": {
          const { proveMembership } = await import(
            "./proof_types/membership_proof/membership_proof_1"
          );

          return proveMembership(args, this.handlers, this.wtnsGen, this.circuit);
        }
        case "merkle_sig_pos_range_v1": {
          const { proveMembership } = await import(
            "./proof_types/merkle_sig_pos_range/merkle_sig_pos_range_v1"
          );

          return proveMembership(args, this.handlers, this.wtnsGen, this.circuit);
        }
        case "merkle_sig_pos_exact_v1": {
          const { proveMembership } = await import(
            "./proof_types/merkle_sig_pos_exact/merkle_sig_pos_exact_v1"
          );

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
      switch (args.circuitTypeId) {
        case "simple_hash_v1": {
          const { verifyMembership } = await import("./proof_types/simple_hash/simple_hash");

          return verifyMembership(args, this.handlers, this.circuit);
        }
        case "addr_membership_v1": {
          const { verifyMembership } = await import(
            "./proof_types/membership_proof/membership_proof_1"
          );

          return verifyMembership(args, this.handlers, this.circuit);
        }
        case "merkle_sig_pos_range_v1": {
          const { verifyMembership } = await import(
            "./proof_types/merkle_sig_pos_range/merkle_sig_pos_range_v1"
          );

          return verifyMembership(args, this.handlers, this.circuit);
        }
        case "merkle_sig_pos_exact_v1": {
          const { verifyMembership } = await import(
            "./proof_types/merkle_sig_pos_exact/merkle_sig_pos_exact_v1"
          );

          return verifyMembership(args, this.handlers, this.circuit);
        }
        default:
          throw new Error(`Unknown circuit type: ${args.circuitTypeId}`);
      }
    } catch (err) {
      console.error("Error verifying a proof, err: %o", err);

      return Promise.reject(err);
    }
  }
}
