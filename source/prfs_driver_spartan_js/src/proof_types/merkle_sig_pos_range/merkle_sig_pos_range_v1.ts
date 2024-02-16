import { BN } from "bn.js";
import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { toBuffer } from "@ethereumjs/util";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";

import { fromSig, snarkJsWitnessGen } from "@/utils/utils";
import { makePoseidon } from "@/utils/poseidon";
import { PrfsHandlers } from "@/types";
import { MerklePosRangeCircuitPubInput, MerklePosRangePublicInput } from "./public_input";
import { SECP256K1_P } from "@/math/secp256k1";
import {
  bytesToBigInt,
  bytesToNumberLE,
  poseidon_2,
  poseidon_2_bigint_le,
  stringToBigInt,
  uint8ArrayToNum,
} from "@taigalabs/prfs-crypto-js";

export async function proveMembership(
  args: ProveArgs<MerkleSigPosRangeV1Inputs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array,
): Promise<ProveReceipt> {
  const { inputs, eventListener } = args;
  console.log("inputs: %o", inputs);

  const {
    // sigLower,
    // sigUpper,
    sigBytes,
    leaf,
    merkleProof,
    assetSize,
    assetSizeLessThan,
    assetSizeGreaterEqThan,
    nonce,
  } = inputs;

  const sigUpper = bytesToNumberLE(sigBytes.subarray(0, 32));
  const sigLower = bytesToNumberLE(sigBytes.subarray(32, 64));

  // const nonceInt = stringToBigInt(nonce);
  const nonceHash = await poseidon_2(nonce);
  const nonceInt = bytesToBigInt(nonceHash);
  // const serialNo = await poseidon_2_bigint_le()

  // const poseidon = makePoseidon(handlers);

  // let serialNo;
  // try {
  //   serialNo = await poseidon([s, BigInt(0)]);
  // } catch (err) {
  //   throw new Error(`Error Poseidon hashing, err: ${err}`);
  // }

  // const effEcdsaPubInput = computeEffEcdsaPubInput(r, v, toBuffer(msgHash));

  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: { type: "info", payload: "Computed ECDSA pub input" },
  });

  const circuitPubInput = new MerklePosRangeCircuitPubInput(
    merkleProof.root,
    // effEcdsaPubInput.Tx,
    // effEcdsaPubInput.Ty,
    // effEcdsaPubInput.Ux,
    // effEcdsaPubInput.Uy,
    // serialNo,
  );

  const publicInput = new MerklePosRangePublicInput(circuitPubInput);
  // const m = new BN(toBuffer(msgHash)).mod(SECP256K1_P);

  const witnessGenInput = {
    sigUpper,
    sigLower,
    leaf,
    assetSize,
    assetSizeGreaterEqThan,
    assetSizeLessThan,

    root: merkleProof.root,
    siblings: merkleProof.siblings,
    pathIndices: merkleProof.pathIndices,

    // nonce,
    // serialNo,
  };

  console.log("witnessGenInput", witnessGenInput);

  // console.log("witnessGenInput: %o", witnessGenInput);
  const witness = await snarkJsWitnessGen(witnessGenInput, wtnsGen);

  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: "Computed witness gen input",
    },
  });

  const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();

  const prev = performance.now();
  let proofBytes;
  try {
    proofBytes = await handlers.prove(circuit, witness.data, circuitPublicInput);
  } catch (err) {
    throw new Error(`Error calling prove(), err: ${err}`);
  }
  const now = performance.now();

  return {
    duration: now - prev,
    proof: {
      proofBytes,
      publicInputSer: publicInput.serialize(),
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

  const publicInput = MerklePosRangePublicInput.deserialize(publicInputSer);
  const isPubInputValid = true;

  let isProofValid;
  try {
    isProofValid = await handlers.verify(
      circuit,
      proofBytes,
      publicInput.circuitPubInput.serialize(),
    );
  } catch (err) {
    throw new Error(`Error calling verify(), err: ${err}`);
  }

  return isProofValid && isPubInputValid;
}
