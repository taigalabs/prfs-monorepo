import { ProveArgs, ProveResult, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { bytesToNumberLE, poseidon_2_bigint_le, toUtf8Bytes } from "@taigalabs/prfs-crypto-js";
import { BN } from "bn.js";
import { SECP256K1_P } from "@/math/secp256k1";

import { snarkJsWitnessGen } from "@/utils/snarkjs";
import { PrfsHandlers } from "@/types";
import { MerkleSigPosRangeCircuitPubInput, MerkleSigPosRangePublicInput } from "./public_input";

export async function proveMembership(
  args: ProveArgs<MerkleSigPosRangeV1Inputs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array,
): Promise<ProveResult> {
  const { inputs, eventListener } = args;
  console.log("inputs: %o", inputs);

  const {
    sigpos,
    leaf,
    merkleProof,
    assetSize,
    assetSizeLessThan,
    assetSizeGreaterEqThan,
    assetSizeLabel,
    nonceRaw,
    proofPubKey,
  } = inputs;

  const proofPubKeyBytes = toUtf8Bytes(proofPubKey);
  const proofPubKeyInt = BigInt(new BN(proofPubKeyBytes).mod(SECP256K1_P).toString());

  const nonceRawBytes = toUtf8Bytes(nonceRaw);
  const nonceInt = BigInt(new BN(nonceRawBytes).mod(SECP256K1_P).toString());

  const sigposAndNonceInt_ = await poseidon_2_bigint_le([sigpos, nonceInt]);
  const sigposAndNonceInt = bytesToNumberLE(sigposAndNonceInt_);
  // console.log("sigposAndNonce", sigposAndNonceInt_);

  const serialNoHash = await poseidon_2_bigint_le([sigposAndNonceInt, proofPubKeyInt]);
  const serialNo = bytesToNumberLE(serialNoHash);
  // console.log("serialNo", serialNo);

  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: { type: "info", payload: "Computed ECDSA pub input" },
  });

  const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(
    merkleProof.root,
    nonceInt,
    proofPubKeyInt,
    serialNo,
    assetSizeGreaterEqThan,
    assetSizeLessThan,
  );

  const publicInput = new MerkleSigPosRangePublicInput(
    circuitPubInput,
    nonceRaw,
    proofPubKey,
    assetSizeLabel,
  );

  const witnessGenInput = {
    sigpos,
    leaf,
    assetSize,
    assetSizeGreaterEqThan,
    assetSizeLessThan,

    root: merkleProof.root,
    siblings: merkleProof.siblings,
    pathIndices: merkleProof.pathIndices,

    nonce: nonceInt,
    proofPubKey: proofPubKeyInt,
    serialNo,
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
  console.log("circuit pub input byte length: %s", circuitPublicInput.length);

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
      publicInputSer: publicInput.stringify(),
      proofPubKey,
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

  const publicInput = MerkleSigPosRangePublicInput.deserialize(publicInputSer);
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
