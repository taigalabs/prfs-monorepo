import { BN } from "bn.js";
import {
  ProveArgs,
  ProveReceipt,
  SpartanMerkleProof,
  VerifyArgs,
} from "@taigalabs/prfs-driver-interface";

import { fromSig, snarkJsWitnessGen } from "@/utils/utils";
import { makePoseidon } from "@/utils/poseidon";
import { PrfsHandlers } from "@/types";
import {
  MembershipProofCircuitPubInput,
  MembershipProofPublicInput,
  computeEffEcdsaPubInput,
  verifyEffEcdsaPubInput,
} from "./public_input";
// import { deserializePublicInput, serializePublicInput } from "./serialize";
import { SECP256K1_P } from "@/math/secp256k1";

export async function proveMembership(
  args: ProveArgs<MembershipProveInputs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array
): Promise<ProveReceipt> {
  const { inputs, eventListener } = args;
  console.log("inputs: %o", inputs);

  const { sigData, merkleProof } = inputs;
  const { msgRaw, msgHash, sig } = sigData;

  const { r, s, v } = fromSig(sig);

  const poseidon = makePoseidon(handlers);

  let serialNo;
  try {
    serialNo = await poseidon([s, BigInt(0)]);
  } catch (err) {
    throw new Error(`Error Poseidon hashing, err: ${err}`);
  }

  const effEcdsaPubInput = computeEffEcdsaPubInput(r, v, msgHash);

  eventListener("debug", "Computed ECDSA pub input");

  const circuitPubInput = new MembershipProofCircuitPubInput(
    merkleProof.root,
    effEcdsaPubInput.Tx,
    effEcdsaPubInput.Ty,
    effEcdsaPubInput.Ux,
    effEcdsaPubInput.Uy,
    serialNo
  );

  const publicInput = new MembershipProofPublicInput(r, v, msgRaw, msgHash, circuitPubInput);
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
  let proof;
  try {
    proof = await handlers.prove(circuit, witness.data, circuitPublicInput);
  } catch (err) {
    throw new Error(`Error calling prove(), err: ${err}`);
  }
  const now = performance.now();

  const temp = await handlers.verify(circuit, proof, circuitPublicInput);
  console.log(222, temp);

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

  const publicInput = MembershipProofPublicInput.deserialize(publicInputSer);
  const isPubInputValid = verifyEffEcdsaPubInput(publicInput as MembershipProofPublicInput);

  let isProofValid;
  try {
    isProofValid = await handlers.verify(circuit, proof, publicInput.circuitPubInput.serialize());
  } catch (err) {
    throw new Error(`Error calling verify(), err: ${err}`);
  }
  isProofValid = false;

  return isProofValid && isPubInputValid;
}

export interface MembershipProveInputs {
  sigData: {
    msgRaw: string;
    msgHash: Buffer;
    sig: string;
  };
  merkleProof: SpartanMerkleProof;
}
