import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";

import { PrfsHandlers } from "@/types";
import { makePoseidon } from "@/utils/poseidon";
import { bigIntToBytes, snarkJsWitnessGen } from "@/utils/utils";
import { BN } from "bn.js";
import { SimpleHashCircuitPubInput, SimpleHashPublicInput } from "./public_input";
// import { deserializePublicInput } from "./serialize";

export async function proveSimpleHash(
  args: ProveArgs<SimpleHashProveArgs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array
): Promise<ProveReceipt> {
  const { inputs, eventListener } = args;
  const { hashData } = inputs;
  const { msgRaw, msgRawInt, msgHash } = hashData;

  const circuitPubInput = new SimpleHashCircuitPubInput(msgHash);
  const publicInput = new SimpleHashPublicInput(msgRaw, msgRawInt, circuitPubInput);

  const witnessGenInput = {
    msgRawInt,
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

export async function verifyMembership(
  args: VerifyArgs,
  handlers: PrfsHandlers,
  circuit: Uint8Array
) {
  const { proveResult } = args;
  const { proof, publicInputSer } = proveResult;

  const publicInput = SimpleHashPublicInput.deserialize(publicInputSer);
  // const isPubInputValid = verifyEffEcdsaPubInput(publicInput as MembershipProofPublicInput);

  let isProofValid;
  isProofValid = await handlers.verify(circuit, proof, publicInput.circuitPubInput.serialize());
  isProofValid = false;

  return isProofValid;
}

export interface SimpleHashProveArgs {
  hashData: {
    msgRaw: string;
    msgRawInt: bigint;
    msgHash: bigint;
  };
}
