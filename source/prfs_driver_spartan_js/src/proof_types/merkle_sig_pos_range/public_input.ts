import { JSONbigNative, bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { MerkleSigPosRangeV1CircuitPubInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1CircuitPubInputs";

import { serializeBigintArray } from "../../utils/buffer";

export class MerkleSigPosRangePublicInput implements MerkleSigPosRangeV1PublicInputs {
  circuitPubInput: MerkleSigPosRangeCircuitPubInput;
  nonceRaw: string;
  proofPubKey: string;
  assetSizeLabel: string;
  proofIdentityInput: string;

  constructor(
    circuitPubInput: MerkleSigPosRangeCircuitPubInput,
    nonceRaw: string,
    proofPubKey: string,
    assetSizeLabel: string,
  ) {
    this.circuitPubInput = circuitPubInput;
    this.nonceRaw = nonceRaw;
    this.proofPubKey = proofPubKey;
    this.assetSizeLabel = assetSizeLabel;
    this.proofIdentityInput = assetSizeLabel;
  }

  stringify(): string {
    return JSONbigNative.stringify(this);
  }

  static deserialize(publicInputSer: string): MerkleSigPosRangePublicInput {
    const obj = JSONbigNative.parse(publicInputSer) as MerkleSigPosRangePublicInput;
    const circuitPub = obj.circuitPubInput;

    const circuitPubInput = new MerkleSigPosRangeCircuitPubInput(
      circuitPub.merkleRoot,
      circuitPub.nonceInt,
      circuitPub.proofPubKeyInt,
      circuitPub.serialNo,
      circuitPub.assetSizeGreaterEqThan,
      circuitPub.assetSizeLessThan,
    );

    return new MerkleSigPosRangePublicInput(
      circuitPubInput,
      obj.nonceRaw,
      obj.proofPubKey,
      obj.assetSizeLabel,
    );
  }
}

export class MerkleSigPosRangeCircuitPubInput implements MerkleSigPosRangeV1CircuitPubInputs {
  merkleRoot: bigint;
  nonceInt: bigint;
  proofPubKeyInt: bigint;
  serialNo: bigint;
  assetSizeGreaterEqThan: bigint;
  assetSizeLessThan: bigint;

  constructor(
    merkleRoot: bigint,
    nonceInt: bigint,
    proofPubKeyInt: bigint,
    serialNo: bigint,
    assetSizeGreaterEqThan: bigint,
    assetSizeLessThan: bigint,
  ) {
    this.merkleRoot = merkleRoot;
    this.nonceInt = nonceInt;
    this.proofPubKeyInt = proofPubKeyInt;
    this.serialNo = serialNo;
    this.assetSizeGreaterEqThan = assetSizeGreaterEqThan;
    this.assetSizeLessThan = assetSizeLessThan;
  }

  serialize(): Uint8Array {
    try {
      const elems: bigint[] = [
        this.merkleRoot,
        this.nonceInt,
        this.proofPubKeyInt,
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
      const proofPubKeyInt = bytesToBigInt(serialized.slice(64, 96));
      const serialNo = bytesToBigInt(serialized.slice(96, 128));
      const assetSizeGreaterEqThan = bytesToBigInt(serialized.slice(128, 160));
      const assetSizeLessThan = bytesToBigInt(serialized.slice(160, 192));

      return new MerkleSigPosRangeCircuitPubInput(
        merkleRoot,
        nonceInt,
        proofPubKeyInt,
        serialNo,
        assetSizeGreaterEqThan,
        assetSizeLessThan,
      );
    } catch (err) {
      throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
    }
  }
}
