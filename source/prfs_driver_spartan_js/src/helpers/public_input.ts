import { ec as EC } from "elliptic";
import BN from "bn.js";

import { bytesToBigInt, bigIntToBytes } from "./utils";
import { EffECDSAPubInput, EffECDSAPubInput2 } from "../types";

const ec = new EC("secp256k1");

export const SECP256K1_P = new BN(
  "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
  16
);

export const SECP256K1_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16
);

/**
 * Public inputs that are passed into the membership circuit
 * This doesn't include the public values that aren't passed into the circuit
 */
export class CircuitPubInput {
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
    let serialized = new Uint8Array(32 * 5);

    serialized.set(bigIntToBytes(this.merkleRoot, 32), 0);
    serialized.set(bigIntToBytes(this.Tx, 32), 32);
    serialized.set(bigIntToBytes(this.Ty, 32), 64);
    serialized.set(bigIntToBytes(this.Ux, 32), 96);
    serialized.set(bigIntToBytes(this.Uy, 32), 128);
    serialized.set(bigIntToBytes(this.serialNo, 32), 160);

    return serialized;
  }

  static deserialize(serialized: Uint8Array): CircuitPubInput {
    const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
    const Tx = bytesToBigInt(serialized.slice(32, 64));
    const Ty = bytesToBigInt(serialized.slice(64, 96));
    const Ux = bytesToBigInt(serialized.slice(96, 128));
    const Uy = bytesToBigInt(serialized.slice(128, 160));
    const serialNo = bytesToBigInt(serialized.slice(160, 192));

    return new CircuitPubInput(merkleRoot, Tx, Ty, Ux, Uy, serialNo);
  }
}

export class PublicInput {
  r: bigint;
  rV: bigint;
  msgRaw: string;
  msgHash: Buffer;
  circuitPubInput: CircuitPubInput;

  constructor(
    r: bigint,
    v: bigint,
    msgRaw: string,
    msgHash: Buffer,
    circuitPubInput: CircuitPubInput
  ) {
    this.r = r;
    this.rV = v;
    this.msgRaw = msgRaw;
    this.msgHash = msgHash;
    this.circuitPubInput = circuitPubInput;
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

/**
 * Compute the group elements T and U for efficient ecdsa
 * https://personaelabs.org/posts/efficient-ecdsa-1/
 */
export const computeEffEcdsaPubInput2 = (
  r: bigint,
  v: bigint,
  msgHash: Buffer
): EffECDSAPubInput2 => {
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
    // sInv: BigInt(sInv.toString()),
  };
};

/**
 * Verify the public values of the efficient ECDSA circuit
 */
export const verifyEffEcdsaPubInput = (pubInput: PublicInput): boolean => {
  const expectedCircuitInput = computeEffEcdsaPubInput(pubInput.r, pubInput.rV, pubInput.msgHash);

  const circuitPubInput = pubInput.circuitPubInput;

  const isValid =
    expectedCircuitInput.Tx === circuitPubInput.Tx &&
    expectedCircuitInput.Ty === circuitPubInput.Ty &&
    expectedCircuitInput.Ux === circuitPubInput.Ux &&
    expectedCircuitInput.Uy === circuitPubInput.Uy;

  return isValid;
};
