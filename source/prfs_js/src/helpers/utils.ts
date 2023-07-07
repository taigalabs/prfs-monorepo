// @ts-ignore
const snarkJs = require("snarkjs");
import { fromRpcSig } from "@ethereumjs/util";
import * as fs from "fs";

export const snarkJsWitnessGen = async (input: any, wasmFile: string) => {
  const witness: {
    type: string;
    data?: any;
  } = {
    type: "mem"
  };

  await snarkJs.wtns.calculate(input, wasmFile, witness);
  return witness;
};

/**
 * Load a circuit from a file or URL
 */
export const loadCircuit = async (pathOrUrl: string): Promise<Uint8Array> => {
  const isWeb = typeof window !== "undefined";
  if (isWeb) {
    return await fetchCircuit(pathOrUrl);
  } else {
    return await readCircuitFromFs(pathOrUrl);
  }
};

const readCircuitFromFs = async (path: string): Promise<Uint8Array> => {
  const bytes = fs.readFileSync(path);
  console.log(33, path, bytes);
  return new Uint8Array(bytes);
};

const fetchCircuit = async (url: string): Promise<Uint8Array> => {
  const response = await fetch(url);

  const circuit = await response.arrayBuffer();

  return new Uint8Array(circuit);
};

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
