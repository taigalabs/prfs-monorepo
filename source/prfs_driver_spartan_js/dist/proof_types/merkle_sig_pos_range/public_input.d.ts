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
