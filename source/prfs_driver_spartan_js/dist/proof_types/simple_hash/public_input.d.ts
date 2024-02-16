export declare class SimpleHashPublicInput {
    circuitPubInput: SimpleHashCircuitPubInput;
    constructor(circuitPubInput: SimpleHashCircuitPubInput);
    serialize(): string;
    static deserialize(publicInputSer: string): SimpleHashPublicInput;
}
export declare class SimpleHashCircuitPubInput {
    msgHash: bigint;
    constructor(msgHash: bigint);
    serialize(): Uint8Array;
    static deserialize(serialized: Uint8Array): SimpleHashCircuitPubInput;
}
