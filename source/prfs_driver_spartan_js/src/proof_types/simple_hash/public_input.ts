import { JSONbigNative, bigIntToBytes, bytesToBigInt } from "@taigalabs/prfs-crypto-js";

export class SimpleHashPublicInput {
  circuitPubInput: SimpleHashCircuitPubInput;

  constructor(circuitPubInput: SimpleHashCircuitPubInput) {
    this.circuitPubInput = circuitPubInput;
  }

  serialize(): string {
    return JSONbigNative.stringify(this);
  }

  static deserialize(publicInputSer: string): SimpleHashPublicInput {
    const obj = JSONbigNative.parse(publicInputSer) as SimpleHashPublicInput;

    const circuitPubInputObj = obj.circuitPubInput;
    const circuitPubInput = new SimpleHashCircuitPubInput(circuitPubInputObj.msgHash);
    return new SimpleHashPublicInput(circuitPubInput);
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
