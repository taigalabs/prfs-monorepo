import { SimpleHashCircuitPubInput, SimpleHashPublicInput } from "./public_input";
import { snarkJsWitnessGen } from "../../utils/snarkjs";
export async function proveSimpleHash(args, handlers, wtnsGen, circuit) {
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
    const circuitPublicInput = publicInput.circuitPubInput.serialize();
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
export async function verifyMembership(args, handlers, circuit) {
    const { proof } = args;
    const { proofBytes, publicInputSer } = proof;
    let publicInput;
    try {
        publicInput = SimpleHashPublicInput.deserialize(publicInputSer);
    }
    catch (err) {
        throw new Error(`Error deserializing public input, err: ${err}`);
    }
    let isProofValid;
    try {
        isProofValid = await handlers.verify(circuit, proofBytes, publicInput.circuitPubInput.serialize());
    }
    catch (err) {
        throw new Error(`Error verifying, err: ${err}`);
    }
    return isProofValid;
}
