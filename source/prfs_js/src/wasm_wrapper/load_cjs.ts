import { PrfsHandlers } from "../types";
import * as Comlink from "comlink";

export async function initWasm(): Promise<void> {
  console.log("init()");


  const prfsWasm = await import("./build/prfs_wasm");
  // await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  // await prfsWasm.initThreadPool(navigator.hardwareConcurrency);

  // console.log(22, prfsWasm);
}
