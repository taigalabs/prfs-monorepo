import { ProveArgs, ProveReceipt, ProveResult, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";

import { PrfsHandlers } from "@/types";
import { SimpleHashCircuitPubInput, SimpleHashPublicInput } from "./public_input";
import { snarkJsWitnessGen } from "@/utils/snarkjs";

export async function proveSimpleHash(
  args: ProveArgs<SimpleHashV1Inputs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array,
): Promise<ProveResult> {
  const { inputs, eventListener } = args;
  const { hashData } = inputs;
  const { msgRawInt, msgHash } = hashData;

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
  const proofBytes = await handlers.prove(circuit, witness.data, circuitPublicInput);
  const now = performance.now();

  return {
    duration: now - prev,
    proof: {
      proofBytes,
      publicInputSer: publicInput.serialize(),
      proofKey: "",
    },
  };
}

export async function verifyMembership(
  args: VerifyArgs,
  handlers: PrfsHandlers,
  circuit: Uint8Array,
) {
  const { proof } = args;
  const { proofBytes, publicInputSer } = proof;

  let publicInput;
  try {
    publicInput = SimpleHashPublicInput.deserialize(publicInputSer);
  } catch (err) {
    throw new Error(`Error deserializing public input, err: ${err}`);
  }

  let isProofValid;
  try {
    isProofValid = await handlers.verify(
      circuit,
      proofBytes,
      publicInput.circuitPubInput.serialize(),
    );
  } catch (err) {
    throw new Error(`Error verifying, err: ${err}`);
  }

  return isProofValid;
}
