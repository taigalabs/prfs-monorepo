export declare class MerkleSigPosRangePublicInput {
    circuitPubInput: MerkleSigPosRangeCircuitPubInput;
    nonceRaw: string;
    assetSizeLabel: string;
    proofIdentityInput: string;
    constructor(circuitPubInput: MerkleSigPosRangeCircuitPubInput, nonceRaw: string, assetSizeLabel: string);
    serialize(): string;
    static deserialize(publicInputSer: string): MerkleSigPosRangePublicInput;
}
export declare class MerkleSigPosRangeCircuitPubInput {
    merkleRoot: bigint;
    nonceInt: bigint;
    serialNo: bigint;
    assetSizeGreaterEqThan: bigint;
    assetSizeLessThan: bigint;
    constructor(merkleRoot: bigint, nonceInt: bigint, serialNo: bigint, assetSizeGreaterEqThan: bigint, assetSizeLessThan: bigint);
    serialize(): Uint8Array;
    static deserialize(serialized: Uint8Array): MerkleSigPosRangeCircuitPubInput;
}
