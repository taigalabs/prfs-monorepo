import { Profiler } from "../helpers/profiler";
import { IProver, MerkleProof, NIZK, ProverConfig } from "../types";
import { loadCircuit, fromSig, snarkJsWitnessGen } from "../helpers/utils";
import {
  PublicInput,
  computeEffEcdsaPubInput,
  CircuitPubInput
} from "../helpers/public_input";
import wasm, { init } from "../wasm";
import {
  defaultPubkeyMembershipPConfig,
  defaultAddressMembershipPConfig
} from "../config";

/**
 * ECDSA Membership Prover
 */
export class MembershipProver extends Profiler implements IProver {
  circuit: string;
  witnessGenWasm: string;

  constructor(options: ProverConfig) {
    super({ enabled: options?.enableProfiler });

    if (
      options.circuit === defaultPubkeyMembershipPConfig.circuit ||
      options.witnessGenWasm ===
      defaultPubkeyMembershipPConfig.witnessGenWasm ||
      options.circuit === defaultAddressMembershipPConfig.circuit ||
      options.witnessGenWasm === defaultAddressMembershipPConfig.witnessGenWasm
    ) {
      console.warn(`
      Spartan-ecdsa default config warning:
      We recommend using defaultPubkeyMembershipPConfig/defaultPubkeyMembershipVConfig only for testing purposes.
      Please host and specify the circuit and witnessGenWasm files on your own server for sovereign control.
      Download files: https://github.com/personaelabs/spartan-ecdsa/blob/main/packages/lib/README.md#circuit-downloads
      `);
    }

    const isNode = typeof window === "undefined";
    if (isNode) {
      if (
        options.circuit.includes("http") ||
        options.witnessGenWasm.includes("http")
      ) {
        throw new Error(
          `An URL was given for circuit/witnessGenWasm in Node.js environment. Please specify a local path.
          `
        );
      }
    }

    this.circuit = options.circuit;
    this.witnessGenWasm = options.witnessGenWasm;
  }

  async initWasm() {
    await init();
  }

  // @ts-ignore
  async prove(
    sig: string,
    msgHash: Buffer,
    merkleProof: MerkleProof
  ): Promise<NIZK> {
    console.log("\nprove()");

    const { r, s, v } = fromSig(sig);

    // console.log("r: %s, s: %s, v: %s", r, s, v);

    const effEcdsaPubInput = computeEffEcdsaPubInput(r, v, msgHash);
    // console.log("effEcdsaPubInput: {}", effEcdsaPubInput);

    const circuitPubInput = new CircuitPubInput(
      merkleProof.root,
      effEcdsaPubInput.Tx,
      effEcdsaPubInput.Ty,
      effEcdsaPubInput.Ux,
      effEcdsaPubInput.Uy
    );
    // console.log("circuitPubInput3: %o", effEcdsaPubInput);

    const publicInput = new PublicInput(r, v, msgHash, circuitPubInput);
    // console.log('publicInput: %o', publicInput);

    const witnessGenInput = {
      s,
      ...merkleProof,
      ...effEcdsaPubInput
    };

    this.time("Generate witness");
    const witness = await snarkJsWitnessGen(
      witnessGenInput,
      this.witnessGenWasm
    );
    this.timeEnd("Generate witness");

    // console.log('witness: %o', witness);

    this.time("Load circuit");
    const circuitBin = await loadCircuit(this.circuit);
    this.timeEnd("Load circuit");

    // Get the public input in bytes
    const circuitPublicInput: Uint8Array =
      publicInput.circuitPubInput.serialize();

    this.time("Prove");
    let proof = wasm.prove(circuitBin, witness.data, circuitPublicInput);
    this.timeEnd("Prove");

    return {
      proof,
      publicInput
    };
  }
}
