import { ProofGenReceiptItems } from "@taigalabs/prfs-id-sdk-web";

export type ProofGenReceiptRaw = Record<
  string,
  ProofGenReceiptItems | (() => Promise<ProofGenReceiptItems>)
>;

export async function processReceipt(
  raw: ProofGenReceiptRaw,
): Promise<Record<string, ProofGenReceiptItems>> {
  const newObj: Record<string, ProofGenReceiptItems> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "function") {
      const v = await Promise.resolve(value());
      newObj[key] = v;
    } else {
      newObj[key] = value;
    }
  }

  return newObj;
}
