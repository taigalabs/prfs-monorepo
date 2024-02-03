/// <reference types="node" />
import { BufferHex } from "@taigalabs/prfs-proof-interface";
import { EffECDSAPubInput } from "../../types";
export declare class MembershipProofPublicInput {
    r: bigint;
    rV: bigint;
    msgRaw: string;
    msgHash: BufferHex;
    circuitPubInput: MembershipProofCircuitPubInput;
    constructor(r: bigint, rV: bigint, msgRaw: string, msgHash: BufferHex, circuitPubInput: MembershipProofCircuitPubInput);
    serialize(): string;
    static deserialize(publicInputSer: string): MembershipProofPublicInput;
}
export declare class MembershipProofCircuitPubInput {
    merkleRoot: bigint;
    Tx: bigint;
    Ty: bigint;
    Ux: bigint;
    Uy: bigint;
    serialNo: bigint;
    constructor(merkleRoot: bigint, Tx: bigint, Ty: bigint, Ux: bigint, Uy: bigint, serialNo: bigint);
    serialize(): Uint8Array;
    static deserialize(serialized: Uint8Array): MembershipProofCircuitPubInput;
}
/**
 * Compute the group elements T and U for efficient ecdsa
 * https://personaelabs.org/posts/efficient-ecdsa-1/
 */
export declare const computeEffEcdsaPubInput: (r: bigint, v: bigint, msgHash: Buffer) => EffECDSAPubInput;
export declare const verifyEffEcdsaPubInput: (pubInput: MembershipProofPublicInput) => boolean;
