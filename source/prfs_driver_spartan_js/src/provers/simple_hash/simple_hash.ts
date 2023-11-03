import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { BN } from "bn.js";

import { PrfsHandlers } from "@/types";
import { makePoseidon } from "@/utils/poseidon";
import { bigIntToBytes, snarkJsWitnessGen } from "@/utils/utils";
import { SimpleHashCircuitPubInput, SimpleHashPublicInput } from "./public_input";

export async function proveSimpleHash(
  args: ProveArgs<SimpleHashProveArgs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array,
): Promise<ProveReceipt> {
  const { inputs, eventListener } = args;
  const { hashData } = inputs;
  const { msgRaw, msgRawInt, msgHash } = hashData;

  const circuitPubInput = new SimpleHashCircuitPubInput(msgHash);
  const publicInput = new SimpleHashPublicInput(circuitPubInput);

  const witnessGenInput = {
    msgRawInt,
    msgHash,
  };

  // console.log("witnessGenInput: %o", witnessGenInput);
  const witness = await snarkJsWitnessGen(witnessGenInput, wtnsGen);

  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: { type: "info", payload: "Computed witness gen input" },
  });

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

export async function verifyMembership(
  args: VerifyArgs,
  handlers: PrfsHandlers,
  circuit: Uint8Array,
) {
  const { proveResult } = args;
  const { proof, publicInputSer } = proveResult;

  let publicInput;
  try {
    publicInput = SimpleHashPublicInput.deserialize(publicInputSer);
  } catch (err) {
    throw new Error(`Error deserializing public input, err: ${err}`);
  }

  let isProofValid;
  try {
    isProofValid = await handlers.verify(circuit, proof, publicInput.circuitPubInput.serialize());
  } catch (err) {
    throw new Error(`Error verifying, err: ${err}`);
  }

  return isProofValid;
}

export interface SimpleHashProveArgs {
  hashData: {
    msgRaw: string;
    msgRawInt: bigint;
    msgHash: bigint;
  };
}
