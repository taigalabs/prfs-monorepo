import { ec as EC } from "elliptic";
import BN from "bn.js";
import JSONBig from "json-bigint";
import { bufferToHex, toBuffer } from "@ethereumjs/util";
import { bigIntToBytes, bytesToBigInt } from "@taigalabs/prfs-crypto-js";

import { EffECDSAPubInput } from "@/types";
import { SECP256K1_N } from "@/math/secp256k1";

const ec = new EC("secp256k1");
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
      const elems = [this.merkleRoot];

      let serialized = new Uint8Array(32 * elems.length);

      serialized.set(bigIntToBytes(elems[0], 32), 0);
      // serialized.set(bigIntToBytes(elems[1], 32), 32);
      // serialized.set(bigIntToBytes(elems[2], 32), 64);
      // serialized.set(bigIntToBytes(elems[3], 32), 96);
      // serialized.set(bigIntToBytes(elems[4], 32), 128);
      // serialized.set(bigIntToBytes(elems[5], 32), 160);
      return serialized;
    } catch (err) {
      throw new Error(`Cannot serialize circuit pub input, err: ${err}`);
    }
  }

  static deserialize(serialized: Uint8Array): MerkleSigPosRangeCircuitPubInput {
    try {
      const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
      // const Tx = bytesToBigInt(serialized.slice(32, 64));
      // const Ty = bytesToBigInt(serialized.slice(64, 96));
      // const Ux = bytesToBigInt(serialized.slice(96, 128));
      // const Uy = bytesToBigInt(serialized.slice(128, 160));
      // const serialNo = bytesToBigInt(serialized.slice(160, 192));

      return new MerkleSigPosRangeCircuitPubInput(merkleRoot);
    } catch (err) {
      throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
    }
  }
}
