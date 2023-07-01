import { bigIntToLeBytes, bytesLeToBigInt } from "./utils";
// import { PrfsWasmType } from "../wasm_wrapper/types";
import { PrfsHandlers } from "../types";

export class Poseidon {
  // wasm: PrfsWasmType;
  handlers: PrfsHandlers;

  constructor(handlers: PrfsHandlers) {
    this.handlers = handlers;
  }

  async hash(inputs: bigint[]): Promise<bigint> {
    const inputsBytes = new Uint8Array(32 * inputs.length);
    for (let i = 0; i < inputs.length; i++) {
      inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
    }
    const result = await this.handlers.poseidonHash(inputsBytes);
    console.log(3333, result);
    // // const result = this.wasm.poseidon(inputsBytes);
    // return bytesLeToBigInt(result);
    //
    return BigInt(3);
  }

  async hashPubKey(pubKey: Buffer): Promise<bigint> {
    const pubKeyX = BigInt("0x" + pubKey.toString("hex").slice(0, 64));
    const pubKeyY = BigInt("0x" + pubKey.toString("hex").slice(64, 128));

    const pubKeyHash = await this.hash([pubKeyX, pubKeyY]);
    return pubKeyHash;
  }
}
