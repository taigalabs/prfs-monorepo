import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { MerkleSigPosRangeV1CircuitPubInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1CircuitPubInputs";
export declare class MerkleSigPosRangePublicInput implements MerkleSigPosRangeV1PublicInputs {
    circuitPubInput: MerkleSigPosRangeCircuitPubInput;
    nonceRaw: string;
    proofPubKey: string;
    assetSizeLabel: string;
    proofIdentityInput: string;
    constructor(circuitPubInput: MerkleSigPosRangeCircuitPubInput, nonceRaw: string, proofPubKey: string, assetSizeLabel: string);
    stringify(): string;
    static deserialize(publicInputSer: string): MerkleSigPosRangePublicInput;
}
export declare class MerkleSigPosRangeCircuitPubInput implements MerkleSigPosRangeV1CircuitPubInputs {
    merkleRoot: bigint;
    nonceInt: bigint;
    proofPubKeyInt: bigint;
    serialNo: bigint;
    assetSizeGreaterEqThan: bigint;
    assetSizeLessThan: bigint;
    constructor(merkleRoot: bigint, nonceInt: bigint, proofPubKeyInt: bigint, serialNo: bigint, assetSizeGreaterEqThan: bigint, assetSizeLessThan: bigint);
    serialize(): Uint8Array;
    static deserialize(serialized: Uint8Array): MerkleSigPosRangeCircuitPubInput;
}
