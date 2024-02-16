import { ec as EC } from "elliptic";
import JSONBig from "json-bigint";
import { bigIntToBytes, bytesToBigInt } from "@taigalabs/prfs-crypto-js";
const ec = new EC("secp256k1");
const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });
export class MerklePosRangePublicInput {
    // r: bigint;
    // rV: bigint;
    // msgRaw: string;
    // msgHash: BufferHex;
    circuitPubInput;
    constructor(circuitPubInput) {
        // this.r = r;
        // this.rV = rV;
        // this.msgRaw = msgRaw;
        // this.msgHash = msgHash;
        this.circuitPubInput = circuitPubInput;
    }
    serialize() {
        return JSONbigNative.stringify(this);
    }
    static deserialize(publicInputSer) {
        const obj = JSONbigNative.parse(publicInputSer);
        const circuitPubInputObj = obj.circuitPubInput;
        const circuitPubInput = new MerklePosRangeCircuitPubInput(circuitPubInputObj.merkleRoot);
        return new MerklePosRangePublicInput(circuitPubInput);
    }
}
export class MerklePosRangeCircuitPubInput {
    merkleRoot;
    // Tx: bigint;
    // Ty: bigint;
    // Ux: bigint;
    // Uy: bigint;
    // serialNo: bigint;
    constructor(merkleRoot) {
        this.merkleRoot = merkleRoot;
        // this.Tx = Tx;
        // this.Ty = Ty;
        // this.Ux = Ux;
        // this.Uy = Uy;
        // this.serialNo = serialNo;
    }
    serialize() {
        try {
            const elems = [this.merkleRoot];
            let serialized = new Uint8Array(32 * elems.length);
            serialized.set(bigIntToBytes(elems[0], 32), 0);
            // serialized.set(bigIntToBytes(elems[1], 32), 32);
            // serialized.set(bigIntToBytes(elems[2], 32), 64);
            // serialized.set(bigIntToBytes(elems[3], 32), 96);
            // serialized.set(bigIntToBytes(elems[4], 32), 128);
            // serialized.set(bigIntToBytes(elems[5], 32), 160);
            return serialized;
        }
        catch (err) {
            throw new Error(`Cannot serialize circuit pub input, err: ${err}`);
        }
    }
    static deserialize(serialized) {
        try {
            const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
            // const Tx = bytesToBigInt(serialized.slice(32, 64));
            // const Ty = bytesToBigInt(serialized.slice(64, 96));
            // const Ux = bytesToBigInt(serialized.slice(96, 128));
            // const Uy = bytesToBigInt(serialized.slice(128, 160));
            // const serialNo = bytesToBigInt(serialized.slice(160, 192));
            return new MerklePosRangeCircuitPubInput(merkleRoot);
        }
        catch (err) {
            throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
        }
    }
}
