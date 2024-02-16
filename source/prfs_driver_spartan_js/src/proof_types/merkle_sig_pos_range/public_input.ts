import JSONBig from "json-bigint";
import { bytesToBigInt } from "@taigalabs/prfs-crypto-js";

import { serializeBigintArray } from "@/utils/buffer";

const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

export class MerkleSigPosRangePublicInput {
  circuitPubInput: MerkleSigPosRangeCircuitPubInput;

  constructor(circuitPubInput: MerkleSigPosRangeCircuitPubInput) {
    this.circuitPubInput = circuitPubInput;
  }

  serialize(): string {
    return JSONbigNative.stringify(this);
  }

  static deserialize(publicInputSer: string): MerkleSigPosRangePublicInput {
    const obj = JSONbigNative.parse(publicInputSer) as MerkleSigPosRangePublicInput;
    const parsed = obj.circuitPubInput;

    const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(
      parsed.merkleRoot,
      parsed.nonceInt,
      parsed.serialNo,
    );
    return new MerkleSigPosRangePublicInput(circuitPubInput);
  }
}

export class MerkleSigPosRangeCircuitPubInput {
  merkleRoot: bigint;
  nonceInt: bigint;
  serialNo: bigint;

  constructor(merkleRoot: bigint, nonceInt: bigint, serialNo: bigint) {
    this.merkleRoot = merkleRoot;
    this.nonceInt = nonceInt;
    this.serialNo = serialNo;
  }

  serialize(): Uint8Array {
    try {
      const elems: bigint[] = [this.merkleRoot, this.nonceInt, this.serialNo];
      const serialized = serializeBigintArray(elems);

      return serialized;
    } catch (err) {
      throw new Error(`Cannot serialize circuit pub input, err: ${err}`);
    }
  }

  static deserialize(serialized: Uint8Array): MerkleSigPosRangeCircuitPubInput {
    try {
      const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
      const nonceInt = bytesToBigInt(serialized.slice(32, 64));
      const serialNo = bytesToBigInt(serialized.slice(64, 96));

      return new MerkleSigPosRangeCircuitPubInput(merkleRoot, nonceInt, serialNo);
    } catch (err) {
      throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
    }
  }
}
