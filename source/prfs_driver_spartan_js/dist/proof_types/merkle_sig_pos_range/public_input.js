import JSONBig from "json-bigint";
import { bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import { serializeBigintArray } from "../../utils/buffer";
const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });
export class MerkleSigPosRangePublicInput {
    circuitPubInput;
    nonce;
    constructor(circuitPubInput, nonce) {
        this.circuitPubInput = circuitPubInput;
        this.nonce = nonce;
    }
    serialize() {
        return JSONbigNative.stringify(this);
    }
    static deserialize(publicInputSer) {
        const obj = JSONbigNative.parse(publicInputSer);
        const circuitPub = obj.circuitPubInput;
        const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(circuitPub.merkleRoot, circuitPub.nonceInt, circuitPub.serialNo);
        return new MerkleSigPosRangePublicInput(circuitPubInput, obj.nonce);
    }
}
export class MerkleSigPosRangeCircuitPubInput {
    merkleRoot;
    nonceInt;
    serialNo;
    constructor(merkleRoot, nonceInt, serialNo) {
        this.merkleRoot = merkleRoot;
        this.nonceInt = nonceInt;
        this.serialNo = serialNo;
    }
    serialize() {
        try {
            const elems = [this.merkleRoot, this.nonceInt, this.serialNo];
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
            const serialNo = bytesToBigInt(serialized.slice(64, 96));
            return new MerkleSigPosRangeCircuitPubInput(merkleRoot, nonceInt, serialNo);
        }
        catch (err) {
            throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
        }
    }
}
