import JSONBig from "json-bigint";
import { bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import { serializeBigintArray } from "../../utils/buffer";
const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });
export class MerkleSigPosRangePublicInput {
    circuitPubInput;
    constructor(circuitPubInput) {
        this.circuitPubInput = circuitPubInput;
    }
    serialize() {
        return JSONbigNative.stringify(this);
    }
    static deserialize(publicInputSer) {
        const obj = JSONbigNative.parse(publicInputSer);
        const parsed = obj.circuitPubInput;
        const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(parsed.merkleRoot, parsed.nonceInt, parsed.serialNo);
        return new MerkleSigPosRangePublicInput(circuitPubInput);
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
            // let serialized = new Uint8Array(32 * elems.length);
            // serialized.set(bigIntToBytes(elems[0], 32), 0);
            // // serialized.set(bigIntToBytes(elems[1], 32), 32);
            // // serialized.set(bigIntToBytes(elems[2], 32), 64);
            // // serialized.set(bigIntToBytes(elems[3], 32), 96);
            // // serialized.set(bigIntToBytes(elems[4], 32), 128);
            // // serialized.set(bigIntToBytes(elems[5], 32), 160);
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
