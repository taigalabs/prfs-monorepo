import { Profiler } from "../helpers/profiler";
import { loadCircuit } from "../helpers/utils";
import { IVerifier, VerifyConfig } from "../types";
import { PublicInput, verifyEffEcdsaPubInput } from "../helpers/public_input";
import { PrfsHandlers } from "../types";

export class MembershipVerifier extends Profiler {
  circuit: string;
  handlers: PrfsHandlers;

  constructor(options: VerifyConfig, prfsHandlers: PrfsHandlers) {
    super({ enabled: options?.enableProfiler });

    this.circuit = options.circuit;
    this.handlers = prfsHandlers;
  }

  async verify(proof: Uint8Array, publicInputSer: Uint8Array): Promise<boolean> {
    this.time("Load circuit");

    const circuitBin = await loadCircuit(this.circuit);
    this.timeEnd("Load circuit");

    this.time("Verify public input");
    const publicInput = PublicInput.deserialize(publicInputSer);
    const isPubInputValid = verifyEffEcdsaPubInput(publicInput);
    this.timeEnd("Verify public input");

    this.time("Verify proof");
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

    this.timeEnd("Verify proof");
    return isProofValid && isPubInputValid;
  }
}
