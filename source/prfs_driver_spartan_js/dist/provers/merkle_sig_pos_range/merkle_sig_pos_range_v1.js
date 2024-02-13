import { snarkJsWitnessGen } from "../../utils/utils";
import { MerklePosRangeCircuitPubInput, MerklePosRangePublicInput, verifyEffEcdsaPubInput, } from "./public_input";
export async function proveMembership(args, handlers, wtnsGen, circuit) {
    const { inputs, eventListener } = args;
    // console.log("inputs: %o", inputs);
    const { sig, leaf, merkleProof, assetSize, assetSizeMaxLimit } = inputs;
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
    const circuitPubInput = new MerklePosRangeCircuitPubInput(merkleProof.root);
    const publicInput = new MerklePosRangePublicInput(circuitPubInput);
    // const m = new BN(toBuffer(msgHash)).mod(SECP256K1_P);
    const witnessGenInput = {
        // r,
        // s,
        // m: BigInt(m.toString()),
        sig,
        leaf,
        assetSize,
        assetSizeMaxLimit,
        // merkle root
        root: merkleProof.root,
        siblings: merkleProof.siblings,
        pathIndices: merkleProof.pathIndices,
        // Eff ECDSA PubInput
        // Tx: effEcdsaPubInput.Tx,
        // Ty: effEcdsaPubInput.Ty,
        // Ux: effEcdsaPubInput.Ux,
        // Uy: effEcdsaPubInput.Uy,
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
    const publicInput = MerklePosRangePublicInput.deserialize(publicInputSer);
    const isPubInputValid = verifyEffEcdsaPubInput(publicInput);
    let isProofValid;
    try {
        isProofValid = await handlers.verify(circuit, proofBytes, publicInput.circuitPubInput.serialize());
    }
    catch (err) {
        throw new Error(`Error calling verify(), err: ${err}`);
    }
    return isProofValid && isPubInputValid;
}
// export interface MerklePosRangeInputs {
//   leaf: bigint;
//   merkleProof: SpartanMerkleProof;
// }
