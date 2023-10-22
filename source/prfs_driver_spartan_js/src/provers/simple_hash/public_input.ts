import { ec as EC } from "elliptic";
import BN from "bn.js";
import JSONBig from "json-bigint";

import { bytesToBigInt, bigIntToBytes } from "@/utils/utils";
import { EffECDSAPubInput } from "@/types";
import { SECP256K1_N } from "@/math/secp256k1";

const ec = new EC("secp256k1");
const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

export class SimpleHashPublicInput {
  msgRaw: string;
  msgRawInt: bigint;
  circuitPubInput: SimpleHashCircuitPubInput;

  constructor(msgRaw: string, msgRawInt: bigint, circuitPubInput: SimpleHashCircuitPubInput) {
    this.msgRaw = msgRaw;
    this.msgRawInt = msgRawInt;
    this.circuitPubInput = circuitPubInput;
  }

  serialize(): string {
    return JSONBig.stringify(this);
  }

  static deserialize(publicInputSer: string): SimpleHashPublicInput {
    const obj = JSONbigNative.parse(publicInputSer);

    return obj as SimpleHashPublicInput;
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
