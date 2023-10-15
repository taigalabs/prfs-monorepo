import { ProveArgs, ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { PrfsHandlers } from "@/types";
import { makePoseidon } from "@/utils/poseidon";
import { bigIntToBytes, snarkJsWitnessGen } from "@/utils/utils";
import { BN } from "bn.js";
import { SimpleHashPublicInput } from "./public_input";

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

  // const poseidon = makePoseidon(handlers);
  // const serialNo = await poseidon([s, BigInt(0)]);

  // eventListener("debug", "Computed ECDSA pub input");

  // const circuitPubInput = new CircuitPubInput(
  //   merkleProof.root,
  //   effEcdsaPubInput.Tx,
  //   effEcdsaPubInput.Ty,
  //   effEcdsaPubInput.Ux,
  //   effEcdsaPubInput.Uy,
  //   serialNo
  // );

  const publicInput = new SimpleHashPublicInput(msgRaw, msgHash, circuitPubInput);
  // const m = new BN(msgRaw).mod(SECP256K1_P);

  const witnessGenInput = {
    msgRaw,
    msgHash,
  };

  // console.log("witnessGenInput: %o", witnessGenInput);
  const witness = await snarkJsWitnessGen(witnessGenInput, wtnsGen);

  eventListener("info", "Computed witness gen input");

  // const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();
  const circuitPublicInput = new Uint8Array(32 * 1);
  circuitPublicInput.set(bigIntToBytes(msgHash, 32), 0);

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
