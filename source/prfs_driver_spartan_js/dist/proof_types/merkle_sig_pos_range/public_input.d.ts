export declare class MerkleSigPosRangePublicInput {
    circuitPubInput: MerkleSigPosRangeCircuitPubInput;
    constructor(circuitPubInput: MerkleSigPosRangeCircuitPubInput);
    serialize(): string;
    static deserialize(publicInputSer: string): MerkleSigPosRangePublicInput;
}
export declare class MerkleSigPosRangeCircuitPubInput {
    merkleRoot: bigint;
    nonceInt: bigint;
    serialNo: bigint;
    constructor(merkleRoot: bigint, nonceInt: bigint, serialNo: bigint);
    serialize(): Uint8Array;
    static deserialize(serialized: Uint8Array): MerkleSigPosRangeCircuitPubInput;
}
