export type ProofGenReceiptRaw = Record<string, string | (() => Promise<any>)>;

export function processReceipt(raw: ProofGenReceiptRaw): Record<string, string> {
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "function") {
      console.log(111);
      const a = Promise.resolve(value());
      console.log(222, a);
    }
  }

  return {};
}
