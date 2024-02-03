import { ec as EC } from "elliptic";
import BN from "bn.js";
import JSONBig from "json-bigint";
import { bigIntToBytes, bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import { SECP256K1_N } from "../../math/secp256k1";
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
            serialized.set(bigIntToBytes(elems[1], 32), 32);
            serialized.set(bigIntToBytes(elems[2], 32), 64);
            serialized.set(bigIntToBytes(elems[3], 32), 96);
            serialized.set(bigIntToBytes(elems[4], 32), 128);
            serialized.set(bigIntToBytes(elems[5], 32), 160);
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
/**
 * Compute the group elements T and U for efficient ecdsa
 * https://personaelabs.org/posts/efficient-ecdsa-1/
 */
export const computeEffEcdsaPubInput = (r, v, msgHash) => {
    let isYOdd;
    try {
        isYOdd = (v - BigInt(27)) % BigInt(2);
    }
    catch (err) {
        throw new Error(`Couldn't decide if Y is odd, err: ${err}`);
    }
    let rPoint;
    try {
        rPoint = ec.keyFromPublic(ec.curve.pointFromX(new BN(r), isYOdd).encode("hex"), "hex");
    }
    catch (err) {
        throw new Error(`Couldn't derive keypair, err: ${err}`);
    }
    // Get the group element: -(m * r^−1 * G)
    let rInv;
    try {
        rInv = new BN(r).invm(SECP256K1_N);
    }
    catch (err) {
        throw new Error(`Couldnt make rInv, err: ${err}`);
    }
    // w = -(r^-1 * msg)
    let w;
    try {
        w = rInv.mul(new BN(msgHash)).neg().umod(SECP256K1_N);
    }
    catch (err) {
        throw new Error(`Couldnt make w, err: ${err}`);
    }
    // U = -(w * G) = -(r^-1 * msg * G)
    const U = ec.curve.g.mul(w);
    // T = r^-1 * R
    const T = rPoint.getPublic().mul(rInv);
    return {
        Tx: BigInt(T.getX().toString()),
        Ty: BigInt(T.getY().toString()),
        Ux: BigInt(U.getX().toString()),
        Uy: BigInt(U.getY().toString()),
    };
};
export const verifyEffEcdsaPubInput = (pubInput) => {
    // const expectedCircuitInput = computeEffEcdsaPubInput(
    //   pubInput.r,
    //   pubInput.rV,
    //   toBuffer(pubInput.msgHash),
    // );
    // const circuitPubInput = pubInput.circuitPubInput;
    // const isValid =
    //   expectedCircuitInput.Tx === circuitPubInput.Tx &&
    //   expectedCircuitInput.Ty === circuitPubInput.Ty &&
    //   expectedCircuitInput.Ux === circuitPubInput.Ux &&
    //   expectedCircuitInput.Uy === circuitPubInput.Uy;
    return true;
};
