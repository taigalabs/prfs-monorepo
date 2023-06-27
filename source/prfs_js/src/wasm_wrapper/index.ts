import prfsWasm from "../wasm_build/prfs_wasm";

export const initPrfsWasm = async () => {
  console.log("prfs_wasm_embed init()");

  let wasm = await prfsWasm("http://localhost:4010/circuits/prfs_wasm_bg.wasm");

  return wasm;
};
