import { JSONbigNative, bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import { MerkleSigPosExactV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1PublicInputs";
import { MerkleSigPosExactV1CircuitPubInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1CircuitPubInputs";

import { serializeBigintArray } from "../../utils/buffer";

export class MerkleSigPosExactPublicInput implements MerkleSigPosExactV1PublicInputs {
  circuitPubInput: MerkleSigPosExactCircuitPubInput;
  nonceRaw: string;
  proofPubKey: string;
  // assetSizeLabel: string;
  valueRaw: string;
  proofIdentityInput: string;

  constructor(
    circuitPubInput: MerkleSigPosExactCircuitPubInput,
    nonceRaw: string,
    proofPubKey: string,
    valueRaw: string,
    // assetSizeLabel: string,
  ) {
    this.circuitPubInput = circuitPubInput;
    this.nonceRaw = nonceRaw;
    this.proofPubKey = proofPubKey;
    // this.assetSizeLabel = assetSizeLabel;
    this.proofIdentityInput = valueRaw;
    this.valueRaw = valueRaw;
  }

  stringify(): string {
    return JSONbigNative.stringify(this);
  }

  static deserialize(publicInputSer: string): MerkleSigPosExactPublicInput {
    const obj = JSONbigNative.parse(publicInputSer) as MerkleSigPosExactPublicInput;
    const circuitPub = obj.circuitPubInput;

    const circuitPubInput = new MerkleSigPosExactCircuitPubInput(
      circuitPub.merkleRoot,
      circuitPub.nonceInt,
      circuitPub.proofPubKeyInt,
      circuitPub.serialNo,
      circuitPub.valueInt,
      // circuitPub.assetSizeGreaterEqThan,
      // circuitPub.assetSizeLessThan,
    );

    return new MerkleSigPosExactPublicInput(
      circuitPubInput,
      obj.nonceRaw,
      obj.proofPubKey,
      obj.valueRaw,
      // obj.assetSizeLabel,
    );
  }
}

export class MerkleSigPosExactCircuitPubInput implements MerkleSigPosExactV1CircuitPubInputs {
  merkleRoot: bigint;
  nonceInt: bigint;
  proofPubKeyInt: bigint;
  serialNo: bigint;
  valueInt: bigint;
  // assetSizeGreaterEqThan: bigint;
  // assetSizeLessThan: bigint;

  constructor(
    merkleRoot: bigint,
    nonceInt: bigint,
    proofPubKeyInt: bigint,
    serialNo: bigint,
    valueInt: bigint,
    // assetSizeGreaterEqThan: bigint,
    // assetSizeLessThan: bigint,
  ) {
    this.merkleRoot = merkleRoot;
    this.nonceInt = nonceInt;
    this.proofPubKeyInt = proofPubKeyInt;
    this.serialNo = serialNo;
    this.valueInt = valueInt;
    // this.assetSizeGreaterEqThan = assetSizeGreaterEqThan;
    // this.assetSizeLessThan = assetSizeLessThan;
  }

  serialize(): Uint8Array {
    try {
      const elems: bigint[] = [
        this.merkleRoot,
        this.nonceInt,
        this.proofPubKeyInt,
        this.serialNo,
        this.valueInt,
        // this.assetSizeGreaterEqThan,
        // this.assetSizeLessThan,
      ];
      const serialized = serializeBigintArray(elems);

      return serialized;
    } catch (err) {
      throw new Error(`Cannot serialize circuit pub input, err: ${err}`);
    }
  }

  static deserialize(serialized: Uint8Array): MerkleSigPosExactCircuitPubInput {
    try {
      const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
      const nonceInt = bytesToBigInt(serialized.slice(32, 64));
      const proofPubKeyInt = bytesToBigInt(serialized.slice(64, 96));
      const serialNo = bytesToBigInt(serialized.slice(96, 128));
      const valueInt = bytesToBigInt(serialized.slice(128, 160));
      // const assetSizeGreaterEqThan = bytesToBigInt(serialized.slice(128, 160));
      // const assetSizeLessThan = bytesToBigInt(serialized.slice(160, 192));

      return new MerkleSigPosExactCircuitPubInput(
        merkleRoot,
        nonceInt,
        proofPubKeyInt,
        serialNo,
        valueInt,
        // assetSizeGreaterEqThan,
        // assetSizeLessThan,
      );
    } catch (err) {
      throw new Error(`Cannot deserialize circuit pub input, err: ${err}`);
    }
  }
}
