import * as prfsWasm from "./build/prfs_wasm";

export const initPrfsWasm = async () => {
  console.log("prfs_wasm_embed init()");

  await prfsWasm.default("http://localhost:4010/circuits/prfs_wasm_bg.wasm");

  return prfsWasm;
};
