import { secp256k1 as secp } from "@noble/curves/secp256k1";
import { hexlify } from "ethers/lib/utils";
import { PrivateKey } from "eciesjs";
import { initWasm, wasmSingleton } from "./wasm_wrapper/wasm";
import { poseidon_2 } from "./poseidon";
export async function makeEncryptKey(secret) {
    const hash = await poseidon_2(secret);
    return PrivateKey.fromHex(hexlify(hash)).publicKey;
}
export async function makeDecryptKey(secret) {
    const hash = await poseidon_2(secret);
    return PrivateKey.fromHex(hexlify(hash));
}
export async function makeECCredential(secret) {
    if (wasmSingleton.wasm === null) {
        const w = await initWasm();
        wasmSingleton.wasm = w;
    }
    const pk = secp.getPublicKey(secret, false);
    const s1 = pk.subarray(1);
    const s2 = await poseidon_2(s1);
    const id = s2.subarray(0, 20);
    return {
        secret_key: hexlify(secret),
        public_key: hexlify(pk),
        id: hexlify(id),
    };
}
