import { ec as EC } from "elliptic";
import BN from "bn.js";
import JSONBig from "json-bigint";

import { bytesToBigInt, bigIntToBytes } from "@/utils/utils";
import { EffECDSAPubInput } from "@/types";
import { SECP256K1_N } from "@/math/secp256k1";

const ec = new EC("secp256k1");
const JSONbigNative = JSONBig({ useNativeBigInt: true });

export class MembershipProofPublicInput {
  r: bigint;
  rV: bigint;
  msgRaw: string;
  msgHash: Buffer;
  circuitPubInput: MembershipProofCircuitPubInput;

  constructor(
    r: bigint,
    rV: bigint,
    msgRaw: string,
    msgHash: Buffer,
    circuitPubInput: MembershipProofCircuitPubInput
  ) {
    this.r = r;
    this.rV = rV;
    this.msgRaw = msgRaw;
    this.msgHash = msgHash;
    this.circuitPubInput = circuitPubInput;
  }

  serialize(): string {
    const { circuitPubInput, msgHash, r, rV, msgRaw } = this;
    const { merkleRoot, Tx, Ty, Ux, Uy, serialNo } = circuitPubInput;

    // const publicInputSer: MembershipProofPubInputSerObject = {
    //   r: r.toString(),
    //   rV: rV.toString(),
    //   msgHash: [...msgHash],
    //   msgRaw,
    //   circuitPubInput: {
    //     merkleRoot: merkleRoot.toString() + "n",
    //     Tx: Tx.toString() + "n",
    //     Ty: Ty.toString() + "n",
    //     Ux: Ux.toString() + "n",
    //     Uy: Uy.toString() + "n",
    //     serialNo: serialNo.toString() + "n",
    //   },
    // };

    // return JSON.stringify(publicInputSer);

    return JSONbigNative.stringify(this);
  }

  static deserialize(publicInputSer: string): MembershipProofPublicInput {
    // const { r, rV, msgHash, circuitPubInput, msgRaw }: MembershipProofPubInputSerObject =
    //   JSON.parse(publicInputSer);

    // const publicInput = new MembershipProofPublicInput(
    //   BigInt(r),
    //   BigInt(rV),
    //   msgRaw,
    //   Buffer.from(msgHash),
    //   new MembershipProofCircuitPubInput(
    //     BigInt(circuitPubInput.merkleRoot.substring(0, circuitPubInput.merkleRoot.length - 1)),
    //     BigInt(circuitPubInput.Tx.substring(0, circuitPubInput.Tx.length - 1)),
    //     BigInt(circuitPubInput.Ty.substring(0, circuitPubInput.Ty.length - 1)),
    //     BigInt(circuitPubInput.Ux.substring(0, circuitPubInput.Ux.length - 1)),
    //     BigInt(circuitPubInput.Uy.substring(0, circuitPubInput.Uy.length - 1)),
    //     BigInt(circuitPubInput.Uy.substring(0, circuitPubInput.serialNo.length - 1))
    //   )
    // );

    // return publicInput;

    const obj = JSONbigNative.parse(publicInputSer) as MembershipProofPublicInput;
    console.log("deserialize public input ser", obj);

    const circuitPubInputObj = obj.circuitPubInput;

    const circuitPubInput = new MembershipProofCircuitPubInput(
      circuitPubInputObj.merkleRoot,
      circuitPubInputObj.Tx,
      circuitPubInputObj.Ty,
      circuitPubInputObj.Ux,
      circuitPubInputObj.Uy,
      circuitPubInputObj.serialNo
    );

    console.log(221);

    return new MembershipProofPublicInput(
      obj.r,
      obj.rV,
      obj.msgRaw,
      Buffer.from(obj.msgHash),
      circuitPubInput
    );
  }
}

export class MembershipProofCircuitPubInput {
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

  static deserialize(serialized: Uint8Array): MembershipProofCircuitPubInput {
    try {
      const merkleRoot = bytesToBigInt(serialized.slice(0, 32));
      const Tx = bytesToBigInt(serialized.slice(32, 64));
      const Ty = bytesToBigInt(serialized.slice(64, 96));
      const Ux = bytesToBigInt(serialized.slice(96, 128));
      const Uy = bytesToBigInt(serialized.slice(128, 160));
      const serialNo = bytesToBigInt(serialized.slice(160, 192));

      return new MembershipProofCircuitPubInput(merkleRoot, Tx, Ty, Ux, Uy, serialNo);
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
  console.log(1, r, v, msgHash);
  const isYOdd = (v - BigInt(27)) % BigInt(2);
  const rPoint = ec.keyFromPublic(
    ec.curve.pointFromX(new BN(r as any), isYOdd).encode("hex"),
    "hex"
  );

  console.log(2);

  // Get the group element: -(m * r^−1 * G)
  const rInv = new BN(r as any).invm(SECP256K1_N);

  console.log(3);

  // w = -(r^-1 * msg)
  const w = rInv.mul(new BN(msgHash)).neg().umod(SECP256K1_N);

  console.log(4);

  // U = -(w * G) = -(r^-1 * msg * G)
  const U = ec.curve.g.mul(w);

  console.log(5);

  // T = r^-1 * R
  const T = rPoint.getPublic().mul(rInv);

  console.log(6);

  return {
    Tx: BigInt(T.getX().toString()),
    Ty: BigInt(T.getY().toString()),
    Ux: BigInt(U.getX().toString()),
    Uy: BigInt(U.getY().toString()),
  };
};

export const verifyEffEcdsaPubInput = (pubInput: MembershipProofPublicInput): boolean => {
  const expectedCircuitInput = computeEffEcdsaPubInput(pubInput.r, pubInput.rV, pubInput.msgHash);

  const circuitPubInput = pubInput.circuitPubInput;

  const isValid =
    expectedCircuitInput.Tx === circuitPubInput.Tx &&
    expectedCircuitInput.Ty === circuitPubInput.Ty &&
    expectedCircuitInput.Ux === circuitPubInput.Ux &&
    expectedCircuitInput.Uy === circuitPubInput.Uy;

  return isValid;
};

interface MembershipProofPubInputSerObject {
  r: string;
  rV: string;
  msgRaw: string;
  msgHash: number[];
  circuitPubInput: {
    merkleRoot: string;
    Tx: string;
    Ty: string;
    Ux: string;
    Uy: string;
    serialNo: string;
  };
}
