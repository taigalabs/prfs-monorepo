import { MembershipProofCircuitPubInput, MembershipProofPublicInput } from "./public_input";

export function serializePublicInput(publicInput: MembershipProofPublicInput): string {
  const { circuitPubInput, msgHash, r, rV, msgRaw } = publicInput;
  const { merkleRoot, Tx, Ty, Ux, Uy, serialNo } = circuitPubInput;

  const publicInputSer: PublicInputSerObject = {
    r: r.toString(),
    rV: rV.toString(),
    msgHash: [...msgHash],
    msgRaw,
    circuitPubInput: {
      merkleRoot: merkleRoot.toString() + "n",
      Tx: Tx.toString() + "n",
      Ty: Ty.toString() + "n",
      Ux: Ux.toString() + "n",
      Uy: Uy.toString() + "n",
      serialNo: serialNo.toString() + "n",
    },
  };

  return JSON.stringify(publicInputSer);
}

export function deserializePublicInput(publicInputSer: string): MembershipProofPublicInput {
  const { r, rV, msgHash, circuitPubInput, msgRaw }: PublicInputSerObject =
    JSON.parse(publicInputSer);

  const publicInput = new MembershipProofPublicInput(
    BigInt(r),
    BigInt(rV),
    msgRaw,
    Buffer.from(msgHash),
    new MembershipProofCircuitPubInput(
      BigInt(circuitPubInput.merkleRoot.substring(0, circuitPubInput.merkleRoot.length - 1)),
      BigInt(circuitPubInput.Tx.substring(0, circuitPubInput.Tx.length - 1)),
      BigInt(circuitPubInput.Ty.substring(0, circuitPubInput.Ty.length - 1)),
      BigInt(circuitPubInput.Ux.substring(0, circuitPubInput.Ux.length - 1)),
      BigInt(circuitPubInput.Uy.substring(0, circuitPubInput.Uy.length - 1)),
      BigInt(circuitPubInput.Uy.substring(0, circuitPubInput.serialNo.length - 1))
    )
  );

  return publicInput;
}

interface PublicInputSerObject {
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
