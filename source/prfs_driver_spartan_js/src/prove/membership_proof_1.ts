import { BN } from "bn.js";
import { ProveArgs, ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { MembershipProveInputs } from "../driver";
import { fromSig, snarkJsWitnessGen } from "../helpers/utils";
import { makePoseidon } from "../helpers/poseidon";
import { PrfsHandlers } from "../types";
import {
  CircuitPubInput,
  PublicInput,
  SECP256K1_P,
  computeEffEcdsaPubInput2,
} from "../helpers/public_input";
import { serializePublicInput } from "../serialize";

export async function proveMembership(
  args: ProveArgs<MembershipProveInputs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array
): Promise<ProveReceipt> {
  const { inputs, eventListener } = args;

  console.log(123123, inputs);

  const { sigData, merkleProof } = inputs;
  const { msgRaw, msgHash, sig } = sigData;
  // console.log("inputs: %o", inputs);

  const { r, s, v } = fromSig(sig);

  const poseidon = makePoseidon(handlers);
  const serialNo = await poseidon([s, BigInt(0)]);

  const effEcdsaPubInput = computeEffEcdsaPubInput2(r, v, msgHash);

  eventListener("debug", "Computed ECDSA pub input");

  const circuitPubInput = new CircuitPubInput(
    merkleProof.root,
    effEcdsaPubInput.Tx,
    effEcdsaPubInput.Ty,
    effEcdsaPubInput.Ux,
    effEcdsaPubInput.Uy,
    serialNo
  );

  const publicInput = new PublicInput(r, v, msgRaw, msgHash, circuitPubInput);
  const m = new BN(msgHash).mod(SECP256K1_P);

  const witnessGenInput = {
    r,
    s,
    m: BigInt(m.toString()),

    // merkle root
    root: merkleProof.root,
    siblings: merkleProof.siblings,
    pathIndices: merkleProof.pathIndices,

    // Eff ECDSA PubInput
    Tx: effEcdsaPubInput.Tx,
    Ty: effEcdsaPubInput.Ty,
    Ux: effEcdsaPubInput.Ux,
    Uy: effEcdsaPubInput.Uy,

    serialNo,
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
      publicInputSer: serializePublicInput(publicInput),
    },
  };
}
