import { ec as EC } from "elliptic";
import BN from "bn.js";

import { bytesToBigInt, bigIntToBytes } from "@/utils/utils";
import { EffECDSAPubInput } from "@/types";
import { SECP256K1_N } from "@/math/secp256k1";

const ec = new EC("secp256k1");

export class SimpleHashPublicInput {
  msgRaw: string;
  msgHash: Buffer;
  circuitPubInput: SimpleHashCircuitPubInput;

  constructor(msgRaw: string, msgHash: Buffer, circuitPubInput: SimpleHashCircuitPubInput) {
    this.msgRaw = msgRaw;
    this.msgHash = msgHash;
    this.circuitPubInput = circuitPubInput;
  }

  serialize(): string {
    return "";
  }
}

export class SimpleHashCircuitPubInput {
  merkleRoot: bigint;
  Tx: bigint;
  Ty: bigint;
  Ux: bigint;
  Uy: bigint;
  serialNo: bigint;

  constructor(
    merkleRoot: bigint,
    Tx: bigint,
    Ty: bigint,
    Ux: bigint,
    Uy: bigint,
    serialNo: bigint
  ) {
    this.merkleRoot = merkleRoot;
    this.Tx = Tx;
    this.Ty = Ty;
    this.Ux = Ux;
    this.Uy = Uy;
    this.serialNo = serialNo;
  }

  serialize(): Uint8Array {
    try {
      const elems = [this.merkleRoot, this.Tx, this.Ty, this.Ux, this.Uy, this.serialNo];

      let serialized = new Uint8Array(32 * elems.length);

      serialized.set(bigIntToBytes(elems[0], 32), 0);
      serialized.set(bigIntToBytes(elems[1], 32), 32);
      serialized.set(bigIntToBytes(elems[2], 32), 64);
      serialized.set(bigIntToBytes(elems[3], 32), 96);
      serialized.set(bigIntToBytes(elems[4], 32), 128);
      serialized.set(bigIntToBytes(elems[5], 32), 160);
      return serialized;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  static deserialize(serialized: Uint8Array): SimpleHashCircuitPubInput {
    try {
      const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
      const Tx = bytesToBigInt(serialized.slice(32, 64));
      const Ty = bytesToBigInt(serialized.slice(64, 96));
      const Ux = bytesToBigInt(serialized.slice(96, 128));
      const Uy = bytesToBigInt(serialized.slice(128, 160));
      const serialNo = bytesToBigInt(serialized.slice(160, 192));

      return new SimpleHashCircuitPubInput(merkleRoot, Tx, Ty, Ux, Uy, serialNo);
    } catch (err) {
      console.error(err);

      throw err;
    }
  }
}

/**
 * Compute the group elements T and U for efficient ecdsa
 * https://personaelabs.org/posts/efficient-ecdsa-1/
 */
export const computeEffEcdsaPubInput = (
  r: bigint,
  v: bigint,
  msgHash: Buffer
): EffECDSAPubInput => {
  const isYOdd = (v - BigInt(27)) % BigInt(2);
  const rPoint = ec.keyFromPublic(
    ec.curve.pointFromX(new BN(r as any), isYOdd).encode("hex"),
    "hex"
  );

  // Get the group element: -(m * r^−1 * G)
  const rInv = new BN(r as any).invm(SECP256K1_N);

  // w = -(r^-1 * msg)
  const w = rInv.mul(new BN(msgHash)).neg().umod(SECP256K1_N);

  // U = -(w * G) = -(r^-1 * msg * G)
  const U = ec.curve.g.mul(w);

  // T = r^-1 * R
  const T = rPoint.getPublic().mul(rInv);

  return {
    Tx: BigInt(T.getX().toString()),
    Ty: BigInt(T.getY().toString()),
    Ux: BigInt(U.getX().toString()),
    Uy: BigInt(U.getY().toString()),
  };
};

export const verifyEffEcdsaPubInput = (pubInput: SimpleHashPublicInput): boolean => {
  const expectedCircuitInput = computeEffEcdsaPubInput(pubInput.r, pubInput.rV, pubInput.msgHash);

  const circuitPubInput = pubInput.circuitPubInput;

  const isValid =
    expectedCircuitInput.Tx === circuitPubInput.Tx &&
    expectedCircuitInput.Ty === circuitPubInput.Ty &&
    expectedCircuitInput.Ux === circuitPubInput.Ux &&
    expectedCircuitInput.Uy === circuitPubInput.Uy;

  return isValid;
};
