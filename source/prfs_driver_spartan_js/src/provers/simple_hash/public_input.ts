import { ec as EC } from "elliptic";
import BN from "bn.js";

import { bytesToBigInt, bigIntToBytes } from "@/utils/utils";
import { EffECDSAPubInput } from "@/types";
import { SECP256K1_N } from "@/math/secp256k1";

const ec = new EC("secp256k1");

export class SimpleHashPublicInput {
  msgHash: bigint;
  circuitPubInput: SimpleHashCircuitPubInput;

  constructor(msgHash: bigint, circuitPubInput: SimpleHashCircuitPubInput) {
    this.msgHash = msgHash;
    this.circuitPubInput = circuitPubInput;
  }

  serialize(): string {
    return "";
  }
}

export class SimpleHashCircuitPubInput {
  msgHash: bigint;

  constructor(msgHash: bigint) {
    this.msgHash = msgHash;
  }

  serialize(): Uint8Array {
    try {
      const elems = [this.msgHash];

      let serialized = new Uint8Array(32 * elems.length);

      serialized.set(bigIntToBytes(elems[0], 32), 0);
      return serialized;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  static deserialize(serialized: Uint8Array): SimpleHashCircuitPubInput {
    try {
      const msgHash = bytesToBigInt(serialized.slice(0, 32));

      return new SimpleHashCircuitPubInput(msgHash);
    } catch (err) {
      console.error(err);

      throw err;
    }
  }
}
