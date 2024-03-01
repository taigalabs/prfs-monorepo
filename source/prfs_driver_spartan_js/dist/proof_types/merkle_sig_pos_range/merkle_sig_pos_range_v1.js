import { JSONbigNative, bytesToNumberLE, poseidon_2, poseidon_2_bigint_le, prfsSign, toUtf8Bytes, } from "@taigalabs/prfs-crypto-js";
import { hexlify, keccak256 } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { secp256k1 as secp } from "@taigalabs/prfs-crypto-deps-js/noble_curves/secp256k1";
import { snarkJsWitnessGen } from "../../utils/snarkjs";
import { MerkleSigPosRangeCircuitPubInput, MerkleSigPosRangePublicInput } from "./public_input";
export async function proveMembership(args, handlers, wtnsGen, circuit) {
    const { inputs, eventListener } = args;
    console.log("inputs: %o", inputs);
    const { sigpos, leaf, merkleProof, assetSize, assetSizeLessThan, assetSizeGreaterEqThan, assetSizeLabel, nonceRaw, proofKey, proofAction, } = inputs;
    if (!proofAction || proofAction.length < 1) {
        throw new Error("Proof action should be non-empty string");
    }
    const nonceRaw_ = keccak256(toUtf8Bytes(nonceRaw)).substring(2);
    const nonceHash = await poseidon_2(nonceRaw_);
    const nonceInt = bytesToNumberLE(nonceHash);
    const sigposAndNonceInt_ = await poseidon_2_bigint_le([sigpos, nonceInt]);
    const sigposAndNonceInt = bytesToNumberLE(sigposAndNonceInt_);
    // console.log("sigposAndNonce", sigposAndNonceInt_);
    const publicKey = secp.getPublicKey(proofKey.substring(2));
    const proofPubKey = hexlify(publicKey);
    const proofPubKey_ = bytesToNumberLE(publicKey);
    const proofPubKeyHash = await poseidon_2_bigint_le([proofPubKey_, BigInt(0)]);
    const proofPubKeyInt = bytesToNumberLE(proofPubKeyHash);
    // console.log("proofPubKeyInt", proofPubKeyInt);
    const serialNoHash = await poseidon_2_bigint_le([sigposAndNonceInt, proofPubKeyInt]);
    const serialNo = bytesToNumberLE(serialNoHash);
    // console.log("serialNo", serialNo);
    const proofActionResult = await prfsSign(proofKey, proofAction);
    const proofActionResultHex = "0x" + proofActionResult.toCompactHex();
    eventListener({
        type: "CREATE_PROOF_EVENT",
        payload: { type: "info", payload: "Computed ECDSA pub input" },
    });
    const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(merkleProof.root, nonceInt, proofPubKeyInt, serialNo, assetSizeGreaterEqThan, assetSizeLessThan);
    const publicInput = new MerkleSigPosRangePublicInput(circuitPubInput, nonceRaw, proofPubKey, assetSizeLabel);
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
    const circuitPublicInput = publicInput.circuitPubInput.serialize();
    console.log("circuit pub input byte length: %s", circuitPublicInput.length);
    const prev = performance.now();
    let proofBytes;
    try {
        proofBytes = await handlers.prove(circuit, witness.data, circuitPublicInput);
    }
    catch (err) {
        throw new Error(`Error calling prove(), err: ${err}`);
    }
    const now = performance.now();
    return {
        duration: now - prev,
        proof: {
            proofBytes,
            publicInputSer: JSONbigNative.stringify(publicInput),
            proofKey,
            proofActionResult: proofActionResultHex,
        },
    };
}
export async function verifyMembership(args, handlers, circuit) {
    const { proof } = args;
    const { proofBytes, publicInputSer } = proof;
    const publicInput = MerkleSigPosRangePublicInput.deserialize(publicInputSer);
    const isPubInputValid = true;
    let isProofValid;
    try {
        isProofValid = await handlers.verify(circuit, proofBytes, publicInput.circuitPubInput.serialize());
    }
    catch (err) {
        throw new Error(`Error calling verify(), err: ${err}`);
    }
    return isProofValid && isPubInputValid;
}
