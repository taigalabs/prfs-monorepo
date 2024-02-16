import { bigIntToBytes, bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import JSONBig from "json-bigint";
const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });
export class SimpleHashPublicInput {
    circuitPubInput;
    constructor(circuitPubInput) {
        this.circuitPubInput = circuitPubInput;
    }
    serialize() {
        return JSONBig.stringify(this);
    }
    static deserialize(publicInputSer) {
        const obj = JSONbigNative.parse(publicInputSer);
        const circuitPubInputObj = obj.circuitPubInput;
        const circuitPubInput = new SimpleHashCircuitPubInput(circuitPubInputObj.msgHash);
        return new SimpleHashPublicInput(circuitPubInput);
    }
}
export class SimpleHashCircuitPubInput {
    msgHash;
    constructor(msgHash) {
        this.msgHash = msgHash;
    }
    serialize() {
        try {
            const elems = [this.msgHash];
            let serialized = new Uint8Array(32 * elems.length);
            serialized.set(bigIntToBytes(elems[0], 32), 0);
            return serialized;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    static deserialize(serialized) {
        try {
            const msgHash = bytesToBigInt(serialized.slice(0, 32));
            return new SimpleHashCircuitPubInput(msgHash);
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
}
