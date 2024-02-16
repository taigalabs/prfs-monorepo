"use strict";
// import { bigIntToLeBytes, bytesLeToBigInt } from "@taigalabs/prfs-crypto-js";
// import { PrfsHandlers } from "../types";
// export class Poseidon {
//   // wasm: PrfsWasmType;
//   handlers: PrfsHandlers;
//   constructor(handlers: PrfsHandlers) {
//     this.handlers = handlers;
//   }
//   async hash(inputs: bigint[]): Promise<bigint> {
//     const inputsBytes = new Uint8Array(32 * inputs.length);
//     for (let i = 0; i < inputs.length; i++) {
//       inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
//     }
//     const result = await this.handlers.poseidonHash(inputsBytes);
//     return bytesLeToBigInt(result);
//   }
//   async hashPubKey(pubKey: Buffer): Promise<bigint> {
//     const pubKeyX = BigInt("0x" + pubKey.toString("hex").slice(0, 64));
//     const pubKeyY = BigInt("0x" + pubKey.toString("hex").slice(64, 128));
//     const pubKeyHash = await this.hash([pubKeyX, pubKeyY]);
//     return pubKeyHash;
//   }
// }
// export function makePoseidon(handlers: PrfsHandlers) {
//   async function poseidon(inputs: bigint[]): Promise<bigint> {
//     const inputsBytes = new Uint8Array(32 * inputs.length);
//     for (let i = 0; i < inputs.length; i++) {
//       inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
//     }
//     // console.log('poseidon inputs: %o, input bytes: %o', inputs, inputsBytes);
//     const hash_bytes = await handlers.poseidonHash(inputsBytes);
//     let ret = bytesLeToBigInt(hash_bytes);
//     // console.log('poseidon num: %o, bytes: %o', ret, hash_bytes);
//     return ret;
//   }
//   return poseidon;
// }
// export function makePoseidonPubKey(handlers: PrfsHandlers) {
//   let poseidon = makePoseidon(handlers);
//   async function poseidonPubKey(pubKey: Buffer): Promise<bigint> {
//     const pubKeyX = BigInt("0x" + pubKey.toString("hex").slice(0, 64));
//     const pubKeyY = BigInt("0x" + pubKey.toString("hex").slice(64, 128));
//     const pubKeyHash = await poseidon([pubKeyX, pubKeyY]);
//     return pubKeyHash;
//   }
//   return poseidonPubKey;
// }
