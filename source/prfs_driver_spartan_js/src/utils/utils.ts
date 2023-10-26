// @ts-ignore
const snarkJs = require("snarkjs");
import { fromRpcSig } from "@ethereumjs/util";
import { DriverEventListener } from "@taigalabs/prfs-driver-interface";

export const snarkJsWitnessGen = async (input: any, wasmFile: string | Uint8Array) => {
  const witness: {
    type: string;
    data?: any;
  } = {
    type: "mem",
  };

  await snarkJs.wtns.calculate(input, wasmFile, witness);
  return witness;
};

export async function fetchAsset(
  url: string,
  eventListener: DriverEventListener,
): Promise<Uint8Array> {
  const response = await fetch(url);

  if (!response?.body) {
    throw new Error("Response does not contain body");
  }

  const reader = response.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    console.log("value", value);

    // chunks.push(value);
  }

  if (!response.ok) {
    throw new Error(`Fetch asset failed, url: ${url}`);
  }

  const circuit = await response.arrayBuffer();
  return new Uint8Array(circuit);
}

export const bytesToBigInt = (bytes: Uint8Array): bigint =>
  BigInt("0x" + Buffer.from(bytes).toString("hex"));

export const bytesLeToBigInt = (bytes: Uint8Array): bigint => {
  const reversed = bytes.reverse();
  return bytesToBigInt(reversed);
};

export const bigIntToBytes = (n: bigint, size: number): Uint8Array => {
  const hex = n.toString(16);
  const hexPadded = hex.padStart(size * 2, "0");
  return Buffer.from(hexPadded, "hex");
};

export const bigIntToLeBytes = (n: bigint, size: number): Uint8Array => {
  const bytes = bigIntToBytes(n, size);
  return bytes.reverse();
};

export const fromSig = (sig: string): { r: bigint; s: bigint; v: bigint } => {
  const { r: _r, s: _s, v } = fromRpcSig(sig);
  const r = BigInt("0x" + _r.toString("hex"));
  const s = BigInt("0x" + _s.toString("hex"));
  return { r, s, v };
};

export function numToUint8Array(num: number): Uint8Array {
  let arr = new Uint8Array(8);

  for (let i = 0; i < 8; i++) {
    arr[i] = num % 256;
    num = Math.floor(num / 256);
  }

  return arr;
}

export function uint8ArrayToNum(arr: Uint8Array): number {
  let num = 0;

  for (let i = 7; i >= 0; i--) {
    num = num * 256 + arr[i];
  }

  return num;
}
