import { bigIntToLeBytes, bytesLeToBigInt } from "./utils";
import { PrfsWasmType } from '../wasm_wrapper/types';

export class Poseidon {
  wasm: PrfsWasmType;

  constructor(wasm: PrfsWasmType) {
    this.wasm = wasm;
  }

  hash(inputs: bigint[]): bigint {
    const inputsBytes = new Uint8Array(32 * inputs.length);
    for (let i = 0; i < inputs.length; i++) {
      inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
    }

    const result = this.wasm.poseidon(inputsBytes);
    return bytesLeToBigInt(result);
  }

  hashPubKey(pubKey: Buffer): bigint {
    const pubKeyX = BigInt("0x" + pubKey.toString("hex").slice(0, 64));
    const pubKeyY = BigInt("0x" + pubKey.toString("hex").slice(64, 128));

    const pubKeyHash = this.hash([pubKeyX, pubKeyY]);
    return pubKeyHash;
  }
}
