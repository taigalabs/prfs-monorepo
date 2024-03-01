import { JSONbigNative, bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import { serializeBigintArray } from "../../utils/buffer";
export class MerkleSigPosRangePublicInput {
    circuitPubInput;
    nonceRaw;
    proofPubKey;
    assetSizeLabel;
    proofIdentityInput;
    constructor(circuitPubInput, nonceRaw, proofPubKey, assetSizeLabel) {
        this.circuitPubInput = circuitPubInput;
        this.nonceRaw = nonceRaw;
        this.proofPubKey = proofPubKey;
        this.assetSizeLabel = assetSizeLabel;
        this.proofIdentityInput = assetSizeLabel;
    }
    stringify() {
        const { circuitPubInput, ...rest } = this;
        const circuitPubInput_ = JSONbigNative.stringify(circuitPubInput);
        const json = {
            circuitPubInput: circuitPubInput_,
            ...rest,
        };
        return JSONbigNative.stringify(json);
    }
    static deserialize(publicInputSer) {
        const obj = JSONbigNative.parse(publicInputSer);
        const circuitPub = obj.circuitPubInput;
        const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(circuitPub.merkleRoot, circuitPub.nonceInt, circuitPub.proofPubKeyInt, circuitPub.serialNo, circuitPub.assetSizeGreaterEqThan, circuitPub.assetSizeLessThan);
        return new MerkleSigPosRangePublicInput(circuitPubInput, obj.nonceRaw, obj.proofPubKey, obj.assetSizeLabel);
    }
}
export class MerkleSigPosRangeCircuitPubInput {
    merkleRoot;
    nonceInt;
    proofPubKeyInt;
    serialNo;
    assetSizeGreaterEqThan;
    assetSizeLessThan;
    constructor(merkleRoot, nonceInt, proofPubKeyInt, serialNo, assetSizeGreaterEqThan, assetSizeLessThan) {
        this.merkleRoot = merkleRoot;
        this.nonceInt = nonceInt;
        this.proofPubKeyInt = proofPubKeyInt;
        this.serialNo = serialNo;
        this.assetSizeGreaterEqThan = assetSizeGreaterEqThan;
        this.assetSizeLessThan = assetSizeLessThan;
    }
    serialize() {
        try {
            const elems = [
                this.merkleRoot,
                this.nonceInt,
                this.proofPubKeyInt,
                this.serialNo,
                this.assetSizeGreaterEqThan,
                this.assetSizeLessThan,
            ];
            const serialized = serializeBigintArray(elems);
            return serialized;
        }
        catch (err) {
            throw new Error(`Cannot serialize circuit pub input, err: ${err}`);
        }
    }
    static deserialize(serialized) {
        try {
            const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
            const nonceInt = bytesToBigInt(serialized.slice(32, 64));
            const proofPubKeyInt = bytesToBigInt(serialized.slice(64, 96));
            const serialNo = bytesToBigInt(serialized.slice(96, 128));
            const assetSizeGreaterEqThan = bytesToBigInt(serialized.slice(128, 160));
            const assetSizeLessThan = bytesToBigInt(serialized.slice(160, 192));
            return new MerkleSigPosRangeCircuitPubInput(merkleRoot, nonceInt, proofPubKeyInt, serialNo, assetSizeGreaterEqThan, assetSizeLessThan);
        }
        catch (err) {
            throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
        }
    }
}
