import { bigIntToLeBytes, bytesLeToBigInt } from "@taigalabs/prfs-crypto-js";
export class Poseidon {
    // wasm: PrfsWasmType;
    handlers;
    constructor(handlers) {
        this.handlers = handlers;
    }
    async hash(inputs) {
        const inputsBytes = new Uint8Array(32 * inputs.length);
        for (let i = 0; i < inputs.length; i++) {
            inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
        }
        const result = await this.handlers.poseidonHash(inputsBytes);
        return bytesLeToBigInt(result);
    }
    async hashPubKey(pubKey) {
        const pubKeyX = BigInt("0x" + pubKey.toString("hex").slice(0, 64));
        const pubKeyY = BigInt("0x" + pubKey.toString("hex").slice(64, 128));
        const pubKeyHash = await this.hash([pubKeyX, pubKeyY]);
        return pubKeyHash;
    }
}
export function makePoseidon(handlers) {
    async function poseidon(inputs) {
        const inputsBytes = new Uint8Array(32 * inputs.length);
        for (let i = 0; i < inputs.length; i++) {
            inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
        }
        // console.log('poseidon inputs: %o, input bytes: %o', inputs, inputsBytes);
        const hash_bytes = await handlers.poseidonHash(inputsBytes);
        let ret = bytesLeToBigInt(hash_bytes);
        // console.log('poseidon num: %o, bytes: %o', ret, hash_bytes);
        return ret;
    }
    return poseidon;
}
export function makePoseidonPubKey(handlers) {
    let poseidon = makePoseidon(handlers);
    async function poseidonPubKey(pubKey) {
        const pubKeyX = BigInt("0x" + pubKey.toString("hex").slice(0, 64));
        const pubKeyY = BigInt("0x" + pubKey.toString("hex").slice(64, 128));
        const pubKeyHash = await poseidon([pubKeyX, pubKeyY]);
        return pubKeyHash;
    }
    return poseidonPubKey;
}
