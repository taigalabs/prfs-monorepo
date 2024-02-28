import JSONBig from "json-bigint";
import { bytesToBigInt } from "@taigalabs/prfs-crypto-js";

import { serializeBigintArray } from "@/utils/buffer";

const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });

export class MerkleSigPosRangePublicInput {
  circuitPubInput: MerkleSigPosRangeCircuitPubInput;
  nonceRaw: string;
  assetSizeLabel: string;

  constructor(
    circuitPubInput: MerkleSigPosRangeCircuitPubInput,
    nonceRaw: string,
    assetSizeLabel: string,
  ) {
    this.circuitPubInput = circuitPubInput;
    this.nonceRaw = nonceRaw;
    this.assetSizeLabel = assetSizeLabel;
  }

  serialize(): string {
    return JSONbigNative.stringify(this);
  }

  static deserialize(publicInputSer: string): MerkleSigPosRangePublicInput {
    const obj = JSONbigNative.parse(publicInputSer) as MerkleSigPosRangePublicInput;
    const circuitPub = obj.circuitPubInput;

    const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(
      circuitPub.merkleRoot,
      circuitPub.nonceInt,
      circuitPub.serialNo,
      circuitPub.assetSizeGreaterEqThan,
      circuitPub.assetSizeLessThan,
    );
    return new MerkleSigPosRangePublicInput(circuitPubInput, obj.nonceRaw, obj.assetSizeLabel);
  }
}

export class MerkleSigPosRangeCircuitPubInput {
  merkleRoot: bigint;
  nonceInt: bigint;
  serialNo: bigint;
  assetSizeGreaterEqThan: bigint;
  assetSizeLessThan: bigint;

  constructor(
    merkleRoot: bigint,
    nonceInt: bigint,
    serialNo: bigint,
    assetSizeGreaterEqThan: bigint,
    assetSizeLessThan: bigint,
  ) {
    this.merkleRoot = merkleRoot;
    this.nonceInt = nonceInt;
    this.serialNo = serialNo;
    this.assetSizeGreaterEqThan = assetSizeGreaterEqThan;
    this.assetSizeLessThan = assetSizeLessThan;
  }

  serialize(): Uint8Array {
    try {
      const elems: bigint[] = [
        this.merkleRoot,
        this.nonceInt,
        this.serialNo,
        this.assetSizeGreaterEqThan,
        this.assetSizeLessThan,
      ];
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
      const assetSizeGreaterEqThan = bytesToBigInt(serialized.slice(96, 128));
      const assetSizeLessThan = bytesToBigInt(serialized.slice(128, 160));

      return new MerkleSigPosRangeCircuitPubInput(
        merkleRoot,
        nonceInt,
        serialNo,
        assetSizeGreaterEqThan,
        assetSizeLessThan,
      );
    } catch (err) {
      throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
    }
  }
}
