import { ec as EC } from "elliptic";
import BN from "bn.js";

import { bytesToBigInt, bigIntToBytes } from "./utils";
import { EffECDSAPubInput } from "../types";

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
 * This doesn't include the public values that aren't passed into the circuit,
 * which are the group element R and the msgHash.
 */
export class CircuitPubInput {
  merkleRoot: bigint;
  Tx: bigint;
  Ty: bigint;
  Ux: bigint;
  Uy: bigint;

  constructor(
    merkleRoot: bigint,
    Tx: bigint,
    Ty: bigint,
    Ux: bigint,
    Uy: bigint
  ) {
    this.merkleRoot = merkleRoot;
    this.Tx = Tx;
    this.Ty = Ty;
    this.Ux = Ux;
    this.Uy = Uy;
  }

  serialize(): Uint8Array {
    let serialized = new Uint8Array(32 * 5);

    serialized.set(bigIntToBytes(this.merkleRoot, 32), 0);
    serialized.set(bigIntToBytes(this.Tx, 32), 32);
    serialized.set(bigIntToBytes(this.Ty, 32), 64);
    serialized.set(bigIntToBytes(this.Ux, 32), 96);
    serialized.set(bigIntToBytes(this.Uy, 32), 128);

    return serialized;
  }

  static deserialize(serialized: Uint8Array): CircuitPubInput {
    const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
    const Tx = bytesToBigInt(serialized.slice(32, 64));
    const Ty = bytesToBigInt(serialized.slice(64, 96));
    const Ux = bytesToBigInt(serialized.slice(96, 128));
    const Uy = bytesToBigInt(serialized.slice(128, 160));

    return new CircuitPubInput(merkleRoot, Tx, Ty, Ux, Uy);
  }
}

/**
 * Public values of the membership circuit
 */
export class PublicInput {
  r: bigint;
  rV: bigint;
  msgHash: Buffer;
  circuitPubInput: CircuitPubInput;

  constructor(
    r: bigint,
    v: bigint,
    msgHash: Buffer,
    circuitPubInput: CircuitPubInput
  ) {
    this.r = r;
    this.rV = v;
    this.msgHash = msgHash;
    this.circuitPubInput = circuitPubInput;
  }

  serialize(): Uint8Array {
    const circuitPubInput: Uint8Array = this.circuitPubInput.serialize();
    let serialized = new Uint8Array(
      32 + 1 + this.msgHash.byteLength + circuitPubInput.byteLength
    );

    serialized.set(bigIntToBytes(this.r, 32), 0);
    serialized.set(bigIntToBytes(this.rV, 1), 32);
    serialized.set(circuitPubInput, 33);
    serialized.set(this.msgHash, 33 + circuitPubInput.byteLength);

    return serialized;
  }

  static deserialize(serialized: Uint8Array): PublicInput {
    const r = bytesToBigInt(serialized.slice(0, 32));
    const rV = bytesToBigInt(serialized.slice(32, 33));
    const circuitPubInput: CircuitPubInput = CircuitPubInput.deserialize(
      serialized.slice(32 + 1, 32 + 1 + 32 * 5)
    );
    const msgHash = serialized.slice(32 + 1 + 32 * 5);

    return new PublicInput(r, rV, Buffer.from(msgHash), circuitPubInput);
  }
}

/**
 * Compute the group elements T and U for efficient ecdsa
 * https://personaelabs.org/posts/efficient-ecdsa-1/
 */
export const computeEffEcdsaPubInput = (
  r: bigint,
  v: bigint,
  msgHash: Buffer,
  s?: bigint
): EffECDSAPubInput => {
  const isYOdd = (v - BigInt(27)) % BigInt(2);
  const rPoint = ec.keyFromPublic(
    ec.curve.pointFromX(new BN(r as any), isYOdd).encode("hex"),
    "hex"
  );

  // Get the group element: -(m * r^−1 * G)
  const rInv = new BN(r as any).invm(SECP256K1_N);
  console.log("rInv: %s", rInv.toString());
  // mod p: 16422318760896786956730317114097881585994440145463608900482311659390706192225

  // w = -(r^-1 * msg)
  const w = rInv.mul(new BN(msgHash)).neg().umod(SECP256K1_N);
  console.log("w: %s", w.toString());
  // mod p: 57175082242613167108367609388690816721171194946855225214829074442491704002756

  // U = -(w * G) = -(r^-1 * msg * G)
  const U = ec.curve.g.mul(w);

  // T = r^-1 * R
  const T = rPoint.getPublic().mul(rInv);

  if (s !== undefined) {
    let sBn = new BN(s as any);
    console.log("sBn: %s", sBn.toString());

    let sMulT = T.mul(sBn);
    let q = sMulT.add(U);
    let qx = q.getX().toString();
    let qy = q.getY().toString();

    console.log("qx: %s", qx);
    // mod n: 73703d822b3a4bf694d7c29e9200e6e20ba00068a33886cb393a7a908012e1b3
    // mod p: 73baf5ff292e37be428c9dfa5aa9123c4145796c13bbb749d84913efedf5a8c8

    console.log("qy: %s", qy);
    // mod n: fd9467081aa964663cb75e399fa545ba1932dbebae97da9fdd841994df77e69c
    // mod p: c17412d21f92fbd229a1f3beb0aae3e5df2bce71e8b422febc53c755de94e36d
  }

  return {
    Tx: BigInt(T.getX().toString()),
    Ty: BigInt(T.getY().toString()),
    Ux: BigInt(U.getX().toString()),
    Uy: BigInt(U.getY().toString())

    // r2: BigInt(rInv.toString()),
  };
};

/**
 * Compute the group elements T and U for efficient ecdsa
 * https://personaelabs.org/posts/efficient-ecdsa-1/
 */
export const computeEffEcdsaPubInput2 = (
  r: bigint,
  v: bigint,
  msgHash: Buffer,
  s: bigint
): EffECDSAPubInput => {
  console.log("computeEffEcdsaPubInput2()");

  const isYOdd = (v - BigInt(27)) % BigInt(2);
  const rPoint = ec.keyFromPublic(
    ec.curve.pointFromX(new BN(r as any), isYOdd).encode("hex"),
    "hex"
  );

  const m = new BN(msgHash);

  // Get the group element: -(m * r^−1 * G)
  const rInv = new BN(r as any).invm(SECP256K1_N);
  console.log("rInv: %s", rInv.toString());
  // mod p: 16422318760896786956730317114097881585994440145463608900482311659390706192225
  //
  const rInv2 = new BN(r as any).invm(SECP256K1_P);
  console.log("rInv2: %s", rInv2.toString());

  // w = -(r^-1 * msg)
  const w = rInv.mul(new BN(msgHash)).neg().umod(SECP256K1_N);
  console.log("w: %s", w.toString());
  // mod p: 57175082242613167108367609388690816721171194946855225214829074442491704002756

  // U = -(w * G) = -(r^-1 * msg * G)
  const U = ec.curve.g.mul(w);

  // T = r^-1 * R
  const T = rPoint.getPublic().mul(rInv);

  if (s !== undefined) {
    let sBn = new BN(s as any);
    console.log("sBn: %s", sBn.toString());

    let sMulT = T.mul(sBn);
    let q = sMulT.add(U);
    let qx = q.getX().toString();
    let qy = q.getY().toString();

    console.log("qx: %s", qx);
    // mod n: 73703d822b3a4bf694d7c29e9200e6e20ba00068a33886cb393a7a908012e1b3
    // mod p: 73baf5ff292e37be428c9dfa5aa9123c4145796c13bbb749d84913efedf5a8c8

    console.log("qy: %s", qy);
    // mod n: fd9467081aa964663cb75e399fa545ba1932dbebae97da9fdd841994df77e69c
    // mod p: c17412d21f92fbd229a1f3beb0aae3e5df2bce71e8b422febc53c755de94e36d

    const sInv = new BN(s as any).invm(SECP256K1_N);
    const u1 = m.mul(sInv).mod(SECP256K1_N);
    const u2 = new BN(r as any).mul(sInv).mod(SECP256K1_N);
    let p1 = ec.curve.g.mul(u1);
    let p2 = q.mul(u2);
    let p3 = p1.add(p2);
    // let xx = p3.getX();
    console.log("p3.x: %s", p3.getX().toString());
  }

  return {
    Tx: BigInt(T.getX().toString()),
    Ty: BigInt(T.getY().toString()),
    Ux: BigInt(U.getX().toString()),
    Uy: BigInt(U.getY().toString())

    // r2: BigInt(rInv.toString()),
  };
};

/**
 * Verify the public values of the efficient ECDSA circuit
 */
export const verifyEffEcdsaPubInput = (pubInput: PublicInput): boolean => {
  const expectedCircuitInput = computeEffEcdsaPubInput(
    pubInput.r,
    pubInput.rV,
    pubInput.msgHash
  );

  const circuitPubInput = pubInput.circuitPubInput;

  const isValid =
    expectedCircuitInput.Tx === circuitPubInput.Tx &&
    expectedCircuitInput.Ty === circuitPubInput.Ty &&
    expectedCircuitInput.Ux === circuitPubInput.Ux &&
    expectedCircuitInput.Uy === circuitPubInput.Uy;

  return isValid;
};
