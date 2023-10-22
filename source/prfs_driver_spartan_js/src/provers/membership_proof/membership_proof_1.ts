import { BN } from "bn.js";
import {
  ProveArgs,
  ProveReceipt,
  SigData,
  SpartanMerkleProof,
  VerifyArgs,
} from "@taigalabs/prfs-driver-interface";
import { bufferToHex, toBuffer } from "@ethereumjs/util";

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

  const { sigData, merkleProof } = inputs;
  const { msgRaw, msgHash, sig } = sigData;

  const { r, s, v } = fromSig(sig);

  console.log("inputs: %o, rsv", inputs, r, s, v);

  const poseidon = makePoseidon(handlers);

  let serialNo;
  try {
    serialNo = await poseidon([s, BigInt(0)]);
  } catch (err) {
    throw new Error(`Error Poseidon hashing, err: ${err}`);
  }

  const effEcdsaPubInput = computeEffEcdsaPubInput(r, v, toBuffer(msgHash));

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
  const m = new BN(toBuffer(msgHash)).mod(SECP256K1_P);

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

  // const a1 = publicInput.serialize();
  // console.log("a1", a1);
  // const a2 = MembershipProofPublicInput.deserialize(a1);
  // console.log("a2", a2);

  // const a3 = a2.circuitPubInput.serialize();
  // console.log("a3", a3, circuitPublicInput);
  // console.log("circuitPublicInput", circuitPublicInput);

  // const temp = await handlers.verify(circuit, proof, circuitPublicInput);
  // console.log(222, temp);

  // const temp2 = await handlers.verify(circuit, proof, a3);
  // console.log(333, temp2);

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

  console.log("verifyMembership", proof, publicInputSer);

  const publicInput = MembershipProofPublicInput.deserialize(publicInputSer);
  console.log("publicInput: %o", publicInput);

  const isPubInputValid = verifyEffEcdsaPubInput(publicInput as MembershipProofPublicInput);

  console.log(111, isPubInputValid);

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
  sigData: SigData;
  merkleProof: SpartanMerkleProof;
}
