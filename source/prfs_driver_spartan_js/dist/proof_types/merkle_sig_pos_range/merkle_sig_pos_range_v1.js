import { bytesToBigInt, bytesToNumberLE, poseidon_2, poseidon_2_bigint_le, } from "@taigalabs/prfs-crypto-js";
import { snarkJsWitnessGen } from "../../utils/snarkjs";
import { MerkleSigPosRangeCircuitPubInput, MerkleSigPosRangePublicInput } from "./public_input";
export async function proveMembership(args, handlers, wtnsGen, circuit) {
    const { inputs, eventListener } = args;
    console.log("inputs: %o", inputs);
    const { sigpos, leaf, merkleProof, assetSize, assetSizeLessThan, assetSizeGreaterEqThan, nonce } = inputs;
    const nonceHash = await poseidon_2(nonce);
    const nonceInt = bytesToBigInt(nonceHash);
    const serialNoHash = await poseidon_2_bigint_le([sigpos, nonceInt]);
    const serialNo = bytesToNumberLE(serialNoHash);
    eventListener({
        type: "CREATE_PROOF_EVENT",
        payload: { type: "info", payload: "Computed ECDSA pub input" },
    });
    const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(merkleProof.root, nonceInt, serialNo);
    const publicInput = new MerkleSigPosRangePublicInput(circuitPubInput);
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
            publicInputSer: publicInput.serialize(),
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