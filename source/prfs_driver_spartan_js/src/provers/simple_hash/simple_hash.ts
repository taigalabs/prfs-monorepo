import { ProveArgs, ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { PrfsHandlers } from "@/types";
import { makePoseidon } from "@/utils/poseidon";
import { bigIntToBytes, snarkJsWitnessGen } from "@/utils/utils";
import { BN } from "bn.js";
import { SimpleHashCircuitPubInput, SimpleHashPublicInput } from "./public_input";

export async function proveSimpleHash(
  args: ProveArgs<SimpleHashProveArgs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array
): Promise<ProveReceipt> {
  const { inputs, eventListener } = args;

  const { hashData } = inputs;
  const { msgRaw, msgHash } = hashData;
  console.log("hashData: %o", inputs);

  const circuitPubInput = new SimpleHashCircuitPubInput(msgHash);

  const publicInput = new SimpleHashPublicInput(circuitPubInput);

  const witnessGenInput = {
    msgRaw,
    msgHash,
  };

  // console.log("witnessGenInput: %o", witnessGenInput);
  const witness = await snarkJsWitnessGen(witnessGenInput, wtnsGen);

  eventListener("info", "Computed witness gen input");

  const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();

  const prev = performance.now();
  const proof = await handlers.prove(circuit, witness.data, circuitPublicInput);
  const now = performance.now();

  return {
    duration: now - prev,
    proveResult: {
      proof,
      publicInputSer: publicInput.serialize(),
    },
  };
}

export interface SimpleHashProveArgs {
  hashData: {
    msgRaw: bigint;
    msgHash: bigint;
  };
}
