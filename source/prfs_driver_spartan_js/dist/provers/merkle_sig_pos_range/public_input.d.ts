/// <reference types="node" />
import { EffECDSAPubInput } from "../../types";
export declare class MerklePosRangePublicInput {
    circuitPubInput: MerklePosRangeCircuitPubInput;
    constructor(circuitPubInput: MerklePosRangeCircuitPubInput);
    serialize(): string;
    static deserialize(publicInputSer: string): MerklePosRangePublicInput;
}
export declare class MerklePosRangeCircuitPubInput {
    merkleRoot: bigint;
    constructor(merkleRoot: bigint);
    serialize(): Uint8Array;
    static deserialize(serialized: Uint8Array): MerklePosRangeCircuitPubInput;
}
/**
 * Compute the group elements T and U for efficient ecdsa
 * https://personaelabs.org/posts/efficient-ecdsa-1/
 */
export declare const computeEffEcdsaPubInput: (r: bigint, v: bigint, msgHash: Buffer) => EffECDSAPubInput;
export declare const verifyEffEcdsaPubInput: (pubInput: MerklePosRangePublicInput) => boolean;
